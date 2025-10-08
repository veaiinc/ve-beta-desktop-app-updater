import { useContext, useEffect, useState, useCallback, memo, useRef } from 'react';
import '../../../assets/scss/contacts/contacts.scss';
import Context from '../../../context/context';
import SingleContact from '../../components/contacts/singleContact';
import ChatLeftBarComponent from '../../components/ChatLeftBarComponent';
// import QuickActions from '../../components/globalComponents/QuickActions';
import ContactsListView from '../../components/contacts/ContactsListView';
import ContactsWidgetView from '../../components/contacts/ContactsWidgetView';
import CreateClientModal from '../../components/modalsV2/contacts/CreateClientModal';
import { ReactComponent as SearchIcon } from '../../../assets/svg/chat/search.svg';
import { ReactComponent as AddIcon } from '../../../assets/svg/files/add.svg';
import { accessControlCheck } from '../../../helpers/accessControlCheck';

const suggestedPrompts = [
	'Start a Deep Research on revamping the current Dashboard Layout',
	'Create a form for A/B Testing of current Dashboard',
	'Analyze which widgets are most and least used on the Dashboard',
];

const statItems = [
	{ key: 'all', label: 'All', className: 'all active' },
	{ key: 'strong', label: 'Strong', className: 'strong' },
	{ key: 'normal', label: 'Normal', className: 'normal' },
	{ key: 'weak', label: 'Weak', className: 'weak' },
];

