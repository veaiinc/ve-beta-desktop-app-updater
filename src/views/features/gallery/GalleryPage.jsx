import { useState, useEffect, useRef, useContext, useCallback, memo, useMemo } from 'react';
import { ReactComponent as ShareIcon } from '../../../assets/svg/gallery/share.svg';
import sixDots from '../../../assets/svg/gallery/sixdots.svg';
import { ReactComponent as TickSvg } from '../../../assets/svg/gallery/tickFilled.svg';
import { ReactComponent as ThreeDotsIcon } from '../../../assets/svg/gallery/threeDots.svg';
import { ReactComponent as SearchIcon } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as ExpandIcon } from '../../../assets/svg/gallery/expand.svg';
import { ReactComponent as ForwardIcon } from '../../../assets/svg/gallery/forward.svg';
import { ReactComponent as PinIcon } from '../../../assets/svg/gallery/pin.svg';
import { ReactComponent as DragIcon } from '../../../assets/svg/gallery/drag.svg';
import { ReactComponent as EditPenIcon } from '../../../assets/svg/gallery/newPenIcon.svg';
import { ReactComponent as OptionsIcon } from '../../../assets/svg/gallery/dotsThree.svg';
import { ReactComponent as CloudUpload } from '../../../assets/svg/Settings/CloudUpload.svg';
import { ReactComponent as RearrangeIcon } from '../../../assets/svg/gallery/rearrangeIcon.svg';
import { ReactComponent as CrossedOpenEye } from '../../../assets/svg/gallery/crossedOpenEye.svg';
import { ReactComponent as NewFilterSvg } from '../../../assets/svg/tasks/newFiltersIcon.svg';
import { ReactComponent as EditPen } from '../../../assets/svg/gallery/editpen.svg';
import { ReactComponent as ChangeCalender } from '../../../assets/svg/gallery/changeCalender.svg';
import { ReactComponent as BrushIcon } from '../../../assets/svg/gallery/brush.svg';
import { ReactComponent as TrashIcon } from '../../../assets/svg/gallery/delete-red.svg';
import { ReactComponent as DownloadIcon } from '../../../assets/svg/gallery/download2.svg';
import { ReactComponent as LightRoomIcon } from '../../../assets/svg/gallery/light-room.svg';
import { ReactComponent as AlbumCoverIcon } from '../../../assets/svg/gallery/albumCoverIcon.svg';
import { ReactComponent as DeleteIcon } from '../../../assets/svg/gallery/delete-red.svg';
import { ReactComponent as LockIcon } from '../../../assets/svg/notesPage/lock-icon.svg';
import { ReactComponent as RightArrow } from '../../../assets/svg/home_page/arrow-right.svg';
import { ReactComponent as PlusIcon } from '../../../assets/svg/tasks/plus.svg';
import { ReactComponent as ToastSuccess } from '../../../assets/svg/gallery/toastSuccess.svg';
import { ReactComponent as ToastWarning } from '../../../assets/svg/gallery/toastWarning.svg';
import { ReactComponent as ToastError } from '../../../assets/svg/gallery/toastError.svg';
import { ReactComponent as SettingsIcon } from '../../../assets/svg/gallery/settingIcon.svg';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ReactComponent as UpArrow } from '../../../assets/svg/workflow/downArrow.svg';
import { Checkbox, Result, theme, Tooltip } from 'antd';
import ShareModal from '../../../views/components/modalsV2/gallery/ShareModal';
import CreateAlbum from '../../components/modalsV2/gallery/CreateAlbum';
import CollaboratorPopup from '../../components/modalsV2/gallery/CollaboratorPopup';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import Context from '../../../context/context';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DeleteGalleryComponent from '../../components/gallery/gallerySettings/DeleteGalleryComponent';
import DeletePopup from '../../components/modalsV2/gallery/DeletePopup';
import GalleryOverview from '../../components/gallery/galleryPage/GalleryOverviewComp';
import DesignOverviewComp from '../../components/gallery/galleryPage/DesignOverviewComp';
import UploadGalleryImageCover from '../../components/gallery/galleryPage/UploadGalleryImageCover';
import MoveToAlbumPopup from '../../components/modalsV2/gallery/MoveToAlbumPopup';
import AiSelection from './AiSelection';
import randomize from 'randomatic';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import { gsap } from 'gsap';
import slugify from 'slugify';
import Insights from '../../components/gallery/aiSelections/Insights';
// import UploadAlbumImageCover from '../../components/gallery/galleryPage/UploadAlbumImageCover';
import MainPopup from '../../components/modalsV2/gallery/RenameGallery';
import ShareAlbum from '../../components/modalsV2/gallery/ShareAlbum';
import GalleryStyles from '../../components/modalsV2/gallery/GalleryStyles';
import DownloadAlbum from '../../components/modalsV2/gallery/DownloadAlbum';
import DeleteAlbumImagesPopup from '../../components/modalsV2/gallery/DeleteAlbumImagesPopup';
import VideoUploadPopup from '../../components/modalsV2/gallery/UploadVideo';
// import ToggleSlider from '../../components/input/slider';
import { Switch, message } from 'antd';
import ShowLightRoomCopy from '../../components/modalsV2/gallery/ShowLightRoomCopy';
import { getCurrentWorkspaceId } from '../../../helpers';
import GridImage from '../../../assets/images/workflow_builder/dotgrid.png';
// import SharePopup from '../../components/modalsV2/gallery/SharePopup';
import GalleryViewer from './GalleryViewer';
import { ReactComponent as ArrowSvg } from '../../../assets/svg/file/arrow.svg';
import { ReactComponent as SelectModeIcon } from '../../../assets/svg/gallery/selectModeIcon.svg';
import { getThumbnailUrl } from '../../../helpers/videoThumbnailHelpers';
import GalleryVideos from '../../components/gallery/galleryVideos/GalleryVideos';
import { ReactComponent as ChevronLeft } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as MoveToIcon } from '../../../assets/svg/gallery/moveToIcon.svg';
// const workspaceId = localStorage.getItem('workspaceId');

const dummyImagesArray = Array.from({ length: 10 }, () => ({ isPlaceholderImg: true }));

const sortingOptions = [
	{ label: 'Recently Added', value: 'createdAt' },
	{ label: 'A - Z', value: 'displayName' },
	{ label: 'Date Captured', value: 'originalDateTime' },
	{ label: 'Date Uploaded', value: '-originalDateTime' },
	{ label: 'Custom', value: 'custom' },
];

const icons = {
	success: <ToastSuccess />,
	error: <ToastError />,
	warning: <ToastWarning />,
};
const showMessage = (type, content, dismissFunction) => {
	const key = `message-${Date.now()}`;

	message.open({
		key,
		content: (
			<div className="message-container">
				<span>{content}</span>
				<span className="divider"></span>
				<button
					onClick={() => {
						// message.destroy(key);
						if (type === 'error') dismissFunction?.();
					}}
					className="dismiss-button"
				>
					{type === 'error' ? 'Try Again' : 'Dismiss'}
				</button>
			</div>
		),
		icon: icons[type],
		duration: 2,
		className: 'custom-message',
	});
};

let startTime;
let animationFrame;

const filterOptions = [
	{ label: 'File name', value: 'displayName', sortType: 1 },
	{ label: 'Date Captured', value: 'originalDateTime', sortType: 1 },
	{ label: 'Upload time', value: '_id', sortType: 1 },
	{ label: 'Random', value: 'custom', sortType: 1, noArrow: true },
];

