define([
    'vue',
    'jquery',
    'util',
    'Const'
], function (vue, $, util, Const) {
    vue.component('bv-form', {
        props: {
            /****** 接口属性 ******/
            entity: '',

            name: '',
            defaultClass: {
                default: true
            },
            clazz: '',
            attr: '',
            title: '',
            // insert update
            editType: '',

            // 表单是否允许折叠
            collapse: {
                default: false
            },
            // default/inline
            layout: {
                default: 'default',
            },
            // 可以设置为div，此时内部不会自动创建form，需要在外层嵌套form
            container: {
                default: 'form'
            },
            entityName: '',
            saveUrl: '',
            insertUrl: '',
            updateUrl: '',
            keys: '',
            // 支持guid
            keyGenerator: '',
            entityDefaults: {
                default: function () {
                    return {};
                }
            },
            initEntity: {},
            // head,name,hint, edit:{type}
            // edit.layout:default/inline
            // layout:default/inline
            columns: {
                default: function () {
                    return [];
                }
            },
            operatesClass: '',
            operates: {
                default: function () {
                    return [];
                }
            },

            initData: false,
            initUrl: '',
            initParam: '',
            initParamList: {
                default: function () {
                    return [];
                }
            },

            extraParams: ''
        },
        data: function () {
            return {
                innerClass: this.clazz,
                innerTitle: this.title,
                innerEditType: this.editType,
                innerColumns: [],
                innerOperates: this.operates,
                innerEntity: this.entity || {},
                innerInitEntity: util.mix(this.entityDefaults, this.initEntity) || {},
                // 主键
                innerKeys: {}
            }
        },
        beforeCreate: function () {
            // 内部用
            this.localIsCustomSave = false;
            // 后台校验
            this.localCheck = [];
        },
        created: function () {

        },
        mounted: function() {
            // 编辑类型初始化
            if (!this.innerEditType) {
                this.innerEditType = util.gup('type');
                if (!this.innerEditType) {
                    this.innerEditType = 'insert';
                }
            }

            // initParam合并到initParamList
            if (!util.isEmpty(this.initParam)) {
                for (var p in this.initParam) {
                    this.initParamList.push({
                        name: p,
                        operate: '=',
                        value: this.initParam[p]
                    });
                }
            }
            // 初始数据
            if (this.initData) {
                this.innerEditType = 'init';
                if (!this.initUrl) {
                    this.initUrl = Const.url.form.init;
                }
                var vm = this;
                util.post({
                    url: vm.initUrl,
                    async: false,
                    data: {
                        entityName: vm.entityName,
                        initParamList: vm.initParamList
                    },
                    success: function(res) {
                        vm.innerInitEntity = util.data(res);
                    }
                });
            }

            // 列定义
            if (this.columns.length > 0) {
                for (var i=0; i<this.columns.length; i++) {
                    var formColumn = this.initColumn(util.clone(this.columns[i]));
                    if (formColumn != null) {
                        this.innerColumns.push(formColumn);
                    }
                    if (this.columns[i].agree && this.columns[i].agree.name) {
                        this.innerInitEntity[this.columns[i].agree.name] = null;
                    }
                }
            }

            if (this.innerEditType === 'insert') {
                for (var i=0; i<this.innerColumns.length; i++) {
                    this.innerInitEntity[this.innerColumns[i].name] = null;
                }
            } else if (this.innerEditType === 'update') {
                this.innerInitEntity = util.mix(this.innerInitEntity, util.data('modal'));
            }

            util.clone(this.innerEntity, this.innerInitEntity);
            // this.innerEntity = this.innerInitEntity;

            if (this.innerOperates && this.innerOperates.length > 0) {
                for (var i=0; i<this.innerOperates.length; i++) {
                    if (util.type(this.innerOperates[i].show) === 'undefined') {
                        this.innerOperates[i].show = true;
                    }
                }
            }

            this.$nextTick(function () {
                util.validateInit($(this.$el));
            });
        },
        methods: {
            initColumn: function (formColumn) {
                if (!formColumn.config) {
                    formColumn.config = {};
                }
                if (!formColumn.edit) {
                    formColumn.edit = {
                    };
                }
                if ((this.innerEditType === 'update' || this.innerEditType === 'init') && formColumn.edit.condition === 'insert') {
                    formColumn.edit.type = 'static';
                }
                if (!formColumn.edit.type) {
                    formColumn.edit.type = 'textfield';
                }
                if (formColumn.edit.type === 'ignore') {
                    return null;
                }
                if (formColumn.edit.check) {
                    this.localCheck.push({
                        name: formColumn.name,
                        type: formColumn.edit.check.type,
                        describe: formColumn.edit.check.describe,
                        initParamList: util.clone(formColumn.edit.check.initParamList)
                    });
                }
                if (!formColumn.type) {
                    formColumn.type = 'bv-' + formColumn.edit.type;
                }
                formColumn.config.from = 'form';
                var preset = formColumn.name;
                if (formColumn.config.attr && util.type(formColumn.config.attr.preset) != 'undefined') {
                    preset = formColumn.config.attr.preset;
                    delete formColumn.config.attr.preset;
                }
                formColumn.config.attr = util.mix(formColumn.config.attr, util.attr(formColumn.name, formColumn.config.attr && preset, formColumn.config.attr));
                if (!formColumn.config.attr) {
                    formColumn.config.attr = {};
                }
                if (!util.isEmpty(formColumn.config.validate)) {
                    formColumn.config.attr = util.mix(formColumn.config.attr, util.validateMix(formColumn.config.validate));
                    delete formColumn.config.validate;
                }
                if (util.type(formColumn.hide) === 'undefined') {
                    if (formColumn.edit && formColumn.edit.type === 'hidden') {
                        formColumn.hide = true;
                    } else {
                        formColumn.hide = false;
                    }
                }
                if (formColumn.hint && util.startsWith(formColumn.hint, '#')) {
                    formColumn.hint = Const.messages[formColumn.hint.substring(1)];
                }
                return formColumn;
            },
            isColumnVisible: function(column) {
                if (!column || column.hide === true || column.show === false) {
                    return false;
                }
                var hide;
                if (util.type(column.hide) === 'undefined' || column.hide === false) {
                    hide = false;
                } else if (util.type(column.hide) === 'function') {
                    hide = column.hide.call(null, this.innerEntity);
                }
                if (hide) {
                    return false;
                }
                var show;
                if (util.type(column.show) === 'undefined' || column.show === true) {
                    return true;
                } else if (util.type(column.show) === 'function') {
                    return column.show.call(null, this.innerEntity);
                }
            },
            isColumnCreate: function(column) {
                if (!column || column.destroy === true || column.create === false) {
                    return false;
                }
                var hide;
                if (util.type(column.destroy) === 'undefined' || column.destroy === false) {
                    hide = false;
                } else if (util.type(column.destroy) === 'function') {
                    hide = column.destroy.call(null, this.innerEntity);
                }
                if (hide) {
                    return false;
                }
                var show;
                if (util.type(column.create) === 'undefined' || column.create === true) {
                    return true;
                } else if (util.type(column.create) === 'function') {
                    return column.create.call(null, this.innerEntity);
                }
            },
            checkColumnAttr: function(el, type) {
                if (!type) {
                    return el.edit.type;
                } else if (type === 'for') {
                    if (!el.edit.type || el.edit.type === 'textfield' || el.edit.type === 'auto' || el.edit.type === 'select') {
                        return {'for': el.name};
                    }
                    return {'for': ''};
                }
            },
            isRequired: function(validate, attr) {
                return util.isRequired(validate, attr);
            },
            hideColumn: function(name) {
                for (var i=0; i<this.innerColumns.length; i++) {
                    if (this.innerColumns[i].name === name) {
                        this.innerColumns[i].hide = true;
                        break;
                    }
                }
            },
            showColumn: function(name) {
                for (var i=0; i<this.innerColumns.length; i++) {
                    if (this.innerColumns[i].name === name) {
                        this.innerColumns[i].hide = false;
                        break;
                    }
                }
            },
            destroyColumn: function(name) {
                for (var i=0; i<this.innerColumns.length; i++) {
                    if (this.innerColumns[i].name === name) {
                        this.innerColumns[i].hide = true;
                        break;
                    }
                }
            },
            createColumn: function(name) {
                for (var i=0; i<this.innerColumns.length; i++) {
                    if (this.innerColumns[i].name === name) {
                        this.innerColumns[i].hide = false;
                        break;
                    }
                }
            },
            hideOperate: function(name) {
                var find = false;
                for (var i=0; i<this.innerOperates.length; i++) {
                    if (this.innerOperates[i].name === name) {
                        this.innerOperates[i].show = false;
                        find = true;
                        break;
                    }
                }
            },
            showOperate: function(name) {
                var find = false;
                for (var i=0; i<this.innerOperates.length; i++) {
                    if (this.innerOperates[i].name === name) {
                        this.innerOperates[i].show = true;
                        find = true;
                        break;
                    }
                }
            },
            isButtonVisible: function(data) {
                if (!data || data.show === false) {
                    return false;
                }
                if (!data.show || data.show === true) {
                    return true;
                }
                if (data.show === 'insert') {
                    return this.innerEditType === 'insert';
                } else if (data.show === 'update') {
                    return this.innerEditType === 'update';
                } else if (util.type(data.show) === 'function') {
                    return data.show.call();
                }
            },
            click: function(event, operate) {
                if (operate) {
                    if (operate.type) {
                        if (operate.type === 'save') {
                            if (operate.prepare && util.type(operate.prepare) === 'function') {
                                if (!operate.prepare.call(null, this.innerEntity)) {
                                    return;
                                }
                            }
                            if (!util.validate($(this.$el))) {
                                return;
                            }

                            var insertUrl = '';
                            var updateUrl = '';
                            if (this.innerEditType === null || this.innerEditType === 'insert') {
                                // 新增
                                if (this.insertUrl || this.saveUrl) {
                                    this.localIsCustomSave = true;
                                    insertUrl = this.insertUrl || this.saveUrl
                                } else {
                                    insertUrl = Const.url.form.insert;
                                }
                            } else {
                                // 修改
                                if (this.updateUrl || this.saveUrl) {
                                    this.localIsCustomSave = true;
                                    updateUrl = this.updateUrl || this.saveUrl;
                                } else {
                                    updateUrl = Const.url.form.update;
                                }
                            }

                            if (this.innerEditType === null || this.innerEditType === 'insert') {
                                // 新增
                                var formData;
                                if (this.localIsCustomSave) {
                                    formData = util.clone(this.innerEntity);
                                } else {
                                    formData = {
                                        entityName: this.entityName,
                                        define: util.clone(this.innerEntity),
                                        generator: this.keyGenerator
                                    };
                                    if (this.localCheck.length > 0) {
                                        for (var i=0; i<this.localCheck.length; i++) {
                                            this.localCheck[i].value = this.innerEntity[this.check[i].name];
                                        }
                                        formData.checkList = this.localCheck;
                                    }
                                }
                                util.post({
                                    $element: event.target,
                                    url: insertUrl,
                                    ///sysCode: this.sysCode,
                                    data: formData,
                                    close: true,
                                    success: operate.success
                                });
                            } else {
                                // 修改
                                var formData;
                                if (this.localIsCustomSave) {
                                    formData = util.clone(this.innerEntity);
                                } else {
                                    formData = {
                                        entityName: this.entityName,
                                        define: util.clone(this.innerEntity),
                                        keyValues: this.handleKeyValues()
                                    };
                                }
                                util.post({
                                    $el: $(event.target),
                                    url: updateUrl,
                                    ///sysCode: this.sysCode,
                                    data: formData,
                                    close: true,
                                    success: operate.success
                                });
                            }
                        }
                    } else if (operate.click && util.type(operate.click) === 'function') {
                        /*if (util.type(operate.preset) === 'function') {
                            operate.preset.call(null, $(event.target), this.innerEditType, this.innerEntity, this.extraParams)
                        }*/
                        if (util.type(operate.validate) === 'object') {
                            if (util.type(operate.validate.before) === 'function') {
                                if (!operate.validate.before.call(null, $(event.target), this.innerEditType, this.innerEntity, this.extraParams)) {
                                    return;
                                }
                            }
                            if (!util.validate($(this.$el))) {
                                return;
                            }
                            if (util.type(operate.validate.after) === 'function') {
                                if (!operate.validate.after.call(null, $(event.target), this.innerEditType, this.innerEntity, this.extraParams)) {
                                    return;
                                }
                            }
                        } else if (util.isTrue(operate.validate, true)) {
                            if (!util.validate($(this.$el))) {
                                return;
                            }
                        }
                        if (operate.prepare && util.type(operate.prepare) === 'function') {
                            operate.prepare.call(null, this.innerEntity);
                        }
                        operate.click.call(null, $(event.target), this.innerEditType, this.innerEntity, this.extraParams);
                    }
                }
            },
            handleKeyValues: function () {
                var keyValues = '';
                if (this.keys) {
                    this.innerKeys = util.replaceAll(this.keys, ' ', '').split(',');
                    keyValues = {};
                    for (var j=0; j<this.innerKeys.length; j++) {
                        keyValues[this.innerKeys[j]] = this.innerEntity[this.innerKeys[j]];
                    }
                }
                return keyValues;
            }
        },
        /****** 内部属性 ******/
        template: util.template('bv-form')
    });
});