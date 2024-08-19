import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../assets/scss/sales/MyWorkflowsCard.scss';
import ActionCards from './ActionCards';
import StatsCard from './StatsCard';
import { ReactComponent as ArrowSvg } from '../../../assets/svg/worflow_builder/smallArrow.svg';
import { ReactComponent as UpArrow } from '../../../assets/svg/workflow/downArrow.svg';

const MyWorkflowsCard = ({ data, openModal, openCopyLinkModal, navigateToWorkflowBuilder }) => {
	const [info, setInfo] = useState({
		actionCards: [
			{
				headerText: 'Actions Required',
				subText: data?.actionRequired || 0,
				status: 'actionRequired',
				type: 'actionCards',
				modalHeader: 'Actions Required',
			},
			{
				headerText: 'All Enquires',
				subText: data?.formResponses || 0,
				status: 'allenquiries',
				type: 'actionCards',
				modalHeader: 'All Enquires',
			},
			{
				headerText: 'Smart File sent',
				subText: data?.filesSent || 0,
				status: 'allfilessent',
				type: 'actionCards',
				modalHeader: 'All Smart File Sent',
			},
			// { headerText: 'Expired', subText: '290', status: 'enquiry' },
			{
				headerText: 'Success Rate',
				subText:
					data?.filesSent && data?.filesSent > 0
						? Math.floor(
								((data?.workflowStats?.confirmed || 0) * 100) / data?.filesSent,
						  ) + '%'
						: '0 %',
				status: 'successRate',
				type: 'actionCards',
				modalHeader: '',
			},
		],
		statstCards: [
			{
				headerText: 'Enquiry',
				subText: data?.workflowStats?.enquiry || 0,
				status: 'enquiry',
				type: 'statstCards',
				modalHeader: 'Enquiry',
			},
			{
				headerText: 'Smart File sent',
				subText: data?.workflowStats?.filesSent || 0,
				status: 'filesSent',
				type: 'statstCards',
				modalHeader: 'Smart File sent',
			},
			{
				headerText: 'Smart Files Viewed',
				subText: data?.workflowStats?.filesViewed || 0,
				status: 'filesViewed',
				type: 'statstCards',
				modalHeader: 'Smart Files Viewed',
			},
			{
				headerText: 'Contract Signed',
				subText: data?.workflowStats?.contractSigned || 0,
				status: 'contractSigned',
				type: 'statstCards',
				modalHeader: 'Contract Signed',
			},
			{
				headerText: 'Booking Confirmed',
				subText: data?.workflowStats?.confirmed || 0,
				status: 'confirmed',
				type: 'statstCards',
				modalHeader: 'Booking Confirmed',
			},
			// { headerText: 'Proposal Expired', subText: '290', status: '' },
		],
		showCopyModalButton: false,
		formParsedContentHtml: '',
	});

	//useEFFects
	useEffect(() => {
		if (data) {
			handleIncomingData();
		}
	}, [data]);

	//functions definations
	const handleIncomingData = useCallback(async () => {
		const { moduleTemplates, templates } = data;
		let isPublic = false;
		let formData;
		let formParsedContentHtml = '';

		for (let i = 0; i < moduleTemplates.length; i++) {
			if (moduleTemplates?.[i]?.isPublic) {
				isPublic = true;
			}
			if (moduleTemplates?.[i]?.module === 'form') {
				formData = moduleTemplates?.[i];
			}
		}

		for (let i = 0; i < templates?.length; i++) {
			if (templates?.[i]?._id === formData?._id) {
				formParsedContentHtml = templates?.[i]?.parsedHtmlContent;
			}
		}

		setInfo((prev) => ({
			...prev,
			showCopyModalButton: isPublic,
			actionCards: [
				{
					headerText: 'Actions Required',
					subText: data?.actionRequired || 0,
					status: 'actionRequired',
					type: 'actionCards',
					modalHeader: 'Actions Required',
				},
				{
					headerText: 'All Enquires',
					subText: data?.formResponses || 0,
					status: 'allenquiries',
					type: 'actionCards',
					modalHeader: 'All Enquires',
				},
				{
					headerText: 'Smart File sent',
					subText: data?.filesSent || 0,
					status: 'allfilessent',
					type: 'actionCards',
					modalHeader: 'All Smart File Sent',
				},
				// { headerText: 'Expired', subText: '290', status: 'enquiry' },
				{
					headerText: 'Success Rate',
					subText:
						data?.filesSent && data?.filesSent > 0
							? Math.floor(
									((data?.workflowStats?.confirmed || 0) * 100) / data?.filesSent,
							  ) + '%'
							: '0 %',
					status: 'successRate',
					type: 'actionCards',
					modalHeader: '',
				},
			],
			statstCards: [
				{
					headerText: 'Enquiry',
					subText: data?.workflowStats?.enquiry || 0,
					status: 'enquiry',
					type: 'statstCards',
					modalHeader: 'Enquiry',
				},
				{
					headerText: 'Smart File sent',
					subText: data?.workflowStats?.filesSent || 0,
					status: 'filesSent',
					type: 'statstCards',
					modalHeader: 'Smart File sent',
				},
				{
					headerText: 'Smart Files Viewed',
					subText: data?.workflowStats?.filesViewed || 0,
					status: 'filesViewed',
					type: 'statstCards',
					modalHeader: 'Smart Files Viewed',
				},
				{
					headerText: 'Contract Signed',
					subText: data?.workflowStats?.contractSigned || 0,
					status: 'contractSigned',
					type: 'statstCards',
					modalHeader: 'Contract Signed',
				},
				{
					headerText: 'Booking Confirmed',
					subText: data?.workflowStats?.confirmed || 0,
					status: 'confirmed',
					type: 'statstCards',
					modalHeader: 'Booking Confirmed',
				},
				// { headerText: 'Proposal Expired', subText: '290', status: '' },
			],
			formParsedContentHtml,
		}));
	}, [data]);

	return (
		<div className="myWorkflowCard">
			<div className="imageContainer">
				<div className="hoverDropDownContainer">
					<div className="arrowContainer">
						<UpArrow />
					</div>
					<div className="hoverDropDownValues">
						{info?.showCopyModalButton ? (
							<span onClick={() => openCopyLinkModal(data)}>Copy link</span>
						) : (
							''
						)}
						<span onClick={() => navigateToWorkflowBuilder(data)}>Edit Workflow</span>
					</div>
				</div>

				<div className="coverImage">
					<div
						dangerouslySetInnerHTML={{
							__html: info?.formParsedContentHtml,
						}}
						style={{ width: '100%', height: '100%', zoom: 3 }}
					/>
				</div>
			</div>
			{/* content container */}
			<div
				style={{ display: 'flex', flexDirection: 'column', flex: 1, alignSelf: 'stretch' }}
			>
				<div className="workflowContentContainer">
					<span className="myworkflowHeader">{data?.title}</span>
					<div className="actionBtnContainer">
						{info?.actionCards?.map((ele, index) => (
							<ActionCards
								key={index}
								index={index}
								cardData={ele}
								onClickfunc={() => openModal(data, ele)}
							/>
						))}
					</div>

					<div className="statsCardSuperContainer">
						{info?.statstCards?.map((ele, index) => (
							<div className="statsInnerContainer" key={index}>
								<StatsCard
									cardsData={ele}
									onClickfunc={() => openModal(data, ele)}
								/>
								{info?.statstCards?.length - 2 > index ? (
									<ArrowSvg />
								) : index < info?.statstCards?.length - 1 ? (
									<div className="innerSeperator">
										<div className="verticalSeperator"></div>
									</div>
								) : (
									''
								)}
							</div>
						))}
					</div>
				</div>
				<div className="percentageSeperator">
					<div className="percentageCovered"></div>
				</div>
			</div>
		</div>
	);
};

export default memo(MyWorkflowsCard);
