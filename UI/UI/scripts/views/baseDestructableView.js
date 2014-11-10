define('BaseDestructableView', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var BaseDestructableView = Backbone.View.extend({
        destroy: function () {
            console.log('Closing view', this);

            if (this.beforeClose) {
                this.beforeClose();
            }

            this.remove();
            this.unbind();
        }
    });

    return BaseDestructableView;
});