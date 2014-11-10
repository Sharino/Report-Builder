(function ($) {
    var handlers = {
        click: function (element) {
            var $element = $(element);
            if (!$element.hasClass("disabled")) {
                handlers.toggle($element);
            }
        },
        keyup: function (event, element) {

            var $element = $(element);
            event.preventDefault();
            if (!$element.hasClass("disabled")) {
                if (event.keyCode == 32) {
                    handlers.toggle($element);
                }
            }
        },
        toggle: function ($element) {
            if ($element.hasClass("checked")) {
                $element
                    .removeClass("checked")
                    .val(false).change();
            } else {
                $element
                    .addClass("checked")
                    .val(true).change();
            }
        }
    };
    var AdformCheckbox = function () {
        this.bindExchangeClick = function ($exchange) {
            var $checkbox = $exchange.find('.adform-checkbox');

            $checkbox.on("change", function () {
                $exchange.toggleClass("selected");
            });
            $exchange.click(function (event) {
                var isNotAnchor = event.target.nodeName != "A",
                    isNotCheckbox = event.target.className.indexOf("adform-checkbox") == -1,
                    isNotMappingID = event.target.className.indexOf("mapping-id") == -1;
                if (isNotCheckbox && isNotAnchor && isNotMappingID) {
                    $checkbox.toggleClass("checked").trigger("change");
                }
            });
        },
        this.bindRowClick = function ($tr) {

            $tr.click(function (event) {
                var isNotAnchor = event.target.nodeName != "A",
                    isNotParentAnchor = event.target.parentElement.nodeName != "A",
                    isNotCheckbox = event.target.className.indexOf("adform-checkbox") == -1;

                //Check if click target is not element with interaction assigned
                if (isNotCheckbox && isNotAnchor && isNotParentAnchor) {
                    var $checkbox = $(this).find('.adform-checkbox').first();
                    $checkbox.toggleClass("checked").trigger("change");
                }
            });
        };
        this.init = function () {
            $(document).delegate(".adform-checkbox", "click", function () {
                handlers.click(this);
            });
            $(document).delegate(".adform-checkbox", "keyup", function (event) {
                handlers.keyup(event, this);
            });
            $(".adform-checkbox").each(function () {
                var $element = $(this);
                if ($element.attr("tabindex") === undefined) {
                    $element.attr("tabindex", "0");
                }
            });
            $(document).on("click", ".adform-checkbox ~ label", function (event) {
                $(event.target).siblings(".adform-checkbox").click();
            });
        };
        this.initDropControl = function ($dropControl) {
            $dropControl.delegate(".adform-checkbox", "click", function () {
                handlers.click(this);
            });
            $dropControl.find(".adform-checkbox").each(function () {
                var $element = $(this);
                if ($element.attr("tabindex") === undefined) {
                    $element.attr("tabindex", "0");
                }
                $element.siblings("label").click(function () {
                    $element.trigger("click");
                });
            });
        }
    }
    window.AdformCheckbox = new AdformCheckbox();
    window.AdformCheckbox.init();
})(window.jQuery);