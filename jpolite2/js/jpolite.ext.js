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
		$.jpolite.Nav.switchTab(this.rel);
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
			$.jpolite.alert({title:'module Loaded',text:target.url})
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
				o = res[i];
				p = [o.name];
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
 * Initialization Code
 */
$(function(){
	//Load Live / Custom Events & Message Handlers
	myLiveEvents();
	myCustomEvents();
	myMessageHandlers();

	//Assign Controls handlers to selectors 
	$.addControls({
		".tabs":		$.fn.Tabs,
		".accordion":	$.fn.Accordion,
		".maccordion":	$.fn.MAccordion,
		".jsonform":	$.fn.JsonForm
	});
	$.jpolite.init();
	$.jpolite.alert({
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

function jQueryUIInit(){
	// Accordion
	$("#accordion").accordion({ header: "h3" });

	// Tabs
	$('#tabs').tabs();

	// Dialog			
	$('#dialog').dialog({
		autoOpen: false,
		width: 600,
		buttons: {
			"Ok": function() { 
				$(this).dialog("close"); 
			}, 
			"Cancel": function() { 
				$(this).dialog("close"); 
			} 
		}
	});
	
	// Dialog Link
	$('#dialog_link').click(function(){
		$('#dialog').dialog('open');
		return false;
	});

	// Datepicker
	$('#datepicker').datepicker({
		inline: true
	});
	
	// Slider
	$('#slider').slider({
		range: true,
		values: [17, 67]
	});
	
	// Progressbar
	$("#progressbar").progressbar({
		value: 20 
	});
	
	//hover states on the static widgets
	$('#dialog_link, ul#icons li').hover(
		function() { $(this).addClass('ui-state-hover'); }, 
		function() { $(this).removeClass('ui-state-hover'); }
	);
};
