import React, { memo } from 'react';
import '../../../assets/scss/workflowBuilder/workflowBuilderCard.scss';
import { ReactComponent as EmailSvg } from '../../../assets/svg/worflow_builder/email.svg';

const FirstWorkflowCard = ({ publicData, openPreviewModal }) => {
	return (
		<div className="previewCard" onClick={() => openPreviewModal('public')}>
			<div className="htmlContentViewer">
				<div className="coverImage">
					<div
						dangerouslySetInnerHTML={{
							__html: Object.values(publicData)?.[0]?.parsedHtmlContent,
						}}
						style={{ width: '100%' }}
					/>
				</div>
			</div>
			<div className="previewLabelContent">
				<span className="topLabelStyle">Workflow Start Point</span>
				<span className="labelTitle">Enquiry Form</span>
				<div className="actionContainer">
					<div className="viewBtn">View</div>
					<div className="editBtn">Edit Form</div>
				</div>
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
const EndPointViewCard = () => {
	return (
		<div className="endViewCard">
			<span className="subalabel">WorkFlow Ends Here </span>
		</div>
	);
};

const PreviewCard = ({ templateData, openPreviewModal, privateData }) => {
	return (
		<div className="previewCard" onClick={() => openPreviewModal('private')}>
			<div className="htmlContentViewer">
				<div className="coverImage">
					<div
						dangerouslySetInnerHTML={{
							__html: Object.values(privateData)?.[0]?.parsedHtmlContent,
						}}
						style={{ width: '100%' }}
					/>
				</div>
			</div>
			<div className="previewLabelContent">
				<span className="topLabelStyle">Timeless Touch of Beige</span>
				<span className="labelTitle">All Files</span>
				<span className="labelSubtitle">
					Immediately after Form is submitted, wait for my approval
				</span>
			</div>
		</div>
	);
};

const WorkflowBuilderCards = ({
	workflowdata,
	templateData,
	openModal,
	openPreviewModal,
	index,
	publicData,
	privateData,
}) => {
	const mapper = {
		email: <EmailCards openModal={openModal} workflowdata={workflowdata} index={index} />,
		theEnd: <EndPointViewCard />,
		preview: (
			<PreviewCard
				templateData={templateData}
				openPreviewModal={openPreviewModal}
				privateData={privateData}
			/>
		),
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
					publicData={publicData}
					openPreviewModal={openPreviewModal}
				/>
			)}
		</div>
	);
};

export default memo(WorkflowBuilderCards);
