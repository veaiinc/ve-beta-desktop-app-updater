/* eslint-disable react-hooks/exhaustive-deps */
import { message, Tooltip } from 'antd';
import React, { useContext, useState, useCallback, useEffect, memo } from 'react';
// import '../../../assets/scss/home_page/homepage.scss';
import '../../../assets/scss/globalComponents/quickActions.scss';
import Search from '../../../assets/svg/seach-magnifier.svg';
import LoaderModal from '../modalsV2/automationBuilder/AutomationLoaderModal';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import ProposalsPopup from '../../../views/components/docs/ProposalsPopup';
import CreateClientModal from '../../../views/components/modalsV2/contacts/CreateClientModal';
import CreateGallery from '../../../views/components/modalsV2/gallery/CreateGallery';
import AutomationLoaderModal from '../modalsV2/automationBuilder/AutomationLoaderModal';
import CreateTaskPopup from '../modalsV2/tasks/CreateTaskPopup';

const moduleOptions = [
	{
		id: 0,
		title: 'Contact/Lead',
		value: 'contacts',
		controlValue: 'contact',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openClientPopup: true }));
		},
	},
	{
		id: 1,
		title: 'Task',
		value: 'task',
		controlValue: 'task',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, createTaskPopup: true }));
		},
	},
	{
		id: 2,
		title: 'Event',
		value: 'event',
		controlValue: 'calendar',
		action: ({ navigate }) => {
			navigate('/calendar');
		},
	},
	// {
	// 	id: 3,
	// 	title: 'Session',
	// 	value: 'session',
	// 	controlValue: 'calendar',
	// 	action: ({ navigate }) => {
	// 		navigate('/calendar');
	// 	},
	// },
	{
		id: 4,
		title: 'Documents',
		value: '',
		controlValue: 'all',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: '' }));
		},
	},
	{
		id: 5,
		title: 'Form',
		value: 'form-submission',
		controlValue: 'form',
		action: ({ setInfo }) => {
			setInfo((prev) => ({
				...prev,
				openProposalPopup: true,
				commonState: 'form-submission',
			}));
		},
	},
	{
		id: 6,
		title: 'Proposal',
		value: 'proposal',
		controlValue: 'workflow',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: 'proposal' }));
		},
	},
	{
		id: 7,
		title: 'Invoice',
		value: 'invoice',
		controlValue: 'workflow',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: 'invoice' }));
		},
	},
	{
		id: 8,
		title: 'Contracts',
		value: 'contract',
		controlValue: 'workflow',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: 'contract' }));
		},
	},
	{
		id: 9,
		title: 'Presentation',
		value: 'presentation',
		controlValue: 'workflow',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: 'presentation' }));
		},
	},
	{
		id: 10,
		title: 'Automation',
		value: 'automation',
		controlValue: 'automation',
		action: async ({ setInfo, navigate, createAutomation, info }) => {
			if (info?.isAutomationLoading) return;
			try {
				setInfo((prev) => ({ ...prev, isAutomationLoading: true }));
				const response = await createAutomation({
					name: 'Untitled Automation',
					version: 1,
					steps: [],
					status: 'draft',
				});
				if (response?.[0]) {
					navigate(`/automation-builder/${response?.[1]?._id}`);
				} else {
					message.error('Failed to create automation');
				}
			} catch (error) {
				message.error('Failed to create automation');
			} finally {
				setInfo((prev) => ({ ...prev, isAutomationLoading: false }));
			}
		},
	},
	{
		id: 11,
		title: 'Conversational Agent',
		value: 'ai-assistant',
		controlValue: 'conversationalAgent',
		action: async ({ setInfo, createNewAiAssistant, navigate }) => {
			try {
				setInfo((prev) => ({ ...prev, conversationalAgentLoading: true }));
				const aiAssistantId = await createNewAiAssistant({
					name: 'Untitled Assistant',
				});
				if (aiAssistantId) {
					navigate(`/ai-assistant/${aiAssistantId}/edit`);
				}
			} catch (error) {
				message.error('Failed to create AI Assistant');
			} finally {
				setInfo((prev) => ({ ...prev, conversationalAgentLoading: false }));
			}
		},
	},
	{
		id: 12,
		title: 'Classic Gallery',
		value: 'galleries',
		controlValue: 'classicGallery',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openGalleryPopup: true }));
		},
	},
	{
		id: 13,
		title: 'Lite Gallery',
		value: 'lite-gallery',
		controlValue: 'liteGallery',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openLiteGalleryPopup: true }));
		},
	},
	{
		id: 14,
		title: 'Note',
		value: 'notes',
		action: async ({ setInfo, navigate, createNotesList }) => {
			try {
				setInfo((prev) => ({ ...prev, creatingNoteLoader: true }));
				const payload = {
					input: {
						title: 'New Note',
					},
				};
				const response = await createNotesList(payload);
				if (response?.[1]?._id) {
					navigate(`/note/${response[1]._id}`);
				}
			} catch (error) {
				message.error('Failed to create note');
			} finally {
				setInfo((prev) => ({ ...prev, creatingNoteLoader: false }));
			}
		},
	},
];

