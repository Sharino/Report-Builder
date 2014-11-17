(function ($, window, document, undefined) {
    "use strict";

    var defaults = {
        modal: {
            title: "",
            body: "",
            buttons: [],
            className: ""
        }
    };

    //Templates and direct references
    var $modalDialog = $('<div class="modal fade"><div class="inner-modal"></div></div>'),
        $header = $('<div class="modal-header"><h3></h3><button type="button" class="close"><i class="adf-icon-table-close"></i></button></div>'),
        $heading = $header.find("h3"),
        $body = $('<div class="modal-body"></div>'),
        $footer = $('<div class="modal-footer"></div>'),
        $button = $('<a class="btn"></a>'),
        $closeButton = $header.find(".close");

    $closeButton.on("click", function () {
        $modalDialog.modal("hide");
    });

    $modalDialog.find(".inner-modal")
        .append($header)
        .append($body)
        .append($footer);

    var getButton = function (settings) {
        var $newButton = $button.clone();

        if (settings.title !== undefined) {
            $newButton.text(settings.title);
        } else {
            $newButton.text("");
        }

        if (settings.cssClass !== undefined) {
            $newButton.addClass(settings.cssClass);
        }
        if (settings.id !== undefined) {
            $newButton.attr("id", settings.id);
        }


        if (settings.callback !== undefined && (typeof settings.callback === "function")) {
            $newButton.on("click", function () {
                if(settings.callbackArgs){
                    settings.callback.apply($newButton, settings.callbackArgs);
                } else {
                    settings.callback.apply($newButton);
                }
            });
        }

        if (settings.dismiss === undefined && (settings.dismiss !== false)) {
            $newButton.on("click", function () {
                $modalDialog.modal("hide");
            });
        }

        return $newButton;
    };

    var getButtons = function (buttons) {
        var $tempButtons = $();
        $.each(buttons, function (index, settings) {
            $.merge($tempButtons, getButton(settings));
        });
        return $tempButtons;
    };

    var clearModal = function () {
        $heading.empty();
        $body.empty();
        $footer.empty();
        $modalDialog.removeClass().addClass("modal fade in");
    };

    var fillModal = function (settings) {
        settings = settings || {};
        settings.title = settings.title || defaults.modal.title;
        settings.body = settings.body || defaults.modal.body;
        settings.buttons = settings.buttons || defaults.modal.buttons;
        settings.className = settings.className || defaults.modal.className;

        $heading.text(settings.title);
        $body.html(settings.body);
        $footer.html(getButtons(settings.buttons));
        $modalDialog.addClass(settings.className);
    };

    var showModalIfNotVisible = function () {
        if (!$modalDialog.is(":visible")) {
            $("body").append($modalDialog);
            $modalDialog.modal("show");
            $modalDialog.show(); // HACK. Ask Mykolas or Roman
        }
    };

    var onCloseUnbindAllEvents = function () {
        //Allow different bindings on modal dialog
        $modalDialog.on("hidden", function () {
            $modalDialog.unbind();
        });
    };

    var construct = function (settings, argument) {
        if (typeof settings === "object") {
            if ($modalDialog.hasClass("block-ui")) {
                $modalDialog.removeClass("block-ui");
                if ($modalDialog.spin) {
                    $modalDialog.spin(false);
                }
                $(".modal-backdrop").one("click", function () {
                    $modalDialog.modal("hide");
                });
                $(document).one('keyup.dismiss.modal', function (e) {
                    if(e.which === 27){
                        $modalDialog.modal("hide");
                    }
                });
            }
            fillModal(settings);
            showModalIfNotVisible();
            onCloseUnbindAllEvents();

        } else if (typeof settings === "string") {
            switch (settings) {
                case "blockUI":
                    $modalDialog.trigger("blocked");
                    $modalDialog.removeClass().addClass("modal fade in block-ui");
                    fillModal({ body: argument });
                    showModalIfNotVisible();
                    if ($modalDialog.spin) {
                        $modalDialog.spin("block-ui");
                    }
                    $(".modal-backdrop").off("click");
                    $(document).off('keyup.dismiss.modal');
                    break;
                case "unblock":
                    $modalDialog.modal("hide");
                    if ($modalDialog.spin) {
                        $modalDialog.spin(false);
                    }
                    onCloseUnbindAllEvents();
                    break;
                default:
                    break;
            }
        } else if (typeof settings === "undefined") {
            return $modalDialog;
        }
    };

    $.extend({
        modal: construct
    });
})(jQuery, this, document);