define('BaseCompositeView', [
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
        },

        destroySubView: function (view) {
            if (view != null) {
                if (typeof view === "object") {
                    for (var i = 0; i < this.subViews.length; i++) {
                        var tempSubview = this.subViews[i];
                        if (tempSubview === view) {
                            tempSubview.destroy();
                            this.subViews.splice(i, 1);
                            break;
                        }
                    }
                } else if (typeof view === "number") {
                    if (view > -1) {
                        if (view > -1) {
                            this.subViews[view].destroy();
                            this.subViews.splice(view, 1);
                        }
                    }
                }
            }
        }
    });

    return BaseCompositeView;
});