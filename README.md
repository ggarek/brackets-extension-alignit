##"Align It!" Extension for [Brackets](http://brackets.io)

[Brackets on GitHub](https://github.com/adobe/brackets)

This [Brackets](http://brackets.io) extension allows you to make some beautiful code alignments of object literals and variable assignments.

### Installation
1. Go to "Help -> Show extension folder" in Brackets menu
2. Clone git repository
>> git clone https://github.com/ggarek/brackets-extension-alignit.git user/alignit

### How To Use
1. Make selection of code range you want to align in the editor
2. Press **"Ctrl+\"** hotkey or go to **"Edit->Align It"** menu item
3. The magic has happend! ^__^

### Usage examples
#####Example #1:
This code snippet:

	var a = "hello";
	var abc = "forget it";
	var isCanceled = false;
	var emptyObj = {};

will be transformed to:

	var a 			= "hello";
	var abc 	    = "forget it";
	var isCanceled  = false;
	var emptyObj 	= {};
		
#####Example #3:
This code snippet:

	var a = "hello",
	    abc = "forget it",
		isCanceled = false,
		emptyObj = {};

will be transformed to:

	var a 			= "hello",
	    abc 		= "forget it",
		isCanceled 	= false,
		emptyObj 	= {};	

##Soon	
#####Example #2:
This code snippet:

	var a = {
	 id : 1,
	 name : "skull",
	 tags : [ "cool", "dark" , "mysterious"],
	};

will be transformed to:

	var a = {
	 id 	: 1,
	 name 	: "skull",
	 tags 	: [ "cool", "dark" , "mysterious"],
	};

IDEA: Smart indent segment on ';'?