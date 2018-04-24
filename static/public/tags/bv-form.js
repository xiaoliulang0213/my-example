define([
    'vue',
    'jquery',
    'util',
    'Const'
], function (vue, $, util, Const) {
    /**
     form表单格式比较灵活
     layoutCols默认为auto，即自适应模式，可以设置的值有：1（每行1列）2（每行2列）,3（每行3列）,4（每行4列）,其他值目前无效
     columns中每列可以设置属性edit.width，表示宽度，可以设置的值有2-两倍 100%-整行，其他值目前无效
     */
    vue.component('bv-form', {
        props: {
            /****** 接口属性 ******/
            id: {
                default: ''
            },
            index: {
                default: -1
            },
            name: {
                default: ''
            },
            clazz: {
                default: ''
            },
            size: {
                default: ''
            },
            attr: {
                default: function () {
                    return {};
                }
            },
            title: {
                default: ''
            },
            closeText: {
                default: '关闭'
            },
            // 默认表单元素类型
            defaultTag: {
                default: 'textfield'
            },
            // insert update
            editType: {
                default: ''
            },

            // 表单是否允许折叠
            collapse: {
                default: false
            },
            layout: {
                default: ''
            },
            // 支持1 2 3 4 auto
            layoutCols: {
                default: 'auto'
            },
            // 可以设置为div，此时内部不会自动创建form，需要在外层嵌套form
            container: {
                default: 'form'
            },
            // 错误提示是否在行内显示
            validateInline: {
                default: false
            },
            // 默认空，支持inline-不居中显示，modal-弹窗样式
            operateLayout: {
                default: ''
            },
            entityName: {
                default: ''
            },
            saveUrl: {
                default: ''
            },
            // 保存方法，默认post
            // 如果同一个url需要区分新增、修改，则post表示新增，put表示修改，设置saveMethod='auto'
            saveMethod: {
                default: 'post'
            },
            insertUrl: {
                default: ''
            },
            updateUrl: {
                default: ''
            },
            keys: {
                default: ''
            },
            // 支持guid
            keyGenerator: {
                default: ''
            },
            entityDefaults: {
                default: function () {
                    return {};
                }
            },
            entity: {
                default: function () {
                    return {};
                }
            },
            initEntity: {
                default: ''
            },
            labelAppend: {
                default: '：'
            },
            columns: {
                default: function () {
                    return [];
                }
            },
            operates: {
                default: function () {
                    return [];
                }
            },

            initData: {
                default: false
            },
            initUrl: {
                default: ''
            },
            initParam: {
                default: ''
            },
            initParamList: {
                default: function () {
                    return [];
                }
            },

            /****** 特殊属性 ******/
            ///sysCode: '',

            /****** 接口方法 ******/
            // formOnChange: undefined,
            // formOnSave: undefined,
            // formOnSaveSuccess: undefined,
            extraParams: {
                default: ''
            }
        },
        data: function () {
            return {
                innerColumns: this.columns,
                visible: true,
                // 是否自定义保存
                // 顶部按钮
                headerOperates: [],
                // 底部按钮
                footerOperates: []
            }
        },
        created: function () {
            if (this.$vnode && this.$vnode.context && this.$vnode.context.$el) {
                // 页面布局及大小初始化
                if (!this.layout) {
                    this.layout = util.layout($(this.$vnode.context.$el));
                }
                if (!this.size && this.layout === 'modal') {
                    if (this.layoutCols === 'auto' || this.layoutCols > 1) {
                        this.size = 'lg';
                    }
                }
            }
            if (!this.name) {
                this.name = 'form' + (Const.global.formId++);
            }

            // 内部用
            this.isCustomSave = false;
            // 后台校验
            this.checks = [];
            this.initEntity = util.mix(this.entityDefaults, this.initEntity);
            if (this.keys) {
                this.keys = util.replaceAll(this.keys, ' ', '').split(',');
            }

            // 列定义
            if (this.innerColumns.length > 0) {
                var columns = [];
                for (var i=0; i<this.innerColumns.length; i++) {
                    var column = this.initColumn(this.innerColumns[i]);
                    // var column = util.clone(this.columns[i]);
                    if (column != null) {
                        columns.push(column);
                    }
                }
                this.innerColumns = columns;
            }

            // 编辑类型初始化
            if (!this.editType) {
                this.editType = util.gup('type');
                if (!this.editType) {
                    this.editType = 'insert';
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
                this.editType = 'init';
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
                        vm.initEntity = util.data(res);
                    }
                });
            } else if (this.editType === 'insert') {
                for (var i=0; i<this.innerColumns.length; i++) {
                    if (!util.isEmpty(this.innerColumns[i].name)) {
                        this.initEntity[this.innerColumns[i].name] = null;
                    }
                }
            } else if (this.editType === 'update') {
                this.initEntity = util.mix(this.initEntity, util.data('modal'));
            } else if (this.editType === 'init') {
                for (var i=0; i<this.innerColumns.length; i++) {
                    if (!util.isEmpty(this.innerColumns[i].name)) {
                        this.initEntity[this.innerColumns[i].name] = this.entity[this.innerColumns[i].name] || null;
                    }
                }
            }

            util.clone(this.entity, this.initEntity);
            // this.entity = this.initEntity;

            if (this.operates && this.operates.length > 0) {
                for (var i=0; i<this.operates.length; i++) {
                    // TODO: 兼容处理
                    if (this.operates[i].type && this.operates[i].type === 'save') {
                        util.error('组件调用方式变更：operate.type = \'save\'已弃用，请修改为operate.preset = \'save\'的方式引用');
                        util.warn('将下面配置');
                        util.warn(util.clone(this.operates[i]));
                        util.warn('修改为：');
                        var temp = util.clone(this.operates[i]);
                        temp.preset= temp.type;
                        delete temp.type;
                        util.warn(temp);
                        this.operates[i].preset = this.operates[i].type;
                        delete this.operates[i].type;
                    }
                    if (util.type(this.operates[i].show) === 'undefined') {
                        this.operates[i].show = true;
                    }
                    if (!this.operates[i].position || this.operates[i].position === 'footer') {
                        this.footerOperates.push(this.operates[i]);
                    } else if (this.operates[i].position === 'header') {
                        this.headerOperates.push(this.operates[i]);
                    }
                }
            }
        },
        mounted: function() {
            this.$nextTick(function () {
                // util.validateInit($('form', this.$el));
                util.validateInit($(this.$el), this.validateInline);
                util.tooltip($(this.$el));
                util.tooltip($(this.$el), 'data-title');
            });
        },
        methods: {
            initColumn: function (column) {
                if (!column.config) {
                    vue.set(column, 'config', {});
                    // column.config = {};
                }
                if (!column.config.attr) {
                    vue.set(column.config, 'attr', {});
                }
                if (!column.config.attr.id && column.name) {
                    vue.set(column.config.attr, 'id', this.name + '-' + column.name);
                }
                if (!column.edit) {
                    vue.set(column, 'edit', {});
                    // column.edit = {};
                }
                if ((this.editType === 'update' || this.editType === 'init') && column.edit.condition === 'insert') {
                    vue.set(column.edit, 'type', 'static');
                    // column.edit.type = 'static';
                    delete column.config.validate;
                }
                if (!column.edit.type) {
                    vue.set(column.edit, 'type', this.defaultTag);
                    // column.edit.type = this.defaultTag;
                }
                if (column.edit.type === 'ignore') {
                    return column;
                }
                if (column.edit.check) {
                    this.checks.push({
                        name: column.name,
                        type: column.edit.check.type,
                        describe: column.edit.check.describe,
                        initParamList: util.clone(column.edit.check.initParamList)
                    });
                }
                if (!column.type) {
                    column.type = 'bv-' + column.edit.type;
                }
                column.config.from = 'form';
                var preset = column.name;
                if (column.config.attr && util.type(column.config.attr.preset) != 'undefined') {
                    preset = column.config.attr.preset;
                    delete column.config.attr.preset;
                }
                column.config.attr = util.mix(column.config.attr, util.attr(column.name, column.config.attr && preset, column.config.attr));
                if (!column.config.attr) {
                    vue.set(column.config, 'attr', {});
                    // column.config.attr = {};
                }
                if (!util.isEmpty(column.config.validate)) {
                    vue.set(column.config, 'attr', util.mix(column.config.attr, util.validateMix(column.config.validate)));
                    // column.config.attr = util.mix(column.config.attr, util.validateMix(column.config.validate));
                    delete column.config.validate;
                }
                if (util.type(column.hide) === 'undefined') {
                    if (column.edit && column.edit.type === 'hidden') {
                        vue.set(column, 'hide', true);
                        // column.hide = true;
                    } else {
                        vue.set(column, 'hide', false);
                        // column.hide = false;
                    }
                }

                // 是否占多列
                if (this.layoutCols === 1) {
                    column.layoutClass = 'container-100';
                } else if (this.layoutCols === 2) {
                    if (column.edit.width && column.edit.width === 2) {
                        column.layoutClass = 'container-100';
                    } else {
                        column.layoutClass = 'container-50';
                    }
                } else if (this.layoutCols === 3) {
                    column.layoutClass = 'container-33';
                } else if (this.layoutCols === 4) {
                    column.layoutClass = 'container-25';
                } else {
                    if (column.edit.width && column.edit.width === '100%') {
                        if (this.layout === 'modal') {
                            column.layoutClass = 'container-modal container-100';
                        } else {
                            column.layoutClass = 'container-100';
                        }
                    } else if (this.layout === 'modal') {
                        column.layoutClass = 'container-modal';
                    } else {
                        // auto
                        column.layoutClass = 'container-auto';
                    }
                }
                if (column.edit.width && column.edit.width === 2 && column.layoutClass !== 'container-100') {
                    column.layoutClass += ' container-2';
                }
                if (!column.head) {
                    column.layoutClass += ' container-no-head';
                }
                if (!column.head && column.edit.width === '100%') {
                    column.layoutClass += ' bv-col-fill';
                }
                return column;
            },
            isColumnVisible: function(column) {
                if (!column || column.hide === true || column.show === false) {
                    /// this.entity[column.name] = null;
                    return false;
                }
                var hide;
                if (util.type(column.hide) === 'undefined' || column.hide === false) {
                    hide = false;
                } else if (util.type(column.hide) === 'function') {
                    hide = column.hide.call(null, this.entity);
                }
                if (hide) {
                    /// this.entity[column.name] = null;
                    return false;
                }
                var show;
                if (util.type(column.show) === 'undefined' || column.show === true) {
                    return true;
                } else if (util.type(column.show) === 'function') {
                    return column.show.call(null, this.entity);
                    /*
                    var isShow = column.show.call(null, this.entity);
                    if (!isShow) {
                        this.entity[column.name] = null;
                    }
                    return isShow;*/
                }
            },
            isColumnCreate: function(column) {
                if (!column || (column.edit && column.edit.type === 'ignore') || column.destroy === true || column.create === false) {
                    this.entity[column.name] = null;
                    return false;
                }
                var destroy;
                if (util.type(column.destroy) === 'undefined' || column.destroy === false) {
                    destroy = false;
                } else if (util.type(column.destroy) === 'function') {
                    destroy = column.destroy.call(null, this.entity);
                }
                if (destroy) {
                    this.entity[column.name] = null;
                    return false;
                }
                var create;
                if (util.type(column.create) === 'undefined' || column.create === true) {
                    return true;
                } else if (util.type(column.create) === 'function') {
                    var isShow = column.create.call(null, this.entity);
                    if (!isShow) {
                        this.entity[column.name] = null;
                    }
                    return isShow;
                }
            },
            checkColumnAttr: function(el, type) {
                if (!type) {
                    return el.edit.type;
                } else if (type === 'for') {
                    if (!el.edit.type || el.edit.type === 'textfield' || el.edit.type === 'textarea' || el.edit.type === 'auto' || el.edit.type === 'select') {
                        return {'for': this.name + '-' + el.name};
                    }
                    return '';
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
                        this.innerColumns[i].destroy = true;
                        break;
                    }
                }
            },
            createColumn: function(name) {
                for (var i=0; i<this.innerColumns.length; i++) {
                    if (this.innerColumns[i].name === name) {
                        this.innerColumns[i].destroy = false;
                        break;
                    }
                }
            },
            hideOperate: function(name) {
                var find = false;
                for (var i=0; i<this.footerOperates.length; i++) {
                    if (this.footerOperates[i].name === name) {
                        this.footerOperates[i].show = false;
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    for (var i=0; i<this.headerOperates.length; i++) {
                        if (this.headerOperates[i].name === name) {
                            this.headerOperates[i].show = false;
                            break;
                        }
                    }
                }
            },
            showOperate: function(name) {
                var find = false;
                for (var i=0; i<this.footerOperates.length; i++) {
                    if (this.footerOperates[i].name === name) {
                        this.footerOperates[i].show = true;
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    for (var i=0; i<this.headerOperates.length; i++) {
                        if (this.headerOperates[i].name === name) {
                            this.headerOperates[i].show = true;
                            break;
                        }
                    }
                }
            },
            /*isColumnVisible: function(el) {
                if (el.hide) {
                    return false;
                }
                if (util.type(el.edit.type) !== 'function') {
                    return true;
                }
                var configType = el.edit.type.call(null, this.entity);
                return configType !== 'hide';
            },*/
            isButtonVisible: function(data) {
                if (!data || data.show === false) {
                    return false;
                }
                if (!data.show || data.show === true) {
                    return true;
                }
                if (data.show === 'insert') {
                    return this.editType === 'insert';
                } else if (data.show === 'update') {
                    return this.editType === 'update';
                } else if (util.type(data.show) === 'function') {
                    return data.show.call();
                }
            },
            click: function(event, operate) {
                if (operate) {
                    if (operate.preset) {
                        if (operate.preset === 'save') {
                            if (operate.prepare && util.type(operate.prepare) === 'function') {
                                operate.prepare.call(null, this.entity);
                            }
                            if (!util.validate($(this.$el))) {
                                return;
                            }

                            var insertUrl = '';
                            var insertMethod = 'post';
                            var updateUrl = '';
                            var updateMethod = 'post';
                            if (this.editType === null || this.editType === 'insert') {
                                // 新增
                                if (this.insertUrl || this.saveUrl) {
                                    this.isCustomSave = true;
                                    insertUrl = this.insertUrl || this.saveUrl;
                                } else {
                                    insertUrl = Const.url.form.insert;
                                }
                            } else {
                                // 修改
                                if (this.updateUrl || this.saveUrl) {
                                    this.isCustomSave = true;
                                    updateUrl = this.updateUrl || this.saveUrl;
                                    if (this.saveMethod === 'auto') {
                                        updateMethod = 'put';
                                    }
                                } else {
                                    updateUrl = Const.url.form.update;
                                }
                            }

                            if (this.editType === null || this.editType === 'insert') {
                                // 新增
                                var formData;
                                if (this.isCustomSave) {
                                    formData = util.clone(this.entity);
                                } else {
                                    formData = {
                                        entityName: this.entityName,
                                        define: util.clone(this.entity),
                                        generator: this.keyGenerator
                                    };
                                    if (this.checks.length > 0) {
                                        for (var i=0; i<this.checks.length; i++) {
                                            this.checks[i].value = this.entity[this.checks[i].name];
                                        }
                                        formData.checkList = this.checks;
                                    }
                                }
                                util.request({
                                    $element: event.target,
                                    type: insertMethod,
                                    url: insertUrl,
                                    ///sysCode: this.sysCode,
                                    data: formData,
                                    close: true,
                                    success: operate.success
                                });
                            } else {
                                // 修改
                                var formData;
                                if (this.isCustomSave) {
                                    formData = util.clone(this.entity);
                                } else {
                                    formData = {
                                        entityName: this.entityName,
                                        define: util.clone(this.entity),
                                        keyValues: this.handleKeyValues()
                                    };
                                }
                                util.request({
                                    $el: $(event.target),
                                    type: updateMethod,
                                    url: updateUrl,
                                    ///sysCode: this.sysCode,
                                    data: formData,
                                    close: true,
                                    success: operate.success
                                });
                            }
                        } else if (operate.preset === 'reset') {
                            // 重置
                            util.clone(this.entity, this.initEntity);
                        } else if (operate.preset === 'modal') {
                            if (operate.url) {
                                if (operate.prepare && util.type(operate.prepare) === 'function') {
                                    operate.prepare.call(null);
                                }
                                util.modal({
                                    url: operate.url,
                                    vm: this
                                });
                            }
                        }
                    } else if (operate.click && util.type(operate.click) === 'function') {
                        if (util.isTrue(operate.validate, true)) {
                            if (!util.validate($(event.target).closest('form'))) {
                                return;
                            }
                        }
                        if (operate.prepare && util.type(operate.prepare) === 'function') {
                            operate.prepare.call(null, this.entity);
                        }
                        operate.click.call(null, event, this.editType, this.entity, this.extraParams);
                    }
                }
            },
            handleKeyValues: function () {
                var keyValues = '';
                if (this.keys) {
                    keyValues = {};
                    for (var j=0; j<this.keys.length; j++) {
                        keyValues[this.keys[j]] = this.entity[this.keys[j]];
                    }
                }
                return keyValues;
            }
        },
        /****** 内部属性 ******/
        template: util.template('bv-form')
    });
});