import { memo, useState, useEffect, useCallback } from 'react';
import '../../../../../../assets/scss/home_page/workflows/weddingDayTimelineGenerator.scss';

const generateCardsInfoData = (data) => {
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
					? Math.floor(((data?.workflowStats?.confirmed || 0) * 100) / data?.filesSent) +
					  '%'
					: '0 %',
			status: 'successRate',
			type: 'actionCards',
			modalHeader: '',
		},
	];
};
const InsightTab = ({ data, openModal }) => {
	const [info, setInfo] = useState({
		actionCards: [...generateCardsInfoData(data)],
		showCopyModalButton: false,
		formParsedContentHtml: '',
		contractExist: true,
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
		let actionCards = [...generateCardsInfoData(data)];

		setInfo((prev) => ({
			...prev,
			showCopyModalButton: isPublic,
			actionCards,
			formParsedContentHtml,
			contractExist,
		}));
	}, [data]);
	return (
		<div className="workflow-container">
			{info?.actionCards?.map((ele, index) => {
				return (
					<div
						className="workflow-inner-card"
						key={index}
						onClick={() => openModal(data, ele)}
					>
						<span className="left-text">{ele?.headerText}</span>
						<span className="right-text">{ele?.subText}</span>
					</div>
				);
			})}
		</div>
	);
};

export default memo(InsightTab);
