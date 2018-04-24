define([
    'vue',
    'jquery',
    'util',
    'Const'
], function (vue, $, util, Const) {
    vue.component('bv-date', {
        props: {
            entity: '',

            id: '',
            name: '',
            // class
            clazz: '',
            // 属性定义
            attr: '',
            // 数据校验
            validate: '',
            // 默认值
            defaultValue: '',
            // 初始值
            value: '',

            // 目前不支持时间，支持格式为yyyy-MM-dd
            format: {
                default: 'date'
            }
        },
        data: function () {
            return {
                innerEntity: this.entity,
                innerClass: this.clazz,
                innerAttr: this.attr || {},
                innerValue: this.value,
                innerFormat: this.format
            };
        },
        created: function() {
            util.initDefault(this);
            util.initId(this);
            if (this.format === 'date') {
                this.innerFormat = 'yyyy-mm-dd';
            } else if (this.format === 'datetime') {
                this.innerFormat = 'yyyy-mm-dd';
            }
            if (!this.innerFormat) {
                this.innerFormat = 'yyyy-mm-dd';
            } else {
                this.innerFormat.replace('MM', 'mm');
            }
        },
        mounted: function () {
            var vm = this;
            var value = vm.value || vm.defaultValue || vm.innerEntity[vm.name];
            Const.global.f.calendar({
                closeOnSelect: true,
                input: $('input', this.$el),
                value: value ? [value] : '',
                dateFormat: vm.innerFormat,
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
                onChange: function (p, values, displayValues) {
                    vm.innerEntity[vm.name] = util.date(vm.format, values[0]);
                    // $('input', vm.$el).val(vm.innerEntity[vm.name]);
                }
            });
        },
        beforeDestroy: function () {
            // TODO: 需要确认有没有其他影响
            this.innerEntity[this.name] = null;
        },
        /****** 模板定义 ******/
        template: util.template('bv-date')
    });
});