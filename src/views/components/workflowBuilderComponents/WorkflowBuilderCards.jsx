import React, { memo } from 'react';
import '../../../assets/scss/workflowBuilder/workflowBuilderCard.scss';
import { ReactComponent as EmailSvg } from '../../../assets/svg/worflow_builder/email.svg';

const FirstWorkflowCard = ({ openModal, workflowdata, index }) => {
	return (
		<div
			className="FirstWorkflowCard cardContentContainer"
			onClick={() => openModal(workflowdata, index)}
		>
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

const EmailCards = ({ openModal, workflowdata, index }) => {
	return (
		<div className="cardContentContainer" onClick={() => openModal(workflowdata, index)}>
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

const WorkflowBuilderCards = ({ workflowdata, openModal, index }) => {
	const mapper = {
		email: <EmailCards openModal={openModal} workflowdata={workflowdata} index={index} />,
	};
	return (
		<div className="WorkflowBuilderCardsParentContainer">
			{mapper?.[workflowdata?.module] ? (
				mapper?.[workflowdata?.module]
			) : (
				<FirstWorkflowCard
					openModal={openModal}
					workflowdata={workflowdata}
					index={index}
				/>
			)}
		</div>
	);
};

export default memo(WorkflowBuilderCards);
