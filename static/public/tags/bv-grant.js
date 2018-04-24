define([
    'vue',
    'jquery',
    'util'
], function (vue, $, util) {
    vue.component('bv-grant', {
        props: {
            entity: {
                default: function () {
                    return {};
                }
            },

            name: {
                default: ''
            },

            left: {
                default: ''
            },
            right: {
                default: ''
            },
            code: {
                default: ''
            },
            desc: {
                default: ''
            },
            label: {
                default: ''
            },
            /// id: '',
            options: {
                default: function () {
                    return [];
                }
            }
        },
        beforeCreate: function () {
            this.stopWatch = false;
        },
        created: function () {
            util.initDefault(this);
        },
        mounted: function() {
            var vm = this;
            $('#' + vm.left, vm.$el).multiselect({
                sort: false,
                afterMoveToRight: function(left, right, options) {
                    vm.setResult(left, right, options);
                },
                afterMoveToLeft: function(left, right, options) {
                    vm.setResult(left, right, options);
                }
            });

            vm.$watch('entity.' + vm.left, function() {
                if (!vm.stopWatch) {
                    var $m = $('#' + vm.left, vm.$el).data('crlcu.multiselect');
                    var v = vm.entity[vm.left];
                    vm.initOptions($m.$left, v);
                    vm.options = vm.options.concat(util.clone(v));
                }
            });
            vm.$watch('entity.' + vm.right, function() {
                if (!vm.stopWatch) {
                    var $m = $('#' + vm.left, vm.$el).data('crlcu.multiselect');
                    var v = vm.entity[vm.right];
                    vm.initOptions($m.$right, v);
                    vm.options = vm.options.concat(util.clone(v));
                }
            });
        },
        methods: {
            initOptions: function($element, options) {
                $('optgroup', $element).remove();
                $('option', $element).remove();
                if (options) {
                    var groups = [];
                    var seprators = [];

                    if (this.label) {
                        var currentGroup = '';
                        var currentSub = [];
                        for (var i=0; i<options.length; i++) {
                            var option = options[i];
                            if (option[this.label]) {
                                if (currentGroup && currentGroup !== option[this.label]) {
                                    groups.push({
                                        label: currentGroup,
                                        options: util.clone(currentSub)
                                    });
                                    currentSub = [];
                                }
                                currentGroup = option[this.label];
                                currentSub.push(option);

                                if (i === options.length - 1) {
                                    groups.push({
                                        label: option[this.label],
                                        options: util.clone(currentSub)
                                    });
                                    currentGroup = '';
                                    currentSub = [];
                                }
                            } else {
                                seprators.push(option);
                            }
                        }
                    } else {
                        seprators = options;
                    }

                    for (var i=0; i<groups.length; i++) {
                        var $optgroup = $('<optgroup label="' + groups[i].label + '"></optgroup>');
                        for (var j=0; j<groups[i].options.length; j++) {
                            $('<option value="' + groups[i].options[j][this.code] + '">' + groups[i].options[j][this.desc] + '</option>').appendTo($optgroup);
                        }
                        $optgroup.appendTo($element);
                    }
                    for (var i=0; i<seprators.length; i++) {
                        $('<option value="' + seprators[i][this.code] + '">' + options[i][this.desc] + '</option>').appendTo($element);
                    }
                }
            },
            setResult: function(left, right, options) {
                this.stopWatch = true;
                var $leftOptions = $('option', left);
                var lefts = [];
                for (var i=0; i<$leftOptions.length; i++) {
                    var code = $($leftOptions[i]).val();

                    var index = util.index(this.options, code, this.code);
                    if (index >= 0) {
                        lefts.push(this.options[index]);
                    }
                }
                this.entity[this.left] = lefts;

                var $rightOptions = $('option', right);
                var rights = [];
                for (var i=0; i<$rightOptions.length; i++) {
                    var code = $($rightOptions[i]).val();

                    var index = util.index(this.options, code, this.code);
                    if (index >= 0) {
                        rights.push(this.options[index]);
                    }
                }
                this.entity[this.right] = rights;
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-grant')
    });
});