const QuickActions = ({ styles, suggestedOptions = [], timeout = null, clientDetails = null }) => {
	const {
		templates: { toggleCreateLeadModal },
		profileInfo: { tenantUserAccessControls },
		automationBuilder: { createAutomation },
		aiSetup: { createNewAiAssistant },
		notes: { createNotesList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		dropdown: false,
		openProposalPopup: false,
		openClientPopup: false,
		openGalleryPopup: false,
		openLiteGalleryPopup: false,
		// openTaskPopup: false,
		options: { suggestedOptions, moduleOptions },
		fileterOptions: { suggestedOptions, moduleOptions },
		isAutomationLoading: false,
		commonState: null,
		search: '',
		createTaskPopup: false,
		conversationalAgentLoading: false,
		creatingNoteLoader: false,
		openDocumentPopup: false,
		openedModalType: null,
	});

	const navigate = useNavigate();

	const accessibleOptions = useCallback(
		(options) => {
			return tenantUserAccessControls?.role === 'admin'
				? options
				: options?.filter((option) => {
						if (!option?.controlValue) {
							return true;
						}
						const matchedApp = tenantUserAccessControls?.accessControls?.find(
							(item) =>
								item?.app?.toLowerCase() === option?.controlValue?.toLowerCase(),
						);
						if (!matchedApp) {
							return false;
						}
						return matchedApp?.isEnabled;
				  });
		},
		[tenantUserAccessControls],
	);

	const filtereOptions = useCallback(
		(searchKey = '') => {
			if (!info?.options) return { suggestedOptions: [], moduleOptions: [] };

			const searchTerm = searchKey.toLowerCase();
			let suggestedOptions = searchKey
				? info?.options?.suggestedOptions?.filter((option) =>
						option?.title?.toLowerCase().includes(searchTerm),
				  )
				: info?.options?.suggestedOptions;

			let moduleOptions = searchKey
				? info?.options?.moduleOptions?.filter((option) =>
						option?.title?.toLowerCase().includes(searchTerm),
				  )
				: info?.options?.moduleOptions;

			moduleOptions = accessibleOptions(moduleOptions);
			suggestedOptions = accessibleOptions(suggestedOptions);

			return { suggestedOptions, moduleOptions };
		},
		[info?.options, tenantUserAccessControls],
	);

	useEffect(() => {
		const options = filtereOptions();
		setInfo((prev) => ({ ...prev, fileterOptions: options }));
	}, [filtereOptions]);

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			options: { suggestedOptions, moduleOptions },
			fileterOptions: { suggestedOptions, moduleOptions },
		}));
	}, [suggestedOptions]);

	const handleDebounceSearch = useCallback(
		(search = null) => {
			if (timeout) {
				clearTimeout(timeout);
			}
			const options = filtereOptions(search);
			setInfo((prev) => ({ ...prev, fileterOptions: options }));
		},
		[filtereOptions],
	);

	const handleSearch = (e) => {
		setInfo((prev) => ({ ...prev, search: e?.target?.value }));
		if (e?.target?.value === '' || e?.target?.value === null) {
			handleDebounceSearch('');
		} else {
			handleDebounceSearch(e.target.value);
		}
	};
	return (
		<div className="quick-actions-dropdown-container" style={{ ...styles }}>
			<Tooltip
				placement="bottomRight"
				align="right"
				open={info?.dropdown}
				trigger={'hover'}
				onOpenChange={(open) => setInfo({ ...info, dropdown: open })}
				color="transparent"
				rootClassName="customQuickActionsToolTip"
				title={
					<div className="quick-actions-dropdown-options-container">
						{/* <div className="top-search-container">
							<img src={Search} alt="searchh" />
							<input
								type="text"
								placeholder="Search Anything"
								value={info?.search}
								onChange={handleSearch}
							/>
						</div> */}
						{info?.fileterOptions?.suggestedOptions?.length > 0 && (
							<div className="modules-container">
								<div className="modules-container-header">Suggested</div>
								{info?.fileterOptions?.suggestedOptions?.map((option) => (
									<div
										key={option?.id}
										className="dropdown-option"
										onClick={() =>
											option?.action({
												setInfo,
												navigate,
												createNewAiAssistant,
												createAutomation,
												createNotesList,
											})
										}
									>
										{option?.icon && <img src={option?.icon} alt="icon" />}
										{option?.title}
									</div>
								))}
							</div>
						)}
						{info?.fileterOptions?.moduleOptions?.length > 0 && (
							<div className="modules-container">
								<div className="modules-container-header">Module Actions</div>
								{info?.fileterOptions?.moduleOptions?.map((option) => (
									<div
										key={option?.id}
										className="dropdown-option"
										onClick={() =>
											option?.action({
												setInfo,
												navigate,
												createNewAiAssistant,
												createAutomation,
												createNotesList,
											})
										}
									>
										{option?.icon && <img src={option?.icon} alt="icon" />}
										{option?.title}
									</div>
								))}
							</div>
						)}
					</div>
				}
			>
				<button
					className="dropdown-header"
					onClick={() => setInfo({ ...info, dropdown: !info?.dropdown })}
				>
					New
				</button>
			</Tooltip>
			<ProposalsPopup
				open={info?.openProposalPopup}
				closeModal={() => setInfo({ ...info, openProposalPopup: false })}
				clientDetails={clientDetails}
				commonState={info?.commonState}
			/>
			<CreateClientModal
				modalIsOpen={info?.openClientPopup}
				closeModal={() => setInfo({ ...info, openClientPopup: false })}
				leadOrClient={true}
			/>
			<CreateGallery
				open={info?.openGalleryPopup}
				closeModal={() => setInfo({ ...info, openGalleryPopup: false })}
			/>
			<CreateGallery
				open={info?.openLiteGalleryPopup}
				closeModal={() => setInfo({ ...info, openLiteGalleryPopup: false })}
				isLightGallery={true}
			/>
			<AutomationLoaderModal loading={info?.isAutomationLoading} />
			<CreateTaskPopup
				isOpen={info?.createTaskPopup}
				closeModal={() => setInfo({ ...info, createTaskPopup: false })}
			/>
			<LoaderModal loading={info?.creatingNoteLoader} message="Creating note..." />
		</div>
	);
};

export default memo(QuickActions);
