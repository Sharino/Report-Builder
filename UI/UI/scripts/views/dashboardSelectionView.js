define('DashboardSelectionView', [
    'BaseCompositeView',
    'Component',
    'MetricCollection',
    'MetricListView',
    'KPIView',
    'TableView',
    'TimelineView',
    'ChartView',
    'text!templates/generate.html',
    'DateFilterView',
    'text!templates/selectDashboardList.html',
    'DashboardCollection',
    'DashboardComponent',
    'MessageView',
    'Config',
    'adform-notifications',
    'adform-modal'
], function (BaseCompositeView, Component, MetricCollection, MetricListView, KPIView, TableView, TimelineView, ChartView,
             generateTemplate, DateFilterView, selectDashboardListTemplate, DashboardCollection, DashboardComponent, MessageView, Config) {
    var DashboardSelectionView = BaseCompositeView.extend({
        template: _.template(selectDashboardListTemplate),

        events: {
            'click .dashboard-list-item': 'handleSelectDashboardAction',
            'click .sortable': 'handleSortAction',
            'keyup #dashboards-search': "handleSearchAction"
        },

        initialize: function (model) {
            this.model = model;

            this.collection = new DashboardCollection();

            var self = this;

            this.collection.fetch({
                success: function () {
                    self.render();
                },
                error: function () {
                    console.log("Failed to load dashboard collection");
                }
            });
            
        },

        render: function () {
            this.$el.html(this.template({ Dashboards: this.collection.toJSON() }));

            this.dashboardsModal = $.modal();

            $.modal({
                title: "Select Dashboard",
                body: this.$el,
                className: "form"
            });

            this.delegateEvents();

            return this;
        },

        handleSelectDashboardAction: function (e) {
            var reportComponentId = parseInt(this.model.get("Id"));
            var selectedDashboardId = parseInt(e.currentTarget.id);
            if (!isNaN(reportComponentId) && !isNaN(selectedDashboardId)) {
                $.ajax({
                    url: Config.DashboardComponentSettings.URL + "?dashboardId=" + selectedDashboardId + "&reportComponentId=" + reportComponentId,

                    type: 'post',
                    success: function () {
                        $.notifications.display({
                            type: 'success',
                            content: "Successfully added to Dashboard.",
                            timeout: Config.NotificationSettings.Timeout
                        });
                    },
                    error: function () {
                        $.notifications.display({
                            type: 'error',
                            content: "Could not add to Dashboard.",
                            timeout: Config.NotificationSettings.Timeout
                        });
                    }
                });

                this.dashboardsModal.modal("hide");
                this.dashboardsModal = null; // Kill it. Just in case it lays eggs.
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

        handleSortAction: function (e) {
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

    return DashboardSelectionView;
});
