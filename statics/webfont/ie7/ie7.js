/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referring to this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
    <!--[if lt IE 8]><!-->
    <script src="ie7/ie7.js"></script>
    <!--<![endif]-->
*/

(function() {
    function addIcon(el, entity) {
        var html = el.innerHTML;
        el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
    }
    var icons = {
        'icon-weibo': '&#xe600;',
        'icon-github': '&#xe601;',
        'icon-clock': '&#xe602;',
        'icon-link': '&#xe603;',
        'icon-vcard': '&#xe604;',
        'icon-code': '&#xe605;',
        'icon-layout': '&#xe606;',
        'icon-more': '&#xe607;',
        'icon-down': '&#xe608;',
        '0': 0
        },
        els = document.getElementsByTagName('*'),
        i, c, el;
    for (i = 0; ; i += 1) {
        el = els[i];
        if(!el) {
            break;
        }
        c = el.className;
        c = c.match(/icon-[^\s'"]+/);
        if (c && icons[c[0]]) {
            addIcon(el, icons[c[0]]);
        }
    }
}());
