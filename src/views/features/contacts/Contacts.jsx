import { useContext, useEffect, useState, useCallback, memo } from 'react';
import '../../../assets/scss/contacts/contacts.scss';
import Context from '../../../context/context';
import SingleContact from '../../components/contacts/singleContact';
import ChatLeftBarComponent from '../../components/ChatLeftBarComponent';
import QuickActions from '../../components/globalComponents/QuickActions';
import ContactsListView from '../../components/contacts/ContactsListView';
import ContactsWidgetView from '../../components/contacts/ContactsWidgetView';
import { ReactComponent as SearchIcon } from '../../../assets/svg/chat/search.svg';

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
	const {
		templates: { updateStateValues: updateContactState },
		contacts: { clientList, getClients },
	} = useContext(Context);
	const [info, setInfo] = useState({
		page: 1,
		hasMore: false,
		loadingSkeleton: true,
		error: null,
		sort: [],
		filters: [],
		searchValue: '',
		updated: false,
		selectedContact: null,
		selectedContactOption: null,
		activeView: 'widgetView',
		searchQuery: '',
	});

	useEffect(() => {
		updateContactState({ leftSidebarState: 'close' });
		return () => {
			updateContactState({ leftSidebarState: null });
		};
	}, []);

	useEffect(() => {
		if (!clientList) {
			fetchClientList(info?.page);
		}
	}, []);

	const fetchClientList = useCallback(
		(page = 1) => {
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
						filters: info?.filters?.map((filter) => ({
							key: filter.key,
							value: filter.value?._id || filter.value,
						})),
					}),
				},
			};
			getClients(payload);
		},
		[info?.searchValue, info?.filters, info?.sort],
	);

	const handleViewChange = (view) => {
		setInfo({ ...info, activeView: view });
	};

	const handleSearchQueryChange = (e) => {
		setInfo({ ...info, searchQuery: e?.target?.value });
	};

	const stats = {
		all: clientList?.data?.data?.length,
		strong: 3,
		normal: 3,
		weak: 3,
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
						<h1 className="header-title">Contacts</h1>
						<QuickActions />
					</div>
					{info?.activeView === 'listView' && (
						<ContactsListView
							data={clientList?.data?.data}
							searchQuery={info?.searchQuery}
						/>
					)}
					{info?.activeView === 'widgetView' && (
						<ContactsWidgetView
							data={clientList?.data?.data}
							searchQuery={info?.searchQuery}
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default memo(Contacts);
