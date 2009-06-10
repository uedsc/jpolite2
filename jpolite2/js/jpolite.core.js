var jPolite = {
	_Header: $("#header"),
	_Footer: $("#footer"),
	_Tabs: $("#header_tabs"),
	_Main: $("#main"),
	_Containers: $(".main_containers"),
	_Modules: $(".module"),

	changeLayout: function () {
		//Apply on _Main and/or _Containers
	},

	handleMessage: function(m) {
		//Process message from server side
	}
};

/*
 * jQuery extensions to support widgetization actions on newly DOM node
 * Applicable to module_content, helper, dynamic generated stuff ...
 */
$.extend({
	LiveControl:{},
	AdvControls:{},
	addLiveControl: function(selector, event, handler) {
		$(selector).live(event, handler);
		$.LiveControls[selector] = {e:event, h:handler};
	},
	addAdvControls: function(options) {	//{selector:handler}
		$.extend($.AdvControls, options);
	}
});

$.fn.extend({
	widgetize: function() {
		return this.each(function() {
			x = this;
			$.each($.AdvControls, function(selector,handler){
				handler.apply($(selector, x));
			})
		});
	}
});

/*
 * XML Data Object, cache+view layer for server side resources
 * with Embedded RESTful resource discovery mechanism
 * Currently only support JSON formatted data
 */
var XDO = {
	XDOS: {},
	UIOS: {},

	handleMessage: function(m) {
		//Process message from server side
	}
};

/*
 * Document Object and surpporting functions for Event Processing and beyond
 * Custom Event Registration & Hooking also Supported
 */
function DOC(){
	this._doc = $(document);
	
	function MessageHandler(json){
		switch (json.target) {
			case 'module': //update content of a moduke
				break;
			case 'jpolite': //find out what the target: header, tab#id, helper, container#id, module#id
				break;
			case 'resource': //find out which XDO to handle, name#url
				break;
			case 'message': //show some alerts to user
				break;
			case 'errors': //Prompt user about errors
				break;
		};
	};
};
	
$(function(){});
