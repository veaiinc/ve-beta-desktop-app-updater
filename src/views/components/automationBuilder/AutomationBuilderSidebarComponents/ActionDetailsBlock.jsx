import React, { memo } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/actionDetailsBlock.scss';

const ActionDetailsBlock = ({ actionLabel = '', heading = 'Actions' }) => {
	return (
		<div className="actionDetailsBlockContainer">
			<div className="actionDetailsBlockHeader">
				<div className="actionDetailsBlockHeaderLeft">
					<h3>{heading}</h3>
					<span className="actionDetailsBlockHeaderActionName">{actionLabel}</span>
				</div>
				<button className="actionDetailsBlockHeaderButton">Change</button>
			</div>
			<div className="actionDetailsBlockBody">
				<input
					type="text"
					placeholder="Action Name"
					className="actionDetailsBlockTitleInput"
				/>
				<input
					type="text"
					placeholder="Action Description"
					className="actionDetailsBlockDescriptionInput"
				/>
			</div>
		</div>
	);
};

export default memo(ActionDetailsBlock);
