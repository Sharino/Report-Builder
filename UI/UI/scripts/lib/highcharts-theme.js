var outputColor = "#26ACF5";
var outputSecondaryColor = "#87CF03";

Highcharts.theme = {
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    symbols: ['circle', 'circle'],
    chart: {
        //renderTo: me.ID + 'container',
        backgroundColor: '#F0FCFF',
        defaultSeriesType: 'line',
        marginRight: 55,
        marginLeft: 55,
        marginBottom: 35,
        animation: false,
        zoomType: 'x',
        resetZoomButton: {
            theme: {
                fill: null,
                stroke: null,
                style: {
                    color: '#4572A7'
                },
                states: {
                    hover: {
                        fill: null,
                        stroke: null,
                        style: {
                            color: '#4572A7',
                            cursor: "pointer"
                        }
                    }
                }
            }
        }
    },
    colors: [outputColor, outputSecondaryColor],
    title: {
        text: null
    },
    plotOptions: {
        enableMouseTracking: false,
        line: {
            shadow: false
        }
     },
    tooltip: {
        shared: true,
        crosshairs: {
            color: '#cbe5f5'
        },
        borderColor: '#CBE5F5',
        borderWidth: 1,
        shadow: false
    },
    legend: {
        enabled: false
    }
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);