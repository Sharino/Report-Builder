﻿define('BaseCompositeView', [
    'jquery',
    'underscore',
    'backbone',
    'BaseDestructableView'
], function ($, _, Backbone, BaseDestructableView) {
    var BaseCompositeView = BaseDestructableView.extend({
        renderSubview: function (selector, subView) {
            subView.setElement(this.$(selector)).render();

            this.registerSubViewForDestruction(subView);
            return subView;
        },

        registerSubViewForDestruction: function (subView) {
            if (!this.subViews) {
                this.subViews = [];
            }

            this.subViews.push(subView);
        },

        destroy: function () {
            this.destroySubViews();

            if (this.beforeClose) {
                this.beforeClose();
            }

            this.remove();
            this.unbind();
            this.undelegateEvents();
        },

        destroySubViews: function () {
            _.each(this.subViews, function (subView) {
                if (subView.destroy) {
                    subView.destroy();
                }
            });

            this.subViews = [];
        }
    });

    return BaseCompositeView;
});