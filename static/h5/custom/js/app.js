require(['vue', 'jquery', 'util', 'Const'], function(vue, $, util, Const) {
    vue.component('example-api', {
        props: {
            tryIt: {
                default: true
            },
            functions: {
                default: function () {
                    return [];
                }
            }
        },
        data: function () {
            return {
                innerTryIt: this.tryIt,
                innerTreeConfig: {
                    url: this.functions,
                    pack: function(entity) {
                        return {
                            id: entity.name,
                            pId: entity.parentName,
                            name: entity.name + (entity.deprecated ? '(deprecated)' : ''),
                            open: true,//!entity.parentMenuId || entity.parentMenuId === '00',
                            entity: entity
                        };
                    }
                }
            }
        },
        methods: {
            showFunction: function (func) {
                var show = func.name;
                if (func.params && func.params.length > 0) {
                    show += '(';
                    for (var i=0; i<func.params.length; i++) {
                        if (i > 0) {
                            show += ', ';
                        }
                        if (func.params[i].optional) {
                            show += '[';
                        }
                        show += func.params[i].name;
                        if (func.params[i].defaultValue !== undefined) {
                            show += '=' + func.params[i].defaultValue;
                        }
                        if (func.params[i].optional) {
                            show += ']';
                        }
                    }
                    show += ')';
                }
                return show;
            },
            treeOnClick: function (event, treeId, treeNode) {
                var parentNode = treeNode.getParentNode();
                if (parentNode && parentNode.id) {
                    util.location('#' + parentNode.id + '-' + treeNode.id);
                } else if (treeNode && treeNode.entity && treeNode.entity.describe) {
                    util.location('#' + treeNode.id);
                }
            }
        },
        mounted: function () {
            if (this.tryIt && this.tryIt === 'false') {
                this.innerTryIt = false;
            }
            $(document).on('click', 'a[data-function]', function () {
                var index = util.find(functions, 'name', $(this).attr('data-function'));
                if (index >= 0) {
                    util.cache(functions[index]);
                }
                /*util.cache({
                 functionName: $(this).attr('data-function')
                 });*/
                util.modal({
                    url: 'modules/frontend/js/try.html'
                });
            });
        },
        beforeDestroy: function () {
            $(document).off('click', 'a[data-function]');
        },
        /****** 模板定义 ******/
        template: util.heredoc(function() {
            /*!
            <div class="example-api">
                <div class="col-sm-4 col-md-3 bv-fill-height bv-border bv-fill-scroll">
                    <component is="bv-tree" @on-click="treeOnClick" v-bind="innerTreeConfig"></component>
                </div>
                <div class="col-sm-7 col-md-8 bv-fill-height bv-border bv-fill-scroll">
                    <form class="form-horizontal">
                        <div class="col-md-11">
                            <div v-for="el in functions" v-if="el.parentName || el.describe">
                                <h3>
                                    <a id="basic-type" :id="(el.parentName ? (el.parentName + '-') : '') + el.name"></a>
                                    <code v-text="showFunction(el)" :class="el.deprecated && 'del'"></code>
                                </h3>
                                <p v-text="el.describe"></p>
                                <mark v-text="el.version ? (el.version.start + (el.version.end ? '-' + el.version.end : '')) : ''" v-if="el.version"></mark>
                                <strong v-text="el.deprecated" v-if="el.deprecated"></strong>
                                <h4 v-if="el.params">参数</h4>
                                <ul v-if="el.params">
                                    <li v-for="param in el.params">
                                        <code v-text="param.name"></code>
                                        <em v-text="'(' + param.type + ')'"></em>
                                        <span v-text="': ' + param.describe"></span>
                                    </li>
                                </ul>
                                <h4 v-if="el.ret">返回值</h4>
                                <p v-if="el.ret">
                                    <em v-text="'(' + el.ret.type + ')'"></em>
                                    <span v-text="': ' + el.ret.describe"></span>
                                </p>
                                <h4 v-if="el.example">例子</h4>
                                <pre v-if="el.example">
            <code v-html="el.example">
            </code>
                            </pre>
                                <h4 v-if="innerTryIt"><a href="javascript:;" :data-function="el.name">试一下</a></h4>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            */
        })
    });
});

