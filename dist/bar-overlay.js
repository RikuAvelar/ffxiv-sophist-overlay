'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ANIMATION_TIME = 2000;
var DPS_CEILING = 4000;
var settings = JobSortSettings;

if (!Array.prototype.contains) {
  Array.prototype.contains = function (search) {
    return this.indexOf(search) !== -1;
  };
}

var Meter = function () {
  function Meter() {
    _classCallCheck(this, Meter);

    // Create Elements
    this.el = document.createElement('div');
    this.progBar = document.createElement('div');
    this.critBar = document.createElement('div');
    this.dpsBar = document.createElement('div');
    this.label = document.createElement('label');
    this.nameLabel = document.createElement('label');

    // Attach classes
    this.el.classList.add('hidden');
    this.el.classList.add('member-bar');
    this.progBar.classList.add('progress');
    this.dpsBar.classList.add('progress-bar');
    this.critBar.classList.add('crit-bar');
    this.label.classList.add('damage-label');
    this.nameLabel.classList.add('name-label');

    // Create Hierarchy

    this.el.appendChild(this.progBar);
    this.el.appendChild(this.label);
    this.el.appendChild(this.nameLabel);

    this.progBar.appendChild(this.dpsBar);
    this.progBar.appendChild(this.critBar);
  }

  _createClass(Meter, [{
    key: 'setHealer',
    value: function setHealer(state) {
      if (state) {
        this.critBar.classList.add('healer');
        this.dpsBar.classList.add('healer');
      } else {
        this.critBar.classList.remove('healer');
        this.dpsBar.classList.remove('healer');
      }
    }
  }, {
    key: 'calcStates',
    value: function calcStates(personal, total, crit, top, barWeight, name) {
      var dpsWeight = personal / top * 100;

      if (barWeight !== undefined) {
        dpsWeight = barWeight;
      }

      var critWeight = crit / 100 * dpsWeight;

      if (critWeight > 1) {
        this.critBar.style.width = crit / 100 * dpsWeight + '%';
        this.critBar.style.display = 'block';
      } else {
        this.critBar.style.display = 'none';
      }

      this.dpsBar.style.width = dpsWeight + "%";

      this.label.innerText = Math.floor(personal);

      this.nameLabel.innerText = name || '';
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.calcStates(0, 0, 0, 1, 1);
    }
  }, {
    key: 'toggle',
    value: function toggle(state) {
      if (state === undefined) {
        state = !this.el.classList.contains('hidden');
      }
      if (!state) {
        this.el.classList.add('hidden');
      } else {
        this.el.classList.remove('hidden');
      }
    }
  }, {
    key: 'appendTo',
    value: function appendTo(el) {
      el.appendChild(this.el);
    }
  }]);

  return Meter;
}();

var partyList = [];
var lastUpdate = void 0;

var init = function init() {
  var container = document.querySelector('#container');
  var partyCount = settings.showParty ? 8 : 1;
  for (var i = 0; i < partyCount; i++) {
    var meter = new Meter();
    partyList.push(meter);
    meter.appendTo(container);
  }
  container.classList.add('ui-' + settings.uiSize);
};

var container = document.querySelector('#container');
var logOnSleep = _.debounce(function () {
  // Log last received event, for development and debug purposes
  if (settings._logLastUpdate && lastUpdate) {
    console.log(JSON.stringify(lastUpdate));
    lastUpdate = undefined;
  }
}, 10000);

var onUpdate = _.throttle(function (event) {
  var parseData = event.detail;
  if (!parseData.isActive) {
    container.classList.remove('active');
    partyList.forEach(function (meter) {
      meter.toggle(false);
      meter.reset();
    });
  } else {
    var _ret = function () {
      lastUpdate = _.clone(parseData);
      logOnSleep();
      container.classList.add('active');

      var combatants = {};
      var keys = _.keys(parseData.Combatant);

      if (keys.length < 12) {
        combatants = _.extend(parseData.Combatant);
      } else {
        combatants = {
          'you': _.find(parseData.Combatant, function (c) {
            return c.name.toLowerCase() === 'you';
          }),
          'top': _.maxBy(_.values(parseData.Combatant), function (c) {
            return c.name.toLowerCase() === 'you' && c ? 0 : c.encdps;
          })
        };
      }

      var topDPS = Math.max.apply(Math, Object.values(combatants).map(function (member) {
        return member.encdps;
      }));
      if (topDPS === Infinity) topDPS = 0.000001;

      var topHPS = Math.max.apply(Math, Object.values(combatants).map(function (member) {
        return member.enchps;
      }));
      if (topHPS === Infinity) topHPS = 0.000001;

      var encDPS = parseData.Encounter.encdps;
      if (encDPS === Infinity) encDPS = 0;

      var ownData = _.find(combatants, function (data, name) {
        return name.toLowerCase() === 'you';
      });

      if (!ownData) return {
          v: void 0
        };

      var ownJob = ownData.Job;

      var ownRole = Object.keys(settings.roles).find(function (role) {
        return settings.roles[role].contains(ownJob.toUpperCase());
      }) || 'dps';

      var cleanData = _.compact(_.map(combatants, function (member) {
        var name = member.name,
            job = member.Job,
            dps = member.encdps,
            hps = member.enchps,
            crit = member['crithit%'],
            overheal = member['OverHealPct'];


        var role = Object.keys(settings.roles).find(function (role) {
          return settings.roles[role].contains(job.toUpperCase());
        }) || 'dps';
        var jobIndex = _.indexOf(settings.roles[role], job.toUpperCase());
        var roleIndex = settings[ownRole].indexOf(role[0].toUpperCase());

        dps = Number(dps);
        if (!_.isFinite(dps)) dps = 0;
        hps = Number(hps);
        if (!_.isFinite(hps)) hps = 0;

        crit = parseInt(crit.replace('%'));
        if (!_.isFinite(crit)) crit = 0;

        overheal = parseInt(overheal.replace('%'));
        if (!_.isFinite(overheal)) {
          overheal = 0;
        } else {
          overheal = Math.max(100 - overheal, 0);
        }

        var isMe = name.toLowerCase() === 'you' ? -1 : 1;
        var showHPS = settings.showHPS && role === 'healer';

        if (!job) return;

        return {
          name: name,
          role: role,
          roleIndex: roleIndex,
          job: job,
          jobIndex: jobIndex,

          dps: dps,
          hps: hps,

          crit: crit,
          overheal: overheal,

          isMe: isMe,
          showHPS: showHPS
        };
      }));

      var sortedData = _.sortBy(cleanData, ['isMe', 'roleIndex', 'jobIndex', 'name']);
      var jobCount = _.countBy(cleanData, 'job');

      partyList.forEach(function (meter, index) {
        if (index >= sortedData.length) {
          meter.toggle(false);
        } else {
          try {
            var data = sortedData[index];
            meter.toggle(true);
            var name = void 0;
            if (data.name.toLowerCase() != 'you' && (settings._showNames || jobCount[data.job] > 1)) {
              name = data.name.split(' ').map(function (n) {
                return n[0];
              }).join(' ');
            }
            if (data.showHPS) {
              meter.setHealer(true);
              meter.calcStates(data.hps, 0, data.crit, topHPS, data.overheal, name);
            } else {
              meter.setHealer(false);
              meter.calcStates(data.dps, encDPS, data.crit, topDPS, undefined, name);
            }
          } catch (e) {
            meter.calcStates(0, 0, 0, 1);
          }
        }
      });
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }
}, 100);

init();
document.addEventListener('onOverlayDataUpdate', onUpdate);
