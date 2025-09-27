import { memo } from 'react';
import AnimatedSection from '../animations/AnimatedSection';
import { SUPER_AGENT_CONTENT } from '../contentData';

const SuperAgent = memo(function SuperAgent() {
	return (
		<AnimatedSection
			introTitle="Super Agent"
			introSubhead="Ambient doesn't mean random. It means aware. It sees what you see."
			actionsContent={SUPER_AGENT_CONTENT}
			sectionId="SuperAgent"
		/>
	);
});

export default SuperAgent;
