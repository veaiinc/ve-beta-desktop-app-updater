import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../assets/scss/sales/MyWorkflowsCard.scss';
import ActionCards from './ActionCards';
import StatsCard from './StatsCard';
import { ReactComponent as ArrowSvg } from '../../../assets/svg/worflow_builder/smallArrow.svg';
import { ReactComponent as UpArrow } from '../../../assets/svg/workflow/downArrow.svg';
import { fetchOriginSelection } from '../../../helpers';

let origin = fetchOriginSelection();

const generateCardsInfoData = (data, type, moduleWithoutContract = false) => {
	if (type === 'actionCards') {
		return [
			{
				headerText: 'Actions Required',
				subText: data?.actionRequired || 0,
				status: 'actionRequired',
				type: 'actionCards',
				modalHeader: 'Actions Required',
			},
			{
				headerText: 'All Enquires',
				subText: data?.workflows || 0,
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
		];
	} else {
		const statusCardData = [
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
		];

		if (moduleWithoutContract) {
			statusCardData?.splice(3, 1, {
				headerText: 'Proposal Accepted',
				subText: data?.workflowStats?.proposalAccepted || 0,
				status: 'proposalAccepted',
				type: 'statstCards',
				modalHeader: 'Proposal Accepted',
			});
		}

		return statusCardData;
	}
};

const MyWorkflowsCard = ({ data, openModal, openCopyLinkModal, navigateToWorkflowBuilder }) => {
	const [info, setInfo] = useState({
		actionCards: [...generateCardsInfoData(data, 'actionCards')],
		statstCards: [...generateCardsInfoData(data, 'statstCards')],
		showCopyModalButton: false,
		contractExist: true,
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
		let contractExist = false;

		for (let i = 0; i < moduleTemplates.length; i++) {
			if (moduleTemplates?.[i]?.isPublic) {
				isPublic = true;
			}
			if (moduleTemplates?.[i]?.module === 'form') {
				formData = moduleTemplates?.[i];
			}

			if (moduleTemplates?.[i]?.module === 'contract') {
				contractExist = true;
			}
		}

		let actionCards = [
			...generateCardsInfoData(data, 'actionCards', contractExist ? false : true),
		];
		let statstCards = [
			...generateCardsInfoData(data, 'statstCards', contractExist ? false : true),
		];

		setInfo((prev) => ({
			...prev,
			showCopyModalButton: isPublic,
			actionCards,
			statstCards,

			contractExist,
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
						<span onClick={() => (window.location.href = `${origin}/${data?._id} `)}>
							Edit Design
						</span>
					</div>
				</div>

				<div className="coverImage">
					<iframe
						src={`${origin}/preview/${data?._id}?module=${data?.moduleTemplates?.[0]?._id}&isPubic=${data?.moduleTemplates?.[0]?.isPublic}&restrictClick=true`}
						title="Builder Preview"
						width="100%"
						height="100%"
						style={{ zoom: 0.3 }}
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
				{/* <div className="percentageSeperator">
					<div className="percentageCovered"></div>
				</div> */}
			</div>
		</div>
	);
};

export default memo(MyWorkflowsCard);
