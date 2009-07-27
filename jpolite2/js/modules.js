﻿// Module ID & link definitions
// Format:
// moduleId:{l:"url_of_this_module",
// 			 t:"title_for_this_module",
// 			 c:"optional color definition for title bar"}
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
	m702:{url:"rss.php?q=http%3A%2F%2Frss.msnbc.msn.com%2Fid%2F3032091%2Fdevice%2Frss%2Frss.xml",	t:"MSNBC - Static RSS Module (m702)"}
};

// Layout definitions for each tab, aka, which modules go to which columns under which tab
// Format:
//	{i:"id_of_the_module	(refer to _modules)",
//	c:"column_it_belongs_to	(c1, c2, c3)"
//	t:"tab_it_belongs_to	(t1, t2, ...)"}
var _layout=[
	{id:'m181',c:'c1',tab:'t1'},{id:'m102',c:'c2',tab:'t1'},{id:'m103',c:'c3',tab:'t1'},

	{id:'m201',c:'c1',tab:'t2'},{id:'m202',c:'c2',tab:'t2'},{id:'m203',c:'c3',tab:'t2'},
	{id:'m204',c:'c1',tab:'t2'},{id:'m206',c:'c2',tab:'t2'},{id:'m205',c:'c3',tab:'t2'},

	{id:'m301',c:'c1',tab:'t3'},{id:'m302',c:'c2',tab:'t3'},{id:'m303',c:'c3',tab:'t3'},

	{id:'m400',c:'c1',tab:'t4'},{id:'m401',c:'c2',tab:'t4'},

	{id:'m500',c:'c1',tab:'t5'},{id:'m501',c:'c2',tab:'t5'},

	{id:'m601',c:'c1',tab:'t6'},
	{id:'m602',c:'c1',tab:'t6'},

	{id:'m700',c:'c1',tab:'t7'},{id:'m701',c:'c2',tab:'t7'},
								{id:'m702',c:'c2',tab:'t7'}
];