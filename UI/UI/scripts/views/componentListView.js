define('ComponentListView', [
    'jquery',
    'underscore',
    'backbone',
    'ComponentCollection',
    'text!templates/componentList.html',
    'adform-notifications'
], function ($, _, Backbone, ComponentCollection, componentListTemplate, AdformNotification) {
    var ComponentListView;

    ComponentListView = Backbone.View.extend({
        template: _.template(componentListTemplate),

        events: {
            'click .component-list-item>.del': 'onDelete',
            'click .component-list-item>.click': 'onClick',
        },

        initialize: function () {
            if (this.collection) {
                this.collection.on('remove', this.render, this);
                this.collection.on('fetch', this.render, this);
            }
            else {
                this.collection = new ComponentCollection();
                this.collection.on('remove', this.render, this);
                this.collection.on('fetch', this.render, this);
            }
            //this.render;
        },
        render: function () {
            var templVariables = {
                "data": {
                    "viewTitle": "",
                    "activeNew": "",
                    "activeList": ""
                }
            };

            if (this.collection) {
                templVariables["activeNew"] = '';
                templVariables["activeList"] = 'class="active"';
                this.$el.html(this.template({
                    "Components": this.collection.toJSON(),
                    "data": templVariables
                }));
            }
            else {
                templVariables["activeNew"] = '';
                templVariables["activeList"] = 'class="active"';
                this.$el.html(this.template({
                    "Components": [],
                    "data": templVariables
                }));
            }
            return this;
        },
        
        onClick: function (e) {
            console.log(e);
            e.preventDefault();

            var id = $(e.currentTarget).attr("id");
            var routerUrl = "create/".concat(id);

            Backbone.history.navigate(routerUrl, true, true);
        },

        onDelete: function (e) {
            console.log(e);
            e.preventDefault();

            var id = $(e.currentTarget).attr("id");
            var item = this.collection.get(id);

            item.destroy({
                success: function (model, response) {
                    console.log("Delete OK", model, response);
                    AdformNotification.display({            // Show Adform notification. See AformNotification(adform-notifications) dependency.
                        type: 'success',
                        content: 'Successfully deleted!',
                        timeout: 5000
                    });
                },
                error: function (model, response) {
                    console.log("Delete Fail", model, response);
                    // For each error message entry display notification with message.
                    response.responseJSON.forEach(function (entry) {
                        AdformNotification.display({       // Show Adform notification.
                            type: 'error',
                            content: entry.Message,        // Shows message from server
                            timeout: 5000
                        });
                    });
                }
            });
        }
       
    });

    return ComponentListView;
});
