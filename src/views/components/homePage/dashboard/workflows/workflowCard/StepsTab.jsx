import React, { useEffect, useCallback, useState } from 'react';
import { useContext } from 'react';
import { memo } from 'react';
import '../../../../../../assets/scss/home_page/workflows/weddingDayTimelineGenerator.scss';

const generateCardsInfoData = (data, moduleWithoutContract = false) => {
	const statusCardData = [
		{
			headerText: 'Enquiry',
			subText: data?.workflowStats?.enquiry || 0,
			status: 'enquiry',
			type: 'statusCards',
			modalHeader: 'Enquiry',
		},
		{
			headerText: 'Smart File sent',
			subText: data?.workflowStats?.filesSent || 0,
			status: 'filesSent',
			type: 'statusCards',
			modalHeader: 'Smart File sent',
		},
		{
			headerText: 'Smart Files Viewed',
			subText: data?.workflowStats?.filesViewed || 0,
			status: 'filesViewed',
			type: 'statusCards',
			modalHeader: 'Smart Files Viewed',
		},
		{
			headerText: 'Contract Signed',
			subText: data?.workflowStats?.contractSigned || 0,
			status: 'contractSigned',
			type: 'statusCards',
			modalHeader: 'Contract Signed',
		},

		{
			headerText: 'Booking Confirmed',
			subText: data?.workflowStats?.confirmed || 0,
			status: 'confirmed',
			type: 'statusCards',
			modalHeader: 'Booking Confirmed',
		},
	];

	if (moduleWithoutContract) {
		statusCardData?.splice(3, 1, {
			headerText: 'Proposal Accepted',
			subText: data?.workflowStats?.proposalAccepted || 0,
			status: 'proposalAccepted',
			type: 'statusCards',
			modalHeader: 'Proposal Accepted',
		});
	}

	return statusCardData;
};
const StepsTab = ({ data, openModal }) => {
	const [info, setInfo] = useState({
		statusCards: [...generateCardsInfoData(data)],
		contractExist: true,
		showCopyModalButton: false,
		formParsedContentHtml: '',
	});

	useEffect(() => {
		if (data) {
			handleIncomingData();
		}
	}, [data]);

	const handleIncomingData = useCallback(async () => {
		const { moduleTemplates, templates } = data;
		let isPublic = false;
		let formData;
		let formParsedContentHtml = '';
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

		for (let i = 0; i < templates?.length; i++) {
			if (templates?.[i]?._id === formData?._id) {
				formParsedContentHtml = templates?.[i]?.parsedHtmlContent;
			}
		}

		let statusCards = [...generateCardsInfoData(data, contractExist ? false : true)];

		setInfo((prev) => ({
			...prev,
			showCopyModalButton: isPublic,
			statusCards,
			formParsedContentHtml,
			contractExist,
		}));
	}, [data]);

	return (
		<div className="workflow-container">
			{info?.statusCards?.map((ele, index) => {
				return (
					<div
						className="workflow-inner-card"
						key={index}
						onClick={() => {
							openModal(data, ele);
						}}
					>
						<div className="left-text">{ele?.headerText}</div>
						<div className="right-text">{ele?.subText}</div>
					</div>
				);
			})}
		</div>
	);
};

export default memo(StepsTab);
