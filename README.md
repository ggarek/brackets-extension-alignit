##AlignIt Extension for brackets

This extension allows you to make some beautiful code alignments, e.g.

#####Example #1:
This code snippet:

	var a = "hello";
	var abc = "forget it";
	var isCanceled = false;
	var emptyObj = {};

will transform into:

	var a 			= "hello";
	var abc 	    = "forget it";
	var isCanceled  = false;
	var emptyObj 	= {};
	
	
#####Example #2:
This code snippet:

	var a = {
	 id : 1,
	 name : "skull",
	 tags : [ "cool", "dark" , "mysterious"],
	};

will transform into:

	var a = {
	 id 	: 1,
	 name 	: "skull",
	 tags 	: [ "cool", "dark" , "mysterious"],
	};
	
	
#####Example #3:
This code snippet:

	var a = "hello",
	    abc = "forget it",
		isCanceled = false,
		emptyObj = {};

will transform into:

	var a 			= "hello",
	    abc 		= "forget it",
		isCanceled 	= false,
		emptyObj 	= {};
	
	
IDEA: Smart indent segment on ';'?