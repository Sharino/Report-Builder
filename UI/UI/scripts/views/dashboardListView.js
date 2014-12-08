define('DashboardListView', [
    'BaseCompositeView',
    'Dashboard',
    'DashboardCollection',
    'text!templates/dashboardList.html',
    'text!templates/dashboardCreate.html',
    'adform-notifications',
    'Config',
    'adform-modal'
], function (BaseCompositeView, Dashboard, DashboardCollection, dashboardListTemplate, DashboardCreate, AdformNotification, Config) {
    var DashboardListView = BaseCompositeView.extend({
        template: _.template(dashboardListTemplate),

        events: {
            'click .create': 'submitNewDashboard',
            'click .click': 'handleClickAction',
            'click .sortable': 'handleSortAction',
            'click .del': 'handleDeleteAction',
            'keyup #dashboards-search': "handleSearchAction",
            'click .component-preview': 'preview',
        },

        initialize: function () {
            if (!this.collection) {
                this.collection = new DashboardCollection();
            }
            this.collection.on('remove', this.render, this);
            this.collection.on('fetch', this.render, this);

            this.sortType = "initial";
        },

        preview: function() {
            alert("s");


        },

        render: function () {
            this.$el.html(this.template({ "Dashboards": this.collection.toJSON() }));
            $("body").removeClass("component-edit");
            return this;
        },

        submitNewDashboard: function () {
            $.modal({
                title: "Create Dashboard",
                body: DashboardCreate,
                buttons: [
                    {
                        title: "Submit",
                        cssClass: "btn-success",
                        callback: function () {
                            var tempDashboard = new Dashboard({ Title: $("#dashboard-title").val() });

                            tempDashboard.save({}, {
                                success: function (model, response) {
                                    $.notifications.display({
                                        type: 'success',
                                        content: "New Dashboard was successfully created",
                                        timeout: Config.NotificationSettings.Timeout
                                    });

                                    Backbone.history.navigate("dashboard/" + model.get("Id"), { trigger: true });
                                },
                                error: function () {
                                    $.notifications.display({
                                        type: 'error',
                                        content: "Error",
                                        timeout: Config.NotificationSettings.Timeout
                                    });
                                }
                            });
                        }
                    },
                    {
                        title: "Cancel",
                        cssClass: "btn-cancel",
                        id: "modalCancel"
                    }
                ],
                className: "form"
            });
        },

        handleClickAction: function (e) {
            e.preventDefault();

            var id = $(e.currentTarget.parentElement).attr("id");
            var routerUrl = "dashboard/".concat(id);

            Backbone.history.navigate(routerUrl, true, true);
        },

        handleSortAction: function(e) {
            if ($(e.currentTarget).hasClass("col-title")) {
                this._sortByTitle();
            }
            if ($(e.currentTarget).hasClass("col-created")) {
                this._sortByCreationDate();
            }
            if ($(e.currentTarget).hasClass("col-edited")) {
                this._sortByModificationDate();
            }
        },

        handleSearchAction: function (e) {
            var temp = this.collection;
            var value = $("#dashboards-search").val();
            var query = value.toLowerCase();

            this.collection = new DashboardCollection(_.filter(this.collection.toJSON(),
                function (dashboard) {
                    var patt = new RegExp(query);
                    var res = patt.test(dashboard.Title.toLowerCase());

                    return res;
                })
            );

            this.render();
            if (this.collection.length === 0) {
                $("#dashboards-search-noresults").show();
            } else {
                $("#dashboards-search-noresults").hide();
            }

            $("#dashboards-search").val(value);
            $("#dashboards-search").focus();

            this.collection = temp;
        },

        handleDeleteAction: function (e) {
            e.preventDefault();

            var id = parseInt($(e.currentTarget.parentElement.parentElement).attr("id"));
            var dashboard = this.collection.get(id);

            $.modal({
                title: "Confirmation",
                body: "Do you really want to delete this dashboard?",
                buttons: [
                    {
                        title: "Yes",
                        cssClass: "btn-success",
                        callback: function() {
                            dashboard.destroy({
                                success: function (result) {
                                    $.notifications.display({
                                        type: 'success',
                                        content: 'Successfully deleted!',
                                        timeout: Config.NotificationSettings.Timeout
                                    });
                                },
                                error: function (response) {
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
                    {
                        title: "Cancel",
                        cssClass: "btn-cancel",
                        callback: function() {
                            this.hide();
                        }
                    }
                ]
            });
            this.render();
        },

        _sortByTitle: function () {
            if (this.sortType !== "nameAsc") {
                this.collection = new DashboardCollection(_.sortBy(this.collection.toJSON(),
                        function (item) {
                            return item.Title.toLowerCase();
                        })
                );
                this.sortType = "nameAsc";
                this.render();

                this.$el.find("th.col-title").find(".sort-icon").removeClass('adf-icon-small-arrow-down');
                this.$el.find("th.col-title").find(".sort-icon").addClass('adf-icon-small-arrow-up');
            } else {
                this.collection = new DashboardCollection(_.sortBy(this.collection.toJSON(),
                    function (item) {
                        return item.Title.toLowerCase();
                    }).reverse()
                );
                this.sortType = "nameDes";
                this.render();

                this.$el.find("th.col-title").find(".sort-icon").removeClass('adf-icon-small-arrow-up');
                this.$el.find("th.col-title").find(".sort-icon").addClass('adf-icon-small-arrow-down');
            }
        },
        _sortByCreationDate: function () {
            if (this.sortType !== "createdAsc") {
                this.collection = new DashboardCollection(_.sortBy(this.collection.toJSON(),
                        function (item) {
                            return item.SubmissionDate;
                        })
                );
                this.sortType = "createdAsc";
                this.render();

                this.$el.find("th.col-created").find(".sort-icon").removeClass('adf-icon-small-arrow-down');
                this.$el.find("th.col-created").find(".sort-icon").addClass('adf-icon-small-arrow-up');
            } else {
                this.collection = new DashboardCollection(_.sortBy(this.collection.toJSON(),
                        function (item) {
                            return item.SubmissionDate;
                        }).reverse()
                );
                this.sortType = "createdDes";
                this.render();

                this.$el.find("th.col-created").find(".sort-icon").removeClass('adf-icon-small-arrow-up');
                this.$el.find("th.col-created").find(".sort-icon").addClass('adf-icon-small-arrow-down');
            }
        },
        _sortByModificationDate: function () {
            if (this.sortType !== "modifiedAsc") {
                this.collection = new DashboardCollection(_.sortBy(this.collection.toJSON(),
                        function (item) {
                            return item.ModificationDate;
                        })
                );
                this.sortType = "modifiedAsc";
                this.render();

                this.$el.find("th.col-edited").find(".sort-icon").removeClass('adf-icon-small-arrow-down');
                this.$el.find("th.col-edited").find(".sort-icon").addClass('adf-icon-small-arrow-up');
            } else {
                this.collection = new DashboardCollection(_.sortBy(this.collection.toJSON(),
                        function (item) {
                            return item.ModificationDate;
                        }).reverse()
                );
                this.sortType = "modifiedDes";
                this.render();

                this.$el.find("th.col-edited").find(".sort-icon").removeClass('adf-icon-small-arrow-up');
                this.$el.find("th.col-edited").find(".sort-icon").addClass('adf-icon-small-arrow-down');
            }
        }
    });

    return DashboardListView;
});
