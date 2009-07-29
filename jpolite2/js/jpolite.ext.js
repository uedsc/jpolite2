var logged_in = false;
var auth_token_key = "?authenticity_token=";

/*
 * Here you can add your own Advanced Control definitions
 * like Tabs, Accordion, ... as jQuery plugin to apply on
 * target HTML sections
 */
$.fn.extend({
	// Apply on pre-formated <DIV><UL.tabsul><DIVs></DIV> section
	Tabs: function() {
		return this.each(function() {
			var x = $(this);
			var targets = x.children("div").addClass("tabsdiv").hide();
	
			x.children(".tabsul").children("li").each(function(i) {
				this.target = targets[i];
				$(this).click(function() {
					if (!$(this).on()) return;

					$(this.target).siblings("div:visible").andSelf().toggle();
					
					//Ajax Lazy Loading Support
					var a = $("a", this); 
					if ((a.size() > 0) && !this.loaded) {
						$(this.target).load(_modules[a[0].rel].url, $.widgetize);
						this.loaded = true;
					}
				});
			}).eq(0).click();
		});
	},

	// Apply on pre-formated <DL.accordion> section
	Accordion: function() {
		return this.each(function() {
			$(this).children("dt").click(function(){
				var x = $(this);
				if (!x.on()) return;
	
				x.siblings("dd:visible").add(x.next()).slideToggle();
			}).eq(0).click();
		});
	},

	// Used on pre-formated <DL.maccordion> section
	MAccordion: function() {
		return this.each(function() {
			var x = $(this);
	
			x.addClass("accordion").children("dd").slideDown();
			x.children("dt").addClass("on").click(function(){
				$(this).toggleClass("on").next().slideToggle();
			});
		});
	},

	// Used on FORM.jsonform, shall call the CallBack function with returned data
	JsonForm: function() {
		this.append($("<div class='error'/><div class='notice'/>").hide());
		return this.submit(function(){
			var f = this;
			$.post(this.action, $(this).serialize() + auth_token_key, function(data){
				if ($.jpolite.HandleMessage(data))
					$(".jqmWindow:visible").jqmHide();
			},"json");
			return false;
		});
	}
});

/*
 * Here you can add your own Live Event definitions
 */
function myLiveEvents(){
	$(".actionRefresh").live("mousedown", function(){
		$(this).parents(".module")[0].loadContent(true);
	});
	$(".actionMin").live("mousedown", function(){
		$(this).parents(".module")[0].min();
		$(this).hide().siblings(".actionMax").show();	
	});
	$(".actionMax").live("mousedown", function(){
		$(this).parents(".module")[0].max();
		$(this).hide().siblings(".actionMin").show();	
	});
	$(".actionClose").live("mousedown", function(){
		$(this).parents(".module")[0].close();	
	});
	$("a.tab").live("click", function(){
		$.jpolite.Nav.gotoTab(this.rel);
		return false;	
	});
	$("a.local").live("click", function(){
		$(this).parents(".module")[0].loadContent(this.href);
		return false;	
	});	
};

/*
 * Here you can register Custom System Events
 */
function myCustomEvents(){
	$.jpolite.bindEvent({
		"moduleLoadedEvent": function(e, target){
			$.alert({title:'module Loaded',text:target.url})
		}
	})
};

/*
 * Here you can register the message handlers for messages returned from Server side
 */
function myMessageHandlers() {
	$.jpolite.registerMessageHandlers({
		login:	Login,
		resource: function(res){
			for (var i in res) {
				var o = res[i];
				var p = [o.name];
				if (o.url) p.push(o.url);
				p.push(true);
				$.jpolite.triggerEvent(o.method == 'destroy' ? "destroyEvent" : "refreshEvent", p);					
			}
			return true;
		},
		//Promot a important notices in a JsonForm
		notice: function(note) {
			var f = $("form:visible");
			if (note.length) {	//Array, Possibly a error / warning message 
				note = $.map(note, function(o, i){
					return o.join(" -- ");
				});
				if (f.size() > 0) $(".notice", f).html(note.join("<br/>")).hide().slideDown();
			}
			return false;
		},
		//Prompt user about errors in a JsonForm
		error: function(err) {
			var f = $("form:visible");
			if (f.size() > 0) $(".error", f).html(err).hide().slideDown();
			return false;
		}
	})
};

