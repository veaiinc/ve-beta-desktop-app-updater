import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import { ReactComponent as SearchSvg } from '../../../assets/svg/elastic_search/search-icon.svg';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import CreateGallery from '../../components/modalsV2/gallery/CreateGallery';
import { message } from '../../components/globalComponents/CustomToast';
import Spinner from '../../components/loaders/Spinner';
import ProposalsPopup from '../../components/docs/ProposalsPopup';
import ObjectID from 'bson-objectid';
import QuickActions from '../../components/globalComponents/QuickActions';
import DocsGrid from '../../components/files/DocsGrid';
import NotesGrid from '../../components/files/NotesGrid';
import FormsGrid from '../../components/files/FormsGrid';
import GalleryGrid from '../../components/files/GalleryGrid';
import MostUsedEntries from '../../components/files/MostUsedEntries';
import TemplatesGrid from '../../components/files/TemplatesGrid';
import { useSearchParams } from 'react-router-dom';
import ElasticSearchResults from './ElasticSearchResults';
import getFileTypeInfo from './getFiletypeInfo';

const options = [
	// 'All',
	{
		label: 'Documents',
		value: 'workflow',
	},
	// {
	// 	label:"Notes",value:"workflow"
	// },
	{
		label: 'Forms',
		value: 'form',
	},
	{
		label: 'Designs',
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
];

export const statusTextmapper = {
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

const suggestedOptions = [
	{
		id: 1,
		title: 'Documents',
		value: '',
		controlValue: 'All',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: '' }));
		},
	},
	{
		id: 2,
		title: 'Notes',
		value: 'note',
		action: async ({ setInfo, navigate, createNotesList }) => {
			try {
				setInfo((prev) => ({
					...prev,
					showLoader: true,
					loaderMessage: 'Creating note...',
				}));
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
				setInfo((prev) => ({
					...prev,
					showLoader: false,
					loaderMessage: '',
				}));
			}
		},
	},
	{
		id: 3,
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
		id: 4,
		title: 'Proposal',
		value: 'proposal',
		controlValue: 'workflow',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: 'proposal' }));
		},
	},
	{
		id: 5,
		title: 'Invoice',
		value: 'invoice',
		controlValue: 'workflow',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: 'invoice' }));
		},
	},
	{
		id: 6,
		title: 'Contracts',
		value: 'contract',
		controlValue: 'workflow',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: 'contract' }));
		},
	},
	{
		id: 7,
		title: 'Presentation',
		value: 'presentation',
		controlValue: 'workflow',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openProposalPopup: true, commonState: 'presentation' }));
		},
	},
	{
		id: 8,
		title: 'Gallery',
		value: 'galleries',
		controlValue: 'classicGallery',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openGalleryPopup: true }));
		},
	},
	{
		id: 9,
		title: 'Lite Gallery',
		value: 'lite-gallery',
		controlValue: 'liteGallery',
		action: ({ setInfo }) => {
			setInfo((prev) => ({ ...prev, openLiteGalleryPopup: true }));
		},
	},
];
const Files = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get('activeTab') || 'Notes';
	const cardItems = useRef(null);
	const elasticSearchInputRef = useRef(null);
	const elasticSearchTimeoutRef = useRef(null);
	const navigate = useNavigate();

	const {
		galleryInfo: { tenantGalleries },
		elasticSearch: { elasticSearchResults, performElasticSearch },
		templates: { formsTemplatesList, updateStateValues: updateTemplateStateValues },
		notes: { createNotesList },
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
		isElasticSearchLoading: false,
		selectedView: 'Documents',
		openProposalPopup: false,
		initialDataFetched: false,
		commonState: 'All',
		options: [{ label: 'Notes', value: 'notes' }],
		totalCount: null,
		showElasticSearchResults: false,
	});

	const isAdmin = tenantUserAccessControls?.role === 'admin';
	const liteGalleryPaidPlan = currentPlan?.apps?.find(
		(app) => (app.app = 'liteGallery'),
	)?.isPaidPlan;

	useEffect(() => {
		if (activeTab) {
			const exists = info?.options?.some((item) => item?.label === activeTab);
			setInfo((prev) => ({
				...prev,
				selectedView: exists ? activeTab : info?.options[0]?.label,
			}));
		}
	}, [activeTab, info?.options]);

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
				options: [{ label: 'Notes', value: 'notes' }, ...filteredOptions],
			}));
		}
	}, [tenantUserAccessControls]);

	const handleNavigateGallery = (gallery) => {
		navigate(`/galleries/${gallery?._id}`, { state: { galleryData: gallery } });
	};

	const handleCreateNewGallery = () => {
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

	const handleNewNotes = async () => {
		const payload = {
			input: {
				title: 'New Note',
			},
		};
		setInfo((prev) => ({ ...prev, creatingNoteLoader: true }));
		const response = await createNotesList(payload);
		if (response?.[1]?._id) {
			const newNoteId = response[1]?._id;
			navigate(`/note/${newNoteId}`);
		}
	};

	const handleDropdownOptionClick = async (option) => {
		if (option === info?.selectedView) {
			setInfo({
				...info,
				bottomNavigationDropdown: false,
			});
			return;
		}

		setLoadingView(option);

		try {
			setInfo({
				...info,
				bottomNavigationDropdown: false,
			});
			setSearchParams({ activeTab: option });
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

	const handleSearch = async (e) => {
		clearTimeout(elasticSearchTimeoutRef?.current);
		const searchInput = e?.target?.value;
		const emptySearchInput = searchInput === '';

		if (emptySearchInput) {
			setInfo((prev) => ({
				...prev,
				isLoading: false, // Ensure isLoading is set to false
				elasticSearchLoading: false,
				showElasticSearchResults: false,
			}));
			return;
		}

		setInfo((prev) => ({ ...prev, isLoading: true }));

		elasticSearchTimeoutRef.current = setTimeout(async () => {
			setInfo((prev) => ({
				...prev,
				elasticSearchLoading: true,
				showElasticSearchResults: false,
			}));

			const response = await performElasticSearch(searchInput);
			const apiSuccess = response[0];

			if (!apiSuccess) {
				const errMsg = response[1];
				message.error(errMsg);
			}

			setInfo((prev) => ({
				...prev,
				elasticSearchLoading: false,
				showElasticSearchResults: true,
				isLoading: false,
			}));
		}, 500);
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
				handleCreateDoc={() => setInfo((prev) => ({ ...prev, openProposalPopup: true }))}
				handleTotalChange={(value) => handleTotalChange({ workflow: value })}
			/>
		),
		Notes: (
			<NotesGrid
				handleNewNotes={handleNewNotes}
				handleTotalChange={(value) => handleTotalChange({ notes: value })}
			/>
		),
		Forms: (
			<FormsGrid
				statusTextmapper={statusTextmapper}
				handleNavigateForm={handleNavigateForm}
				handleCreateForm={() => setInfo((prev) => ({ ...prev, openProposalPopup: true }))}
				handleTotalChange={(value) => handleTotalChange({ form: value })}
			/>
		),
		Gallery: (
			<GalleryGrid
				handleCreateNewGallery={handleCreateNewGallery}
				handleNavigateGallery={handleNavigateGallery}
				selectedOption={info?.selectedView}
				handleTotalChange={(value) => handleTotalChange({ classicGallery: value })}
			/>
		),
		'Lite Gallery': (
			<GalleryGrid
				tenantGalleries={tenantGalleries}
				handleCreateNewGallery={handleCreateNewGallery}
				handleNavigateGallery={handleNavigateGallery}
				selectedOption={info?.selectedView}
				handleTotalChange={(value) => handleTotalChange({ liteGallery: value })}
			/>
		),
		MostUsedEntries: <MostUsedEntries mostUsedEntities={mostUsedEntities} />,
		Designs: (
			<TemplatesGrid
				handleCreateTemplate={() =>
					setInfo((prev) => ({ ...prev, openProposalPopup: true }))
				}
				handleTotalChange={(value) => handleTotalChange({ template: value })}
			/>
		),
	};

	return (
		<div className="files-container">
			{info?.showElasticSearchResults ? (
				<>
					<h1 className="search-heading">All Files</h1>
					<ElasticSearchResults />
				</>
			) : (
				<>
					<div className="storage-main-container">
						<div className="storage-header-container">
							<span className="beta-text">
								{/* <div className="beta-text-bold">Search | Create | Share</div>
						<div className="beta-text">File Flow Inspired by Your Mind</div> */}
							</span>
							<div className="storage-header-items">
								<QuickActions suggestedOptions={suggestedOptions} />
							</div>
						</div>
						<div className="card-container-wrapper">
							<div className="card-sub-container">
								<div className="card-sub-container-left">
									<div className="left-sidebar-header"></div>
								</div>
								{info?.search ? (
									<SearchResults />
								) : (
									tabsMapper?.[info?.selectedView]
								)}
								<div className="card-sub-container-right">
									<div className="right-sidebar-options">
										{info?.options.map((option) => (
											<div
												className="sidebar-option-wrapper"
												key={option?.value}
											>
												<div
													className={`sidebar-option ${
														info?.selectedView === option?.label
															? 'active'
															: ''
													}`}
													onClick={() =>
														handleDropdownOptionClick(option?.label)
													}
												>
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
							</div>
						</div>
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
								commonState:
									info?.selectedView === 'Forms' ? 'form-submission' : 'All',
							}))
						}
						clientDetails={formsTemplatesList}
						commonState={info?.selectedView === 'Forms' ? 'form-submission' : 'All'}
					/>
				</>
			)}
			<div className="search-input-container" ref={elasticSearchInputRef}>
				<div className="search-input">
					<input type="text" placeholder="Search" onChange={handleSearch} />
					<div className="spinner-wrapper">
						{info?.isLoading ? (
							<Spinner width={'16px'} height={'16px'} />
						) : (
							<SearchSvg />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(Files);
