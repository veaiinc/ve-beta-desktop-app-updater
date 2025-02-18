import React, { useEffect } from 'react';
import '../../../assets/scss/chat/voice.scss';
import { ReactComponent as PauseSvg } from '../../../assets/svg/ai_agents/pause.svg';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as VoiceSvg } from '../../../assets/svg/ai_agents/voice.svg';
import { ReactComponent as VoiceLightSvg } from '../../../assets/svg/ai_agents/voice-light.svg';
import { ReactComponent as VoiceMuteSvg } from '../../../assets/svg/ai_agents/voice-mute.svg';

const Voice = ({ handleDisConnect, handleToggleMute, isVoiceMuted }) => {
	return (
		<div className="voiceIntegrationContainer">
			{/* <div className="voiceIntegrationText">Speak I am Listening</div> */}
			<div className="voiceIntegrationIconsContainer">
				<div className="icon-container" onClick={handleToggleMute}>
					{isVoiceMuted ? <VoiceMuteSvg /> : <VoiceLightSvg />}
				</div>
				<div className="speaking-icon-container">
					<div className="voice-container">
						<VoiceSvg />
					</div>
				</div>
				<div className="icon-container" onClick={handleDisConnect}>
					<CloseSvg />
				</div>
			</div>
		</div>
	);
};

export default Voice;
