define('Tests', [
    'jquery',
    'underscore',
    'backbone',
	'Report'
], function ($, _, Backbone, Report) {
	module( "Backbone.Model=>Report Initialization Tests" );
	  test("Can be instantiated with correct default values", function() {
		  // Number of Assertions we Expect
		  expect( 7 );

		  // Instantiate Local Contact Backbone Model Object
		  var rep = new Report();

		  // Default Attribute Value Assertions
		  equal( rep.get("title"), "", "The title is an empty string." );
		  equal( rep.get("id"), null, "id is not defined." );
		  equal( rep.get("type"), 0, "Type is 0.");
		  equal( rep.get("metrics"), 0, "Metrics are empty.");
		  equal( rep.get("dimensions"), 0, "Dimensions are empty.");
		  equal( rep.get("filters"), 0, "Filters are empty.");
		  equal( rep.isNew(), true, "Model is new. Meaning it is not saved on server a.k.a. does not have an id set up yet.");
	  });
	module( "Backbone.Model=>Report Setting Tests" );
	  test("Can be set up with title: \"Lorem ipsum\", type: 5", function() {
		  // Number of Assertions we Expect
		  expect( 3 );

		  // Instantiate Local Contact Backbone Model Object
		  var rep = new Report({title: "Lorem ipsum", type: 5});

		  // Default Attribute Value Assertions
		  equal( rep.get("title"), "Lorem ipsum", "The title is set." );
		  equal( rep.get("id"), null, "Id is not defined." );
		  equal( rep.get("type"), 5, "Type is set to 5.");
	  });
});