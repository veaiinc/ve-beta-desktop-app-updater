import { useContext, useEffect, useState, useCallback, memo } from 'react';
import '../../../assets/scss/contacts/ncontacts.scss';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import { ReactComponent as ArrowRightSvg } from '../../../assets/svg/home_page/arrow-right.svg';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import SingleContact from '../../components/contacts/singleContact';
import ChatLeftBarComponent from '../../components/ChatLeftBarComponent';

dayjs.extend(relativeTime);

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
	const navigate = useNavigate();
	const {
		templates: { updateStateValues: updateContactState },
		contacts: { clientList, getClients, getClient, refetchClientList },
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
	});

	useEffect(() => {
		updateContactState({ leftSidebarState: 'close' });
		return () => {
			updateContactState({ leftSidebarState: null });
		};
	}, []);

	useEffect(() => {
		fetchClientList(info?.page);
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
						filters: info?.filters.map((filter) => ({
							key: filter.key,
							value: filter.value?._id || filter.value,
						})),
					}),
				},
			};
			getClients(payload);
		},
		[getClients, info?.searchValue, info?.filters, info?.sort],
	);

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
					<div className="contacts-header">
						<h2>Contacts</h2>
					</div>
					<div className="contacts-stats-container">
						<div className="contacts-stats">
							{statItems.map(({ key, label, className }) => (
								<div
									className={`stat-item ${
										info?.selectedContactOption === key ? 'active' : ''
									}`}
									key={key}
								>
									<div className="count">
										{key !== 'all' && <span></span>}
										{stats[key]}
									</div>
									<div className="label">{label}</div>
								</div>
							))}
						</div>

						<div className="suggested-sections">
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
						</div>
					</div>
				</div>
			</ChatLeftBarComponent>

			{info?.selectedContact ? (
				<SingleContact
					selectedContact={info?.selectedContact}
					selectedOptions={info?.selectedContactOption}
				/>
			) : (
				<div className="right-section">
					<div className="header">
						<h1 className="header-title">Your Contacts</h1>
						{/* <div className="search-bar-container">
						<SearchIcon className="search-icon" />
						<input type="text" className="search-bar" placeholder="Search" />
					</div> */}
					</div>

					<div className="contacts-table">
						<div className="table-header">
							<div className="column people">People</div>
							<div className="column strength"></div>
							<div className="column interaction">Last Interaction</div>
						</div>
						<div className="table-body">
							{clientList?.data?.data?.map((contact) => (
								<div
									key={contact.id}
									className="table-row"
									onClick={() => navigate(`/contact/${contact?._id}`)}
								>
									<div className="column people">
										{/* <input type="checkbox" className="checkbox" /> */}
										{/* <div className="avatar">{contact.avatar}</div> */}
										<div className="contact-info">
											<div className="name">{contact.name}</div>
											<div className="email">{contact.email}</div>
										</div>
									</div>
									<div className="column strength">
										{/* <span
											className={`dot ${contact.strength.toLowerCase()}`}
										></span>
										<span className="text">{contact.strength}</span> */}
									</div>
									<div className="column interaction">
										{contact?.updatedAt
											? dayjs.unix(contact.updatedAt).fromNow() // Converts Unix seconds -> "14 days ago"
											: 'N/A'}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(Contacts);
