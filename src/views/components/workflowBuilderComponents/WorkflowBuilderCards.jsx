import React, { memo, useCallback, useMemo, useState } from 'react';
import '../../../assets/scss/workflowBuilder/workflowBuilderCard.scss';
import { ReactComponent as EmailSvg } from '../../../assets/svg/worflow_builder/email.svg';
import { ReactComponent as Duplicate } from '../../../assets/svg/worflow_builder/buildercard/duplicate.svg';
import { ReactComponent as Dustbin } from '../../../assets/svg/worflow_builder/buildercard/dustbin.svg';
import { ReactComponent as Edit } from '../../../assets/svg/worflow_builder/buildercard/edit.svg';
import { ReactComponent as Eye } from '../../../assets/svg/worflow_builder/buildercard/eye.svg';
import { Popover, Tooltip } from 'antd';

// const text = <span>Title</span>;

const FirstWorkflowCard = ({ openPreviewModal, editOnClickHandler, templateData }) => {
	const data = templateData?.moduleTemplates?.filter((e) => e?.isPublic);
	return (
		<Popover
			placement="right"
			title={HoverCards}
			arrow={false}
			overlayClassName="workflowBuilderCardContainer"
		>
			<div className="previewCard" onClick={() => openPreviewModal('public')}>
				<div className="htmlContentViewer">
					<div className="coverImage" style={{ pointerEvents: 'none' }}>
						<iframe
							src={
								window.location.hostname === 'localhost'
									? `http://localhost:3000/preview/${templateData?._id}?module=${data?.[0]?._id}&isPubic=${data?.[0]?.isPublic}&restrictClick=true`
									: `https://builder.ve.ai/preview/${templateData?._id}?module=${data?.[0]?._id}&isPubic=${data?.[0]?.isPublic}&restrictClick=true`
							}
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
		</Popover>
	);
};

const EmailCards = ({ openModal, workflowdata, index }) => {
	return (
		<Popover
			placement="right"
			title={HoverCards}
			arrow={false}
			overlayClassName="workflowBuilderCardContainer"
		>
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
		</Popover>
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
		<Popover
			placement="right"
			title={HoverCards}
			arrow={false}
			overlayClassName="workflowBuilderCardContainer"
		>
			<div className="previewCard" onClick={() => openPreviewModal('private')}>
				<div className="htmlContentViewer">
					<div className="coverImage" style={{ pointerEvents: 'none' }}>
						<iframe
							src={
								window.location.hostname === 'localhost'
									? `http://localhost:3000/preview/${templateData?._id}?module=${data?.[0]?._id}&isPubic=${data?.[0]?.isPublic}&restrictClick=true`
									: `https://builder.ve.ai/preview/${templateData?._id}?module=${data?.[0]?._id}&isPubic=${data?.[0]?.isPublic}&restrictClick=true`
							}
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
		</Popover>
	);
};

const HoverCards = () => {
	return (
		<div className="hoverCardsForExtraOptions">
			<Tooltip
				placement="right"
				title={<span style={{ color: '#111' }}>Edit</span>}
				arrow={false}
				color={'#fff'}
			>
				<Edit />
			</Tooltip>
			<Tooltip
				placement="right"
				title={<span style={{ color: '#111' }}>Show activity of action in pipeline</span>}
				arrow={false}
				color={'#fff'}
			>
				<Eye />
			</Tooltip>
			<Tooltip
				placement="right"
				title={<span style={{ color: '#111' }}>Duplicate</span>}
				arrow={false}
				color={'#fff'}
			>
				<Duplicate />
			</Tooltip>
			<Tooltip
				placement="right"
				title={<span style={{ color: '#111' }}>Delete Node</span>}
				arrow={false}
				color={'#fff'}
			>
				<Dustbin />
			</Tooltip>
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
	const editOnClickHandler = useCallback(() => {
		window.location.href = `https://builder.ve.ai/${templateData?._id}`;
	}, [templateData]);

	const mapper = {
		email: <EmailCards openModal={openModal} workflowdata={workflowdata} index={index} />,
		theEnd: <EndPointViewCard />,
		preview: <PreviewCard templateData={templateData} openPreviewModal={openPreviewModal} />,
		'start-step': (
			<FirstWorkflowCard
				openModal={openModal}
				workflowdata={workflowdata}
				index={index}
				openPreviewModal={openPreviewModal}
				editOnClickHandler={editOnClickHandler}
				templateData={templateData}
			/>
		),
		action: <EmailCards openModal={openModal} workflowdata={workflowdata} index={index} />,
		condition: <EmailCards openModal={openModal} workflowdata={workflowdata} index={index} />,
		notification: (
			<EmailCards openModal={openModal} workflowdata={workflowdata} index={index} />
		),
	};

	return (
		<div className="WorkflowBuilderCardsParentContainer">
			{mapper?.[workflowdata?.type] ? mapper?.[workflowdata?.type] : <EndPointViewCard />}
		</div>
	);
};

export default memo(WorkflowBuilderCards);
