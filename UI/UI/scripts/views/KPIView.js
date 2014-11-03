define('KPIView', [
    'BaseCompositeView',
    'text!templates/kpi.html',
    'DateFilterView',
    'Einstein',
    'Metric'
], function (BaseCompositeView, KPITemplate, DateFilterView, Einstein, Metric) {

    var KPIView = BaseCompositeView.extend({
        template: _.template(KPITemplate),

        initialize: function (parent, pos) {
            this.model = parent;
            this.position = pos;
        },

        render: function () {
            var metrics = this.model.get("Metrics");
            console.log("Metrics: ", metrics);

            var metricModels = [];
            _.each(metrics, function (metric) {
                metricModels.push(new Metric(metric));
            });

            var complete = _.invoke(metricModels, 'fetch');

            var metricMnemonics = [];
            var self = this;
            $.when.apply($, complete).done(function () {
                _.each(metricModels, function (metric) {
                    metricMnemonics.push(metric.get("Mnemonic"));
                });

                var einstein = new Einstein({
                    Metrics: metricMnemonics,
                    Dimensions: [],
                    Filters: {
                        "DateFilter": {
                            "From": "2011-09-01",
                            "To": "2013-02-01"
                        }
                    }
                });

                console.log(einstein);

                einstein.fetch({
                    //data: metricMnemonics,
                    url: 'http://37.157.0.42:33896/api/Einstein/' + JSON.stringify(einstein),
                    type: "GET",
                    //dataType: 'text',
                    // contentType: 'application/json', //'application/x-www-form-urlencoded',
                    success: function (response) {
                        console.log(metricMnemonics);

                        console.log("Sufecintas einsteinas: ");
                        console.log(JSON.stringify(response.attributes));

                        self.$el.html(self.template({//$(this.el)
                            "Einstein": response.attributes.ComponentValues[0],
                            "Metrics": self.model.get('Metrics'),
                            "model": self.model.toJSON(),
                            "Position": self.position || 0
                        })); // Render Metric list    
                    },
                    error: function (error) {
                        console.log("kaka");
                        console.log(error);
                    }
                });

            });

           

            this.renderSubview("#date-filter", new DateFilterView());

            return this;
        }
    });


    return KPIView;
});


/*define('KPIView', [
    'BaseCompositeView',
    'text!templates/kpi.html',
    'DateFilterView'
], function (BaseCompositeView, KPITemplate, DateFilterView) {

    var KPIView = BaseCompositeView.extend({
        template: _.template(KPITemplate),

        initialize: function (parent, pos) {
            this.parent = parent;
            this.position = pos;
        },

        render: function() {
            this.$el.html(this.template({
                "Metrics": this.parent.get('Metrics'),
                "model": this.parent.toJSON()
            }));
            this.$el.html(this.template({ Position: this.position }));
            this.renderSubview("#date-filter", new DateFilterView());

            return this;
        }
    });
    return KPIView;
});*/