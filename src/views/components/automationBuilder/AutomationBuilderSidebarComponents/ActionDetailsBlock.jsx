import React, { memo } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/actionDetailsBlock.scss';

const ActionDetailsBlock = ({
	actionLabel = '',
	heading = 'Actions',
	title = '',
	description = '',
	updaterFn,
	type = 'action',
	onChangeButtonClick = () => {},
}) => {
	return (
		<div className="actionDetailsBlockContainer">
			<div className="actionDetailsBlockHeader">
				<div className="actionDetailsBlockHeaderLeft">
					<h3>{heading}</h3>
					<span className="actionDetailsBlockHeaderActionName">{actionLabel}</span>
				</div>
				<button className="actionDetailsBlockHeaderButton" onClick={onChangeButtonClick}>
					Change
				</button>
			</div>
			<div className="actionDetailsBlockBody">
				<input
					type="text"
					placeholder={type === 'trigger' ? 'Trigger title' : 'Action title'}
					className="actionDetailsBlockTitleInput"
					value={title}
					onChange={(e) => updaterFn({ title: e?.target?.value })}
				/>
				<input
					type="text"
					placeholder={type === 'trigger' ? 'Trigger description' : 'Action description'}
					className="actionDetailsBlockDescriptionInput"
					value={description}
					onChange={(e) => updaterFn({ description: e?.target?.value })}
				/>
			</div>
		</div>
	);
};

export default memo(ActionDetailsBlock);
