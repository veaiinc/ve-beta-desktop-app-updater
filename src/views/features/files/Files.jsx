import ObjectID from 'bson-objectid';
import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../../../assets/scss/files/files.scss';
import '../../../assets/scss/files/index.scss';
import { ReactComponent as SearchSvg } from '../../../assets/svg/elastic_search/search-icon.svg';
import { ReactComponent as CommandIcon } from '../../../assets/svg/files/command.svg';
import Context from '../../../context/context';
import ProposalsPopup from '../../components/docs/ProposalsPopup';
import DocsGrid from '../../components/files/DocsGrid';
import FormsGrid from '../../components/files/FormsGrid';
import GalleryGrid from '../../components/files/GalleryGrid';
import MostUsedEntries from '../../components/files/MostUsedEntries';
import TemplatesGrid from '../../components/files/TemplatesGrid';
import { message } from '../../components/globalComponents/CustomToast';
// import QuickActions from '../../components/globalComponents/QuickActions';
import Spinner from '../../components/loaders/Spinner';
import CreateGallery from '../../components/modalsV2/gallery/CreateGallery';
import getFileTypeInfo from './getFiletypeInfo';
import { triggerCmdK } from '../../components/commandKSearch/CommandKSearch';
import { ReactComponent as AddIcon } from '../../../assets/svg/files/add.svg';
import NotesPage from '../notesPage/NotesPage';
import NotesGrid from '../../components/files/NotesGrid';
import { accessControlCheck } from '../../../helpers/accessControlCheck';

const options = [
	{
		label: 'Documents',
		value: 'workflow',
	},
	{
		label: 'Forms',
		value: 'form',
	},
	{
		label: 'My Templates',
		value: 'template',
	},
	{
		label: 'Gallery',
		value: 'classicGallery',
	},
	{
		label: 'Lite Gallery',
		value: 'liteGallery',
	},
	{
		label: 'Notes',
		value: 'notes',
	},
];

export const statusTextmapper = {
	contractSigned: {
		id: 'contractSigned',
		text: 'Accepted',
		dotStyle: {
			backgroundColor: '#00A051',
		},
		style: {
			backgroundColor: '#2C593F',
		},
	},
	filesViewed: {
		id: 'filesViewed',
		text: 'Files Viewed',
		dotStyle: {
			backgroundColor: '#2A71CD',
		},
		style: {
			backgroundColor: '#29456C',
		},
		label: 'Files Viewed',
	},
	enquiry: {
		id: 'enquiry',
		text: 'Enquiry',
		dotStyle: {
			backgroundColor: '#2A71CD',
		},
		style: {
			backgroundColor: '#29456C',
		},
		label: 'Enquiry',
	},
	filesSent: {
		id: 'filesSent',
		text: 'Sent',
		dotStyle: {
			backgroundColor: '#2A71CD',
		},
		style: {
			backgroundColor: '#29456C',
		},
		label: 'Sent',
	},
	confirmed: {
		id: 'confirmed',
		text: 'Confirmed',
		dotStyle: {
			backgroundColor: '#00A051',
		},
		style: {
			backgroundColor: '#2C593F',
		},
		label: 'Confirmed',
	},
	expired: {
		id: 'expired',
		text: 'Expired',
		dotStyle: {
			backgroundColor: '#E27B1C',
		},
		style: {
			backgroundColor: 'rgba(125, 79, 39, 1)',
		},
		label: 'Expired',
	},
	accepted: {
		id: 'accepted',
		text: 'Accepted',
		dotStyle: {
			backgroundColor: '#00A051',
		},
		style: {
			backgroundColor: '#2C593F',
		},
		label: 'Accepted',
	},
	proposalAccepted: {
		id: 'proposalAccepted',
		text: 'Accepted',
		dotStyle: {
			backgroundColor: '#00A051',
		},
		style: {
			backgroundColor: '#2C593F',
		},
		label: 'Proposal Accepted',
	},
	published: {
		id: 'published',
		text: 'Published',
		dotStyle: {
			backgroundColor: '#2A71CD',
		},
		style: {
			backgroundColor: '#29456C',
		},
		label: 'Published',
	},
};

