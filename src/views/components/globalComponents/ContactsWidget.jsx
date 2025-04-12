import React, { useContext, useEffect, useCallback, useState } from 'react';
import '../../../assets/scss/globalComponents/contactsWidget.scss';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/plus.svg';
import Context from '../../../context/context';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';

const skeletonLoaders = Array.from({ length: 6 }, (_, index) => index + 1);

const ContactsWidget = ({ width, height }) => {
	const navigate = useNavigate();
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
		promptPopupOpen: false,
		selectedCard: null,
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
					{info?.loadingSkeleton
						? skeletonLoaders?.map((item) => (
								<Skeleton
									width="300px"
									height="36px"
									style={{
										'--highlight-color': 'gray',
										'--base-color': 'transparent',
									}}
								/>
						  ))
						: info.listItems.map((item, index) => (
								<div key={index} className="contactsEachOptions">
									<div className="contactDetails">
										<div className="contactDetailsTitle">{item?.name}</div>
										<div className="contactDetailsSubtitle">{item?.email}</div>
									</div>
									{/* <div className="contactDetailsCount">0</div> */}
								</div>
						  ))}
				</div>
				<hr
					style={{
						width: '100%',
						background: 'var(--stroke)',
						border: 'none',
						height: '1px',
					}}
				/>
				<div
					className="contactsWidgetFooter"
					onClick={() => {
						navigate('/contacts');
					}}
					style={{ cursor: 'pointer' }}
				>
					<div className="contactsWidgetFooterTitle">View Contacts</div>
					<PlusIcon />
				</div>
			</div>
		</div>
	);
};

export default ContactsWidget;
