import React, { memo, useCallback, useState } from 'react';

import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/configration.scss';
import { message } from 'antd';

const Configuration = ({ automationId, specificAutomationInfo, updateCurrentAutomation }) => {
	const [info, setInfo] = useState({
		name: specificAutomationInfo?.name,
		// automationDescription: specificAutomationInfo?.description,
	});

	const handleUpdateAutomation = useCallback(() => {
		if (!info?.name?.trim()) {
			message.error('Automation name is required');
			setInfo({ ...info, name: specificAutomationInfo?.name });
			return;
		}
		if (info?.name !== specificAutomationInfo?.name) {
			updateCurrentAutomation({
				name: info?.name,
			});
		}
	}, [info, updateCurrentAutomation, specificAutomationInfo?.name]);

	return (
		<div className="configurationContainer">
			<div className="configurationHeader">
				<input
					type="text"
					placeholder="Untitled Automation"
					className="automationTitleInput"
					value={info?.name}
					onChange={(e) => setInfo({ ...info, name: e.target.value })}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
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
					onChange={(e) => setInfo({ ...info, automationDescription: e.target.value })}
				/>
			</div>
			<div className="configurationBody">
				<div className="configurationBodyHeader">{/* <h3>Configuration</h3> */}</div>
			</div>
		</div>
	);
};

export default memo(Configuration);
