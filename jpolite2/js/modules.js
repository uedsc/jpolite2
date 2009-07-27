/*
 * Module ID & link definitions
 * Format:
 * moduleId:{url: "url_of_this_module",
 *  		 t:   "title_for_this_module",
 *   		 c:   "optional color definition for title bar"}
 */ 
var _modules={
	m101:{url:"modules/m101.html",	t:"Motivation", c:"red"},
	m181:{url:"modules/m101.html",	t:"Motivation", c:"red"},
	m102:{url:"modules/m102.html",	t:"Philisophy", c:"yellow"},
	m103:{url:"modules/m103.html",	t:"Buzz", c:"green"},

	m201:{url:"modules/m201.html",	t:"Module:m201"},
	m202:{url:"modules/m202.html",	t:"Module:m202"},
	m203:{url:"modules/m203.html",	t:"Module:m203"},
	m204:{url:"modules/m204.html",	t:"Module:m204"},
	m205:{url:"modules/m205.html",	t:"Module:m205"},
	m206:{url:"modules/m206.html",	t:"Module:m206"},

	m301:{url:"modules/m301.html",	t:"Module Definition (m301)"},
	m302:{url:"modules/m302.html",	t:"Layout Definition (m302)"},
	m303:{url:"modules/m303.html",	t:"Column Width Definition (m303)", c:"green"},

	m400:{url:"modules/m400.html",	t:"Side Menu (m400)"},
	m401:{url:"modules/m401.html",	t:"Tabs Control (m401)"},
	m402:{url:"modules/m402.html",	t:"Accordion Control (m402)"},
	
	m500:{url:"modules/m500.html",	t:"Some Goodies (m500)"},
	m501:{url:"modules/m501.html",	t:"Local Link (m501)"},
	m502:{url:"modules/m502.html",	t:"Ajax Forms (m502)"},
	m503:{url:"modules/m503.html",	t:"Tab Link (m503)"},
	m504:{url:"modules/m504.html",	t:"Thick Box (m504)"},

	m601:{url:"modules/m601.html",	t:"Resources & Credit"},
	m602:{url:"modules/m602.html",	t:"License"},

	m700:{url:"modules/m700.html",	t:"RSSLi Menu (m700)"},
	m701:{url:"modules/m701.html",	t:"RSS Reader (m701)"},
	m702:{url:"rss.php?q=http%3A%2F%2Frss.msnbc.msn.com%2Fid%2F3032091%2Fdevice%2Frss%2Frss.xml",	t:"MSNBC - Static RSS Module (m702)"},
	
	m801:{url:"modules/m801.html",	t:"jQuery UI Controls with Theme Support"}
};

/*
 * Layout definitions for each tab, i.e., which modules go to which columns under which tab
 *  Format:
 *  	{id: "id_of_the_module	(refer to _modules)",
 *  	 c:  "column_id_belongs_to	(c1, c2, c3)",
 *  	 t:  "tab_id_belongs_to	(t1, t2, ...)"}
 */ 
var _moduleLayout=[
	{id:'m101',c:'c1',tab:'t1'},{id:'m102',c:'c2',tab:'t1'},{id:'m103',c:'c3',tab:'t1'},

	{id:'m201',c:'c1',tab:'t2'},{id:'m202',c:'c2',tab:'t2'},{id:'m203',c:'c3',tab:'t2'},
	{id:'m204',c:'c1',tab:'t2'},{id:'m206',c:'c2',tab:'t2'},{id:'m205',c:'c3',tab:'t2'},

	{id:'m301',c:'c1',tab:'t3'},{id:'m302',c:'c2',tab:'t3'},{id:'m303',c:'c3',tab:'t3'},

	{id:'m400',c:'c1',tab:'t4'},{id:'m401',c:'c2',tab:'t4'},

	{id:'m500',c:'c1',tab:'t5'},{id:'m501',c:'c2',tab:'t5'},

	{id:'m601',c:'c1',tab:'t6'},
	{id:'m602',c:'c1',tab:'t6'},

	{id:'m700',c:'c1',tab:'t7'},{id:'m701',c:'c2',tab:'t7'},
								{id:'m702',c:'c2',tab:'t7'},
	{id:'m801',c:'c1',tab:'t8'}
];

/* 
 * Column layout definitions, i.e., how the columns (containers) are placed under each tab
 * Pure CSS properties can be set upon each column, e.g., width, float, etc. You can refer
 * to jQuery.fn.css() for more details.
 * 
 * The "bg" property is used to set the background of all columns, which actually affects the <body>
 * 
 * A _default value set is provided, to save your efforts of setting each tab manually
 */
var _columnLayout = {
	_default: { bg:{background:'#ddd'},
				c1:{'float':'left',width:'33.3%'},
				c2:{'float':'left',width:'33.3%'}, 
				c3:{'float':'left',width:'33.3%'}
	},
	t2:{ bg:{background:'#777'},
		 c1:{'float':'left',width:'20%'},
		 c2:{'float':'left',width:'40%'}, 
		 c3:{'float':'left',width:'40%'}
	},
	t3:{ bg:{background:'#f0f0f0'},
		 c1:{'float':'left',width:'33%'},
		 c2:{'float':'left',width:'33%'}, 
		 c3:{'float':'left',width:'33%'}
	},
	t4:{ c1:{'float':'left',width:'20%'},
		 c2:{'float':'left',width:'80%'}, 
		 c3:{'float':'left',width:'0'}
	},
	t8:{ c1:{'float':'none',width:'100%'},
		 c2:{'float':'left',width:'0'}, 
		 c3:{'float':'left',width:'0'}
	}
};