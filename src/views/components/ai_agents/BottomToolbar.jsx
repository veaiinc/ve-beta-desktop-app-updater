import React, { memo } from 'react';
import '../../../assets/scss/ai_agents/bottomToolbar.scss';
import { ReactComponent as Plus } from '../../../assets/svg/ai_agents/Plus.svg';
import { ReactComponent as Home } from '../../../assets/svg/ai_agents/home.svg';
import { ReactComponent as Settings } from '../../../assets/svg/ai_agents/settings.svg';
const BottomToolbar = ({ outerContainerStyle = {} }) => {
	return (
		<div className="bottomToolbar" style={{ ...outerContainerStyle }}>
			<input className="bottomToolbarInputs" placeholder="Ask AI" />
			<div className="quickActionsButtons">
				<Home />
			</div>
			<div className="quickActionsButtons">
				<Plus />
			</div>
			<div className="quickActionsButtons">
				<Settings />
			</div>
		</div>
	);
};

export default memo(BottomToolbar);
