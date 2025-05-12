import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { message } from '../../components/globalComponents/CustomToast';
import { Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import Context from '../../../context/context';
import ListTabs from '../../components/tasks/listView/ListTabs';
import TabListFile from '../../components/tasks/listView/TabListFile';
import QuickActions from '../../components/globalComponents/QuickActions';
import CustomTextArea from '../../components/globalComponents/CusomTextArea';
import { ReactComponent as CloseArrow } from '../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as CalendarSvg } from '../../../assets/svg/tasks/calendar.svg';
import { ReactComponent as textSvg } from '../../../assets/svg/tasks/letterA.svg';
import Text from '../../components/tasks/listView/Text';
import LinkText from '../../components/tasks/listView/LinkText';
import Sidebar from '../../components/docs/Sidebar';
import '../../../assets/scss/contacts/expandedClientView.scss';
import SingleContact from '../../components/contacts/singleContact';
import { ReactComponent as ArrowRightSvg } from '../../../assets/svg/home_page/arrow-right.svg';
import { ReactComponent as OverviewSvg } from '../../../assets/svg/contacts/overview.svg';
import { ReactComponent as ActivitySvg } from '../../../assets/svg/contacts/activity.svg';
import { ReactComponent as FilesSvg } from '../../../assets/svg/sidebar/filesIcon.svg';
import { ReactComponent as ProfileIcon } from '../../../assets/svg/sidebar/profileIcon.svg';
import ChatLeftBarComponent from '../../components/ChatLeftBarComponent';

// Define rowTypes
const rowTypes = {
	text: Text,
	linkText: LinkText,
};

const selectedContactOptions = [
	{
		id: 1,
		label: 'Overview',
		value: 'overview',
		icon: <OverviewSvg />,
	},
	// {
	// 	id: 2,
	// 	label: 'Activity',
	// 	value: 'activity',
	// 	icon: <ActivitySvg />,
	// },
	{
		id: 3,
		label: 'Files',
		value: 'files',
		icon: <FilesSvg fill="var(--primary-font)" />,
	},
	// {
	// 	id: 4,
	// 	label: 'About',
	// 	value: 'about',
	// 	icon: <ProfileIcon fill="var(--primary-font)" />,
	// },
];

const suggestedPrompts = [
	'Start a Deep Research on revamping the current Dashboard Layout',
	'Create a form for A/B Testing of current Dashboard',
	'Analyze which widgets are most and least used on the Dashboard',
];

const colors = {
	1: { backgroundColor: '#62344B', color: '#A35A7E' },
	2: { backgroundColor: '#373737', color: '#707070' },
	3: { backgroundColor: '#5B3D2F', color: '#8F614B' },
	4: { backgroundColor: '#7D4F27', color: '#B37339' },
	5: { backgroundColor: '#375841', color: '#588F69' },
	6: { backgroundColor: '#2F4469', color: '#4F71B3' },
	7: { backgroundColor: '#453061', color: '#6F4C99' },
};

// Define responseMetadata
const responseMetadata = {
	name: {
		type: 'text',
		name: 'Name',
		Icon: textSvg,
		doSplit: true,
		isTitle: true,
		props: {},
	},
	email: {
		type: 'linkText',
		name: 'Email',
		Icon: textSvg,
		doSplit: false,
		props: { linkType: 'email' },
	},
	phoneNumber: {
		type: 'linkText',
		name: 'Phone Number',
		Icon: textSvg,
		doSplit: false,
		props: { linkType: 'phone' },
	},
	createdAt: {
		type: 'date',
		name: 'Created At',
		Icon: CalendarSvg,
		props: { timestamp: true },
	},
	updatedAt: {
		type: 'date',
		name: 'Updated At',
		Icon: CalendarSvg,
		props: { timestamp: true },
	},
};

const optionsForQuickActions = [
	{ id: 4, title: 'Document', value: 'document' },
	{ id: 6, title: 'Proposal', value: 'proposal' },
	{ id: 7, title: 'Invoice', value: 'invoice' },
	{ id: 8, title: 'Contract', value: 'contract' },
];

const ExpandedClientView = () => {
	const { contactId } = useParams();
	const navigate = useNavigate();
	const {
		contacts: { getClient, updateClient },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);

	const [clientData, setClientData] = useState(null);
	const [localTitle, setLocalTitle] = useState('');
	const [localDescription, setLocalDescription] = useState('');
	const titleDebounceRef = useRef(null);
	const descriptionDebounceRef = useRef(null);
	const [isLoading, setIsLoading] = useState(true);
	const [info, setInfo] = useState({
		refetchDocsFilesList: false,
		activeFileData: null,
		showRightDrawer: false,
		selectedContactOption: 'Overview',
	});

	useEffect(() => {
		if (contactId) {
			fetchClientDetails();
		}
		return () => {
			setClientData(null);
		};
	}, [contactId]);

	const fetchClientDetails = async () => {
		try {
			setIsLoading(true);
			const payload = {
				getClientId: contactId,
			};

			const response = await getClient(payload);
			if (response) {
				setClientData(response);
				setLocalTitle(response?.name || '');
				setLocalDescription(response?.description || '');
			}
		} catch (error) {
			console.error('Error fetching client details:', error);
			message.error('Failed to fetch client details');
		} finally {
			setIsLoading(false);
		}
	};

	const handleBack = () => {
		navigate('/contacts');
	};

	const handleUpdate = async (propName, value, onSuccess) => {
		if (validateExpiryData?.restrictContacts && validateExpiryData?.isExpired) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		}

		const response = await updateClient({
			updateClientId: contactId,
			updateClientInput: {
				[propName]: value,
			},
		});

		if (response?.[0]) {
			fetchClientDetails();
			if (onSuccess) onSuccess(response?.[0]);
		} else {
			message.error(response?.[1]);
		}
	};

	const debouncedTitleUpdate = useCallback(
		(value) => {
			if (titleDebounceRef.current) {
				clearTimeout(titleDebounceRef.current);
			}
			titleDebounceRef.current = setTimeout(() => {
				handleUpdate('name', value, () => {
					setLocalTitle(value);
				});
			}, 800);
		},
		[contactId],
	);

	const handleTitleChange = useCallback(
		(e) => {
			const newTitle = e.target.value;
			setLocalTitle(newTitle);
			debouncedTitleUpdate(newTitle);
		},
		[debouncedTitleUpdate],
	);

	// Handle file click from TabListFile
	const handleFileClick = useCallback((fileData) => {
		setInfo((prev) => ({
			...prev,
			activeFileData: fileData,
			showRightDrawer: true,
		}));
	}, []);

	const generatePropertyList = () => {
		if (!clientData) return [];

		const listItems = [];
		for (let key in clientData) {
			const {
				type = null,
				name = null,
				Icon = null,
				isTitle = false,
				props = {},
			} = responseMetadata[key] || {};

			if (
				['__typename', '_id', 'description', 'workflows', 'templateDetails'].includes(
					key,
				) ||
				isTitle
			) {
				continue;
			}

			if (type === null) continue;

			const RowComponent = rowTypes?.[type];

			listItems.push(
				<div className="property-list" key={key}>
					<span className="property-title">
						{Icon && <Icon width={16} height={16} />}
						{name}
					</span>
					<span className="property-value">
						{RowComponent ? (
							<RowComponent
								value={clientData[key]}
								title={name}
								showLabel
								defaultLabel={'Not selected'}
								options={props.options}
								multiSelect={props.multiSelect}
								parseValue={props.parseValue}
								disabled={props.disabled}
								{...props}
								onOptionClick={(value) => handleUpdate(key, value)}
								colors={colors}
								onUpdate={(value, onSuccess) => handleUpdate(key, value, onSuccess)}
								takeFullspace={true}
							/>
						) : (
							<div>{clientData[key]}</div>
						)}
					</span>
				</div>,
			);
		}

		return listItems;
	};

	const tabs = {
		files: {
			label: 'Files',
			Component: (
				<TabListFile
					rowTypes={rowTypes}
					colors={colors}
					selectedId={contactId}
					handleRowClick={handleFileClick}
					refetchDocsFilesList={info.refetchDocsFilesList}
					onUpdate={(updatedInfo) => setInfo((prev) => ({ ...prev, ...updatedInfo }))}
				/>
			),
		},
	};

	return (
		<div
			style={{
				display: 'flex',
				gap: '1rem',
				height: '100%',
			}}
		>
			<ChatLeftBarComponent>
				<div className="left-section">
					<div className="contacts-header">
						<h2>
							{clientData?.name} <span>suggestions</span>
						</h2>
					</div>
					<div className="contacts-stats-container">
						<div className="contacts-stats">
							{selectedContactOptions?.map(({ label, icon, className }, index) => (
								<div
									className={`stat-item ${className} ${
										info?.selectedContactOption === label ? 'active' : ''
									}`}
									key={index}
									onClick={() =>
										setInfo((prev) => ({
											...prev,
											selectedContactOption: label,
										}))
									}
								>
									<div
										className={`iconContainer ${
											info?.selectedContactOption === label ? 'active' : ''
										}`}
									>
										{icon}
									</div>
									<div className="label">{label}</div>
								</div>
							))}
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

			<SingleContact
				selectedContact={clientData}
				selectedOptions={info?.selectedContactOption}
			/>
		</div>
	);
};

export default ExpandedClientView;
