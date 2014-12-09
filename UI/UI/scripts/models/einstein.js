define('Einstein', [
   'jquery',
   'underscore',
   'backbone',
   'Metric',
   'Dimension',
   'Config'
], function ($, _, Backbone, Metric, Dimension, Config) {
    var Einstein = Backbone.Model.extend({
        urlRoot: Config.EinsteinSettings.URL,// + JSON.stringify(this.Metrics + this.Dimensions + this.Filters),
        idAttribute: "Id",
        defaults: function () {
            this.set({
                Metrics: [],
                Dimensions: [],
                Filters: {}
            });
        },

        /******************************************KPI*************/
        /*
            Note to myself: Cia padaryta, kad i filtrus ikisam kazka pagal datas. Ok.
            Bet.. Datos gali pareit is pacio Component.Filters[], cia veliau.
        */

        initialize: function (data) {
            this._cleanUp();

            this.set({ Filters: { DateFilter: { From: data.Start, To: data.End } } });
            this.set({ Metrics: this._getMnemonics(data.Model.Metrics) });
            this.set({ Dimensions: this._getMnemonics(data.Model.Dimensions) });
        },

        _cleanUp: function() {
            this.unset("Model");
            this.unset("Start");
            this.unset("End");
        },

        _getMnemonics: function (metrics) {
            var metricMnemonics = [];

            _.each(metrics, function (metric) {
                var newMetric = new Metric(metric);
                metricMnemonics.push(newMetric.get("Mnemonic"));
            });

            return metricMnemonics;
        },

        //
        //        workEinstein: function (stoneAlone) {
        //            var self = this;
        //
        //            stoneAlone.fetch({
        //                url: Config.EinsteinSettings.URL,
        //                data: JSON.stringify(stoneAlone),
        //                contentType: 'application/json',
        //                dataType: 'json',
        //                type: 'POST',
        //                processData: false,
        //                success: function (response) {
        //                    self.einsteinData = response;
        //                    self.render(response.attributes.ComponentValues[0], response.attributes.Filters.DateFilter);
        //                },
        //            });
        //        },


        /******************************************KPI*************/

        //        initEinstein: function (start, end) {  // Timeline
        //            if (!this.selectedDimension) {
        //                var dimensions = this.model.get("Dimensions");
        //                this.selectedDimension = new Dimension(dimensions[0]);
        //            }
        //
        //            if (!this.selectedMetrics) {
        //                this.selectedMetrics = [];
        //                var metrics = this.model.get("Metrics");
        //                this.selectedMetrics.push(new Metric(metrics[0]));
        //                if (metrics.length > 1) {
        //                    this.selectedMetrics.push(new Metric(metrics[Math.min(1, metrics.length - 1)]));
        //                }
        //            }
        //
        //            var metricMnemonics = [];
        //            for (var i = 0, len = this.selectedMetrics.length; i < len; i++) {
        //                metricMnemonics.push(this.selectedMetrics[i].get("Mnemonic"));
        //            }
        //
        //            var einstein = new Einstein({
        //                Metrics: metricMnemonics,
        //                Dimensions: [this.selectedDimension.get("Mnemonic")],
        //                Filters: {
        //                    "DateFilter": {
        //                        "From": start,
        //                        "To": end
        //                    }
        //                }
        //            });
        //            this.workEinstein(einstein);
        //
        //        },
        //
        //
        //        workEinstein: function (stoneAlone) {
        //
        //            var self = this;
        //
        //            stoneAlone.fetch({
        //                url: Config.EinsteinSettings.URL,
        //                data: JSON.stringify(stoneAlone),
        //                contentType: 'application/json',
        //                dataType: 'json',
        //                type: 'POST',
        //                processData: false,
        //                success: function (response) {
        //                    self.einstein = response.attributes.ComponentValues;
        //                    self.dataFilter = response.attributes.Filters.DateFilter;
        //                    self.render(response.attributes.ComponentValues, response.attributes.Filters.DateFilter);
        //                },
        //                error: function (error) {
        //                    console.log("Stone Alone FAIL");
        //                    console.log(error);
        //                }
        //            });
        //
        //        },

        /************CHART***********************************/

        //        initEinstein: function (start, end) {
        //            if (!this.selectedDimension) {
        //                var dimensions = this.model.get("Dimensions");
        //                this.selectedDimension = new Dimension(dimensions[0]);
        //            }
        //
        //            if (!this.selectedMetrics) {
        //                this.selectedMetrics = [];
        //                var metrics = this.model.get("Metrics");
        //                this.selectedMetrics.push(new Metric(metrics[0]));
        //                if (metrics.length > 1) {
        //                    this.selectedMetrics.push(new Metric(metrics[Math.min(1, metrics.length - 1)]));
        //                }
        //            }
        //
        //            var metricMnemonics = [];
        //            for (var i = 0, len = this.selectedMetrics.length; i < len; i++) {
        //                metricMnemonics.push(this.selectedMetrics[i].get("Mnemonic"));
        //            }
        //
        //            var einstein = new Einstein({
        //                Metrics: metricMnemonics,
        //                Dimensions: [this.selectedDimension.get("Mnemonic")],
        //                Filters: {
        //                    "DateFilter": {
        //                        "From": start,
        //                        "To": end
        //                    }
        //                }
        //            });
        //            this.workEinstein(einstein);
        //
        //        },
        //
        //
        //        workEinstein: function (stoneAlone) {
        //
        //            var self = this;
        //
        //            stoneAlone.fetch({
        //                url: Config.EinsteinSettings.URL,
        //                data: JSON.stringify(stoneAlone),
        //                contentType: 'application/json',
        //                dataType: 'json',
        //                type: 'POST',
        //                processData: false,
        //                success: function (response) {
        //                    self.einstein = response.attributes.ComponentValues;
        //                    self.dataFilter = response.attributes.Filters.DateFilter;
        //                    self.render(response.attributes.ComponentValues, response.attributes.Filters.DateFilter);
        //                },
        //                error: function (error) {
        //                }
        //            });
        //
        //        },

        /******************TABLE*********************************/
        //
        //        initEinstein: function (start, end) {
        //            var metrics = this.model.get("Metrics");
        //            var dimensions = this.model.get("Dimensions");
        //
        //            if (!this.selectedDimension) {
        //                this.selectedDimension = new Dimension(dimensions[0]);
        //                this.selectedDimension.fetch();
        //            }
        //
        //            var metricMnemonics = [];
        //            for (var i = 0, len = metrics.length; i < len; i++) {
        //                var tempMetric = new Metric(metrics[i]);
        //                metricMnemonics.push(tempMetric.get("Mnemonic"));
        //            }
        //
        //            var einstein = new Einstein({
        //                Metrics: metricMnemonics,
        //                Dimensions: [this.selectedDimension.get("Mnemonic")],
        //                Filters: {
        //                    "DateFilter": {
        //                        "From": start,
        //                        "To": end
        //                    }
        //                }
        //            });
        //            this.workEinstein(einstein);
        //
        //        },
        //
        //        workEinstein: function (stoneAlone) {
        //
        //            var self = this;
        //
        //            stoneAlone.fetch({
        //                url: Config.EinsteinSettings.URL,
        //                data: JSON.stringify(stoneAlone),
        //                contentType: 'application/json',
        //                dataType: 'json',
        //                type: 'POST',
        //                processData: false,
        //                success: function (response) {
        //                    self.einstein = response.attributes.ComponentValues;
        //                    self.dataFilter = response.attributes.Filters.DateFilter;
        //                    self.render(self.einstein, self.dataFilter);
        //                },
        //                error: function (error) {
        //                    console.log("Stone Alone FAIL");
        //                    console.log("error:", error);
        //                }
        //            });
        //
        //        },

    });
    // Im about to be wrecked.
    return Einstein;
});