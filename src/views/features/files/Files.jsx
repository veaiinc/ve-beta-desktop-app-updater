import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import { ReactComponent as Plus } from '../../../assets/svg/files/Plus.svg';
import { ReactComponent as Folder } from '../../../assets/svg/files/Folder.svg';
import { ReactComponent as File } from '../../../assets/svg/files/file.svg';
import { ReactComponent as Document } from '../../../assets/svg/files/docSvg.svg';
import { ReactComponent as Mp3 } from '../../../assets/svg/files/mp3Svg.svg';
import { ReactComponent as Mp4 } from '../../../assets/svg/files/mp4Svg.svg';
import { ReactComponent as Pdf } from '../../../assets/svg/files/pdfSvg.svg';
import { ReactComponent as Psd } from '../../../assets/svg/files/psdSvg.svg';
import { ReactComponent as Zip } from '../../../assets/svg/files/zipSvg.svg';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import CreateGallery from '../../components/modalsV2/gallery/CreateGallery';
import { message } from '../../components/globalComponents/CustomToast';
import Spinner from '../../components/loaders/Spinner';
import ProposalsPopup from '../../components/docs/ProposalsPopup';
import ObjectID from 'bson-objectid';
import gsap from 'gsap';
import QuickActions from '../../components/globalComponents/QuickActions';
import moment from 'moment';
import DocsGrid from '../../components/files/DocsGrid';
import NotesGrid from '../../components/files/NotesGrid';
import FormsGrid from '../../components/files/FormsGrid';
import GalleryGrid from '../../components/files/GalleryGrid';
import MostUsedEntries from '../../components/files/MostUsedEntries';
import TemplatesGrid from '../../components/files/TemplatesGrid';
import { useSearchParams } from 'react-router-dom';
import useAccessControls from '../../hooks/useAcessControls';
const initialState = {
	workflowTemplates: [],
};

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
		label: 'Templates',
		value: 'template',
	},
	{
		label: 'Classic Gallery',
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

const Files = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get('activeTab') || 'Notes';
	const {
		galleryInfo: { getGalleries, tenantGalleries, getMostUsedEntities },
		elasticSearch: { elasticSearchResults },
		templates: {
			formsTemplatesList,
			myWorkflows,
			docsFilesList,
			getMyWorkflows,
			updateStateValues: updateTemplateStateValues,
		},
		notes: { getNotesList, notes, createNotesList },
		profileInfo: { tenantUserAccessControls },
	} = useContext(Context);

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
	});
	const cardItems = useRef(null);

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
		if (cardItems.current || info.createNewGalleryModal) {
			cardItems.current = document.getElementsByClassName('card-item-style');
			Array.from(cardItems.current).forEach((item) => {
				item.style.zIndex = '0';
			});
		}
	}, [info?.createNewGalleryModal]);

	const navigate = useNavigate();

	useEffect(() => {
		if (tenantUserAccessControls) {
			const isAdmin = tenantUserAccessControls?.role === 'admin';
			let filteredOptions = options;

			if (!isAdmin && tenantUserAccessControls?.accessControls) {
				const enabledApps = new Set(
					tenantUserAccessControls?.accessControls
						.filter((permission) => permission.isEnabled)
						.map((permission) => permission.app),
				);
				filteredOptions = options.filter((option) => enabledApps.has(option.value));
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

	const [mostUsedEntities, setMostUsedEntities] = useState(null);
	const [loadingView, setLoadingView] = useState(null);

	const handleDropdownOptionClick = async (option) => {
		if (option === info.selectedView) {
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

	const SearchResults = () => {
		if (!info.search) {
			return null;
		}

		const getFileTypeInfo = (searchItem) => {
			// First check explicit fileType if present
			if (searchItem.fileType) {
				const type = (searchItem.fileType?.toLowerCase() || '').replace(/^\./, '');
				switch (type) {
					case 'pdf':
					case 'epub':
					case 'mobi':
					case 'azw':
						return {
							icon: <Pdf />,
							color: '#FF4D4D',
						};
					case 'mp3':
					case 'wav':
					case 'aac':
					case 'flac':
					case 'ogg':
						return {
							icon: <Mp3 />,
							color: '#9747FF',
						};
					case 'mp4':
					case 'mkv':
					case 'avi':
					case 'mov':
					case 'webm':
						return {
							icon: <Mp4 />,
							color: '#9747FF',
						};
					case 'doc':
					case 'docx':
					case 'xls':
					case 'xlsx':
					case 'csv':
					case 'ods':
					case 'ppt':
					case 'pptx':
					case 'key':
						return {
							icon: <Document />,
							color: '#2D7FF9',
						};
					case 'psd':
					case 'ai':
					case 'figma':
					case 'xd':
					case 'sketch':
						return {
							icon: <Psd />,
							color: '#2D7FF9',
						};
					case 'zip':
					case 'rar':
					case '7z':
					case 'tar.gz':
						return {
							icon: <Zip />,
							color: '#71717A',
						};
					case 'json':
					case 'xml':
					case 'yaml':
					case 'txt':
					case 'md':
					case 'log':
					case 'ini':
					case 'cfg':
						return {
							icon: <File />,
							color: '#71717A',
						};
					default:
						return {
							icon: <File />,
							color: '#71717A',
						};
				}
			}

			// If no fileType, try to determine from other properties
			if (searchItem.sourceType) {
				switch (searchItem.sourceType.toLowerCase()) {
					case 'pdf':
						return {
							icon: <Pdf />,
							color: '#FF4D4D',
						};
					case 'png':
					case 'jpg':
					case 'jpeg':
					case 'image':
						return {
							icon: <File />,
							color: '#2D7FF9',
						};
					case 'workflow':
						return {
							icon: <Document />,
							color: '#2D7FF9',
						};
					case 'url':
						return {
							icon: <File />,
							color: '#71717A',
						};
				}
			}

			// Try to determine from URL or fileUrl if present
			const url = searchItem.url || searchItem.fileUrl;
			if (url) {
				const extension = url.split('.').pop().toLowerCase();
				switch (extension) {
					case 'pdf':
						return {
							icon: <Pdf />,
							color: '#FF4D4D',
						};
					case 'png':
					case 'jpg':
					case 'jpeg':
						return {
							icon: <File />,
							color: '#2D7FF9',
						};
				}
			}
			return {
				icon: <File />,
				color: '#71717A',
			};
		};

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
						<div className="hover-card-title">{searchItem.title || 'Singularity'}</div>
					</div>
					<div className="hover-card-content">
						<div
							className="hover-card-description"
							dangerouslySetInnerHTML={renderHTMLContent(
								searchItem.text ||
									'Connect to Notion to manage <mark>tasks</mark>, organize projects, and centralize your work.',
							)}
						/>
					</div>
				</div>
			);
		};

		const handleOpenClick = (gallery) => {
			if (gallery.sourceType === 'workflow') {
				navigate(`/doc/${gallery?._id}`);
			} else if (gallery.platform === 've.ai') {
				if (gallery.fileUrl) {
					window.open(gallery.fileUrl, '_blank');
				}
				if (gallery.url) {
					window.open(gallery.url, '_blank');
				}
			} else {
				if (gallery.url) {
					window.open(gallery.url, '_blank');
				}
			}
		};

		const shouldShowOpenButton = (gallery) => {
			if (gallery.sourceType === 'workflow') {
				return true;
			}

			if (gallery.platform === 've.ai') {
				return !!gallery.fileUrl || !!gallery.url;
			}

			return !!gallery.url;
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
							<div key={searchItem._id || index} className="search-result-item">
								<div className="search-result-item-content">
									<div className="search-result-item-left">
										<div style={{ color: getFileTypeInfo(searchItem).color }}>
											{getFileTypeInfo(searchItem).icon}
										</div>
										<div className="search-result-item-info">
											<h4>{searchItem.title || 'Singularity'}</h4>
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
		'Classic Gallery': (
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
		Templates: (
			<TemplatesGrid
				handleCreateTemplate={() =>
					setInfo((prev) => ({ ...prev, openProposalPopup: true }))
				}
				handleTotalChange={(value) => handleTotalChange({ template: value })}
			/>
		),
	};
	return (
		<>
			<div className="storage-main-container">
				<div className="storage-header-container">
					<span className="beta-text">
						{/* <div className="beta-text-bold">Search | Create | Share</div>
						<div className="beta-text">File Flow Inspired by Your Mind</div> */}
					</span>
					<div className="storage-header-items">
						<QuickActions />
					</div>
				</div>
				<div className="card-container-wrapper">
					<div className="card-sub-container">
						<div className="card-sub-container-left">
							<div className="left-sidebar-header"></div>
						</div>
						{info.search ? <SearchResults /> : tabsMapper[info.selectedView]}
						<div className="card-sub-container-right">
							<div className="right-sidebar-options">
								{info?.options.map((option) => (
									<div className="sidebar-option-wrapper" key={option?.value}>
										<div
											className={`sidebar-option ${
												info.selectedView === option?.label ? 'active' : ''
											}`}
											onClick={() => handleDropdownOptionClick(option?.label)}
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
				open={info.createNewGalleryModal}
				closeModal={handleCloseModal}
				message={message}
				isLightGallery={info.selectedView === 'Lite Gallery'}
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
		</>
	);
};

export default memo(Files);
