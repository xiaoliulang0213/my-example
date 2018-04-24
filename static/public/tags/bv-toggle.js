define([
    'vue',
    'jquery',
    'util'
], function (vue, $, util) {
    vue.component('bv-toggle', {
        props: {
            entity: {
                default: function () {
                    return {};
                }
            },

            name: {
                default: ''
            },
            defaultValue: {
                default: ''
            },
            value: {
                default: ''
            },
            choose: {
                default: function () {
                    return ['ON', 'OFF'];
                }
            }
        },
        created: function () {
            util.initDefault(this);
        },
        mounted: function () {
            var vm = this;
            $('input', vm.$el).bootstrapSwitch({
                state: vm.entity[vm.name] === vm.choose[0],
                onText: vm.choose[0],
                offText: vm.choose[1],
                onSwitchChange: function(event, value) {
                    if (value) {
                        vm.entity[vm.name] = vm.choose[0];
                    } else {
                        vm.entity[vm.name] = vm.choose[1];
                    }
                }
            });
        },
        /****** 模板定义 ******/
        template: util.template('bv-toggle')
    });
});