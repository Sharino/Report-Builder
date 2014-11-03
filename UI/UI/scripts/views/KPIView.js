define('KPIView', [
    'BaseCompositeView',
    'text!templates/kpi.html',
    'DateFilterView',
    'Einstein',
    'Metric'
], function (BaseCompositeView, KPITemplate, DateFilterView, Einstein, Metric) {

    var KPIView = BaseCompositeView.extend({
        template: _.template(KPITemplate),

        events: {
            'click #generateByDate': 'generateNewData',
        },

        initialize: function (parent, pos) {
            this.model = parent;
            this.position = pos;
        },

        render: function () {
            var einstein = new Einstein({
                Metrics: this.getMnemonics(this.model.get("Metrics")),
                Dimensions: [],
                Filters: {
                    "DateFilter": {
                        "From": "2012-09-01",
                        "To": "2013-02-01"
                    }
                }
            });

            var self = this;
            einstein.fetch({
                url: 'http://37.157.0.42:33896/api/Einstein/' + JSON.stringify(einstein),

                type: "GET",

                success: function (response) {
                    console.log("Sufecintas einsteinas: ");
                    console.log(JSON.stringify(response.attributes));
                    console.log(self.model.get("Metrics"));

                    self.$el.html(self.template({//$(this.el)
                        "Einstein": response.get("ComponentValues")[0],
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

            this.renderSubview("#date-filter", new DateFilterView());
            
            

            return this;
        },

        generateNewData: function () {

            var startDate = $("#picker").find("input")[0].value;
            var endDate = $("#picker2").find("input")[0].value;
            if (startDate <= endDate) {
                alert('validi');
            } else {
                alert('Suds');
            }
        
            return true;
        },

        getMnemonics: function (metrics) {
            var metricMnemonics = [];

            _.each(metrics, function (metric) {
                var newMetric = new Metric(metric);
                metricMnemonics.push(newMetric.get("Mnemonic"));
            });

            return metricMnemonics;
        },

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