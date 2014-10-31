define('MessageView', [
    'BaseCompositeView',
    'text!templates/message.html',
    'Config'
], function (BaseCompositeView, MessageTemplate, Config) {
    var MessageView = BaseCompositeView.extend({
        template: _.template(MessageTemplate),

        initialize: function(msg) {
            this.message = msg;
        },

        render: function () {
            this.$el.html(this.template({Message: this.message}));
            return this;
        },
    });

    return MessageView;
});