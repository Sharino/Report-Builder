// TODO: Due to be fully implemented, probably next sprint

define('MenuView', [
    'BaseCompositeView'
], function (BaseCompositeView) {
    var MenuView = BaseCompositeView.extend({
        el: $('#menu'),
        template: _.template($("#menu-template").html()),

        initialize: function () {
            this.render;
        },

        render: function () {
            var templVariables = {
                "data": {
                    "activeNew": "",
                    "activeList": ""
                }
            };

            if (this.model.isNew()) {
                templVariables["data"]["activeNew"] = 'class="active"';
            } else {
            }

            this.$el.html(this.template(templVariables));
            return this;
        }
    });

    return MenuView;
});