const GalleryPage = () => {
	const { galleryId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const [searchkeys, setsearchkeys] = useSearchParams();
	const {
		galleryInfo: {
			getAlbums,
			tenantAlbums,
			getEditPreferences,
			tenantPreferences,
			editPreferences,
			tenantGalleries,
			postGallery,
			getAlbumCount,
			getLayoutSettings,
			layoutSettings,
			putLayoutSettings,
			getCollaborators,
			collaborators,
			updateActiveAlbum,
			galleryCredentials,
			getGalleryCredentials,
			albumDetails,
			getGalleryImages,
			imagesList,
			updateTagOrder,
			shareGalleryViaEmail,
			getAlbumImagesCount,
			getImage,
			albumImagesCount,
			updateCollaborators,
			basicAlbumDetails,
			deleteImages,
			updateTagSortType,
			getGalleryTagsList,
			getImageUploadStatus,
			getUploadImageSignUrl,
			getImageDetail,
			imageDetail,
			updateGalleryCoverImage,
			addTagToImage,
			removeTagFromImage,
			getImageDuplicatesList,
			getClientSelections,
			clientSelectionsData,
			getClientSelectionImages,
			clientSelectionImages,
			moveImagesToAlbum,
			addGalleryTag,
			tagsList,
			updateAlbumOrder,
			getRearrangeStatus,
			updateImageOrder,
			changeImageOrder,
			getDownloadLinkStatus,
			getZipDownloadUrl,
			getDownloadLinkForImage,
			getDownloadForMultipleImages,
			downloadImages,
			deleteGallery,
			getGalleries,
			editAlbumName,
			checkAlbumSlugIsAvalible,
			getDownloadLinkForTag,
			getLightroomCopyList,
			updateAlbumCoverImage,
			deleteAlbum,
			editLockAlbum,
			editAlbum,
			getImageProcessingStatus,
			imageProcessingStatus,
			getClientSelectionLightRoomCopy,
			clientSelectionLightRoomCopy,
			getScrolledTillEnd,
			downloadImagesForClientSelection,
			editTag,
			deleteTag,
			lightroomCopyList,
			aiFace,
			updateStateValues: updateGalleryStateValues,
		},
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
		profileInfo: { userWorkSpaceList, getTenantSettings, tennantSettingsData },
		templates: { leftSidebarState, updateStateValues },
	} = useContext(Context);
	const [info, setInfo] = useState({
		albumContains: '',
		showOptions: false,
		showGalleryOptions: false,
		shareModal: false,
		showShearch: false,
		showFilter: false,
		selectedImages: [],
		activeLink: 'gallery-overview',
		showForward: false,
		showPin: false,
		showOptionsContainer: false,
		activeTab: location?.state?.openSettings || 'Albums',
		showCreateAlbum: false,
		isMouseInGallery: false,
		showCollaborators: false,
		activeGallery: location?.state?.galleryData,
		isLightGallery: searchkeys.get('lite-gallery') || false,
		activeAlbumId: null,
		callToAction: tenantPreferences?.ctaPreferences?.isEnabled,
		timeout: null,
		galleryDueDate: location?.state?.galleryData?.dueDateEpoch,
		galleryCreatedAt: location?.state?.galleryData?.shotDuring,
		linkUpdateError: '',
		gridStyle: layoutSettings?.layoutSettings?.gridStyle,
		thumbnailSize: layoutSettings?.layoutSettings?.thumbnailSize,
		gridSpacing: layoutSettings?.layoutSettings?.gridSpacing,
		collaboratorsData: collaborators,
		tenantAlbums: tenantAlbums?.albums,
		activeAlbum: {},
		albumSlug: tenantAlbums?.albums?.[0]?.slug,
		albumTagId: '',
		hasMore: true,
		page: 1,
		limit: 40,
		albumTags: albumDetails?.tags,
		isDragging: false,
		draggedImages: [],
		imagesList: imagesList,
		isRearranging: false,
		clientSubscription: tenantPreferences?.allowClientsToSubscribe || false,
		dragPreviewPosition: null,
		insertIndex: null,
		showDeleteAlbum: false,
		selectedImagesTags: [],
		sortType: '',
		crop: {
			x: 0,
			y: 0,
		},
		zoom: {
			desktop: 1,
			mobile: 1,
		},
		uploadImageId: null,
		imageURL: '',
		coverImageDetails: null,
		searchValue: '',
		coverPhoto: false,
		albumFullScreen: false,
		activeClientSelection: clientSelectionsData?.data?.[0]?.slug,
		clientSelectionID: clientSelectionsData?.data?.[0]?._id,
		clientSelectionName: clientSelectionsData?.data?.[0]?.title,
		clientSelectionImages: clientSelectionImages,
		resetInfinityScroll: false,
		showMoveToAlbum: false,
		flexWrap_visible: false,
		tagSearchValue: '',
		albumLoading: false,
		isPublished: tenantAlbums?.albums?.[0]?.isPublished,
		showDragIconOfAlbum: null,
		isOnline: true,
		dragPosition: { x: 0, y: 0 },
		stackOffset: 3,
		dropIndex: null,
		dropPlaceholder: null, // Add this new state
		rearrangingLoading: false,
		totalPayload: [],
		showGalleryPreview: false,
		galleryName: '',
		showMainPopup: false,
		showDatePopup: false,
		showImageDeletePopup: false,
		dateType: '',
		galleryDate: '',
		expiryDate: '',
		showDeletePopup: false,
		showUploadCover: false,
		albumName: '',
		showShareAlbum: false,
		showDownloadAlbum: false,
		activeTagId: null,
		originalDownload: false,
		webviewDownload: true,
		showLightRoomCopy: false,
		lightroomCopyList: [],
		isAlbumCover: false,
		coverType: null,
		isAlbumHidden: false,
		showGalleryStyles: false,
		themeMode: 'dark',
		showCoverButton: false,
		showAlbumOptionsMenu: false,
		showAlbumSettings: false,
		galleryLink: null,
		clientSubscriptionOptions: false,
		imageProcessingStatus: {
			numberOfImagesGroupedFaces: 0,
			numberOfImagesPeoples: 0,
		},
		scrolledTillEnd: false,
		animationProgress: 0,
		isImagesLess: false,
		editTagPopup: false,
		deleteTagPopup: false,
		activeTag: null,
		galleryTagHover: {},
		selectedDropDownValue: 'delete_images',
		tagLoading: false,
		showTagOptions: false,
		selectedFace: null,
		loadingImagesList: null,
		editGallery: false,
		editingTitleValue: '',
		selectedFaceId: null,
		selectedImage: null,
		isGalleryViewer: false,
		currentExpandImage: null,
		currentWorkspaceId: null,
		noImageSelected: false,
		uploadImageLoader: false,
		selectingImages: false,
		videoUploadPopup: false,
		selectVideo: null,
		videosList: null,
		coverLoading: false,
		videoUploaded: false,
		thumbnailUrls: {},
		selectedScreenType: 'desktop',
		selectedAlbumToMove: null,
	});
	const optionsRef = useRef(null);
	const iconRef = useRef(null);
	const galleryOptionsRef = useRef(null);
	const galleryIconRef = useRef(null);
	const filtersRef = useRef(null);
	const filtersOptionsRef = useRef(null);
	const forwardOptionsRef = useRef(null);
	const forwardIconRef = useRef(null);
	const pinIconRef = useRef(null);
	const pinSearchRef = useRef(null);
	const optionsIconRef = useRef(null);
	const optionsContainerRef = useRef(null);
	const fileInputRef = useRef(null);
	const settingsRef = useRef(null);
	const albumSettingsIconRef = useRef(null);
	const albumSettingsRef = useRef(null);
	const containerRef = useRef(null);
	const data = [
		{ name: 'Albums', number: albumImagesCount?.albums?.length },
		{ name: 'Videos', number: tenantAlbums?.embeddedVideos?.length },
		// { name: 'Slide Show', number: 1 },
		{
			name: 'Ai People',
			// number:
			// 	imageProcessingStatus?.numberOfImagesPeoples > 0
			// 		? parseInt(
			// 				(imageProcessingStatus?.numberOfImagesGroupedFaces /
			// 					imageProcessingStatus?.numberOfImagesPeoples) *
			// 					100,
			// 				0,
			// 		  ) + '%'
			// 		: '0',
		},
		{ name: 'Collections', number: clientSelectionsData?.totalDocs || 0 },
		// {
		// 	name: 'breaker',
		// },
		{
			name: 'Insights',
			number: '',
		},
	];

	const galleryOptions = [
		{
			icon: <EditPen style={{ color: 'var(--secondary-font)' }} />,
			label: 'Rename Gallery',
			onClick: () =>
				setInfo((prev) => ({
					...prev,
					showOptions: false,
					showMainPopup: true,
					galleryName: info?.activeGallery?.title || '',
				})),
		},
		{
			icon: <ChangeCalender />,
			label: 'Change Gallery Date',
			onClick: () =>
				setInfo((prev) => ({
					...prev,
					showOptions: false,
					isDatePopup: true,
					dateType: 'galleryDate',
					showMainPopup: true,
					galleryDate:
						moment(prev.galleryCreatedAt, 'YYYYMMDD').format('YYYY-MM-DD') || '',
				})),
		},
		{
			icon: <ChangeCalender />,
			label: 'Change Expiry Date',
			onClick: () =>
				setInfo((prev) => ({
					...prev,
					showOptions: false,
					isDatePopup: true,
					dateType: 'expiryDate',
					showMainPopup: true,
					expiryDate: moment(prev.galleryDueDate).format('YYYY-MM-DD') || '',
				})),
		},
		{
			icon: <BrushIcon />,
			label: 'Change Gallery Cover',
			onClick: () => handleUploadCoverOpen('gallery'),
		},
		{
			icon: <BrushIcon />,
			label: 'Change Gallery Style',
			onClick: () =>
				setInfo((prev) => ({
					...prev,
					showGalleryStyles: true,
				})),
		},
		{
			divider: true,
		},
		{
			icon: <TrashIcon />,
			label: 'Move to Trash',
			onClick: () =>
				setInfo((prev) => ({
					...prev,
					showDeletePopup: true,
					showOptions: false,
				})),
			className: 'delete-option',
		},
	];

	const handleClickOutside = useCallback((event) => {
		const clickOutsideCheck = (ref, iconRef, stateName) => {
			if (
				ref.current &&
				!ref.current?.contains(event.target) &&
				!iconRef.current?.contains(event.target)
			) {
				setInfo((prevInfo) => ({ ...prevInfo, [stateName]: false, tagSearchValue: '' }));
			}
		};

		clickOutsideCheck(optionsRef, iconRef, 'showOptions');
		clickOutsideCheck(galleryOptionsRef, galleryIconRef, 'showGalleryOptions');
		clickOutsideCheck(filtersOptionsRef, filtersRef, 'showFilter');
		clickOutsideCheck(forwardOptionsRef, forwardIconRef, 'showForward');
		clickOutsideCheck(pinSearchRef, pinIconRef, 'showPin');
		clickOutsideCheck(optionsContainerRef, optionsIconRef, 'showOptionsContainer');
		clickOutsideCheck(albumSettingsRef, albumSettingsIconRef, 'showAlbumSettings');
		clickOutsideCheck(optionsContainerRef, optionsIconRef, 'showAlbumOptionsMenu');
	}, []);

	useEffect(() => {
		if (info?.videosList?.length > 0) {
			fetchThumbnails();
		}
	}, [info?.videosList]);

	const fetchThumbnails = async () => {
		const entries = await Promise.all(
			info.videosList.map(async (video) => {
				const url = await getThumbnailUrl(video);
				return [video._id, url];
			}),
		);
		const thumbnailUrls = Object.fromEntries(entries);
		setInfo((prev) => ({ ...prev, thumbnailUrls }));
	};

	const handleScroll = (setInfo, info) => {
		const container = document.querySelector('.galleryContainer');
		if (!container) return;

		const { scrollTop, scrollHeight, clientHeight } = container;

		const isEndOfPage = info?.isRearranging || scrollTop + clientHeight >= scrollHeight - 10;
		const isStartOfPage = scrollTop === 0;

		setInfo((prev) => ({
			...prev,
			scrolledTillEnd: isEndOfPage ? true : isStartOfPage ? false : prev.scrolledTillEnd,
		}));
	};
	useEffect(() => {
		updateStateValues({ leftSidebarState: 'open' });
		return () => {
			updateStateValues({ leftSidebarState: null });
		};
	}, []);

	useEffect(() => {
		if (userWorkSpaceList) {
			const currentWorkspaceId = getCurrentWorkspaceId(userWorkSpaceList);
			setInfo((prev) => ({ ...prev, currentWorkspaceId }));
		}
	}, [userWorkSpaceList]);
	useEffect(() => {
		const animate = (timestamp) => {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / 1000, 1); // 1000ms duration

			setInfo((prev) => ({
				...prev,
				animationProgress: progress,
			}));

			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate);
			}
		};

		if (info?.activeTab === 'Ai People') {
			animationFrame = requestAnimationFrame(animate);
		} else {
			setInfo((prev) => ({
				...prev,
				animationProgress: 0,
			}));
		}

		return () => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
		};
	}, [info?.activeTab]);
	useEffect(() => {
		if (imagesList) {
			const imagesCount = imagesList?.totalDocs || 0;
			setInfo((prev) => {
				if (prev.isImagesLess !== imagesCount < 20) {
					return { ...prev, isImagesLess: imagesCount < 20 };
				}
				return prev;
			});
		}
	}, [imagesList]);

	useEffect(() => {
		if (galleryId) {
			getImageProcessingStatus(galleryId);
		}

		const container = document.querySelector('.galleryContainer');

		if (container) {
			const boundHandleScroll = () => handleScroll(setInfo, info);

			container.addEventListener('scroll', boundHandleScroll);
			boundHandleScroll();

			return () => {
				container.removeEventListener('scroll', boundHandleScroll);
			};
		}
	}, [galleryId]);

	useEffect(() => {
		const childrenContainer = document.querySelector('.childrenContainer');
		if (childrenContainer) {
			const originalWidth = childrenContainer.style.maxWidth;
			childrenContainer.style.maxWidth = '85vw';
			return () => {
				childrenContainer.style.maxWidth = originalWidth;
			};
		}
	}, []);

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [handleClickOutside]);

	useEffect(() => {
		if (!clientSelectionsData) {
			getClientSelections(galleryId);
		}
		if (clientSelectionsData) {
			setInfo((prevInfo) => ({
				...prevInfo,
				activeClientSelection: clientSelectionsData?.data?.[0]?.slug,
				clientSelectionID: clientSelectionsData?.data?.[0]?._id,
				clientSelectionName: clientSelectionsData?.data?.[0]?.title,
			}));
		}
	}, [clientSelectionsData]);

	useEffect(() => {
		if (!galleryCredentials) {
			getGalleryCredentials(galleryId);
		}
	}, [galleryCredentials]);

	useEffect(() => {
		if (info?.activeTab === 'Collections' && info?.clientSelectionID) {
			getClientSelectionImages(info?.clientSelectionID);
		}
	}, [info?.clientSelectionID, info?.activeTab]);

	useEffect(() => {
		if (clientSelectionImages) {
			setInfo((prev) => ({
				...prev,
				clientSelectionImages: clientSelectionImages,
			}));
		}
	}, [clientSelectionImages]);

	useEffect(() => {
		if (galleryId) {
			getAlbumImagesCount(galleryId);
		}
	}, [galleryId]);
	useEffect(() => {
		return () => {
			updateGalleryStateValues({
				tenantAlbums: null,
				albumImagesCount: null,
				galleryCredentials: null,
				albumDetails: null,
				imagesList: null,

				imageDetail: null,
				galleryGuestAccess: null,

				clientSelectionsData: null,
				clientSelectionImages: null,
				aiFace: null,
				aiFaceImages: null,
			});
		};
	}, []);
	useEffect(() => {
		if (albumImagesCount) {
			setInfo((prev) => ({
				...prev,
				activeGallery: albumImagesCount,
				galleryDueDate: albumImagesCount?.dueDateEpoch,
				galleryCreatedAt: albumImagesCount?.shotDuring,
				isOnline: albumImagesCount?.isPublished,
			}));
		}
	}, [albumImagesCount]);
	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			activeGallery: location?.state?.galleryData,
		}));
		return () => {
			setInfo((prev) => ({
				...prev,
				activeGallery: null,
			}));
		};
	}, [galleryId]);
	useEffect(() => {
		if (!tenantAlbums || tenantAlbums?._id !== galleryId) {
			getAlbums(galleryId).then((response) => {
				if (response?.[0] === 404 && response?.[1]?.message === 'gallery not found') {
					navigate('/galleries');
				}
			});
		}
		if (!tenantPreferences || tenantPreferences?._id !== galleryId) {
			getEditPreferences(galleryId);
		}
		if (tenantPreferences) {
			setInfo((prevInfo) => ({
				...prevInfo,
				canClientDownloadOriginals: tenantPreferences?.canClientDownloadOriginals,
				canClientDownloadOptimized: tenantPreferences?.canClientDownloadOptimized,
				canGuestDownloadOptimized: tenantPreferences?.canGuestDownloadOptimized,
				canGuestDownloadOriginals: tenantPreferences?.canGuestDownloadOriginals,
				callToAction: tenantPreferences?.ctaPreferences?.isEnabled,
				ctaLink: tenantPreferences?.ctaPreferences?.ctaLink,
				clientSubscription: tenantPreferences?.allowClientsToSubscribe || false,
			}));
		}

		// Only set the active album if it's not already set
		if (tenantAlbums && galleryId) {
			setInfo((prev) => ({
				...prev,
				albumName: tenantAlbums?.albums?.[0]?.title,
				activeAlbumId: tenantAlbums?.albums?.[0]?._id,
				activeAlbum: tenantAlbums?.albums?.[0],
				tenantAlbums: tenantAlbums?.albums,
				albumSlug: tenantAlbums?.albums?.[0]?.slug,
				isPublished: tenantAlbums?.isPublished,
				isOnline: tenantAlbums?.isPublished,
				videosList: tenantAlbums?.embeddedVideos,
				selectVideo: info?.videoUploaded
					? tenantAlbums?.embeddedVideos?.[tenantAlbums?.embeddedVideos?.length - 1]
					: tenantAlbums?.embeddedVideos?.[0],
			}));
		}
		if (tenantAlbums && galleryId && !info?.selectVideo) {
			setInfo((prev) => ({
				...prev,
				selectVideo: tenantAlbums?.embeddedVideos?.[0],
			}));
		}
		// ... rest of the effect
	}, [tenantPreferences, galleryId, tenantAlbums]);

	useEffect(() => {
		if (updateActiveAlbum !== null && updateActiveAlbum !== info?.activeAlbum) {
			let updatedArray = info?.tenantAlbums?.map((album) => {
				if (album?._id === updateActiveAlbum?._id) {
					return updateActiveAlbum;
				}
				return album;
			});

			setInfo((prev) => ({
				...prev,
				albumName: updateActiveAlbum?.title,
				activeAlbum: updateActiveAlbum,
				tenantAlbums: updatedArray,
			}));
		}
	}, [updateActiveAlbum]);

	// useEffect(() => {
	// 	if (tenantAlbums?.albums?.[0]?.title) {
	// 		getAlbumCount(galleryId, tenantAlbums?.albums?.[0]?._id);
	// 	}
	// }, [tenantAlbums?.albums?.[0]?.title]);
	useEffect(() => {
		if (!layoutSettings) {
			getLayoutSettings(galleryId);
		}
		if (layoutSettings) {
			setInfo((prev) => ({
				...prev,
				gridStyle: layoutSettings?.layoutSettings?.gridStyle,
				thumbnailSize: layoutSettings?.layoutSettings?.thumbnailSize,
				gridSpacing: layoutSettings?.layoutSettings?.gridSpacing,
				themeMode: layoutSettings?.theme || 'dark',
			}));
		}
	}, [layoutSettings]);

	useEffect(() => {
		if (!collaborators) {
			getCollaborators(galleryId);
		}
		if (collaborators) {
			setInfo((prev) => ({
				...prev,
				collaboratorsData: collaborators,
			}));
		}
	}, [collaborators]);

	useEffect(() => {
		if (info?.activeAlbumId) {
			getAlbumCount(galleryId, info?.activeAlbumId);
		}
		if (albumDetails) {
			setInfo((prev) => ({
				...prev,
				albumTags: albumDetails?.tags,
			}));
		}
	}, [info?.activeAlbumId]);

	useEffect(() => {
		if (info?.albumTagId && info?.activeAlbumId && info?.activeTab === 'Albums' && galleryId) {
			handleGetGalleryImages();
		}
	}, [info?.albumTagId, info?.activeAlbumId, info?.activeTab, galleryId]);

	const handleGetGalleryImages = async () => {
		if (info?.albumTagId && info?.activeAlbumId && info?.activeTab === 'Albums' && galleryId) {
			setInfo((prev) => ({
				...prev,
				loadingImagesList: true,
			}));
			const response = await getGalleryImages(
				galleryId,
				info?.activeAlbumId,
				info?.albumTagId,
				info?.page,
				info?.limit,
				'',
				true,
			);
			if (response?.[0] === true) {
				// checkAndSetDefaultCovers(response?.[1]?.docs?.[0]);
			}
			setInfo((prev) => ({
				...prev,
				loadingImagesList: false,
			}));
		}
	};

	useEffect(() => {
		if (imagesList) {
			setInfo((prev) => ({
				...prev,
				imagesList: imagesList,
			}));
		}
	}, [imagesList]);

	useEffect(() => {
		if (!albumDetails) return;
		if (albumDetails) {
			setInfo((prev) => ({
				...prev,
				albumTags: albumDetails?.tags,
			}));
		}
	}, [albumDetails]);

	useEffect(() => {
		if (!info.albumTags) return;
		setInfo((prev) => ({
			...prev,
			albumContains: info?.albumTags?.[0]?.displayName,
			albumTagId: info?.albumTags?.[0]?._id,
			sortType: info?.albumTags?.[0]?.sortType,
		}));
	}, [info?.albumTags]);
	useEffect(() => {
		const imageSearchKey = searchkeys.get('uploadImageId') || null;

		// if image detail is upload image id
		if (imageDetail?._id === info?.uploadImageId && galleryCredentials) {
			const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
			const src = `${galleryCredentials?.baseURL}/${imageDetail?.activeVersion?.s3_optimized?.key}?${params}`;
			setInfo((prev) => ({
				...prev,
				imageURL: src,
			}));
		}

		if (
			albumImagesCount?.coverImage?._id &&
			galleryCredentials &&
			!imageDetail &&
			!imageSearchKey
		) {
			const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
			const src = `${galleryCredentials?.baseURL}/${tenantAlbums?.tenant_id}/${galleryId}/optimized/${albumImagesCount?.coverImage?.givenFileName}?${params}`;
			setInfo((prev) => ({
				...prev,
				imageURL: src,
				coverPhoto: true,
				crop: {
					x: albumImagesCount?.coverImage?.xPosition,
					y: albumImagesCount?.coverImage?.yPosition,
				},
				zoom: albumImagesCount?.coverImage?.zoom || 1,
			}));
		}
	}, [imageDetail, info?.uploadImageId, albumImagesCount]);

	useEffect(() => {
		if (!document.querySelector('.albums')) return;

		if (info.albumFullScreen) {
			// Open: wrap into multiple rows over 0.3s
			gsap.to('.albums', {
				flexWrap: 'wrap',
				duration: 0.3,
				ease: 'power2.out',
			});
		} else {
			// Close: remove wrap (back to single row) over 0.3s, without that extra 0.4s delay
			gsap.to('.albums', {
				flexWrap: 'nowrap',
				duration: 0.3,
				ease: 'power2.out',
			});
		}
	}, [info.albumFullScreen]);

	useEffect(() => {
		if (location?.state?.from === 'albumSettings') {
			const activeAlbum = tenantAlbums?.albums?.find(
				(album) => album?._id === location?.state?.activeAlbumId,
			);
			setInfo((prev) => ({
				...prev,
				albumSlug: activeAlbum?.slug,
				albumName: activeAlbum?.title,
				activeAlbumId: activeAlbum?._id,
				activeAlbum: activeAlbum,
				tenantAlbums: tenantAlbums?.albums,
			}));
		}
	}, [location?.state?.from]);

	useEffect(() => {
		if (updateActiveAlbum !== null && updateActiveAlbum !== info?.activeAlbum) {
			let updatedArray = info?.tenantAlbums?.map((album) => {
				if (album._id === updateActiveAlbum._id) {
					return updateActiveAlbum;
				}
				return album;
			});

			setInfo((prev) => ({
				...prev,
				albumName: updateActiveAlbum?.title,
				activeAlbum: updateActiveAlbum,
				tenantAlbums: updatedArray,
			}));
		}
	}, [updateActiveAlbum]);

	useEffect(() => {
		if (albumDetails?.tags?.length > 0) {
			setInfo((prev) => ({
				...prev,
				activeTagId: albumDetails.tags[0]._id,
			}));
		}
	}, [albumDetails]);
	useEffect(() => {
		if (info.activeAlbumId && tenantAlbums?.albums) {
			const activeAlbum = tenantAlbums.albums.find(
				(album) => album._id === info.activeAlbumId,
			);
			if (activeAlbum) {
				setInfo((prev) => ({
					...prev,
					isPublished: activeAlbum.isPublished,
					activeAlbum: activeAlbum,
				}));
			}
		}
	}, [info.activeAlbumId, tenantAlbums]);

	useEffect(() => {
		if (info.showUploadCover) {
			const coverUrl = getCoverImageUrl();
			setInfo((prev) => ({
				...prev,
				imageURL: coverUrl,
			}));
		}
	}, [info.showUploadCover, info.coverType]);

	useEffect(() => {
		if (userWorkSpaceList) {
			const currentWorkspaceId = getCurrentWorkspaceId(userWorkSpaceList);
			setInfo((prev) => ({ ...prev, currentWorkspaceId }));
		}
	}, [userWorkSpaceList]);
	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
	}, [tennantSettingsData]);
	useEffect(() => {
		if (info?.currentWorkspaceId && tennantSettingsData) {
			let galleryLink = `https://${info?.currentWorkspaceId}.ve.ai/gallery/${info?.activeGallery?.slug}`;
			if (tennantSettingsData?.customDomain) {
				galleryLink = `https://${tennantSettingsData?.customDomain}/gallery/${info?.activeGallery?.slug}`;
			}
			setInfo((prev) => ({ ...prev, galleryLink }));
		}
	}, [info?.currentWorkspaceId, tennantSettingsData, info?.activeGallery]);

	useEffect(() => {
		if (!location?.state?.returnFromViewer) return;

		const galleryLocation = location.pathname;
		const {
			activeAlbumId: returnedAlbumId,
			activeTagId: returnedTagId,
			activeTab: returnedActiveTab,
			selectedFace: returnedSelectedFace,
			selectedFaceId: returnedSelectedFaceId,
			selectedImage,
		} = location.state;

		if (returnedActiveTab === 'Ai People') {
			setInfo((prev) => ({
				...prev,
				activeTab: 'Ai People',
				activeAlbumId: returnedAlbumId || prev.activeAlbumId,
				activeTagId: returnedTagId || prev.activeTagId,
				selectedFace: returnedSelectedFace || prev.selectedFace,
				selectedFaceId: returnedSelectedFaceId || prev.selectedFaceId,
				selectedImage: selectedImage || prev.selectedImage,
			}));
		} else if (tenantAlbums?.albums && returnedAlbumId) {
			const activeAlbum = tenantAlbums.albums.find(({ _id }) => _id === returnedAlbumId);

			if (activeAlbum) {
				setInfo((prev) => ({
					...prev,
					activeTab: 'Albums',
					albumName: activeAlbum.title,
					activeAlbumId: activeAlbum._id,
					activeAlbum: activeAlbum,
					albumSlug: activeAlbum.slug,
					albumTagId: returnedTagId || prev.albumTagId,
					selectedImage: selectedImage || prev.selectedImage,
				}));
			}
		}

		// Retry scrolling until the element is available
		const scrollToImage = () => {
			const imageElement = document.querySelector(`[data-image-id="${selectedImage}"]`);
			if (imageElement) {
				setTimeout(() => {
					imageElement.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});
					// Optionally highlight the image temporarily
					imageElement.classList.add('highlight');
					setTimeout(() => imageElement.classList.remove('highlight'), 2000);
				}, 100);
			} else if (
				document.images.length < document.querySelectorAll('.imageContainer').length
			) {
				// If images are still loading, retry
				setTimeout(scrollToImage, 100);
			}
		};

		if (selectedImage) {
			scrollToImage();
		}
		navigate(galleryLocation, { replace: true });
	}, [location?.state?.returnFromViewer, tenantAlbums?.albums]);

	useEffect(() => {
		// Get initial values from URL params
		const searchParams = new URLSearchParams(location.search);
		const albumIdFromParams = searchParams.get('albumId');
		const activeTabFromParams = searchParams.get('activeTab');

		// Set initial state based on URL params or defaults
		if (tenantAlbums?.albums && albumIdFromParams) {
			const albumFromParams = tenantAlbums.albums.find(
				(album) => album._id === albumIdFromParams,
			);
			if (albumFromParams) {
				setInfo((prev) => ({
					...prev,
					albumName: albumFromParams.title,
					activeAlbumId: albumFromParams._id,
					activeAlbum: albumFromParams,
					albumSlug: albumFromParams.slug,
					isPublished: albumFromParams.isPublished,
				}));
			}
		}

		if (
			activeTabFromParams &&
			['Albums', 'Videos', 'Collections', 'Ai People', 'Insights'].includes(
				activeTabFromParams,
			)
		) {
			setInfo((prev) => ({
				...prev,
				activeTab: activeTabFromParams,
			}));
		}
	}, [tenantAlbums?.albums, location.search]);

	// Update URL params when album or tab changes
	useEffect(() => {
		if (info.activeAlbumId || info.activeTab) {
			const searchParams = new URLSearchParams(location.search);

			if (info.activeAlbumId) {
				searchParams.set('albumId', info?.activeAlbumId);
			}

			if (info.activeTab) {
				searchParams.set('activeTab', info.activeTab);
			}

			// Update URL without causing a navigation/reload
			const newUrl = `${location.pathname}?${searchParams.toString()}`;
			window.history.replaceState(null, '', newUrl);
		}
	}, [info.activeAlbumId, info.activeTab, location.pathname]);

	// const checkAndSetDefaultCovers = async (firstImage) => {
	// 	try {
	// 		const firstImageId = firstImage?._id;
	// 		let updatesNeeded = false;

	// 		// Check if gallery needs a cover
	// 		if (!info?.activeGallery?.coverImage?.givenFileName && firstImage) {
	// 			const payload = {
	// 				image_id: firstImageId,
	// 				xPosition: 0,
	// 				yPosition: 0,
	// 				givenFileName: firstImage?.activeVersion?.givenFileName,
	// 				width: 100,
	// 				height: 100,
	// 				zoom: 1,
	// 			};

	// 			const galleryCoverResponse = await updateGalleryCoverImage(payload, galleryId);

	// 			if (galleryCoverResponse?.[0] === true) {
	// 				updatesNeeded = true;
	// 				showMessage('success', 'Gallery cover has been automatically set');
	// 			} else {
	// 				showMessage(
	// 					'error',
	// 					'Failed to set gallery cover image',
	// 					checkAndSetDefaultCovers(firstImage),
	// 				);
	// 			}
	// 		}

	// 		// Check if album needs a cover
	// 		if (
	// 			info?.activeAlbum?._id &&
	// 			!info?.activeAlbum?.coverImage?.givenFileName &&
	// 			firstImage
	// 		) {
	// 			const payload = {
	// 				image_id: firstImage._id,
	// 				xPosition: 0,
	// 				yPosition: 0,
	// 				givenFileName: firstImage.activeVersion.givenFileName,
	// 				width: 100,
	// 				height: 100,
	// 				zoom: 1,
	// 			};

	// 			const albumCoverResponse = await updateAlbumCoverImage(
	// 				payload,
	// 				galleryId,
	// 				info.activeAlbum._id,
	// 			);

	// 			if (albumCoverResponse?.[0] === true) {
	// 				updatesNeeded = true;
	// 				showMessage('success', 'Album cover has been automatically set');
	// 			} else {
	// 				showMessage('error', 'Failed to set album cover image');
	// 			}
	// 		}

	// 		// If we made updates, refresh the data
	// 		if (updatesNeeded) {
	// 			await getAlbums(galleryId);
	// 			await getAlbumImagesCount(galleryId);
	// 		}

	// 		setInfo((prev) => ({
	// 			...prev,
	// 			loadingImagesList: undefined,
	// 		}));
	// 	} catch (error) {
	// 		console.error('Error setting default covers:', error);
	// 		showMessage('error', 'Failed to set cover images');
	// 	}
	// };

	// useEffect(() => {
	// 	if (
	// 		imagesList?.docs?.length > 0 &&
	// 		(!info?.activeGallery?.coverImage?.givenFileName ||
	// 			(info?.activeAlbum?._id && !info?.activeAlbum?.coverImage?.givenFileName))
	// 	) {
	// 		checkAndSetDefaultCovers();
	// 	}
	// }, [info?.imagesList?.docs]);
	const fetchMoreImages = () => {
		const nextPage = info.page + 1;
		getGalleryImages(
			galleryId,
			info?.activeAlbumId,
			info?.albumTagId,
			nextPage,
			info?.limit,
		).then(() => {
			setInfo((prev) => ({
				...prev,
				page: nextPage,
				hasMore: imagesList?.hasNextPage || false,
			}));
		});
	};

	const fetchMoreClientSelectionImages = () => {
		const nextPage = info.page + 1;
		getClientSelectionImages(info?.clientSelectionID, nextPage).then(() => {
			setInfo((prev) => ({
				...prev,
				page: nextPage,
				hasMore: clientSelectionImages?.hasNextPage || false,
			}));
		});
	};

	const handleHideAlbum = async () => {
		try {
			// Store current active album details before making any changes
			const currentAlbumId = info?.activeAlbumId;
			const currentAlbum = info?.activeAlbum;

			const payload = {
				isPublished: !currentAlbum?.isPublished,
			};

			const response = await editAlbumName(payload, galleryId, currentAlbumId);

			if (response?.[0] === true) {
				// Update state while preserving the active album
				setInfo((prev) => ({
					...prev,
					activeAlbum: {
						...currentAlbum,
						isPublished: !currentAlbum?.isPublished,
					},
					activeAlbumId: currentAlbumId, // Ensure this stays the same
					tenantAlbums: (Array.isArray(prev?.tenantAlbums) ? prev?.tenantAlbums : []).map(
						(album) =>
							album?._id === currentAlbumId
								? { ...album, isPublished: !currentAlbum?.isPublished }
								: album,
					),
					activeTab: prev?.activeTab,
					showGalleryOptions: false,
					showOptionsContainer: true,
				}));

				// Refresh data without changing the active album
				Promise.all([getAlbumImagesCount(galleryId), getAlbums(galleryId)]);

				showMessage('success', 'Album visibility updated successfully');
			} else {
				showMessage('error', 'Failed to update album visibility', handleHideAlbum);
			}
		} catch (error) {
			console.error('Error updating album visibility:', error);
			showMessage('error', 'An error occurred while updating album visibility');
		}
	};

	const handleDeselect = () => {
		setInfo((prev) => ({
			...prev,
			selectedImages: [],
		}));
	};
	const handleLockAlbum = useCallback(async () => {
		const newGuestAccessState = !info?.activeAlbum?.guestAccess?.isEnabled;

		// First update state optimistically
		setInfo((prev) => ({
			...prev,
			activeAlbum: {
				...prev?.activeAlbum,
				guestAccess: {
					...prev?.activeAlbum?.guestAccess,
					isEnabled: newGuestAccessState,
				},
			},
			tenantAlbums: prev?.tenantAlbums?.map((album) =>
				album?._id === prev?.activeAlbumId
					? {
							...album,
							guestAccess: {
								...album.guestAccess,
								isEnabled: newGuestAccessState,
							},
					  }
					: album,
			),
			albumImagesCount: {
				...prev.albumImagesCount,
				albums: prev?.albumImagesCount?.albums?.map((album) =>
					album?._id === prev?.activeAlbumId
						? {
								...album,
								guestAccess: {
									...album?.guestAccess,
									isEnabled: newGuestAccessState,
								},
						  }
						: album,
				),
			},
		}));

		try {
			const payload = {
				isEnabled: newGuestAccessState,
			};

			// Wait for the edit operation to complete
			const response = await editLockAlbum(payload, galleryId, info.activeAlbumId);

			if (response?.[0] === true) {
				showMessage('success', 'Album access updated successfully');
			} else {
				// If the update failed, revert the optimistic update
				setInfo((prev) => ({
					...prev,
					activeAlbum: {
						...prev?.activeAlbum,
						guestAccess: {
							...prev?.activeAlbum?.guestAccess,
							isEnabled: !newGuestAccessState,
						},
					},
					// ... similar reversions for tenantAlbums and albumImagesCount
				}));
				showMessage('error', 'Failed to update album access', handleLockAlbum);
			}
		} catch (error) {
			console.error('Error updating album access:', error);
			showMessage('error', 'An error occurred while updating album access', handleLockAlbum);
		}
	}, [galleryId, info?.activeAlbumId, info?.activeAlbum?.guestAccess?.isEnabled]);

	const handleOnlineToggle = useCallback(async () => {
		const newOnlineState = !info?.isOnline;

		// Show loading message
		// const id = message.loading('Updating gallery status...');

		try {
			const galleryPayload = {
				isPublished: newOnlineState,
			};

			setInfo((prev) => ({
				...prev,
				isOnline: newOnlineState,
				isPublished: newOnlineState,
				tenantAlbums: {
					...prev?.tenantAlbums,
					albums: (prev?.tenantAlbums?.albums || [])?.map((album) => ({
						...album,
						isPublished: newOnlineState,
					})),
				},
			}));

			const response = await postGallery(galleryPayload, galleryId);

			// message.destroy(id);

			if (response?.[0]) {
				await getAlbums(galleryId);
				message.destroy();
				showMessage('success', `Gallery is now ${newOnlineState ? 'online' : 'offline'}`);
			} else {
				setInfo((prev) => ({
					...prev,
					isOnline: !newOnlineState,
					isPublished: !newOnlineState,
					tenantAlbums: {
						...prev?.tenantAlbums,
						albums: (prev?.tenantAlbums?.albums || [])?.map((album) => ({
							...album,
							isPublished: !newOnlineState,
						})),
					},
				}));
				message.error({
					content: response?.[1]?.message || 'Failed to update gallery status',
					key: 'galleryUpdate',
				});
			}
		} catch (error) {
			// Revert state on error
			setInfo((prev) => ({
				...prev,
				isOnline: !newOnlineState,
				isPublished: !newOnlineState,
				tenantAlbums: {
					...prev?.tenantAlbums,
					albums: (prev?.tenantAlbums?.albums || [])?.map((album) => ({
						...album,
						isPublished: !newOnlineState,
					})),
				},
			}));

			console.error('Error updating gallery status:', error);
			message.destroy();
			showMessage('error', 'Failed to update gallery status', handleOnlineToggle);
		}
	}, [info.isOnline, galleryId, tenantAlbums?.albums]);

	// ... rest of the code ...
	const handleImageSelect = (index, images) => {
		if (images?.isPlaceholderImg) {
			return;
		}
		setInfo((prevInfo) => {
			const isDeselecting = prevInfo?.selectedImages?.includes(images?._id);
			const newSelectedImages = isDeselecting
				? prevInfo?.selectedImages?.filter((i) => i !== images?._id)
				: [...prevInfo?.selectedImages, images?._id];

			// Handle tags differently for client selections vs regular albums
			let newSelectedImagesTags;
			if (info.activeTab === 'Collections') {
				// For client selections, don't process tags
				newSelectedImagesTags = prevInfo?.selectedImagesTags || [];
			} else {
				// For regular albums, process tags as before
				if (isDeselecting) {
					const remainingImages = info?.imagesList?.docs?.filter(
						(img) => newSelectedImages?.includes(img?._id) && img?._id !== images?._id,
					);
					newSelectedImagesTags = [
						...new Set(
							remainingImages
								?.filter((img) => img?.galleryTags) // Add null check
								?.flatMap((img) => img?.galleryTags)
								?.map((tag) => tag?._id),
						),
					];
				} else {
					newSelectedImagesTags = [
						...new Set([
							...(prevInfo?.selectedImagesTags || []),
							...(images?.galleryTags?.map((tag) => tag?._id) || []), // Add null check
						]),
					];
				}
			}

			return {
				...prevInfo,
				selectedImages: newSelectedImages,
				selectedImagesTags: newSelectedImagesTags,
				coverPhoto: newSelectedImages?.length > 0 ? newSelectedImages[0] : null,
			};
		});
	};

	const handleEditTag = async (tagId, name) => {
		if (info?.tagLoading) return;
		setInfo((prev) => ({
			...prev,
			tagLoading: true,
		}));
		const response = await editTag(galleryId, tagId, {
			displayName: name,
		});

		if (response?.[0]) {
			showMessage('success', 'Tag updated successfully');
			getGalleryTagsList(galleryId);
			setInfo((prev) => ({
				...prev,
				albumTags: prev?.albumTags?.map((tag) =>
					tag?._id === tagId ? { ...tag, displayName: name } : tag,
				),
				tagLoading: false,
			}));
		} else {
			showMessage('error', 'Failed to update tag', () => handleEditTag(tagId, name));
		}

		setInfo((prev) => ({
			...prev,
			editTagPopup: false,
		}));
	};

	const handleDeleteTag = async (tagId, albumSlug) => {
		if (info?.tagLoading) return;
		setInfo((prev) => ({
			...prev,
			tagLoading: true,
		}));
		const response = await deleteTag(galleryId, tagId, albumSlug, info?.selectedDropDownValue);
		if (response?.[0]) {
			showMessage('success', response?.[1]?.message);
			getGalleryTagsList(galleryId);
			setInfo((prev) => ({
				...prev,
				albumTags: prev?.albumTags?.filter((tag) => tag?._id !== tagId),
				albumTagId: prev?.albumTags?.[0]?._id,
				albumContains: prev?.albumTags?.[0]?.displayName,
				tagLoading: false,
			}));
		} else {
			showMessage('error', response?.[1]?.message, () => handleDeleteTag(tagId, albumSlug));
		}

		setInfo((prev) => ({
			...prev,
			deleteTagPopup: false,
		}));
	};

	const handleDeleteTypeChange = (e) => {
		setInfo((prev) => ({
			...prev,
			selectedDropDownValue: e.target.value,
		}));
	};

	const handleNewAlbumCreated = async (newAlbum) => {
		try {
			// Wait for albums to be fetched
			await getAlbums(galleryId);
			// Update state after albums are fetched
			setInfo((prev) => ({
				...prev,
				activeTab: 'Albums',
				albumSlug: newAlbum?.albumSlug,
				albumName: newAlbum?.title,
				activeAlbumId: newAlbum?.album_id,
				activeAlbum: newAlbum,
			}));
			const searchParams = new URLSearchParams(location.search);
			searchParams.set('albumId', newAlbum?.album_id);

			navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
			await getAlbumImagesCount(galleryId);
		} catch (error) {
			console.error('Error updating albums:', error);
			message.error('Failed to update albums list');
		}
	};

	const handleClickAlbum = (album, name) => {
		const value =
			name === 'albumName'
				? album?.title !== info?.albumName
				: album?.displayName !== info?.albumContains;
		if (value) {
			setInfo((prevInfo) => ({
				...prevInfo,
				albumLoading: true,
				showGalleryOptions: false,
				showOptions: false,
			}));
		}
		if (name === 'albumName' && album?.title !== info?.albumName) {
			setInfo((prevInfo) => ({
				...prevInfo,
				imagesList: {
					...prevInfo.imagesList,
					docs: [],
				},
				page: prevInfo.page !== 1 ? 1 : prevInfo.page,
				albumName: album?.title,
				activeAlbumId: album?._id,
				activeAlbum: album,
				isPublished: album?.isPublished,
				isEnabled: album?.isEnabled,
				albumSlug: album?.slug,
				resetInfinityScroll: !prevInfo.resetInfinityScroll,
				activeTab: 'Albums',
				isRearranging: false,
				showMainPopup: false,
				tenantAlbums: Array.isArray(prevInfo?.tenantAlbums)
					? prevInfo.tenantAlbums.map((existingAlbum) =>
							existingAlbum._id === album._id
								? { ...existingAlbum, title: album.title }
								: existingAlbum,
					  )
					: [],
			}));
			getAlbumImagesCount(galleryId);
			// if (info?.albumName !== album?.title) {
			// 	getAlbumCount(galleryId, album?.title);
			// }
		} else if (name === 'containName' && album?.displayName !== info?.albumContains) {
			setInfo((prevInfo) => ({
				...prevInfo,
				imagesList: {
					...prevInfo.imagesList,
					docs: [],
				},
				page: prevInfo.page !== 1 ? 1 : prevInfo.page,
				albumContains: album?.displayName,
				albumTagId: album?._id,
				sortType: album?.sortType,

				selectedImages: [],
				isRearranging: false,
			}));
		} else if (name === 'clientSelection') {
			setInfo((prevInfo) => ({
				...prevInfo,
				activeClientSelection: album?.slug,
				clientSelectionID: album?._id,
				clientSelectionName: album?.title,
				isRearranging: false,
			}));
		}
		setTimeout(() => {
			setInfo((prevInfo) => ({
				...prevInfo,
				albumLoading: false,
			}));
		}, 1000);
	};

	const handleAlbumSettings = (sectionId) => {
		navigate(`/galleries/${galleryId}/${info?.activeAlbumId}/album-settings`, {
			state: { sectionId, activeAlbumId: info?.activeAlbumId },
		});
	};
	const openShareModal = () => {
		if (info.isOnline) {
			setInfo((prevInfo) => ({ ...prevInfo, shareModal: !prevInfo.shareModal }));
		} else {
			showMessage('error', 'Publish the Gallery To Share', openShareModal);
		}
	};
	const handleClearSelectedImages = () => {
		setInfo((prevInfo) => ({ ...prevInfo, selectedImages: [], showAlbumOptionsMenu: false }));
	};
	const handleExpandClick = (selectedImageId = null, type) => {
		if (type === 'single' || info?.selectedImages?.length === 1) {
			setInfo((prev) => ({
				...prev,
				currentExpandImage: selectedImageId,
				isGalleryViewer: true,
			}));
		} else {
			setInfo((prev) => ({
				...prev,
				isGalleryViewer: true,
			}));
		}
	};

	const scrollToSection = (sectionId) => {
		setInfo((prevInfo) => ({ ...prevInfo, activeLink: sectionId }));
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};
	const handleForwardIcon = () => {
		setInfo((prevInfo) => ({ ...prevInfo, showForward: !prevInfo.showForward }));
	};
	const handlePinIcon = () => {
		if (!tagsList) {
			getGalleryTagsList(galleryId);
		}
		setInfo((prevInfo) => ({ ...prevInfo, showPin: !prevInfo.showPin }));
	};
	const handleOptionsIcon = () => {
		setInfo((prevInfo) => ({
			...prevInfo,
			showAlbumOptionsMenu: !prevInfo?.showAlbumOptionsMenu,
		}));
	};
	// ... existing code ...

	const handleClickContent = (name) => {
		// Clear search params and image details
		const params = new URLSearchParams(location.search);
		params.set('activeTab', name);

		// This assumes you're using react-router-dom v6+
		navigate(`${location.pathname}?${params.toString()}`, { replace: true });

		const searchKey = searchkeys.get('uploadImageId');
		if (searchKey) {
			setsearchkeys({});
		}
		getImageDetail(null, true, false);

		// Update state with new tab
		// if (count === 0) return;
		setInfo((prevInfo) => ({
			...prevInfo,
			activeTab: name,
			activeLink: 'gallery-overview',
			page: 1,
			uploadImageId: null,
			selectedImages:
				location?.state?.returnFromViewer && location?.state?.selectedImage
					? [location?.state?.selectedImage]
					: [],
			imagesList: {
				...prevInfo.imagesList,
				docs: [],
			},
			clientSelectionImages: {
				docs: [],
				hasNextPage: false,
				page: 1,
			},
		}));
	};

	// ... rest of the code ...

	const handleNavigateUpload = () => {
		const region = localStorage.getItem('region');
		const uploadUrl = `/galleries/${galleryId}/${info?.activeAlbumId}/upload-photos${
			region === 'us-east-1' ? '-desktop' : ''
		} ?light-gallery=${info?.isLightGallery ? true : false}${
			info?.albumContains !== 'All' ? `&tag=${info?.albumContains}` : ''
		}`;
		navigate(uploadUrl);
	};

	const handleCallToAction = useCallback(() => {
		const payload = {
			ctaPreferences: {
				isEnabled: !info.callToAction,
			},
		};
		editPreferences(galleryId, payload);
		setInfo((prevInfo) => ({
			...prevInfo,
			callToAction: !info?.callToAction,
		}));
	}, [getEditPreferences, info.callToAction]);

	const handleClientSubscription = useCallback(
		(value) => {
			setInfo((prev) => ({
				...prev,
				clientSubscription: value,
			}));
			const payload = {
				allowClientsToSubscribe: value,
			};
			editPreferences(galleryId, payload);
		},
		[getEditPreferences, info?.clientSubscription],
	);

	const handleLinkChange = useCallback(
		(e) => {
			const value = e.target.value;
			setInfo((prev) => ({
				...prev,
				callToAction: {
					...prev?.callToAction,
					link: value,
				},
			}));
			handleDebouceFunctionCall(updatePreferences, value);
		},
		[info?.callToAction?.link],
	);
	// ... existing code ...

	const handleGalleryChange = useCallback(
		async (value) => {
			// If already processing or no value change, return early
			if (handleGalleryChange.isProcessing || value === info?.activeGallery?.title) {
				return false;
			}

			// Validate input length
			if (value.length > 255) {
				showMessage('warning', 'Gallery name is too long');
				return false;
			}

			// Set processing flag
			handleGalleryChange.isProcessing = true;

			try {
				// const id = message.loading('Renaming gallery...');

				const payload = {
					title: value,
				};

				// Make single API call
				const response = await postGallery(payload, galleryId);

				if (response?.[0]) {
					// Update UI state directly without additional API call
					setInfo((prev) => {
						// message.destroy(id);

						return {
							...prev,
							activeGallery: {
								...prev.activeGallery,
								title: value,
							},
							showMainPopup: false,
						};
					});

					showMessage('success', 'Gallery renamed successfully');
				} else {
					showMessage(
						'error',
						response?.[1]?.message || 'Failed to rename gallery',
						handleGalleryChange,
					);
				}
			} catch (error) {
				console.error('Error renaming gallery:', error);
				showMessage('error', 'An unexpected error occurred', handleGalleryChange);
			} finally {
				handleGalleryChange.isProcessing = false;
			}
		},
		[galleryId, info.activeGallery?.title],
	);

	// Initialize the processing flag
	handleGalleryChange.isProcessing = false;

	const updateGallery = async (name) => {
		// If already processing, return early
		if (updateGallery.isProcessing) return;

		// Set processing flag
		updateGallery.isProcessing = true;

		try {
			const response = await postGallery({ title: name }, galleryId);

			if (response?.[0] === true) {
				showMessage('success', 'Gallery renamed successfully');
				await getGalleries({}, true);
			} else {
				showMessage('error', 'Failed to rename gallery', () => updateGallery(name));
			}
			return response;
		} catch (error) {
			console.error('Error updating gallery:', error);
			showMessage('error', 'Failed to rename gallery', () => updateGallery(name));
		} finally {
			// Reset processing flag
			updateGallery.isProcessing = false;
		}
	};
	// Initialize the flag
	updateGallery.isProcessing = false;
	// Initialize the flag

	const updatePreferences = useCallback(
		async (value) => {
			const payload = {
				ctaPreferences: {
					...info?.callToAction,
					link: value,
				},
			};

			const response = await editPreferences(galleryId, payload);
			if (response?.[0]) {
				showMessage('success', 'edited preferences');
			} else {
				setInfo((prev) => ({
					...prev,
					linkUpdateError: 'edited preferences not updated',
				}));
			}
		},
		[info?.callToAction],
	);

	const handleCloseCoverUpload = () => {
		setInfo((prev) => ({
			...prev,
			showUploadCover: false,
			uploadImageId: null,
			imageURL: '',
			coverImageDetails: null,
			crop: {
				x: 0,
				y: 0,
			},
			zoom: 1,
		}));
	};

	const handleDebouceFunctionCall = useCallback(
		(func, args) => {
			clearTimeout(info?.timeout);
			const timeout = setTimeout(() => {
				func(args);
				setInfo((prev) => ({
					...prev,
					loading: true,
				}));
			}, 500);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info?.timeout],
	);

	const albumChanges = useCallback(
		async (value) => {
			// Close popup immediately
			setInfo((prev) => ({
				...prev,
				showMainPopup: false,
				isAlbumRename: false,
			}));

			// If already processing or no value change, return early
			if (albumChanges.isProcessing || value === info.activeAlbum.title) return false;

			// Validate input length
			if (value.length > 255) {
				showMessage('warning', 'Album name is too long');
				return false;
			}

			// Set processing flag
			albumChanges.isProcessing = true;

			try {
				// const id = message.loading('Renaming album...');

				const payload = {
					title: value,
				};

				// Create updated album object
				const updatedAlbum = {
					...info.activeAlbum,
					title: value,
				};

				// Make the API call
				const response = await editAlbumName(payload, galleryId, info.activeAlbumId);

				// message.destroy(id);

				if (response?.[0]) {
					// Update UI state
					setInfo((prev) => ({
						...prev,
						albumName: value,
						activeAlbum: updatedAlbum,
						tenantAlbums: prev?.tenantAlbums?.map((album) =>
							album?._id === info?.activeAlbumId ? updatedAlbum : album,
						),
					}));

					// Show success message
					showMessage('success', 'Album renamed successfully');

					// Refresh album data
					await Promise.all([getAlbumImagesCount(galleryId), getAlbums(galleryId)]);
				} else {
					// Show error message
					showMessage('error', response?.[1]?.message || 'Failed to rename album', () =>
						albumChanges(value),
					);
				}
			} catch (error) {
				console.error('Error renaming album:', error);
				showMessage('error', 'An unexpected error occurred', albumChanges(value));
			} finally {
				albumChanges.isProcessing = false;
			}
		},
		[galleryId, info.activeAlbumId, info.activeAlbum],
	);

	// Initialize the processing flag
	albumChanges.isProcessing = false;

	// ... rest of the code ...

	const handleCopyAlbumLink = async () => {
		const albumLink = `${info?.galleryLink}/${info?.activeAlbumId}`;

		try {
			// Try the modern clipboard API first
			await navigator.clipboard.writeText(albumLink);
			showMessage('success', 'Album link copied to clipboard');
		} catch (err) {
			// Fallback for older browsers or when clipboard API fails
			const textArea = document.createElement('textarea');
			textArea.value = albumLink;
			document.body.appendChild(textArea);
			textArea.select();

			try {
				document.execCommand('copy');
				showMessage('success', 'Album link copied to clipboard');
			} catch (err) {
				showMessage('error', 'Failed to copy link', handleCopyAlbumLink);
			} finally {
				document.body.removeChild(textArea);
			}
		}
	};
	const handleDownloadTypeChange = (type, otherType) => {
		setInfo((prev) => ({
			...prev,
			[type]: !prev[type],
			[otherType]: !prev[otherType],
		}));
	};

	const handleTagSelect = (tagId) => {
		setInfo((prev) => ({
			...prev,
			activeTagId: tagId,
		}));
	};

	const handleDownloadAlbum = async () => {
		// If already downloading, return early
		if (info.isDownloading) return;

		try {
			setInfo((prev) => ({
				...prev,
				isDownloading: true,
			}));

			showMessage('loading', 'Downloading album...');
			// const id = message.loading('Downloading album...');

			const payload = {
				imageType: info?.originalDownload ? 'original' : 'optimized',
			};

			const response = await getDownloadLinkForTag(
				payload,
				galleryId,
				info?.activeAlbumId,
				info?.activeTagId || info?.albumTagId,
			);

			// message.destroy(id);

			if (response?.[0] === true && response?.[1]?.downloadId) {
				const region = localStorage.getItem('region');
				const regionPath = region === 'ap-south-1' ? 'in' : 'us';
				const downloadUrl = `https://downloads.ve.ai/${regionPath}/${response?.[1]?.downloadId}`;
				window.open(downloadUrl, '_blank');

				message.destroy();
				showMessage('success', 'Download started');

				setInfo((prev) => ({
					...prev,
					showDownloadAlbum: false,
					isDownloading: false,
				}));
			} else {
				showMessage('error', 'Failed to generate download link', handleDownloadAlbum);
				setInfo((prev) => ({
					...prev,
					isDownloading: false,
				}));
			}
		} catch (error) {
			console.error('Download error:', error);
			message.destroy();
			showMessage(
				'error',
				'Something went wrong, please try again later',
				handleDownloadAlbum,
			);
			setInfo((prev) => ({
				...prev,
				isDownloading: false,
			}));
		}
	};
	// ... existing code ...

	const handleLightRoomCopy = async () => {
		try {
			// Show loading message
			// const id = message.loading('Fetching image list...');

			let response;
			if (info.activeTab === 'Collections' && info.clientSelectionID) {
				// Check if we have client selection images
				if (!info.clientSelectionImages?.docs?.length) {
					message.warning('No images found in this client selection');
					return;
				}

				const response = await getClientSelectionLightRoomCopy(info.clientSelectionID);

				// message.destroy(id);

				if (!response?.[1]?.length) {
					message.warning('No valid images found in this client selection');
					return;
				}

				setInfo((prev) => ({
					...prev,
					lightroomCopyList: response?.[1],
					showLightRoomCopy: true,
					showOptionsContainer: false,
				}));

				message.destroy('lightroomCopy');
				showMessage('success', 'Image list fetched successfully');
				return;
			}

			// Handle regular album case
			if (!info.activeAlbumId) {
				message.destroy('lightroomCopy');
				showMessage('error', 'No active album selected');
				return;
			}

			// Get lightroom copy list for regular albums
			response = await getLightroomCopyList(galleryId, info.activeAlbumId);

			if (response) {
				setInfo((prev) => ({
					...prev,
					lightroomCopyList: response?.[1],
					showLightRoomCopy: true,
					showOptionsContainer: false,
				}));
			} else if (clientSelectionLightRoomCopy) {
				setInfo((prev) => ({
					...prev,
					lightroomCopyList: clientSelectionLightRoomCopy,
					showLightRoomCopy: true,
					showOptionsContainer: false,
				}));
				message.destroy('lightroomCopy');
				showMessage('success', 'Image list fetched successfully');
			} else {
				message.destroy('lightroomCopy');
				showMessage('error', 'Failed to fetch lightroom copy list', handleLightRoomCopy);
			}
		} catch (error) {
			console.error('Error fetching lightroom copy list:', error);
			message.destroy('lightroomCopy');
			showMessage('error', 'Failed to fetch lightroom copy list', handleLightRoomCopy);
		}
	};

	// ... rest of the code ...
	const handleCopyLightRoomList = () => {
		if (info?.lightroomCopyList?.length) {
			const textToCopy = info?.lightroomCopyList
				?.map((item) => item?.replace(/\.jpg$/i, ''))
				?.join(',');

			navigator.clipboard
				.writeText(textToCopy)
				.then(() => {
					showMessage('success', 'Lightroom list copied successfully!');
					setInfo((prev) => ({
						...prev,
						showLightRoomCopy: false,
						showOptionsContainer: true,
					}));
				})
				.catch(() => {
					showMessage('error', 'Failed to copy list', handleCopyLightRoomList);
				});
		} else {
			showMessage('warning', 'No items to copy');
		}
	};
	const handleLayoutType = (styleName, value) => {
		if (styleName === 'gridStyle') {
			const newGridStyle = {
				vertical: value === 'vertical',
				horizontal: value === 'horizontal',
			};
			setInfo((prev) => ({
				...prev,
				gridStyle: newGridStyle,
			}));
			putLayoutSettings({ gridStyle: { [value]: true } }, galleryId);
		} else if (styleName === 'thumbnailSize') {
			const newThumbnailSize = {
				regular: value === 'regular',
				large: value === 'large',
			};
			setInfo((prev) => ({
				...prev,
				thumbnailSize: newThumbnailSize,
			}));
			putLayoutSettings({ thumbnailSize: { [value]: true } }, galleryId);
		} else if (styleName === 'gridSpacing') {
			const newGridSpacing = {
				regular: value === 'regular',
				large: value === 'large',
			};
			setInfo((prev) => ({ ...prev, gridSpacing: newGridSpacing }));
			putLayoutSettings({ gridSpacing: { [value]: true } }, galleryId);
		} else if (styleName === 'themeMode') {
			setInfo((prev) => ({ ...prev, themeMode: value }));
			putLayoutSettings({ theme: value }, galleryId, 'theme');
		}
	};
	const handleManageCollaboratorPopup = () => {
		setInfo((prev) => ({
			...prev,
			showCollaborators: !info?.showCollaborators,
			shareModal: !info?.shareModal,
			collaboratorsData: prev.collaboratorsData || [],
		}));
	};
	const handleGalleryDateChange = (dateString, date, type) => {
		let payload = {};

		if (type === 'createdAt') {
			// Convert date string from DD-MM-YYYY to YYYYMMDD format
			const formattedDate = moment(dateString).format('YYYYMMDD');
			setInfo((prev) => ({
				...prev,

				galleryCreatedAt: formattedDate,
			}));
			payload = {
				shotDuring: formattedDate,
			};
		} else if (type === 'dueDate') {
			// Convert date to epoch timestamp
			const epochDate = moment(dateString).valueOf();
			setInfo((prev) => ({
				...prev,
				galleryDueDate: epochDate,
			}));
			payload = {
				dueDateEpoch: epochDate,
			};
		}
		postGallery(payload, galleryId);
	};

	//Delete Handler For Gallery

	const handleDeleteGallery = async () => {
		// const id = message.loading('Your gallery is being removed. Please wait...');

		const response = await deleteGallery(galleryId);
		if (response[0] === true) {
			message.destroy();
			showMessage('success', 'Gallery deleted successfully');
			if (!info?.isLightGallery) {
				navigate('/files?active-tab=Gallery');
				await getGalleries({}, true);
			} else {
				navigate(`/files?active-tab=Lite+Gallery`);
				await getGalleries({ isLightGallery: true }, true);
			}
		} else {
			message.destroy();
			showMessage('error', response[1].message);
		}
	};
	const handleManageCollaborator = (data) => {
		const collaboratorsArray = Array.isArray(data) ? data : [];
		setInfo((prev) => ({
			...prev,
			collaboratorsData: collaboratorsArray,
		}));
	};
	const onDragEnd = (result) => {
		if (!result.destination) return;

		const items = Array.from(info.albumTags);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		let changedItemIndex = null;
		let tagID = null;

		items.forEach((item, index) => {
			if (index === result.destination.index) {
				if (index === items.length - 1) {
					item.customSortIndex = items.length + 1;
				} else {
					const prevIndex = index > 0 ? items[index - 1].customSortIndex : 0;
					const nextIndex = items[index + 1].customSortIndex;
					item.customSortIndex = (prevIndex + nextIndex) / 2;
				}
				changedItemIndex = item.customSortIndex;
				tagID = item?._id;
			}
		});

		if (changedItemIndex !== null && tagID !== null) {
			const payload = {
				customSortIndex: changedItemIndex,
			};

			updateTagOrder(payload, galleryId, info?.activeAlbumId, tagID);
		}

		setInfo((prev) => ({
			...prev,
			albumTags: items,
		}));
	};

	const togglingOn = !info.isRearranging;
	const handleRearrange = async () => {
		if (togglingOn) {
			// Backup the current image list
			setInfo((prev) => ({
				...prev,
				isRearranging: true,
				selectedImages: [],
				rearrangingLoading: true,
				originalImagesList: prev.imagesList,
			}));

			const response = await getRearrangeStatus(
				galleryId,
				info?.activeAlbumId,
				info?.albumTagId,
			);

			if (response?.[0] === true) {
				setInfo((prev) => ({
					...prev,
					rearrangingLoading: false,
					page: 1,
				}));
				getGalleryImages(
					galleryId,
					info?.activeAlbumId,
					info?.albumTagId,
					1,
					info?.limit,
					'',
					true,
				);
			}
		} else {
			// If toggling OFF, treat as Cancel
			setInfo((prev) => ({
				...prev,
				isRearranging: false,
				selectedImages: [],
				rearrangingLoading: false,
				dropPlaceholder: null,
				imagesList: prev.originalImagesList || prev.imagesList, // 🟢 Restore
				originalImagesList: undefined,
				totalPayload: [],
			}));
		}
	};

	const handleUnpublish = () => {
		setInfo((prev) => ({
			...prev,
			isPublished: !info?.isPublished,
		}));
		const payload = {
			isPublished: !info?.isPublished,
		};
		postGallery(payload, galleryId);
	};

	const handleCopyGalleryLink = async () => {
		const galleryLink = `https://${info?.currentWorkspaceId}.ve.ai/gallery/${info?.activeGallery?.slug}`;

		try {
			// Try the modern clipboard API first
			await navigator.clipboard.writeText(galleryLink);
			showMessage('success', 'Gallery link copied to clipboard');
		} catch (err) {
			// Fallback for older browsers or when clipboard API fails
			const textArea = document.createElement('textarea');
			textArea.value = galleryLink;
			document.body.appendChild(textArea);
			textArea.select();

			try {
				document.execCommand('copy');
				showMessage('success', 'Gallery link copied to clipboard');
			} catch (err) {
				showMessage('error', 'Failed to copy link', handleCopyGalleryLink);
			} finally {
				document.body.removeChild(textArea);
			}
		}
	};

	const getImageDetails = async (imageId, batchId) => {
		const clearinterval = setInterval(async () => {
			const imageStatus = await getImageUploadStatus(galleryId, info?.activeAlbumId, batchId);
			if (
				imageStatus?.[0] === true &&
				imageStatus?.[1]?.processedCount === 1 &&
				imageStatus?.[1]?.uploadedCount === 1
			) {
				clearInterval(clearinterval);
				getImageDetail(imageId);
			}
		}, 2000);
	};

	const uploadGalleryCoverChangeHandler = async (e) => {
		const image = e.target.files[0];
		if (!image) {
			return;
		}
		setInfo((prev) => ({ ...prev, uploadImageLoader: true }));
		getImageDetail(null, true, false);
		setsearchkeys({ uploadImageId: 'image-uploading' });

		/*
		const id = message.loading(
			`Uploading ${info.coverType === 'gallery' ? 'Gallery' : 'Album'} cover image..`,
		);
		*/

		if (info?.imageURL) {
			setInfo((prev) => {
				// message.destroy(id);
				return {
					...prev,
					crop: {
						x: 0,
						y: 0,
					},
					zoom: info?.zoom || 1,
					uploadImageId: null,
					imageURL: info?.imageURL,
					coverImageDetails: null,
					coverType: prev.coverType,
				};
			});
		}
		const batchId = randomize('Aa0', 10);

		const duplicateImage = await getImageDuplicatesList(galleryId, info?.activeAlbumId);
		const isHavingDuplicateImage = duplicateImage?.[1]?.find(
			(item) => item?.displayName === image?.name,
		);

		if (isHavingDuplicateImage) {
			getImageDetail(isHavingDuplicateImage?._id);
			setInfo((prev) => ({
				...prev,
				uploadImageId: isHavingDuplicateImage?._id,
			}));

			return;
		}

		const allTagId = info?.albumTags?.find((item) => item?.displayName === 'All');
		let json = {
			originalFileName: image?.name,
			originalDateTime: moment(image?.['originalDate']).unix() || 0,
			uploadBatchId: batchId,
			tag_ids: [allTagId?._id],
			isAIFacesEnabled: true,
		};

		const signedURLUpload = await getUploadImageSignUrl(galleryId, info?.activeAlbumId, json);
		if (signedURLUpload?.[0] === true) {
			const uploadResponse = await axios.put(signedURLUpload[1]['signedUrl'], image, {
				headers: {
					'Content-Type': image?.type,
				},
			});
			setInfo((prev) => ({
				...prev,
				uploadImageId: signedURLUpload?.[1]?._id,
				imageURL: '',
				coverPhoto: true,
				coverType: prev.coverType,
				uploadImageLoader: false,
			}));

			if (uploadResponse.status === 200) {
				getImageDetails(signedURLUpload?.[1]?._id, batchId);
			}
		} else {
			message.destroy();
			showMessage('error', 'Something went wrong, please try again later', () =>
				uploadGalleryCoverChangeHandler(e),
			);
			setInfo((prev) => ({ ...prev, uploadImageLoader: false }));
		}
	};

	const handleSetCoverPosition = async (focusInfo) => {
		if (info?.coverLoading) return;

		try {
			setInfo((prev) => ({ ...prev, coverLoading: true }));

			// const id = message.loading('Updating cover position...');

			// Determine the current image based on different scenarios
			let currentImage;
			if (info?.selectedImages?.length === 1) {
				// Case 1: Selected image from gallery
				currentImage = info?.imagesList?.docs?.find(
					(img) => img._id === info.selectedImages[0],
				);
			} else if (info?.uploadImageId) {
				// Case 2: Newly uploaded image
				currentImage = imageDetail;
			} else {
				// Case 3: Existing cover image
				currentImage = info?.coverImageDetails;
			}

			if (!currentImage?._id || !currentImage?.activeVersion?.givenFileName) {
				throw new Error('Invalid image details for cover update');
			}

			// Extract desktop and mobile settings from focusInfo
			const desktopSettings = focusInfo?.desktop || { focalPoint: { x: 0, y: 0 }, zoom: 1 };
			const mobileSettings = focusInfo?.mobile || { focalPoint: { x: 0, y: 0 }, zoom: 1 };

			const payload = {
				image_id: currentImage._id,
				xPosition: desktopSettings.focalPoint?.x || 0,
				yPosition: desktopSettings.focalPoint?.y || 0,
				zoom: desktopSettings.zoom || 1,
				mobile: {
					xPosition: mobileSettings.focalPoint?.x || 0,
					yPosition: mobileSettings.focalPoint?.y || 0,
					zoom: mobileSettings.zoom || 1,
					width: 100,
					height: 100,
				},
				givenFileName: currentImage.activeVersion.givenFileName,
				width: 100,
				height: 100,
			};

			// Make the appropriate API call based on cover type
			const response =
				info.coverType === 'gallery'
					? await updateGalleryCoverImage(payload, galleryId)
					: await updateAlbumCoverImage(payload, galleryId, info.activeAlbumId);

			// message.destroy(id);

			if (response?.[0]) {
				// Create updated cover image object with both desktop and mobile settings
				const updatedCoverImage = {
					...currentImage,
					desktop: {
						xPosition: desktopSettings.focalPoint?.x || 0,
						yPosition: desktopSettings.focalPoint?.y || 0,
						zoom: desktopSettings.zoom || 1,
					},
					mobile: {
						xPosition: mobileSettings.focalPoint?.x || 0,
						yPosition: mobileSettings.focalPoint?.y || 0,
						zoom: mobileSettings.zoom || 1,
					},
				};
				await getAlbumImagesCount(galleryId);
				// Update state
				setInfo((prev) => ({
					...prev,
					showUploadCover: false,
					uploadImageId: null,
					imageURL: '',
					coverImageDetails: updatedCoverImage,
					selectedImages: [], // Clear selected images
					crop: {
						desktop: {
							x: desktopSettings.focalPoint?.x || 0,
							y: desktopSettings.focalPoint?.y || 0,
						},
						mobile: {
							x: mobileSettings.focalPoint?.x || 0,
							y: mobileSettings.focalPoint?.y || 0,
						},
					},
					zoom: {
						desktop: desktopSettings.zoom || 1,
						mobile: mobileSettings.zoom || 1,
					},
					// Update the appropriate cover
				}));

				// Refresh data
				// await Promise.all(
				// 	[
				// 		getAlbumImagesCount(galleryId),
				// 		getAlbums(galleryId),
				// 		info.coverType === 'gallery' && getGalleries({}, true),
				// 	].filter(Boolean),
				// );
				message.destroy();
				showMessage(
					'success',
					`${
						info.coverType === 'gallery' ? 'Gallery' : 'Album'
					} cover updated successfully`,
				);
			} else {
				throw new Error('Failed to update cover position');
			}
		} catch (error) {
			console.error('Error updating cover position:', error);
			showMessage('error', error.message || 'Failed to update cover position', () =>
				handleSetCoverPosition(focusInfo),
			);
		} finally {
			setTimeout(() => {
				setInfo((prev) => ({ ...prev, coverLoading: false }));
			}, 1000);
		}
	};

	// Initialize the processing flag

	const handleAlbumDelete = () => {
		const payload = {
			image_ids: info?.selectedImages,
		};
		let updatedImages = info?.imagesList?.docs?.filter((image) => {
			return !info?.selectedImages?.includes(image?._id);
		});
		deleteImages(payload, galleryId, info?.activeAlbumId);
		setInfo((prev) => ({
			...prev,
			imagesList: {
				...prev.imagesList,
				docs: updatedImages,
			},
			showImageDeletePopup: false,
			selectedImages: [],
		}));
		showMessage('success', 'Images deleted successfully');
	};

	const handleFilter = async (value) => {
		const current = info?.sortType || '';
		const baseValue = current.replace('-', '');
		const isSame = baseValue === value;
		const isCurrentlyDesc = current.startsWith('-');

		let newSortType;

		if (isSame) {
			// Toggle sort direction
			newSortType = isCurrentlyDesc ? value : `-${value}`;
		} else {
			// New selection → start with default (descending)
			const defaultItem = filterOptions.find((item) => item.value === value);
			newSortType = defaultItem?.sortType === 1 ? value : `-${value}`; // fallback to descending
		}

		setInfo((prev) => ({
			...prev,
			sortType: newSortType,
			imagesList: [],
			page: 1,
		}));

		const payload = { sortType: newSortType };

		const response = await updateTagSortType(
			payload,
			galleryId,
			info?.activeAlbumId,
			info?.albumTagId,
		);

		if (response?.[0] === true) {
			getGalleryImages(
				galleryId,
				info?.activeAlbumId,
				info?.albumTagId,
				1,
				info?.limit,
				'',
				true,
			);
		}
	};

	const handleTagChange = async (tagId) => {
		const isTagSelected = info.selectedImagesTags.includes(tagId);
		setInfo((prev) => ({
			...prev,
			selectedImagesTags: isTagSelected
				? prev.selectedImagesTags.filter((id) => id !== tagId)
				: [...prev.selectedImagesTags, tagId],
		}));
		const payload = {
			image_ids: info?.selectedImages,
		};

		if (isTagSelected) {
			const response = await removeTagFromImage(
				payload,
				galleryId,
				info?.activeAlbumId,
				tagId,
			);
			if (response?.[0] === true) {
				getAlbumCount(galleryId, info?.activeAlbumId);
				setInfo((prev) => ({
					...prev,
					selectedImages: [],
				}));
				showMessage('success', 'Tag removed successfully');
			}
		} else {
			const response = await addTagToImage(payload, galleryId, info?.activeAlbumId, tagId);
			if (response?.[0] === true) {
				getAlbumCount(galleryId, info?.activeAlbumId);
				setInfo((prev) => ({
					...prev,
					selectedImages: [],
					// selectedImagesTags: [tagId],
				}));
				showMessage('success', 'Tag added successfully');
			}
		}
	};
	// const handleSearch = (value) => {
	// 	setInfo((prev) => ({
	// 		...prev,
	// 		searchValue: value,
	// 	}));
	// };

	const handleSearch = (value) => {
		setInfo((prev) => ({
			...prev,
			searchValue: value,
		}));
		handleDebouceFunctionCall(searchImages, value);
	};

	const searchImages = async (value) => {
		await getGalleryImages(
			galleryId,
			info.activeAlbumId,
			info.albumTagId,
			info.page,
			info.limit,
			value,
			true,
		);
	};

	const handleMoveImageToAlbum = async (albumId) => {
		const payload = {
			image_ids: info?.selectedImages,
		};
		let updatedImages = info?.imagesList?.docs?.filter((image) => {
			return !info?.selectedImages?.includes(image?._id);
		});

		const response = await moveImagesToAlbum(payload, galleryId, albumId);
		if (response?.[0] === true) {
			getAlbumImagesCount(galleryId);
			setInfo((prev) => ({
				...prev,
				imagesList: {
					...prev.imagesList,
					docs: updatedImages,
				},
				selectedImages: [],
				showMoveToAlbum: false,
			}));
			showMessage('success', 'Images moved to album successfully');
		} else {
			showMessage('error', 'Something went wrong, please try again later', () =>
				handleMoveImageToAlbum(albumId),
			);
		}
	};

	const dynamicHeightFunc = () => {
		const containerWidth = document.querySelector('.albums')?.clientWidth || 0;
		const cardWidth = 130;
		const numberOfCards =
			info.activeTab === 'Collections'
				? clientSelectionsData?.data?.length || 0
				: albumImagesCount?.albums?.length + 1 || 0;
		const cardHeight = 160;
		const gap = 20;
		const cardsPerRow = Math.floor((containerWidth + gap) / (cardWidth + gap));
		const totalRows = Math.ceil(numberOfCards / cardsPerRow);

		const totalHeight = totalRows * (cardHeight + gap);

		return totalHeight;
	};

	// const addTagHandler = async () => {
	// 	if (
	// 		!navInfo?.searchInput.trim().length ||
	// 		tagsList?.list.find((tag) => tag.displayName === navInfo?.searchInput)
	// 	) {
	// 		return;
	// 	}

	// 	const json = {
	// 		displayName: navInfo.searchInput,
	// 		slug: slugify(navInfo.searchInput, { lower: true, strict: true }),
	// 	};

	// 	const response = await addGalleryTag(json, galleryId);
	// 	if (response?.[0] === true) {
	// 		setnavInfo((prev) => ({
	// 			...prev,
	// 			searchInput: '',
	// 		}));
	// 	}
	// };
	const addTagHandlerFunction = async () => {
		if (
			!info?.tagSearchValue.trim().length ||
			tagsList?.list.find((tag) => tag?.displayName === info?.tagSearchValue)
		) {
			return;
		}

		const json = {
			displayName: info?.tagSearchValue,
			slug: slugify(info?.tagSearchValue, { lower: true, strict: true }),
		};

		const response = await addGalleryTag(json, galleryId);
		if (response?.[0] === true) {
			// setInfo((prev) => ({
			// 	...prev,
			// 	// tagSearchValue: '',
			// }));
			showMessage('success', 'Tag added successfully');
		}
	};
	const handleAlbumDragEnd = (result) => {
		if (!result.destination) return;

		const items = Array.from(albumImagesCount?.albums || []);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		let changedItemIndex = null;
		let albumID = null;

		items.forEach((item, index) => {
			if (index === result.destination.index) {
				if (index === items.length - 1) {
					item.customSortIndex = items.length + 1;
				} else {
					const prevIndex = index > 0 ? items[index - 1].customSortIndex : 0;
					const nextIndex = items[index + 1].customSortIndex;
					item.customSortIndex = (prevIndex + nextIndex) / 2;
				}
				changedItemIndex = item.customSortIndex;
				albumID = item?._id;
			}
		});

		if (changedItemIndex !== null && albumID !== null) {
			const payload = {
				customSortIndex: changedItemIndex,
			};

			updateAlbumOrder(payload, galleryId, albumID, items);
		}

		// setInfo((prev) => ({
		// 	...prev,
		// 	albumTags: items,
		// }));
	};
	// const handleCoverEnterClick = async (focalPoint) => {
	// 	try {
	// 		// Set the cover position
	// 		await handleSetCoverPosition(focalPoint);

	// 		// Close the upload cover popup
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			showUploadCover: false,
	// 			coverPhoto: true,
	// 		}));

	// 		// Show success message
	// 		message.success({
	// 			content: `${
	// 				info.coverType === 'gallery' ? 'Gallery' : 'Album'
	// 			} cover updated successfully!`,
	// 			key: 'coverUpdate',
	// 		});
	// 	} catch (error) {
	// 		console.error('Error updating cover:', error);
	// 		message.error({
	// 			content: 'Failed to update cover position',
	// 			key: 'coverUpdate',
	// 		});
	// 	}
	// };

	const handleSetAlbumCover = async () => {
		if (info?.selectedImages?.length === 1) {
			const selectedImageId = info?.selectedImages[0];
			const selectedImage = info?.imagesList?.docs?.find(
				(img) => img._id === selectedImageId,
			);

			if (selectedImage?.activeVersion?.givenFileName && galleryCredentials) {
				const imageURL = `${galleryCredentials.baseURL}/${tenantAlbums.tenant_id}/${galleryId}/optimized/${selectedImage.activeVersion.givenFileName}?Key-Pair-Id=${galleryCredentials['Key-Pair-Id']}&Signature=${galleryCredentials.Signature}&Policy=${galleryCredentials.Policy}`;

				setInfo((prev) => ({
					...prev,
					showUploadCover: true,
					showOptionsContainer: false,
					coverType: 'album',
					uploadImageId: selectedImageId,
					imageURL: imageURL,
					coverImageDetails: selectedImage,
					crop: {
						x: selectedImage?.xPosition || 0,
						y: selectedImage?.yPosition || 0,
					},
					zoom: selectedImage?.zoom || 1,
				}));
			} else {
				showMessage(
					'error',
					'Unable to set selected image as album cover',
					handleSetAlbumCover,
				);
			}
		} else {
			showMessage(
				'error',
				'Please select only one image to set as album cover',
				handleSetAlbumCover,
			);
		}
	};

	const getCoverImageUrl = () => {
		if (!galleryCredentials) return null;

		const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;

		// If there's exactly one selected image, use that for preview
		if (info?.selectedImages?.length === 1) {
			const selectedImage = info?.imagesList?.docs?.find(
				(img) => img._id === info.selectedImages[0],
			);
			if (selectedImage?.activeVersion?.givenFileName) {
				return `${galleryCredentials?.baseURL}/${tenantAlbums?.tenant_id}/${galleryId}/optimized/${selectedImage.activeVersion.givenFileName}?${params}`;
			}
		}

		// If no selected images, show the existing cover based on type
		if (info.coverType === 'gallery') {
			// Use gallery cover
			if (info?.activeGallery?.coverImage?.givenFileName) {
				return `${galleryCredentials?.baseURL}/${tenantAlbums?.tenant_id}/${galleryId}/optimized/${info.activeGallery.coverImage.givenFileName}?${params}`;
			}
			return GridImage;
		} else if (info.coverType === 'album') {
			if (info?.activeAlbum?.coverImage?.givenFileName) {
				return `${galleryCredentials?.baseURL}/${tenantAlbums?.tenant_id}/${galleryId}/optimized/${info?.activeAlbum?.coverImage?.givenFileName}?${params}`;
			}
			return GridImage;
		}
		return GridImage;
	};
	const handleUploadCoverOpen = async (coverType) => {
		try {
			setInfo((prev) => ({
				...prev,
				showUploadCover: true,
				showOptions: coverType === 'gallery' ? false : prev.showOptions,
				showOptionsContainer: false,
				coverType: coverType,
				isLoadingCover: true,
				coverPhoto: true,
			}));

			// Get the current cover based on type
			const currentCover =
				coverType === 'gallery'
					? info?.activeGallery?.coverImage
					: info?.activeAlbum?.coverImage;
			// If we have a current cover and credentials, set up the preview
			if (currentCover?.givenFileName && galleryCredentials) {
				const imageURL = `${galleryCredentials.baseURL}/${tenantAlbums.tenant_id}/${galleryId}/optimized/${currentCover.givenFileName}?Key-Pair-Id=${galleryCredentials['Key-Pair-Id']}&Signature=${galleryCredentials.Signature}&Policy=${galleryCredentials.Policy}`;

				setInfo((prev) => ({
					...prev,
					isLoadingCover: false,
					uploadImageId: currentCover._id,
					imageURL: imageURL,
					coverImageDetails: {
						...currentCover,
						activeVersion: {
							givenFileName: currentCover.givenFileName,
						},
					},
					crop: {
						x: currentCover?.xPosition || 0,
						y: currentCover?.yPosition || 0,
					},
					zoom: currentCover?.zoom || 1,
				}));
			} else {
				// No cover image exists yet
				setInfo((prev) => ({
					...prev,
					isLoadingCover: false,
					imageURL: '',
					coverImageDetails: null,
					uploadImageId: null,
					crop: {
						desktop: { x: 0, y: 0 },
						mobile: { x: 0, y: 0 },
					},
					zoom: {
						desktop: 1,
						mobile: 1,
					},
				}));
			}

			// If we have a selected image, use that instead
			if (info?.selectedImages?.length === 1) {
				const selectedImage = info?.imagesList?.docs?.find(
					(img) => img._id === info?.selectedImages[0],
				);

				if (selectedImage?.activeVersion?.givenFileName && galleryCredentials) {
					const imageURL = `${galleryCredentials.baseURL}/${tenantAlbums.tenant_id}/${galleryId}/optimized/${selectedImage.activeVersion.givenFileName}?Key-Pair-Id=${galleryCredentials['Key-Pair-Id']}&Signature=${galleryCredentials.Signature}&Policy=${galleryCredentials.Policy}`;

					setInfo((prev) => ({
						...prev,
						isLoadingCover: false,
						uploadImageId: selectedImage._id,
						imageURL: imageURL,
						coverImageDetails: selectedImage,
						crop: {
							desktop: {
								x:
									selectedImage?.desktop?.xPosition ||
									selectedImage?.xPosition ||
									0,
								y:
									selectedImage?.desktop?.yPosition ||
									selectedImage?.yPosition ||
									0,
							},
							mobile: {
								x:
									selectedImage?.mobile?.xPosition ||
									selectedImage?.xPosition ||
									0,
								y:
									selectedImage?.mobile?.yPosition ||
									selectedImage?.yPosition ||
									0,
							},
						},
						zoom: {
							desktop: selectedImage?.desktop?.zoom || selectedImage?.zoom || 1,
							mobile: selectedImage?.mobile?.zoom || selectedImage?.zoom || 1,
						},
					}));
				}
			}
		} catch (error) {
			console.error('Error opening cover upload:', error);
			showMessage('error', 'Failed to open cover upload', () =>
				handleUploadCoverOpen(coverType),
			);
			setInfo((prev) => ({
				...prev,
				isLoadingCover: false,
			}));
		}
	};

	const handleSetGalleryCover = async () => {
		if (info?.selectedImages?.length === 1) {
			const selectedImageId = info?.selectedImages[0];
			const selectedImage = info?.imagesList?.docs?.find(
				(img) => img._id === selectedImageId,
			);

			if (selectedImage?.activeVersion?.givenFileName && galleryCredentials) {
				const imageURL = `${galleryCredentials.baseURL}/${tenantAlbums.tenant_id}/${galleryId}/optimized/${selectedImage.activeVersion.givenFileName}?Key-Pair-Id=${galleryCredentials['Key-Pair-Id']}&Signature=${galleryCredentials.Signature}&Policy=${galleryCredentials.Policy}`;

				setInfo((prev) => {
					const newState = {
						...prev,
						showUploadCover: true,
						showOptionsContainer: false,
						coverType: 'gallery',
						uploadImageId: selectedImageId,
						imageURL: imageURL,
						coverImageDetails: selectedImage,
						crop: {
							desktop: {
								x:
									selectedImage?.desktop?.xPosition ||
									selectedImage?.xPosition ||
									0,
								y:
									selectedImage?.desktop?.yPosition ||
									selectedImage?.yPosition ||
									0,
							},
							mobile: {
								x:
									selectedImage?.mobile?.xPosition ||
									selectedImage?.xPosition ||
									0,
								y:
									selectedImage?.mobile?.yPosition ||
									selectedImage?.yPosition ||
									0,
							},
						},
						zoom: {
							desktop: selectedImage?.desktop?.zoom || selectedImage?.zoom || 1,
							mobile: selectedImage?.mobile?.zoom || selectedImage?.zoom || 1,
						},
					};

					return newState;
				});
			} else {
				console.error('Missing required data:', {
					hasFileName: !!selectedImage?.activeVersion?.givenFileName,
					hasCredentials: !!galleryCredentials,
				});
				showMessage(
					'error',
					'Unable to set selected image as gallery cover',
					handleSetGalleryCover,
				);
			}
		} else {
			showMessage(
				'error',
				'Please select only one image to set as gallery cover',
				handleSetGalleryCover,
			);
		}
	};

	const handleDeleteAlbum = useCallback(async () => {
		// If already processing, return early
		if (handleDeleteAlbum.isProcessing) return;

		// Close popup immediately
		setInfo((prev) => ({
			...prev,
			showDeleteAlbum: false,
		}));

		// Set processing flag
		handleDeleteAlbum.isProcessing = true;
		try {
			// const id = message.loading('Your album is being removed. Please wait...');

			const response = await deleteAlbum(galleryId, info?.activeAlbumId);

			// message.destroy(id);

			if (response[0] === true) {
				message.destroy('deleteAlbum');
				showMessage('success', 'Album deleted successfully');
				await getAlbums(galleryId);
				navigate(`/galleries/${galleryId}`);
				setInfo((prev) => ({
					...prev,
					activeAlbumId: tenantAlbums?.[0]?._id,
					activeAlbum: tenantAlbums?.[0],
					albumSlug: tenantAlbums?.[0]?.slug,
					albumName: tenantAlbums?.[0]?.title,
				}));
			} else {
				message.destroy('deleteAlbum');
				showMessage('error', response[1].message, handleDeleteAlbum);
			}
		} catch (error) {
			console.error('Error deleting album:', error);
			message.destroy('deleteAlbum');
			showMessage('error', 'Failed to delete album', handleDeleteAlbum);
		} finally {
			handleDeleteAlbum.isProcessing = false;
		}
	}, [galleryId, info.activeAlbumId]);
	handleDeleteAlbum.isProcessing = false;

	const sortByCustomIndex = (items) => {
		const sortedItems = items?.sort((a, b) => a.customSortIndex - b.customSortIndex);
		// setInfo((prevInfo) => ({
		// 	...prevInfo,
		// 	albumSlug: sortedItems?.[0]?.slug,
		// }));
		return sortedItems;
	};

	const handleDragStart = (e) => {
		if (info.selectedImages.length === 0) return;

		// e.dataTransfer.setData('text/plain', '');
		setInfo((prev) => ({
			...prev,
			isDragging: true,
			dragPosition: {
				x: e.clientX,
				y: e.clientY,
			},
		}));

		// // Create and append ghost image container
		const ghostContainer = document.createElement('div');
		ghostContainer.style.position = 'fixed';
		ghostContainer.style.pointerEvents = 'none';
		ghostContainer.style.zIndex = '1000';
		ghostContainer.style.left = '-1000px';
		document.body.appendChild(ghostContainer);
		setTimeout(() => {
			e.dataTransfer.setDragImage(ghostContainer, 0, 0);
		}, 0);
	};

	const handleDrag = (e) => {
		const clientX = e.clientX || e.screenX;
		const clientY = e.clientY || e.screenY;

		if (!clientX || !clientY) return;

		const container = rearrangeContainerRef.current;
		console.log('container', container);
		if (!container) return;

		const scrollSpeed = 20;
		const buffer = 100;

		const { top, bottom } = container.getBoundingClientRect();

		if (clientY < top + buffer) {
			// Scroll up
			container.scrollTop -= scrollSpeed;
		} else if (clientY > bottom - buffer) {
			// Scroll down
			container.scrollTop += scrollSpeed;
		}

		// Always update the drag position and calculate drop position
		setInfo((prev) => ({
			...prev,
			dragPosition: {
				x: clientX,
				y: clientY,
			},
			dropPlaceholder: calculateDropPosition(e, rearrangeContainerRef),
		}));
	};

	const handleDragEnd = () => {
		if (!info.dropPlaceholder && info.dropPlaceholder !== 0) {
			setInfo((prev) => ({
				...prev,
				isDragging: false,
				selectedImages: [],
				dropPlaceholder: null,
			}));
			return;
		}

		const currentImages = [...info.imagesList.docs];
		const selectedImageObjects = info?.selectedImages
			?.map((id) => currentImages?.find((img) => img?._id === id))
			?.filter(Boolean);
		const remainingImages = currentImages?.filter(
			(img) => !info?.selectedImages?.includes(img?._id),
		);

		const lastImage = remainingImages[remainingImages.length - 1];

		const beforeIndex =
			info.dropPlaceholder > 0
				? getCustomSortIndex(remainingImages[info.dropPlaceholder - 1])
				: 0;

		const afterIndex =
			info.dropPlaceholder >= remainingImages.length
				? getCustomSortIndex(lastImage) + 1000 // 🎯 only set a high index at the end
				: getCustomSortIndex(remainingImages[info.dropPlaceholder]);

		// Calculate step size for even distribution
		const stepSize = (afterIndex - beforeIndex) / (selectedImageObjects?.length + 1);

		// Create payload with new sort indices

		const payload = selectedImageObjects?.map((image, index) => ({
			image_id: image?._id, // ✅ Use consistent key
			customSortIndex: beforeIndex + (index + 1) * stepSize,
		}));

		setInfo((prev) => {
			const seen = new Map();

			// First add existing entries
			prev.totalPayload.forEach((item) => {
				seen.set(item.image_id, item);
			});

			// Then overwrite with latest drag changes
			payload.forEach((item) => {
				seen.set(item.image_id, item);
			});

			return {
				...prev,
				totalPayload: Array.from(seen.values()), // ✅ Deduplicated
			};
		});
		const updatedImages = selectedImageObjects?.map((image, index) => ({
			...image,
			galleryTags: image?.galleryTags?.map((tag) =>
				tag?._id === info?.albumTagId
					? {
							...tag,
							customSortIndex: beforeIndex + (index + 1) * stepSize,
					  }
					: tag,
			),
		}));

		remainingImages?.splice(info?.dropPlaceholder, 0, ...updatedImages);

		setInfo((prev) => ({
			...prev,
			isDragging: false,
			selectedImages: [],
			dropPlaceholder: null,
		}));
		updateImageOrder(remainingImages);
	};
	const handleSaveImage = async () => {
		// const id = message.loading('Rearranging images...');
		// Remove duplicates by keeping the last occurrence of each image ID
		const seen = new Map();
		for (let item of info.totalPayload) {
			seen.set(item.image_id, item); // If the same imageId comes again, it overwrites the previous one
		}
		const uniqueSortedPayload = Array.from(seen.values()).sort(
			(a, b) => a.customSortIndex - b.customSortIndex,
		);

		if (uniqueSortedPayload.length > 0) {
			const response = await changeImageOrder(
				uniqueSortedPayload,
				galleryId,
				info.activeAlbumId,
				info.albumTagId,
			);

			// message.destroy(id);
			if (response?.[0] === true) {
				// message.loading('Rearranging images...');
				message.destroy();
				showMessage('success', 'Images rearranged successfully');
				setInfo((prev) => ({
					...prev,
					totalPayload: [],
					isRearranging: false,
				}));
			} else {
				message.destroy();
				showMessage(
					'error',
					'Something went wrong, please try again later',
					handleSaveImage,
				);
			}
		} else {
			setInfo((prev) => ({
				...prev,
				isRearranging: false,
			}));
		}
	};

	// Helper function to get customSortIndex from image
	const getCustomSortIndex = (image) => {
		if (!image) return 0;
		const activeTag = image.galleryTags.find((tag) => tag._id === info.albumTagId);
		return activeTag?.customSortIndex || 0;
	};

	// const handleRenameGallery = () => {
	// 	setInfo((prev) => ({
	// 		...prev,
	// 		showOptions: false,
	// 		showMainPopup: true,
	// 		galleryName: info?.activeGallery?.title || '',
	// 	}));
	// };

	// ... existing code ...
	const handleDownload = async () => {
		if (
			validateExpiryData &&
			validateExpiryData?.restrictGalleries &&
			validateExpiryData?.isExpired
		) {
			return updateSubscriptionState({
				expiredSubscriptionModal: true,
				expiredSubscriptionType: 'Classic-Gallery',
			});
		}

		try {
			// Start with loading message
			// const id = message.loading('Preparing download...');

			// Single image download handling
			if (info?.selectedImages?.length === 1) {
				const selectedImageId = info.selectedImages[0];

				// Get single image download link
				const isLightGallery = info?.isLightGallery;
				const response = await getDownloadLinkForImage(selectedImageId, isLightGallery);

				// message.destroy(id);

				if (response?.[0] === true) {
					showMessage('success', 'Download completed');
				} else {
					throw new Error('Failed to get download link');
				}

				// Clear selection
				setInfo((prev) => ({
					...prev,
					selectedImages: [],
				}));
				return;
			}

			// Handle Client Selections tab with no specific selections
			if (
				info.activeTab === 'Collections' &&
				info.clientSelectionID &&
				info.selectedImages.length === 0
			) {
				const payload = {
					imageType: info?.isLightGallery ? 'optimized' : 'original',
				};

				const response = await downloadImagesForClientSelection(
					payload,
					info?.clientSelectionID,
				);
				if (response?.[0] === true) {
					showMessage('success', 'Download Started');
					window.open(response[1], '_blank');
				} else {
					throw new Error('Failed to prepare download');
				}
				return;
			}

			// Handle multiple images (2-10)
			if (info?.selectedImages?.length <= 10) {
				const payload = {
					image_ids: info?.selectedImages,
					imageType: info?.isLightGallery ? 'optimized' : 'original',
				};
				const response = await getDownloadForMultipleImages(payload, galleryId);

				if (response?.[0] === true) {
					message.destroy();
					showMessage('success', 'Download completed');
				} else {
					throw new Error('Failed to get download links');
				}
			} else {
				// Handle bulk download (more than 10 images)
				const payload = {
					image_ids: info?.selectedImages,
					imageType: 'optimized',
				};
				const response = await downloadImages(payload, galleryId, info?.activeAlbumId);

				if (response?.[0] === true && response?.[1]?.signedUrl) {
					const link = document.createElement('a');
					link.href = response[1].signedUrl;
					link.setAttribute('download', `gallery-images-${Date.now()}.zip`);
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					message.destroy();
					showMessage('success', 'Download started');
				} else {
					throw new Error('Failed to prepare download');
				}
			}

			// Clear selection after successful download
			setInfo((prev) => ({
				...prev,
				selectedImages: [],
			}));
		} catch (error) {
			console.error('Download error:', error);
			message.destroy();
			showMessage(
				'error',
				error.message || 'An error occurred during download',
				handleDownload,
			);
		}
	};

	const calculateDropPosition = (e, containerRef) => {
		if (!containerRef.current) return null;

		const container = containerRef.current;
		const containerRect = container.getBoundingClientRect();
		const mouseX = e.clientX - containerRect.left;
		const mouseY = e.clientY - containerRect.top;

		// Get all image containers
		const imageContainers = Array.from(
			container.getElementsByClassName('rearrange-image-container'),
		);

		// Find nearest position
		let nearestIndex = 0;
		let shortestDistance = Infinity;

		imageContainers.forEach((container, index) => {
			const rect = container.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2 - containerRect.left;
			const centerY = rect.top + rect.height / 2 - containerRect.top;

			const distance = Math.sqrt(
				Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2),
			);

			if (distance < shortestDistance) {
				shortestDistance = distance;
				nearestIndex = index;
			}
		});

		return nearestIndex;
	};

	// Add container ref
	const rearrangeContainerRef = useRef(null);
	const galleryScrollTargetRef = useRef(null);

	let scrolling = false;

	useEffect(() => {
		const handleMouseMove = (e) => {
			const container = galleryScrollTargetRef.current;
			if (!container || !info.isDragging) return; // Only trigger when dragging

			const { top, bottom } = container.getBoundingClientRect();
			const scrollAmount = 10; // Adjust scroll speed

			// Check if scrolling is already in progress
			if (!scrolling) {
				// Check if cursor is near the top within 30px
				if (e.clientY < top + 30) {
					scrolling = true;
					container.scrollBy({ top: -scrollAmount, behavior: 'auto' });
				}
				// Check if cursor is near the bottom within 150px
				else if (e.clientY > bottom - 150) {
					scrolling = true;
					container.scrollBy({ top: scrollAmount, behavior: 'auto' });
				}

				// Reset the scrolling flag after a delay for smooth interval
				setTimeout(() => (scrolling = false), 30);
			}
		};

		// Throttle the mousemove event listener
		document.addEventListener('mousemove', handleMouseMove);

		// Clean up event listener on component unmount
		return () => document.removeEventListener('mousemove', handleMouseMove);
	}, [info.isDragging]);

	const getShareLink = () => {
		const baseUrl = `${info?.galleryLink}`;
		let pin = '';
		if (info.activeTab === 'Collections' && info?.clientSelectionID) {
			const selection = clientSelectionsData?.data?.find(
				(sel) => sel._id === info?.clientSelectionID,
			);
			pin = selection?.pin || '';
		} else if (info?.activeAlbum?._id) {
			pin = info?.activeAlbum?.guestAccess?.pin || '';
		} else {
			pin = info?.activeGallery?.guestAccess?.pin || '';
		}
		if (info.activeTab === 'Collections' && info?.clientSelectionName) {
			return {
				url: `${baseUrl}/selection/${info?.activeClientSelection}`,
				pin: pin,
			};
		} else if (info?.activeAlbum?.slug) {
			return {
				url: `${baseUrl}/${info?.activeAlbum?._id}`,
				pin: pin,
			};
		}
		return {
			url: baseUrl,
			pin: pin,
		};
	};
	const galleryUrl = useMemo(() => {
		if (!galleryCredentials || !info.activeGallery?.coverImage) return '';

		const { baseURL, 'Key-Pair-Id': keyPairId, Signature, Policy } = galleryCredentials;
		const givenFileName = albumImagesCount?.coverImage?.givenFileName;

		if (!givenFileName) return '';
		return `${baseURL}/${tenantAlbums?.tenant_id}/${galleryId}/optimized/${givenFileName}?Key-Pair-Id=${keyPairId}&Signature=${Signature}&Policy=${Policy}`;
	}, [
		galleryCredentials, // now from context ✅
		info.activeGallery?.coverImage,
		tenantAlbums,
		galleryId,
	]);

	const handleCloseGalleryViewer = () => {
		setInfo((prev) => ({
			...prev,
			isGalleryViewer: false,
		}));
	};
	const handleBackNavigation = () => {
		navigate(location.pathname, { replace: true, state: {} });
		setInfo((prev) => ({
			...prev,
			activeAlbumId: null,
			albumContains: '',
		}));
		navigate(-1);
	};
	const selectedFaceChange = (face) => {
		setInfo((prev) => ({
			...prev,
			selectedFace: face,
		}));
	};

	const openUploadCoverPhoto = (file, type) => {
		setInfo((prev) => ({
			...prev,
			showUploadCover: true,
			coverType: type,
			selectedImages: [file?._id],
			coverPhoto: true,
			isLoadingCover: true, // Set loading to true while fetching the image
		}));
		// Fetch the selected image's URL after setting the state
		const selectedImage = info?.imagesList?.docs?.find((img) => img._id === file?._id);
		if (selectedImage?.activeVersion?.givenFileName && galleryCredentials) {
			const imageURL = `${galleryCredentials.baseURL}/${tenantAlbums.tenant_id}/${galleryId}/optimized/${selectedImage.activeVersion.givenFileName}?Key-Pair-Id=${galleryCredentials['Key-Pair-Id']}&Signature=${galleryCredentials.Signature}&Policy=${galleryCredentials.Policy}`;
			// Update state with the image URL after fetching it
			setInfo((prev) => ({
				...prev,
				isLoadingCover: false, // Set loading to false once the image URL is ready
				imageURL: imageURL,
				coverImageDetails: selectedImage,
			}));
		}
	};

	const videoToggle = (value) => {
		const updatedVideosList = info?.videosList?.map((video) =>
			video?._id === info?.selectVideo?._id ? { ...video, isPublished: value } : video,
		);

		setInfo((prev) => ({
			...prev,
			videosList: updatedVideosList,
		}));
	};

	const removeSelectedVideoFromList = () => {
		const selectedVideoId = info?.selectVideo?._id;
		const updatedVideosList = info?.videosList?.filter(
			(video) => video?._id !== selectedVideoId,
		);

		setInfo((prev) => ({
			...prev,
			videosList: updatedVideosList,
			selectVideo: updatedVideosList?.[0],
		}));
	};

	const updateSelectedVideo = () => {
		setInfo((prev) => ({ ...prev, videoUploaded: true }));
	};

	return (
		<>
			<div className="galleryContainer" style={{ height: info?.isRearranging ? '100%' : '' }}>
				{/* {!info?.isRearranging && (
					<div className="galleryTitleWhenScrolled">
						<span onClick={() => navigate('/home')} className="homeIcon">
							<HomeIcon />
						</span>
						<span className="rightArrowIcon">
							<RightArrow />
						</span>
						<span
							className="galleryTitle"
							onClick={handleBackNavigation}
							style={{ cursor: 'pointer' }}
						>
							Files
						</span>
					</div>
				)} */}
				{info?.isRearranging ? (
					<div className="galleryRearrangingContainer">
						<div className="galleryRearrangingImageContainer">
							<div
								className="imageContaienr"
								style={{
									background: galleryCredentials
										? `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%), url(${galleryUrl}) lightgray 50% / cover no-repeat`
										: '#000000',
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									backgroundRepeat: 'no-repeat',
								}}
								onMouseEnter={() =>
									setInfo((prev) => ({ ...prev, showCoverButton: true }))
								}
								onMouseLeave={() =>
									setInfo((prev) => ({ ...prev, showCoverButton: false }))
								}
							></div>
							<div className="galleryRearrangingTitle">Files</div>
							<div className="galleryRearrangingSlash">/</div>
							<div className="galleryRearrangingTitle">
								{info?.activeGallery?.title || 'Untitled Gallery'}
							</div>
							<div className="galleryRearrangingSlash">/</div>
							<div className="galleryRearrangingTitle">
								{info?.activeAlbum?.title}
							</div>
						</div>
						<div className="rearrangeButtonsContainer">
							<button className="rearrangeCancelButton" onClick={handleRearrange}>
								Cancel
							</button>
							<button
								className="rearrangeSaveButton"
								onClick={handleSaveImage}
								style={{ cursor: 'pointer' }}
							>
								Save Changes
							</button>
						</div>
					</div>
				) : (
					<div
						className="mainGalleryContainer"
						style={{
							height: 'fit-content',
						}}
					>
						<div className="albumsContianer">
							<div className="galleryContentContainer">
								<div className="content">
									<div
										className="rightArrowIcon"
										onClick={handleBackNavigation}
										style={{ cursor: 'pointer' }}
									>
										<ChevronLeft
											style={{ transform: 'rotate(180deg)' }}
											height="20px"
											width="20px"
										/>
									</div>
									<div className="galleryPic">
										<div className="galleryHeaderColumn">
											<div
												className="imageContaienr"
												style={{
													background:
														albumImagesCount?.coverImage
															?.givenFileName && galleryCredentials
															? `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%), url(${galleryUrl}) lightgray 50% / cover no-repeat`
															: '#000000',
													backgroundSize: 'cover',
													backgroundPosition: 'center',
													backgroundRepeat: 'no-repeat',
												}}
												onMouseEnter={() =>
													setInfo((prev) => ({
														...prev,
														showCoverButton: true,
													}))
												}
												onMouseLeave={() =>
													setInfo((prev) => ({
														...prev,
														showCoverButton: false,
													}))
												}
												onClick={() => handleUploadCoverOpen('gallery')}
											></div>
											<div className="galleryTitle">
												<p>
													{info?.activeGallery?.title ||
														'Untitled Gallery'}
												</p>
												{tenantAlbums && (
													<span className="galleryImagesCount">
														{tenantAlbums?.storageDetails?.imagesCount}{' '}
														Images
													</span>
												)}
											</div>
										</div>
									</div>
								</div>
								<div className="shareContainer">
									{/* <div
										className="icon"
										ref={iconRef}
										onClick={(e) => {
											e.stopPropagation();
											e.preventDefault();
											setInfo((prevInfo) => ({
												...prevInfo,
												showOptions: !prevInfo.showOptions,
											}));
										}}
									>
										<ThreeDotsIcon className="threeDotsIcon" />
										{info.showOptions && (
											<div
												className="optionsContainers"
												ref={optionsRef}
												onClick={(e) => e.stopPropagation()}
											>
												{galleryOptions.map((option, index) =>
													option.divider ? (
														<hr
															key={`divider-${index}`}
															style={{
																border: '1px solid var(--stroke)',
																opacity: '0.2',
																width: '100%',
															}}
														/>
													) : (
														<li
															key={option.label}
															onClick={option.onClick}
															className={option.className}
														>
															{option.icon}
															<span>{option.label}</span>
														</li>
													),
												)}
											</div>
										)}
									</div> */}
									<Tooltip
										title={
											<div className="filterContainer">
												{galleryOptions.map((option, index) =>
													option.divider ? (
														<hr
															key={`divider-${index}`}
															style={{
																border: '1px solid var(--stroke)',
																opacity: '1',
																width: '100%',
															}}
														/>
													) : (
														<li
															key={option.label}
															onClick={option.onClick}
															className="file-filter-option-items"
														>
															{option.icon}
															<span>{option.label}</span>
														</li>
													),
												)}
											</div>
										}
										placement="bottom"
										arrow={false}
										color="transparent"
										trigger={'click'}
									>
										<div className="onlineContainer">
											<EditPenIcon />
											<p>Edit</p>
										</div>
									</Tooltip>
									<div className="onlineContainer" onClick={openShareModal}>
										<ShareIcon className="shareIcon" />
										<p>Share</p>
									</div>
									<div className="verticalLine"></div>
									<div
										className="onlineContainer toggleContainer"
										onClick={handleOnlineToggle}
										style={{ cursor: 'pointer' }}
									>
										<div className="onlineIndicatorContainer">
											{/* <div
												className="onlineStatus"
												style={{
													backgroundColor: info.isOnline
														? 'var(--primary-button)'
														: 'var(--error)',
												}}
											></div> */}
											<p className="onlineText">
												{info.isOnline
													? 'Gallery Online'
													: 'Gallery Offline'}
											</p>
										</div>
										<Switch
											checked={info.isOnline}
											// onChange={handleOnlineToggle}
											size="small"
											style={{
												backgroundColor: info.isOnline
													? 'var(--primary-button)'
													: '',
											}}
										/>
									</div>
								</div>
							</div>
							<div className="galleryMainContentContainer">
								{data?.map((item, index) => {
									if (item?.name === 'Collections' && item?.number === 0)
										return null;

									return (
										<div key={index}>
											{item?.name !== 'breaker' && (
												<div
													className={`galleryContent ${
														info?.activeTab === item?.name
															? 'active'
															: ''
													}`}
													onClick={() =>
														handleClickContent(item?.name, item?.number)
													}
													style={{ cursor: 'pointer' }}
												>
													<p
														className={`galleryName ${
															info?.activeTab === item?.name
																? 'active'
																: ''
														}`}
													>
														{item?.name}
													</p>
													<p
														className={`count ${
															info?.activeTab === item?.name
																? 'active'
																: ''
														}`}
													>
														{item?.number}
													</p>
												</div>
											)}
											{item?.name === 'breaker' && (
												<div className="breaker"></div>
											)}
										</div>
									);
								})}
							</div>
							{info.activeTab !== 'Insights' && info.activeTab !== 'Ai People' && (
								<div
									style={{
										display: 'flex',
										height: '100%',
										alignItems: 'center',
										justifyContent: 'space-between',
										gap: '20px',

										// height: '160px',
									}}
									id="droppableAlblumId"
									className={`albumsWrapper ${
										info.albumFullScreen ? 'expanded' : ''
									}`}
								>
									<DragDropContext onDragEnd={handleAlbumDragEnd}>
										<Droppable
											droppableId="droppableAlblumId"
											direction="horizontal"
											style={{
												height: '100%',
											}}
										>
											{(provided) => (
												<div
													className="albums"
													{...provided.droppableProps}
													ref={provided.innerRef}
												>
													{info?.activeTab === 'Albums' && (
														<div
															className="create-album"
															onClick={() =>
																setInfo((prevData) => ({
																	...prevData,
																	showCreateAlbum: true,
																}))
															}
														>
															<p>+ Create Album</p>
														</div>
													)}
													{info?.activeTab === 'Videos' && (
														<div
															className="create-album"
															onClick={() => {
																setInfo((prev) => ({
																	...prev,
																	videoUploadPopup: true,
																}));
															}}
														>
															<p>+ Add Video</p>
														</div>
													)}

													{info.activeTab === 'Albums' &&
														sortByCustomIndex(
															albumImagesCount?.albums,
														)?.map((album, index) => {
															let src = null;
															if (album?.coverImage?._id) {
																const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
																src = `${galleryCredentials?.baseURL}/${tenantAlbums?.tenant_id}/${galleryId}/optimized/${album?.coverImage?.givenFileName}?${params}`;
															}

															const isActive =
																info?.albumSlug === album?.slug;
															return (
																<Draggable
																	key={album._id}
																	draggableId={album._id}
																	index={index}
																>
																	{(provided) => (
																		<div
																			ref={provided.innerRef}
																			{...provided.draggableProps}
																			className={`album ${
																				info?.albumSlug ===
																				album?.slug
																					? 'active'
																					: ''
																			}`}
																			// style={{
																			// 	backgroundImage: src
																			// 		? `url(${src})`
																			// 		: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%), #C4C4C4`,
																			// 	backgroundPosition: `${
																			// 		album
																			// 			?.coverImage
																			// 			?.xPosition *
																			// 			50 +
																			// 		50
																			// 	}%  ${
																			// 		50 -
																			// 		album
																			// 			?.coverImage
																			// 			?.yPosition *
																			// 			50
																			// 	} %`,
																			// }}
																			onClick={() =>
																				handleClickAlbum(
																					album,
																					'albumName',
																				)
																			}
																			onMouseEnter={() =>
																				setInfo((prev) => ({
																					...prev,
																					showDragIconOfAlbum:
																						album?._id,
																				}))
																			}
																			onMouseLeave={() =>
																				setInfo((prev) => ({
																					...prev,
																					showDragIconOfAlbum:
																						null,
																				}))
																			}
																		>
																			<div
																				style={{
																					backgroundImage: `url(${src})`,
																					backgroundPosition: `${Math.floor(
																						album
																							?.coverImage
																							?.xPosition *
																							50 +
																							50,
																					)}% ${Math.floor(
																						50 -
																							album
																								?.coverImage
																								?.yPosition *
																								50,
																					)}%`,
																					backgroundSize: `${
																						album
																							?.coverImage
																							?.zoom *
																						100
																					}% auto`,
																					height: '100%',
																					backgroundRepeat:
																						'no-repeat',
																					borderRadius:
																						'12px',
																				}}
																			/>
																			{!album?.coverImage
																				?._id && (
																				<AlbumCoverIcon
																					style={{
																						position:
																							'absolute',
																						top: '50%',
																						left: '50%',
																						transform:
																							'translate(-50%, -50%)',
																					}}
																					color="var(--secondary-font)"
																				/>
																			)}

																			{!isActive && (
																				<div className="albumOverlay" />
																			)}
																			{!album?.isPublished && (
																				<div className="unpublished">
																					<CrossedOpenEye />
																					Unpublished
																				</div>
																			)}
																			<span
																				{...provided.dragHandleProps}
																				style={{
																					position:
																						'absolute',
																					top: '10px',
																					left: '10px',
																					zIndex: '10',
																					transition:
																						'all 0.3s ease',
																					opacity:
																						info?.showDragIconOfAlbum ===
																						album?._id
																							? 1
																							: 0,
																				}}
																			>
																				<DragIcon />
																			</span>

																			<div
																				className="albumDetails"
																				// onClick={() =>
																				// 	handleClickAlbum(
																				// 		album,
																				// 		'albumName',
																				// 		album?.imagesCount,
																				// 	)
																				// }
																			>
																				<p className="albumTitle">
																					{`${
																						album?.imagesCount ||
																						0
																					} ${
																						album?.imagesCount >
																						1
																							? 'photos'
																							: 'photo'
																					}`}
																				</p>

																				<div className="albumDetailsBottom">
																					<p>
																						{
																							album?.title
																						}
																					</p>
																					{album
																						?.guestAccess
																						?.isEnabled && (
																						<span
																							style={{
																								height: '18px',
																								width: '18px',
																							}}
																						>
																							<LockIcon
																								style={{
																									color: 'var(--secondary-font)',
																								}}
																							/>
																						</span>
																					)}
																				</div>
																			</div>
																			{/* <div className="overlay"></div> */}
																		</div>
																	)}
																</Draggable>
															);
														})}

													{info.activeTab === 'Collections' &&
														clientSelectionsData?.data?.map(
															(album, index) => {
																let src = null;
																if (album?.coverImage?._id) {
																	const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
																	src = `${galleryCredentials?.baseURL}/${tenantAlbums?.tenant_id}/${galleryId}/optimized/${album?.coverImage?.givenFileName}?${params}`;
																}
																return (
																	<div
																		key={album._id}
																		className={`album ${
																			info?.activeClientSelection ===
																			album?.slug
																				? 'active'
																				: ''
																		}`}
																		style={{
																			background: src
																				? `url(${src})`
																				: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%), #C4C4C4`,
																			backgroundSize: 'cover',
																			backgroundPosition:
																				'center',
																		}}
																		onClick={() =>
																			handleClickAlbum(
																				album,
																				'clientSelection',
																			)
																		}
																	>
																		{album.image && (
																			<img src={src} />
																		)}

																		<div
																			className="albumDetails"
																			onClick={() =>
																				handleClickAlbum(
																					album,
																					'clientSelection',
																				)
																			}
																		>
																			<p>{album?.title}</p>
																			<p>{`${
																				album?.numberOfImages ||
																				0
																			} photos`}</p>
																		</div>
																		<div className="overlay"></div>
																	</div>
																);
															},
														)}
													{provided.placeholder}

													{info?.activeTab === 'Videos' && (
														<div className="videosContainer">
															{info?.videosList?.map((video) => (
																<div
																	key={video?._id}
																	className={`eachVideoContainer ${
																		info?.selectVideo?._id ===
																		video?._id
																			? 'selectedVideo'
																			: ''
																	}`}
																	style={{
																		backgroundImage: `url(
																			${info?.thumbnailUrls[video?._id] || ''}
																		)`,
																		backgroundSize: 'cover',
																		backgroundPosition:
																			'center',
																		backgroundRepeat:
																			'no-repeat',
																		overflow: 'hidden',
																	}}
																	onClick={() =>
																		setInfo((prev) => ({
																			...prev,
																			selectVideo: video,
																		}))
																	}
																>
																	{!video?.isPublished && (
																		<div className="videoOfflineIndicator">
																			<CrossedOpenEye />
																			Offline
																		</div>
																	)}
																	{info?.selectVideo?._id !==
																	video?._id ? (
																		<div className="videoOverlay"></div>
																	) : (
																		<div className="videoTitleOverlay"></div>
																	)}

																	<p className="videoTitle">
																		{video?.title}
																	</p>
																</div>
															))}
														</div>
													)}
												</div>
											)}
										</Droppable>
									</DragDropContext>

									{albumImagesCount?.albums?.length > 4 && (
										<div
											className="fullScreenContainer"
											onClick={() =>
												setInfo((prev) => ({
													...prev,
													albumFullScreen: !prev.albumFullScreen,
												}))
											}
											style={{
												...(info?.albumFullScreen && {
													rotate: '180deg',
												}),
											}}
										>
											<UpArrow />
										</div>
									)}
									{/* </div> */}
								</div>
							)}
						</div>
					</div>
				)}
				<div className="horizontalRule"></div>
				{info?.scrolledTillEnd && info?.activeTab === 'Albums' && !info?.isRearranging && (
					<div className="galleryTitleWhenScrolled" style={{ gap: '24px' }}>
						{sortByCustomIndex(albumImagesCount?.albums)?.map((album) => {
							const isActive = album._id === info.activeAlbumId;
							let src = null;
							if (album?.coverImage?._id) {
								const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
								src = `${galleryCredentials?.baseURL}/${tenantAlbums?.tenant_id}/${galleryId}/optimized/${album?.coverImage?.givenFileName}?${params}`;
							}
							return (
								<span
									key={album._id}
									className={`albumTabs ${isActive ? 'activeTab' : ''}`}
									onClick={() => handleClickAlbum(album, 'albumName')}
								>
									{/* <div
										style={{
											backgroundImage: `url(${src})`,
											backgroundPosition: `${Math.floor(
												album?.coverImage?.xPosition * 50 + 50,
											)}%  ${Math.floor(
												50 - album?.coverImage?.yPosition * 50,
											)}%`,
											width: '24px',
											height: '24px',
											borderRadius: '50%',
											overflow: 'hidden',
										}}
									/> */}
									{album?.coverImage?._id && (
										<img
											src={src}
											style={{
												width: '24px',
												height: '24px',
												borderRadius: '50%',
												overflow: 'hidden',
											}}
										/>
									)}
									<span>
										{album.title}
										<span className={`count ${isActive ? 'active' : ''}`}>
											{album.imagesCount}
										</span>
									</span>
								</span>
							);
						})}
					</div>
				)}

				{info.activeTab === 'Albums' &&
					(albumImagesCount?.albums?.length === 0 ? (
						<div className="noAlbumsMainContainer">
							<div className="noAlbumContainer">
								<div className="noAlbumContainerTitle">Start upload images</div>
								<div className="noAlbumContainerDescription">
									It's quiet for now... You haven't missed anything yet! Create
									your first album to start organizing your memories
								</div>
								<button
									className="noAlbumUploadButton"
									onClick={() =>
										setInfo((prevData) => ({
											...prevData,
											showCreateAlbum: true,
										}))
									}
								>
									Upload Images
								</button>
							</div>
						</div>
					) : (
						<div className="galleryViewer">
							<div className="galleryNavbar">
								<div className="albumDetailsContainer">
									<div className="albumContains">
										<DragDropContext onDragEnd={onDragEnd}>
											<Droppable droppableId="tags" direction="horizontal">
												{(provided) => (
													<div
														{...provided.droppableProps}
														ref={provided.innerRef}
														style={{
															display: 'flex',
															gap: '8px',
															alignItems: 'center',
															overflowX: 'auto',
														}}
														className="hideScrollBar"
													>
														{info?.albumTags
															?.sort(
																(a, b) =>
																	a.customSortIndex -
																	b.customSortIndex,
															)
															?.map((contain, index) => (
																<Draggable
																	key={contain._id || index}
																	draggableId={
																		contain._id ||
																		`tag-${index}`
																	}
																	index={index}
																	isDragDisabled={
																		contain?.displayName ===
																		'All'
																			? false
																			: false
																	}
																	boundaries="hideScrollBar"
																>
																	{(provided, snapshot) => (
																		<div
																			ref={provided.innerRef}
																			{...provided.draggableProps}
																			className={`albumContain ${
																				snapshot.isDragging
																					? 'dragging'
																					: ''
																			}`}
																			style={{
																				...provided
																					.draggableProps
																					.style,
																			}}
																			onMouseEnter={() => {
																				setInfo((prev) => ({
																					...prev,
																					galleryTagHover:
																						{
																							...prev.galleryTagHover,
																							[index]: true,
																						},
																				}));
																			}}
																			onMouseLeave={() => {
																				setInfo((prev) => ({
																					...prev,
																					galleryTagHover:
																						{
																							...prev.galleryTagHover,
																							[index]: false,
																						},
																					showTagOptions: false,
																				}));
																			}}
																		>
																			<div
																				{...provided.dragHandleProps}
																				style={{
																					width: '14px',
																					height: '15px',
																					cursor:
																						contain?.displayName ===
																						'All'
																							? 'grab'
																							: 'grab',
																				}}
																			>
																				<img
																					src={sixDots}
																					alt="sixDots"
																				/>
																			</div>
																			<div
																				style={{
																					display: 'flex',
																					alignItems:
																						'center',
																					gap: '8px',
																				}}
																				onClick={() =>
																					handleClickAlbum(
																						contain,
																						'containName',
																					)
																				}
																			>
																				<p
																					className={
																						info?.albumContains ===
																						contain.displayName
																							? 'active'
																							: ''
																					}
																				>
																					{
																						contain.displayName
																					}
																				</p>
																				<p
																					className={
																						info?.albumContains ===
																						contain?.displayName
																							? 'count-active'
																							: 'count'
																					}
																				>
																					{
																						contain.imagesCount
																					}
																				</p>
																			</div>
																			{info?.galleryTagHover[
																				index
																			] &&
																				contain?.displayName !==
																					'All' && (
																					<Tooltip
																						open={
																							info?.showTagOptions
																						}
																						onOpenChange={() =>
																							setInfo(
																								(
																									prev,
																								) => ({
																									...prev,
																									showTagOptions:
																										!prev?.showTagOptions,
																								}),
																							)
																						}
																						title={
																							<div className="tagOptionsContainer">
																								<div className="tagOptionsEachOption">
																									<EditPen
																										style={{
																											color: 'var(--secondary-font)',
																										}}
																									/>
																									<p
																										onClick={() =>
																											setInfo(
																												(
																													prev,
																												) => ({
																													...prev,
																													editTagPopup: true,
																													activeTag:
																														contain,
																												}),
																											)
																										}
																									>
																										Edit
																										Tag
																									</p>
																								</div>
																								<div className="tagOptionsEachOption">
																									<TrashIcon />
																									<p
																										className="deleteTag"
																										onClick={() =>
																											setInfo(
																												(
																													prev,
																												) => ({
																													...prev,
																													deleteTagPopup: true,
																													activeTag:
																														contain,
																												}),
																											)
																										}
																									>
																										Delete
																										Tag
																									</p>
																								</div>
																							</div>
																						}
																						placement="bottom"
																						arrow={
																							false
																						}
																						color="transparent"
																						trigger={
																							'click'
																						}
																					>
																						<ThreeDotsIcon
																							style={{
																								cursor: 'pointer',
																							}}
																						/>
																					</Tooltip>
																				)}
																		</div>
																	)}
																</Draggable>
															))}
														{provided.placeholder}
													</div>
												)}
											</Droppable>
										</DragDropContext>
									</div>
									{!info?.isRearranging && (
										<div className="aboutAlbum">
											<div className="albumSearchCotainer">
												<div
													className={`searchContainer ${
														info?.showShearch ? 'expanded' : ''
													}`}
													onClick={() =>
														setInfo((prev) => ({
															...prev,
															showShearch: true,
														}))
													}
													style={{
														width: info?.showShearch ? '200px' : '',
													}}
												>
													<SearchIcon
														style={{ color: 'var(--secondary-font)' }}
													/>
													{info?.showShearch && (
														<input
															key={
																info?.showShearch
																	? 'search-visible'
																	: 'search-hidden'
															}
															type="text"
															placeholder="Search"
															value={info.searchValue}
															onChange={(e) =>
																handleSearch(e.target.value)
															}
															autoFocus
															onClick={(e) => e.stopPropagation()}
															onBlur={() =>
																setTimeout(() => {
																	setInfo((prev) => ({
																		...prev,
																		showShearch: false,
																		searchValue: '',
																	}));
																}, 200)
															}
														/>
													)}
												</div>

												<div
													className={`rearrangeManually ${
														info?.selectingImages && 'selected'
													}`}
													onClick={() => {
														setInfo((prev) => ({
															...prev,
															selectingImages: !prev?.selectingImages,
															selectedImages: [],
														}));
													}}
												>
													<SelectModeIcon />
													Select mode
												</div>

												<div
													onClick={handleRearrange}
													className="rearrangeManually"
												>
													<RearrangeIcon />
													Rearrange
												</div>
												<div style={{ position: 'relative' }}>
													<Tooltip
														title={
															<div
																ref={filtersOptionsRef}
																className="filterContainer"
															>
																{filterOptions.map((item) => {
																	const currentSortType =
																		info?.sortType || '';
																	const isSelected =
																		currentSortType.replace(
																			'-',
																			'',
																		) === item.value;
																	const isDescending =
																		currentSortType ===
																		`-${item.value}`;

																	return (
																		<div
																			key={item.value}
																			className={`file-filter-option-items ${
																				isSelected
																					? 'active'
																					: ''
																			}`}
																			onClick={(e) => {
																				e.stopPropagation();
																				handleFilter(
																					item.value,
																				);
																			}}
																		>
																			{isSelected && (
																				<div className="sortTypeIndicator"></div>
																			)}
																			<div
																				className={`option-value-wrapper ${
																					isSelected
																						? 'active'
																						: ''
																				}`}
																			>
																				{item.label}
																			</div>
																			{!item.noArrow &&
																				isSelected && (
																					<ArrowSvg
																						className={`sortType ${
																							isDescending
																								? 'sortType-up'
																								: ''
																						}`}
																					/>
																				)}
																		</div>
																	);
																})}
															</div>
														}
														placement="bottom"
														arrow={false}
														color="transparent"
														trigger="click"
													>
														<div
															onClick={() =>
																setInfo((prevInfo) => ({
																	...prevInfo,
																	showFilter:
																		!prevInfo.showFilter,
																}))
															}
															ref={filtersRef}
															className="rearrangeManually"
														>
															<NewFilterSvg
																stroke={'var(--secondary-font)'}
															/>
															Filter
														</div>
													</Tooltip>
												</div>

												<Tooltip
													title={
														<div
															className="galleryEditOptions"
															// ref={albumSettingsRef}
														>
															<div
																className="album-toggles"
																style={{
																	display: 'flex',
																	flexDirection: 'column',
																	gap: '16px',
																}}
															>
																<div
																	className="toggle-option"
																	style={{
																		display: 'flex',
																		justifyContent:
																			'space-between',
																		alignItems: 'center',
																		gap: '8px',
																	}}
																>
																	<span
																		style={{
																			color: 'var(--secondary-font)',
																			fontFamily:
																				'var(--primary-font-family)',
																			fontSize: '14px',
																			fontWeight: '400',
																			lineHeight: '16px',
																			textTransform:
																				'capitalize',
																		}}
																	>
																		Lock Album
																	</span>
																	<Switch
																		checked={
																			info?.activeAlbum
																				?.guestAccess
																				?.isEnabled
																		}
																		onClick={handleLockAlbum}
																		size="medium"
																		// style={{
																		// 	backgroundColor:
																		// 		!info.isEnabled
																		// 			? '#575858'
																		// 			: '#575858',
																		// }}
																	/>
																</div>
															</div>
															<li
																onClick={() => {
																	setInfo((prev) => ({
																		...prev,
																		showMainPopup: true,
																		showGalleryOptions: false,
																		showOptions: false,
																		galleryName:
																			info?.albumName || '',
																		isAlbumRename: true,
																	}));
																}}
															>
																<EditPen
																	style={{
																		color: 'var(--secondary-font)',
																	}}
																/>
																Rename Album
															</li>
															{info?.activeAlbum?.isPublished && (
																<li
																	onClick={() => {
																		setInfo((prev) => ({
																			...prev,
																			showShareAlbum: true,
																			showGalleryOptions: false,
																			showOptions: false,
																		}));
																	}}
																>
																	<ShareIcon />
																	Share Album
																</li>
															)}
															<li
																onClick={() =>
																	setInfo((prev) => ({
																		...prev,
																		showDownloadAlbum: true,
																		showGalleryOptions: false,
																		showOptions: false,
																		activeTagId:
																			albumDetails?.tags?.[0]
																				?._id,
																		originalDownload: false,
																		webviewDownload: true,
																	}))
																}
															>
																<DownloadIcon />
																Download album
															</li>
															<li onClick={handleLightRoomCopy}>
																<LightRoomIcon />
																Light Room Copy List
															</li>
															<li
																onClick={() =>
																	handleUploadCoverOpen('album')
																}
															>
																<AlbumCoverIcon />
																Album Cover
															</li>

															<hr
																style={{
																	border: '1px solid var(--stroke)',
																	opacity: '1',
																	width: '100%',
																}}
															/>

															<div
																onClick={() => {
																	setInfo((prev) => ({
																		...prev,
																		showDeleteAlbum: true,
																		showOptionsContainer: false, // Close options menu if it exists
																	}));
																}}
																style={{
																	display: 'flex',
																	alignItems: 'center',
																	gap: '4px',
																}}
															>
																<DeleteIcon />
																<span
																	style={{
																		color: '#A74A49',
																		cursor: 'pointer',
																	}}
																>
																	Delete Album
																</span>
															</div>
														</div>
													}
													placement="bottom"
													arrow={false}
													color="transparent"
													trigger={'click'}
													overlayStyle={{ zIndex: 997 }}
												>
													<div
														style={{ position: 'relative' }}
														// ref={albumSettingsIconRef}
														// onClick={() =>
														// 	setInfo((prevInfo) => ({
														// 		...prevInfo,
														// 		showAlbumSettings:
														// 			!prevInfo.showAlbumSettings,
														// 	}))
														// }
													>
														<p
															style={{ cursor: 'pointer' }}
															className="rearrangeManually"
														>
															<SettingsIcon />
															Album Settings
														</p>
														<div></div>
													</div>
												</Tooltip>
												<div
													className="rearrangeManually"
													onClick={handleHideAlbum}
												>
													<div className="albumStatusText">
														Album{' '}
														{info?.activeAlbum?.isPublished
															? 'Online'
															: 'Offline'}
													</div>
													<Switch
														checked={info?.activeAlbum?.isPublished}
														size="small"
													/>
												</div>
												{/* {info?.selectedImages?.length > 0 && (
													<div
														className="rearrangeManually"
														onClick={handleDeselect}
													>
														Deselect All
													</div>
												)} */}
											</div>
										</div>
									)}
								</div>

								<div
									// style={{
									// 	overflow: info?.isRearranging
									// 		? 'auto'
									// 		: info?.scrolledTillEnd
									// 		? 'auto'
									// 		: 'hidden',
									// 	height: info?.isRearranging ? '79vh' : '83vh',
									// }}
									className="galleryImagesContainer"
									id="galleryScrollTarget"
									onMouseEnter={() =>
										setInfo((prev) => ({
											...prev,
											isMouseInGallery: true,
										}))
									}
									onMouseLeave={() =>
										setInfo((prev) => ({
											...prev,
											isMouseInGallery: false,
										}))
									}
									style={{
										height: '90vh',
										overflow: 'auto',
									}}
									ref={rearrangeContainerRef}
								>
									<InfiniteScroll
										dataLength={imagesList?.docs?.length || 0}
										next={() => fetchMoreImages()}
										hasMore={imagesList?.hasNextPage || false}
										loader={
											<p style={{ textAlign: 'center', color: '#fff' }}>
												Loading
											</p>
										}
										resetInfinityScroll={info?.resetInfinityScroll}
										disableDrop={true}
										// height={'90vh'}
										scrollableTarget="galleryScrollTarget"
									>
										{!info.isRearranging ? (
											<ResponsiveMasonry
												columnsCountBreakPoints={{
													250: 1,
													500: 2,
													750: 3,
													1000: 4,
													1250: 5,
													1500: 6,
													1750: 7,
													2000: 8,
												}}
											>
												<Masonry gutter="20px" columnsCount={4}>
													<div
														className="imageContainer"
														onClick={handleNavigateUpload}
													>
														<div className="imageUpload">
															<CloudUpload className="uploadIcon" />
															<p>Add Photos</p>
														</div>
													</div>
													{info?.imagesList?.docs && !info?.albumLoading
														? info?.imagesList?.docs?.map(
																(image, index) => {
																	const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
																	const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_optimized?.key}?${params}`;
																	return (
																		<div
																			key={index}
																			id={`image-${image?._id}`}
																			data-image-id={
																				image?._id
																			}
																			className={`imageContainer ${
																				info.selectedImages.includes(
																					image?._id,
																				)
																					? 'selected'
																					: ''
																			}`}
																			onClick={(e) => {
																				e.stopPropagation();
																				if (
																					info.selectingImages
																				) {
																					handleImageSelect(
																						index,
																						image,
																					); // Use handleImageSelect if selectedImages > 0
																				} else {
																					handleExpandClick(
																						image?._id,
																						'single',
																					); // Use handleExpandClick otherwise
																				}
																			}}
																		>
																			<img
																				src={src}
																				alt={`Gallery image ${index}`}
																				style={{
																					width: '100%',
																					display:
																						'block',
																					borderRadius:
																						'12px',
																				}}
																				draggable={false}
																			/>
																			{info?.selectedImages?.includes(
																				image?._id,
																			) && (
																				<div className="selectedTickSvg">
																					<TickSvg />
																				</div>
																			)}
																			{info.selectingImages &&
																				!info?.selectedImages?.includes(
																					image?._id,
																				) && (
																					<div className="imageOverlay"></div>
																				)}
																			{/* {info?.selectedImages
																				?.length === 0 && (
																				<div
																					style={{
																						zIndex: 3,
																					}}
																					onClick={(
																						e,
																					) => {
																						e.stopPropagation();
																						handleImageSelect(
																							index,
																							image,
																						);
																					}}
																				>
																					<Tooltip
																						title="Click to Select"
																						placement="top"
																					>
																						<Checkbox
																							className={`rotating-circle ${
																								info.selectedImages.includes(
																									image?._id,
																								)
																									? 'checked'
																									: ''
																							}`}
																							checked={info.selectedImages.includes(
																								image?._id,
																							)}
																							style={{
																								borderRadius:
																									'50%', // Ensures round shape
																								width: '24px', // Set width
																								height: '24px', // Set height (must be equal to width)
																							}}
																						></Checkbox>
																					</Tooltip>
																				</div>
																			)} */}
																		</div>
																	);
																},
														  )
														: [...Array(10)].map((_, index) => (
																<div
																	key={index}
																	className="imageContainer"
																>
																	<Skeleton
																		width="100%"
																		height="200px"
																		style={{
																			'--highlight-color':
																				'gray',
																			'--base-color':
																				'transparent',
																		}}
																	/>
																</div>
														  ))}
												</Masonry>
											</ResponsiveMasonry>
										) : (
											<>
												{!info?.rearrangingLoading ? (
													<div
														className="rearrange-image-container-wrapper"
														ref={containerRef}
													>
														{[
															...info?.imagesList?.docs,
															...(info?.isImagesLess
																? dummyImagesArray
																: []),
														]
															// Filter out selected images during drag
															?.filter((image) => image && image._id)

															?.map((image, index) => {
																const params =
																	image?.isPlaceholderImg
																		? ''
																		: `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
																const src = image?.isPlaceholderImg
																	? ''
																	: `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_optimized?.key}?${params}`;

																const isSelected =
																	info.selectedImages.includes(
																		image?._id,
																	);

																return (
																	<>
																		{info.dropPlaceholder ===
																			index &&
																			info.isDragging && (
																				<div
																					className="drop-placeholder"
																					style={{
																						width: '200px',
																						height: '200px',
																						border: '2px dashed #fff',
																						borderRadius:
																							'4px',
																						margin: '5px',
																						backgroundColor:
																							'rgba(255,255,255,0.1)',
																					}}
																				/>
																			)}
																		<div
																			key={index}
																			className={`rearrange-image-container ${
																				isSelected
																					? 'selected'
																					: ''
																			}`}
																			style={{
																				width: '190px',
																				height: '250px',
																				position:
																					'relative',
																				cursor: isSelected
																					? 'grab'
																					: 'pointer',
																				opacity:
																					isSelected &&
																					info.isDragging
																						? 0.3
																						: 1,
																				padding: '10px',
																				gap: '15px',
																				visibility:
																					image?.isPlaceholderImg
																						? 'hidden'
																						: 'visible',
																			}}
																			onClick={() =>
																				handleImageSelect(
																					index,
																					image,
																				)
																			}
																			draggable={isSelected}
																			onDragStart={
																				handleDragStart
																			}
																			onDrag={handleDrag}
																			onDragEnd={
																				handleDragEnd
																			}
																		>
																			<img
																				src={src}
																				alt={`Gallery image ${index}`}
																				style={{
																					width: '100%',
																					height: '100%',
																					objectFit:
																						'cover',
																					borderRadius:
																						'8px',
																				}}
																				draggable={false}
																			/>
																		</div>
																	</>
																);
															})}

														{/* Dragging stack overlay */}
														{info.isDragging &&
															info.selectedImages.length > 0 && (
																<div
																	style={{
																		position: 'fixed',
																		left: info.dragPosition.x,
																		top: info.dragPosition.y,
																		zIndex: 1000,
																		pointerEvents: 'none',
																		transform:
																			'translate(-50%, -50%)',
																	}}
																>
																	{info.selectedImages
																		.slice(0, 3)
																		.map((imageId, idx) => {
																			const image =
																				info.imagesList.docs.find(
																					(img) =>
																						img._id ===
																						imageId,
																				);
																			const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
																			const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_optimized?.key}?${params}`;

																			return (
																				<div
																					key={imageId}
																					style={{
																						position:
																							'absolute',
																						width: '100px',
																						height: '100px',
																						border: '2px solid white',
																						borderRadius:
																							'4px',
																						backgroundColor:
																							'#fff',
																						boxShadow:
																							'0 2px 4px rgba(0,0,0,0.2)',
																						transform: `translate(${
																							idx *
																							info.stackOffset
																						}px, ${
																							idx *
																							info.stackOffset
																						}px)`,
																					}}
																				>
																					<img
																						src={src}
																						alt="Dragged image"
																						style={{
																							width: '100%',
																							height: '100%',
																							objectFit:
																								'cover',
																						}}
																					/>
																				</div>
																			);
																		})}
																	{info.selectedImages.length >
																		3 && (
																		<div
																			style={{
																				position:
																					'absolute',
																				top: '50%',
																				right: '-20px',
																				transform:
																					'translateY(-50%)',
																				background: '#666',
																				color: '#fff',
																				padding: '2px 6px',
																				borderRadius:
																					'10px',
																				fontSize: '12px',
																			}}
																		>
																			+
																			{info.selectedImages
																				.length - 3}
																		</div>
																	)}
																</div>
															)}
													</div>
												) : (
													<div>Loading.....</div>
												)}
											</>
										)}
									</InfiniteScroll>
								</div>
							</div>
						</div>
					))}
				{info.activeTab === 'Collections' &&
					(clientSelectionsData?.data?.length === 0 ? (
						<div className="noAlbumsMainContainer">
							{/* <div className="noAlbumContainer">
								<div className="noAlbumContainerTitle">Start upload images</div>
								<div className="noAlbumContainerDescription">
									It's quiet for now... You haven't missed anything yet! Create
									your first album to start organizing your memories
								</div>
							</div> */}
						</div>
					) : (
						<div className="galleryViewer">
							<div className="galleryNavbar">
								<div
									className="albumDetailsContainer"
									style={{ display: 'flex', flexDirection: 'column' }}
								>
									<div className="aboutAlbum">
										<div className="albumName">
											<p>{info?.clientSelectionName}</p>
											{/* <div
											style={{ position: 'relative' }}
											onClick={() =>
												setInfo((prevInfo) => ({
													...prevInfo,
													showGalleryOptions:
														!prevInfo.showGalleryOptions,
												}))
											}
										>
											<ThreeDotsIcon
												className="threeDotsIcon"
												style={{ cursor: 'pointer' }}
												onClick={() =>
													setInfo((prev) => ({
														...prev,
														clientSubscriptionOptions:
															!prev.clientSubscriptionOptions,
													}))
												}
											/>

											<div></div>
										</div> */}
										</div>

										<div className="albumSearchCotainer">
											<div
												style={{ position: 'relative' }}
												ref={settingsRef}
												onClick={() =>
													setInfo((prev) => ({
														...prev,
														clientSubscriptionOptions:
															!prev.clientSubscriptionOptions,
													}))
												}
											>
												<Tooltip
													title={
														<div
															className="galleryEditOptions"
															ref={optionsContainerRef}
														>
															<li
																onClick={handleLightRoomCopy}
																style={{
																	display: 'flex',
																	alignItems: 'center',
																	gap: '4px',
																}}
															>
																<LightRoomIcon />
																<span>Light Room Copy</span>
															</li>

															<li
																onClick={handleDownload}
																style={{
																	display: 'flex',
																	alignItems: 'center',
																	gap: '4px',
																}}
															>
																<DownloadIcon />
																<span>Download</span>
															</li>
														</div>
													}
													placement="bottom"
													arrow={false}
													color={'transparent'}
													trigger={'click'}
												>
													<p style={{ cursor: 'pointer' }}>
														Selection Settings
													</p>
												</Tooltip>
											</div>
											<div
												onClick={() =>
													setInfo((prevInfo) => ({
														...prevInfo,
														showShearch: !prevInfo.showShearch,
													}))
												}
												className="searchContainer"
												style={{
													width: info?.showShearch && '200px',
												}}
											>
												<SearchIcon
													style={{ color: 'var(--secondaryFont)' }}
												/>

												<input
													type="text"
													placeholder="Search"
													value={info.searchValue}
													onChange={(e) => handleSearch(e.target.value)}
													style={{
														display: info?.searchValue && 'block',
													}}
												/>
											</div>
										</div>
									</div>
								</div>
								<div
									className="galleryImagesContainer clientSelectionImagesContainer"
									id="galleryScrollTarget"
									ref={galleryScrollTargetRef}
									onMouseEnter={() =>
										setInfo((prev) => ({
											...prev,
											isMouseInGallery: true,
										}))
									}
									onMouseLeave={() =>
										setInfo((prev) => ({
											...prev,
											isMouseInGallery: false,
										}))
									}
								>
									<InfiniteScroll
										dataLength={clientSelectionImages?.docs?.length || 0}
										next={fetchMoreClientSelectionImages}
										hasMore={clientSelectionImages?.hasNextPage || false}
										loader={
											<p style={{ textAlign: 'center', color: '#fff' }}>
												Loading...
											</p>
										}
										scrollableTarget="galleryScrollTarget"
									>
										<ResponsiveMasonry
											columnsCountBreakPoints={{
												350: 1,
												750: 2,
												900: 3,
												1200: 4,
											}}
										>
											<Masonry gutter="10px">
												{info?.clientSelectionImages?.docs
													? info?.clientSelectionImages?.docs.map(
															(image, index) => {
																const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
																const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_optimized?.key}?${params}`;
																return (
																	<div
																		key={index}
																		className={`imageContainer ${
																			info.selectedImages.includes(
																				image?._id,
																			)
																				? 'selected'
																				: ''
																		}`}
																		onClick={() =>
																			handleImageSelect(
																				index,
																				image,
																			)
																		}
																	>
																		<img
																			src={src}
																			alt={`Gallery image ${index}`}
																			style={{
																				width: '100%',
																				display: 'block',
																			}}
																		/>
																		{info.isMouseInGallery && (
																			<div className="imageOverlay"></div>
																		)}
																	</div>
																);
															},
													  )
													: [...Array(10)].map((_, index) => (
															<div
																key={index}
																className="imageContainer"
															>
																<Skeleton
																	width="100%"
																	height="200px"
																/>
															</div>
													  ))}
											</Masonry>
										</ResponsiveMasonry>
									</InfiniteScroll>

									{/* {info.selectedImages?.length > 0 && (
										<div className="selectedImagesCotainer">
											<div className="selectedImagesCounter">
												<p
													onClick={() => handleClearSelectedImages()}
													style={{ cursor: 'pointer' }}
												>
													X
												</p>
												<p>{info.selectedImages.length} selected</p>
											</div>
											<div className="selectedImagesActions">
												<div onClick={handleExpandClick}>
													<ExpandIcon />
												</div>
												<div
													style={{ position: 'relative' }}
													ref={forwardIconRef}
												>
													<ForwardIcon onClick={handleForwardIcon} />

													{info.showForward && (
														<div
															className="forwardOptions"
															ref={forwardOptionsRef}
														>
															<li>Copy to client selection</li>
															<li>Move to Other Albums</li>
														</div>
													)}
												</div>
												<div
													style={{ position: 'relative' }}
													ref={pinIconRef}
												>
													<PinIcon onClick={handlePinIcon} />
													{info.showPin && (
														<div
															className="pinOptions"
															ref={pinSearchRef}
														>
															<div className="pinSearchContainer">
																<p>type to Search or create</p>
																<p
																	style={{
																		cursor: 'pointer',
																		marginRight: '5px',
																	}}
																	onClick={handlePinIcon}
																>
																	X
																</p>
															</div>
															{info?.albumTags?.map((tag) => (
																<div className="pinOptionsList">
																	<label className="checkboxLabel">
																		<input
																			type="checkbox"
																			checked={info?.selectedImagesTags?.includes(
																				tag?._id,
																			)}
																			onChange={() =>
																				handleTagChange(
																					tag?._id,
																				)
																			}
																		/>
																		<span className="checkboxText">
																			{tag?.displayName}
																		</span>
																	</label>
																</div>
															))}
														</div>
													)}
												</div>
												<div
													style={{ position: 'relative' }}
													ref={optionsIconRef}
												>
													<OptionsIcon onClick={handleOptionsIcon} />
													{info.showOptionsContainer && (
														<div
															className="optionsContainer"
															ref={optionsContainerRef}
														>
															<li>Download</li>
															<li>Set as cover</li>
															<li>Share</li>
															<li
																onClick={() =>
																	setInfo((prev) => ({
																		...prev,
																		showDeleteAlbum: true,
																	}))
																}
															>
																Delete
															</li>
														</div>
													)}
												</div>
											</div>
										</div>
									)} */}
								</div>
							</div>
						</div>
					))}
				{info?.activeTab === 'Videos' && (
					<GalleryVideos
						selectedVideo={info?.selectVideo}
						onUpdateVideoStatus={(value) => {
							videoToggle(value);
						}}
						removeSelectedVideoFromList={removeSelectedVideoFromList}
					/>
				)}
				{info.selectedImages.length > 0 && (
					<div className="selectedImagesCotainer">
						<div className="selectedImagesCounter">
							<p
								onClick={() => handleClearSelectedImages()}
								style={{ cursor: 'pointer' }}
							>
								X
							</p>
							<p>{info.selectedImages.length} selected</p>
						</div>
						{!info.isRearranging && (
							<div className="selectedImagesActions">
								{info?.selectedImages?.length === 1 && (
									<Tooltip
										title={
											<div className="galleryEditOptions">
												<li onClick={handleSetGalleryCover}>
													<AlbumCoverIcon />
													<span>Set as Gallery Cover</span>
												</li>
												<li onClick={handleSetAlbumCover}>
													<AlbumCoverIcon />
													<span>Set as Album Cover</span>
												</li>
											</div>
										}
										placement="top"
										trigger={'click'}
										arrow={false}
										color={'transparent'}
									>
										<div>
											<AlbumCoverIcon
												style={{ color: 'var(--primary-font)' }}
											/>
										</div>
									</Tooltip>
								)}
								<Tooltip
									title={
										<div className="listAlbumsContainer">
											<div className="moveToAlbumTitleContainer">
												<span className="moveToAlbumOptionsContainer">
													<span className="moveToAlbumTitle">
														{' '}
														Move {
															info.selectedImages.length
														} images{' '}
													</span>
													<RightArrow
														onClick={() =>
															handleMoveImageToAlbum(
																info?.selectedAlbumToMove,
															)
														}
													/>
												</span>
											</div>
											{sortByCustomIndex(albumImagesCount?.albums)?.map(
												(album, index) => {
													let src = null;
													if (album?.coverImage?._id) {
														const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
														src = `${galleryCredentials?.baseURL}/${tenantAlbums?.tenant_id}/${galleryId}/optimized/${album?.coverImage?.givenFileName}?${params}`;
													}
													return (
														<div
															className={`albumCard ${
																info.selectedAlbumId === album?._id
																	? 'active'
																	: ''
															}`}
															onClick={() =>
																handleAlbumClick(album?._id)
															}
														>
															<div className="albumCardContent">
																<div
																	style={{
																		backgroundImage: `url(${src})`,
																		backgroundSize: 'cover',
																		backgroundPosition:
																			'center',
																		backgroundRepeat:
																			'no-repeat',
																		width: '24px',
																		height: '24px',
																		borderRadius: '50%',
																		backgroundColor:
																			'var(--background-color)',
																	}}
																></div>
																<p className="albumName">
																	{album?.title}
																</p>
															</div>
															<Checkbox
																className="custom-checkbox-style"
																onChange={() =>
																	setInfo((prev) => ({
																		...prev,
																		selectedAlbumToMove:
																			album?._id,
																	}))
																}
																checked={
																	info.selectedAlbumToMove ===
																	album?._id
																}
															/>
														</div>
													);
												},
											)}
											<div
												className="createAlbumContainer"
												onClick={() =>
													setInfo((prev) => ({
														...prev,
														showCreateAlbum: true,
													}))
												}
											>
												<PlusIcon />
												<span className="createAlbumText">
													Create Album
												</span>
											</div>
										</div>
									}
									placement="top"
									arrow={false}
									color="transparent"
									trigger={'click'}
								>
									<div>
										<MoveToIcon />
									</div>
								</Tooltip>
								<div style={{ position: 'relative' }} ref={pinIconRef}>
									<PinIcon onClick={handlePinIcon} />
									{info.showPin && (
										<div className="pinOptions" ref={pinSearchRef}>
											<div className="pinSearchContainer">
												<input
													type="text"
													placeholder="type to Search or create"
													value={info.tagSearchValue}
													onChange={(e) =>
														setInfo((prev) => ({
															...prev,
															tagSearchValue: e.target.value,
														}))
													}
													onKeyDown={(e) => {
														if (e.key === 'Enter') {
															addTagHandlerFunction();
														}
													}}
												/>
												<p
													style={{
														cursor: 'pointer',
														marginRight: '5px',
													}}
													onClick={handlePinIcon}
												>
													X
												</p>
											</div>
											{tagsList?.list
												?.filter(
													(tag) =>
														tag?.displayName.toLowerCase() !== 'all' &&
														tag?.displayName
															?.toLowerCase()
															.includes(
																info.tagSearchValue.toLowerCase(),
															),
												)
												.map((tag) => (
													<div className="pinOptionsList">
														<label className="checkboxLabel">
															<input
																type="checkbox"
																checked={info?.selectedImagesTags?.includes(
																	tag?._id,
																)}
																onChange={() =>
																	handleTagChange(tag?._id)
																}
															/>
															<span className="checkboxText">
																{tag?.displayName}
															</span>
														</label>
													</div>
												))}
										</div>
									)}
								</div>
								<div onClick={() => handleExpandClick(null, 'multiple')}>
									<ExpandIcon />
								</div>
								<div onClick={handleDownload}>
									<DownloadIcon />
								</div>
								{info?.activeTab !== 'Collections' && (
									<div
										onClick={() =>
											setInfo((prev) => ({
												...prev,
												showImageDeletePopup: true,
											}))
										}
									>
										<DeleteIcon />
									</div>
								)}
								{/* <div style={{ position: 'relative' }} ref={optionsIconRef}>
									<OptionsIcon onClick={handleOptionsIcon} />
									{info.showAlbumOptionsMenu && (
										<div className="optionsContainer" ref={optionsContainerRef}>
											<li onClick={handleDownload}>Download</li>
											{info?.activeTab !== 'Client Selections' && (
												<li
													style={{
														cursor:
															info?.selectedImages.length === 1
																? 'pointer'
																: 'not-allowed',
													}}
													onClick={() => handleSetAlbumCover()}
												>
													Set Album cover
												</li>
											)}
											<li
												style={{
													cursor:
														info?.selectedImages.length === 1
															? 'pointer'
															: 'not-allowed',
												}}
												onClick={() => handleSetGalleryCover()}
											>
												Set Gallery cover
											</li>

											{info?.activeTab !== 'Client Selections' && (
												<li
													onClick={() =>
														setInfo((prev) => ({
															...prev,
															showImageDeletePopup: true,
														}))
													}
												>
													Delete
												</li>
											)}
										</div>
									)}
								</div> */}
								{/* <Tooltip
									title={
										<div
											className="optionsContainer"
											ref={optionsContainerRef}
											style={{ marginBottom: '15px' }}
										>
											<li onClick={handleDownload}>Download</li>
											{info?.activeTab !== 'Collections' && (
												<li
													style={{
														cursor:
															info?.selectedImages.length === 1
																? 'pointer'
																: 'not-allowed',
													}}
													onClick={() => handleSetAlbumCover()}
												>
													Set Album cover
												</li>
											)}
											<li
												style={{
													cursor:
														info?.selectedImages.length === 1
															? 'pointer'
															: 'not-allowed',
												}}
												onClick={() => handleSetGalleryCover()}
											>
												Set Gallery cover
											</li>

											{info?.activeTab !== 'Collections' && (
												<li
													onClick={() =>
														setInfo((prev) => ({
															...prev,
															showImageDeletePopup: true,
														}))
													}
												>
													Delete
												</li>
											)}
										</div>
									}
									placement="top"
									trigger={'click'}
									arrow={false}
									color={'transparent'}
								>
									<OptionsIcon />
								</Tooltip> */}
							</div>
						)}
					</div>
				)}
				{info.activeTab === 'Settings' && (
					<div className="settingsMainContainer">
						<div className="settingsContianer">
							<GalleryOverview
								info={info}
								handleGalleryChange={handleGalleryChange}
								handleCallToAction={handleCallToAction}
								handleClientSubscription={handleClientSubscription}
								handleManageCollaboratorPopup={handleManageCollaboratorPopup}
								handleLinkChange={handleLinkChange}
								handleGalleryDateChange={handleGalleryDateChange}
							/>

							<DesignOverviewComp info={info} handleLayoutType={handleLayoutType} />

							<UploadGalleryImageCover
								info={info}
								setInfo={setInfo}
								fileInputRef={fileInputRef}
								uploadGalleryCoverChangeHandler={uploadGalleryCoverChangeHandler}
								handleSetCoverPosition={handleSetCoverPosition}
								message={message}
								showUploadPhoto={info?.selectedImages.length > 0}
								uploadImageLoader={info?.uploadImageLoader}
								coverLoading={info?.coverLoading}
							/>

							<DeleteGalleryComponent
								galleryName={tenantAlbums?.title || ''}
								galleryId={galleryId}
								albumId={info?.activeGallery?.galleryData?._id}
							/>
						</div>
						<div className="settingsNavContianer">
							<li
								onClick={() => scrollToSection('gallery-overview')}
								className={info.activeLink === 'gallery-overview' ? 'active' : ''}
							>
								Gallery overview
							</li>
							<li
								onClick={() => scrollToSection('design')}
								className={info.activeLink === 'design' ? 'active' : ''}
							>
								Design
							</li>
							<li
								onClick={() => scrollToSection('upload-gallery-cover')}
								className={
									info.activeLink === 'upload-gallery-cover' ? 'active' : ''
								}
							>
								Gallery over
							</li>
							<li
								onClick={() => scrollToSection('delete')}
								className={info.activeLink === 'delete' ? 'active' : ''}
							>
								Delete
							</li>
						</div>
					</div>
				)}
				{info.activeTab === 'Ai People' && (
					<AiSelection
						galleryId={galleryId}
						galleryCredentials={galleryCredentials}
						link={`https://${info?.currentWorkspaceId}.ve.ai/gallery/${info?.activeGallery?.slug}/pre-register`}
						activeAlbumId={info?.activeAlbumId}
						activeTagId={info?.activeTagId}
						selectedFace={info?.selectedFace}
						selectedFaceId={info?.selectedFaceId}
						selectedImage={info?.selectedImage}
						selectedFaceChange={selectedFaceChange}
					/>
				)}
				{info.activeTab === 'Insights' && <Insights galleryId={galleryId} />}
			</div>

			<MainPopup
				open={info.editTagPopup}
				onClose={() => setInfo((prev) => ({ ...prev, editTagPopup: false }))}
				heading="Edit Tag"
				placeholder="Enter new tag name"
				value={info.activeTag?.displayName}
				onChange={(e) =>
					setInfo((prev) => ({
						...prev,
						activeTag: { ...prev.activeTag, displayName: e.target.value },
					}))
				}
				onSubmit={() => handleEditTag(info.activeTag._id, info.activeTag.displayName)}
			/>
			<ShareModal
				open={info.shareModal}
				closeModal={openShareModal}
				galleryId={galleryId}
				activeGallery={info?.activeGallery}
				handleCallToAction={handleCallToAction}
				handleClientSubscription={handleClientSubscription}
				handleManageCollaboratorPopup={handleManageCollaboratorPopup}
				handleLinkChange={handleLinkChange}
				data={info}
				isLightGallery={info.isLightGallery}
			/>
			<CreateAlbum
				open={info.showCreateAlbum}
				closeModal={() =>
					setInfo((prev) => ({
						...prev,
						showCreateAlbum: false,
					}))
				}
				galleryId={galleryId}
				tenantAlbums={info?.tenantAlbums}
				handleNewAlbumCreated={(newAlbum) => handleNewAlbumCreated(newAlbum)}
			/>

			{info?.showUploadCover && (
				<UploadGalleryImageCover
					info={info}
					setInfo={setInfo}
					fileInputRef={fileInputRef}
					uploadGalleryCoverChangeHandler={uploadGalleryCoverChangeHandler}
					handleSetCoverPosition={handleSetCoverPosition}
					message={message}
					title={info.coverType === 'gallery' ? 'Gallery Cover' : 'Album Cover'}
					imageURL={info.imageURL}
					isLoading={info.isLoadingCover}
					open={info.showUploadCover}
					showUploadPhoto={info?.selectedImages?.length > 0 && !info?.noImageSelected}
					onClose={() =>
						setInfo((prev) => ({
							...prev,
							showUploadCover: false,
							noImageSelected: false,
						}))
					}
					style={{ position: 'absolute', top: '60%', left: '0', right: '0', bottom: '0' }}
					uploadImageLoader={info?.uploadImageLoader}
					coverLoading={info?.coverLoading}
				/>
			)}

			<CollaboratorPopup
				open={info?.showCollaborators}
				closeModal={handleManageCollaboratorPopup}
				galleryId={galleryId}
				setCollaborator={(data) => handleManageCollaborator(data)}
			/>
			<DeletePopup
				open={info?.showDeleteAlbum}
				closeModal={() => setInfo((prev) => ({ ...prev, showDeleteAlbum: false }))}
				galleryId={galleryId}
				isTagDelete={false}
				title={'Album'}
				paragraph={'Images'}
				handleDelete={handleDeleteAlbum}
			/>
			<DeletePopup
				open={info.deleteTagPopup}
				closeModal={() => setInfo((prev) => ({ ...prev, deleteTagPopup: false }))}
				galleryId={galleryId}
				title={'Delete Tag'}
				isTagDelete={true}
				paragraph={'Are you sure you want to delete this tag?'}
				selectedDropDownValue={info.selectedDropDownValue}
				handleDeleteTypeChange={handleDeleteTypeChange}
				handleDelete={() =>
					handleDeleteTag(info.activeTag._id, info?.activeAlbum?.slug, 'remove_images')
				}
			/>
			<MainPopup
				open={info.showMainPopup}
				heading={
					info.isDatePopup
						? info.dateType === 'galleryDate'
							? 'Gallery Date'
							: 'Expiry Date'
						: info.isAlbumRename
						? 'Rename Album'
						: 'Rename Gallery'
				}
				placeholder={
					info.isDatePopup
						? 'Select date'
						: info.isAlbumRename
						? 'Album Name'
						: 'Gallery Name'
				}
				value={
					info.isDatePopup
						? info.dateType === 'galleryDate'
							? info.galleryDate
							: info.expiryDate
						: info.galleryName
				}
				inputType={info.isDatePopup ? 'date' : 'text'}
				showCalendarIcon={info.isDatePopup}
				onChange={(e) => {
					const value = e.target.value;
					setInfo((prev) => ({
						...prev,
						galleryName: value,
						[info.dateType === 'galleryDate' ? 'galleryDate' : 'expiryDate']: value,
					}));

					// // Add debounced API call for album rename
					// if (info.isAlbumRename) {
					// 	handleDebouceFunctionCall(albumChanges, value);
					// }
				}}
				onSubmit={async () => {
					if (info.isAlbumRename) {
						try {
							const response = await albumChanges(info.galleryName);

							if (response?.[0] === true) {
								// Only update UI if API call was successful
								handleClickAlbum(
									{
										title: info.galleryName,
										_id: info.activeAlbumId,
									},
									'albumName',
								);
								showMessage('success', 'Album renamed successfully');
							}
						} catch (error) {
							showMessage('error', 'Error renaming album');
						}
					} else if (info.isDatePopup) {
						const dateValue =
							info.dateType === 'galleryDate' ? info.galleryDate : info.expiryDate;
						handleGalleryDateChange(
							dateValue,
							null,
							info.dateType === 'galleryDate' ? 'createdAt' : 'dueDate',
						);
					} else {
						await updateGallery(info.galleryName);
					}
					setInfo((prev) => ({
						...prev,
						showMainPopup: false,
						isDatePopup: false,
						isAlbumRename: false,
						dateType: '',
						galleryName: '',
						galleryDate: '',
						expiryDate: '',
					}));
				}}
				onClose={() =>
					setInfo((prev) => ({
						...prev,
						showMainPopup: false,
						isDatePopup: false,
						isAlbumRename: false,
						dateType: '',
						galleryName: '',
						galleryDate: '',
						expiryDate: '',
					}))
				}
			/>
			<GalleryStyles
				open={info.showGalleryStyles}
				onClose={() => setInfo((prev) => ({ ...prev, showGalleryStyles: false }))}
				themeMode={info?.themeMode}
				handleLayoutType={handleLayoutType}
				gridStyle={info?.gridStyle}
				thumbnailSize={info?.thumbnailSize}
				gridSpacing={info?.gridSpacing}
			/>

			<DeletePopup
				open={info.showDeletePopup}
				closeModal={() => setInfo((prev) => ({ ...prev, showDeletePopup: false }))}
				title={'Gallery'}
				paragraph={'Albums'}
				handleDelete={handleDeleteGallery}
			/>

			<ShareAlbum
				open={info.showShareAlbum}
				onClose={() => setInfo((prev) => ({ ...prev, showShareAlbum: false }))}
				link={getShareLink()}
				onCopyLink={handleCopyAlbumLink}
				shouldShowPin={info?.activeAlbum?.guestAccess?.isEnabled}
				galleryId={galleryId}
				albumSlug={info?.activeAlbum?.slug}
				albumId={info?.activeAlbum?._id}
			/>

			<MoveToAlbumPopup
				open={info?.showMoveToAlbum}
				closeModal={() => setInfo((prev) => ({ ...prev, showMoveToAlbum: false }))}
				galleryId={galleryId}
				albums={albumImagesCount?.albums}
				albumName={info?.albumName}
				moveImageToAlbum={(e) => handleMoveImageToAlbum(e)}
			/>

			<DownloadAlbum
				open={info.showDownloadAlbum}
				onClose={() =>
					setInfo((prev) => ({
						...prev,
						showDownloadAlbum: false,
					}))
				}
				onDownload={handleDownloadAlbum}
				onTagSelect={(tagId) => setInfo((prev) => ({ ...prev, activeTagId: tagId }))}
				onDownloadTypeChange={handleDownloadTypeChange}
				albumDetails={albumDetails}
				originalDownload={info.originalDownload}
				webviewDownload={info.webviewDownload}
				activeTagId={info.activeTagId}
				isLightGallery={info.isLightGallery}
			/>
			<ShowLightRoomCopy
				open={info.showLightRoomCopy}
				onClose={() => setInfo((prev) => ({ ...prev, showLightRoomCopy: false }))}
				lightroomCopyList={info.lightroomCopyList}
				onCopyList={handleCopyLightRoomList}
			/>
			<DeleteAlbumImagesPopup
				open={info?.showImageDeletePopup}
				closeModal={() => setInfo((prev) => ({ ...prev, showImageDeletePopup: false }))}
				galleryId={galleryId}
				title={'Permanently Delete All the selected images?'}
				paragraph={
					'You cannot undo this action.All your photos in this album lined to this label will be lost'
				}
				handleDeleteImages={handleAlbumDelete}
			/>
			{info?.isGalleryViewer && (
				<GalleryViewer
					open={info?.isGalleryViewer}
					closeModal={() => handleCloseGalleryViewer()}
					selectedImage={info?.currentExpandImage}
					currentSelectedImages={
						info?.selectedImages?.length > 0 ? info?.selectedImages : null
					}
					aiFace={false}
					activeGalleryId={galleryId}
					activeAlbumId={info?.activeAlbumId}
					tagId={info?.activeTagId}
					handleOpenUploadCover={openUploadCoverPhoto}
					handleClickAlbum={handleClickAlbum}
				/>
			)}
			{info?.videoUploadPopup && (
				<VideoUploadPopup
					isOpen={info?.videoUploadPopup}
					closeModal={() => setInfo((prev) => ({ ...prev, videoUploadPopup: false }))}
					galleryId={galleryId}
					selectedVideo={null}
					updateSelectedVideo={updateSelectedVideo}
				/>
			)}
		</>
	);
};

export default memo(GalleryPage);
