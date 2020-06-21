// ==UserScript==
// @name         Autohide Missions
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Autohides missions that don't need your attention.
// @author       MisteryKid
// @include      /^https?:\/\/[www.]*(?:leitstellenspiel\.de|missionchief\.co\.uk|missionchief\.com|meldkamerspel\.com|centro-de-mando\.es|missionchief-australia\.com|larmcentralen-spelet\.se|operatorratunkowy\.pl|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|nodsentralspillet\.com|operacni-stredisko\.cz|112-merkez\.com|jogo-operador112\.com|operador193\.com|centro-de-mando\.mx|dyspetcher101-game\.com|missionchief-japan\.com|hatakeskuspeli\.com|missionchief-korea\.com|jocdispecerat112\.com|dispecerske-centrum\.com)\/.*$/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	// Initialize the script and process all current active missions.
    init();
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
        
		//Process each mission and change their appearance accordingly
        for (var i = 0; i < Missions.length; i++)
        {
			// Get the mission DIV layout
			var autoHideChildren = Missions[i].firstElementChild.children;
			//Process the mission DIV layout and check for red status
            if (Missions[i].firstElementChild.classList.contains("mission_panel_red"))
            {
				//If mission status is red, put it in full display.
                Missions[i].firstElementChild.setAttribute("style", "display: block;");
				//also expand the mission so you can actually see what the "problem" is.
                autoHideChildren[1].setAttribute("style", "display: block;");
				//Send log entry to browser console.
                console.log("RED >> Mission has insufficient Vehicles or no vehicles at all: " + Missions[i].getAttribute('search_attribute'));
            }
			// If mission is NOT red, but it IS yellow:
            else if (Missions[i].firstElementChild.classList.contains("mission_panel_yellow"))
            {
				//Collapse only, but do not hide yet.
				autoHideChildren[1].setAttribute("style", "display: none;");
				//Send log entry to browser console.
                console.log("YELLOW >> Vehicles enroute, hiding panel: " + Missions[i].getAttribute('search_attribute'));
			}
			// IF mission is NOT red, and it is NOT yellow, then it must be green.
            else
			{
				//Hide mission, no further interaction is needed.
                Missions[i].firstElementChild.setAttribute("style", "display: none;");
				//Send log entry to browser console.
                console.log("GREEN >> Mission has all vehicles, hiding mission from list: " + Missions[i].getAttribute('search_attribute'));
            }

        }
    }
	/*	This function triggers when the page is loaded.
		All currently active missions will be processed
		and collapsed or hidden from view, depending on status.
	*/
    async function init()
    {
		// Get the mission list.
        var Missions = $('.missionSideBarEntry');

		//Process each mission and change their appearance accordingly
        for (var i = 0; i < Missions.length; i++)
        {
			// Get the mission DIV layout
			var autoHideChildren = Missions[i].firstElementChild.children;
			//Process the mission DIV layout and check for red status
            if (Missions[i].firstElementChild.classList.contains("mission_panel_red"))
            {
				//If mission status is red, put it in full display.
                Missions[i].firstElementChild.setAttribute("style", "display: block;");
				//also expand the mission so you can actually see what the "problem" is.
                autoHideChildren[1].setAttribute("style", "display: block;");
				//Send log entry to browser console.
                console.log("RED >> Mission has insufficient Vehicles or no vehicles at all: " + Missions[i].getAttribute('search_attribute'));
            }
			// If mission is NOT red, but it IS yellow:
            else if (Missions[i].firstElementChild.classList.contains("mission_panel_yellow"))
            {
				//Collapse only, but do not hide yet.
				autoHideChildren[1].setAttribute("style", "display: none;");
				//Send log entry to browser console.
                console.log("YELLOW >> Vehicles enroute, hiding panel: " + Missions[i].getAttribute('search_attribute'));
			}
			// IF mission is NOT red, and it is NOT yellow, then it must be green.
            else
			{
				//Hide mission, no further interaction is needed.
                Missions[i].firstElementChild.setAttribute("style", "display: none;");
				//Send log entry to browser console.
                console.log("GREEN >> Mission has all vehicles, hiding mission from list: " + Missions[i].getAttribute('search_attribute'));
            }
        }
    }
})();
