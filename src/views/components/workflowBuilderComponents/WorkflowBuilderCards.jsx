import React, { memo } from 'react';
import '../../../assets/scss/workflowBuilder/workflowBuilderCard.scss';

const FirstWorkflowCard = ({ openModal }) => {
	return (
		<div className="FirstWorkflowCard cardContentContainer" onClick={openModal}>
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

const ImageCards = ({ openModal }) => {
	return (
		<div className="cardContentContainer" onClick={openModal}>
			<div className="imageContainer"></div>
			<div className="footer">
				<span className="cardContentContainerheaderSubTitle">Wedding Invoice template</span>
				<span className="cardContentContainerheaderTitle">Invoice</span>
				<span className="cardContentContainerheaderSubTitle">
					Immediately after Payment is made
				</span>
			</div>
		</div>
	);
};

const WorkflowBuilderCards = ({ workflowdata, openModal }) => {
	const mapper = {
		image: <ImageCards openModal={openModal} />,
	};
	return (
		<div className="WorkflowBuilderCardsParentContainer">
			{mapper?.[workflowdata?.type] ? (
				mapper?.[workflowdata?.type]
			) : (
				<FirstWorkflowCard openModal={openModal} />
			)}
		</div>
	);
};

export default memo(WorkflowBuilderCards);
