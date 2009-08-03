/*
 * jQuery extensions to support widgetization actions on newly DOM nodes
 * Applicable to module_content, helper, dynamic content ...
 */
$.extend({
	//Handy method based on Gritter to notify user
	//Can be customized to other libraries
	alert: function(msg) {
		this.gritter.add(msg);
	},

	//Registry of controls dynamically loaded in modules
	_widgetControls:{},
	addControls: function(options) {	//{selector:handler}
		this.extend(this._widgetControls, options);
	},
	widgetize: function() {
		for (s in $._widgetControls) {
			var f = $._widgetControls[s][0],
				p = $._widgetControls[s][1];

			if ($.isArray(p)) f.apply($(s, this), p);
			else f.call($(s, this), p);
		}
	},

	//A message regitry and handling system to handle server side messages
	//Can be used for local messaging as well
	_MsgRegistry: {
		//find out what the target: header, tab#id, helper, container#id, module#id
		jpolite: [],
		//update content of a module
		module: [],
		//find out which XDO to handle, name#url
		resource: [],
		//show some alerts to user (after success)
		msg: [
			function(msg) {
				$.alert({title:'System Notification', text:msg});
				return true;
			}
		]
	},
	registerMsgHandlers: function(handlers) {
		var MR = this._MsgRegistry;
		for (var x in handlers) {
			if (!MR[x]) MR[x]=[];
			MR[x].push(handlers[x])
		}
	},
	handleMessage: function(m) {
		var rv = true;
		for (var k in m) {
			var x = this._MsgRegistry[k];
			if (x) for (var i in x) x[i](m[k])
		};
		return rv;
	},

	//A global event processing mechanism for you to register and process events
	_DOC: $(document),
	bindEvent: function(events){
		for (var e in events) this._DOC.bind(e, events[e]);
	},
	triggerEvent: function(e, data){
		this._DOC.trigger(e, data);
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
	Header: $("#header"),
	Footer: $("#footer"),
	Nav: {
		its: null,			//Collection of tab items
		tabs: {},			//Hash for tabs, tabs[tab_x_id] == tab_x
		c: $("#content"),	//Content
		t1: $.fn.fadeOut,	//Content transition out function
		t2: $.fn.fadeIn,	//Content transition in function

		init: function(cts, its, func, p){
			var t = this.tabs;
			func.call($(cts), p);
			this.its = $(its, cts).each(function(i){
				this.modules = {};
				t[this.id] = this;
			}).click(function(){
				if (!$(this).on()) return;
				$.jpolite.Nav.switchTab(this.id);
			})
		},
		switchTab: function(id){
			var c = this.c,
				x = this.tabs[id],
				t2 = this.t2,
				mv = $(".module:visible");
			var f = function(){
				mv.hide();
				$.jpolite.Content.rePosition(x.id);
				for (var i in x.modules) {
					var m = x.modules[i];
					$(m).show();
					m.loadContent();
				};
				t2.call(c, 900)
			};
			this.t1.apply(c, [500, f])
		},
		getTab: function(id) {
			return this.tabs[id];
		},
		addStaticModule: function(m, tab_id){
			this.tabs[tab_id].modules[m.id] = m;
		}
	},
	Content: {
		_MTS: {}, 		//Module Templates
//		c1: $("#c1"),
//		c2: $("#c2"),
//		c3: $("#c3"),
		moduleActions: {
			loadContent: function(url, forced) {
				var x = this;
				if (typeof url === "boolean") {
					forced = url;
					url = x.url;
				} else url = url || x.url;

				if (!url || (x.loaded && !forced)) return;
				$(".moduleContent", this).load(url, function(){
					$.widgetize.apply(this);
					$.triggerEvent("moduleLoadedEvent", x);
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

		init: function() {
			var x = $("#content > div").sortable({
				connectWith: '.cc',
				handle: '.moduleHeader',
				placeholder: 'ui-sortable-placeholder',
				revert: true
			}).disableSelection()
			.get();
			for (var i in x) this[x[i].id] = $(x[i]);

			x = $(".module_template").get();
			for (i in x){
				var id = x[i].id || '_default';
				this._MTS[id] = $(x[i]).attr("class","module").rm();
			};
			this._MTS.get = function(id) {
				return this[id] ? this[id] : this._default;
			};
			this.loadStatic();
			this.loadLayout();
		},
		rePosition: function (tab_id) {
			var x = $.extend({}, _columnLayout._default, _columnLayout[tab_id]),
				bc = $('body').attr('class') || 'normal';

			if (bc != x.bg) $('body').switchClass(bc, x.bg);
			delete x.bg;
			for (var c in x) this[c].attr('class', 'cc ' + x[c]);
		},
		addModule: function(m) {
			var c = this[m.c], t = $.jpolite.Nav.getTab(m.tab);

			if (!c || !t) return;

			var x = this._MTS.get(m.mt).clone(true)[0];
			$.extend(x, this.moduleActions);
			var y = _modules[m.id];
			x.loaded = false;
			x.url = y.url;
			x.tab = m.tab;
			x.id = m.id;

			t.modules[m.id] = x;

			$(".moduleTitle", x).text(y.t);
			if (y.c) $(x).addClass(y.c);
			c.prepend(x);
			if ($(x).is(':visible')) x.loadContent();
		},
		// Make DIV.module sections preloaded in the page active modules 
		loadStatic: function(){
			var ma = this.moduleActions;
			$(".module").each(function(){
				var p = this.id.split(":");	//m101:t1
				$.extend(this, {
					id: p[0],
					tab: p[1],
					url: _modules[p[0]],
					loaded: true
				}, ma);
				$.widgetize.apply(this);
				$.jpolite.Nav.addStaticModule(this, p[1])
			});
		},

		// Load layout defined in modules.js
		loadLayout: function(url) {
			var l = _moduleLayout.reverse();

			for (var x in l) this.addModule(l[x]);
		},
		// Retrieve current layout
		saveLayout: function() {
			return "[" + $(".module", "#main").map(function(){
				return "{id:'" + this.id + "',c:'" + this.parentNode.id + "',tab:'" + this.tab +"'}";
			}).get().join(",") + "]";
		}
	},

	init: function(){
		this.Content.init();

		delete this.Nav.init;
		delete this.Content.init;
		delete this.Content.loadStatic;
		delete $.jpolite.init;
	},
	gotoTab: function(id) {
		var x;
		if (id) x = this.Nav.tabs[id];
		if (!x) x = this.Nav.its()[0];
		$(x).click();
	}
};
