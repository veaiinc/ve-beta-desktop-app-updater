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

// Define rowTypes
const rowTypes = {
	text: Text,
	linkText: LinkText,
};

// Define colors (same as in contacts/index.jsx)
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
	});

	useEffect(() => {
		if (contactId) {
			fetchClientDetails();
		}
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
		<div className="expanded-client-view">
			<div className="expanded-header">
				<div className="header-left">
					<button className="close-button" onClick={handleBack}>
						<CloseArrow width={16} height={16} style={{ cursor: 'pointer' }} />
						Back
					</button>
					<h1>Contact Details</h1>
				</div>
				<div className="header-right">
					<QuickActions
						customActions={optionsForQuickActions}
						clientDetails={clientData}
					/>
				</div>
			</div>

			<div className="expanded-content">
				{isLoading ? (
					<div className="loading-container">
						<Spin size="large" />
					</div>
				) : (
					<>
						<div className="main-info">
							<div className="title-section">
								<CustomTextArea
									value={localTitle}
									onChange={handleTitleChange}
									placeholder="Enter title"
									className="title-input"
									autoResize={true}
								/>
							</div>

							{clientData && (
								<div className="properties-container">{generatePropertyList()}</div>
							)}
						</div>

						{clientData && (
							<div className="tabs-container">
								<ListTabs tabs={tabs} defaultActiveTab="files" />
							</div>
						)}
					</>
				)}
			</div>

			{/* Add Sidebar component for file preview */}
			<Sidebar
				open={info.showRightDrawer}
				onClose={() => {
					setInfo((prev) => ({
						...prev,
						showRightDrawer: false,
						activeFileData: null,
					}));
				}}
				activeFileData={info.activeFileData}
				refetchDocsFilesList={() => {
					setInfo((prev) => ({
						...prev,
						refetchDocsFilesList: true,
					}));
				}}
			/>
		</div>
	);
};

export default ExpandedClientView;
