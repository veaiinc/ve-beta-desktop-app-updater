import React, { useContext, useState, useEffect } from 'react';
import '../../../assets/scss/globalComponents/automationWidget.scss';
import { ReactComponent as AiSuggest } from '../../../assets/svg/aiIcon.svg';
import { ReactComponent as ArrowRightIcon } from '../../../assets/svg/arrowRightIcon.svg';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/plus.svg';
import { ReactComponent as AutomationIcon } from '../../../assets/svg/contacts/automation.svg';
import { ReactComponent as DeepSearchIcon } from '../../../assets/svg/contacts/deepsearch.svg';
import { ReactComponent as TaskSuggestionIcon } from '../../../assets/svg/contacts/tasksuggestion.svg';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';

const autoSuggestOptions = [
	{
		id: 1,
		title: 'Brandon Rhiel Madsen',
		suggestion: 'New Message Received',
		type: 'automation',
	},
	{
		id: 2,
		title: 'Brandon Rhiel Madsen',
		suggestion: 'New Message Received',
		type: 'deepsearch',
	},
	{
		id: 3,
		title: 'Brandon Rhiel Madsen',
		suggestion: 'New Message Received',
		type: 'tasksuggestion',
	},
	{
		id: 4,
		title: 'Brandon Rhiel Madsen',
		suggestion: 'New Message Received',
		type: 'automation',
	},
];
const iconMap = {
	automation: <AutomationIcon />,
	deepsearch: <DeepSearchIcon />,
	tasksuggestion: <TaskSuggestionIcon />,
};
const automationOptions = [
	{ id: 1, title: 'Cristofer Septimus', status: 'active' },
	{ id: 2, title: 'Cristofer Septimus', status: 'inactive' },
	{ id: 3, title: 'Cristofer Septimus', status: 'error' },
];
const statusColors = {
	published: '#B2FF00',
	unpublished: '#93989F',
	draft: '#FF5960',
};
const limit = 10;
const append = true;

const AutomationWidget = ({ width, height }) => {
	const {
		automationBuilder: { automationsList, getAutomationsList },
	} = useContext(Context);

	const automations = automationsList?.data;
	const automationsLoading = automationsList ? false : true;
	const automationsLength = automations?.length ?? 0;
	const automationsEmpty = automationsLength === 0 && !automationsLoading;
	const automationsHasNextPage = Boolean(automationsList?.hasNextPage);
	const automationsCurrentPage = Number(automationsList?.currentPage) || 1;

	useEffect(() => {
		if (!automationsList) {
			getAutomationsList();
		}
	}, []);

	const fetchNextAutomations = () => {
		if (automationsHasNextPage) {
			const page = automationsCurrentPage + 1;
			getAutomationsList(page, limit, append);
		}
	};

	console.log(automationsList, 'testing');
	return (
		<div className="automation" style={{ width: width }}>
			<div className="automationWidgetContainer">
				<div className="automationWidgetBody">
					<div className="automationWidgetBodyHeader" id="automationWidgetBodyHeader">
						<InfiniteScroll
							dataLength={automationsLength}
							next={fetchNextAutomations}
							hasMore={automationsHasNextPage}
							loader={<div>Loading...</div>}
							scrollableTarget="automationWidgetBodyHeader"
						>
							{automationsList?.data?.map((automation) => (
								<div className="automationWidgetBodyItem">
									<div className="automationWidgetOptionDetails">
										<div className="automationWidgetOptionDetailsTitle">
											{automation.name}
										</div>
										<div
											className="automationWidgetOptionDetailsSubtitle"
											style={{ color: statusColors[automation.status] }}
										>
											{automation.status}
										</div>
									</div>
								</div>
							))}
						</InfiniteScroll>
					</div>
				</div>
				<div className="automationWidgetFooter">
					<div className="automationWidgetFooterTitle">View Contacts</div>
					<PlusIcon />
				</div>
			</div>
			<div className="automationWidgetSection2">
				{autoSuggestOptions.map((item) => (
					<div className="automationWidgetSection2Item">
						<div className="automationWidgetSection2ItemContainer">
							{iconMap[item.type]}
							<div className="automationWidgetSection2ItemTitle">
								{item.type.charAt(0).toUpperCase() + item.type.slice(1)}
							</div>
						</div>
						<div
							className="automationWidgetSection2ItemSubtitle
"
						>
							{item.suggestion}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default AutomationWidget;
