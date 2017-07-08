/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _settings = __webpack_require__(6);

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ANIMATION_TIME = 2000;
var DPS_CEILING = 4000;
var settings = _settings2.default;

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
    this.dhBar = document.createElement('div');
    this.cdhBar = document.createElement('div');
    this.dpsBar = document.createElement('div');
    this.label = document.createElement('label');
    this.nameLabel = document.createElement('label');

    // Attach classes
    this.el.classList.add('hidden');
    this.el.classList.add('member-bar');
    this.progBar.classList.add('progress');
    this.dpsBar.classList.add('progress-bar');
    this.critBar.classList.add('crit-bar');
    this.dhBar.classList.add('direct-hit-bar');
    this.cdhBar.classList.add('direct-hit-crit-bar');
    this.label.classList.add('damage-label');
    this.nameLabel.classList.add('name-label');

    // Create Hierarchy

    this.el.appendChild(this.progBar);
    this.el.appendChild(this.label);
    this.el.appendChild(this.nameLabel);

    this.progBar.appendChild(this.dpsBar);
    this.progBar.appendChild(this.critBar);
    this.progBar.appendChild(this.dhBar);
    this.progBar.appendChild(this.cdhBar);

    this.reset();
    this.toggle(false);
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
    key: 'oldCalcStates',
    value: function oldCalcStates(personal, total, crit, top, barWeight, name) {
      return this.calcStates({ personal: personal, total: total, crit: crit, top: top, barWeight: barWeight, name: name });
    }
  }, {
    key: 'calcStates',
    value: function calcStates(_ref) {
      var personal = _ref.personal,
          total = _ref.total,
          crit = _ref.crit,
          directHit = _ref.directHit,
          critDirectHit = _ref.critDirectHit,
          top = _ref.top,
          barWeight = _ref.barWeight,
          name = _ref.name;

      var dpsWeight = personal / top * 100;

      if (barWeight !== undefined) {
        dpsWeight = barWeight;
      }

      var critWeight = crit / 100 * dpsWeight;
      var dhWeight = directHit / 100 * dpsWeight;
      var cdhWeight = critDirectHit / 100 * dpsWeight;

      var indexList = [critWeight, dhWeight, cdhWeight].sort(function (a, b) {
        return b - a;
      });

      if (dhWeight > 1) {
        this.dhBar.style.width = dhWeight + '%';
        this.dhBar.style.display = 'block';
        this.dhBar.style.zIndex = indexList.indexOf(dhWeight);
      } else {
        this.dhBar.style.display = 'none';
      }

      if (critWeight > 1) {
        this.critBar.style.width = critWeight + '%';
        this.critBar.style.display = 'block';
        this.critBar.style.zIndex = indexList.indexOf(critWeight);
      } else {
        this.critBar.style.display = 'none';
      }

      if (cdhWeight > 1) {
        this.cdhBar.style.width = cdhWeight + '%';
        this.cdhBar.style.display = 'block';
        this.cdhBar.style.zIndex = indexList.indexOf(cdhWeight);
      } else {
        this.cdhBar.style.display = 'none';
      }

      this.dpsBar.style.width = dpsWeight + "%";

      this.label.innerText = Math.floor(personal);

      this.nameLabel.innerText = name || '';
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.oldCalcStates(0, 0, 0, 1, 1);
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
    meter.reset();
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
  console.log(event.detail);
  var parseData = event.detail;
  if (!parseData.isActive) {
    console.log('inactive');
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
        var youObj = _.find(parseData.Combatant, function (c) {
          return c.name.toLowerCase() === 'you';
        });
        combatants = {
          'you': youObj,
          'top': _.maxBy(_.values(parseData.Combatant), function (c) {
            return c.name.toLowerCase() === 'you' && c ? 0 : Number(c.ENCDPS || c.encdps);
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
            overheal = member['OverHealPct'],
            directHit = member['DirectHitPct'],
            critDirectHit = member['CritDirectHitPct'];


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

        directHit = parseInt(directHit.replace('%'));
        if (!_.isFinite(directHit)) directHit = 0;

        critDirectHit = parseInt(critDirectHit.replace('%'));
        if (!_.isFinite(critDirectHit)) critDirectHit = 0;

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
          directHit: directHit,
          critDirectHit: critDirectHit,
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
              meter.calcStates({ personal: data.hps, total: 0, directHit: data.directHit, critDirectHit: data.critDirectHit, crit: data.crit, top: topHPS, barWeight: data.overheal, name: name });
            } else {
              meter.setHealer(false);
              meter.calcStates({ personal: data.dps, total: encDPS, directHit: data.directHit, critDirectHit: data.critDirectHit, crit: data.crit, top: topDPS, barWeight: undefined, name: name });
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

/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var JobSortSettings = {
	// Role Sort
	tank: 'THD',
	healer: 'THD',
	dps: 'TDH',
	other: 'THD',

	// Job Sort
	roles: {
		tank: ['PLD', 'GLD', 'WAR', 'MRD', 'DRK'],
		healer: ['WHM', 'CNJ', 'SCH', 'AST'],
		dps: ['MNK', 'PGL', 'NIN', 'ROG', 'SAM', 'BRD', 'ARC', 'MCH', 'BLM', 'THM', 'SMN', 'ACN', 'RDM']
	},

	// Show HPS for Healer Bars
	showHPS: true,

	// Size of UI (default is 3)
	uiSize: 3,

	// Show rest of party
	showParty: true,

	// ====== DEBUG OPTIONS ======
	_showNames: false,
	_logLastUpdate: false
};

exports.default = JobSortSettings;

/***/ })

/******/ });