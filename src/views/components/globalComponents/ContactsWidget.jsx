import React, { useContext, useEffect, useCallback, useState } from 'react';
import '../../../assets/scss/globalComponents/contactsWidget.scss';
import AddIcon from '../../../assets/svg/calendar/add.svg?react';
import ArrowViewIcon from '../../../assets/svg/calendar/arrowview.svg?react';
import Context from '../../../context/context';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import CreateClientModal from '../modalsV2/contacts/CreateClientModal';

const skeletonLoaders = Array.from({ length: 6 }, (_, index) => index + 1);

const ContactsWidget = ({ width, height }) => {
	const navigate = useNavigate();
	const {
		contacts: { clientList, getClients },
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
		createLeadPopup: false,
	});

	useEffect(() => {
		if (clientList?.data) {
			setInfo((prev) => ({
				...prev,
				listItems: clientList?.data,
				hasMore: clientList?.hasNextPage,
			}));
		}
	}, [clientList]);

	useEffect(() => {
		if (!clientList) {
			fetchClientList();
		}
	}, []);

	const handlePromptPopup = (item) => {
		setInfo((prev) => ({ ...prev, promptPopupOpen: true, selectedCard: item }));
	};

	const fetchClientList = useCallback(
		async (page = 1) => {
			// setInfo((prev) => ({ ...prev, loadingSkeleton: true }));
			const payload = {
				clientFilterInput: {
					limit: 15,
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
			getClients(payload);

			// setInfo((prev) => ({ ...prev, loadingSkeleton: false }));
		},
		[getClients, info?.searchValue, info?.filters, info?.sort],
	);

	return (
		<div className="contactsWidgetContainer" style={{ width: width, height: height }}>
			<div className="contactsWidgetSection1">
				<div className="contactsWidgetBodyHeaderLeft">
					<span className="contactsWidgetRemainder">Contacts</span>
				</div>
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
						? skeletonLoaders?.map((_, index) => (
								<Skeleton
									key={index}
									width="300px"
									height="36px"
									style={{
										'--highlight-color': 'gray',
										'--base-color': 'transparent',
									}}
								/>
						  ))
						: info?.listItems?.map((item, index) => (
								<div
									key={index}
									className="contactsEachOptions"
									onClick={() => {
										navigate(`/contact/${item?._id}`);
									}}
								>
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
				>
					<div className="contactsWidgetFooterTitle">
						<ArrowViewIcon style={{ width: '18px', height: '18px' }} />
						View Contacts
					</div>
					<div className="contactsWidgetFooterAdd">
						<AddIcon
							onClick={(e) => {
								e.stopPropagation();
								setInfo((prev) => ({
									...prev,
									createLeadPopup: true,
								}));
							}}
							style={{
								width: '18px',
								height: '18px',
							}}
						/>
					</div>
				</div>
			</div>
			<CreateClientModal
				modalIsOpen={info?.createLeadPopup}
				closeModal={() => setInfo({ ...info, createLeadPopup: false })}
				leadOrClient={true}
			/>
		</div>
	);
};

export default ContactsWidget;
