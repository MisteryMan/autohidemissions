// ==UserScript==
// @name         Autohide Missions
// @namespace    http://tampermonkey.net/
// @version      1.5.2
// @description  Autohides missions that don't need your attention. Added settings and set default settings to do nothing.
// @author       MisteryKid
// @include      /^https?:\/\/[www.]*(?:leitstellenspiel\.de|missionchief\.co\.uk|missionchief\.com|meldkamerspel\.com|centro-de-mando\.es|missionchief-australia\.com|larmcentralen-spelet\.se|operatorratunkowy\.pl|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|nodsentralspillet\.com|operacni-stredisko\.cz|112-merkez\.com|jogo-operador112\.com|operador193\.com|centro-de-mando\.mx|dyspetcher101-game\.com|missionchief-japan\.com|hatakeskuspeli\.com|missionchief-korea\.com|jocdispecerat112\.com|dispecerske-centrum\.com)\/.*$/
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        none
// ==/UserScript==

(function() {
  var AutoHideMissionsText;
  var GreenStatusText;
  var YellowStatusText;
  var Hidden;
  var Collapse;
  var Nothing;
  var Save;
  var Close;
  var Reset;
  if (I18n.locale == "nl_NL") {
    AutoHideMissionsText = "Meldingen verbergen";
    GreenStatusText = "Groene Status";
    YellowStatusText = "Gele Status";
    Hidden = "Verbergen";
    Collapse = "Inklappen";
    Nothing = "Niets doen";
    Save = "Opslaan";
    Close = "Sluiten";
    Reset = "Reset naar standaard";
  } else {
    AutoHideMissionsText = "Auto Hide Missions";
    GreenStatusText = "Green Status";
    YellowStatusText = "Yellow Status";
    Hidden = "Hidden";
    Collapse = "Collapse";
    Nothing = "Nothing";
    Save = "Save";
    Close = "Close";
    Reset = "Reset to default";
  }
  var frame = document.createElement("div");
  $("#search_input_field_missions").before(frame);
  GM_config.init({"id":"autoHideMissions", "title":AutoHideMissionsText, "fields":{"greenStatus":{"label":GreenStatusText, "type":"select", "default":Nothing, "options":[Hidden, Collapse, Nothing]}, "yellowStatus":{"label":YellowStatusText, "type":"select", "default":Nothing, "options":[Hidden, Collapse, Nothing]}}, "css":"#autoHideMissions_greenStatus_var { background-image: linear-gradient(to bottom, #5cb85c 0, #419641 100%); text-align: center; height: 30px; line-height: 30px;border-radius: 10px; border: 0px solid #000; padding: 0px;} #autoHideMissions_yellowStatus_var { background-image: linear-gradient(to bottom, #f0d54e 0, #f0ad4e 100%);  text-align: center; height: 30px; line-height: 30px; border-radius: 10px; border: 0px solid #000; padding: 0px;} #autoHideMissions_field_yellowStatus { color: #000; } #autoHideMissions_field_greenStatus { color: #000; }",
  "events":{"open":function() {
    GM_config.frame.setAttribute("style", "border-radius: 10px; border: 2px solid #000; padding: 20px; height: auto; background: #666;");
  }, "save":function() {
    initialize();
    GM_config.close("autoHideMissions");
  }}, "frame":frame, });
  initialize();
  $("#btn-group-mission-select").append('<a id="autoHideMissionsSettings" class="btn btn-xs btn-success mission_selection" title="autoHideMissions Settings"><div class="glyphicon glyphicon-cog"></div></a>');
  $("#autoHideMissionsSettings").on("click", function(e) {
    GM_config.open("autoHideMissions");
    document.getElementById("autoHideMissions_saveBtn").firstChild.data = Save;
    document.getElementById("autoHideMissions_closeBtn").firstChild.data = Close;
    document.getElementById("autoHideMissions_resetLink").firstChild.data = Reset;
  });
  var original_func = missionMarkerAdd;
  missionMarkerAdd = function(e) {
    original_func.apply(this, arguments);
    var Missions = $(".missionSideBarEntry");
    for (var i = 0; i < Missions.length; i++) {
      var missionID = Missions[i].getAttribute("mission_id");
      var missionOut = JSON.parse(localStorage.getItem("lssm_missionOut"));
      if (missionOut == null) {
        stateSwitcher(Missions[i].firstElementChild, GM_config.get("greenStatus"), GM_config.get("yellowStatus"));
      } else {
        if (!missionOut.hasOwnProperty(missionID)) {
          stateSwitcher(Missions[i].firstElementChild, GM_config.get("greenStatus"), GM_config.get("yellowStatus"));
        }
      }
    }
  };
  function mutations(e) {
    var Missions;
    var i;
    var missionID;
    var missionOut;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function($jscomp$generator$context) {
      Missions = $(".missionSideBarEntry");
      for (i = 0; i < Missions.length; i++) {
        missionID = Missions[i].getAttribute("mission_id");
        missionOut = JSON.parse(localStorage.getItem("lssm_missionOut"));
        if (missionOut == null) {
          stateSwitcher(Missions[i].firstElementChild, GM_config.get("greenStatus"), GM_config.get("yellowStatus"));
        } else {
          if (!missionOut.hasOwnProperty(missionID)) {
            stateSwitcher(Missions[i].firstElementChild, GM_config.get("greenStatus"), GM_config.get("yellowStatus"));
          }
        }
      }
      $jscomp$generator$context.jumpToEnd();
    });
  }
  function stateSwitcher(missionElement, greenStatus, yellowStatus) {
    var missionElementChildren = missionElement.children;
    missionElement.style.display = "";
    missionElementChildren[1].style.display = "";
    var missionStatus = missionElement.classList;
    if (missionStatus.contains("mission_panel_red")) {
      state(Collapse, missionElement, missionElementChildren);
    } else {
      if (missionStatus.contains("mission_panel_yellow")) {
        state(yellowStatus, missionElement, missionElementChildren);
      } else {
        if (missionStatus.contains("mission_panel_green")) {
          classList = missionElement.classList;
          if (classList.contains("panel-success")) {
            state(Collapse, missionElement, missionElementChildren);
          } else {
            state(greenStatus, missionElement, missionElementChildren);
          }
        }
      }
    }
  }
  function state(type, item, itemChildren) {
    switch(type) {
      case Nothing:
        item.style.display = "";
        itemChildren[1].style.display = "";
        break;
      case Collapse:
        item.style.display = "";
        itemChildren[1].style.display = "none";
        break;
      case Hidden:
        item.style.display = "none";
        itemChildren[1].style.display = "none";
        break;
    }
  }
  function initialize() {
    var Missions = $(".missionSideBarEntry");
    for (var i = 0; i < Missions.length; i++) {
      var missionID = Missions[i].getAttribute("mission_id");
      var missionOut = JSON.parse(localStorage.getItem("lssm_missionOut"));
      if (missionOut == null) {
        stateSwitcher(Missions[i].firstElementChild, GM_config.get("greenStatus"), GM_config.get("yellowStatus"));
      } else {
        if (!missionOut.hasOwnProperty(missionID)) {
          stateSwitcher(Missions[i].firstElementChild, GM_config.get("greenStatus"), GM_config.get("yellowStatus"));
        }
      }
    }
  }
})();