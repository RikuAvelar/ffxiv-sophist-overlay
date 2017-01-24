const ANIMATION_TIME = 2000;
const DPS_CEILING = 4000;
const settings = JobSortSettings;

if(!Array.prototype.contains) {
  Array.prototype.contains = function(search) {
    return this.indexOf(search) !== -1;
  }
}

class Meter {
  constructor() {
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

  setHealer(state) {
    if(state) {
      this.critBar.classList.add('healer');
      this.dpsBar.classList.add('healer');
    } else {
      this.critBar.classList.remove('healer');
      this.dpsBar.classList.remove('healer');
    }
  }

  calcStates(personal, total, crit, top, barWeight, name) {
    let dpsWeight = ((personal / top) * 100);

    if(barWeight !== undefined) {
      dpsWeight = barWeight;
    }

    const critWeight = (crit / 100 * dpsWeight);

    if(critWeight > 1) {
      this.critBar.style.width = (crit / 100 * dpsWeight) + '%';
      this.critBar.style.display = 'block';
    } else {
      this.critBar.style.display = 'none';
    }

    this.dpsBar.style.width = dpsWeight + "%";

    this.label.innerText = Math.floor(personal);

    this.nameLabel.innerText = name || '';
  }

  reset() {
    this.calcStates(0, 0, 0, 1, 1);
  }

  toggle(state) {
    if(state === undefined) {
      state = !this.el.classList.contains('hidden');
    }
    if(!state) {
      this.el.classList.add('hidden');
    } else {
      this.el.classList.remove('hidden');
    }
  }

  appendTo(el) {
    el.appendChild(this.el);
  }
}

const partyList = [];
let lastUpdate;

const init = () => {
  const container = document.querySelector('#container');
  const partyCount = settings.showParty ? 8 : 1;
  for(let i = 0; i < partyCount; i++) {
    const meter = new Meter();
    partyList.push(meter);
    meter.appendTo(container);
  }
  container.classList.add(`ui-${settings.uiSize}`);
}

const container = document.querySelector('#container');
const logOnSleep = _.debounce(() => {
  // Log last received event, for development and debug purposes
  if(settings._logLastUpdate && lastUpdate) {
    console.log(JSON.stringify(lastUpdate));
    lastUpdate = undefined;
  }
}, 10000);

const onUpdate = _.throttle((event) => {
  const parseData = event.detail;
    if(!parseData.isActive) {
      container.classList.remove('active');
      partyList.forEach(meter => {
        meter.toggle(false);
        meter.reset();
      });
    } else {
      lastUpdate = _.clone(parseData);
      logOnSleep();
      container.classList.add('active');

      let combatants = {};
      const keys = _.keys(parseData.Combatant);

      if(keys.length < 12) {
        combatants = _.extend(parseData.Combatant);
      } else {
        combatants = {
          'you': _.find(parseData.Combatant, (c) => c.name.toLowerCase() === 'you'),
          'top': _.maxBy(_.values(parseData.Combatant), (c) => c.name.toLowerCase() === 'you' && c ? 0 : c.encdps)
        };
      }

      let topDPS = Math.max.apply(Math, Object.values(combatants).map((member) => {
        return member.encdps; 
      }));
      if(topDPS === Infinity) topDPS = 0.000001;

      let topHPS = Math.max.apply(Math, Object.values(combatants).map((member) => {
        return member.enchps; 
      }));
      if(topHPS === Infinity) topHPS = 0.000001;

      let encDPS = parseData.Encounter.encdps;
      if(encDPS === Infinity) encDPS = 0;

      const ownData = _.find(combatants, (data, name) => {
          return name.toLowerCase() === 'you';
      });

      if(!ownData) return;

      const {Job: ownJob} = ownData;
      const ownRole = Object.keys(settings.roles).find((role) => settings.roles[role].contains(ownJob.toUpperCase())) || 'dps';

      const cleanData = _.compact(_.map(combatants, (member) => {
        let {name, Job: job, encdps: dps, enchps: hps, 'crithit%': crit, 'OverHealPct': overheal} = member;

        const role = Object.keys(settings.roles).find((role) => settings.roles[role].contains(job.toUpperCase())) || 'dps';
        const jobIndex = _.indexOf(settings.roles[role], job.toUpperCase());
        const roleIndex = settings[ownRole].indexOf(role[0].toUpperCase());

        dps = Number(dps);
        if(!_.isFinite(dps)) dps = 0;
        hps = Number(hps);
        if(!_.isFinite(hps)) hps = 0;

        crit = parseInt(crit.replace('%'));
        if(!_.isFinite(crit)) crit = 0;

        overheal = parseInt(overheal.replace('%'));
        if(!_.isFinite(overheal)) {
          overheal = 0;
        } else {
          overheal = Math.max(100 - overheal, 0);
        }

        const isMe = name.toLowerCase() === 'you' ? -1 : 1;
        const showHPS = settings.showHPS && role === 'healer';

        if(!job) return;

        return {
          name,
          role,
          roleIndex,
          job,
          jobIndex,

          dps,
          hps,

          crit,
          overheal,

          isMe,
          showHPS
        };
      }));

      const sortedData = _.sortBy(cleanData, ['isMe', 'roleIndex', 'jobIndex', 'name']);
      const jobCount = _.countBy(cleanData, 'job');
      
      partyList.forEach((meter, index) => {
        if(index >= sortedData.length) {
          meter.toggle(false);
        } else {
          try {
            const data = sortedData[index];
            meter.toggle(true);
            let name;
            if(data.name.toLowerCase() != 'you' && (settings._showNames || jobCount[data.job] > 1)) {
              name = data.name.split(' ').map(n => n[0]).join(' ');
            }
            if(data.showHPS) {
              meter.setHealer(true);
              meter.calcStates(data.hps, 0, data.crit, topHPS, data.overheal, name);
            } else {
              meter.setHealer(false);
              meter.calcStates(data.dps, encDPS, data.crit, topDPS, undefined, name);
            }
          } catch(e) {
            meter.calcStates(0, 0, 0, 1);
          }
        }
      });
    }
}, 100);

init();
document.addEventListener('onOverlayDataUpdate', onUpdate);