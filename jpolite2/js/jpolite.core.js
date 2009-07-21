//jQuery.fn Utility Extensions
$.extend($.fn, {
	rm: function() {
		return this.each(function() {
			this.parentNode.removeChild(this);
		});
	}
});

$.jpolite = {
	_MT: $("#module_template").rm(),
	Header: $("#header"),
	Footer: $("#footer"),
	Tabs: {
		ct: false,				//Current selected tab id
		ht: $("#header_tabs"),	//Header tab container
		tabs: {},				//Hash for tabs, tabs[tab_x_id] == tab_x
		init: function(){
			var t = this.tabs;
			$("li", this.ht).each(function(){
				this.modules = {};
				t[this.id] = this;
			}).click(function(){
				if ($(this).is(".on")) return;
				$.jpolite.Tabs.switchTab(this);
			});
		},
		switchTab: function(tab){
			$(".module:visible").hide();
			$(this.ct).removeClass("on");
			this.ct = tab;
			$(tab).addClass("on");
			$.jpolite.Containers.setLayout();
			$.each(tab.modules, function(i,m){
				$(m).fadeIn();
			});
		},
//		addNewTab: function(id, title) {
//			var tab = $("<li id='" + id + "'>" + title + "</li>")
//						.appendTo(this.ht)
//						.click(function(){$.jpolite.Tabs.switchTab(this)})[0];
//			this.tabs[id] = tab;
//			tab.modules = {};
//		},
		addStaticModule: function(m, tab_id){
			this.tabs[tab_id].modules[m.id] = m;
		}
	},
	Containers: {
		c1:$("#c1"),
		c2:$("#c2"),
		c3:$("#c3"),
		setLayout: function () {
			var x = $.jpolite.Tabs.ct;
			x = _columnLayout[x.id] || _columnLayout._default;
			this.c1.css(x.c1);
			this.c2.css(x.c2);
			this.c3.css(x.c3);
		},
		addModule: function(m) {
			var c = this[m.c];
			var t = $.jpolite.Tabs.tabs[m.t];
			if (!c || !t) return;

			var x = $.jpolite._MT.clone()[0];
			var y = _modules[m.i];
			x.loaded = false;
			x.url = m.url;
			x.tab = m.t;
			x.id = m.i;

			t.modules[m.i] = x;

			$(".moduleTitle", x).text(y.t);
			if (y.c) $(x).addClass(y.c);
			c.prepend(x);
		}
	},
	Modules: {
		// Load layout defined in modules.js
		loadLayout: function() {
			var l = _layout;

			$.each(l.reverse(), function(i,m) {
				var x = _modules[m.i];
				$.jpolite.Containers.addModule(m);
			});
		},
		// Retrieve current layout
		saveLayout: function() {
			return "[" + $(".module", "#main").map(function(){
				return "{i:'" + this.id + "',c:'" + this.parentNode.id + "',t:'" + this.tab +"'}";
			}).get().join(",") + "]";
		
			return s;
		},
		loadStatic: function(){
			$(".module").each(function(){
				var p = this.id.split(":");	//m101:t1
				$.extend(this, {
					id: p[0],
					tab: p[1],
					//url: _modules[p[0]],
					loaded: true
				});
				$.jpolite.Tabs.addStaticModule(this, p[1])
			});
		}
	},

	init: function(){
		this.Tabs.init();
		this.Modules.loadStatic();
		this.Modules.loadLayout();

		$("#header_tabs li").eq(0).click();

		delete this.Tabs.init;
		delete this.Modules.loadStatic;
		delete $.jpolite.init;
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
	$.jpolite.init();
});
