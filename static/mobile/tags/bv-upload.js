define([
    'vue',
    'jquery',
    'util',
    'Const'
], function (vue, $, util, Const) {
    vue.component('bv-upload', {
        props: {
            entity: '',
            name: '',

            // default-上传或拍照,camera-浏览器拍照,wx-通过微信拍照,app-通过app调用
            type: {
                default: 'default'
            },
            // 拍照参数，目前仅app用
            param: '',
            clazz: '',
            attr: '',
            // 数据校验（目前无效）
            validate: '',
            // 仅限于通过浏览器上传，允许同时选择多个文件
            multiple: {
                default: false
            },
            // 上传接口
            url: '',
            // form上传文件流的名字
            formName: {
                default: 'files'
            },
            files: {
                default: function () {
                    return [];
                }
            },
            // 是否自动上传
            autoUpload: {
                default: true
            },
            // 压缩配置, `false`则不压缩
            compress: {
                default: function () {
                    return {
                        width: 1600,
                        height: 1600,
                        quality: 0.8
                    };
                }
            },
            // 自动增加图片
            autoIncrease: {
                default: false
            },
            allowDelete: {
                default: false
            },
            delete: '',
            maxSize: {
                default: 5 * 1024 * 1024
            },
            success: ''
        },
        data: function () {
            return {
                innerEntity: this.entity || [],
                innerClass: this.clazz,
                innerAttr: this.attr || {},
                innerContainerClass: '',
                // 每行显示个数
                innerRowNum: 1,
                // 行数
                innerRows: 1,
                innerFiles: this.files,
                innerAllowDelete: this.autoIncrease || this.allowDelete
            };
        },
        created: function () {
            util.initDefault(this);
            if (this.multiple) {
                this.innerAttr.multiple = true;
            }
            this.initLayout();
            if (this.type === 'camera') {
                this.innerAttr.capture = 'camera';
            }
            if (!this.innerEntity[this.name]) {
                this.innerEntity[this.name] = {};
            }
            if (this.autoIncrease) {
                this.innerFiles.push({
                    name: 'auto-' + this.innerFiles.length
                });
            }
        },
        mounted: function () {
            var vm = this;
            // 浏览器上传或拍照
            if (this.type !== 'wx' && this.type !== 'app') {
                $(this.$el).on('change', 'input[type=file]', function (event) {
                    // util.removeCache($(this).closest('.file-preview').attr('data-url'));
                    util.removeCache(vm.innerFiles[util.toNumber($(event.target).attr('data-index'))].url);
                    var files = event.target.files;

                    if (files.length === 0) {
                        return;
                    }
                    for (var i=0; i<files.length; i++) {
                        vm.process(util.toNumber($(event.target).attr('data-index')), files[i]);
                    }
                });
            }

            Const.global.f.initImagesLazyLoad($('.lazy', this.$el));
        },
        beforeDestroy: function () {
            // 清理图片缓存
            for (var i=0; i<this.innerFiles.length; i++) {
                util.removeCache(this.innerFiles[i].url);
            }
        },
        methods: {
            process: function (index, file) {
                // 判断文件类型
                if (['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].indexOf(file.type) < 0) {
                    util.alert('请上传图片');
                    return;
                }
                // 判断文件大小
                if (!this.compress && file.size > this.maxSize) {
                    util.alert('请上传不超过' + (this.maxSize / 1024 / 1024) + 'M的图片');
                    return;
                }

                if (this.compress) {
                    // 压缩
                    var vm = this;
                    util.loading();
                    util.compress(file, {
                        maxSize: vm.maxSize,
                        compress: vm.compress,
                        success: function (blob) {
                            vm.previewImage(index, blob || file);
                            util.loading('hide');

                            if (vm.autoUpload) {
                                // 自动上传
                                vm.upload(index, blob || file);
                            } else {
                                vm.onSuccess(index, blob || file);
                            }
                        },
                        error: function () {
                            vm.onError(index, file);
                            util.loading('hide');
                        }
                    });
                } else {
                    this.previewImage(index, file);
                    if (this.autoUpload) {
                        // 自动上传
                        this.upload(index, file);
                    } else {
                        this.onSuccess(index, file);
                    }
                }
            },
            // app专用
            appCapture: function (index) {
                var vm = this;
                require(['bridge'], function (bridge) {
                    bridge.callApp('chooseImage', vm.param || {}, function (res) {
                        var blob = util.dataURItoBlob('data:image/jpeg;base64,' + res.photoBase64);
                        vm.previewImage(index, blob);
                        if (vm.autoUpload) {
                            vm.upload(index, blob);
                        } else {
                            vm.onSuccess(index, blob);
                        }
                    });
                });
            },
            // iservice拍照
            iserviceCapture: function (index) {
                var vm = this;
                require(['iserviceBridge'], function () {
                    XuntongJSBridge.call('selectCamera', {}, function (res) {
                        if (res && res.data && res.data.fileData) {
                            var blob = util.dataURItoBlob('data:image/jpeg;base64,' + res.data.fileData);
                            vm.previewImage(index, blob);
                            if (vm.autoUpload) {
                                vm.upload(index, blob);
                            } else {
                                vm.onSuccess(index, blob);
                            }
                        }
                    });
                });
            },

            //alipay拍照
            alipayCapture: function (index) {
                var vm = this;
                require(['alipay'], function (ap) {
                        ap.chooseImage({
                            sourceType: 'camera'
                        }, function(res) {
                            if (res && res.apFilePaths && res.apFilePaths.length > 0) {
                                var image = new Image();
                                image.crossOrigin = 'anonymous';
                                image.onload = function() {
                                    var canvas = document.createElement('CANVAS');
                                    var context = canvas.getContext('2d');
                                    canvas.height = image.height;
                                    canvas.width = image.width;
                                    context.drawImage(image, 0, 0);
                                    try {
                                        // base64
                                        var base64 = canvas.toDataURL('image/jpeg');
                                        if (base64) {
                                            var blob = util.dataURItoBlob(base64);
                                            if (blob) {
                                                vm.previewImage(index, blob);
                                                if (vm.autoUpload) {
                                                    vm.upload(index, blob);
                                                } else {
                                                    vm.onSuccess(index, blob);
                                                }
                                            }
                                        }
                                    } catch (e) {
                                    }
                                }
                                image.src = res.apFilePaths[0];
                            }
                        });
                });
            },

            // 微信拍照
            weixinCapture: function (index) {
                var vm = this;
                util.weixinCall('chooseImage', {
                    count: 1,
                    // 设置sizeType时上传不能选原图，只能压缩
                    sizeType: ['compressed'],   // 可以指定是原图还是压缩图，默认二者都有['original', 'compressed']
                    sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        vm.previewImage(index, res.localIds[0]);
                        if (vm.autoUpload) {
                            util.weixinCall('uploadImage', {
                                localId: res.localIds[0],
                                success: function (res2) {
                                    // res2.serverId
                                    vm.upload(index, res2.serverId);
                                    // vm.wxPreview(index, res.localIds[0], res2.serverId);
                                },
                                error: function (error) {
                                }
                            });
                        } else {
                            vm.onSuccess(index, res.localIds[0]);
                        }
                    }
                });
            },
            upload: function (index, file) {
                // 设置参数
                if (this.type === 'wx') {
                    var vm = this;
                    util.get({
                        url: vm.url,
                        data: {
                            mediaId: file
                        },
                        success: function (res) {
                            vm.onSuccess(index, file, util.data(res));
                        },
                        error: function (xhr, status, err) {
                            vm.onError(index, file, err);
                        }
                    });
                } else if (this.type === 'app') {
                    file.name = 'capture';
                    file.type = 'image/jpeg';
                    file.size = file.length;
                    this.ajaxUpload(index, file);
                } else if (this.type === 'alipay') {
                    file.name = 'capture';
                    file.type = 'image/jpeg';
                    file.size = file.length;
                    this.ajaxUpload(index, file);
                } else {
                    this.ajaxUpload(index, file);
                }
            },
            ajaxUpload: function (index, file) {
                vue.set(this.innerFiles[index], 'progress', 0);
                var formData = new FormData();
                formData.append('name', file.name);
                formData.append('type', file.type);
                formData.append('size', file.size);
                formData.append('lastModifiedDate', file.lastModifiedDate);
                formData.append(this.formName || this.innerFiles[index].name, file, file.name);

                var vm = this;
                util.upload({
                    url: vm.url,
                    data: formData,
                    progress: function (event) {
                        if (event.loaded && event.total) {
                            vue.set(vm.innerFiles[index], 'progress', Math.ceil(100 * event.loaded / event.total));
                        }
                    },
                    success: function (res) {
                        vue.set(vm.innerFiles[index], 'progress', 100);
                        vm.onSuccess(index, file, util.data(res));
                    },
                    error: function (xhr, status, err) {
                        vue.set(vm.innerFiles[index], 'progress', 100);
                        vm.onError(index, file, err);
                    }
                });
            },
            previewImage: function (index, file) {
                if (this.type === 'wx') {
                    if (window.__wxjs_is_wkwebview) {
                        var vm = this;
                        util.weixinCall('getLocalImgData', {
                            localId: file,
                            success: function (res) {
                                if (res.localData) {
                                    vue.set(vm.innerFiles[index], 'url', res.localData);
                                    vue.set(vm.innerFiles[index], 'lazy', false);
                                }
                            }
                        });
                    } else {
                        vue.set(this.innerFiles[index], 'url', file);
                        vue.set(this.innerFiles[index], 'lazy', false);
                    }
                } else if (this.type === 'alipay'){
                    vue.set(this.innerFiles[index], 'url', util.createCache(file));
                    vue.set(this.innerFiles[index], 'lazy', false);
                } else if (this.type === 'app') {
                    vue.set(this.innerFiles[index], 'url', util.createCache(file));
                    vue.set(this.innerFiles[index], 'lazy', false);
                } else {
                    vue.set(this.innerFiles[index], 'url', util.createCache(file));
                    vue.set(this.innerFiles[index], 'lazy', false);
                }
            },
            // index-序号file-文件流data-后台返回的数据
            onSuccess: function (index, file, data) {
                this.innerEntity[this.name][this.innerFiles[index].name] = data || file;
                if (data) {
                    util.clone(this.innerFiles[index], data);
                }
                if (util.type(this.success) === 'function') {
                    this.success.call(null, file, data || file, this.innerEntity[this.name], this.innerEntity);
                }
                if (this.autoIncrease && index === this.innerFiles.length - 1) {
                    this.innerFiles.push({
                        name: 'auto-' + this.innerFiles.length
                    });
                }
                this.initLayout();
            },
            onError: function (index, file, error) {
                /// this.loading(file, true);
                /// util.alert('上传失败');
                util.removeCache(this.innerFiles[index].url);
                vue.set(this.innerFiles[index], 'url', '');
                vue.set(this.innerFiles[index], 'disabled', true);
                this.$nextTick(function () {
                    vue.set(this.innerFiles[index], 'disabled', false);
                });
                // this.innerFiles[file['data-index']].url = '';
            },
            innerDeleteFile: function (event, index, file) {
                $('.file-preview', $(event.target).closest('.file-container')).css({
                    'background-image': 'none'
                });
                if (this.delete && util.type(this.delete) === 'function') {
                    var vm = this;
                    this.delete.call(null, file, function () {
                        vm.innerFiles.splice(index, 1);
                        /*if (vm.innerFiles.length === 0) {
                            vm.innerFiles.push({
                            });
                        }*/
                        vm.$nextTick(function () {
                            vm.initLayout();
                        });
                    });
                } else {
                    this.innerFiles.splice(index, 1);
                    this.$nextTick(function () {
                        this.initLayout();
                    });
                    /*if (this.innerFiles.length === 0) {
                        this.innerFiles.push({
                        });
                        this.initLayout();
                    }*/
                }
            },
            doCapture: function (index) {
                if (this.type === 'wx') {
                    this.weixinCapture(index);
                } else if (this.type === 'app') {
                    this.appCapture(index);
                } else if (this.type === 'iservice') {
                    this.iserviceCapture(index);
                } else if (this.type === 'alipay') {
                    this.alipayCapture(index);
                }
            },
            initLayout: function () {
                if (this.innerFiles.length === 1) {
                    if (this.autoIncrease) {
                        this.innerContainerClass = 'col-50';
                        this.innerRowNum = 2;
                        // this.innerRows = 1;
                    } else {
                        this.innerContainerClass = 'col-100';
                    }
                } else {
                    this.innerContainerClass = 'col-50';
                    this.innerRowNum = 2;
                    this.innerRows = Math.ceil((this.innerFiles.length + 1) / 2);
                }
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-upload')
    });
});