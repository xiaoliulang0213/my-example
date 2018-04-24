require(['vue', 'jquery', 'util', 'Const', 'bridge', 'framework', 'validation', 'bvLayout'], function(vue, $, util, Const, bridge) {
    util.init();
    util.initPage();
    // util.loading();
    $('.bv-preloader-container').remove();
    $('.bv-overlay').hide();
    ///$('body').height($(window).height());
    // #!/

    /*if ($('#mainDiv').length > 1) {
        util.redirect({
            title: '404',
            url: '/404.html',
            back: false
        });
        return;
    }*/
    window.addEventListener("popstate", function() {
        if (!history.state || history.state.back === undefined) {
            var path = util.path();
            if (!util.isEmpty(path) && path !== '/' && path !== '/index.html') {
                util.redirect({
                    // location.href, '', undefined, true
                    // title: '',
                    url: path,
                    ignore: true
                });
            }
        } else if (util.type(history.state.back) === 'string') {
            if (history.state.back === 'close') {
                util.exit();
            } else {
                util.redirect({
                    // history.state.back, '', false, true
                    // title: history.state.title,
                    url: history.state.back,
                    back: false,
                    ignore: true
                });
            }
        } else if (history.state.back === false) {
            history.pushState({}, '', location.hash);
        }
    });

    $(document).on('click', '[data-redirect]', function() {
        // document.title = $(this).attr('data-title');
        var target = $(this).attr('data-target');
        if (!target) {
            target = '#mainDiv';
        }
        var params = $(this).attr('data-param');
        var url = $(this).attr('data-redirect');
        if (params) {
            var paramArr = params.split(',');
            var p = '';
            if (util.contains(url, '?')) {
                p = '&';
            } else {
                p = '?';
            }
            for (var i=0; i<paramArr.length; i++) {
                if (p.length > 1) {
                    p += '&';
                }
                p += paramArr[i] + '=' + util.gup(paramArr[i]);
            }
            url += p;
        }
        util.redirect({
            // title: $(this).attr('data-title'),
            url: url,
            $target: $(this).closest(target),
            back: $(this).attr('data-redirect-back')
        });
    });
    $(document).on('click', '[data-href]', function() {
        window.location.href = $(this).attr('data-href');
    });
    $(document).on('click', '[data-prompt]', function() {
        util.alert($(this).attr('data-prompt'));
    });
    $(document).on('click', 'a[href]', function (event) {
        event.preventDefault();
    });
    $(document).on('click', '.modal-button,a[href]', function () {
        util.preloading();
    });
    $(document).on('click', '#navBack', function () {
        history.back();
    });
    $(document).on('open', '.agree-popup', function () {
        util.loading();
        $('#title span', this).text( $(this).attr('data-title'));
        $('iframe', this).attr('src', $(this).attr('data-url'));
    });
    // TODO:
    $('#gallery').on('onAfterOpen.lg', function () {
        util.tooltip($('.lg-thumb'), 'data-title');
    });
    /*$(document).on('opened', '.agree-popup', function () {
    });*/
    $(document).on('closed', '.agree-popup', function () {
        $(this).removeAttr('data-title').removeAttr('data-url');
        // $('html', $('iframe', this).contents()).remove();
        $('iframe', this).attr('src', 'about:blank');
    });
    window.onerror = function(errorMessage, scriptURI, line, column, errorObj) {
        util.report({
            from: 'onerror',
            errorMessage: errorMessage,
            scriptURI: scriptURI,
            location: location.href,
            line: line,
            column: column
        });
    };

    var path = util.path();
    if (!util.isEmpty(path) && path !== '/' && path !== '/index.html') {
        /*path = '/applyQuota/checkIdCard.html';
         isDefault = true;*/
        util.redirect({
            url: path,
            ignore: true
        });
    }
});