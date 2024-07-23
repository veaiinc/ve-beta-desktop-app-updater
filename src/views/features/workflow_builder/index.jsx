import React, { memo, useState } from 'react';
import '../../../assets/scss/workflowBuilder/workflowbuilder.scss';
import { ReactComponent as BackArrow } from '../../../assets/svg/worflow_builder/BackArrow.svg';
const WorkflowBuilder = () => {
	const [info, setInfo] = useState({
		data: [
			{
				label: 'Workflow Start Point',
				title: 'Enquiry form for Running your studio Like Made in Heaven',
				actions: [{ name: 'View' }, { name: 'Edit Form' }],
			},
			{
				label: 'Wedding Proposal template',
				title: 'Proposal',
				actions: [],
				subLabel: 'Immediately after Form is submitted, wait for my approval',
			},
			{
				label: 'Reminder Email template',
				title: 'Send Reminder Email',
				actions: [{ name: 'Edit Email' }],
				subLabel: 'Wait for 2 hours after Proposal is sent and then wait for my approval',
			},
			{
				label: 'Follow Up Email template',
				title: 'Send Follow Up Email',
				actions: [{ name: 'Edit Email' }],
				subLabel: 'Wait for 2 days after Proposal is sent and then wait for my approval',
			},
		],
	});
	return (
		<div className="workflowBuilderContainer">
			{/* header */}
			<div className="workflowBuilderHeader">
				<div className="workflowBuilderNavigationContainer">
					<BackArrow />
					<span className="builderHeaderText">Run your Studio Like Made in Heaven</span>
					<div className="draftBtn">Draft</div>
				</div>
				<div className="discardSaveBtnGrp">
					<div className="discardBtn">Discard</div>
					<div className="saveChangesbtn">Save Changes</div>
				</div>
			</div>
			<div className="workflowBuilderContentContainer">
				{info?.data?.map((ele, index) => (
					<span>{ele?.title}</span>
				))}
			</div>
		</div>
	);
};

export default memo(WorkflowBuilder);
