define([
    'vue',
    'jquery',
    'util',
    'Const'
], function (vue, $, util, Const) {
    vue.component('bv-upload', {
        props: {
            entity: {
                default: function () {
                    return {};
                }
            },
            name: {
                default: ''
            },
            clazz: {
                default: ''
            },
            browserTitle: {
                default: '请选择文件：'
            },
            browserButtonText: {
                default: '浏览'
            },
            showDetail: {
                default: true
            },
            // false or default image url
            preview: {
                default: false
            },
            url: {
                default: ''
            },
            initParam: {
                default: ''
            },
            // fileType,subType,keyId,fileSource
            filters: {
                default: function () {
                    return {};
                }
            },
            // 是否自动上传
            autoUpload: {
                default: true
            },
            onReady: {
                default: ''
            },
            onUpload: {
                default: ''
            }
        },
        data: function () {
            return {
                fileName: '',
                fileSize: '',
                startUpload: false,
                inProgress: false,
                progress: 0,
                progressInfo: '',
                uploadError: ''
            }
        },
        computed: {
            fileSizeFormat: function () {
                return util.format(this.fileSize, 'file');
            }
        },
        created: function () {
            if (!this.url) {
                this.url = Const.url.upload.upload;
            }
            this.$uploader = null;
        },
        mounted: function () {
            if (this.initParam && util.type(this.initParam) === 'object') {
                this.url = util.mix(this.url, this.initParam);
            }
            /*if (!this.entity[this.name] && this.preview) {
                $('img', this.$el).attr('src', this.preview);
            }*/
            var vm = this;
            if (util.type(vm.onReady) === 'function') {
                vm.onReady.call(null, vm.entity, vm.$el);
            } else {
                vm.$emit('on-ready', vm.entity, vm.$el);
            }
            //实例化一个上传对象
            var uploader = new plupload.Uploader({
                browse_button: $('#browser', vm.$el)[0],
                url: util.url(vm.url),
                flash_swf_url: util.url(Const.url.upload.swf),
                multipart: false,
                multi_selection: false,
                filters: vm.filters
            });
            uploader.init();
            uploader.bind('FilesAdded', function (uploader, files) {
                if (files && files.length == 1) {
                    uploader.refresh();
                    vm.fileName = files[0].name;
                    vm.fileSize = files[0].size;
                    if (vm.autoUpload) {
                        vm.uploadError = '';
                        vm.inProgress = true;
                        vm.startUpload = true;
                        if (vm.initParam && util.type(vm.initParam) === 'function') {
                            uploader.settings.url = util.mix(util.url(vm.url), vm.initParam.call(null, vm.entity));
                        }
                        uploader.start();
                    } else {
                        vm.startUpload = false;
                        vm.progress = 0;
                    }
                }
            });
            uploader.bind('UploadProgress', function (uploader, file) {
                vm.progress = file.percent + '%';
            });
            uploader.bind('FileUploaded', function (uploader, file, responseObject) {
                vm.inProgress = false;

                if (file.percent === 100) {
                    vm.progressInfo = file.percent + '%';
                } else {
                    vm.progressInfo = file.percent + '%';
                }
                vm.progress = 0;
                var response = responseObject.response;
                if (util.type(response) === 'string') {
                    response = $.parseJSON(response);
                }

                if (util.type(vm.onUpload) === 'function') {
                    vm.onUpload.call(null, vm.entity, $(vm.$el), util.data(response));
                } else {
                    vm.$emit('on-uploaded', vm.entity, $(vm.$el), util.data(response));
                }

                var data = util.data(response);
                if (data.fileSign) {
                    vm.entity[vm.name] = data.fileSign;
                } else {
                    /// util.clone(vm.entity, data);
                    /// vm.entity[vm.name] = data;
                    vm.entity.originName = data.originName;
                    vm.entity.fileName = data.fileName;
                    vm.entity.fileExt = data.fileExt;
                    vm.entity.fileSize = data.fileSize;
                    vm.entity.filePath = data.filePath;
                    vm.entity.fileSign = data.fileSign;
                }
                /*vm.entity.originName = data.originName;
                vm.entity.fileName = data.fileName;
                vm.entity.fileExt = data.fileExt;
                vm.entity.fileSize = data.fileSize;
                vm.entity.filePath = data.filePath;
                vm.entity.fileSign = data.fileSign;*/
            });
            uploader.bind('Error', function (uploader, error) {
                uploader.refresh();
                vm.inProgress = false;
                vm.uploadError = error.file.name + '-' + error.message;
            });
            this.$uploader = uploader;
        },
        methods: {
            viewImage: function () {
                var fileSign = '';
                if (this.preview) {
                    if (this.preview === true) {
                        if (this.entity[this.name]) {
                            fileSign = this.entity[this.name];
                        }
                    } else {
                        // url
                        if (this.entity[this.name]) {
                            fileSign = this.entity[this.name];
                        } else {
                            fileSign = this.preview;
                        }
                    }
                }
                if (fileSign) {
                    return util.url('/api/file/' + fileSign);
                }
            },
            upload: function (onUpload) {
                if (this.$uploader) {
                    this.uploadError = '';
                    this.inProgress = true;
                    this.startUpload = true;
                    if (onUpload && util.type(onUpload) === 'function') {
                        this.onUpload = onUpload;
                    }
                    if (this.initParam && util.type(this.initParam) === 'function') {
                        this.$uploader.settings.url = util.mix(util.url(this.url), this.initParam.call(null, this.entity));
                    }
                    this.$uploader.start();
                }
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-upload')
    });

    vue.component('bv-import', {
        props: {
            name: {
                default: 'fileSign'
            },
            title: {
                default: '导入数据'
            },
            url: {
                default: ''
            },
            template: {
                default: ''
            },
            uploadUrl: {
                default: Const.url.excel.upload
            },
            // fileSign: '',
            // default-自动modal-弹窗body-非弹窗
            layout: {
                default: 'default'
            },
            // 自定义数据填充：格式importData(preset, data)
            // preset为预留字段
            // data为默认上传文件信息
            data: {
                default: ''
            }
        },
        data: function () {
            return {
                resultFile: '',
                uploadHint: '',
                upload: {}
            }
        },
        mounted: function () {
            this.layout = util.layout();
            util.validateInit($(this.$el));
        },
        methods: {
            doImport: function(event) {
                if (!util.validate($('form', $(this.$el)))) {
                    return;
                }
                var vm = this;
                if (util.isEmpty(vm.upload.fileSign || vm.upload.fileName)) {
                    vm.uploadHint = '请先上传导入文件!';
                } else {
                    vm.uploadHint = '';
                    var data = vm.upload;
                    if (vm.data && util.type(vm.data) === 'function') {
                        // 第一个参数预留
                        data = vm.data.call(null, '', data);
                    }
                    if (data.fileSign) {
                        util.post({
                            $element: event.target,
                            url: vm.url,
                            data: data.fileSign,
                            success: function(res) {
                                if (res) {
                                    vm.resultFile = util.data(res);
                                    vm.uploadHint = '导入完成，若有导入出错数据请下载检查结果进行重新导入!';
                                } else {
                                    vm.uploadHint = '导入成功';
                                }
                                /*var data = util.data(res);
                                if (data) {
                                    vm.resultFile = data;
                                    vm.uploadHint = '导入完成，若有导入出错数据请下载检查结果进行重新导入!';
                                } else {
                                    vm.uploadHint = '导入成功';
                                }*/
                            }
                        });
                    } else {
                        util.post({
                            $element: event.target,
                            url: vm.url,
                            data: data,
                            success: function(res) {
                                if (res) {
                                    vm.resultFile = util.data(res);
                                    vm.uploadHint = '导入完成，若有导入出错数据请下载检查结果进行重新导入!';
                                } else {
                                    vm.uploadHint = '导入成功';
                                }
                                /*var data = util.data(res);
                                if (data) {
                                    vm.resultFile = data;
                                    vm.uploadHint = '导入完成，若有导入出错数据请下载检查结果进行重新导入!';
                                } else {
                                    vm.uploadHint = '导入成功';
                                }*/
                            }
                        });
                    }
                }
            },
            downloadResult: function() {
                util.download(Const.url.excel.download + '?fileName=' + util.encode(this.resultFile));
            },
            downloadTemplate: function() {
                if (this.template) {
                    if (util.contains(this.template, '/')) {
                        // url
                        util.download(this.template);
                    } else {
                        // file
                        util.download(Const.url.excel.template + '?fileName=' + util.encode(this.template));
                    }
                }
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-import')
    });

    vue.component('bv-export', {
        props: {
            url: {
                default: ''
            },
            template: {
                default: ''
            },
            data: {
                default: ''
            }
        },
        methods: {
            doExport: function(event) {
                util.download({
                    $element: event.target,
                    url: this.url,
                    data: this.data
                });
            },
            downloadTemplate: function() {
                if (this.template) {
                    if (util.contains(this.template, '/')) {
                        // url
                        util.download(this.template);
                    } else {
                        // file
                        util.download(Const.url.excel.template + '?fileName=' + this.template);
                    }
                }
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-export')
    });

    vue.component('bv-file', {
        props: {

        },
        methods: {
        },
        /****** 模板定义 ******/
        template: util.template('bv-file')
    });
});