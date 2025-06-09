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

export const generateRandomAIAgentDetails = () => {
	const pattern = Math.floor(Math.random() * 4) + 1;
	let agentName = '';
	let agentDescription = '';

	const getRandom = (list) => list[Math.floor(Math.random() * list.length)];

	switch (pattern) {
		case 1: {
			const prefix = getRandom(prefixes);
			const number = Math.floor(Math.random() * 999) + 1;
			agentName = `${prefix}${number}`;
			agentDescription = `A futuristic agent powered by the ${prefix} protocol series ${number}.`;
			break;
		}
		case 2: {
			const adjective = getRandom(adjectives);
			const noun = getRandom(nouns);
			agentName = `${adjective}${noun}`;
			agentDescription = `An AI assistant known for its ${adjective.toLowerCase()} nature and ${noun.toLowerCase()}-like abilities.`;
			break;
		}
		case 3: {
			const prefix = getRandom(prefixes);
			const suffix = getRandom(suffixes);
			agentName = `${prefix}${suffix}`;
			agentDescription = `A next-gen AI ${suffix.toLowerCase()} developed with ${prefix} intelligence.`;
			break;
		}
		case 4: {
			const adjective = getRandom(adjectives);
			const suffix = getRandom(suffixes);
			agentName = `${adjective}${suffix}`;
			agentDescription = `A ${adjective.toLowerCase()} AI ${suffix.toLowerCase()} designed to assist in dynamic environments.`;
			break;
		}
	}

	return { agentName, agentDescription };
};
