/*
 * jQuery extensions to support widgetization actions on newly DOM nodes
 * Applicable to module_content, helper, dynamic content ...
 */
$.extend({
	AdvControls:{},
	addControls: function(options) {	//{selector:handler}
		$.extend($.AdvControls, options);
	},
	widgetize: function() {
		for (s in $.AdvControls) {
			var f = $.AdvControls[s][0];
			var p = $.AdvControls[s][1];

			if (p && (p.constructor == Array)) f.apply($(s, this), p);
			else f.call($(s, this), p);
		}
	}
});

/*
 * Utility functions added to jQuery.fn
 */
$.fn.extend({
	rm: function() {
		return this.each(function() {
			this.parentNode.removeChild(this);
		});
	},
	on: function() {
		if (this.is(".on")) return false;
		this.siblings(".on").andSelf().toggleClass("on");
		return true;
	}
});

/*
 * JPolite Core Features and Functions
 */
$.jpolite = {
	_doc: $(document),
	_MT: $("#module_template").rm(),
	Header: $("#header"),
	Footer: $("#footer"),
	Nav: {
		ct: false,				//Current selected tab id
		ht: $("#header_tabs"),	//Header tab container
		tabs: {},				//Hash for tabs, tabs[tab_x_id] == tab_x
		init: function(){
			var t = this.tabs;
			$("li", this.ht).each(function(){
				this.modules = {};
				t[this.id] = this;
				$("<b class='hover'></b>").text(this.innerHTML).prependTo(this);
			}).click(function(){
				if ($(this).is(".on")) return;
				$.jpolite.Nav.switchTab(this.id);
			}).hover(
				function(){
					$(".hover", this).stop().animate({opacity:.9},700, 'easeOutSine')
				},
				function(){
					$(".hover", this).stop().animate({opacity:0},700, 'easeOutExpo')
				}
			);
		},
		switchTab: function(id){
			$(".module:visible").hide();
			$(this.ct).removeClass("on");
			var x = this.tabs[id];
			this.ct = x;
			$(x).addClass("on");
			$.jpolite.Containers.setLayout();
			for (i in x.modules) {
				var m = x.modules[i];
				$(m).fadeIn();
				m.loadContent();
			};
		},
//		addNewTab: function(id, title) {
//			var tab = $("<li id='" + id + "'>" + title + "</li>")
//						.appendTo(this.ht)
//						.click(function(){$.jpolite.Nav.switchTab(this)})[0];
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
			var c = $.jpolite.Nav.ct;
			var x = $.extend({}, _columnLayout._default, _columnLayout[c.id]);
			$('body').css(x.bg);
			this.c1.attr('class',x.c1);
			this.c2.attr('class',x.c2);
			this.c3.attr('class',x.c3);
		},
		addModule: function(m) {
			var c = this[m.c];
			var t = $.jpolite.Nav.tabs[m.tab];
			if (!c || !t) return;

			var x = $.jpolite._MT.clone(true)[0];
			$.extend(x, $.jpolite.moduleActions);
			var y = _modules[m.id];
			x.loaded = false;
			x.url = y.url;
			x.tab = m.tab;
			x.id = m.id;

			t.modules[m.id] = x;

			$(".moduleTitle", x).text(y.t);
			if (y.c) $(x).addClass(y.c);
			c.prepend(x);
			if (m.tab == $.jpolite.Nav.ct.id)
				x.loadContent();
		}
	},
	moduleActions: {
		loadContent: function(url, forced) {
			if (url && url.constructor == Boolean) {
				forced = url;
				url = null;
			}
			var x = this;
			var u = (url || this.url);
			if (!u || (this.loaded && !forced)) return;
			$(".moduleContent", this).load(u, function(){
				$.widgetize.apply(this);
				$.jpolite.triggerEvent("moduleLoadedEvent", x);
				x.loaded = true;
			});
		},
		max: function(){
			$(".moduleContent", this).show();
		},
		min: function(){
			$(".moduleContent", this).hide();
		},
		close: function(){
			$(this).rm();
		}
	},
	Layout: {
		// Load layout defined in modules.js
		loadLayout: function() {
			var l = _moduleLayout.reverse();

			for (var x in l) $.jpolite.Containers.addModule(l[x]);
		},
		// Retrieve current layout
		saveLayout: function() {
			return "[" + $(".module", "#main").map(function(){
				return "{i:'" + this.id + "',c:'" + this.parentNode.id + "',t:'" + this.tab +"'}";
			}).get().join(",") + "]";
		
			return s;
		},
		// Make DIV.module sections preloaded in the page active modules 
		loadStatic: function(){
			$(".module").each(function(){
				var p = this.id.split(":");	//m101:t1
				$.extend(this, {
					id: p[0],
					tab: p[1],
					url: _modules[p[0]],
					loaded: true
				});
				$.extend(this, $.jpolite.moduleActions);
				$.widgetize.apply(this);
				$.jpolite.Nav.addStaticModule(this, p[1])
			});
		}
	},

	MessageRegistry: {
		//find out what the target: header, tab#id, helper, container#id, module#id
		jpolite: [],
		//update content of a module
		module: [],
		//find out which XDO to handle, name#url
		//show some alerts to user (after success)
		msg: [
			function(msg) {
				$.jpolite.alert({title:'System Notification', text:msg});
				return true;
			}
		]
	},

	init: function(){
		this.Nav.init();
		this.Layout.loadStatic();
		this.Layout.loadLayout();

		$("#header_tabs li").eq(0).click();

		delete this.Nav.init;
		delete this.Layout.loadStatic;
		delete $.jpolite.init;
	},

	registerMessageHandlers: function(handlers) {
		var MR = this.MessageRegistry;
		for (var obj in handlers) {
			if (!MR[obj]) MR[obj]=[];
			MR[obj].push(handlers[obj])
		}
	},

	handleMessage: function(m) {
		var rv = true;
		for (var k in m) {
			var x = this.MessageRegistry[k];
			if (x) for (var i in x) x[i](m[k])
		};
		return rv;
	},
	
	alert: function(msg) {
		$.gritter.add(msg);
	},
	
	bindEvent: function(events){
		for (var e in events) $.jpolite._doc.bind(e, events[e]);
	},
	
	triggerEvent: function(evt, data){
		this._doc.trigger(evt, data);
	}
};
