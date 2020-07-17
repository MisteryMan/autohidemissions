// ==UserScript==
// @name         Autohide Missions
// @namespace    http://tampermonkey.net/
// @version      2.0-beta
// @description  Autohides missions that don't need your attention. Added settings and set default settings to do nothing.
// @author       MisteryKid
// @include      /^https?:\/\/[www.]*(?:leitstellenspiel\.de|missionchief\.co\.uk|missionchief\.com|meldkamerspel\.com|centro-de-mando\.es|missionchief-australia\.com|larmcentralen-spelet\.se|operatorratunkowy\.pl|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|nodsentralspillet\.com|operacni-stredisko\.cz|112-merkez\.com|jogo-operador112\.com|operador193\.com|centro-de-mando\.mx|dyspetcher101-game\.com|missionchief-japan\.com|hatakeskuspeli\.com|missionchief-korea\.com|jocdispecerat112\.com|dispecerske-centrum\.com)\/.*$/
// @require      https://github.com/MisteryMan/autohidemissions/raw/dev/GM_config.js
// @grant        none
// @run          document-start
// ==/UserScript==

(function() {
    'use strict';
    var AutoHideMissionsText;
    var personalSectionTag;
    var plannedTransportSectionTag;
    var allianceMissionsSectionTag;
    var eventMissionsSectionTag;
    var plannedMissionsSectionTag;
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
        personalSectionTag = 'Persoonlijke missies';
        plannedTransportSectionTag = 'Ambulance Vervoer Missies';
        allianceMissionsSectionTag = 'Grote Inzet Missies';
        eventMissionsSectionTag = 'Event Missies';
        plannedMissionsSectionTag = 'Geplande missies';
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
        personalSectionTag = 'Personal Mission List';
        plannedTransportSectionTag = 'Ambulance Transport Missions';
        allianceMissionsSectionTag = 'Alliance Missions';
        eventMissionsSectionTag = 'Event Missions';
        plannedMissionsSectionTag = 'Scheduled Missions';
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
    $("#main_container").before(frame);
    GM_config.init(
        {
            'id': 'autoHideMissions', // The id used for this instance of GM_config
            'title': AutoHideMissionsText,
            'fields': // Fields object
            {
                'personalGreenStatus': // This is the id of the field
                {
                    'label': GreenStatusText, // Appears next to field
                    'section': personalSectionTag,
                    'type': 'select', // Makes this setting a text field
                    'default': Nothing, // Default value if user doesn't change it
                    'options': [Hidden, Collapse, Nothing]
                },
                'personalYellowStatus':
                {
                    'label': YellowStatusText,
                    'type': 'select',
                    'default': Nothing,
                    'options': [Hidden, Collapse, Nothing]
                },
				'personalRedStatus':
				{
					'label': RedStatusText,
					'type': 'select',
					'default': Nothing,
					'options': [Hidden, Collapse, Nothing]
				},
                'plannedTransportGreenStatus': // This is the id of the field
                {
                    'label': GreenStatusText, // Appears next to field
                    'section': plannedTransportSectionTag,
                    'type': 'select', // Makes this setting a text field
                    'default': Nothing, // Default value if user doesn't change it
                    'options': [Hidden, Collapse, Nothing]
                },
                'plannedTransportYellowStatus':
                {
                    'label': YellowStatusText,
                    'type': 'select',
                    'default': Nothing,
                    'options': [Hidden, Collapse, Nothing]
                },
				'plannedTransportRedStatus':
				{
					'label': RedStatusText,
					'type': 'select',
					'default': Nothing,
					'options': [Hidden, Collapse, Nothing]
				},
                'allianceMissionsGreenStatus': // This is the id of the field
                {
                    'label': GreenStatusText, // Appears next to field
                    'section': allianceMissionsSectionTag,
                    'type': 'select', // Makes this setting a text field
                    'default': Nothing, // Default value if user doesn't change it
                    'options': [Hidden, Collapse, Nothing]
                },
                'allianceMissionsYellowStatus':
                {
                    'label': YellowStatusText,
                    'type': 'select',
                    'default': Nothing,
                    'options': [Hidden, Collapse, Nothing]
                },
				'allianceMissionsRedStatus':
				{
					'label': RedStatusText,
					'type': 'select',
					'default': Nothing,
					'options': [Hidden, Collapse, Nothing]
				},
                'eventMissionsGreenStatus': // This is the id of the field
                {
                    'label': GreenStatusText, // Appears next to field
                    'section': eventMissionsSectionTag,
                    'type': 'select', // Makes this setting a text field
                    'default': Nothing, // Default value if user doesn't change it
                    'options': [Hidden, Collapse, Nothing]
                },
                'eventMissionsYellowStatus':
                {
                    'label': YellowStatusText,
                    'type': 'select',
                    'default': Nothing,
                    'options': [Hidden, Collapse, Nothing]
                },
				'eventMissionsRedStatus':
				{
					'label': RedStatusText,
					'type': 'select',
					'default': Nothing,
					'options': [Hidden, Collapse, Nothing]
				},
                'plannedMissionsGreenStatus': // This is the id of the field
                {
                    'label': GreenStatusText, // Appears next to field
                    'section': plannedMissionsSectionTag,
                    'type': 'select', // Makes this setting a text field
                    'default': Nothing, // Default value if user doesn't change it
                    'options': [Hidden, Collapse, Nothing]
                },
                'plannedMissionsYellowStatus':
                {
                    'label': YellowStatusText,
                    'type': 'select',
                    'default': Nothing,
                    'options': [Hidden, Collapse, Nothing]
                },
				'plannedMissionsRedStatus':
				{
					'label': RedStatusText,
					'type': 'select',
					'default': Nothing,
					'options': [Hidden, Collapse, Nothing]
				}
            },
            'css': '#autoHideMissions_personalGreenStatus_var, #autoHideMissions_plannedTransportGreenStatus_var, #autoHideMissions_allianceMissionsGreenStatus_var, #autoHideMissions_eventMissionsGreenStatus_var, #autoHideMissions_plannedMissionsGreenStatus_var { background-image: linear-gradient(to bottom, lightgreen 0, green 100%); text-align: center; height: 30px; line-height: 30px;border-radius: 10px; border: 0px solid #000; padding: 0px;}' +
                   '#autoHideMissions_personalYellowStatus_var, #autoHideMissions_plannedTransportYellowStatus_var, #autoHideMissions_allianceMissionsYellowStatus_var, #autoHideMissions_eventMissionsYellowStatus_var, #autoHideMissions_plannedMissionsYellowStatus_var { background-image: linear-gradient(to bottom, #f0d54e 0, #f0ad4e 100%);  text-align: center; height: 30px; line-height: 30px; border-radius: 10px; border: 0px solid #000; padding: 0px;}' +
                   '#autoHideMissions_personalRedStatus_var, #autoHideMissions_plannedTransportRedStatus_var, #autoHideMissions_allianceMissionsRedStatus_var, #autoHideMissions_eventMissionsRedStatus_var, #autoHideMissions_plannedMissionsRedStatus_var { background-image: linear-gradient(to bottom, #d9534f 0, #c9302c 100%);  text-align: center; height: 30px; line-height: 30px; border-radius: 10px; border: 0px solid #000; padding: 0px;}' +
                   '.config_var { display: inline-block; width: 33%; }' +
                   '.dark .field_label { color: #000; }' +
                   '.config_var { color: #000; }',
            'events':
            {

                'open': function() { GM_config.frame.setAttribute("style", "border-radius: 10px; border: 2px solid #000; padding: 20px; height: auto; background: #aaa; position: absolute; z-index: 9999;margin-left: 25%;margin-right: 25%;left: 0;right: 0;text-align: center; min-width: 400px;") },
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
        if (document.getElementById("autoHideMissionStyle")) { document.getElementById("autoHideMissionStyle").remove(); }
        //if (document.getElementById("autoHideMission-yellow")) { document.getElementById("autoHideMission-yellow").remove(); }
		//if (document.getElementById("autoHideMission-red")) { document.getElementById("autoHideMission-red").remove(); }
        $("#mission_list").addClass("temp_collapse");
        /*
         Personal Missions
        */
        var personalGreenStatus = GM_config.get("personalGreenStatus"); var personalYellowStatus = GM_config.get("personalYellowStatus"); var personalRedStatus = GM_config.get("personalRedStatus");
        /*
        Planned Transport
        */
        var plannedTransportGreenStatus = GM_config.get("plannedTransportGreenStatus"); var plannedTransportYellowStatus = GM_config.get("plannedTransportYellowStatus"); var plannedTransportRedStatus = GM_config.get("plannedTransportRedStatus");
        /*
        Alliance Missions
        */
        var allianceMissionsGreenStatus = GM_config.get("allianceMissionsGreenStatus"); var allianceMissionsYellowStatus = GM_config.get("allianceMissionsYellowStatus"); var allianceMissionsRedStatus = GM_config.get("allianceMissionsRedStatus");
        /*
        Event Missions
        */
        var eventMissionsGreenStatus = GM_config.get("eventMissionsGreenStatus"); var eventMissionsYellowStatus = GM_config.get("eventMissionsYellowStatus"); var eventMissionsRedStatus = GM_config.get("eventMissionsRedStatus");
        /*
        Planned/Scheduled Missions
        */
        var plannedMissionsGreenStatus = GM_config.get("plannedMissionsGreenStatus"); var plannedMissionsYellowStatus = GM_config.get("plannedMissionsYellowStatus"); var plannedMissionsRedStatus = GM_config.get("plannedMissionsRedStatus");

        var autoHideMissionStyleStart = "<style type='text/css' id='autoHideMissionStyle'>";
        var autoHideMissionStyleContent = "";
        var autoHideMissionStyleEnd = "</style>";
        /*
                   Personal Missions
        */
        switch(personalGreenStatus) {
            case Collapse: autoHideMissionStyleContent += "\n#mission_list .missionSideBarEntry .mission_panel_green .panel-body { display: none; }"; break;
            case Hidden: autoHideMissionStyleContent += "\n#mission_list .missionSideBarEntry .mission_panel_green { display: none; }"; break;
        }
        switch(personalYellowStatus) {
            case Collapse: autoHideMissionStyleContent += "\n#mission_list .missionSideBarEntry  .mission_panel_yellow .panel-body { display: none; }"; break;
            case Hidden: autoHideMissionStyleContent += "\n#mission_list .missionSideBarEntry  .mission_panel_yellow { display: none; }"; break;
        }
		switch(personalRedStatus) {
			case Collapse: autoHideMissionStyleContent += "\n#mission_list .missionSideBarEntry  .mission_panel_red .panel-body { display: none; }";	break;
			case Hidden: autoHideMissionStyleContent += "\n#mission_list .missionSideBarEntry  .mission_panel_red { display: none; }"; break;
		}
        /*
                   Planned Transport Missions
        */
        switch(plannedTransportGreenStatus) {
            case Collapse: autoHideMissionStyleContent += "\n#mission_list_krankentransporte .missionSideBarEntry .mission_panel_green .panel-body { display: none; }"; break;
            case Hidden: autoHideMissionStyleContent += "\n#mission_list_krankentransporte .missionSideBarEntry .mission_panel_green { display: none; }"; break;
        }
        switch(plannedTransportYellowStatus) {
            case Collapse: autoHideMissionStyleContent += "\n#mission_list_krankentransporte .missionSideBarEntry  .mission_panel_yellow .panel-body { display: none; }"; break;
            case Hidden: autoHideMissionStyleContent += "\n#mission_list_krankentransporte .missionSideBarEntry  .mission_panel_yellow { display: none; }"; break;
        }
		switch(plannedTransportRedStatus) {
			case Collapse: autoHideMissionStyleContent += "\n#mission_list_krankentransporte .missionSideBarEntry  .mission_panel_red .panel-body { display: none; }";	break;
			case Hidden: autoHideMissionStyleContent += "\n#mission_list_krankentransporte .missionSideBarEntry  .mission_panel_red { display: none; }"; break;
		}
        /*
                   Alliance Missions
        */
        switch(allianceMissionsGreenStatus) {
            case Collapse: autoHideMissionStyleContent += "\n#mission_list_alliance .missionSideBarEntry .mission_panel_green .panel-body { display: none; }"; break;
            case Hidden: autoHideMissionStyleContent += "\n#mission_list_alliance .missionSideBarEntry .mission_panel_green { display: none; }"; break;
        }
        switch(allianceMissionsYellowStatus) {
            case Collapse: autoHideMissionStyleContent += "\n#mission_list_alliance .missionSideBarEntry  .mission_panel_yellow .panel-body { display: none; }"; break;
            case Hidden: autoHideMissionStyleContent += "\n#mission_list_alliance .missionSideBarEntry  .mission_panel_yellow { display: none; }"; break;
        }
		switch(allianceMissionsRedStatus) {
			case Collapse: autoHideMissionStyleContent += "\n#mission_list_alliance .missionSideBarEntry  .mission_panel_red .panel-body { display: none; }";	break;
			case Hidden: autoHideMissionStyleContent += "\n#mission_list_alliance .missionSideBarEntry  .mission_panel_red { display: none; }"; break;
		}
        /*
                   Event Missions
        */
        switch(eventMissionsGreenStatus) {
            case Collapse: autoHideMissionStyleContent += "\n#mission_list_alliance_event .missionSideBarEntry .mission_panel_green .panel-body { display: none; }"; break;
            case Hidden: autoHideMissionStyleContent += "\n#mission_list_alliance_event .missionSideBarEntry .mission_panel_green { display: none; }"; break;
        }
        switch(eventMissionsYellowStatus) {
            case Collapse: autoHideMissionStyleContent += "\n#mission_list_alliance_event .missionSideBarEntry  .mission_panel_yellow .panel-body { display: none; }"; break;
            case Hidden: autoHideMissionStyleContent += "\n#mission_list_alliance_event .missionSideBarEntry  .mission_panel_yellow { display: none; }"; break;
        }
		switch(eventMissionsRedStatus) {
			case Collapse: autoHideMissionStyleContent += "\n#mission_list_alliance_event .missionSideBarEntry  .mission_panel_red .panel-body { display: none; }";	break;
			case Hidden: autoHideMissionStyleContent += "\n#mission_list_alliance_event .missionSideBarEntry  .mission_panel_red { display: none; }"; break;
		}
        /*
                   Planned/Scheduled Missions
        */
        switch(plannedMissionsGreenStatus) {
            case Collapse: autoHideMissionStyleContent += "\n#mission_list_sicherheitswache .missionSideBarEntry .mission_panel_green .panel-body { display: none; }"; break;
            case Hidden: autoHideMissionStyleContent += "\n#mission_list_sicherheitswache .missionSideBarEntry .mission_panel_green { display: none; }"; break;
        }
        switch(plannedMissionsYellowStatus) {
            case Collapse: autoHideMissionStyleContent += "\n#mission_list_sicherheitswache .missionSideBarEntry  .mission_panel_yellow .panel-body { display: none; }"; break;
            case Hidden: autoHideMissionStyleContent += "\n#mission_list_sicherheitswache .missionSideBarEntry  .mission_panel_yellow { display: none; }"; break;
        }
		switch(plannedMissionsRedStatus) {
			case Collapse: autoHideMissionStyleContent += "\n#mission_list_sicherheitswache .missionSideBarEntry  .mission_panel_red .panel-body { display: none; }";	break;
			case Hidden: autoHideMissionStyleContent += "\n#mission_list_sicherheitswache .missionSideBarEntry  .mission_panel_red { display: none; }"; break;
		}
        $(autoHideMissionStyleStart + autoHideMissionStyleContent + autoHideMissionStyleEnd).appendTo('head');
    }
})();