import React, { useContext, useEffect, useRef, useCallback, useState } from 'react';
import '../../../assets/scss/globalComponents/contactsWidget.scss';
import { ReactComponent as AiSuggest } from '../../../assets/svg/aiIcon.svg';
import { ReactComponent as ArrowRightIcon } from '../../../assets/svg/arrowRightIcon.svg';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/plus.svg';
import Context from '../../../context/context';
import { ReactComponent as AutomationIcon } from '../../../assets/svg/contacts/automation.svg';
import { ReactComponent as DeepSearchIcon } from '../../../assets/svg/contacts/deepsearch.svg';
import { ReactComponent as TaskSuggestionIcon } from '../../../assets/svg/contacts/tasksuggestion.svg';
// const aiSuggestOptions = [
// 	{ id: 1, title: 'Cristofer Septimus', subtitle: 'Schedule a meeting' },
// 	{ id: 2, title: 'Cristofer Septimus', subtitle: 'Schedule a meeting' },
// 	{ id: 3, title: 'Cristofer Septimus', subtitle: 'Schedule a meeting' },
// ];

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

const ContactsWidget = ({ width, height }) => {
	const {
		contacts: { clientList, getClients, refetchClientList },
	} = useContext(Context);
	const [info, setInfo] = useState({
		contacts: null,
		listItems: [],
		page: 1,
		hasMore: false,
		loadingSkeleton: false,
		error: null,
		sort: [],
		filters: [],
		searchValue: '',
	});
	const fetchClientList = useCallback(
		async (page = 1) => {
			setInfo((prev) => ({ ...prev, loadingSkeleton: true }));
			const payload = {
				clientFilterInput: {
					limit: 20,
					page: page,
					sort:
						info?.sort?.length > 0
							? info?.sort
							: [{ sortBy: 'createdAt', sortType: 1 }],
					...(info?.searchValue && {
						search: info?.searchValue,
					}),
					...(info?.filters?.length > 0 && {
						filters: info?.filters.map((filter) => ({
							key: filter.key,
							value: filter.value?._id || filter.value,
						})),
					}),
				},
			};
			const response = await getClients(payload);
			setInfo((prev) => ({ ...prev, loadingSkeleton: false }));
		},
		[getClients, info?.searchValue, info?.filters, info?.sort],
	);
	useEffect(() => {
		if (refetchClientList && !info?.sidebarIsOpen) {
			setInfo((prev) => ({ ...prev, page: 1 }));
			fetchClientList(1);
		}
		if (clientList?.data?.data) {
			setInfo((prev) => ({
				...prev,
				contacts: clientList.data.data,
				listItems: clientList.data.data,
				hasMore: clientList.data.hasNextPage,
			}));
		}
	}, [refetchClientList, clientList]);

	useEffect(() => {
		if (!clientList) {
			fetchClientList();
		}
	}, [info?.searchValue, info?.filters, info?.sort]);

	return (
		<div className="contactsWidgetContainer" style={{ width: width, height: height }}>
			<div className="contactsWidgetSection1">
				<div className="contactsWidgetBody">
					{/* <div className="contactsWidgetBodyMainContainer">
					<div className="contactsWidgetBodyHeader">
						<AiSuggest />
						<span className="contactsWidgetBodyHeaderTitle">AI Suggested actions</span>
					</div>
					<div className="contactsWidgetBodyBody">
						{aiSuggestOptions.map((contact) => (
							<div className="contactsWidgetBodyBodyItem">
								<div className="contactsWidgetOptionDetails">
									<div className="contactsWidgetOptionDetailsTitle">
										{contact.title}
									</div>
									<div className="contactsWidgetOptionDetailsSubtitle">
										{contact.subtitle}
									</div>
								</div>
								<ArrowRightIcon />
							</div>
						))}
					</div>
				</div> */}
					{info?.loadingSkeleton ? (
						<div className="contactsWidgetBodySkeleton">loading...</div>
					) : (
						info.listItems.map((item, index) => (
							<div key={index} className="contactsEachOptions">
								<div className="contactDetails">
									<div className="contactDetailsTitle">{item?.name}</div>
									<div className="contactDetailsSubtitle">{item?.email}</div>
								</div>
								{/* <div className="contactDetailsCount">0</div> */}
							</div>
						))
					)}
				</div>
				<hr
					style={{
						width: '100%',
						background: 'var(--stroke)',
						border: 'none',
						height: '1px',
					}}
				/>
				<div className="contactsWidgetFooter">
					<div className="contactsWidgetFooterTitle">View Contacts</div>
					<PlusIcon />
				</div>
			</div>
			<div className="contactsWidgetSection2">
				{autoSuggestOptions.map((item) => (
					<div className="contactsWidgetSection2Item">
						<div className="contactsWidgetSection2ItemContainer">
							{iconMap[item.type]}
							<div className="contactsWidgetSection2ItemTitle">
								{item.type.charAt(0).toUpperCase() + item.type.slice(1)}
							</div>
						</div>
						<div
							className="contactsWidgetSection2ItemSubtitle
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

export default ContactsWidget;
