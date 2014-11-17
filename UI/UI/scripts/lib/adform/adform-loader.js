(function ($) {

    var Loader = function ($element, options) {
        var defaults = {
            color: 'white',
            opacity: 0.8,
            spinner: 'small'
        };

        var settings = $.extend(true, {}, defaults, options);

        var $backdrop = $('<div class="backdrop">');

        $backdrop.css({
            'position': 'absolute',
            'z-index': 989/*Math.max.apply(Math, $element.parents().map(function() {
                return ($(this).css('z-index') | 0) + 10;
            }))*/,
            'background-color': settings.color,
            'opacity': settings.opacity
        });

        this.reposition = function () {
            $element.spin(false);

            var width = $element.outerWidth(true),
                height = $element.outerHeight(true),
                parentOffset = $element.offsetParent().offset(),
                selfOffset = $element.offset(),
                offset = {
                    x: selfOffset.left - parentOffset.left,
                    y: selfOffset.top - parentOffset.top
                };

            $backdrop.css({
                'left': offset.x,
                'top': offset.y,
                'width': width,
                'height': height
            });

            $element.spin(settings.spinner);
        };

        this.init = function () {
            $element.prepend($backdrop);
            this.reposition();
        };

        this.destroy = function () {
            $element.spin(false);
            $backdrop.remove();
        };
    };

    $.fn.loader = function(options) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data();

            if (data.loader) {
                data.loader.destroy();
                delete data.loader;
            }
            if (options !== false) {
                data.loader = new Loader($this, options);
                data.loader.init();
            }
        });
    };
})(jQuery);