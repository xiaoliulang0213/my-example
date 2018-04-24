define([
    'vue',
    'jquery',
    'util',
    'Const'
], function (vue, $, util, Const) {
    vue.component('bv-tree', {
        props: {
            entity: {
                default: function () {
                    return {};
                }
            },
            name: {
                default: ''
            },

            id: {
                default: ''
            },
            clazz: {
                default: ''
            },
            // 属性定义
            attr: {
                default: function () {
                    return {};
                }
            },
            defaultValue: {
                default: ''
            },
            // 是否显示图标
            icon: {
                default: true
            },
            // 是否显示连接线
            line: {
                default: true
            },
            // 是否显示title
            title: {
                default: false
            },
            // 是否允许选择
            // 支持checkbox、radio
            check: {
                default: false
            },
            // 默认为空，可设置为s-表示父节点影响子节点，但子节点不影响父节点
            checkType: {
                default: ''
            },
            // 是否保持展开单一路径
            singlePath: {
                default: false
            },
            // 类型，支持：menu-菜单select-下拉
            type: '',
            // 初始化数据url
            url: {
                default: Const.url.tree.query
            },
            data: {
                default: function () {
                    return {};
                }
            },
            // 初始化method
            /*method: {
                default: 'post'
            },*/
            entityName: {
                default: ''
            },
            initParamList: {
                default: ''
            },
            orders: {
                default: ''
            },
            orderList: {
                default: ''
            },
            initEntity: {
                default: ''
            },
            // 根节点
            rootNode: {
                default: ''
            },
            // 来源 filter-精确查询
            from: {
                default: ''
            },

            // 函数，初始化完成调用
            /// onInit: '',
            // 函数，组装数据
            pack: {
                default: ''
            },
            // 下拉菜单时显示
            show: {
                default: ''
            }
            // 函数，展开前
            /// beforeExpand: '',
            // 展开时
            /// onExpand: '',
            // 函数，点击触发
            /// onClick: ''
        },
        data: function () {
            return {
                showSelect: false,
                resultName: this.name + 'Result',
                currentNode: null
            };
        },
        beforeCreated: function () {
            /// this.nodes = [];
            // 树的jquery对象
            this.$tree = '';
            this.config = '';
        },
        created: function() {
            if (this.id) {
                this.attr.id = this.id;
            } else {
                this.attr.id = util.guid();
            }
            // this.orderList = util.transOrder(this.orderList, this.orders);
        },
        mounted: function() {
            this.init();
            if (util.isEmpty(this.entity[this.name]) && !util.isEmpty(this.defaultValue)) {
                this.entity[this.name] = this.defaultValue;
            }
            util.transOrder(this.orderList, this.orders);

            if (this.type === 'select') {
                // $('ul', this.$el).width($('.tree-choose', this.$el).width() - 12);
                $('ul', this.$el).width(($('.tree-choose', this.$el).width() - 12)<=0 ? 280:($('.tree-choose', this.$el).width() - 12));
                var vm = this;
                $(document).on('click', function (event) {
                    if ($(event.target).is('.tree-choose,.ztree') || $(event.target).closest('.tree-choose,.ztree').length === 1) {
                        if ($(event.target).closest('.bv-tree').is($(vm.$el))) {
                            vm.showSelect = true;
                        } else {
                            vm.showSelect = false;
                        }
                    } else {
                        vm.showSelect = false;
                    }
                });
            }
        },
        methods: {
            init: function() {
                var callback = {};
                /*if (util.type(this.beforeExpand) === 'function') {
                    callback.beforeExpand = this.beforeExpand;
                }
                if (util.type(this.onExpand) === 'function') {
                    callback.onExpand = this.onExpand;
                }
                if (util.type(this.onClick) === 'function') {
                    callback.onClick = this.onClick;
                }*/
                var vm = this;
                callback.beforeExpand = function (treeId, treeNode) {
                    /*var menuTree = $.fn.zTree.getZTreeObj(treeId);
                    // 展开的所有节点，这是从父节点开始查找（也可以全文查找）
                    var expandedNodes = menuTree.getNodesByParam('open', true, treeNode.getParentNode());

                    for (var i = expandedNodes.length - 1; i >= 0; i--) {
                        var node = expandedNodes[i];
                        if (treeNode.id != node.id && node.level == treeNode.level && node.level !== 0) {
                            menuTree.expandNode(node, false);
                        }
                    }*/
                    if (vm.singlePath) {
                        util.singlePath(vm, treeNode);
                    }
                    vm.$emit('before-expand', treeId, treeNode);
                };
                callback.onExpand = function (event, treeId, treeNode) {
                    vm.currentNode = treeNode;
                    if (vm.type !== 'menu') {
                        util.scroll();
                    }
                    vm.$emit('on-expand');
                };
                callback.onCollapse = function (event, treeId, treeNode) {
                    if (vm.type !== 'menu') {
                        util.scroll();
                    }
                    vm.$emit('on-expand');
                };
                callback.onClick = function (e, treeId, treeNode) {
                    if (vm.type === 'menu' && treeNode.isParent) {
                        util.expand(treeId, treeNode);
                    }
                    vm.$emit('on-click', e, treeId, treeNode);
                };
                if (vm.title) {
                    callback.onNodeCreated = function (event, treeId, treeNode) {
                        // $('#' + treeNode.tId + '_a').attr('data-placement', 'auto right').attr('data-container', 'body');
                        util.tooltip($('#' + treeNode.tId + '_a'), 'title', true, {
                            placement: 'right',
                            container: 'body'
                        });
                    };
                }
                if (this.check) {
                    var vm = this;
                    callback.onCheck = function(event, treeId, treeNode) {
                        var checked = [];
                        var checkedKey = [];
                        var checkedNodes = vm.$tree.getCheckedNodes();
                        if (checkedNodes && checkedNodes.length > 0) {
                            for (var i=0; i<checkedNodes.length; i++) {
                                checkedKey.push(checkedNodes[i].id);
                                if (checkedNodes[i].entity) {
                                    checked = checked.concat(checkedNodes[i].entity);
                                }
                            }
                        }
                        if (vm.name) {
                            if (vm.type === 'select') {
                                vm.entity[vm.name] = checkedKey;
                            } else {
                                vm.entity[vm.name] = checked;
                            }
                        }
                        if (util.type(vm.show) === 'function') {
                            if (vm.type === 'select') {
                                var showText = '';
                                for (var i=0; i<checked.length; i++) {
                                    var result = vm.show.call(null, checked[i]);
                                    if (result) {
                                        if (showText) {
                                            showText += ',';
                                        }
                                        showText += result;
                                    }
                                }
                                vm.$set(vm.entity, vm.resultName, showText);
                            }
                        }
                    };
                }
                this.config = {
                    view: {
                        showIcon: this.icon,
                        showLine: this.line,
                        showTitle: this.title,
                        selectedMulti: !this.check,
                        dblClickExpand: false
                    },
                    check: {
                        enable: util.isTrue(this.check),
                        chkStyle: (this.check === false || this.check === true) ? 'checkbox' : this.check,
                        chkboxType: this.checkType ? {Y: this.checkType, N: this.checkType} : {Y: 'ps', N: 'ps'},
                        radioType: this.check === 'radio' ? 'all' : 'level'
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: callback
                };
                var data = vm.data;
                /*if (vm.appCode) {
                    data.appCode = vm.appCode;
                }*/
                if (vm.entityName) {
                    data.entityName = vm.entityName;
                }
                if (!util.isEmpty(vm.initParamList)) {
                    data.paramList = vm.initParamList;
                }
                if (!util.isEmpty(vm.initEntity)) {
                    data = util.mix(data, vm.initEntity);
                }
                if (vm.orderList && vm.orderList.length > 0) {
                    data.orderList = vm.orderList;
                }
                if (util.type(vm.url) === 'string') {
                    if (util.endsWith(vm.url, ".json")) {
                        $.getJSON(vm.url, function(res) {
                            vm.dataInit(res);
                        });
                    } else {
                        util.request({
                            type: 'post',
                            url: vm.url,
                            //appCode: vm.appCode,
                            data: data,
                            success: function(res) {
                                if (util.data(res)) {
                                    vm.dataInit(util.data(res));
                                }
                            }
                        });
                    }
                } else if (util.type(vm.url) === 'array') {
                    vm.dataInit(vm.url);
                }
            },
            dataInit: function(data) {
                if (data) {
                    var nodes = [];
                    if (this.rootNode) {
                        nodes.push(this.rootNode);
                    }
                    for (var i=0; i<data.length; i++) {
                        nodes.push(this.pack.call(null, data[i]));
                    }
                    if (!util.isEmpty(this.entity[this.name])) {
                        var showText = '';
                        for (var i=0; i<nodes.length; i++) {
                            if (this.entity[this.name].indexOf(nodes[i].id) >= 0 && nodes[i].entity) {
                                var result = this.show.call(null, nodes[i].entity);
                                if (result) {
                                    if (showText) {
                                        showText += ',';
                                    }
                                    showText += result;
                                }
                                nodes[i].checked = true;
                            }
                        }
                        this.$set(this.entity, this.resultName, showText);
                    }
                    this.$tree = $.fn.zTree.init($('.ztree', this.$el), this.config, nodes);

                    /*if (this.title) {
                        util.tooltip($(this.$el), undefined, 'auto right', 'body');
                        util.tooltip($(this.$el), 'data-title', 'auto right', 'body');
                    }*/

                    this.$emit('on-init', this);
                    /*if (util.type(this.onInit) === 'function') {
                        this.onInit.call(null, this);
                    }*/
                }
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-tree')
    });
});