// const suggestedOptions = [
// 	{
// 		id: 1,
// 		title: 'Document',
// 		value: '',
// 		controlValue: 'workflow',
// 		action: (navigate) => {
// 			navigate(`/builder/create-document`);
// 		},
// 	},
// 	{
// 		id: 2,
// 		title: 'Form',
// 		value: 'form-submission',
// 		controlValue: 'form',
// 		action: ({ setInfo }) => {
// 			setInfo((prev) => ({
// 				...prev,
// 				openProposalPopup: true,
// 				commonState: 'form-submission',
// 			}));
// 		},
// 	},
// 	{
// 		id: 3,
// 		title: 'Proposal',
// 		value: 'proposal',
// 		controlValue: 'workflow',
// 		action: ({ setInfo }) => {
// 			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: 'proposal' }));
// 		},
// 	},
// 	{
// 		id: 4,
// 		title: 'Invoice',
// 		value: 'invoice',
// 		controlValue: 'workflow',
// 		action: ({ setInfo }) => {
// 			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: 'invoice' }));
// 		},
// 	},
// 	{
// 		id: 5,
// 		title: 'Contract',
// 		value: 'contract',
// 		controlValue: 'workflow',
// 		action: ({ setInfo }) => {
// 			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: 'contract' }));
// 		},
// 	},
// 	{
// 		id: 6,
// 		title: 'Presentation',
// 		value: 'presentation',
// 		controlValue: 'workflow',
// 		action: ({ setInfo }) => {
// 			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: 'presentation' }));
// 		},
// 	},
// 	{
// 		id: 7,
// 		title: 'Gallery',
// 		value: 'galleries',
// 		controlValue: 'classicGallery',
// 		action: ({ setInfo }) => {
// 			setInfo((prev) => ({ ...prev, openGalleryPopup: true }));
// 		},
// 	},
// 	{
// 		id: 8,
// 		title: 'Lite Gallery',
// 		value: 'lite-gallery',
// 		controlValue: 'liteGallery',
// 		action: ({ setInfo }) => {
// 			setInfo((prev) => ({ ...prev, openLiteGalleryPopup: true }));
// 		},
// 	},
// ];

