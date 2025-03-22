import React, { useContext, useEffect, useState } from 'react';
import '../../../assets/scss/AiSetup/aiSetup.scss';
import SectionBlock from '../../components/AiSetup/SectionBlock';
import Context from '../../../context/context';

const AiSetup = () => {
	const {
		aiSetup: { getAiSetup, aiSetupData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		aiSetup: null,
	});

	useEffect(() => {
		if (!aiSetupData) {
			getAiSetup();
		} else {
			setInfo({ aiSetup: aiSetupData });
		}
	}, [aiSetupData]);

	return (
		<div className="AiSetupContainer">
			<div className="AiSetupWrapper">
				{/* <div className="ai-setup-tabs">Tabs goes here</div> */}
				<div className="ai-setup-sections">
					<h1 className="ai-setup-title">
						Tell me about your business, and I'll help you achieve your goals!
					</h1>
					<SectionBlock title="Goals" data={aiSetupData?.goal} />
					<SectionBlock title="Things I need to know" data={aiSetupData?.focus} />
					<SectionBlock title="Memory" type="memory" data={aiSetupData?.memory} />
				</div>
			</div>
		</div>
	);
};

export default AiSetup;
