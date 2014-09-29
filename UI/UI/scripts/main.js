requirejs.config({
    //By default load any module IDs from scripts/lib
    baseUrl: '',
    paths: {
        'jquery': 'scripts/lib/jquery',
        'underscore': 'scripts/lib/underscore',
        'backbone': 'scripts/lib/backbone',
        'handlebars': 'scripts/lib/handlebars',
        'bootstrap': 'scripts/lib/bootstrap',
        'Tests': 'tests',
        'jquery-sortable': 'scripts/lib/jquery.sortable',
        'adform-checkbox': 'scripts/lib/adform-checkbox',
        'adform-select': 'scripts/lib/adform-select',
        'App': 'scripts/models/app',
        'Router' : 'scripts/routers/router',
        'Component': 'scripts/models/component',
        'ComponentCollection': 'scripts/collections/componentCollection',
        'ComponentView': 'scripts/views/componentView',
        'ComponentListView': 'scripts/views/componentListView',
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'backbone'
        },
        'underscore': {
            exports: '_'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        'jquery-sortable': {
            deps: ['jquery']
        },
        'adform-select': {
            deps: ['backbone', 'handlebars']
        },
        'backbone-forms': {
            deps: ['backbone', 'jquery']
        }
    }
});


require(['App', 'Component', 'ComponentCollection', 'ComponentView', 'ComponentListView'],
    function (App, Component, ComponentCollection, ComponentView, ComponentListView) {

    App.initialize();

    var tempComponentModel = new Component();

    var componentView = new ComponentView({
        model: tempComponentModel
    });

    componentView.render();


    var compList = new ComponentCollection;

    compList.fetch({
        success: function (model, response) {
            console.log(compList.toJSON());
            console.log("GET fetch GetAll- success", model, response);
            var componentListView = new ComponentListView({ collection: compList });
            componentListView.render();
        },
        error: function (model, response) {
            console.log("GET fetch GetAll - error", model, response);
        }
    });
    








    /*var newReport = new Report({ Title: "The new title" });
    newReport.save({}, {
        success: function (model, response) {
            console.log("a POST save - success", model, response);
        },
        error: function (model, response) {
            console.log("a POST save - error", model, response);
        }
    });*/

    /*
	var a = new Report;
    a.set({Title:"Test Obj1"});

	a.save({}, {
		success: function (model, response) {
			console.log("a POST save - success", model, response);
		},
		error: function (model, response) {
			console.log("a POST save - error", model, response);
		}
	});
	a.save({}, {
		success: function (model, response) {
			console.log("a POST save - success", model, response);
		},
		error: function (model, response) {
			console.log("a POST save - error", model, response);
		}
	});
    //console.log(a.toJSON());
	//a.save();
	/*
	console.log("a isNew() " + a.isNew());
    
	a.save({}, {
		success: function (model, response) {
			console.log("a POST save - success", model, response);
		},
		error: function (model, response) {
			console.log("a POST save - error", model, response);
		}
	});
	
	var b = new Report;
    b.set({title:"Test Obj2", id: 0});
    //console.log(a.toJSON());
	//a.save();
	
	console.log("b isNew() " + b.isNew());
    
	b.save({}, {
		success: function (model, response) {
			console.log("b PUT save - success", model, response);
		},
		error: function (model, response) {
			console.log("b PUT save - error", model, response);
		}
	});
	
	
	
	a.set({id: 9});
	a.fetch({
		success: function (model, response) {
			console.log("a GET fetch - success", model, response);
		},
		error: function (model, response) {
			console.log("a GET fetch - error", model, response);
		}
	});
	*/
	
/*
	var Reports = new ReportCollection;
    
    Reports.fetch({
        success: function (model, response) {
            //console.log(Reports.toJSON());
            console.log("GET fetch GetAll- success", model, response);
        },
        error: function (model, response) {
            console.log("GET fetch GetAll - error", model, response);
        }
    });
    
	var c = new Report({title: "012345678901234567890123456789perilgas"});
	
	c.save({}, {
        success: function (model, response) {
            console.log("save TOO LONG - success", model, response);
        },
        error: function (model, response) {
            console.log("save TOO LONG - error", model, response);
        }
    });
	
	/*var reportView = new ReportView({
        el: 'body',
        model: a
    });

    reportView.render();
	/*
	var form = new Backbone.Form({
				template: _.template($("#reportTemplate").html()),
				model: a, //defined elsewhere
				templateData: {title: 'Edit profile'}
			});
    
	form.render();
	*/
 /*
    setTimeout(function () {
       console.log(Reports.toJSON());
    }, 5000);
    */
	
/*
    a.save({}, {
        success: function (model, response) {
            console.log("save - success", model, response);
        },
        error: function (model, response) {
            console.log("save - error", model, response);
        }
    });
	
    //return Reports;
	/*
	var a = new Report();
			a = this.model;
			console.log(a.toJSON());
			
			a.save(a.toJSON(), {
				success: function (model, response) {
					console.log("save - success", model, response);
				},
				error: function (model, response) {
					console.log("save - error", model, response);
				}
			});
	*/
	
	//var a = new Report;
    //a.set({"id":"666"});
    //console.log(a.toJSON());
    
    /*a.save({}, {
        success: function (model, response) {
            console.log("save - success", model, response);
        },
        error: function (model, response) {
            console.log("save - error", model, response);
        }
    });*/
	
	/*a.fetch({
        success: function (model, response) {
            console.log("fetch - success", model, response);
			console.log(a.toJSON());
        },
        error: function (model, response) {
            console.log("fetch - error", model, response);
			console.log(a.toJSON());
        }
    });*/
	
	
});