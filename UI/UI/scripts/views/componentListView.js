define('ComponentListView', [
    'BaseCompositeView',
    'Component',
    'ComponentCollection',
    'MenuView',
    'text!templates/componentList.html',
    'Config'], function (BaseCompositeView, Component, ComponentCollection, MenuView, componentListTemplate, Config) {
    var ComponentListView = BaseCompositeView.extend({
        template: _.template(componentListTemplate),
     
        events: {
            'click .del': 'handleDeleteAction',
            'click .edit': 'handleEditAction',
            'click .click': 'handleGenerateAction',
            'click .create': 'submitNewComponent',
            'click .sortable': 'handleSortAction'
        },

        initialize: function () {
            if (!this.collection) {
                this.collection = new ComponentCollection();
            }

            this.collection.on('remove', this.render, this);
            this.collection.on('fetch', this.render, this);

            this.sortType = "initial";
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

        submitNewComponent: function () {
            var routerUrl = "create";
            Backbone.history.navigate(routerUrl, true, true);
        },
        
        handleSortAction: function(e) {
            if ($(e.currentTarget).hasClass("col-type")) {
                if (this.sortType !== "typeAsc") {
                    this.collection = new ComponentCollection(_.sortBy(this.collection.toJSON(),
                            function(item) {
                                return item.Type;
                            })
                    );
                    this.sortType = "typeAsc";
                    this.render();

                    this.$el.find("th.col-type").find(".sort-icon").removeClass('adf-icon-small-arrow-down');
                    this.$el.find("th.col-type").find(".sort-icon").addClass('adf-icon-small-arrow-up');
                } else {
                    this.collection = new ComponentCollection(_.sortBy(this.collection.toJSON(),
                            function(item) {
                                return item.Type;
                            }).reverse()
                    );
                    this.sortType = "typeDes";
                    this.render();

                    this.$el.find("th.col-type").find(".sort-icon").removeClass('adf-icon-small-arrow-up');
                    this.$el.find("th.col-type").find(".sort-icon").addClass('adf-icon-small-arrow-down');
                }
                if (this.sortType !== "nameAsc") {

                } else {
                    
                }
            }
        },

        handleEditAction: function (e) {
            e.preventDefault();

            var id = parseInt($(e.currentTarget.parentElement.parentElement).attr("id"));

            if (!isNaN(id)) {
                var routerUrl = "create/".concat(id);

                Backbone.history.navigate(routerUrl, true, true);
            }
        },

        handleGenerateAction: function (e) {
            e.preventDefault();

            var id = parseInt($(e.currentTarget.parentElement).attr("id"));

            if (!isNaN(id)) {
                var routerUrl = "generate/".concat(id);
                Backbone.history.navigate(routerUrl, true, true);
            }
        },

        handleDeleteAction: function (e) {
            e.preventDefault();

            var id = parseInt($(e.currentTarget.parentElement.parentElement).attr("id"));

            if (!isNaN(id)) {
                var item = this.collection.get(id);

                $.modal({
                    title: "Confirmation",
                    body: "Do you really want to delete this report component?",
                    buttons: [
                        {
                            title: "Yes",
                            cssClass: "btn-success",
                            callback: function () {
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
            }
        }

       
    });

    return ComponentListView;
});
