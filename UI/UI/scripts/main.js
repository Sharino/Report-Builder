requirejs.config({
    baseUrl: '',

    //urlArgs: "bust=" + (new Date()).getTime(),

    paths: {
        /* External dependencies */
        'jquery': 'scripts/lib/jquery',
        'underscore': 'scripts/lib/underscore',
        'backbone': 'scripts/lib/backbone',
        'handlebars': 'scripts/lib/handlebars',
        'handlebars-tpl': 'scripts/lib/handlebars-tpl',
        'text': 'scripts/lib/text',
        'jquery-sortable': 'scripts/lib/jquery.sortable',
        'spin': 'scripts/lib/spin',
        'globalize': 'scripts/lib/globalize',
        'moment': 'scripts/lib/moment',
        'moment-2.8.4': 'scripts/lib/moment-2.8.4',
        'Highcharts': 'scripts/lib/highcharts',
        'HighchartsTheme': 'scripts/lib/highcharts-theme',
        'page-split': 'scripts/lib/page-split',

        /* Bootstrap components */
        'bootstrap-modal': 'scripts/lib/bootstrap/bootstrap-modal',
        'bootstrap-tooltip': 'scripts/lib/bootstrap/bootstrap-tooltip',
        'bootstrap-dropdown': 'scripts/lib/bootstrap/bootstrap-dropdown',

        /* Adform dependencies */
        'adform-checkbox': 'scripts/lib/adform/adform-checkbox',
        'adform-select': 'scripts/lib/adform/adform/adform-select',
        'adform-select-group': 'scripts/lib/adform/adform-select-group',
        'adform-notifications': 'scripts/lib/adform/adform-notifications',
        'adform-loader': 'scripts/lib/adform/adform-loader',
        'adform-modal': 'scripts/lib/adform/adform-modal',
        'adform-calendar': 'scripts/lib/adform/adform-calendar.v2.01',
        'adform-date': 'scripts/lib/adform/adform-date',
        'adform-datepicker': 'scripts/lib/adform/adform-datepicker',
        'adform-range-selector': 'scripts/lib/adform/adform-range-selector',

        /* Config dependencies */
        'Config': 'scripts/config/config',

        /* Other */
        'Export': 'scripts/export',
        'MetricDimensionMap': 'scripts/metricDimensionMap',

        /* Base Views */
        'BaseDestructableView': 'scripts/views/baseDestructableView',
        'BaseCompositeView': 'scripts/views/baseCompositeView',

        /* Model dependencies */
        'Component': 'scripts/models/component',
        'Metric': 'scripts/models/metric',
        'Dashboard': 'scripts/models/dashboard',
        'DashboardComponent': 'scripts/models/dashboardComponent',
        'Dimension': 'scripts/models/dimension',
        'Einstein': 'scripts/models/einstein',

        /* Collection dependencies */
        'ComponentCollection': 'scripts/collections/componentCollection',
        'MetricCollection': 'scripts/collections/metricCollection',
        'DashboardCollection': 'scripts/collections/dashboardCollection',
        'DimensionCollection': 'scripts/collections/dimensionCollection',

        /* View dependencies */
        'ComponentView': 'scripts/views/componentView',
        'ComponentListView': 'scripts/views/componentListView',
        'MenuView': 'scripts/views/menuView',
        'MetricView': 'scripts/views/metricView',
        'MetricListView': 'scripts/views/metricListView',
        'GenerateView': 'scripts/views/generateView',
        'ComponentGeneratedView': 'scripts/views/componentGeneratedView',
        'DashboardListView': 'scripts/views/dashboardListView',
        'DashboardView': 'scripts/views/dashboardView',
        'DashboardComponentView': 'scripts/views/dashboardComponentView',
        'KPIView': 'scripts/views/kpiView',
        'TimelineView': 'scripts/views/timelineView',
        'ChartView': 'scripts/views/chartView',
        'TableView': 'scripts/views/tableView',
        'HighchartsTimelineView': 'scripts/views/highchartsTimelineView',
        'HighchartsChartView': 'scripts/views/highchartsChartView',
        'DateFilterView': 'scripts/views/dateFilterView',
        'MessageView': 'scripts/views/messageView',
        'DimensionListView': 'scripts/views/dimensionListView',
        'MetricDimensionView': 'scripts/views/metricDimensionView',
        'ComponentButtonView': 'scripts/views/componentButtonView',

        /* Router dependencies */
        'Router': 'scripts/routers/router'
    },

    shim: {
        'jquery': {
            exports: '$'
        },

        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },

        'underscore': {
            exports: '_'
        },

        "moment-2.8.4": {
            exports: "moment"
        },

        'bootstrap-tooltip': {
            deps: ['jquery']
        },

        'bootstrap-modal': {
            deps: ['jquery']
        },

        'bootstrap-dropdown': {
            deps: ['jquery']
        },

        'spin': {
            deps: ['jquery'],
            exports: 'Spinner'
        },

        'handlebars': {
            exports: 'Handlebars'
        },

        'handlebars-tpl': {
            exports: 'Handlebars'
        },

        'jquery-sortable': {
            deps: ['jquery']
        },

        'adform-loader': {
            deps: ['jquery', 'spin']
        },

        'adform-checkbox': {
            deps: ['jquery']
        },

        'adform-select-group': {
            deps: ['jquery', 'adform-checkbox', 'handlebars', 'bootstrap-tooltip'],
            exports: 'AdformSelect'
        },

        'adform-notifications': {
            deps: ['jquery', 'backbone', 'underscore']
        },
        'adform-datepicker': {
            deps: ['globalize', 'moment', 'adform-calendar', 'adform-date']
        },
        'adform-calendar': {
            deps: ['jquery'],
        },

        'adform-modal': {
            deps: ['bootstrap-modal', 'spin']
        },

        'adform-range-selector': {
            deps: ['globalize', 'moment', 'adform-calendar', 'adform-date', 'handlebars'],
            exports: 'Adform.RangeSelector'
        },

        'HighchartsTheme': {
            deps: ['Highcharts'],
            exports: 'HighchartsTheme'
        },

        'Highcharts': {
            deps: ['jquery'],
            exports: "Highcharts"
        },

        'page-split': {
            deps: ['jquery'],
            exports: "jquery"
        },

        'Export': {
            exports: "Export"
        }
    }
});


require(['Router', 'Config', 'adform-loader', 'page-split'],
    function (Router, Config) {
        var app = new Router();
        Backbone.history.start();
    });
