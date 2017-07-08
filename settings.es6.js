const JobSortSettings = {
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
	showHPS: false,

	// Size of UI (default is 3)
	uiSize: 3,

	// Show rest of party
	showParty: false,

	// ====== DEBUG OPTIONS ======
	_showNames: false,
	_logLastUpdate: false
};

export default JobSortSettings;