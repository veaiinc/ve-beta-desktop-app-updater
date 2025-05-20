import React, { memo, useState } from 'react';
import DotWhite from '../../../../assets/svg/Settings/dot-white.svg?react';
import Speaker from '../../../../assets/svg/Settings/speaker.svg?react';
import SpeakerActive from '../../../../assets/svg/Settings/speaker-active.svg?react';
import Dustbin from '../../../../assets/svg/Settings/dustbin.svg?react';
import Reload from '../../../../assets/svg/Settings/reload.svg?react';
import '../../../../assets/scss/settings/aiSetupPage.scss';

const QueryResponseCustomization = () => {
	const [info, setInfo] = useState({
		speakerActive: false,
	});

	const handleSetSpeakerActive = () => {
		setInfo((prev) => ({ ...prev, speakerActive: !prev.speakerActive }));
	};

	return (
		<>
			<div className="ai-query-response">
				<h1>See and adjust how your assistant responds to queries</h1>
			</div>
			<div className="test-cases-container">
				<div className="test-case-container">
					<span className="test-case-number">Test case {1}</span>
					<div className="test-case-information">
						<span className="test-case-query">Query</span>
						<div className="query-container">
							<input type="text" placeholder="What's your name?" />
						</div>
						<div className="test-case-response">
							<span>Response</span>
							<span className="dot-white">
								<DotWhite />
							</span>
							<span className="ai-name">{'Optimus'}</span>
							<span className="ai">AI</span>
							<span
								onClick={handleSetSpeakerActive}
								className={`speaker ${info.speakerActive ? 'speaker-active' : ''}`}
							>
								{info.speakerActive ? <SpeakerActive /> : <Speaker />}
							</span>
						</div>
						<div className="response-container">
							<p>Hi! I am Optimus</p>
						</div>
						<div className="test-case-actions">
							<Reload />
							<Dustbin />
						</div>
					</div>
				</div>
				<div className="all-test-cases-actions">
					<button>Run Test Cases</button>
					<button>Add Test Case</button>
				</div>
			</div>
		</>
	);
};

export default memo(QueryResponseCustomization);
