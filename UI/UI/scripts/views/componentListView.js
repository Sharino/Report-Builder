define('ComponentListView', [
    'BaseCompositeView',
    'Component',
    'ComponentCollection',
    'MenuView',
    'GenerateView',
    'text!templates/componentList.html',
    'moment-2.8.4',
    'Config'], function (BaseCompositeView, Component, ComponentCollection, MenuView, GenerateView, componentListTemplate, moment, Config) {
        var ComponentListView = BaseCompositeView.extend({
            template: _.template(componentListTemplate),

            events: {
                'click .del': 'handleDeleteAction',
                'click .edit': 'handleEditAction',
                'click .click': 'handleGenerateAction',
                'click .create': 'submitNewComponent',
                'click .sortable': 'handleSortAction',
                'keyup #components-search': "handleSearchAction",
                'click .preview': 'preview',
            },

            initialize: function () {
                if (!this.collection) {
                    this.collection = new ComponentCollection();
                }

                this.collection.on('remove', this.render, this);
                this.collection.on('fetch', this.render, this);

                this.sortType = "initial";
            },

            preview: function(e) {
                e.preventDefault();

                var id = parseInt($(e.currentTarget.parentElement.parentElement).attr("id"));

                var self = this;

                var previewModel = new Component({ Id: id });
                previewModel.fetch({
                    success: function (model) {
                        self.previewView = self.renderSubview('#preview', new GenerateView({ model: model }, "preview"));
                        console.log(model);
                        $.sidePanel({
                            body: self.previewView.$el,
                            header: {
                                title: "Component preview"
                            },
                            resize: false,
                            width: "650px",
                            buttons: [
                                {
                                    title: "Close",
                                    cssClass: "btn-cancel"
                                }
                            ]
                        });
                    },
                    error: function () { }
                });
                this.$el.find(("#pre")).append("<div id='preview'></div>");
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
                $("body").removeClass("component-edit");
                return this;
            },

            submitNewComponent: function () {
                var routerUrl = "create";
                Backbone.history.navigate(routerUrl, true, true);
            },

            handleSortAction: function (e) {
                if ($(e.currentTarget).hasClass("col-type")) {
                    this._sortByType();
                }
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
            },

            handleSearchAction: function(e) {
                var temp = this.collection;
                var query = $("#components-search").val().toLowerCase();

                this.collection = new ComponentCollection(_.filter(this.collection.toJSON(),
                    function(component) {
                        var patt = new RegExp(query);
                        var res = patt.test(component.Title.toLowerCase());

                        if (query === "kpi") {
                            return component.Type === 1 || res;
                        }
                        if (query === "table") {
                            return component.Type === 2 || res;
                        }
                        if (query === "timeline") {
                            return component.Type === 3 || res;
                        }
                        if (query === "chart") {
                            return component.Type === 4 || res;
                        }

                        return res;
                    })
                );

                this.render();
                if (this.collection.length === 0) {
                    $("#components-search-noresults").show();
                } else {
                    $("#components-search-noresults").hide();
                }

                $("#components-search").val(query);
                $("#components-search").focus();

                this.collection = temp;
            },

            _sortByType: function() {
                if (this.sortType !== "typeAsc") {
                    this.collection = new ComponentCollection(_.sortBy(this.collection.toJSON(),
                            function (item) {
                                return item.Type;
                            })
                    );
                    this.sortType = "typeAsc";
                    this.render();

                    this.$el.find("th.col-type").find(".sort-icon").removeClass('adf-icon-small-arrow-down');
                    this.$el.find("th.col-type").find(".sort-icon").addClass('adf-icon-small-arrow-up');
                } else {
                    this.collection = new ComponentCollection(_.sortBy(this.collection.toJSON(),
                            function (item) {
                                return item.Type;
                            }).reverse()
                    );
                    this.sortType = "typeDes";
                    this.render();

                    this.$el.find("th.col-type").find(".sort-icon").removeClass('adf-icon-small-arrow-up');
                    this.$el.find("th.col-type").find(".sort-icon").addClass('adf-icon-small-arrow-down');
                }
            },
            _sortByTitle: function() {
                if (this.sortType !== "nameAsc") {
                    this.collection = new ComponentCollection(_.sortBy(this.collection.toJSON(),
                        function (item) {
                            return item.Title.toLowerCase();
                        })
                    );
                    this.sortType = "nameAsc";
                    this.render();

                    this.$el.find("th.col-title").find(".sort-icon").removeClass('adf-icon-small-arrow-down');
                    this.$el.find("th.col-title").find(".sort-icon").addClass('adf-icon-small-arrow-up');
                } else {
                    this.collection = new ComponentCollection(_.sortBy(this.collection.toJSON(),
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
            _sortByCreationDate: function() {
                if (this.sortType !== "createdAsc") {
                    this.collection = new ComponentCollection(_.sortBy(this.collection.toJSON(),
                            function (item) {
                                return item.SubmissionDate;
                            })
                    );
                    this.sortType = "createdAsc";
                    this.render();

                    this.$el.find("th.col-created").find(".sort-icon").removeClass('adf-icon-small-arrow-down');
                    this.$el.find("th.col-created").find(".sort-icon").addClass('adf-icon-small-arrow-up');
                } else {
                    this.collection = new ComponentCollection(_.sortBy(this.collection.toJSON(),
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
            _sortByModificationDate: function() {
                if (this.sortType !== "modifiedAsc") {
                    this.collection = new ComponentCollection(_.sortBy(this.collection.toJSON(),
                            function (item) {
                                return item.ModificationDate;
                            })
                    );
                    this.sortType = "modifiedAsc";
                    this.render();

                    this.$el.find("th.col-edited").find(".sort-icon").removeClass('adf-icon-small-arrow-down');
                    this.$el.find("th.col-edited").find(".sort-icon").addClass('adf-icon-small-arrow-up');
                } else {
                    this.collection = new ComponentCollection(_.sortBy(this.collection.toJSON(),
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

        return ComponentListView;
    });
