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
		$("a[href^=http]", this).attr("target", "_blank");
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
	Nav: {
		its: null,			//Collection of tab items
		tabs: {},			//Hash for tabs, tabs[tab_x_id] => tab_x
		ct:	null,			//Current tab id
		cc: $("#content"),	//Content container
		t1: $.fn.fadeOut,	//Content transition out function
		t2: $.fn.fadeIn,	//Content transition in function

		init: function(cts, its, func, p){
			var t = this.tabs;
			func.call($(cts), p);
			this.its = $(its, cts).each(function(i){
				this.modules = {};
				t[this.id] = this;
				$(this).click(function(){
					if (!$(this).on()) return;
					$.jpolite.Nav.switchTab(this.id);
				})
			});
		},
		switchTab: function(id){
			var cc = this.cc,
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
				t2.call(cc, 900)
			};
			this.ct = id;
			this.t1.apply(cc, [500, f])
		},
		getTab: function(id) {
			return this.tabs[id || this.ct];
		},
		addStaticModule: function(m, tid){
			this.tabs[tid].modules[m.id] = m;
			m.tab = this.tabs[tid]
		},
		removeModule: function(m){
			delete m.tab.modules[m.id];
		}
	},
	Content: {
		_loadLayout: function(){},	//Method to load layout
		_saveLayout: function(){},	//Method to save layout
		MTS: {}, 	//Module Templates
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
			max: function(){ $(".moduleContent", this).show() },
			min: function(){ $(".moduleContent", this).hide() },
			close: function(){
				$(this).rm();
				$.jpolite.Nav.removeModule(this);
				$.jpolite.Content.saveLayout();
			}
		},

		init: function(moduleSortable) {
			var x = $(".cc");
			if (moduleSortable) x.sortable({
				start: function(){
					$(".cc").addClass("dragging")
				},
				stop:  function(e, u){
					$(".cc").removeClass("dragging");
					var m = u.item[0]; 
					if (m.c) m.c = m.parentNode.id;
					$.jpolite.Content.saveLayout();
				},
				connectWith: '.cc',
				tolerance: 'intersect',
				handle: '.moduleHeader',
				placeholder: 'ui-sortable-placeholder',
				revert: true
			});
			x = x.get(); 
			for (var i in x) this[x[i].id] = $(x[i]);

			x = $(".module_template").get();
			for (i in x){
				var id = x[i].id || 0;
				this.MTS[id] = $(x[i]).attr("class","module").rm();
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
		addModule: function(m, t) {
			var c = this[m.c];
			if (!c) return;

			var y = _modules[m.id];
			var x = this.MTS[m.mt || 0].clone()[0];
			$.extend(x, {mc:'', mt:''}, this.moduleActions, m, {
				loaded: false,
				url: y.url,
				tab: t
			});

			t.modules[m.id] = x;

			$(".moduleTitle", x).text(y.t);
			if (m.mc) $(x).addClass(m.mc);
			c.append(x);
			if (t.id == $.jpolite.Nav.ct) {
				$(x).show();
				x.loadContent();
			}
		},
		// Make DIV.module sections preloaded in the page active modules 
		loadStatic: function(){
			var ma = this.moduleActions;
			$(".module").each(function(){
				var p = this.id.split(":");	//m101:t1
				$.extend(this, {
					id: p[0],
					tab: p[1],
					//url: _modules[p[0]],
					loaded: true
				}, ma);
				$.widgetize.apply(this);
				$.jpolite.Nav.addStaticModule(this, p[1])
			});
		},

		// Load layout defined in modules.js
		loadLayout: function() {
			var l = this._loadLayout() || _moduleLayout;

			for (var t in l) {
				var tab = $.jpolite.Nav.getTab(t);
				if (tab) for (var i in l[t]) {
					var s = l[t][i].split(":");
					this.addModule({
						id: s[0],
						c:	s[1],
						mc: s[2] || '',
						mt:	s[3] || ''
					}, tab) 	
				}
			}
		},
		// Retrieve current layout
		saveLayout: function() {
			var r = "{" + $.jpolite.Nav.its.map(function(){
				var t = [], m = this.modules;
				for (var i in m)
					if (m[i].c)		//Skip static modules
						t.push("'".concat(m[i].id, ":", m[i].c, ":", m[i].mc, ":", m[i].mt, "'"));
				
				return "'" + this.id + "':[" + t.toString() + "]";
			}).get().join(",") + "}";
			if (this._saveLayout) this._saveLayout(r);
		}
	},

	init: function(options){
		var s = $.extend({
	 		cts: "#main_nav",
	 		its: "li",
	 		t1: $.fn.fadeOut,
	 		t2: $.fn.fadeIn,
	 		navInit: TraditionalTabs,
	 		navInitArguments: {},
	 		moduleSortable: true
		}, options);

		this.Nav.init(s.cts, s.its, s.navInit, s.navInitArguments);
		this.Nav.t1 = s.t1;
		this.Nav.t2 = s.t2;
		if (s.layoutPersistence) {
			this.Content._loadLayout = s.layoutPersistence[0];
			this.Content._saveLayout = s.layoutPersistence[1];
		}
		this.Content.init(s.moduleSortable);

		delete this.Nav.init;
		delete this.Nav.addStaticModule;
		delete this.Content.init;
		delete this.Content.loadStatic;
		delete $.jpolite.init;
	},
	gotoTab: function(id) {
		$(this.Nav.getTab(id)).click();
	},
	replaceModule: function(col, ids) {
		var x = $(".module:visible", this.Content[col]).get();
		var t = this.Nav.getTab();
		for (var i in x) x[i].close();
		for (i in ids) this.Content.addModule({id: ids[i], c: col}, t);
		this.Content.saveLayout();
	}
};
