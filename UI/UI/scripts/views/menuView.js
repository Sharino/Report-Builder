define('MenuView', [
    'BaseCompositeView',
    'text!templates/menu.html',
    'Config'
], function (BaseCompositeView, MenuTemplate, Config) {
    var MenuView = BaseCompositeView.extend({
        template: _.template(MenuTemplate),

        render: function () {
            this.$el.html(this.template({ items: Config.MenuSettings.items, active: this.getActive() }));
            return this;
        },

        routeChangedAction: function (route, params) {
            this.menu.setActive(route);
            this.menu.render();
        },

        setActive: function (link) {
            this.active = "#" + link;
        },

        getActive: function () {
            return this.active;
        }
    });

    return MenuView;
});
