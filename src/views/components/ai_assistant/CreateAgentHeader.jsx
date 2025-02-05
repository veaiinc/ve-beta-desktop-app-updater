import React, { memo } from 'react';
import { ReactComponent as BackSvg } from '../../../assets/svg/sidebar/leftarrowwhite.svg';
import '../../../assets/scss/ai_assistant/createAgentHeader.scss';

const CreateAgentHeader = ({
	name,
	onBack,
	onActionClick,
	status = null,
	backText = 'Back',
	actionText = 'Publish',
	actionIcon = null,
	agentIcon = null,
	actionBtnClassName = '',
	assistant,
}) => {
	return (
		<div className="create-agent-header">
			<div className="create-agent-header-left">
				<div className="create-agent-header-left-back" onClick={onBack}>
					<div className="create-agent-header-left-back-icon">
						<BackSvg />
					</div>
					<div className="create-agent-header-left-back-text">{backText}</div>
				</div>
				<div className="create-agent-header-left-agent-name">
					{assistant?.assitant_profile_picture_s3Key ? (
						<img
							src={assistant?.assitant_profile_picture_s3Key}
							alt="agent"
							style={{ borderRadius: '50%', width: '25px', height: '25px' }}
						/>
					) : (
						agentIcon
					)}

					{name}
				</div>
			</div>
			<div className="create-agent-header-right">
				{status && (
					<span className="create-agent-header-right-status">
						<div className="create-agent-header-right-status-icon" />
						{status}
					</span>
				)}
				<button
					className={`create-agent-header-right-button ${actionBtnClassName}`}
					onClick={onActionClick}
				>
					{actionIcon}
					{actionText}
				</button>
			</div>
		</div>
	);
};

export default memo(CreateAgentHeader);