const Contacts = () => {
	const timeoutIdRef = useRef(null);

	const {
		templates: { updateStateValues },
		contacts: { clientList, getClients, updateStateValues: updateContactState },
	} = useContext(Context);

	const [info, setInfo] = useState({
		loadingSkeleton: true,
		error: null,
		sort: [{ sortBy: 'createdAt', sortType: -1 }],
		filters: [],
		searchValue: '',
		updated: false,
		selectedContact: null,
		selectedContactOption: null,
		activeView: 'widgetView',
		openClientPopup: false,
	});
	const listItems = clientList?.data || [];
	const isMountedRef = useRef(true);
	const pageRef = useRef(1);
	const searchValueRef = useRef('');

	useEffect(() => {
		updateStateValues({ leftSidebarState: 'open' });
		fetchClientList();
		return () => {
			if (searchValueRef.current !== '') {
				updateContactState({ clientList: null });
			}
		};
	}, []);

	useEffect(() => {
		if (info?.searchValue === '') {
			const page = 1;
			const limit = 15;
			const sortBy = 'createdAt';
			const sortType = info?.sort[0]?.sortType || -1;
			const clientFilterInput = {
				limit,
				page,
				search: '',
				sort: [{ sortBy, sortType }],
			};
			getClients({ clientFilterInput });
			return;
		}

		if (isMountedRef.current && clientList?.data) {
			isMountedRef.current = false;
			return;
		}

		timeoutIdRef.current = setTimeout(() => {
			const page = 1;
			const limit = 15;
			const sortBy = 'createdAt';
			const sortType = info?.sort[0]?.sortType || -1;
			const clientFilterInput = {
				limit,
				page,
				search: info?.searchValue,
				sort: [{ sortBy, sortType }],
			};
			getClients({ clientFilterInput });
			pageRef.current = 1;
		}, 500);

		return () => {
			clearTimeout(timeoutIdRef.current);
		};
	}, [info?.searchValue]);

	useEffect(() => {
		if (clientList?.data) {
			setInfo((prevInfo) => ({
				...prevInfo,
				loadingSkeleton: false,
				hasMore: clientList?.hasNextPage,
			}));
			pageRef.current = clientList?.currentPage;
		}
	}, [clientList]);

	const fetchClientList = useCallback(
		(page = 1, limit = 15, reset = false, sortBy = 'createdAt', sortType = -1, search = '') => {
			const clientFilterInput = {
				limit,
				page,
				search: searchValueRef.current || info?.searchValue || '',
				sort: [{ sortBy, sortType }],
			};
			getClients({ clientFilterInput });
		},
		[info?.searchValue, info?.filters, info?.sort, getClients],
	);

	const fetchMoreClientsList = useCallback(() => {
		if (info?.hasMore) {
			const nextPage = pageRef.current + 1;
			const limit = 15;
			const sortBy = 'createdAt';
			const sortType = info?.sort[0]?.sortType || -1;
			const clientFilterInput = {
				limit,
				page: nextPage,
				search: info?.searchValue || '',
				sort: [{ sortBy, sortType }],
			};
			getClients({ clientFilterInput });
		}
	}, [info?.hasMore, info?.searchValue, info?.sort, getClients]);

	const handleViewChange = (view) => {
		setInfo({ ...info, activeView: view });
	};

	const handleSearchQueryChange = (e) => {
		const value = e?.target?.value;
		setInfo((prev) => ({ ...prev, searchValue: value }));
		searchValueRef.current = value;
	};

	const handleSort = useCallback(
		(sortType) => {
			setInfo((prev) => ({
				...prev,
				sort: [{ sortBy: 'createdAt', sortType }],
			}));
			if (!info?.searchValue) {
				fetchClientList(1, 15, true, 'createdAt', sortType, '');
			}
		},
		[fetchClientList, info?.searchValue],
	);

	const handleCreateContact = () => {
		if (!accessControlCheck('contact')) return;
		setInfo((prev) => ({ ...prev, openClientPopup: true }));
	};

	return (
		<div className="contacts-container">
			<ChatLeftBarComponent>
				<div className="left-section">
					<div className="contacts-Header">
						<div className="contacts-search-container">
							<div className="search-icon">
								<SearchIcon />
							</div>
							<input
								type="text"
								className="search-input"
								placeholder="Search Contacts"
								onChange={handleSearchQueryChange}
								autoFocus
							/>
						</div>
					</div>
					<div className="contacts-body">
						<div className="view-type-container">
							<div
								className="view-container"
								onClick={() => handleViewChange('widgetView')}
							>
								<div
									className={`view ${
										info?.activeView === 'widgetView' ? 'active' : ''
									}`}
								>
									Widget View
								</div>
							</div>
							<div className="vertical-line" />
							<div
								className="view-container"
								onClick={() => handleViewChange('listView')}
							>
								<div
									className={`view ${
										info?.activeView === 'listView' ? 'active' : ''
									}`}
								>
									List View
								</div>
							</div>
						</div>
						{/* <div className="suggested-sections">
							<div className="section-title">Suggested Actions</div>
							<div className="action-buttons">
								<button>Hand off to Priya</button>
								<button>Add Collaborator</button>
								<button>Snooze</button>
							</div>

							<div className="section-title">Suggested Prompts</div>
							<div className="prompts-list">
								{suggestedPrompts.map((prompt, index) => (
									<div key={index} className="prompt-item">
										<ArrowRightSvg style={{ flexShrink: '0' }} />
										{prompt}
									</div>
								))}
							</div>
						</div> */}
					</div>
				</div>
			</ChatLeftBarComponent>

			{info?.selectedContact ? (
				<SingleContact
					selectedContact={info?.selectedContact}
					selectedOptions={info?.selectedContactOption}
				/>
			) : (
				<div className="contacts-right-section">
					<div className="header">
						<h1 className="header-title">Your Contacts</h1>
						{/* <QuickActions /> */}
						<button className="create-contact-button" onClick={handleCreateContact}>
							<AddIcon />
							Create Contact
						</button>
						{/* <div className="search-bar-container">
						<SearchIcon className="search-icon" />
						<input type="text" className="search-bar" placeholder="Search" />
					</div> */}
					</div>
					{info?.loadingSkeleton ? (
						<div className="skeleton">Loading...</div>
					) : (
						<div className="contacts-body">
							{info?.activeView === 'listView' ? (
								<ContactsListView
									data={listItems}
									hasMore={info?.hasMore}
									fetchMore={fetchMoreClientsList}
									onSort={handleSort}
									sortType={info?.sort[0]?.sortType}
								/>
							) : (
								<ContactsWidgetView
									data={listItems}
									hasMore={info?.hasMore}
									fetchMore={fetchMoreClientsList}
								/>
							)}
						</div>
					)}
				</div>
			)}

			<CreateClientModal
				modalIsOpen={info?.openClientPopup}
				closeModal={() => setInfo((prev) => ({ ...prev, openClientPopup: false }))}
				leadOrClient={true}
			/>
		</div>
	);
};

export default memo(Contacts);
