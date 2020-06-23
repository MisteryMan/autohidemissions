// ==UserScript==
// @name         Autohide Missions
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Autohides missions that don't need your attention. Added settings and set default settings to do nothing.
// @author       MisteryKid
// @include      /^https?:\/\/[www.]*(?:leitstellenspiel\.de|missionchief\.co\.uk|missionchief\.com|meldkamerspel\.com|centro-de-mando\.es|missionchief-australia\.com|larmcentralen-spelet\.se|operatorratunkowy\.pl|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|nodsentralspillet\.com|operacni-stredisko\.cz|112-merkez\.com|jogo-operador112\.com|operador193\.com|centro-de-mando\.mx|dyspetcher101-game\.com|missionchief-japan\.com|hatakeskuspeli\.com|missionchief-korea\.com|jocdispecerat112\.com|dispecerske-centrum\.com)\/.*$/
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        none
// ==/UserScript==
(function() {
	'use strict';
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
            'css': '#autoHideMissions_greenStatus_var { background-image: linear-gradient(to bottom, #5cb85c 0, #419641 100%); text-align: center; height: 30px; line-height: 30px;border-radius: 10px; border: 0px solid #000; padding: 0px;} #autoHideMissions_yellowStatus_var { background-image: linear-gradient(to bottom, #f0d54e 0, #f0ad4e 100%);  text-align: center; height: 30px; line-height: 30px; border-radius: 10px; border: 0px solid #000; padding: 0px;}',
            'events':
            {

            'open': function() { GM_config.frame.setAttribute("style", "border-radius: 10px; border: 4px solid #000; padding: 20px; height: auto; background: #666;") },
			'save': function() { location.reload(); }
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
		//Get the current mission list.
        var Missions = $('.missionSideBarEntry');
        var greenStatus = GM_config.get('greenStatus');
        var yellowStatus = GM_config.get('yellowStatus');
		//Process each mission and change their appearance accordingly
        for (var i = 0; i < Missions.length; i++)
        {
			if (e.id != Missions[i].getAttribute('mission_id')) continue;
			// Get the mission DIV layout
			var autoHideChildren = Missions[i].firstElementChild.children;
            Missions[i].firstElementChild.setAttribute("style", "display: block;");
            autoHideChildren[1].setAttribute("style", "display: block;");
			//Process the mission DIV layout and check for red status
            if (Missions[i].firstElementChild.classList.contains("mission_panel_red"))
            {
				//If mission status is red, put it in full display.
                Missions[i].firstElementChild.setAttribute("style", "display: block;");
				//also expand the mission so you can actually see what the "problem" is.
                autoHideChildren[1].setAttribute("style", "display: block;");
				//Send log entry to browser console.
                //console.log("RED >> Mission has insufficient Vehicles or no vehicles at all: " + Missions[i].getAttribute('search_attribute'));
            }
			// If mission is NOT red, but it IS yellow:
            else if (Missions[i].firstElementChild.classList.contains("mission_panel_yellow"))
            {
                if (yellowStatus == 'Hidden') {
				//Collapse only, but do not hide yet.
                    Missions[i].firstElementChild.setAttribute("style", "display: none;");
                }
                else if (yellowStatus == 'Collapse') {
                    //Collapse only, but do not hide yet.
                    autoHideChildren[1].setAttribute("style", "display: none;");
                }
                else { // Default set behavior = Do Nothing
                    //Collapse only, but do not hide yet.
                    autoHideChildren[1].setAttribute("style", "display: block;");
                    Missions[i].firstElementChild.setAttribute("style", "display: none;");
                }
				//Send log entry to browser console.
                //console.log("YELLOW >> Vehicles enroute, hiding panel: " + Missions[i].getAttribute('search_attribute'));
			}
			// IF mission is NOT red, and it is NOT yellow, then it must be green.
            else
			{
				//Hide mission, no further interaction is needed.
                if (greenStatus == 'Hidden') {
                    Missions[i].firstElementChild.setAttribute("style", "display: none;");
                }
                else if (greenStatus == 'Collapse') {
                    autoHideChildren[1].setAttribute("style", "display: none;");
                }
                else { // default behavior is do nothing
                     autoHideChildren[1].setAttribute("style", "display: block;");
                    Missions[i].firstElementChild.setAttribute("style", "display: block;");
                }
				//Send log entry to browser console.
                //console.log("GREEN >> Mission has all vehicles, hiding mission from list: " + Missions[i].getAttribute('search_attribute'));
            }

        }
    }
	/*	This function triggers when the page is loaded.
		All currently active missions will be processed
		and collapsed or hidden from view, depending on status.
	*/
    async function initialize()
    {
		// Get the mission list.
        var Missions = $('.missionSideBarEntry');
        var greenStatus = GM_config.get('greenStatus');
        var yellowStatus = GM_config.get('yellowStatus');
		//Process each mission and change their appearance accordingly
        for (var i = 0; i < Missions.length; i++)
        {
			// Get the mission DIV layout
			var autoHideChildren = Missions[i].firstElementChild.children;
            Missions[i].firstElementChild.setAttribute("style", "display: block;");
            autoHideChildren[1].setAttribute("style", "display: block;");
			//Process the mission DIV layout and check for red status
            if (Missions[i].firstElementChild.classList.contains("mission_panel_red"))
            {
				//If mission status is red, put it in full display.
                Missions[i].firstElementChild.setAttribute("style", "display: block;");
				//also expand the mission so you can actually see what the "problem" is.
                autoHideChildren[1].setAttribute("style", "display: block;");
				//Send log entry to browser console.
                //console.log("RED >> Mission has insufficient Vehicles or no vehicles at all: " + Missions[i].getAttribute('search_attribute'));
            }
			// If mission is NOT red, but it IS yellow:
            else if (Missions[i].firstElementChild.classList.contains("mission_panel_yellow"))
            {
                if (yellowStatus == 'Hidden') {
				//Collapse only, but do not hide yet.
                    Missions[i].firstElementChild.setAttribute("style", "display: none;");
                }
                else if (yellowStatus == 'Collapse') {
                    //Collapse only, but do not hide yet.
                    autoHideChildren[1].setAttribute("style", "display: none;");
                }
                else { // Default set behavior = Collapse
                    //Collapse only, but do not hide yet.
					Missions[i].firstElementChild.setAttribute("style", "display: block;");
                    autoHideChildren[1].setAttribute("style", "display: block;");
                }
				//Send log entry to browser console.
                //console.log("YELLOW >> Vehicles enroute, hiding panel: " + Missions[i].getAttribute('search_attribute'));
			}
			// IF mission is NOT red, and it is NOT yellow, then it must be green.
            else
			{
				//Hide mission, no further interaction is needed.
                if (greenStatus == 'Hidden') {
                    Missions[i].firstElementChild.setAttribute("style", "display: none;");
                }
                else if (greenStatus == 'Collapse') {
                    autoHideChildren[1].setAttribute("style", "display: none;");
                }
                else { // default behavior is hidden
                    Missions[i].firstElementChild.setAttribute("style", "display: block;");
					autoHideChildren[1].setAttribute("style", "display: block;");
                }
				//Send log entry to browser console.
                //console.log("GREEN >> Mission has all vehicles, hiding mission from list: " + Missions[i].getAttribute('search_attribute'));
            }
        }
    }
})();
