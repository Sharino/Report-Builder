define('ComponentListView', [
    'BaseCompositeView',
    'ComponentCollection',
    'MenuView',
    'text!templates/componentList.html',
    'Config'
], function (BaseCompositeView, ComponentCollection, MenuView, componentListTemplate, Config) {
    var ComponentListView = BaseCompositeView.extend({
        template: _.template(componentListTemplate),

        events: {
            'click .del': 'onDelete',
            'click .gen': 'onGenerate',
            'click .component-list-item>.click': 'onClick',
        },

        initialize: function () {
            if (!this.collection) {
                this.collection = new ComponentCollection();
            }

            this.collection.on('remove', this.render, this);
            this.collection.on('fetch', this.render, this);
        },
        render: function () {
            // TODO: CREATE SEPARATE VIEWS INSTEAD OF THIS STUFF
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

            var id = $(e.currentTarget.parentElement).attr("id");
            var item = this.collection.get(id);

            item.destroy({
                success: function (model, response) {
                    console.log("Delete OK", model, response);
                    $.notifications.display({           
                        type: 'success',
                        content: 'Successfully deleted!',
                        timeout: Config.NotificationSettings.Timeout
                    });
                },
                error: function (model, response) {
                    console.log("Delete Fail", model, response);
                    
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
        },

        onGenerate: function (e) {
            console.log(e);
            e.preventDefault();

            var id = $(e.currentTarget.parentElement).attr("id");
            var routerUrl = "generate/".concat(id);

            Backbone.history.navigate(routerUrl, true, true);
        },
       
    });

    return ComponentListView;
});