/*
 * Here you can define which controls you want in the format of
 * {selector} : [callBackFunction, {one:argument}] or 
 * {selector} : [callBackFunction, [array, of, arguments]]
 * The callBackFunctions will be called upon each module content
 */
function myControls(){
	//Assign Controls handlers to selectors 
	$.addControls({
		//JPolite native controls, zero arguement
		".tabs":		[$.fn.Tabs],
		".accordion":	[$.fn.Accordion],
		".maccordion":	[$.fn.MAccordion],
		".jsonform":	[$.fn.JsonForm],

		//jqModal controls, One object as arguement
		".jqmWindow":	[$.fn.jqm, {toTop:true}],

		//Below are controls from jQuery UI, check out m801.html
		".accordion1":	[$.fn.accordion,{ header: "h3" }],
		".tabs1":		[$.fn.tabs],
		".dialog":		[$.fn.dialog, {
							autoOpen: false,
							width: 600,
							buttons: {
								"Ok": function() {$(this).dialog("close");},
								"Cancel": function() {$(this).dialog("close");} 
							}
						}],
		".datepicker":	[$.fn.datepicker, {inline: true}],
		".slider":		[$.fn.slider,{range: true, values: [17, 67]}],
		".progressbar":	[$.fn.progressbar,{value: 20}],
		//hover takes 2 arguements --> pass them in an Array
		"#dialog_link, ul#icons li": [$.fn.hover,
			[
				function() { $(this).addClass('ui-state-hover'); },
				function() { $(this).removeClass('ui-state-hover'); }
			]
		]
	});
};

/*
 * Here you can customize the appearance / behavior of navigation tabs
 */
function InitTabs(){
		$("<b class='hover'></b>").text(this.innerHTML).prependTo(this);
		$(this).hover(
			function(){$(".hover", this).stop().animate({opacity:.9},700, 'easeOutSine')},
			function(){$(".hover", this).stop().animate({opacity:0},700,  'easeOutExpo')}
		);
};

/*
 * Initialization Code
 */
$(function(){
	//Load Live / Custom Events & Message Handlers
	myLiveEvents();
	myCustomEvents();
	myMessageHandlers();
	myControls();

	//Here you can customize the look and feel of the navigation tabs
	//Details about Kwicks can be found here: http://plugins.jquery.com/project/kwicks
	var useKwicks = confirm("Enable Kwicks-styled navigation tabs?\n(Cancel will enable the traditional tab behavior)");
	if (useKwicks) $("#header_tabs").kwicks({max:180, spacing:5, sticky:true, event:'click'}); 
	$.jpolite.Nav.init("#header_tabs", "li", useKwicks ? function(){} : InitTabs);

	$.jpolite.init();
	
	$.jpolite.Nav.gotoTab('t1');	//Activate the first tab by default, or another id of your choice
	$.alert({
		title: 'Notification powered by Gritter',
		text: 'JPolite is up!'
	});
});

function Login(){
	LOGIN = $("#logins");
	$.getJSON("/users?timer=" + (new Date()).getMilliseconds(), function(json){
		if (json.name) {
			logged_in = true;
			LOGIN.html("Welcome <a href='/profile'>" + json.name + "</a> | <a href='/logout'>Logout</a>");
			$("#t2").show().click();
		} else {
			LOGIN.html("<a rel='#LOGIN_FORM' class='jqm'>Log in</a> | <a rel='#SIGNUP_FORM' class='jqm'>Sign up</a>");
		}
		auth_token_key = "&authenticity_token=" + encodeURIComponent(json.auto);
	});
};

function test(){
	$.jpolite.handleMessage({
		error:'too bad!',
		msg: 'haha',
		notice:[['name','too short']],
		resource:[
			{name:'Products'},
			{name:'Customers'}
		]
	});
	return false;
};
