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
					{agentIcon}
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
