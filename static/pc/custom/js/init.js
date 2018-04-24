/*
 主页面引用
 */
require(['vue', 'jquery', 'util', 'Const'], function(vue, $, util, Const) {
    // 初始化Const、部分组件定义及ajax error公共处理
    util.init();
    // 字典
    // util.initDicts();
    $('.bv-preloader-container').remove();
    $('.bv-overlay').remove();
    $('#mainBody').show();
});