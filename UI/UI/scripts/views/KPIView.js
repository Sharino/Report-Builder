﻿define('KPIView', [
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
            this.initEinstein('2014-01-01', '2014-01-02');
        },
        generateNewData: function () {

            var startDate = $("#picker").find("input")[0].value;
            var endDate = $("#picker2").find("input")[0].value;
            if (startDate <= endDate) {
//                alert(startDate + ' <> ' + endDate);
                this.initEinstein(startDate, endDate);
            } else {
                alert('Suds');
            }

            return true;
        },

        initEinstein: function (start, end) {
            var metrics = this.model.get("Metrics");
         
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
            });

            var einstein = new Einstein({
                Metrics: metricMnemonics,
                Dimensions: [],
                Filters: {
                    "DateFilter": {
                        "From": start,
                        "To": end
                    }
                }
            });
            console.log(einstein);
            this.workEinstein(einstein);
        },
        workEinstein: function (stoneAlone) {
            var self = this;
            stoneAlone.fetch({
                //data: metricMnemonics,
                url: 'http://37.157.0.42:33896/api/Einstein/' + JSON.stringify(stoneAlone),
                type: "GET",
                //dataType: 'text',
                // contentType: 'application/json', //'application/x-www-form-urlencoded',
                success: function (response) {
                    console.log("RESPONSE IS JUST BELOW ME");
                    console.log(response);
                    console.log(JSON.stringify(response.attributes));
                    self.render(response.attributes.ComponentValues[0]);
     
                },
                error: function (error) {
                    console.log("Stone Alone FAIL");
                    console.log(error);
                }
            });
           
﻿        },

        render: function (einstein) {
            
            if (!einstein)
                einstein = 'garbage';

            console.log("EINSTEIN IS JUST BELOW ME");
            console.log(einstein);


            this.$el.html(this.template({
                Einstein: einstein,
                Metrics: this.model.get('Metrics'),
                model: this.model.toJSON(),
                Position: this.position || 0
            }));

            this.renderSubview("#date-filter", new DateFilterView());

            return this;
        }
    });


    return KPIView;
});