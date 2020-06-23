// ==UserScript==
// @name         Autohide Missions
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Autohides missions that don't need your attention. Added settings and set default settings to do nothing.
// @author       MisteryKid
// @include      /^https?:\/\/[www.]*(?:leitstellenspiel\.de|missionchief\.co\.uk|missionchief\.com|meldkamerspel\.com|centro-de-mando\.es|missionchief-australia\.com|larmcentralen-spelet\.se|operatorratunkowy\.pl|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|nodsentralspillet\.com|operacni-stredisko\.cz|112-merkez\.com|jogo-operador112\.com|operador193\.com|centro-de-mando\.mx|dyspetcher101-game\.com|missionchief-japan\.com|hatakeskuspeli\.com|missionchief-korea\.com|jocdispecerat112\.com|dispecerske-centrum\.com)\/.*$/
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        none
// ==/UserScript==

(function() {
	var frame = document.createElement('div');
    $("#search_input_field_missions").before(frame);
    GM_config.init(
        {
            'id': 'autoHideMissions', // The id used for this instance of GM_config
            'title': 'Auto Hide Missions',
            'fields': // Fields object
            {
                'greenStatus': // This is the id of the field
                {
                    'label': 'Green Status', // Appears next to field
                    'type': 'select', // Makes this setting a text field
                    'default': 'Nothing', // Default value if user doesn't change it
                    'options': ['Hidden', 'Collapse', 'Nothing']
                },
                'yellowStatus':
                {
                    'label': 'Yellow Status',
                    'type': 'select',
                    'default': 'Nothing',
                    'options': ['Hidden', 'Collapse', 'Nothing']
                }
            },
            'css': '#autoHideMissions_greenStatus_var { background-image: linear-gradient(to bottom, #5cb85c 0, #419641 100%); text-align: center; height: 30px; line-height: 30px;border-radius: 10px; border: 0px solid #000; padding: 0px;} #autoHideMissions_yellowStatus_var { background-image: linear-gradient(to bottom, #f0d54e 0, #f0ad4e 100%);  text-align: center; height: 30px; line-height: 30px; border-radius: 10px; border: 0px solid #000; padding: 0px;}; #autoHideMissions_field_yellowStatus { color: #000; } #autoHideMissions_field_greenStatus { color: #000; }',
            'events':
            {

            'open': function() { GM_config.frame.setAttribute("style", "border-radius: 10px; border: 4px solid #000; padding: 20px; height: auto; background: #666;") },
			'save': function() {
                initialize();
                GM_config.close('autoHideMissions');
                }
            },
            'frame': frame,

        }
    );
	// Initialize the script and process all current active missions.
    initialize();
    $("#btn-group-mission-select").append('<a id="autoHideMissionsSettings" class="btn btn-xs btn-success mission_selection" title="autoHideMissions Settings"><div class="glyphicon glyphicon-cog"></div></a>');
    $("#autoHideMissionsSettings").on('click', function(e) {
        GM_config.open('autoHideMissions');
    });
	// This var and function is used to process and changes on missions and to auto process any new missions.
    var original_func = missionMarkerAdd;
	missionMarkerAdd = function(e) {
        original_func.apply(this, arguments);

        mutations(e);
    }
	// This function is called upon ANY change to the mission list.
    async function mutations(e)
    {
        var Missions = $('.missionSideBarEntry');
        for (var i = 0; i < Missions.length; i++) {

            //console.log(e);
            stateSwitcher(Missions[i].firstElementChild, GM_config.get('greenStatus'), GM_config.get('yellowStatus'))

        }
        //initialize();
    }
    function stateSwitcher(missionElement, greenStatus, yellowStatus) {
        // Get mission Element Children, useful for collapsing.
        var missionElementChildren = missionElement.children;
        // Reset display setting for both the parent and the child element.
        missionElement.style.display = "";
        missionElementChildren[1].style.display = "";
        // Shorten Classlist variable.
        var missionStatus = missionElement.classList;
        if (missionStatus.contains("mission_panel_red"))
        { // If mission state is Red, remove display style setting
            state("Nothing", missionElement, missionElementChildren);
        }
        else if (missionStatus.contains("mission_panel_yellow"))
        { // If mission state is YELLOW, pass yellowStatus.setting over to state() function.
            state(yellowStatus, missionElement, missionElementChildren);
        }
        else if (missionStatus.contains("mission_panel_green"))
        { // If mission state is GREEN, pass greenStatus.setting over to state() function.
            state(greenStatus, missionElement, missionElementChildren);
        }
    };
    function state(type, item, itemChildren) {
        switch(type) {
            case "Nothing":
                item.style.display = "";
                itemChildren[1].style.display = "";
                break;
            case "Collapse":
                item.style.display = "";
                itemChildren[1].style.display = "none";
                break;
            case "Hidden":
                item.style.display = "none";
                itemChildren[1].style.display = "none";
                break;
        };
    };
	/*	This function triggers when the page is loaded.
		All currently active missions will be processed
		and collapsed or hidden from view, depending on status.
	*/
    function initialize()
    {
		// Get the mission list.
        var Missions = $('.missionSideBarEntry');
		//Process each mission and change their appearance accordingly
        for (var i = 0; i < Missions.length; i++) {

            //console.log(e);
            stateSwitcher(Missions[i].firstElementChild, GM_config.get('greenStatus'), GM_config.get('yellowStatus'))

        }
    }
})();
