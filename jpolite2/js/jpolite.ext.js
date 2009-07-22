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
	}
});

/*
 * Here you can add your own Live Event definitions
 */
function jpoliteLiveEvents(){
	$(".actionRefresh").live("mousedown", function(){
		$(this).parents(".module")[0].loadContent();
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
 * Initialization Code
 */
$(function(){
	//Load Live Events
	jpoliteLiveEvents();

	//Assign Controls handlers to selectors 
	$.addControls({
		".tabs":		$.fn.Tabs,
		".accordion":	$.fn.Accordion,
		".maccordion":	$.fn.MAccordion
	});
	$.jpolite.init();
	$.gritter.add({
		title: 'Notification powered by Gritter',
		text: 'JPolite is up!',
		sticky: true
	});
});
