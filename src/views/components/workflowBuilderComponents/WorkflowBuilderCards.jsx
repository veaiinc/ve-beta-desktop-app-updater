import React, { memo } from 'react';
import '../../../assets/scss/workflowBuilder/workflowBuilderCard.scss';

const FirstWorkflowCard = () => {
	return (
		<div className="FirstWorkflowCard cardContentContainer">
			<div className="cardContentContainerheader">
				<span className="cardContentContainerheaderSubTitle">Workflow Start Point</span>
				<span className="cardContentContainerheaderTitle">
					Enquiry form for Running your studio Like Made in Heaven
				</span>
			</div>
			<div className="actionContainer">
				<div className="viewBtn">View</div>
				<div className="editBtn">Edit Form</div>
			</div>
		</div>
	);
};
const WorkflowBuilderCards = () => {
	return (
		<div className="WorkflowBuilderCardsParentContainer">
			<FirstWorkflowCard />
		</div>
	);
};

export default memo(WorkflowBuilderCards);
