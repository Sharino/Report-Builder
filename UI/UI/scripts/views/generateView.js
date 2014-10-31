define('GenerateView', [
    'BaseCompositeView',
    'Component',
    'MetricCollection',
    'MetricListView',
    'KPIView',
    'text!templates/generate.html',
    'DateFilterView',
    'adform-notifications',
    'adform-modal'

], function (BaseCompositeView, Component, MetricCollection, MetricListView, KPIView, generateTemplate, DateFilterView) {
    var GenerateView = BaseCompositeView.extend({
        template: _.template(generateTemplate),

        events: {
            'click #generate-submit': 'submit',
        },

        render: function () {
            this.$el.html(this.template());

            this.renderSubview("#date-filter", new DateFilterView());

            switch (this.model.get("Type")) {
                case 0:
                {
                    this.renderSubview(("#component-by-type"), new KPIView(this.model, 0));
                    break;
                }
                case 1:
                {
                    this.renderSubview(("#component-by-type"), new KPIView(this.model, 0));
                    break;
                }
                case 2:
                {
                    break;
                }
                case 3:
                {
                    break;
                }
                case 4:
                {
                    break;
                }
            }



            return this;
        },

        submit: function () {
            console.log(this.model.toJSON());

            $.modal();

            return false;
        }
    });

    return GenerateView;
});
