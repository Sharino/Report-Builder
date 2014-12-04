Handlebars.tpl = {};

Handlebars.addTemplate = function(id, content) {
    Handlebars.tpl[id] = Handlebars.compile(content);
};

Handlebars.grabTemplates = function() {
    var i,
        scripts = document.getElementsByTagName('script'),
        script,
        trash = [];
    for (i = 0, l = scripts.length; i < l; i++) {
        script = scripts[i];
        if (script && script.innerHTML && script.id && (script.type === 'text/html' || script.type === 'text/x-handlebars-template')) {
            Handlebars.addTemplate(script.id, script.innerHTML);
            trash.unshift(script);
        }
    }
    for (i = 0, l = trash.length; i < l; i++) {
        trash[i].parentNode.removeChild(trash[i]);
    }
};

Handlebars.getTemplate = function (name, url) {
    if (Handlebars.tpl === undefined || Handlebars.tpl[name] === undefined) {
        $.ajax({
            url: url,
            success: function (data) {
                Handlebars.addTemplate(name, data);
            },
            async: false
        });
    }
    return Handlebars.tpl[name];
};

$(document).ready(function () { Handlebars.grabTemplates(); });