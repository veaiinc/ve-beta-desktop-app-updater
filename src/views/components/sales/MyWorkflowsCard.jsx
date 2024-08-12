import React, { memo, useEffect, useState } from 'react';
import '../../../assets/scss/sales/MyWorkflowsCard.scss';
import ActionCards from './ActionCards';
import StatsCard from './StatsCard';
import { ReactComponent as ArrowSvg } from '../../../assets/svg/worflow_builder/smallArrow.svg';
import { ReactComponent as UpArrow } from '../../../assets/svg/workflow/downArrow.svg';

const MyWorkflowsCard = ({ data, openModal, openCopyLinkModal, navigateToWorkflowBuilder }) => {
	const [info, setInfo] = useState({
		statstCards: [
			{
				headerText: 'Enquiry',
				subText: data?.workflowStats?.enquiry || 0,
				status: 'enquiry',
			},
			{
				headerText: 'Smart File sent',
				subText: data?.workflowStats?.filesSent || 0,
				status: 'filesSent',
			},
			{
				headerText: 'Smart Files Viewed',
				subText: data?.workflowStats?.filesViewed || 0,
				status: 'fileViewed',
			},
			{
				headerText: 'Contract	Signed',
				subText: data?.workflowStats?.contractSigned || 0,
				status: 'contractSigned',
			},
			{
				headerText: 'Booking Confirmed',
				subText: data?.workflowStats?.confirmed || 0,
				status: 'confirmed',
			},
			// { headerText: 'Proposal Expired', subText: '290', status: '' },
		],
		actionCards: [
			// { headerText: 'Actions Required', subText: '15', status: 'enquiry' },
			{
				headerText: 'All Enquires',
				subText: data?.formResponses || 0,
				status: 'allenquiries',
			},
			{
				headerText: 'Smart File sent',
				subText: data?.filesSent || 0,
				status: 'allfilessent',
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
			},
		],
		showCopyModalButton: false,
	});

	useEffect(() => {
		if (data) {
			const { moduleTemplates } = data;
			let isPublic = false;
			for (let i = 0; i < moduleTemplates.length; i++) {
				if (moduleTemplates?.[i]?.isPublic) {
					isPublic = true;
					break;
				}
			}
			setInfo((prev) => ({ ...prev, showCopyModalButton: isPublic }));
		}
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
							__html: data?.templates?.[0]?.parsedHtmlContent,
						}}
						style={{ width: '100%', height: '100%' }}
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
