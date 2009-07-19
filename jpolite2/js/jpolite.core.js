var jPolite = {
	Header: $("#header"),
	Footer: $("#footer"),
	Tabs: {
		init: function(){
			this.tabs = {};
			var t = this.tabs;
			$("#header_tabs li").each(function(){
				this.modules = {};
				t[this.id] = this;
			}).click(function(){
				$(".module:visible").hide();
				jPolite.Tabs.ct = this;
				$.each(this.modules, function(i,m){
					$(m).show();
				})
			});
		},
		addStaticModule: function(m, tab_id){
			this.tabs[tab_id].modules[m.id] = m;
		}
	},
	Content: {
		c1:$("#c1"),
		c2:$("#c2"),
		c3:$("#c3"),
		setLayout: function (s) {
			this.c1.css(s.c1);
			this.c2.css(s.c2);
			this.c3.css(s.c3);
		},
	},
	Modules: {
		loadStatic: function(){
			$(".module").each(function(){
				var p = this.id.split("#");	//m101#t1
				$.extend(this, {
					id: p[0],
					tab: p[1],
					//url: _modules[p[0]],
					loaded: true
				});
				jPolite.Tabs.addStaticModule(this, p[1])
			});
		}
	},

	init: function(){
		this.Header.extend({
			haha: function(){alert(this.size())},
			hoho: function(){alert(this.length)}
		});
		this.Tabs.init();
		this.Modules.loadStatic();
		delete this.Tabs.init;
		delete jPolite.init;
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
	
$(function(){
	jPolite.init();
	jPolite.Content.setLayout({
		c1:{width:'33%'},
		c2:{width:'33%'},
		c3:{width:'33%'}
	});
});
