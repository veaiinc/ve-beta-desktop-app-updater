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
import { DocsStatusButton } from '../docs/Docs';
const initialState = {
	workflowTemplates: [],
};

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
	const cardItems = useRef(null);
	const {
		galleryInfo: { getGalleries, tenantGalleries, getMostUsedEntities },
		elasticSearch: { elasticSearchResults },
		templates: {
			getTemplatesListForForms,
			formsTemplatesList,
			getDocsFilesList,
			myWorkflows,
			docsFilesList,
			getMyWorkflows,
			updateStateValues: updateTemplateStateValues,
			getTemplatesListForCreateLead,
		},
		notes: { getNotesList, notes, createNotesList },
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
	});

	useEffect(() => {
		if (cardItems.current || info.createNewGalleryModal) {
			cardItems.current = document.getElementsByClassName('card-item-style');
			Array.from(cardItems.current).forEach((item) => {
				item.style.zIndex = '0';
			});
		}
	}, [info?.createNewGalleryModal]);

	const navigate = useNavigate();

	const fetchGalleries = async (page, title = null, reset = false, customOptions = null) => {
		try {
			const options = customOptions || {
				page,
				limit: 12,
				storeOriginals: true,
			};

			if (title) {
				options.title = title;
				options.limit = options.limit + 1;
			}

			getGalleries(options, reset);
		} catch (err) {
			setInfo((prevState) => ({
				...prevState,
				error: err.message || 'Failed to fetch galleries',
			}));
		}
	};

	useEffect(() => {
		getMyWorkflowTemplatesData(1);
		return () => {
			setInfo((prev) => ({
				...prev,
				...initialState,
			}));
		};
	}, []);

	useEffect(() => {
		if (myWorkflows) {
			myWorkflowsDataParser(myWorkflows);
		}
	}, [myWorkflows]);
	const myWorkflowsDataParser = useCallback(
		(dataToBeUsed, fetchMore = false) => {
			let { data, currentPage, hasNextPage } = dataToBeUsed;
			let workflowTemplates = [];

			for (let i = 0; i < data?.length; i++) {
				if (
					data?.[i]?.tenantId &&
					data?.[i]?.tenantId !== null &&
					data?.[i]?.status === 'published'
				) {
					workflowTemplates?.push(data?.[i]);
				}
			}

			if (fetchMore) {
				workflowTemplates = [...(info?.workflowTemplates || [])]?.concat(workflowTemplates);
			}
			setInfo((prev) => ({
				...prev,
				loading: false,
				workflowTemplates,
				currentPage,
				hasNextPage,
			}));
		},
		[info?.workflowTemplates],
	);

	const getMyWorkflowTemplatesData = useCallback(
		(page, fetchMore = false) => {
			const payload = {
				filters: {
					limit: 16,
					page: page,
					type: 'workspace',
					status: 'published',
					sortBy: 'createdAt',
					sortType: -1,
				},
			};
			if (info?.searchChanged) {
				payload.filters.title = info?.searchValue || '';
			}
			getMyWorkflows(payload, fetchMore);
		},
		[info],
	);

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

	// const handleMouseEnter = () => {
	// 	setInfo((prev) => ({ ...prev, cardHover: true }));
	// };

	// const handleMouseLeave = () => {
	// 	setInfo((prev) => ({ ...prev, cardHover: false }));
	// };

	const [mostUsedEntities, setMostUsedEntities] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [loadingView, setLoadingView] = useState(null);

	const fetchInitialData = async () => {
		try {
			setIsLoading(true);
			const payload = {
				filters: {
					limit: 12,
					page: 1,
					sortBy: 'updatedBy',
					sortType: -1,
					startDate: null,
					entityType: ['workflows', 'pages'],
				},
			};

			const response = await getMostUsedEntities(payload);
			if (response?.[0] && response?.[1]?.data?.mostUsedEntities) {
				setMostUsedEntities(response[1].data.mostUsedEntities);
			}
		} catch (error) {
			console.error('Error in fetchInitialData:', error);
			message.error('Failed to fetch templates');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		// Initial load of data
		const initializeData = async () => {
			try {
				setIsLoading(true);
				await Promise.all([
					fetchInitialData(),
					fetchForms(),
					fetchDocs(),
					fetchNotes(),
					getMyWorkflowTemplatesData(1),
				]);
			} catch (error) {
				console.error('Error initializing data:', error);
			} finally {
				setIsLoading(false);
				setInfo((prev) => ({ ...prev, initialDataFetched: true }));
			}
		};
		initializeData();

		const contentContainer = document.querySelector('.storage-main-container');
		if (contentContainer) {
			gsap.fromTo(
				contentContainer,
				{ x: '100%', opacity: 0 },
				{
					x: '0%',
					opacity: 1,
					duration: 0.1,
					ease: 'power2.out',
					clearProps: 'all',
				},
			);
		}
	}, []);

	const fetchForms = async () => {
		try {
			await getTemplatesListForForms(1, 12);
		} catch (error) {
			console.error('Error fetching forms:', error);
		}
	};

	const fetchDocs = async () => {
		try {
			const payload = {
				filters: {
					limit: 12,
					page: 1,
				},
			};
			await getDocsFilesList(payload, false);
		} catch (error) {
			console.error('Error fetching docs:', error);
		}
	};

	const fetchNotes = async () => {
		try {
			const payload = {
				input: {
					limit: 12,
					page: 1,
					pageType: 'all',
				},
			};
			await getNotesList(payload, false);
		} catch (error) {
			console.error('Error fetching notes:', error);
		}
	};

	const fetchTemplates = async () => {
		try {
			await getTemplatesListForCreateLead();
		} catch (error) {
			console.error('Error fetching templates:', error);
		}
	};

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
			if (option === 'All') {
				await fetchInitialData();
			} else if (option === 'Forms') {
				await fetchForms();
			} else if (option === 'Documents') {
				await fetchDocs();
			} else if (option === 'Notes') {
				await fetchNotes();
			} else if (option === 'Templates') {
				await fetchTemplates();
			} else if (option === 'Classic Gallery' || option === 'Lite Gallery') {
				const options = {
					page: 1,
					limit: info.limit,
					storeOriginals: option === 'Classic Gallery',
				};
				await fetchGalleries(1, null, true, options);
			}

			setInfo({
				...info,
				bottomNavigationDropdown: false,
				selectedView: option,
			});
		} finally {
			setLoadingView(null);
		}
	};

	useEffect(() => {
		const initializeData = async () => {
			try {
				if (info.selectedView === 'Forms') {
					await fetchForms();
				} else if (info.selectedView === 'Documents') {
					await fetchDocs();
				} else if (info.selectedView === 'Notes') {
					await fetchNotes();
				} else if (info.selectedView === 'Templates') {
					await fetchTemplates();
				} else if (
					info.selectedView === 'Classic Gallery' ||
					info.selectedView === 'Lite Gallery'
				) {
					const options = {
						page: 1,
						limit: info.limit,
						storeOriginals: info.selectedView === 'Classic Gallery',
					};
					await fetchGalleries(1, null, true, options);
				} else {
					await fetchGalleries(1, null, true);
				}
			} catch (error) {
				console.error('Error initializing data:', error);
			}
		};

		if (!info.initialDataFetched) {
			initializeData();
			setInfo((prev) => ({ ...prev, initialDataFetched: true }));
		}
	}, []);

	const handleNavigateForm = (formId) => {
		navigate(`/form/${formId}`);
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

	const renderFormsGrid = () => (
		<div
			className={`${info?.cardHover ? 'card-container-hover' : 'card-container'}`}
			// onMouseEnter={handleMouseEnter}
			// onMouseLeave={handleMouseLeave}
		>
			<div className="card-item">
				<div className="card-item-style card-item-style-btn">
					<button
						className="card-btn"
						onClick={() => setInfo((prev) => ({ ...prev, openProposalPopup: true }))}
					>
						<Plus />
						Create Form
					</button>
				</div>
			</div>
			{formsTemplatesList?.data?.slice(0, 12).map((form, index) => (
				<div
					className="card-item"
					key={index}
					onClick={() => handleNavigateForm(form?._id)}
				>
					<div className="card-item-style content-wrapper docs">
						<DocsStatusButton
							content={statusTextmapper?.[form?.status]?.text}
							style={statusTextmapper?.[form?.status]?.style}
							dotStyle={statusTextmapper?.[form?.status]?.dotStyle}
						/>
						<div className="docs-title-wrapper docs-title-wrapper-form">
							<div className=""></div>
							<span className="docs-item-title">{form?.title.slice(0, 20)}</span>
							<span className="docs-item-sub-title">
								{moment.unix(form?.createdAt).fromNow()}
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);

	const renderDocsGrid = () => {
		const getStatusBadge = (status) => {
			switch (status?.toLowerCase()) {
				case 'enquiry':
					return 'Draft';
				case 'filesent':
					return 'Sent';
				case 'filesviewed':
					return 'Client Viewed';
				case 'proposalaccepted':
					return 'Client Accepted';
				case 'contractsigned':
					return 'Client Signed';
				case 'confirmed':
					return 'Confirmed';
				case 'draft':
					return 'Draft';
				case 'published':
					return 'Live';
				default:
					return status || 'Draft';
			}
		};

		return (
			<div
				className={`${info?.cardHover ? 'card-container-hover' : 'card-container'}`}
				// onMouseEnter={handleMouseEnter}
				// onMouseLeave={handleMouseLeave}
			>
				{docsFilesList?.data?.slice(0, 12).map((doc, index) => (
					<div
						className="card-item"
						key={index}
						onClick={() => navigate(`/doc/${doc?._id}`)}
					>
						<div className="card-item-style content-wrapper docs">
							<div className="docs-preview"></div>
							<DocsStatusButton
								content={statusTextmapper?.[doc?.status]?.text}
								style={statusTextmapper?.[doc?.status]?.style}
								dotStyle={statusTextmapper?.[doc?.status]?.dotStyle}
							/>
							<div className="docs-title-wrapper">
								<span className="docs-item-title">{doc?.title}</span>
								<span className="docs-item-sub-title">
									{moment.unix(doc?.createdAt).fromNow()}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	};

	const renderNotesGrid = () => (
		<div
			className={`${info?.cardHover ? 'card-container-hover' : 'card-container'}`}
			// onMouseEnter={handleMouseEnter}
			// onMouseLeave={handleMouseLeave}
		>
			<div className="card-item">
				<div className="card-item-style card-item-style-btn">
					<button className="card-btn" onClick={handleNewNotes}>
						<Plus />
						Create Note
					</button>
				</div>
			</div>
			{notes?.data?.slice(0, 12).map((note, index) => (
				<div
					className="card-item"
					key={index}
					onClick={() => navigate(`/note/${note?._id}`)}
				>
					<div className="card-item-style content-wrapper">
						{/* <span
							className={`status-badge ${
								note?.status === 'published' ? 'live' : 'draft'
							}`}
						>
							{note?.status === 'published' ? 'Live' : 'Draft'}
						</span> */}
						<span className="item-title">
							{note?.title?.slice(0, 20) || 'Untitled Note'}
						</span>
					</div>
				</div>
			))}
		</div>
	);

	const renderMostUsedEntitiesGrid = () => {
		if (isLoading) {
			return <Spinner />;
		}

		const getEntityBadge = (item) => {
			switch (item.entity?.toLowerCase()) {
				case 'workflow':
					return 'Document';
				case 'page':
					return 'Note';
				case 'form':
					return 'Form';
				default:
					return item.entityType || 'Template';
			}
		};

		const getEntityNavigationPath = (item) => {
			switch (item.entity?.toLowerCase()) {
				case 'workflow':
					return `/doc/${item._id}`;
				case 'page':
					return `/note/${item._id}`;
				case 'form':
					return `/form/${item._id}`;
				default:
					return `/doc/${item._id}`;
			}
		};

		return (
			<div
				className={`${info?.cardHover ? 'card-container-hover' : 'card-container'}`}
				// onMouseEnter={handleMouseEnter}
				// onMouseLeave={handleMouseLeave}
			>
				{mostUsedEntities?.data?.slice(0, 12).map((item, index) => (
					<div
						className="card-item"
						key={index}
						onClick={() => navigate(getEntityNavigationPath(item))}
					>
						<div className="card-item-style content-wrapper">
							<span className={`status-badge`}>{getEntityBadge(item)}</span>
							<span className="item-title">
								{item.title?.slice(0, 20)}
								{item.title?.length > 20 ? '...' : ''}
							</span>
						</div>
					</div>
				))}
			</div>
		);
	};

	const renderTemplatesGrid = () => {
		if (isLoading) {
			return <Spinner />;
		}

		const getStatusBadge = (template) => {
			if (!template?.workflowStats) return 'Draft';

			if (template.workflowStats.contractSigned) return 'Client Signed';
			if (template.workflowStats.filesViewed) return 'Client Viewed';
			if (template.workflowStats.filesSent) return 'Sent';
			if (template.workflowStats.confirmed) return 'Confirmed';
			if (template.workflowStats.enquiry) return 'Draft';

			return template?.status === 'published' ? 'Live' : 'Draft';
		};

		return (
			<div
				className={`${info?.cardHover ? 'card-container-hover' : 'card-container'}`}
				// onMouseEnter={handleMouseEnter}
				// onMouseLeave={handleMouseLeave}
			>
				<div className="card-item">
					<div className="card-item-style card-item-style-btn">
						<button
							className="card-btn"
							onClick={() =>
								setInfo((prev) => ({ ...prev, openProposalPopup: true }))
							}
						>
							<Plus />
							Create Template
						</button>
					</div>
				</div>
				{myWorkflows?.data?.slice(0, 12).map((template, index) => (
					<div
						className="card-item"
						key={index}
						// onClick={() => navigate(`/template/${template?._id}`)}
					>
						<div className="card-item-style content-wrapper">
							<span
								className={`status-badge ${
									template?.status === 'published' ? 'live' : 'draft'
								}`}
							>
								{getStatusBadge(template)}
							</span>
							<span className="item-title">
								{template?.title?.slice(0, 20)}
								{template?.title?.length > 20 ? '...' : ''}
							</span>
						</div>
					</div>
				))}
			</div>
		);
	};

	const renderGalleryGrid = () => {
		if (!tenantGalleries?.galleries) {
			return (
				<div className="spinner-container">
					<Spinner />
				</div>
			);
		}
		return (
			<div
				className={`${info?.cardHover ? 'card-container-hover' : 'card-container'}`}
				// onMouseEnter={handleMouseEnter}
				// onMouseLeave={handleMouseLeave}
			>
				<div className="card-item">
					<div className="card-item-style card-item-style-btn">
						<button className="card-btn" onClick={handleCreateNewGallery}>
							<Plus />
							Create Folder
						</button>
					</div>
				</div>
				{tenantGalleries?.galleries?.slice(0, 12).map((item, index) => (
					<div
						className="card-item"
						key={index}
						onClick={() => handleNavigateGallery(item)}
					>
						<div
							className="card-item-style content-wrapper"
							style={{
								backgroundImage: item?.coverImage?.thumbnailUrl
									? `url(${item.coverImage.thumbnailUrl})`
									: 'none',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								minHeight: '120px',
								marginBottom: '8px',
							}}
						>
							{!item?.coverImage?.thumbnailUrl && (
								<div className="folder-icon-wrapper">
									<Folder />
								</div>
							)}
							{/* <span
								className={`live-badge ${
									item?.status === 'active' ? 'badge-active' : 'badge-draft'
								}`}
							>
								<span className="live-badge-dot"></span>
								<span className="live-badge-text">
									{item?.status === 'published' ? 'Live' : 'Draft'}
								</span>
							</span> */}
						</div>
						<span className="gallery-item-title">{item?.title}</span>
					</div>
				))}
			</div>
		);
	};

	const viewsConfig = [
		{ view: 'All', app: 'all' },
		{ view: 'Classic Gallery', app: 'classicGallery' },
		{ view: 'Lite Gallery', app: 'liteGallery' },
		{ view: 'Notes', app: 'note' },
		{ view: 'Forms', app: 'form' },
		{ view: 'Documents', app: 'workflow' },
	];

	useEffect(() => {
		// Add a small delay only for gallery views to ensure data is loaded
		const delay =
			info.selectedView === 'Classic Gallery' || info.selectedView === 'Lite Gallery'
				? 100
				: 0;

		setTimeout(() => {
			const cards = document.querySelectorAll('.card-item');
			if (!cards || cards.length === 0) return;

			const ctx = gsap.context(() => {
				// Reset initial positions with varying y values
				cards.forEach((card) => {
					const yOffset = 50 + Math.random() * 100;
					gsap.set(card, {
						y: yOffset,
						opacity: 0,
					});
				});

				// Group cards into columns for staggered animation
				const columnGroups = {
					oddColumns: Array.from(cards).filter(
						(_, index) => index % 4 === 0 || index % 4 === 2,
					),
					evenColumns: Array.from(cards).filter(
						(_, index) => index % 4 === 1 || index % 4 === 3,
					),
				};

				// Animate odd columns (1 and 3)
				gsap.to(columnGroups.oddColumns, {
					y: 0,
					opacity: 1,
					duration: 0.4,
					stagger: {
						each: 0.05,
						ease: 'power1.out',
					},
					modifiers: {
						y: (y, target) => {
							const initialY = Math.abs(
								parseFloat(target.style.transform?.split('translateY(')[1]) || 0,
							);
							const duration = gsap.utils.mapRange(50, 150, 0.4, 0.2)(initialY);
							if (target._gsap) target._gsap.duration = duration;
							return y;
						},
					},
				});

				// Animate even columns (2 and 4)
				gsap.to(columnGroups.evenColumns, {
					y: 0,
					opacity: 1,
					duration: 0.4,
					delay: 0.1,
					stagger: {
						each: 0.05,
						ease: 'power1.out',
					},
					modifiers: {
						y: (y, target) => {
							const initialY = Math.abs(
								parseFloat(target.style.transform?.split('translateY(')[1]) || 0,
							);
							const duration = gsap.utils.mapRange(50, 150, 0.4, 0.2)(initialY);
							if (target._gsap) target._gsap.duration = duration;
							return y;
						},
					},
				});
			});

			return () => ctx.revert();
		}, delay);
	}, [info.selectedView, tenantGalleries?.galleries]);

	useEffect(() => {
		const container = document.querySelector('.card-container, .card-container-hover');
		if (!container) return;

		const ctx = gsap.context(() => {
			const cards = container.querySelectorAll('.card-item');
			if (!cards || cards.length === 0) return;

			const enterAnimation = (card) => {
				gsap.to(card, {
					scale: 1.05,
					duration: 0.3,
					ease: 'power2.out',
					zIndex: 2,
				});
			};

			const leaveAnimation = (card) => {
				gsap.to(card, {
					scale: 1,
					duration: 0.3,
					ease: 'power2.out',
					zIndex: 1,
				});
			};

			cards.forEach((card) => {
				card.addEventListener('mouseenter', () => enterAnimation(card));
				card.addEventListener('mouseleave', () => leaveAnimation(card));
			});
		}, container);

		return () => ctx.revert();
	}, [info.selectedView]);

	return (
		<>
			<div className="storage-main-container">
				<div className="storage-header-container">
					<span className="beta-text">
						<div className="beta-text-bold">Search | Create | Share</div>
						<div className="beta-text">File Flow Inspired by Your Mind</div>
					</span>
					<div className="storage-header-items">
						<QuickActions />
					</div>
				</div>
				<div className="card-container-wrapper">
					<div className="card-sub-container">
						<div className="card-sub-container-left">
							<div className="left-sidebar-header">hihihih</div>
						</div>
						<div className="card-sub-container-center">
							{/* <div className="center-container-header">
								<div className="center-container-dropdown"></div>
								<div className="center-container-sort-by">A-Z</div>
							</div> */}
							<div className="center-container-content">
								{info.search ? (
									<SearchResults />
								) : (
									<>
										{info.selectedView === 'Forms'
											? renderFormsGrid()
											: info.selectedView === 'Documents'
											? renderDocsGrid()
											: info.selectedView === 'Notes'
											? renderNotesGrid()
											: info.selectedView === 'All'
											? renderMostUsedEntitiesGrid()
											: info.selectedView === 'Templates'
											? renderTemplatesGrid()
											: renderGalleryGrid()}
									</>
								)}
							</div>
						</div>
						<div className="card-sub-container-right">
							<div className="right-sidebar-options">
								{[
									// 'All',
									'Documents',
									'Notes',
									'Forms',
									// 'Templates',
									'Classic Gallery',
									'Lite Gallery',
								].map((option) => (
									<div className="sidebar-option-wrapper" key={option}>
										<div
											className={`sidebar-option ${
												info.selectedView === option ? 'active' : ''
											}`}
											onClick={() => handleDropdownOptionClick(option)}
										>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
													width: '100%',
												}}
											>
												{option}
											</div>
										</div>
										{loadingView === option && (
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
				fetchGalleries={fetchGalleries}
				message={message}
				isLightGallery={info.selectedView === 'Lite Gallery'}
			/>
			<ProposalsPopup
				open={info?.openProposalPopup}
				closeModal={() =>
					setInfo((prev) => ({
						...prev,
						openProposalPopup: false,
						commonState: 'All',
					}))
				}
				clientDetails={formsTemplatesList}
				commonState={info?.commonState}
			/>
		</>
	);
};

export default memo(Files);
