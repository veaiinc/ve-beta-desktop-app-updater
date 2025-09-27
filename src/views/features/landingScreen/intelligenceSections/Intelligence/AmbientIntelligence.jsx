import { memo } from 'react';
import AnimatedSection from '../animations/AnimatedSection';
import { AMBIENT_INTELLIGENCE_CONTENT } from '../contentData';

const AmbientIntelligence = memo(function AmbientIntelligence() {
	return (
		<AnimatedSection
			introTitle="Ambient Intelligence"
			introSubhead="Not background noise. Pure signal. It senses context before you ask."
			actionsContent={AMBIENT_INTELLIGENCE_CONTENT}
			sectionId="AmbientIntelligence"
		/>
	);
});

export default AmbientIntelligence;
