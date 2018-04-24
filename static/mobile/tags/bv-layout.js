define([
    'vue',
    'jquery',
    'util',
    'Const'
], function (vue, $, util, Const) {
    vue.component('bv-layout', {
        props: {
        },
        data: function () {
            return {
                nav: util.hasNav(),
                title: ''
            }
        },
        mounted: function () {
            Const.global.f.infiniteScroll.create($('.infinite-scroll', this.$el));
            this.title = document.title;
        },
        beforeDestroy: function () {
            Const.global.f.detachInfiniteScroll($('.infinite-scroll', this.$el));
        },
        /****** 模板定义 ******/
        template: util.template('bv-layout')
    });
    vue.component('bv-popup', {
        props: {
            title: '',
            close: {
                default: '关闭'
            }
        },
        data: function () {
        },
        /****** 模板定义 ******/
        template: util.template('bv-popup')
    });

    vue.component('bv-accordion', {
        props: {
            entity: '',
            clazz: '',
            // title,content/component
            items: {
                default: function () {
                    return [];
                }
            }
        },
        data: function() {
            return {
                innerClass: this.clazz,
                innerOpenIndex: -1
            };
        },
        /****** 模板定义 ******/
        template: util.template('bv-accordion')
    });

    vue.component('bv-swiper', {
        props: {
            items: []
        },
        watch: {
            items: function (val, oldVal) {
                this.$nextTick(function () {
                    this.init();
                });
            }
        },
        mounted: function () {
            if (this.items.length > 0) {
                this.init();
            }
        },
        methods: {
            init: function () {
                if (this.localSwiper) {
                    this.localSwiper.destroy();
                }
                this.localSwiper = Const.global.f.swiper($(this.$el), {
                    pagination: $('.swiper-pagination', this.$el),
                    autoplay: 2000
                });
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-swiper')
    });

    vue.component('bv-tabs', {
        props: {
            // inline,load
            type: {
                default: 'inline'
            },
            // 支持nav,tab(底部)
            layout: {
                default: 'tab'
            },
            fixed: {
                default: true
            },
            currentIndex: {
                default: 0
            },
            // text,image,target
            tabs: {
                default: function () {
                    return [];
                }
            }
            // slot: name="content"
        },
        data: function() {
            return {
                innerCurrentIndex: this.currentIndex
            }
        },
        watch: {
            innerCurrentIndex: function (val, oldVal) {
                this.localCurrentSelected = this.tabs[this.innerCurrentIndex];

                if (this.type === 'inline') {
                    if (this.layout === 'head') {
                        Const.global.f.showTab($('.bv-tabs-content').eq(val));
                    } else {
                        $('.tabs .tab.active', this.$el).removeClass('active');
                        $('.tabs .tab[id=' + this.localCurrentSelected.target + ']', this.$el).addClass('active');
                    }
                } else if (this.type === 'load') {
                    util.replace($('.tabs .tab', this.$el), util.url(this.localCurrentSelected.target, 'static'));
                }
                this.$emit('on-active', this.innerCurrentIndex);
            }
        },
        beforeCreate: function () {
            this.localCurrentSelected = null;
        },
        mounted: function() {
            this.localCurrentSelected = this.tabs[this.innerCurrentIndex];
            if (this.type === 'load') {
                util.replace($('.tabs .tab', this.$el), util.url(this.localCurrentSelected.target, 'static'));
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-tabs')
    });
    vue.component('bv-tabs-container', {
        template: util.template('bv-tabs-container')
    });
    vue.component('bv-tabs-content', {
        mounted: function () {
            Const.global.f.initPullToRefresh($(this.$el));
            var vm = this;
            $(this.$el).on('show', function () {
                vm.$emit('on-active');
            });
        },
        template: util.template('bv-tabs-content')
    });

    vue.component('bv-article', {
        props: {
            title: '',
            content: '',
            sections: {
                default: function () {
                    return [];
                }
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-article')
    });
});