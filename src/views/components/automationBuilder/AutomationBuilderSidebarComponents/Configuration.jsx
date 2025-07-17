import React, { memo, useCallback, useState } from 'react';

import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/configration.scss';
import { message } from '../../globalComponents/CustomToast';

const Configuration = ({ specificAutomationInfo, updateCurrentAutomation }) => {
	const [info, setInfo] = useState({
		name: specificAutomationInfo?.name,
		description: specificAutomationInfo?.description,
	});

	const handleUpdateAutomation = useCallback(() => {
		if (!info?.name?.trim()) {
			message.error('Automation name is required');
			setInfo({ ...info, name: specificAutomationInfo?.name });
			return;
		}

		// if (!info?.description?.trim()) {
		// 	message.error('Automation description is required');
		// 	setInfo({ ...info, description: specificAutomationInfo?.description });
		// 	return;
		// }

		if (
			info?.name !== specificAutomationInfo?.name ||
			info?.description !== specificAutomationInfo?.description
		) {
			updateCurrentAutomation({
				name: info?.name,
				// description: info?.description,
			});
		}
	}, [
		info,
		updateCurrentAutomation,
		specificAutomationInfo?.name,
		specificAutomationInfo?.description,
	]);

	return (
		<div className="configurationContainer">
			<div className="configurationHeader">
				<input
					type="text"
					placeholder="Untitled Automation"
					className="automationTitleInput"
					value={info?.name}
					onChange={(e) => setInfo({ ...info, name: e?.target?.value })}
					onKeyDown={(e) => {
						if (e?.key === 'Enter') {
							handleUpdateAutomation();
						}
					}}
					onBlur={handleUpdateAutomation}
				/>
				<textarea
					name=""
					id=""
					placeholder="Add a description"
					className="automationDescriptionInput"
					value={info?.description}
					onChange={(e) => setInfo({ ...info, description: e?.target?.value })}
					// onBlur={handleUpdateAutomation}
					// onKeyDown={(e) => {
					// 	if (e?.key === 'Enter' && !e?.shiftKey) {
					// 		handleUpdateAutomation();
					// 	}
					// }}
				/>
			</div>
			<div className="configurationBody">
				<div className="workflowIssuesHeadingContainer">
					<h1 className="workflowIssuesHeading">Workflow issues</h1>
					<span className="workflowIssuesSubHeading">
						Make sure all issues are resolved before publishing
					</span>
				</div>
				<div className="workflowIssuesContainer">
					<span className="noIssuesText">No issues found</span>
				</div>
			</div>
		</div>
	);
};

export default memo(Configuration);
