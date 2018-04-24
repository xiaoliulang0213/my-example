define([
    'vue',
    'jquery',
    'util',
    'Const'
], function (vue, $, util, Const) {
    // 不能绑定属性
    // 取值时调用util.editor(id)
    vue.component('bv-editor', {
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
            clazz: {
                default: ''
            },
            width: {
                default: '100%'
            },
            height: {
                default: '460px'
            },
            attr: {
                default: function () {
                    return {};
                }
            },
            defaultValue: {
                default: ''
            },
            value: {
                default: ''
            },
            uploadUrl: {
                default: Const.url.upload.upload
            },
            viewUrl: {
                default: Const.url.editor.view
            }
        },
        beforeCreate: function () {
            this.$editor = '';
        },
        created: function () {
            util.initDefault(this);
            util.initId(this);
        },
        mounted: function () {
            var vm = this;
            var editor = new wangEditor($('textarea', this.$el));
            editor.config.customUpload = true;
            editor.config.customUploadInit = function() {
                // 编辑器中，触发选择图片的按钮的id
                var btnId = editor.customUploadBtnId;
                // 编辑器中，触发选择图片的按钮的父元素的id
                var containerId = editor.customUploadContainerId;

                //实例化一个上传对象
                var uploader = new plupload.Uploader({
                    browse_button: btnId,
                    url: util.url(vm.uploadUrl),
                    flash_swf_url: util.url(Const.url.upload.swf),
                    multipart: false,
                    multi_selection: false,
                    filters: {
                        mime_types: [
                            //只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
                            { title: "图片文件", extensions: "jpg,gif,png,bmp" }
                        ]
                    }
                });
                //存储所有图片的url地址
                var urls = [];
                //初始化
                uploader.init();
                //绑定文件添加到队列的事件
                uploader.bind('FilesAdded', function (uploader, files) {
                    //显示添加进来的文件名
                    /* $.each(files, function(key, value) {
                        console.log('添加文件' + value.name);
                    }); */
                    // 文件添加之后，开始执行上传
                    uploader.start();
                });
                //单个文件上传之后
                uploader.bind('FileUploaded', function (uploader, file, responseObject) {
                    //注意，要从服务器返回图片的url地址，否则上传的图片无法显示在编辑器中
                    var response = responseObject.response;
                    if (util.type(response) === 'string') {
                        response = util.json(response);
                    }
                    //先将url地址存储来，待所有图片都上传完了，再统一处理
                    if (Const.rest.head) {
                        urls.push(util.url(vm.viewUrl) + '?fileName=' + response.body);
                    } else {
                        urls.push(util.url(vm.viewUrl) + '/' + response.fileSign);
                    }
                });
                //全部文件上传时候
                uploader.bind('UploadComplete', function (uploader, files) {
//                        console.log('所有图片上传完成');
                    // 用 try catch 兼容IE低版本的异常情况
                    try {
                        //打印出所有图片的url地址
                        $.each(urls, function (key, value) {
//                                console.log('即将插入图片' + value);
                            // 插入到编辑器中
                            editor.command(null, 'insertHtml', '<img src="' + value + '" style="max-width:100%;"/>');
                        });
                    } catch (ex) {
                        // 此处可不写代码
                    } finally {
                        //清空url数组
                        urls = [];
                        // 隐藏进度条
                        editor.hideUploadProgress();
                    }
                });
                // 上传进度条
                uploader.bind('UploadProgress', function (uploader, file) {
                    // 显示进度条
                    editor.showUploadProgress(file.percent);
                });
            };

            editor.config.emotions = {};
            // 自定义菜单
            editor.config.menus = [
                'bold',
                'underline',
                'italic',
                'strikethrough',
                'eraser',
                'forecolor',
                'bgcolor',
                '|',
                'quote',
                'fontfamily',
                'fontsize',
                'head',
                'unorderlist',
                'orderlist',
                'alignleft',
                'aligncenter',
                'alignright',
                '|',
                'link',
                'unlink',
                'img',
                '|',
                'undo',
                'redo'
             ];

            editor.create();
            editor.onchange = function () {
                // 编辑区域内容变化时，实时打印出当前内容
                vm.entity[vm.name] = editor.$txt.html();
            };
            if (vm.entity[vm.name]) {
                util.editor(editor, vm.entity[vm.name]);
            }

            this.$editor = editor;
        },
        /****** 模板定义 ******/
        template: util.template('bv-editor')
    });
});