const Files = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get('active-tab') || 'Documents';
	const cardItems = useRef(null);
	const elasticSearchTimeoutRef = useRef(null);
	const navigate = useNavigate();
	const inputRef = useRef(null);
	// Add a ref for the search container
	const searchContainerRef = useRef(null);

	const {
		galleryInfo: { tenantGalleries },
		elasticSearch: { elasticSearchResults, performElasticSearch, resetElasticSearchState },
		templates: { formsTemplatesList, updateStateValues: updateTemplateStateValues },
		profileInfo: { tenantUserAccessControls },
		subscriptionInfo: { currentPlan },
	} = useContext(Context);

	const [mostUsedEntities, setMostUsedEntities] = useState(null);
	const [loadingView, setLoadingView] = useState(null);
	const [info, setInfo] = useState({
		createNewGalleryModal: false,
		galleries: [],
		search: '',
		error: null,
		page: 1,
		limit: 15,
		timeout: null,
		cardHover: false,
		isLoading: false,
		selectedView: 'Documents',
		viewMode: searchParams?.get('viewMode') || 'card',
		openProposalPopup: false,
		initialDataFetched: false,
		commonState: 'All',
		options: [],
		totalCount: null,
		showElasticSearchResults: false,
		isFocused: false,
		selectedSource: null,
		selectedIntegration: null,
	});

	const isAdmin = tenantUserAccessControls?.role === 'admin';
	const appPaidMap = currentPlan?.apps?.reduce((acc, { app, isPaidPlan }) => {
		acc[app] = isPaidPlan;
		return acc;
	}, {});
	const liteGalleryPaidPlan = appPaidMap?.liteGallery;

	useEffect(() => {
		if (activeTab) {
			const mappedActiveTab = activeTab === 'My-Templates' ? 'My Templates' : activeTab;
			const exists = info?.options?.some((item) => item?.label === mappedActiveTab);
			setInfo((prev) => ({
				...prev,
				selectedView: exists ? mappedActiveTab : info?.options[0]?.label,
			}));
		}
	}, [activeTab, info?.options]);

	useEffect(() => {
		setSearchParams({
			'active-tab': activeTab,
			viewMode: info?.viewMode,
		});
	}, [info?.viewMode, activeTab]);

	useEffect(() => {
		if (cardItems?.current || info?.createNewGalleryModal) {
			cardItems.current = document?.getElementsByClassName('card-item-style');
			Array.from(cardItems?.current)?.forEach((item) => {
				item.style.zIndex = '0';
			});
		}
	}, [info?.createNewGalleryModal]);

	useEffect(() => {
		if (tenantUserAccessControls) {
			let filteredOptions = options;

			if (isAdmin) {
				// Admins can see all, except liteGallery if it's not in the paid plan
				filteredOptions = options?.filter((option) => {
					if (option?.value === 'liteGallery') {
						return liteGalleryPaidPlan; // Include only if paid
					}
					return true; // Include everything else
				});
			} else if (tenantUserAccessControls?.accessControls) {
				// Non-admins: filter based on accessControls
				const enabledApps = new Set(
					tenantUserAccessControls?.accessControls
						?.filter((permission) => {
							if (permission?.app === 'liteGallery') {
								return (
									permission?.isEnabled &&
									permission?.hasFullAccess &&
									liteGalleryPaidPlan
								);
							}
							return permission?.isEnabled;
						})
						?.map((permission) => permission?.app),
				);

				filteredOptions = options?.filter((option) => enabledApps?.has(option?.value));
			}

			setInfo((prevInfo) => ({
				...prevInfo,
				options: [...filteredOptions],
			}));
		}
	}, [tenantUserAccessControls]);

	const handleOutsideClick = useCallback((e) => {
		if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
			handleCloseSearch(e);
		}
	}, []);

	// Update the useEffect for focus handling
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		if (info.isFocused) {
			// Clear input and focus after modal mounts
			const timer = setTimeout(() => {
				if (inputRef.current) {
					inputRef.current.value = '';
					inputRef.current.focus();
				}
			}, 50);

			// Add click listener
			document.addEventListener('mousedown', handleOutsideClick);

			return () => {
				clearTimeout(timer);
				document.removeEventListener('mousedown', handleOutsideClick);
				document.removeEventListener('keydown', handleKeyDown);
			};
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [info.isFocused]);

	const handleNavigateGallery = (gallery) => {
		if (activeTab === 'Lite Gallery') {
			navigate(`/galleries/${gallery?._id}?lite-gallery=true`, {
				state: { galleryData: gallery },
			});
		} else {
			navigate(`/galleries/${gallery?._id}`, { state: { galleryData: gallery } });
		}
	};
	const handleCreateNewGallery = (type) => {
		if (!accessControlCheck(type)) return;
		setInfo({
			...info,
			createNewGalleryModal: true,
		});
	};

	const handleCloseModal = () => {
		setInfo({
			...info,
			createNewGalleryModal: false,
		});
	};

	const handleDropdownOptionClick = async (option) => {
		if (option === info?.selectedView) {
			setInfo((prev) => ({
				...prev,
				bottomNavigationDropdown: false,
			}));
			return;
		}

		setLoadingView(option);

		try {
			setInfo((prev) => ({
				...prev,
				bottomNavigationDropdown: false,
			}));
			const urlParam = option === 'My Templates' ? 'My-Templates' : option;
			setSearchParams({ 'active-tab': urlParam });
		} finally {
			setLoadingView(null);
		}
	};

	const handleNavigateForm = (form) => {
		navigate(`/form/${form?._id}`, { state: { formData: form } });
	};

	const handleTotalChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, totalCount: data }));
	};

	const setViewMode = useCallback((viewMode) => {
		setInfo((prev) => ({ ...prev, viewMode }));
	}, []);

	const handleSearch = async (e) => {
		clearTimeout(elasticSearchTimeoutRef?.current);
		const searchInput = e?.target?.value;

		// Update searchQuery state first
		setInfo((prev) => ({
			...prev,
			searchQuery: searchInput,
			// Always show elastic search results container
			showElasticSearchResults: true,
			// Only set loading if there's text to search
			isLoading: searchInput.trim() !== '',
		}));

		// Skip searching if input is empty - just show "No results found"
		if (!searchInput.trim()) {
			return;
		}

		// Only perform search if we have actual text
		elasticSearchTimeoutRef.current = setTimeout(async () => {
			// Start the search
			setInfo((prev) => ({
				...prev,
				isLoading: true,
			}));

			const response = await performElasticSearch(searchInput);
			const apiSuccess = response[0];

			if (!apiSuccess) {
				const errMsg = response[1];
				message.error(errMsg);
			}

			// Update loading state
			setInfo((prev) => ({
				...prev,
				isLoading: false,
			}));
		}, 500);
	};

	const handleCloseSearch = (e) => {
		setInfo((prev) => ({
			...prev,
			isFocused: false,
			showElasticSearchResults: false,
			searchQuery: '', // Clear the search input
			isLoading: false, // Stop any loading state
			searchResults: [], // Clear any search results
		}));

		// Blur the input to take away focus
		if (inputRef.current) {
			inputRef.current.blur();
			// Remove the input-focus class explicitly
			inputRef.current.classList.remove('input-focus');
			inputRef.current.classList.remove('search-input-focused');
		}

		// Clear any pending searches
		if (elasticSearchTimeoutRef.current) {
			clearTimeout(elasticSearchTimeoutRef.current);
		}
	};

	const handleKeyDown = (e) => {
		if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();

			resetElasticSearchState();

			if (info.isFocused) {
				handleCloseSearch(e);
			} else {
				// Open search with empty query and show "No results found"
				setInfo((prev) => ({
					...prev,
					isFocused: true,
					showElasticSearchResults: true,
					isLoading: false,
					searchQuery: '',
				}));

				setTimeout(() => {
					if (inputRef.current) {
						inputRef.current.focus();
						// Add "input-focus" class to ensure full-width style
						inputRef.current.classList.add('input-focus');
						inputRef.current.classList.add('search-input-focused');
					}
				}, 10);
			}
		}
		if ((e.key === 'h' || e.key === 'H') && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			navigate('/');
		}
		if (e.key === 'Escape') {
			handleCloseSearch(e);
		}
	};

	const SearchResults = () => {
		if (!info?.search) {
			return null;
		}

		// Function to safely render HTML content
		const renderHTMLContent = (content) => {
			return { __html: content || '' };
		};

		// Hover card component
		const HoverCard = ({ searchItem }) => {
			const { icon, color } = getFileTypeInfo(searchItem);

			return (
				<div className="hover-card">
					<div className="hover-card-header">
						<div className="hover-card-icon" style={{ color }}>
							{icon}
						</div>
						<div className="hover-card-title">{searchItem?.title || 'Singularity'}</div>
					</div>
					<div className="hover-card-content">
						<div
							className="hover-card-description"
							dangerouslySetInnerHTML={renderHTMLContent(
								searchItem?.text ||
									'Connect to Notion to manage <mark>tasks</mark>, organize projects, and centralize your work.',
							)}
						/>
					</div>
				</div>
			);
		};

		const handleOpenClick = (gallery) => {
			if (gallery?.sourceType === 'workflow') {
				navigate(`/doc/${gallery?._id}`);
			} else if (gallery?.platform === 've.ai') {
				if (gallery?.fileUrl) {
					window.open(gallery?.fileUrl, '_blank');
				}
				if (gallery?.url) {
					window.open(gallery?.url, '_blank');
				}
			} else {
				if (gallery?.url) {
					window.open(gallery?.url, '_blank');
				}
			}
		};

		const shouldShowOpenButton = (gallery) => {
			if (gallery?.sourceType === 'workflow') {
				return true;
			}

			if (gallery?.platform === 've.ai') {
				return !!gallery?.fileUrl || !!gallery?.url;
			}

			return !!gallery?.url;
		};

		const handleAskClick = (searchItem) => {
			updateTemplateStateValues({ galleryFile: searchItem });
			const chatId = ObjectID()?.toString();
			navigate(`/chat/${chatId}`);
		};

		return (
			<div className="search-results-container">
				<div className="search-results-header">
					<h3 className="search-result-title">Search Results</h3>
				</div>
				<div className="search-results-list">
					{elasticSearchResults?.length === 0 ? (
						<div className="no-results-text">No results found</div>
					) : (
						elasticSearchResults?.map((searchItem, index) => (
							<div key={searchItem?._id || index} className="search-result-item">
								<div className="search-result-item-content">
									<div className="search-result-item-left">
										<div style={{ color: getFileTypeInfo(searchItem).color }}>
											{getFileTypeInfo(searchItem).icon}
										</div>
										<div className="search-result-item-info">
											<h4>{searchItem?.title || 'Singularity'}</h4>
										</div>
									</div>
									<div className="hover-card-wrapper">
										<HoverCard searchItem={searchItem} />
									</div>
									<div className="search-result-item-right">
										<div className="action-buttons">
											<button
												className="action-btn ask-btn"
												onClick={() => handleAskClick(searchItem)}
											>
												Ask
											</button>
											{shouldShowOpenButton(searchItem) && (
												<button
													className="action-btn open-btn"
													onClick={() => handleOpenClick(searchItem)}
												>
													Open
												</button>
											)}
										</div>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		);
	};

	const tabsMapper = {
		Documents: (
			<DocsGrid
				statusTextmapper={statusTextmapper}
				handleTotalChange={(value) => handleTotalChange({ workflow: value })}
				viewMode={info?.viewMode}
				setViewMode={setViewMode}
			/>
		),
		Forms: (
			<FormsGrid
				statusTextmapper={statusTextmapper}
				handleNavigateForm={handleNavigateForm}
				handleCreateForm={() => {
					if (!accessControlCheck('form')) return;
					const sessionId = ObjectID().toHexString();
					updateTemplateStateValues({ activeInputForChat: 'Create a form for ' });
					navigate(`/chat/${sessionId}`);
				}}
				handleTotalChange={(value) => handleTotalChange({ form: value })}
				viewMode={info?.viewMode}
				setViewMode={setViewMode}
			/>
		),
		Gallery: (
			<GalleryGrid
				handleCreateNewGallery={() => handleCreateNewGallery('classicGallery')}
				handleNavigateGallery={handleNavigateGallery}
				selectedOption={info?.selectedView}
				handleTotalChange={(value) => handleTotalChange({ classicGallery: value })}
				viewMode={info?.viewMode}
				setViewMode={setViewMode}
			/>
		),
		'Lite Gallery': (
			<GalleryGrid
				tenantGalleries={tenantGalleries}
				handleCreateNewGallery={() => handleCreateNewGallery('liteGallery')}
				handleNavigateGallery={handleNavigateGallery}
				selectedOption={info?.selectedView}
				handleTotalChange={(value) => handleTotalChange({ liteGallery: value })}
				viewMode={info?.viewMode}
				setViewMode={setViewMode}
			/>
		),
		MostUsedEntries: <MostUsedEntries mostUsedEntities={mostUsedEntities} />,
		'My Templates': (
			<TemplatesGrid
				handleCreateTemplate={() =>
					setInfo((prev) => ({ ...prev, openProposalPopup: true }))
				}
				handleTotalChange={(value) => handleTotalChange({ template: value })}
				viewMode={info?.viewMode}
				setViewMode={setViewMode}
			/>
		),
		// Notes: <NotesGrid handleTotalChange={(value) => handleTotalChange({ notes: value })} />,
		Notes: (
			<NotesGrid
				handleTotalChange={(value) => handleTotalChange({ notes: value })}
				isDatabase={true}
			/>
		),
	};

	const triggerCmdH = () => {
		const event = new KeyboardEvent('keydown', {
			key: 'h',
			metaKey: true, // For macOS; use ctrlKey for Windows
			bubbles: true,
		});
		document.dispatchEvent(event);
	};

	return (
		<div className="files-container">
			<div className="storage-main-container">
				<div className="storage-header-container">
					<span className="beta-text">
						{/* <div className="beta-text-bold">Search | Create | Share</div>
						<div className="beta-text">File Flow Inspired by Your Mind</div> */}
					</span>
					{/* <div className="storage-header-items">
						<QuickActions suggestedOptions={suggestedOptions} />
					</div> */}
				</div>
				<div className="card-container-wrapper">
					<div className="card-sub-container">
						<div className="card-sub-container-left">
							<div className="left-sidebar-header">
								{/* <div
									className={`command-h-container`}
									onClick={() => navigate('/')}
								>
									<div className="command-h-icon">Home</div>
									<div className="command-h-text">
										<CommandIcon className="command-icon" />
										<span className="command-h-text-bold">H</span>
									</div>
								</div> */}
							</div>
						</div>
						{info?.search ? <SearchResults /> : tabsMapper?.[info?.selectedView]}
						<div className="card-sub-container-right">
							<div className="right-sidebar-options">
								{/* <div className="create-new-btn">
									<AddIcon />
									Create New
								</div> */}
								{info?.options.map((option) => (
									<div className="sidebar-option-wrapper" key={option?.value}>
										<div
											className={`sidebar-option ${
												info?.selectedView === option?.label ? 'active' : ''
											}`}
											onClick={() => handleDropdownOptionClick(option?.label)}
										>
											{/* {info?.selectedView === option?.label && (
												<span className="sidebar-option-active-indicator"></span>
											)} */}
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												{option?.label}
											</div>
											{info?.totalCount?.[option?.value] ? (
												<div className="count-wrapper">
													{info?.totalCount?.[option?.value]}
												</div>
											) : null}
										</div>

										{loadingView === option?.label && (
											<div className="sidebar-option-spinner">
												<Spinner
													cssstyle={{
														border: '1px solid #fff',
													}}
													width={'16px'}
													height={'16px'}
												/>
											</div>
										)}
									</div>
								))}
							</div>
						</div>

						{/* <div className={`search-input-container`} onClick={triggerCmdK}>
							<div className="search-input-wrapper">
								<SearchSvg /> Search
							</div>
							<div className="command-text">
								<div className="cmd-icon">
									<CommandIcon />
								</div>
								<span className="cmd-text">K</span>
							</div>
						</div> */}
					</div>
				</div>
				{/* <div className="black-gradient-btm"></div> */}
			</div>

			<CreateGallery
				open={info?.createNewGalleryModal}
				closeModal={handleCloseModal}
				message={message}
				isLightGallery={info?.selectedView === 'Lite Gallery'}
			/>
			<ProposalsPopup
				open={info?.openProposalPopup}
				closeModal={() =>
					setInfo((prev) => ({
						...prev,
						openProposalPopup: false,
						commonState: info?.selectedView === 'Forms' ? 'form-submission' : 'All',
					}))
				}
				clientDetails={formsTemplatesList}
				commonState={info?.selectedView === 'Forms' ? 'form-submission' : 'All'}
			/>
		</div>
	);
};

export default memo(Files);
