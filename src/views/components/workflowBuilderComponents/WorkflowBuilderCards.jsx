import React, { memo } from 'react';
import '../../../assets/scss/workflowBuilder/workflowBuilderCard.scss';
import { ReactComponent as EmailSvg } from '../../../assets/svg/worflow_builder/email.svg';

const FirstWorkflowCard = ({ openModal, workflowdata }) => {
	return (
		<div className="FirstWorkflowCard cardContentContainer" onClick={openModal}>
			<div className="cardContentContainerheader">
				<span className="cardContentContainerheaderSubTitle">Workflow Start Point</span>
				<span className="cardContentContainerheaderTitle">{workflowdata?.module}</span>
			</div>
			<div className="actionContainer">
				<div className="viewBtn">View</div>
				<div className="editBtn">Edit Form</div>
			</div>
		</div>
	);
};

const EmailCards = ({ openModal, workflowdata }) => {
	return (
		<div className="cardContentContainer" onClick={openModal}>
			<div className="footer">
				<EmailSvg />
				<span className="cardContentContainerheaderSubTitle">Email template</span>
				<span className="cardContentContainerheaderTitle">
					{workflowdata?.emailTemplateSubject}
				</span>
				<span className="cardContentContainerheaderSubTitle">
					Immediately after Payment is made
				</span>
			</div>
		</div>
	);
};

const WorkflowBuilderCards = ({ workflowdata, openModal }) => {
	const mapper = {
		email: <EmailCards openModal={openModal} workflowdata={workflowdata} />,
	};
	return (
		<div className="WorkflowBuilderCardsParentContainer">
			{mapper?.[workflowdata?.module] ? (
				mapper?.[workflowdata?.module]
			) : (
				<FirstWorkflowCard openModal={openModal} workflowdata={workflowdata} />
			)}
		</div>
	);
};

export default memo(WorkflowBuilderCards);
