const adjectives = ['Smart', 'Brave', 'Swift', 'Clever', 'Bold'];
const nouns = ['Falcon', 'Z', 'Oracle', 'Engine'];
const prefixes = [
	'AI',
	'Neo',
	'Cyber',
	'Omni',
	'Proto',
	'Meta',
	'Hyper',
	'Ultra',
	'Mega',
	'Super',
	'Quantum',
	'Nano',
	'Terra',
	'Penta',
	'Hexa',
];
const suffixes = [
	'Bot',
	'Core',
	'Mind',
	'Net',
	'Unit',
	'Agent',
	'System',
	'Logic',
	'Tech',
	'Sync',
	'Link',
	'Node',
	'Grid',
	'Mesh',
	'Hub',
];

export const generateRandomAIAgentName = () => {
	const pattern = Math.floor(Math.random() * 4) + 1;
	let name = '';

	switch (pattern) {
		case 1:
			name = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${
				Math.floor(Math.random() * 999) + 1
			}`;
			break;
		case 2:
			name = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${
				nouns[Math.floor(Math.random() * nouns.length)]
			}`;
			break;
		case 3:
			name = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${
				suffixes[Math.floor(Math.random() * suffixes.length)]
			}`;
			break;
		case 4:
			name = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${
				suffixes[Math.floor(Math.random() * suffixes.length)]
			}`;
			break;
	}

	return name;
};
