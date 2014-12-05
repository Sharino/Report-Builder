/*exported SidePanelView */
var SidePanelView = Backbone.View.extend({
    events: {
        'click button.close-button': 'hide',
        'click .close-button-compact': 'hide',
        'click .side-panel-dismiss': 'hide',
        'click .side-panel-overlay': 'hide',
        'AdformSidePanel:hidden': 'resetSidePanel',
        'mousedown .side-panel-resize': 'resizeStart',
        'mouseenter': 'handleMouseEnter',
        'mouseleave': 'handleMouseOut',
        'AdformSidePanel:resizeStart': '_handleResizeStart',
        'AdformSidePanel:resizeEnd': '_handleResizeEnd'
    },
    defaults: function () {
        return {
            useOverlay: true,
            header: false,
            title: false,
            body: '',
            width: '600px',
            minWidth: 565,
            resize: false,
            mouseIsOverSidePanel: false
        };
    },

    headerButtonDefaults: function () {
        return {
            title: '',
            className: '',
            icon: false,
            callback: null,
            dismiss: false,
            context: this,
            callbackArgs: []
        };
    },

    getScrollBarWidth: function () {
        var $outer = $('<div></div>').css({
            visibility: 'hidden',
            width: '100px'
        }),
            $inner = $('<div></div>').css({
                width: '100%'
            });
        $('body').append($outer);

        var widthWithoutScroll = $outer.innerWidth();

        $outer.css('overflow', 'scroll').append($inner);

        var widthWithScroll = $inner.innerWidth();

        $inner.remove();
        $outer.remove();

        return widthWithoutScroll - widthWithScroll;
    },
    initialize: function () {
        this.createOverlay();
        this.createPanelElements();
        this.scrollBarWidth = this.getScrollBarWidth();
        this.suspendMouseEnterLeave = true;
    },
    createOverlay: function () {
        this.$overlay = $('<div class="side-panel-overlay fade"></div>');
        this.$el.append(this.$overlay);
    },
    createPanelElements: function () {
        this.$sidePanel = $('<div class="side-panel side-panel-v-0-2-1"></div>');
        this.$sidePanelInner = $('<div class="side-panel-inner"></div>');
        this.$sidePanelHeader = $('<div class="side-panel-header"></div>');
        this.$sidePanelHeaderContent = $('<div class="side-panel-header-content"></div>');
        this.$closeButton = $('<button type="button" class="close-button"><i class="adf-icon-toolbar-close"></i></button>');

        this.$closeButtonCompact = $('<a class="btn-transparent close-button-compact"><i class="adf-icon-small-close"></i></a>');

        this.$sidePanelHeader.append(this.$sidePanelHeaderContent);
        this.$sidePanelHeader.append(this.$closeButton);

        this.$sidePanelCompactHeaderTitle = $('<h3></h3>');

        this.$sidePanelBody = $('<div class="side-panel-body"></div>');
        this.$sidePanelFooter = $('<div class="side-panel-footer"></div>');

        this.$sidePanelHeaderButtonsContainer = $('<div class="sidepanel-header-buttons"></div>');

        this.$sidePanelResizeHandle = $('<div class="resize-handle-left side-panel-resize"></div>');

        this.$sidePanelInner.append(this.$sidePanelHeader);
        this.$sidePanelInner.append(this.$sidePanelBody);
        this.$sidePanelInner.append(this.$sidePanelFooter);

        this.$sidePanel.append(this.$sidePanelInner);
        this.$el.append(this.$sidePanel);
    },
    hideOverlay: function () {
        this.$overlay.removeClass('in');
    },
    hide: function () {
        var hiddenCallback = _.bind(function () {
            this.trigger('AdformSidePanel:hidden');
            this.$el.trigger('AdformSidePanel:hidden');

        }, this);

        this.$el.trigger('AdformSidePanel:hide');
        this.$sidePanel.removeClass('visible');

        if ($.support.transition) {
            this.$sidePanel.one($.support.transition.end, hiddenCallback);
        } else {
            hiddenCallback();
        }

        this._unbindMouseEnterLeaveEvents();
        this.trigger('AdformSidePanel:hide');
        this.hideOverlay();
        this._revertBodyScroll();
    },
    display: function (options) {

        if (!options) {
            throw 'Options argument is required.';
        }

        this.resetSidePanel();

        _.defaults(options, this.defaults());

        if (options.useOverlay) {
            this.appendOverlay();
        } else {
            this.$overlay.remove();
        }

        this.useOverlay = options.useOverlay;

        this.options = options;

        this.setWidth(options.width);
        this.appendSidePanel();

        if (!options.title && !options.header) {
            this.$sidePanelHeader.remove();
            this.$sidePanel.addClass('without-header');
        } else {
            if (_.isObject(options.header)) {
                this.$sidePanelHeader.addClass('compact').empty();
                this.$sidePanelCompactHeaderTitle.html(options.header.title);

                if (_.isArray(options.header.buttons)) {
                    _.each(options.header.buttons, function (buttonOptions) {
                        this.$sidePanelHeaderButtonsContainer.append(this.$getHeaderButton(buttonOptions));
                    }, this);
                    this.$sidePanelHeader.append(this.$sidePanelHeaderButtonsContainer);
                    $('.std-tooltip').tooltip({
                        delay: {
                            show: 50,
                            hide: 50
                        },
                        container: '.side-panel-header',
                        placement: 'bottom'
                    });
                }

                this.$sidePanelHeader
                    .append(this.$sidePanelCompactHeaderTitle)
                    .append(this.$closeButtonCompact);

                this.$sidePanel.addClass('with-compact-header');
            } else {
                this.$sidePanelHeaderContent.html(options.title);
            }
        }

        if (options.resize) {
            this.$sidePanel.append(this.$sidePanelResizeHandle);
        }

        this.$sidePanelBody.html(options.body);
        this.setFooterContent(options.buttons);
        
        this.$sidePanelBody.css('padding-top', (this.$sidePanelHeader.outerHeight() + 20) + 'px');
        this.$sidePanelBody.css('padding-bottom', (this.$sidePanelFooter.outerHeight() + 20) + 'px');

        if (options.useOverlay) {
            this._hideBodyScroll();
        } else {
            window.setTimeout($.proxy(this._revertBodyScroll, this), 0);

            this._detectPanelBodyScroll();
        }

        this.mouseIsOverSidePanel = options.mouseIsOverSidePanel;

        this._bindMouseEnterLeaveEvents();
    },
    setWidth: function (width) {
        if (_.isString(width)) {
            this.$sidePanel.css('width', width);
        }
    },
    appendOverlay: function () {
        this.$overlay.addClass('in');
    },
    appendSidePanel: function () {
        this.$el
            .trigger('AdformSidePanel:show')
            .appendTo('body');

        _.defer(function ($sidePanel) {
            $sidePanel
                .addClass('visible')
                .one($.support.transition.end, function () {
                    $(this).trigger('AdformSidePanel:shown');
                });
        }, this.$sidePanel);
    },
    setFooterContent: function (buttonsOptions) {
        this.$sidePanelFooter.empty();
        if (buttonsOptions && _.isArray(buttonsOptions) && buttonsOptions.length) {
            this.$sidePanel.removeClass('without-footer');
            _.each(buttonsOptions, function (buttonOptions) {
                var $button = this.$getButton(buttonOptions);

                this.$sidePanelFooter.append($button);
            }, this);
            this.$sidePanelFooter.appendTo(this.$sidePanelInner);
        } else {
            this.$sidePanel.addClass('without-footer');
            this.$sidePanelFooter.remove();
        }
    },
    $getHeaderButton: function (buttonOptions) {
        _.defaults(buttonOptions, this.headerButtonDefaults());
        var $button = $('<button type="button"></button>')
            .addClass(buttonOptions.className)
            .addClass('btn');
        if (buttonOptions.icon) {
            var $icon = $('<i></i>')
                .addClass(buttonOptions.icon);
            $button
                .attr('title', buttonOptions.title)
                .addClass('std-tooltip')
                .append($icon);
        } else {
            $button.html(buttonOptions.title);
        }

        if (buttonOptions.callback && _.isFunction(buttonOptions.callback)) {
            $button.on('click', function () {
                buttonOptions.callback.apply(buttonOptions.context, buttonOptions.callbackArgs);
            });
        }
        return $button;
    },
    $getButton: function (buttonOptions) {
        var $button = $('<button type="button" class="btn"></button>');

        $button
            .text(buttonOptions.title)
            .addClass(buttonOptions.cssClass)
            .attr('id', buttonOptions.id);

        if (_.isUndefined(buttonOptions.dismiss) || buttonOptions.dismiss) {
            $button.addClass('close-button');
        }
        if (buttonOptions.callback && _.isFunction(buttonOptions.callback)) {
            $button.on('click', function () {
                buttonOptions.callback.apply(buttonOptions.context, buttonOptions.callbackArgs);
            });
        }
        return $button;
    },
    resetSidePanel: function () {
        this.$sidePanelHeaderButtonsContainer.empty();
        this.$sidePanelHeaderContent.empty();
        this.$sidePanelBody.empty();
        this.$sidePanelFooter.empty();
        this.$el.detach();
    },
    setContent: function (content) {
        this.$sidePanelBody
            .empty()
            .html(content);
        this.$sidePanel.trigger('AdformSidePanel:shown');
        this._detectPanelBodyScroll();

    },
    resizeStart: function (event) {
        this.resizeData = {
            startX: event.pageX,
            panelWidth: this.$sidePanel.width(),
            screenWidth: $(window).width()
        };
        
        this.trigger('AdformSidePanel:resizeStart');
        this.$el.trigger('AdformSidePanel:resizeStart');

        event.preventDefault();
        event.stopPropagation();
        this.temporalHandler = $.proxy(_.throttle(this.resizeMouseMove, 75), this);
        $(document).on('mouseup', $.proxy(_.once(this.resizeEnd), this));
        $(document).on('mousemove', this.temporalHandler);
    },

    resizeMouseMove: function (event) {
        var currentPos = event.pageX,
            diff = currentPos - this.resizeData.startX,
            newWidth = this.resizeData.panelWidth - diff;

        newWidth = Math.max(this.options.minWidth, newWidth);
        this.$sidePanel.css('width', newWidth + 'px');

        _.throttle(this.trigger('AdformSidePanel:resized'), 75);
    },

    relativeWidthToAbsolute: function (widthPercents) {
        var screenWidth = $(window).width(),
            part = parseInt(widthPercents, 10) / 100,
            widthPixels = screenWidth * part;

        return (Math.round(widthPixels * 1000000) / 1000000);
    },
    absoluteWidthToRelative: function (widthPixels) {
        var screenWidth = $(window).width(),
            widthPercentage = parseInt(widthPixels, 10) * 100 / screenWidth;
        return (Math.round(widthPercentage * 1000000) / 1000000);
    },

    resizeEnd: function () {
        $(document).off('mousemove', this.temporalHandler);
        this.trigger('AdformSidePanel:resizeEnd');
        this.$el.trigger('AdformSidePanel:resizeEnd');
    },

    handleMouseEnter: function () {
        if (this.suspendMouseEnterLeave) {
            return;
        }

        if (!this.useOverlay && !this.mouseIsOverSidePanel) {
            this._hideBodyScroll();
            this.mouseIsOverSidePanel = true;
        }
    },

    handleMouseOut: function () {
        if (this.suspendMouseEnterLeave) {
            return;
        }
        if (!this.useOverlay) {
            this._revertBodyScroll();
            this.mouseIsOverSidePanel = false;
        }
    },

    _detectPanelBodyScroll: function() {
        var viewHeight = this.$sidePanelBody.outerHeight(),
            contentHeight =this.$sidePanelBody[0].scrollHeight,
            hasScroll = viewHeight < contentHeight;
        if (hasScroll) {
            this.$sidePanel.addClass('content-with-scroll');
        } else {
            this.$sidePanel.removeClass('content-with-scroll');
        }
    },

    _hideBodyScroll: function () {
        var $html = $('html'),
            currentWidthPixels = parseInt(this.$sidePanel.width(), 10),
            prevWidth = $html.width();

        $html.css('overflow-y', 'hidden');

        this.$sidePanelHeader.css('margin-right', 0 + 'px');
        this.$sidePanelFooter.css('margin-right', 0 + 'px');

        this.$sidePanelBody.css('overflow-y', 'scroll');

        if (prevWidth === $html.width()) {
            $html.css('overflow-y', 'auto');
        } else {
            this.$sidePanel.css('width', (currentWidthPixels + this.scrollBarWidth) + 'px');
        }
    },

    _revertBodyScroll: function () {
        var $html = $('html'),
            currentWidthPixels = parseInt(this.$sidePanel.width(), 10);
            
        this.$sidePanelBody.css('overflow-y', 'hidden');

        if ($html.css('overflow-y') === 'hidden') {
            $html.css('overflow-y', 'auto');
            this.$sidePanel.css('width', (currentWidthPixels - this.scrollBarWidth) + 'px');

            this.$sidePanelHeader.css('margin-right', (0-this.scrollBarWidth) + 'px');
            this.$sidePanelFooter.css('margin-right', (0-this.scrollBarWidth) + 'px');
        }
    },
    _handleResizeStart: function() {
        this._unbindMouseEnterLeaveEvents();
    },

    _handleResizeEnd: function() {
        this._bindMouseEnterLeaveEvents();
    },

    _bindMouseEnterLeaveEvents: function() {
        this.suspendMouseEnterLeave = false;
    },

    _unbindMouseEnterLeaveEvents: function() {
        this.suspendMouseEnterLeave = true;
    }

});
/*global SidePanelView */
function SidePanelComponent() {

    _.extend(Backbone.Events, SidePanelView);

    this.sidePanel = new SidePanelView();
    this.$element = this.sidePanel.$el;

    // this.sidePanel.on('hide', this.overlay.hide, this.overlay);

    this.resolveOptions = _.bind(this.resolveOptions, this);
}

SidePanelComponent.prototype = {
    display: function (options) {
        this.sidePanel.display(options);
    },
    hide: function () {
        this.sidePanel.hide();
    },
    setContent: function(content) {
        this.sidePanel.setContent(content);
    },
    resolveOptions: function (options, argument1) {
        if (_.isUndefined(options)) {
            return this.$element;
        }
        if (_.isObject(options)) {
            this.display(options);
        } else if (_.isString(options)) {
            switch (options) {
            case 'hide':
                this.hide();
                break;
            case 'content':
                this.setContent(argument1);
                break;
            case 'get':
                return this;
            }
        }
    },
};

(function () {
    var sidePanelComponent = new SidePanelComponent();

    $.extend({
        sidePanel: sidePanelComponent.resolveOptions
    });
})();