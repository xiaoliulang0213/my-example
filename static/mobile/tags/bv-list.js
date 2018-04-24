define([
    'vue',
    'jquery',
    'util',
    'Const'
], function (vue, $, util, Const) {
    vue.component('bv-list', {
        props: {
            title: '',
            // 支持media
            type: {
                default: 'default'
            },
            items: {
                default: function () {
                    return []
                }
            },
            footer: '',
            emptyPrompt: '',
            infinite: '',
            refresh: ''
        },
        data: function() {
            return {
                innerTitle: this.title,
                innerShowLoading: false,
                innerItems: this.items
            };
        },
        beforeCreate: function () {
            this.localLoading = false;
            this.localHasMore = true;
        },
        mounted: function () {
            var vm = this;
            $('.infinite-scroll').on('infinite', function () {
                if (!vm.localHasMore || vm.innerItems.length === 0) {
                    return;
                }
                vm.innerShowLoading = true;
                if (!vm.localLoading) {
                    vm.localLoading = true;
                    setTimeout(function () {
                        if (util.type(vm.infinite) === 'function') {
                            vm.infinite.call(vm);
                        }
                        vm.localLoading = false;
                    }, 500);
                    vm.$emit('on-infinite');
                }
            });
            if (vm.refresh) {
                $(this.$el).on('refresh', function () {
                    if (vm.refresh) {
                        setTimeout(function () {
                            Const.global.f.pullToRefreshDone();
                        }, 1000);
                        vm.$emit('on-refresh');
                    }
                });

                $('.infinite-scroll').on('scroll', function () {
                    if ($(this).scrollTop() > 5) {
                        if (vm.refresh) {
                            vm.refresh = false;
                            Const.global.f.pullToRefreshDone();
                        }
                    } else {
                        if (!vm.refresh) {
                            vm.refresh = true;
                        }
                    }
                });
            }
        },
        methods: {
            init: function () {
                this.innerItems = [];
                this.innerShowLoading = false;
                this.localHasMore = true;
                $(this.$el).closest('.page-content').scrollTop(0);
            },
            load: function (rows, hasMore) {
                if (rows && rows.length > 0) {
                    util.concat(this.innerItems, rows);
                } else {
                    this.innerItems = [];
                }
                if (!hasMore) {
                    this.innerShowLoading = false;
                    this.localHasMore = false;
                }
            },
            complete: function () {
                this.innerShowLoading = false;
                this.localHasMore = false;
            },
            checkButton: function (operate, item) {
                if (operate.show === undefined || operate.show === true) {
                    return true;
                }
                if (util.type(operate.show) === 'function') {
                    return operate.show.call(null, item);
                }
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-list')
    });
});