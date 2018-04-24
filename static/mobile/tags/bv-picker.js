define([
    'vue',
    'jquery',
    'util',
    'Const'
], function (vue, $, util, Const) {
    vue.component('bv-picker', {
        props: {
            entity: '',

            id: '',
            name: '',
            // class
            clazz: '',
            // 属性定义
            attr: '',
            title: '',
            href: '',
            // 默认值
            defaultValue: '',
            // 初始值
            value: '',

            code: {
                default: 'code'
            },
            desc: {
                default: 'desc'
            },
            // 是否缓存数据
            /*cache: {
                default: false
            },*/
            initOption: '',
            choose: {
                default: function () {
                    return [];
                }
            },
            seprator: {
                default: ','
            }
        },
        data: function() {
            return {
                innerEntity: this.entity,
                innerClass: this.clazz,
                innerAttr: this.attr,
                innerValue: this.value,
                innerRowNum: this.choose.length
            };
        },
        beforeCreate: function () {
            this.localValues = [];
            this.localValuesTemp = [];
            this.localIsInit = false;
            this.localPicker = null;
        },
        created: function() {
            util.initDefault(this);
            if (this.innerValue) {
                this.localValues = this.innerValue.split(this.seprator);
            }
            if (this.localValues.length > 0) {
                this.localIsInit = true;
            }
            var diff = this.choose.length-this.localValues.length;
            if (diff > 0) {
                for (var i=0; i<diff; i++) {
                    this.localValues.push('');
                }
            }
        },
        mounted: function () {
            var vm = this;
            var cols = [];
            for (var i=0; i<vm.choose.length; i++) {
                /*if (util.type(vm.choose[i].onInit) === 'function') {
                    vm.choose[i].onInit.call(this, vm.localValues[i], vm.localValues);
                }*/
                var col = vm.trans(i, vm.choose[i].items);
                if (util.type(vm.choose[i].onChange) === 'function') {
                    col.onChange = function (picker, value, displayValue) {
                        var index = $(this.wrapper[0]).closest('.picker-items').children('.picker-items-col').index($(this.wrapper[0]).closest('.picker-items-col'));
                        vm.localValuesTemp[index] = value;
                        var onChange = vm.choose[index].onChange;
                        setTimeout(function () {
                            if (vm.localValuesTemp[index] === value && vm.localValues[index] !== vm.localValuesTemp[index]) {
                                vm.localValues[index] = vm.localValuesTemp[index];
                                /*if (vm.cache && vm.choose[index].cache) {
                                    var cached = vm.choose[index].cache[value];
                                    if (util.isEmpty(cached)) {
                                        onChange.call(vm, value, vm.localValues);
                                    } else {
                                        if (cached.displayValues && cached.displayValues.length > 0) {
                                            vm.localPicker.cols[index + 1].replaceValues(cached.values, cached.displayValues);
                                        } else {
                                            vm.localPicker.cols[index + 1].replaceValues(cached.values);
                                        }
                                        // vm.changeItems(index, cached);
                                    }
                                } else {
                                    onChange.call(vm, value, vm.localValues);
                                }*/
                                onChange.call(vm, value, vm.localValues);
                            }
                        }, 500);
                    };
                    // 初始化
                    if (!util.isEmpty(vm.localValues[i])) {
                        vm.choose[i].onChange.call(vm, vm.localValues[i], vm.localValues);
                    }
                }
                if (vm.choose[i].width) {
                    col.width = vm.choose[i].width;
                } else {
                    col.width = Math.floor(100 / vm.innerRowNum) + '%';
                }
                col.textAlign = vm.choose[i].align || 'center';
                cols.push(col);
            }
            this.localPicker = Const.global.f.picker({
                input: $('input', this.$el),
                toolbarCloseText: '确定',
                momentumRatio: 1,
                rotateEffect: true,
                // updateValuesOnTouchmove: false,
                ///value: this.localIsInit && this.localValues,
                cols: cols,
                onOpen: function () {
                    for (var i=0; i<vm.localValues.length; i++) {
                        vm.localPicker.cols[i].setValue(vm.localValues[i]);
                    }
                },
                onChange: function (picker, values, displayValues) {
                    vm.innerEntity[vm.name] = util.arrayToString(values, vm.seprator, true);
                },
                formatValue: function (picker, values, displayValues) {
                    var result = '';
                    for (var i=0; i<values.length; i++) {
                        if (!util.isEmpty(values[i])) {
                            if (result) {
                                result += ' ';
                            }
                            result += displayValues[i] || values[i];
                        }
                    }
                    return result;
                }
            });
            for (var i=0; i<vm.choose.length; i++) {
                if (util.type(vm.choose[i].onInit) === 'function') {
                    vm.choose[i].onInit.call(this, vm.localValues[i], vm.localValues);
                }
            }

            this.$watch('innerEntity.' + this.name, function (val, oldVal) {
                if (!util.isEmpty(val) && (!this.localPicker || !this.localPicker.initialized)) {
                    this.localValues = val.split(',');
                    for (var i=0; i<this.localValues.length; i++) {
                        if (util.type(this.choose[i].onChange) === 'function') {
                            this.choose[i].onChange.call(vm, this.localValues[i], this.localValues);
                        }
                    }
                }
            });
        },
        beforeDestroy: function () {
            // TODO: 需要确认有没有其他影响
            this.innerEntity[this.name] = null;
        },
        methods: {
            changeItems: function (index, items) {
                if (this.localPicker && this.localPicker.initialized) {
                    var result = this.trans(index, items);
                    if (result.displayValues && result.displayValues.length > 0) {
                        this.localPicker.cols[index].replaceValues(result.values, result.displayValues);
                    } else {
                        this.localPicker.cols[index].replaceValues(result.values);
                    }
                    this.localPicker.cols[index].activeIndex = -1;
                    this.localPicker.cols[index].setValue(result.values[0]);
                    /*if (this.cache && index > 0) {
                        var value = this.localValues[index - 1];
                        if (!util.isEmpty(value)) {
                            if (!this.choose[index - 1].cache) {
                                this.choose[index - 1].cache = {};
                            }
                            this.choose[index - 1].cache[value] = result;
                        }
                    }*/
                } else {
                    var result = this.trans(index, items);
                    this.localPicker.params.cols[index].values = result.values;
                    /*this.localPicker.params.cols[index].value = value || '';
                    this.localPicker.params.cols[index].displayValue = value || '';*/
                    if (result.displayValues && result.displayValues.length > 0) {
                        this.localPicker.params.cols[index].displayValues = result.displayValues;
                    }
                    var show = '';
                    for (var i=0; i<=index; i++) {
                        var currentActive = this.localPicker.params.cols[i].values.indexOf(this.localValues[i]);
                        if (currentActive >= 0 && !util.isEmpty(this.localPicker.params.cols[i].values[currentActive])) {
                            if (show) {
                                show += ' ';
                            }
                            if (this.localPicker.params.cols[i].displayValues && this.localPicker.params.cols[i].displayValues.length > 0) {
                                show += this.localPicker.params.cols[i].displayValues[currentActive];
                            } else {
                                show += this.localPicker.params.cols[i].values[currentActive];
                            }
                        }
                    }
                    $('input', this.$el).val(show);
                    /*if (index === 0) {
                        var result = this.trans(index, items);
                        this.localPicker.params.cols[index].values = result.values;
                        if (result.displayValues && result.displayValues.length > 0) {
                            this.localPicker.params.cols[index].displayValues = result.displayValues;
                        }
                    } else {
                        this.choose[index].items = items;
                    }*/
                }
            },
            trans: function (index, items) {
                var result = {};
                if (util.type(items) === 'function') {
                    items = items.call(null);
                }
                var initOption = this.choose[index].initOption || this.initOption;
                if (!util.isEmpty(initOption)) {
                    items = util.concat(initOption, items);
                }
                if (this.choose[index].code || (items && items.length > 0 && items[0][this.code] !== undefined)) {
                    // 对象
                    var values = [];
                    var displayValues = [];
                    for (var j=0; j<items.length; j++) {
                        values.push(items[j][this.choose[index].code || this.code]);
                        displayValues.push(items[j][this.choose[index].desc || this.desc]);
                    }
                    result.values = values;
                    if (displayValues.length > 0) {
                        result.displayValues = displayValues;
                    }
                } else {
                    // 字符串
                    result.values = items || [];
                }
                return result;
            }
        },
        beforeDestroy: function () {
            // TODO: 需要确认有没有其他影响
            this.innerEntity[this.name] = null;
        },
        /****** 模板定义 ******/
        template: util.template('bv-picker')
    });
});