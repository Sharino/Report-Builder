define('adform-notifications', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    /*exported NotificationModel */
    var NotificationModel = Backbone.Model.extend({
        defaults: {
            type: 'warning',
            timeout: false,
            hasClose: true,
            isHTML: false
        },
        initialize: function (attributes, options) {
            if (!attributes.content) {
                throw 'Missing content for notification.';
            }
            _.bindAll(this, 'notifyRemoval');
            this.setupTimeout();
        },
        setupTimeout: function () {
            var timeout = this.get('timeout');

            if (timeout) {
                if (_.isNumber(timeout)) {
                    this.timer = _.delay(this.notifyRemoval, timeout, this);
                } else {
                    throw '"timeout" attribute must be a number.';
                }
            }
        },
        notifyRemoval: function () {
            if (this.timer) {
                clearTimeout(this.timer);
                delete this.timer;
            }
            this.trigger('removeMe', this.cid);
        }
    });
    /*exported NotificationView */
    var NotificationView = Backbone.View.extend({
        FADE_DURATION: 300,
        className: 'alert',
        events: {
            'click .close': 'handleCloseClick'
        },
        initialize: function (options) {
            _.bindAll(this, 'remove');
            this.bindModelEvents();
            this.setupAppearance();
            this.setupTimeout();
        },
        setupTimeout: function () {
            var timeout = this.model.get('timeout');

            if (timeout) {
                this.createTimeoutBar(timeout);
            }
        },
        createTimeoutBar: function (timeout) {
            $timeoutBar = $('<div class="timeout-bar"></div>');
            this.$el.append($timeoutBar);
            $timeoutBar.animate({
                width: '98%'
            }, timeout, 'linear');
        },
        setupAppearance: function () {
            var type = this.model.get('type'),
                alertType = 'alert-' + type,
                hasClose = this.model.get('hasClose'),
                $closeButton,
                isHTML = this.model.get('isHTML'),
                content = isHTML ? this.model.get('content') : this.model.escape('content');

            this.$el.addClass(alertType);

            if (hasClose) {
                $closeButton = $('<button type="button" class="close">&times;</button>');
                this.$el.append($closeButton);
            } else {
                this.$el.addClass('no-close');
            }

            this.$el.append(content);
        },
        bindModelEvents: function () {
            this.model.on('remove', this.hideNotification, this);
        },
        hideNotification: function () {
            this.model.off('remove', this.hideNotification);
            this.$el.fadeOut(this.FADE_DURATION, this.remove);
        },
        handleCloseClick: function () {
            this.model.notifyRemoval();
        }
    });
    /*exported NotificationsCollectionView */
    var NotificationsCollectionView = Backbone.View.extend({
        initialize: function (options) {
            this.createNotificationsContainer();
            this.bindCollectionEvents();
        },
        bindCollectionEvents: function () {
            this.collection.on('add', this.addNotification, this);
        },
        createNotificationsContainer: function () {
            this.$notificationsContainer = $('<div class="notifications-container"></div>');

            this.$el.append(this.$notificationsContainer);
        },
        addNotification: function (model, collection, options) {
            var notificationView = new NotificationView({
                model: model
            });

            this.$notificationsContainer.prepend(notificationView.$el);
        }
    });
    /*exported NotificationsCollection */
    /*global NotificationModel*/
    var NotificationsCollection = Backbone.Collection.extend({
        model: NotificationModel,
        initialize: function (models, options) {
            this.on('removeMe', this.removeNotification, this);
        },
        createNotification: function (options) {
            if (!_.isObject(options)) {
                throw 'Missing options argument.';
            }
            var notificationModel = new this.model({
                timeout: options.timeout,
                content: options.content,
                type: options.type,
                hasClose: options.hasClose,
                isHTML: typeof (options.isHTML) === 'boolean' ? options.isHTML : false
            });

            this.add(notificationModel);

            return notificationModel.cid;
        },
        removeNotification: function (cid) {
            this.remove(cid);
        }
    });
    var NotificationsComponent = function (options) {
        this._notificationsCollection = new NotificationsCollection();
        this._notificationsCollectionView = new NotificationsCollectionView({
            el: $('body'),
            collection: this._notificationsCollection
        });
    };

    NotificationsComponent.prototype = {
        display: function (options) {
            var notificationID = this._notificationsCollection.createNotification(options);

            return notificationID;
        },
        hide: function (id) {
            this._notificationsCollection.removeNotification(id);
        },
        hideAll: function () {

        }
    };

    var notificationsComponent = new NotificationsComponent();
    return notificationsComponent;

    /*(function () {

        $.extend({
            notifications: notificationsComponent
        });
    })();*/
});