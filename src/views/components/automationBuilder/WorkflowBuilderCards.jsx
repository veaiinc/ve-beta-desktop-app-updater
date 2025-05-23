import React, { memo, useCallback } from 'react';
import '../../../assets/scss/automation_builder/workflowBuilderCard.scss';
import { ReactComponent as EmailSvg } from '../../../assets/svg/worflow_builder/email.svg';
import { fetchOriginSelection } from '../../../helpers';
let origin = fetchOriginSelection();
const FirstWorkflowCard = ({ openPreviewModal, editOnClickHandler, templateData }) => {
	const data = templateData?.moduleTemplates?.filter((e) => e?.isPublic);
	return (
		<div className="previewCard" onClick={() => openPreviewModal('public')}>
			<div className="htmlContentViewer">
				<div className="coverImage" style={{ pointerEvents: 'none' }}>
					<iframe
						src={`${origin}/preview/${templateData?._id}?module=${data?.[0]?._id}&isPubic=${data?.[0]?.isPublic}&restrictClick=true`}
						title="Builder Preview"
						width="100%"
						height="100%"
						style={{ zoom: 0.2 }}
					/>
				</div>
			</div>
			<div className="previewLabelContent">
				<span className="topLabelStyle">Workflow Start Point</span>
				<span className="labelTitle">Enquiry Form</span>
				<div className="actionContainer">
					<div className="viewBtn">View</div>
					<div
						className="editBtn"
						onClick={(e) => {
							editOnClickHandler();
							e.stopPropagation();
						}}
					>
						Edit Form
					</div>
				</div>
			</div>
		</div>
	);
};

const EmailCards = ({ openModal, workflowdata, index }) => {
	return (
		<div className="cardContentContainer" onClick={() => openModal(workflowdata, index)}>
			<div className="cardContentContainerfooter">
				<div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
					{' '}
					<EmailSvg />
					<span className="cardContentContainerheaderSubTitle">Send Email</span>
				</div>

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

const PreviewCard = ({ templateData, openPreviewModal }) => {
	const data = templateData?.moduleTemplates?.filter((e) => !e?.isPublic);
	return (
		<div className="previewCard" onClick={() => openPreviewModal('private')}>
			<div className="htmlContentViewer">
				<div className="coverImage" style={{ pointerEvents: 'none' }}>
					<iframe
						src={`${origin}/preview/${templateData?._id}?module=${data?.[0]?._id}&isPubic=${data?.[0]?.isPublic}&restrictClick=true`}
						title="Builder Preview"
						width="100%"
						height="100%"
						style={{ zoom: 0.2 }}
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
}) => {
	const mapper = {
		email: <EmailCards openModal={openModal} workflowdata={workflowdata} index={index} />,
		theEnd: <EndPointViewCard />,
		preview: <PreviewCard templateData={templateData} openPreviewModal={openPreviewModal} />,
	};

	const editOnClickHandler = useCallback(() => {
		window.location.href = `${origin}/${templateData?._id}`;
	}, [templateData]);

	return (
		<div className="WorkflowBuilderCardsParentContainer">
			{mapper?.[workflowdata?.module] ? (
				mapper?.[workflowdata?.module]
			) : (
				<FirstWorkflowCard
					openModal={openModal}
					workflowdata={workflowdata}
					index={index}
					openPreviewModal={openPreviewModal}
					editOnClickHandler={editOnClickHandler}
					templateData={templateData}
				/>
			)}
		</div>
	);
};

export default memo(WorkflowBuilderCards);
