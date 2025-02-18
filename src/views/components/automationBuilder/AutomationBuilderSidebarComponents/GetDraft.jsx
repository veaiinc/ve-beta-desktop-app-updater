import React, { memo } from 'react';
import HeaderComponent from './HeaderComponent';
import ActionDetailsBlock from './ActionDetailsBlock';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/getDraft.scss';
const GetDraft = ({ onClose, actionLabel = '', actionType = '' }) => {
	return (
		<>
			<HeaderComponent onClose={onClose} heading={'Get Draft'} />
			<ActionDetailsBlock actionLabel={'Get Draft'} heading={'Actions'} />
			<div className="getDraftContainer">
				<h3>Inputs</h3>
				<div className="getDraftInputsContainer">
					<div className="getDraftInput">
						<span className="getDraftInputLabel">Connected Email</span>
						<input type="text" placeholder="Draft ID" />
					</div>
					<div className="getDraftInput">
						<span className="getDraftInputLabel">Draft ID</span>
						<input type="text" placeholder="Draft ID" />
					</div>
				</div>
			</div>
		</>
	);
};

export default memo(GetDraft);
