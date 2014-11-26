define('ComponentListView', [
    'BaseCompositeView',
    'Component',
    'ComponentCollection',
    'MenuView',
    'text!templates/componentList.html',
    'Config',
    'Export'
], function (BaseCompositeView, Component, ComponentCollection, MenuView, componentListTemplate, Config, Export) {
    var ComponentListView = BaseCompositeView.extend({
        template: _.template(componentListTemplate),

        events: {
            'click .del': 'handleDeleteAction',
            'click .gen': 'handleGenerateAction',
            'click .component-list-item>.click': 'handleClickAction',
            'click .create': 'submitNewComponent',
        },

        submitNewComponent: function () {
            var routerUrl = "create";
            Backbone.history.navigate(routerUrl, true, true);
        },

        initialize: function () {
            if (!this.collection) {
                this.collection = new ComponentCollection();
            }

            this.collection.on('remove', this.render, this);
            this.collection.on('fetch', this.render, this);
        },
        render: function () {

            if (this.collection) {
                this.$el.html(this.template({
                    "Components": this.collection.toJSON(),
                }));
            }
            else {
                this.$el.html(this.template({
                    "Components": [],
                }));
            }

            return this;
        },
        
        handleClickAction: function (e) {
            e.preventDefault();

            var id = $(e.currentTarget).attr("id");
            var routerUrl = "create/".concat(id);

            Backbone.history.navigate(routerUrl, true, true);
        },

        handleDeleteAction: function (e) {
            e.preventDefault();

            var id = $(e.currentTarget.parentElement).attr("id");
            var item = this.collection.get(id);

            $.modal({
                title: "Confirmation",
                body: "Do you really want to delete this report component?",
                buttons: [
                    {
                        title: "Yes",
                        cssClass: "btn-success",
                        callback: function() {
                            item.destroy({
                                success: function () {
                                    $.notifications.display({
                                        type: 'success',
                                        content: 'Successfully deleted!',
                                        timeout: Config.NotificationSettings.Timeout
                                    });
                                },
                                error: function (model, response) {
                                    if (response.responseJSON) {
                                        response.responseJSON.forEach(function (entry) {
                                            $.notifications.display({
                                                type: 'error',
                                                content: entry.Message,
                                                timeout: Config.NotificationSettings.Timeout
                                            });
                                        });
                                    }
                                }
                            });
                        }
                    },
                    { title: "Cancel", cssClass: "btn-cancel" }
                ]
            });
        },

        handleGenerateAction: function (e) {
            e.preventDefault();

            var id = $(e.currentTarget.parentElement).attr("id");
            var routerUrl = "generate/".concat(id);

            Backbone.history.navigate(routerUrl, true, true);
        },
       
    });

    return ComponentListView;
});
