define([
    'vue',
    'jquery',
    'util',
    'Const'
], function (vue, $, util, Const) {
    vue.component('bv-position', {
        props: {
            // 您当前位置：
            head: {
                default: ''
            },
            titles: {
                default: function () {
                    return [];
                }
            }
        },
        template: util.template('bv-position')
    });
    vue.component('bv-tabs-pane', {
        props: {
            type: {
                default: 'inline'
            },
            index: {
                default: 0
            },
            active: {
                default: false
            },
            // 无实际意义，用于监听变动
            // timestamp: '',
            target: {
                default: ''
            },
            prop: {
                default: ''
            }
        },
        /*watch: {
            timestamp: function (val, oldVal) {
                this.refresh();
            }
        },*/
        methods: {
            refresh: function () {
                Const.vm.current = this;
                var vm = this;
                util.replace($(vm.$el), vm.target, function(response, status, xhr) {
                    util.scroll($(vm.$el));
                    // 设置属性
                    if (vm.prop) {
                        $(vm.$el).data('tab-prop', vm.prop);
                    }
                });
            }
        },
        mounted: function () {
            if (this.type !== 'inline') {
                this.refresh();
            }
            /// util.cache(this);
        },
        beforeDestroy: function () {
            util.destroy(this);
        },
        template: util.template('bv-tabs-pane')
    });
    vue.component('bv-tabs', {
        props: {
            clazz: {
                default: ''
            },
            // 属性定义
            attr: {
                default: function () {
                    return {};
                }
            },
            // 可设置为menu-表示系统菜单，inline-标签页body都在当前页面中
            type: {
                default: 'inline'
            },
            // 支持vertical-垂直显示
            layout: {
                default: 'default'
            },
            // 标签页不可关闭
            sticky: {
                default: false
            },
            // 是否固定标题
            fixed: {
                default: true
            },
            // 切换方式 click hover
            trigger: {
                default: 'click'
            },
            pagination: {
                default: true
            },
            // 初始标签页
            tabs: {
                default: function () {
                    return [];
                }
            },
            // 返回按钮
            returnUrl: {
                default: ''
            }
        },
        data: function() {
            return {
                // 是否翻页
                overflow: false,
                // 当前页
                currentIndex: 0,
                // changed: false,
                // 标签页左边距，用于翻页
                marginLeft: 0
            };
        },
        watch: {
            currentIndex: function (val, oldVal) {
                if (this.currentIndex >= 0) {
                    this.$emit('on-active', this, this.currentIndex);

                    this.currentSelected = this.tabs[this.currentIndex];
                    this.calc();

                    if (this.type === 'menu') {
                        // tab用，内部用
                        /*positionTitles: function() {
                            var titles = $('.bv-content[data-active="true"]').data('tab-prop') && $('.bv-content[data-active="true"]').data('tab-prop').titles;
                            if (this.type(titles) === 'string') {
                                return new Array({
                                    text: titles
                                });
                            }
                            return titles;
                        },*/
                        var titles = this.currentSelected.prop.titles; ///util.positionTitles();
                        if (util.type(titles) === 'string') {
                            titles = new Array({
                                text: titles
                            });
                        }
                        if (titles) {
                            Const.vm.root.position.titles = titles;
                        }
                        // 菜单
                        var treeNode = Const.global.menuTree.$tree.getNodeByParam('id', this.currentSelected.menuId);
                        util.selectNode(treeNode);
                        // 调试信息
                        util.debug('菜单地址:', treeNode && treeNode.entity && treeNode.entity[Const.menu.url]);
                    } else if (this.type === 'inline') {
                        $('.tab-content .tab-pane.active', this.$el).removeClass('active');
                        $('.tab-content .tab-pane[id=' + (this.currentSelected.id || this.currentSelected.target) + ']', this.$el).addClass('active');
                        util.scroll($('.tab-content', this.$el));
                    }
                }
            }
        },
        beforeMount: function () {
            if (this.tabs.length === 0) {
                this.currentIndex = -1;
            }
        },
        beforeCreate: function () {
            // 容器宽度
            this.width = 0;
            // 去掉左右翻页后的容器宽度
            this.containerWidth = 0;
            // 标签页标题宽度和
            this.navWidth = 0;
            // 当前标签页左侧标题宽度和
            this.leftTabsWidth = 0;
            // 最后一个标签页标题宽度
            this.lastTabsWidth = 0;
            // 当前选中标签页配置
            this.currentSelected = null;
            // 当前选中标签页元素
            this.$currentElement = null;
        },
        mounted: function() {
            if (!this.clazz) {
                this.clazz = 'bv-tabs-' + this.type;
            } else {
                this.clazz += ' bv-tabs-' + this.type;
            }
            if (this.fixed) {
                this.clazz += ' bv-tabs-fixed';
            }

            this.$emit('on-init', this);
            this.width = $(this.$el).outerWidth(true);

            if (this.type !== 'inline') {
                /// this.refresh();
                // util.loadTab(this, this.tabs[0]);
                this.calc();
                /*this.$watch('changed', function() {
                    this.calc();
                });*/

                var vm = this;
                $(window).resize(function () {
                    vm.width = $(vm.$el).outerWidth(true);
                    vm.calc();
                });
            } else {
                this.$nextTick(function () {
                    if (this.currentIndex >= 0 && this.tabs && this.currentIndex < this.tabs.length) {
                        this._trigger(undefined, this.currentIndex);
                        // util.scroll($('.tab-content', this.$el));
                    }
                });
                /*if (this.currentIndex >= 0 && this.tabs && this.tabs.length > this.currentIndex) {
                    this.currentSelected = this.tabs[this.currentIndex];
                    $('.tab-content .tab-pane.active', this.$el).removeClass('active');
                    $('.tab-content .tab-pane[id=' + (this.currentSelected.id || this.currentSelected.target) + ']', this.$el).addClass('active');
                    util.scroll($('.tab-content', this.$el));
                }*/
            }
        },
        methods: {
            // 计算标签页宽度
            // 调用来源：初始加载，切换标签页，窗口大小改变
            calc: function() {
                if (!util.isTrue(this.pagination)) {
                    return;
                }
                var vm = this;
                vm.$nextTick(function () {
                    // 当前选中标签页对应li
                    vm.$currentElement = $('[data-target=' + vm.tabs[vm.currentIndex].id + ']', vm.$el);
                    vm.navWidth = 0;
                    vm.leftTabsWidth = 0;
                    for (var i=0; i<vm.tabs.length; i++) {
                        var w = $('[data-target=' + vm.tabs[i].id + ']', vm.$el).outerWidth(true);
                        vm.navWidth += w;
                        if (i < vm.currentIndex) {
                            vm.leftTabsWidth += w;
                        }
                        if (i === vm.tabs.length - 1) {
                            vm.lastTabsWidth = w;
                        }
                    }
                    vm.overflow = vm.navWidth > vm.width;

                    if (vm.overflow) {
                        vm.containerWidth = vm.width - 60;

                        var currentElementLeft = vm.$currentElement.position().left;
                        var currentElementWidth = util.width(vm.$currentElement);
                        var diff = vm.leftTabsWidth + currentElementWidth - vm.containerWidth;

                        if (diff > -1 * vm.marginLeft) {
                            vm.marginLeft = -1 * diff + 30;
                        } else if (currentElementLeft < 0) {
                            vm.marginLeft = -1 * vm.leftTabsWidth + 30;
                        }

                    } else {
                        vm.marginLeft = 0;
                        vm.containerWidth = vm.width;
                    }
                });
            },
            prev: function() {
                var marginLeft = this.marginLeft + this.containerWidth;
                if (marginLeft > 0) {
                    marginLeft = 30;
                }
                this.marginLeft = marginLeft;
                /*if (this.marginLeft > this.containerWidth - 80) {
                    this.marginLeft -= this.containerWidth - 80;
                } else {
                    this.marginLeft = 0;
                }*/
            },
            next: function() {
                var marginLeft = this.marginLeft - this.containerWidth;
                if (-1 * marginLeft > this.navWidth - this.containerWidth + this.lastTabsWidth) {
                    marginLeft = this.containerWidth - this.navWidth + 30;
                }
                this.marginLeft = marginLeft;
                /*if (this.marginLeft + this.containerWidth * 2 - 80 >= this.navWidth) {
                    this.marginLeft = this.navWidth - this.containerWidth;
                } else {
                    this.marginLeft += this.containerWidth - 80;
                }*/
            },
            _trigger: function(event, index) {
                if (!event || index !== this.currentIndex) {
                    if (this.type === 'inline') {
                        for (var i=0; i<this.$children.length; i++) {
                            if (this.$children[i].index === index) {
                                this.$children[i].active = true;
                            } else {
                                this.$children[i].active = false;
                            }
                        }
                    }
                    this.currentIndex = index;
                    // 触发resize重设table宽度
                    var click = this.tabs[this.currentIndex].click;
                    if (click && click === 'refresh') {
                        this.refresh();
                        // util.loadTab(this.tabs, this.tabs[this.currentIndex]);
                    }
                    this.$nextTick(function () {
                        // util.resize();
                        util.scroll($('.tab-content', this.$el));
                        //util.scroll($(this.tabs[this.currentIndex].$el));
                    });
                }
            },
            refresh: function (index) {
                if (util.type(index) === 'undefined') {
                    this.$children[this.currentIndex].refresh();
                    // this.tabs[this.currentIndex].timestamp = new Date().getTime();
                } else {
                    this.$children[index].refresh();
                    // this.tabs[index].timestamp = new Date().getTime();
                }
                /// util.resize();
            },
            remove: function ($event, index) {
                // var $remove = $('#' + this.tabs[index].id, this.$el);
                // util.remove($remove);
                var child = this.$children[index];
                this.tabs.splice(index, 1);

                if (this.currentIndex >= index) {
                    this.currentIndex--;
                } else {
                    this.calc();
                }
                /// this.currentSelected = this.tabs[this.currentIndex];
                /// this.calc();
            },
            removeAll: function () {
                /// this.currentSelected = this.tabs[this.currentIndex];
                for (var i=this.tabs.length-1; i>=0; i--) {
                    var tab = this.tabs[i];
                    if (!this.sticky && !tab.sticky) {
                        /*var $remove = $('#' + tab.id, this.$element);
                        $('*', $remove).remove()
                        $remove.remove();*/
                        this.tabs.splice(i, 1);
                    }
                }
                this.currentIndex = 0;
            },
            doReturn: function() {
                if (this.returnUrl) {
                    util.redirect(this.returnUrl, 'body');
                }
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-tabs')
    });

    vue.component('bv-wizard', {
        props: {
            type: {
                default: ''
            },
            steps: {
                default: function () {
                    return [];
                }
            },
            operates: {
                default: function () {
                    return [];
                }
            }
        },
        data: function () {
            return {
                currentIndex: 0
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                if (this.currentIndex < this.steps.length) {
                    this.active(undefined, this.currentIndex);
                    /*for (var i=0; i<this.$children.length; i++) {
                        if (this.$children[i].index === this.currentIndex) {
                            this.$children[i].active = true;
                            break;
                        }
                    }*/
                }
                util.tooltip($(this.$el), 'data-title', undefined, {
                    placement: 'bottom',
                    container: 'body'
                });
            });
        },
        methods: {
            active: function (event, index, enable) {
                if (index === 'prev') {
                    if (this.currentIndex > 0) {
                        index = this.currentIndex - 1;
                    } else {
                        index = 0;
                    }
                } else if (index === 'next') {
                    if (this.currentIndex < this.steps.length - 1) {
                        index = this.currentIndex + 1;
                    } else {
                        index = this.steps.length + 1;
                    }
                }
                //  && !this.steps[index].disabled
                if (index < this.steps.length && (!event || this.currentIndex !== index)) {
                    this.currentIndex = index;
                    //var foundIndex = 0;
                    //var resetTitle = false;
                    if (this.type && this.type === 'redirect') {
                        if (enable && this.steps[index].disabled) {
                            this.steps[index].disabled = false;
                        }
                    } else {
                        for (var i=0; i<this.$children.length; i++) {
                            if (this.$children[i].index === index) {
                                this.$children[i].active = true;
                                if (enable && this.steps[i].disabled) {
                                    /*resetTitle = (this.steps[i].disabled !== true);
                                    if (resetTitle) {
                                        util.tooltip($('[data-index=' + i + ']', this.$el), undefined, true);
                                    }*/
                                    this.steps[i].disabled = false;
                                    //foundIndex = i;
                                    /*if (resetTitle) {
                                        this.$nextTick(function () {
                                            util.tooltip($('[data-index=' + foundIndex + ']', this.$el), undefined, true, {
                                                placement: 'bottom',
                                                container: 'body'
                                            });
                                        });
                                    }*/
                                }
                            } else {
                                this.$children[i].active = false;
                            }
                        }
                    }
                }
            },
            enable: function (index) {
                if (index < this.steps.length) {
                    for (var i=0; i<this.$children.length; i++) {
                        if (this.$children[i].index === index) {
                            this.$children[i].disabled = false;
                            break;
                        }
                    }
                }
            },
            disable: function (index) {
                if (index < this.steps.length) {
                    for (var i=0; i<this.$children.length; i++) {
                        if (this.$children[i].index === index) {
                            this.$children[i].disabled = true;
                            break;
                        }
                    }
                }
            },
            checkOperateVisible: function (operate) {
                if (operate && operate.preset) {
                    if (operate.preset === 'prev') {
                        return this.currentIndex > 0;
                    } else if (operate.preset === 'next') {
                        return this.currentIndex < this.steps.length - 1;
                    } else if (operate.preset === 'submit') {
                        return this.currentIndex === this.steps.length - 1;
                    }
                }
            },
            _click: function (event, operate) {
                if (operate && operate.preset) {
                    var $childVm;
                    for (var i=0; i<this.$children.length; i++) {
                        if (this.$children[i].index === this.currentIndex) {
                            $childVm = this.$children[i];
                            break;
                        }
                    }
                    if (operate.validate) {
                        if ($childVm && !util.validate($($childVm.$el))) {
                            return;
                        }
                    }
                    if (operate.preset === 'prev') {
                        if (operate.click && util.type(operate.click) === 'function') {
                            var vm = this;
                            operate.click.call(null, $childVm.entity, function () {
                                vm.active(event, 'prev', operate.enable);
                            });
                        } else {
                            this.active(event, 'prev', operate.enable);
                        }
                    } else if (operate.preset === 'next') {
                        if (operate.click && util.type(operate.click) === 'function') {
                            var vm = this;
                            operate.click.call(null, $childVm.entity, function () {
                                vm.active(event, 'next', operate.enable);
                            });
                        } else {
                            this.active(event, 'next', operate.enable);
                        }
                    } else if (operate.preset === 'submit') {
                        console.log($childVm)
                        if (operate.click && util.type(operate.click) === 'function') {
                            operate.click.call(null, $childVm.entity);
                        }
                    }
                }
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-wizard')
    });
    vue.component('bv-wizard-content', {
        props: {
            entity: {
                default: function () {
                    return {};
                }
            },
            index: {
                default: ''
            },
            active: {
                default: false
            },
            disabled: {
                default: false
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-wizard-content')
    });

    vue.component('bv-modal', {
        props: {
            size: {
                default: ''
            },
            clazz: {
                default: ''
            },
            title: {
                default: ''
            },
            // 可以设置为div，此时内部不会自动创建form，需要在外层嵌套form
            container: {
                default: 'form'
            }
        },
        created: function () {
            if (this.size) {
                this.clazz = 'modal-' + this.size;
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-modal')
    });

    vue.component('bv-panel', {
        props: {
            title: {
                default: ''
            },
            // 是否有更多，可以为字符串，也可以为function
            // 格式为：{text: '', click: ''}
            more: {
                default: ''
            }
        },
        methods: {
        },
        mounted: function () {
        },
        template: util.template('bv-panel')
    });

    vue.component('bv-search', {
        props: {
            placeholder: {
                default: ''
            },
            click: {
                default: ''
            }
        },
        data: function () {
            return {
                value: ''
            };
        },
        template: util.template('bv-search')
    });

    vue.component('bv-media', {
        props: {
            clazz: {
                default: ''
            },
            // url: '',
            // width: ''
            image: {
                default: function () {
                    return {};
                }
            },
            title: {
                default: ''
            },
            content: {
                default: ''
            }
        },
        data: function () {
            return {
                image: {}
            };
        },
        methods: {
        },
        mounted: function () {
            if (util.type(this.image) === 'string') {
                this.image = {url: this.image};
            }
        },
        template: util.template('bv-media')
    });

    vue.component('bv-pager', {
        props: {
            type: {
                default: 'normal'
            },
            currentPage: {
                default: ''
            },
            totalPage: {
                default: ''
            },
            rowCount: {
                default: ''
            },
            limit: {
                default: ''
            },
            pageShow: {
                default: ''
            }
        },
        methods: {
            setLimit: function(limit) {
                this.$emit('on-limit', limit);
            },
            setPage: function(page) {
                this.$emit('on-page', page);
            }
        },
        template: util.template('bv-pager')
    });

    vue.component('bv-pager-normal', {
        props: {
            currentPage: {
                default: ''
            },
            totalPage: {
                default: ''
            },
            rowCount: {
                default: ''
            },
            limit: {
                default: ''
            }
        },
        methods: {
            jumpTo: function(page, event) {
                if (event) {
                    $(event.target).tooltip('hide');
                }
                this.$emit('on-page', page);
            },
            pressOnLimit: function(event) {
                if (event.which === 13) {
                    event.preventDefault();
                    $(event.target).tooltip('hide');
                    this.setLimit(event);
                }
            },
            setLimit: function(event) {
                var $target = $('.bv-page-limit input', this.$el);
                var limit = $target.val();
                if (!util.check(limit, /^\+?[1-9][0-9]*$/)) {
                    limit = 10;
                    $target.val(limit);
                }
                if (util.toNumber(limit) > 500) {
                    limit = 500;
                } else {
                    limit = util.toNumber(limit);
                }
                this.$emit('on-limit', limit);
            },
            pressOnPage: function(event) {
                if (event.which === 13) {
                    event.preventDefault();
                    $(event.target).tooltip('hide');
                    this.setPage(event);
                }
            },
            setPage: function(event) {
                var $target = $('.bv-page-current input', this.$el);
                var page = $target.val();
                if (!util.check(page, /^\+?[1-9][0-9]*$/)) {
                    page = 1;
                    $target.val(page);
                }
                page = util.toNumber(page);
                if (page > this.totalPage) {
                    page = this.totalPage;
                    $target.val(page);
                }
                this.$emit('on-page', page);
            }
        },
        template: util.template('bv-pager-normal')
    });
    vue.component('bv-pager-more', {
        props: {
            currentPage: {
                default: ''
            },
            totalPage: {
                default: ''
            },
            rowCount: {
                default: ''
            },
            // 显示页码数 值必须 > 5
            pageShow: {
                default: ''
            },
            limit: {
                default: ''
            }
        },
        computed: {
            pageStartComputed: function () {
                if (this.totalPage > this.pageShow && this.currentPage > this.prevShowComputed + 2) {
                    /*if (this.currentPage === this.totalPage) {
                        return this.currentPage - 5;
                    } else if (this.currentPage === this.totalPage - 1) {
                        return this.currentPage - 4;
                    }*/
                    if (this.currentPage >= this.totalPage - this.nextShowComputed) {
                        return this.totalPage - this.pageShow + 1;
                    }
                    return this.currentPage - this.prevShowComputed;
                }
                return 2;
            },
            pageShowComputed: function () {
                var show = Math.min(this.totalPage, this.pageShow);
                if (show > 2) {
                    if (!this.prevPointComputed || !this.nextPointComputed) {
                        return show - 1;
                    }
                    return show - 2;
                }
                return 0;
            },
            // 当前页前显示数量
            prevShowComputed: function () {
                if (this.pageShow % 2 === 0) {
                    return (this.pageShow - 2) / 2 - 1;
                }
                return (this.pageShow - 3) / 2;
            },
            // 当前页后显示数量
            nextShowComputed: function () {
                return this.pageShow - 2 - this.prevShowComputed;
            },
            prevPointComputed: function () {
                return this.totalPage > this.pageShow && this.currentPage > this.prevShowComputed + 2;
            },
            nextPointComputed: function () {
                return this.totalPage > this.pageShow && this.currentPage < this.totalPage - this.nextShowComputed - 1;
            }
        },
        created: function () {
            this.pageShow = Math.min(Math.max(this.pageShow, 5), 20);
        },
        methods: {
            jumpTo: function(page, event) {
                if (event) {
                    $(event.target).tooltip('hide');
                }
                this.$emit('on-page', page);
            }
        },
        template: util.template('bv-pager-more')
    });

    /* 轮播 */
    vue.component('bv-carousel', {
        props: {
            id: {
                default: ''
            },
            clazz: {
                default: ''
            },
            // url
            // title
            width: {
                default: '100%'
            },
            height: {
                default: ''
            },
            vertical: {
                default: false
            },
            items: {
                default: function () {
                    return [];
                }
            },
            active: {
                default: 0
            }
        },
        methods: {
        },
        created: function () {
            if (!this.id) {
                this.id = util.guid();
            }
        },
        mounted: function () {
            $(this.$el).carousel();
        },
        beforeDestroy: function () {
            $(this.$el).carousel('pause');
        },
        template: util.template('bv-carousel')
    });

    vue.component('bv-list', {
        props: {
            inline: {
                default: true
            },
            // default media-带媒体对象
            type: {
                default: 'default'
            },
            // 媒体部分默认显示日期
            mediaType: {
                default: 'date'
            },
            // 是否分页
            pagination: {
                default: true
            },
            // 显示页码数 值必须 > 5
            pageShow: {
                default: 7
            },
            // 每页显示数据条数
            limit: {
                default: 10
            },
            items: {
                default: function () {
                    return [];
                }
            }
        },
        data: function () {
            return {
                pager: {
                    limit: this.limit,
                    // 当前页码
                    currentPage: 1,
                    // 总页数
                    totalPage: 20,
                    // 总条数
                    rowCount: 0,
                    pageShow: this.pageShow
                },
                // 当前页开始序号
                offset: 0
            }
        },
        template: util.template('bv-list')
    });
});