define([
    'vue',
    'jquery',
    'util'
], function (vue, $, util) {
    vue.component('bv-date', {
        props: {
            entity: {
                default: function () {
                    return {};
                }
            },

            id: {
                default: ''
            },
            name: {
                default: ''
            },
            // class
            clazz: {
                default: ''
            },
            // 属性定义
            attr: {
                default: function () {
                    return {};
                }
            },
            // 默认值
            defaultValue: {
                default: ''
            },
            // 初始值
            value: {
                default: ''
            },
            // 数据校验
            validate: {
                default: ''
            },
            load: {
                default: ''
            },

            // 标签调用方来源，主要区别在于有没有日历图标
            // filter-table过滤;form-表单
            from: {
                default: 'form'
            },
            /*
             日期格式yyyy-MM-dd hh:mm:ss
             对应yyyy-mm-dd hh:ii:ss
             */
            format: {
                default: 'yyyy-MM-dd'
            },
            // 最小日期值
            startDate: {
                default: ''
            },
            // 最大日期值
            endDate: {
                default: ''
            },
            // 最小日期属性
            triggerStart: {
                default: ''
            },
            // 最大日期属性
            triggerEnd: {
                default: ''
            }
        },
        data: function () {
            return {
                dateFormat: this.format
            }
        },
        created: function() {
            util.initDefault(this);
            util.initId(this);
            // 初始化日期格式
            if (this.format === 'date') {
                this.dateFormat = 'yyyy-MM-dd';
            } else if (this.format === 'datetime') {
                this.dateFormat = 'yyyy-MM-dd hh:mm:ss';
            } else if (this.format === 'time') {
                this.dateFormat = 'hh:mm:ss';
            } else if (!this.format) {
                this.dateFormat = 'yyyy-MM-dd';
            } else if (this.format === 'timestamp') {
                this.dateFormat = 'yyyy-MM-dd hh:mm:ss';
            }
        },
        mounted: function() {
            // 初始化日期选择器
            var $selector;
            if (this.from === 'filter') {
                $selector = $('input', this.$el);
            } else {
                $selector = $(this.$el).addClass('input-group');
            }

            var vm = this;
            // 监听日期插件的值变动及失去焦点事件
            util.datepicker($selector, vm.dateFormat).on('dp.change blur', function(event) {
                // 赋值并进行数据校验
                /// vm.value = $('input', vm.$el).val();
                vm.entity[vm.name] = $('input', vm.$el).val();

                util.validate($('input', vm.$el), true);
            });

            // 如果有最小日期属性定义（此时该标签为最大日期）并且有时间段定义，则进行初始值设定
            if (vm.load && vm.triggerStart) {
                vm.$watch('entity.' + vm.load, function(val, oldVal) {
                    var date = vm.entity[vm.triggerStart];
                    if (val && date) {
                        date = util.date(vm.dateFormat, date, val);
                    }
                    vm.entity[vm.name] = date;
                    $('input', vm.$el).val(date);
                });
            }
            if (vm.triggerStart) {
                // 最小日期对应值
                vm.startDate = vm.entity[vm.triggerStart];
                // 监听最小日期变动
                vm.$watch('entity.' + vm.triggerStart, function (val, oldVal) {
                    vm.startDate = val;
                    if (!val) {
                        // 如果置空，则不限定最小日期
                        $selector.data('DateTimePicker').locale('zh_cn').minDate(false);
                    } else {
                        // 如果最小日期不空，则限定该标签的最小日期
                        $selector.data('DateTimePicker').locale('zh_cn').minDate(val);
                    }
                    // 如果同时定义了时间段并且有值，则设置该标签的值
                    if (vm.load && vm.entity[vm.load]) {
                        var date = util.date(vm.dateFormat, val, vm.entity[vm.load]);
                        vm.entity[vm.name] = date;
                        $('input', vm.$el).val(date);
                    }
                });
            }
            if (vm.triggerEnd) {
                // 最大日期对应值
                vm.endDate = vm.entity[vm.triggerEnd];
                // 监听最大日期变动
                vm.$watch('entity.' + vm.triggerEnd, function (val, oldVal) {
                    vm.endDate = val;
                    if (!val) {
                        // 如果置空，则不限定最大日期
                        $selector.data('DateTimePicker').locale('zh_cn').maxDate(false);
                    } else {
                        // 如果最大日期不空，则限定该标签的最大日期
                        $selector.data('DateTimePicker').locale('zh_cn').maxDate(val);
                    }
                });
            }

            // 如果有日期最小值定义，进行限定
            if (vm.startDate) {
                $selector.data("DateTimePicker").locale('zh_cn').minDate(vm.startDate);
            }
            // 如果有日期最大值定义，进行限定
            if (vm.endDate) {
                $selector.data("DateTimePicker").locale('zh_cn').maxDate(vm.endDate);
            }

            vm.$watch('entity.' + vm.name, function (value, oldValue) {
                // $('input', vm.$el).val(value);
                if (!value) {
                    $selector.data("DateTimePicker").clear();
                }
            });
        },
        /****** 模板定义 ******/
        template: util.template('bv-date')
    });
});