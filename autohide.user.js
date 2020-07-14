// ==UserScript==
// @name         Autohide Missions
// @namespace    http://tampermonkey.net/
// @version      1.6.3
// @description  Autohides missions that don't need your attention. Added settings and set default settings to do nothing.
// @author       MisteryKid
// @include      /^https?:\/\/[www.]*(?:leitstellenspiel\.de|missionchief\.co\.uk|missionchief\.com|meldkamerspel\.com|centro-de-mando\.es|missionchief-australia\.com|larmcentralen-spelet\.se|operatorratunkowy\.pl|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|nodsentralspillet\.com|operacni-stredisko\.cz|112-merkez\.com|jogo-operador112\.com|operador193\.com|centro-de-mando\.mx|dyspetcher101-game\.com|missionchief-japan\.com|hatakeskuspeli\.com|missionchief-korea\.com|jocdispecerat112\.com|dispecerske-centrum\.com)\/.*$/
// @require      https://github.com/MisteryMan/autohidemissions/raw/dev/GM_config.js
// @grant        none
// @run          document-start
// ==/UserScript==

(function() {
    var AutoHideMissionsText;
    var GreenStatusText;
    var YellowStatusText;
	var RedStatusText;
    var Hidden;
    var Collapse;
    var Nothing;
    var Save;
    var Close;
    var Reset;

    if ( I18n.locale == "nl_NL"){
        AutoHideMissionsText = 'Meldingen verbergen';
        GreenStatusText = 'Groene Status';
        YellowStatusText = 'Gele Status';
		RedStatusText = 'Rode Status';
        Hidden = 'Verbergen';
        Collapse = 'Inklappen';
        Nothing = 'Niets doen'
        Save = 'Opslaan'
        Close = 'Sluiten'
        Reset = 'Reset naar standaard'
    }
    else {
        AutoHideMissionsText = 'Auto Hide Missions';
        GreenStatusText = 'Green Status';
        YellowStatusText = 'Yellow Status';
		RedStatusText = 'Red Status';
        Hidden = 'Hidden';
        Collapse = 'Collapse';
        Nothing = 'Nothing'
        Save = 'Save'
        Close = 'Close'
        Reset = 'Reset to default'
    }
    var frame = document.createElement('div');
    $("#search_input_field_missions").before(frame);
    GM_config.init(
        {
            'id': 'autoHideMissions', // The id used for this instance of GM_config
            'title': AutoHideMissionsText,
            'fields': // Fields object
            {
                'greenStatus': // This is the id of the field
                {
                    'label': GreenStatusText, // Appears next to field
                    'type': 'select', // Makes this setting a text field
                    'default': Nothing, // Default value if user doesn't change it
                    'options': [Hidden, Collapse, Nothing]
                },
                'yellowStatus':
                {
                    'label': YellowStatusText,
                    'type': 'select',
                    'default': Nothing,
                    'options': [Hidden, Collapse, Nothing]
                },
				'redStatus':
				{
					'label': RedStatusText,
					'type': 'select',
					'default': Nothing,
					'options': [Hidden, Collapse, Nothing]
				}
            },
            'css': '#autoHideMissions_greenStatus_var { background-image: linear-gradient(to bottom, #5cb85c 0, #419641 100%); text-align: center; height: 30px; line-height: 30px;border-radius: 10px; border: 0px solid #000; padding: 0px;} #autoHideMissions_yellowStatus_var { background-image: linear-gradient(to bottom, #f0d54e 0, #f0ad4e 100%);  text-align: center; height: 30px; line-height: 30px; border-radius: 10px; border: 0px solid #000; padding: 0px;} #autoHideMissions_redStatus_var { background-image: linear-gradient(to bottom, #d9534f 0, #c9302c 100%);  text-align: center; height: 30px; line-height: 30px; border-radius: 10px; border: 0px solid #000; padding: 0px;} #autoHideMissions_field_yellowStatus, #autoHideMissions_field_greenStatus, #autoHideMissions_field_redStatus { color: #000; }',
            'events':
            {

                'open': function() { GM_config.frame.setAttribute("style", "border-radius: 10px; border: 2px solid #000; padding: 20px; height: auto; background: #aaa;") },
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
        document.getElementById("autoHideMissions_saveBtn").firstChild.data = Save;
        document.getElementById("autoHideMissions_closeBtn").firstChild.data = Close
        document.getElementById("autoHideMissions_resetLink").firstChild.data = Reset;
    });
    function initialize() {
        if (document.getElementById("autoHideMission-green")) { document.getElementById("autoHideMission-green").remove(); }
        if (document.getElementById("autoHideMission-yellow")) { document.getElementById("autoHideMission-yellow").remove(); }
		if (document.getElementById("autoHideMission-red")) { document.getElementById("autoHideMission-red").remove(); }
        $("#mission_list").addClass("temp_collapse");
        var greenStatus = GM_config.get("greenStatus");
        var yellowStatus = GM_config.get("yellowStatus");
		var redStatus = GM_config.get("redStatus");
        var styleAppend = "";
        switch(greenStatus) {
            //case Nothing:
                //$("<style id='autoHideMission_green' rel='stylesheet'>\n.mission_panel_green .panel_body { display: block; }</style>").appendTo("head");
                //break;
            case Collapse:
                $("<style type='text/css' id='autoHideMission-green'>#mission_list .missionSideBarEntry .mission_panel_green .panel-body { display: none; }</style>").appendTo("head");
                break;
            case Hidden:
                $("<style type='text/css' id='autoHideMission-green'>#mission_list .missionSideBarEntry .mission_panel_green { display: none; }</style>").appendTo("head");
                break;
        }
        switch(yellowStatus) {
            //case Nothing:
                //$("<style type='text/css' id='autoHideMission_yellow'> .mission_panel_yellow .panel_body { display: block; }</style>").appendTo("head");
                //break;
            case Collapse:
                $("<style type='text/css' id='autoHideMission-yellow'>#mission_list .missionSideBarEntry  .mission_panel_yellow .panel-body { display: none; }</style>").appendTo("head");
                break;
            case Hidden:
                $("<style type='text/css' id='autoHideMission-yellow'>#mission_list .missionSideBarEntry  .mission_panel_yellow { display: none; }</style>").appendTo("head");
                break;
        }
		switch(redStatus) {
			case Collapse:
				$("<style type='text/css' id='autoHideMission-red'>#mission_list .missionSideBarEntry  .mission_panel_red .panel-body { display: none; }</style>").appendTo("head");
				break;
			case Hidden:
				$("<style type='text/css' id='autoHideMission-red'>#mission_list .missionSideBarEntry  .mission_panel_red { display: none; }</style>").appendTo("head");
				break;
		}
    }
})();