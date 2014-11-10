(function ($) {
    var init = function($selector){
        $selector.each(function(n){

            $currentItem = $(this);

            if (typeof ($currentItem.data('standalone')) === 'undefined') {
                $currentItem.collapse({
                    toggle: false,
                    parent: $('.accordion')
                });
            } else {                
                $currentItem.collapse({
                    toggle: false
                });
            }
            $currentItem.on("show", function () {
                $(this).parent().addClass("active");
            });
            $currentItem.on("hide", function (event) {
                var isCollapse = (event.target.className.indexOf("collapse") !== -1);
                if(isCollapse) {
                    $(this).removeClass("visible-overflow");
                }
            });
            $currentItem.on("shown", function () {
                $(this).addClass("visible-overflow");
                $(this).parent().addClass("active");
            });
            $currentItem.on("hidden", function () {
                $(this).parent().removeClass("active");
            });

            $('.accordion').delegate('input,select,textarea,.adform-checkbox,.btn', "focus", function () {
                $element = $(this);
                $accordionGroup = $element.parents(".accordion-group");
                if (!$accordionGroup.hasClass('active')) {
                    $accordionGroup.find(".collapse").collapse("show");
                };
            });

        })
    };
    
    var disable = function($selector) {
        $selector.filter(':not(.accordion-disabled)').each(function(n){
            var $this = $(this).addClass('accordion-disabled'),
                $target = $('[href="#'+$this.attr('id')+'"]');
                
            $target
                .addClass('disabled')
                .attr('data-prev-href', $target.attr('href'))
                .removeAttr('href')
                .attr('data-toggle', '');
        })
    };
    
    var enable = function($selector) {
        $selector.filter('.accordion-disabled').each(function(n){
            var $this = $(this).removeClass('accordion-disabled'),
                $target = $('[data-prev-href="#'+$this.attr('id')+'"]');
                
            $target
                .removeClass('disabled')
                .attr('href', $target.attr('data-prev-href'))
                .removeAttr('data-prev-href')
                .attr('data-toggle', 'collapse');
            
        })
    };

    init($(".collapse"));

    var accordion = {
        init: init,
        disable: disable,
        enable: enable
    }

    window.Adform = window.Adform || {};
    window.Adform.Accordion = accordion;

    
})(window.jQuery);