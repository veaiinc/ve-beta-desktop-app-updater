import React, { useState, useEffect, useRef, useContext, useCallback, Children, memo } from 'react';
import { ReactComponent as ShareIcon } from '../../../assets/svg/gallery/share.svg';
import sixDots from '../../../assets/svg/gallery/sixdots.svg';
import { ReactComponent as ThreeDotsIcon } from '../../../assets/svg/gallery/threeDots.svg';
import { ReactComponent as SearchIcon } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as FilterIcon } from '../../../assets/svg/chat/filter.svg';
import { ReactComponent as ExpandIcon } from '../../../assets/svg/gallery/expand.svg';
import { ReactComponent as ForwardIcon } from '../../../assets/svg/gallery/forward.svg';
import { ReactComponent as PinIcon } from '../../../assets/svg/gallery/pin.svg';
import { ReactComponent as DragIcon } from '../../../assets/svg/gallery/drag.svg';
import { ReactComponent as RotatingCircle } from '../../../assets/svg/gallery/rotating-circle.svg';
import { ReactComponent as OptionsIcon } from '../../../assets/svg/gallery/dotsThree.svg';
import { ReactComponent as CloudUpload } from '../../../assets/svg/Settings/CloudUpload.svg';
import { ReactComponent as OpenEye } from '../../../assets/svg/gallery/open-eye.svg';
import { ReactComponent as CrossedOpenEye } from '../../../assets/svg/gallery/crossedOpenEye.svg';
import { ReactComponent as GalleryPreview } from '../../../assets/svg/gallery/galleryPreview.svg';
import { ReactComponent as EditPen } from '../../../assets/svg/gallery/editpen.svg';
import { ReactComponent as ChangeCalender } from '../../../assets/svg/gallery/changeCalender.svg';
import { ReactComponent as BrushIcon } from '../../../assets/svg/gallery/brush.svg';
import { ReactComponent as TrashIcon } from '../../../assets/svg/gallery/delete-red.svg';
import { ReactComponent as DownloadIcon } from '../../../assets/svg/gallery/download2.svg';
import { ReactComponent as LightRoomIcon } from '../../../assets/svg/gallery/light-room.svg';
import { ReactComponent as AlbumCoverIcon } from '../../../assets/svg/gallery/changeAlbumCover.svg';
import { ReactComponent as DeleteIcon } from '../../../assets/svg/gallery/delete-red.svg';
import { ReactComponent as LockIcon } from '../../../assets/svg/gallery/lockIcon.svg';
import { ReactComponent as ArrowsOut } from '../../../assets/svg/gallery/arrowsOut.svg';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ReactComponent as UpArrow } from '../../../assets/svg/workflow/downArrow.svg';
import { Result, theme, Tooltip } from 'antd';
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
import UploadAlbumImageCover from '../../components/gallery/galleryPage/UploadAlbumImageCover';
import MainPopup from '../../components/modalsV2/gallery/RenameGallery';
import ShareAlbum from '../../components/modalsV2/gallery/ShareAlbum';
import GalleryStyles from '../../components/modalsV2/gallery/GalleryStyles';
import DownloadAlbum from '../../components/modalsV2/gallery/DownloadAlbum';
import DeleteAlbumImagesPopup from '../../components/modalsV2/gallery/DeleteAlbumImagesPopup';
import ToggleSlider from '../../components/input/slider';
import { Switch } from 'antd';
import ShowLightRoomCopy from '../../components/modalsV2/gallery/ShowLightRoomCopy';
import { getCurrentWorkspaceId } from '../../../helpers';
import GridImage from '../../../assets/images/workflow_builder/dotgrid.png';
import { message } from '../../components/globalComponents/CustomToast';
// import EarnAndShareOverlay from './galleryPage/EditAndShareOverlay';

const workspaceId = localStorage.getItem('workspaceId');

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
		},
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
		profileInfo: { userWorkSpaceList, getTenantSettings, tennantSettingsData },
	} = useContext(Context);
	const [info, setInfo] = useState({
		albumName: '',
		albumContains: 'All',
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
		isLightGallery: location?.state?.isLightGallery || false,
		activeAlbumId: tenantAlbums?.albums?.[0]?._id,
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
		zoom: 1,
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
		isDragging: false,
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
		activeAlbumId: null,
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
		showDeleteAlbum: false,
		isAlbumHidden: false,
		showGalleryStyles: false,
		themeMode: 'dark',
		showCoverButton: false,
		showAlbumOptionsMenu: false,
		showAlbumSettings: false,
		currentWorkspaceId: null,
		galleryLink: null,
		clientSubscriptionOptions: false,
		imageProcessingStatus: {
			numberOfImagesGroupedFaces: 0,
			numberOfImagesPeoples: 0,
		},
		scrolledTillEnd: false,
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
	useEffect(() => {
		if (galleryId) {
			getImageProcessingStatus(galleryId);
		}

		const handleScroll = (e) => {
			const container = document.querySelector('.galleryContainer');
			if (!container) return;

			const { scrollTop, scrollHeight, clientHeight } = container;

			const isEndOfPage = scrollTop + clientHeight >= scrollHeight - 10;
			const isStartOfPage = scrollTop === 0;

			setInfo((prev) => {
				if (isEndOfPage && prev.scrolledTillEnd !== true) {
					return { ...prev, scrolledTillEnd: true };
				}
				if (isStartOfPage && prev.scrolledTillEnd !== false) {
					return { ...prev, scrolledTillEnd: false };
				}
				return prev;
			});
		};

		const timeoutId = setTimeout(() => {
			const container = document?.querySelector('.galleryContainer');
			if (container) {
				container?.addEventListener('scroll', handleScroll);
				handleScroll();
			}
		}, 100);

		return () => {
			clearTimeout(timeoutId);
			const container = document?.querySelector('.galleryContainer');
			if (container) {
				container?.removeEventListener('scroll', handleScroll);
			}
		};
	}, []);

	const data = [
		{ name: 'Albums', number: albumImagesCount?.albums?.length },
		// { name: 'Videos', number: 2 },
		// { name: 'Slide Show', number: 1 },
		{ name: 'Client Selections', number: clientSelectionsData?.totalDocs },
		{
			name: 'Ai People',
			number:
				imageProcessingStatus?.numberOfImagesPeoples > 0
					? parseInt(
							(imageProcessingStatus?.numberOfImagesGroupedFaces /
								imageProcessingStatus?.numberOfImagesPeoples) *
								100,
							0,
					  ) + '%'
					: '0',
		},
		{
			name: 'breaker',
		},
		{
			name: 'Insights',
			number: '',
		},
	];

	const galleryOptions = [
		{
			icon: <EditPen />,
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
		const childrenContainer = document.querySelector('.childrenContainer');
		if (childrenContainer) {
			const originalWidth = childrenContainer.style.maxWidth;
			childrenContainer.style.maxWidth = '80vw';
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
		if (info?.activeTab === 'Client Selections' && info?.clientSelectionID) {
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
		if (!albumImagesCount) {
			getAlbumImagesCount(galleryId);
		}
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
		if (!tenantAlbums || tenantAlbums?._id !== galleryId) {
			getAlbums(galleryId).then((response) => {
				if (response?.[0] === 404 && response?.[1]?.message === 'gallery not found') {
					navigate('/galleries');
				}
			});
			getAlbumImagesCount(galleryId);
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
		if (tenantAlbums && !info?.activeAlbumId) {
			setInfo((prev) => ({
				...prev,
				albumName: tenantAlbums?.albums?.[0]?.title,
				activeAlbumId: tenantAlbums?.albums?.[0]?._id,
				activeAlbum: tenantAlbums?.albums?.[0],
				tenantAlbums: tenantAlbums?.albums,
				albumSlug: tenantAlbums?.albums?.[0]?.slug,
				isPublished: tenantAlbums?.isPublished,
				isOnline: tenantAlbums?.isPublished,
			}));
		}
		// ... rest of the effect
	}, [tenantPreferences]);

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
				themeMode: layoutSettings?.theme,
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
				albumContains: albumDetails?.tags?.[0]?.displayName,
				albumTagId: albumDetails?.tags?.[0]?._id,
				sortType: albumDetails?.tags?.[0]?.sortType,
				albumTags: albumDetails?.tags,
			}));
		}
	}, [info?.activeAlbumId]);

	useEffect(() => {
		if (info?.albumTagId && info?.activeAlbumId && info?.activeTab === 'Albums') {
			getGalleryImages(
				galleryId,
				info?.activeAlbumId,
				info?.albumTagId,
				info?.page,
				info?.limit,
				'',
				true,
			);
		}
		if (imagesList) {
			setInfo((prev) => ({
				...prev,
				imagesList: imagesList,
			}));
		}
	}, [info?.albumTagId, info?.activeAlbumId, info?.activeTab]);

	useEffect(() => {
		if (imagesList) {
			setInfo((prev) => ({
				...prev,
				imagesList: imagesList,
			}));
		}
	}, [imagesList]);

	useEffect(() => {
		if (albumDetails) {
			setInfo((prev) => ({
				...prev,
				albumContains: albumDetails?.tags?.[0]?.displayName,
				albumTagId: albumDetails?.tags?.[0]?._id,
				sortType: albumDetails?.tags?.[0]?.sortType,
				albumTags: albumDetails?.tags,
			}));
		}
	}, [albumDetails]);

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

		if (info?.albumFullScreen) {
			gsap.to('.albums', {
				height: dynamicHeightFunc(),
				flexWrap: 'wrap',
				duration: 0.3,
				ease: 'power2.out',
			});
		} else if (tenantAlbums) {
			const t1 = gsap.timeline();
			t1.to('.album', {
				opacity: '0.7',
			});
			t1.to('.albums', {
				height: '160px',
				duration: 0.3,
				ease: 'power2.out',
			});

			t1.to('.album', {
				opacity: 1,
				ease: 'power2.out',
			});
			t1.to('.albums', {
				flexWrap: 'nowrap',
				opacity: 1,
				delay: 0.4,
				ease: 'power2.out',
			});
		}
	}, [info?.albumFullScreen]);
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

	// const handleHideAlbum = async () =>
	// 	console.log('Current isPublished:', info?.isPublished);
	// 	const payload = {
	// 		isPublished: !info?.isPublished,
	// 	};

	// 	const response = await editAlbum(payload, galleryId, info?.activeAlbumId);
	// 	if (response?.[0]) {
	// 		setInfo((prev) => {
	// 			const newState = {
	// 				...prev,
	// 				isPublished: !prev.isPublished,
	// 				showGalleryOptions: false,
	// 			};
	// 			console.log('New State:', newState);
	// 			return newState;
	// 		});
	// 		message.success('Album visibility updated successfully');
	// 	} else {
	// 		message.error('Failed to update album visibility');
	// 	}
	// };
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
					showGalleryOptions: false,
					showOptionsContainer: true,
				}));

				// Refresh data without changing the active album
				await Promise.all([getAlbumImagesCount(galleryId), getAlbums(galleryId)]);

				message.success('Album visibility updated successfully');
			} else {
				message.error('Failed to update album visibility');
			}
		} catch (error) {
			console.error('Error updating album visibility:', error);
			message.error('An error occurred while updating album visibility');
		}
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
				message.success('Album access updated successfully');
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
				message.error('Failed to update album access');
			}
		} catch (error) {
			console.error('Error updating album access:', error);
			message.error('An error occurred while updating album access');
		}
	}, [galleryId, info?.activeAlbumId, info?.activeAlbum?.guestAccess?.isEnabled]);

	const handleOnlineToggle = useCallback(async () => {
		const newOnlineState = !info?.isOnline;

		// Show loading message
		message.loading('Updating gallery status...');

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

			if (response?.[0]) {
				await getAlbums(galleryId);

				message.success(`Gallery is now ${newOnlineState ? 'online' : 'offline'}`);
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

				message.error(response?.[1]?.message || 'Failed to update gallery status');
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
			message.error('Failed to update gallery status');
		}
	}, [info.isOnline, galleryId, tenantAlbums?.albums]);

	// ... rest of the code ...
	const handleImageSelect = (index, images) => {
		setInfo((prevInfo) => {
			const isDeselecting = prevInfo?.selectedImages?.includes(images?._id);
			const newSelectedImages = isDeselecting
				? prevInfo?.selectedImages?.filter((i) => i !== images?._id)
				: [...prevInfo?.selectedImages, images?._id];

			// Handle tags differently for client selections vs regular albums
			let newSelectedImagesTags;
			if (info.activeTab === 'Client Selections') {
				// For client selections, don't process tags
				newSelectedImagesTags = prevInfo?.selectedImagesTags || [];
			} else {
				// For regular albums, process tags as before
				if (isDeselecting) {
					const remainingImages = info?.imagesList?.docs.filter(
						(img) => newSelectedImages.includes(img._id) && img._id !== images?._id,
					);
					newSelectedImagesTags = [
						...new Set(
							remainingImages
								.filter((img) => img.galleryTags) // Add null check
								.flatMap((img) => img.galleryTags)
								.map((tag) => tag._id),
						),
					];
				} else {
					newSelectedImagesTags = [
						...new Set([
							...(prevInfo?.selectedImagesTags || []),
							...(images?.galleryTags?.map((tag) => tag._id) || []), // Add null check
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

	const handleNewAlbumCreated = (newAlbum) => {
		setInfo((prev) => ({
			...prev,
			activeTab: 'Albums',
			albumSlug: newAlbum?.slug,
			albumName: newAlbum?.title,
			activeAlbumId: newAlbum?._id,
			activeAlbum: newAlbum,
		}));
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
			message.error('Publish the Gallery To Share');
		}
	};
	const handleClearSelectedImages = () => {
		setInfo((prevInfo) => ({ ...prevInfo, selectedImages: [], showAlbumOptionsMenu: false }));
	};
	const handleExpandClick = (selectedImageId = null, type) => {
		if (type === 'single' || info?.selectedImages?.length === 1) {
			navigate(
				`/galleries/${galleryId}/${info?.activeAlbumId}/gallery-viewer?tagId=${
					info?.albumTagId
				}&image=${selectedImageId || info?.selectedImages?.[0]}`,
			);
		} else {
			navigate(
				`/galleries/${galleryId}/${info?.activeAlbumId}/gallery-viewer?tagId=${info?.albumTagId}`,
				{ state: { selectedImages: info?.selectedImages } },
			);
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
			selectedImages: [],
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
		const uploadUrl =
			info?.albumContains === 'All'
				? `/galleries/${galleryId}/${info?.activeAlbumId}/upload-photos?light-gallery=${
						location?.state?.isLightGallery ? true : false
				  }`
				: `/galleries/${galleryId}/${info?.activeAlbumId}/upload-photos?tag=${
						info?.albumContains
				  }?light-gallery=${location?.state?.isLightGallery ? true : false}`;

		// Open in new tab
		window.open(uploadUrl, '_blank');
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
				message.warning('Gallery name is too long');
				return false;
			}

			// Set processing flag
			handleGalleryChange.isProcessing = true;

			try {
				message.loading('Renaming gallery...');

				const payload = {
					title: value,
				};

				// Make single API call
				const response = await postGallery(payload, galleryId);

				if (response?.[0]) {
					// Update UI state directly without additional API call
					setInfo((prev) => ({
						...prev,
						activeGallery: {
							...prev.activeGallery,
							title: value,
						},
						showMainPopup: false,
					}));

					message.success('Gallery renamed successfully');
				} else {
					message.error(response?.[1]?.message || 'Failed to rename gallery');
				}
			} catch (error) {
				console.error('Error renaming gallery:', error);
				message.error('An unexpected error occurred');
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
				message.success('Gallery renamed successfully');
				await getGalleries({}, true);
			} else {
				message.error('Failed to rename gallery');
			}
			return response;
		} catch (error) {
			console.error('Error updating gallery:', error);
			message.error('Failed to rename gallery');
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
				message.success('edited preferences');
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

	// ... existing code ...

	// ... existing code ...

	// ... existing code ...

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
				message.warning('Album name is too long');
				return false;
			}

			// Set processing flag
			albumChanges.isProcessing = true;

			try {
				message.loading('Renaming album...');

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
					message.success('Album renamed successfully');

					// Refresh album data
					await Promise.all([getAlbumImagesCount(galleryId), getAlbums(galleryId)]);
				} else {
					// Show error message
					message.error(response?.[1]?.message || 'Failed to rename album');
				}
			} catch (error) {
				console.error('Error renaming album:', error);
				message.error('An unexpected error occurred');
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
			message.success('Album link copied to clipboard');
		} catch (err) {
			// Fallback for older browsers or when clipboard API fails
			const textArea = document.createElement('textarea');
			textArea.value = albumLink;
			document.body.appendChild(textArea);
			textArea.select();

			try {
				document.execCommand('copy');
				message.success('Album link copied to clipboard');
			} catch (err) {
				message.error('Failed to copy link');
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

			message.loading('Downloading album...');

			const payload = {
				imageType: info?.originalDownload ? 'original' : 'optimized',
			};

			const response = await getDownloadLinkForTag(
				payload,
				galleryId,
				info?.activeAlbumId,
				info?.activeTagId || info?.albumTagId,
			);

			if (response?.[0] === true && response?.[1]?.downloadId) {
				const region = localStorage.getItem('region');
				const regionPath = region === 'ap-south-1' ? 'in' : 'us';
				const downloadUrl = `https://downloads.ve.ai/${regionPath}/${response?.[1]?.downloadId}`;
				window.open(downloadUrl, '_blank');

				message.success('Download started');

				setInfo((prev) => ({
					...prev,
					showDownloadAlbum: false,
					isDownloading: false,
				}));
			} else {
				message.error('Failed to generate download link');
				setInfo((prev) => ({
					...prev,
					isDownloading: false,
				}));
			}
		} catch (error) {
			console.error('Download error:', error);

			message.error('Something went wrong, please try again later');
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
			message.loading('Fetching image list...');

			let response;
			if (info.activeTab === 'Client Selections' && info.clientSelectionID) {
				// Check if we have client selection images
				if (!info.clientSelectionImages?.docs?.length) {
					message.warning('No images found in this client selection');
					return;
				}

				const response = await getClientSelectionLightRoomCopy(info.clientSelectionID);

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

				message.success('Image list fetched successfully');
				return;
			}

			// Handle regular album case
			if (!info.activeAlbumId) {
				message.error('No active album selected');
				return;
			}

			// Get lightroom copy list for regular albums
			await getLightroomCopyList(galleryId, info.activeAlbumId);

			if (clientSelectionLightRoomCopy) {
				setInfo((prev) => ({
					...prev,
					lightroomCopyList: clientSelectionLightRoomCopy,
					showLightRoomCopy: true,
					showOptionsContainer: false,
				}));

				message.success('Image list fetched successfully');
			} else {
				message.error('Failed to fetch lightroom copy list');
			}
		} catch (error) {
			console.error('Error fetching lightroom copy list:', error);

			message.error('Failed to fetch lightroom copy list');
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
					message.success('Lightroom list copied successfully!');
					setInfo((prev) => ({
						...prev,
						showLightRoomCopy: false,
						showOptionsContainer: true,
					}));
				})
				.catch(() => {
					message.error('Failed to copy list');
				});
		} else {
			message.warning('No items to copy');
		}
	};

	// ... existing code ...

	// ... existing code ...

	// const uploadAlbumCoverChangeHandler = async (e) => {
	// 	const image = e.target.files[0];
	// 	if (!image) return;

	// 	message.loading({
	// 		content: 'Uploading album cover image..',
	// 		key: 'coverUpload',
	// 	});

	// 	try {
	// 		// Reset existing image data
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			crop: { x: 0, y: 0 },
	// 			zoom: 1,
	// 			uploadImageId: null,
	// 			imageURL: '',
	// 			coverImageDetails: null,
	// 			coverPhoto: true,
	// 			isLoadingCover: true,
	// 		}));

	// 		const batchId = randomize('Aa0', 10);

	// 		// Check for duplicate images first
	// 		const duplicateImage = await getImageDuplicatesList(galleryId, info.activeAlbumId);
	// 		const isHavingDuplicateImage = duplicateImage?.[1]?.find(
	// 			(item) => item?.displayName === image?.name,
	// 		);

	// 		if (isHavingDuplicateImage) {
	// 			getImageDetail(isHavingDuplicateImage?._id);
	// 			setInfo((prev) => ({
	// 				...prev,
	// 				uploadImageId: isHavingDuplicateImage?._id,
	// 				isLoadingCover: false,
	// 			}));
	// 			message.destroy('coverUpload');
	// 			return;
	// 		}

	// 		// Get gallery tags and upload image
	// 		const responseGalleryTags = await getGalleryTagsList(galleryId);
	// 		if (!responseGalleryTags?.[0]) {
	// 			throw new Error('Failed to get gallery tags');
	// 		}

	// 		const allTagId = responseGalleryTags?.[1]?.find(
	// 			(item) => item.displayName === 'All',
	// 		)?._id;

	// 		if (!allTagId) {
	// 			throw new Error('All tag not found');
	// 		}

	// 		const uploadPayload = {
	// 			originalFileName: image?.name,
	// 			originalDateTime: moment(image?.['originalDate']).unix() || 0,
	// 			uploadBatchId: batchId,
	// 			tag_ids: [allTagId],
	// 			isAIFacesEnabled: true,
	// 		};

	// 		const signedURLUpload = await getUploadImageSignUrl(
	// 			galleryId,
	// 			info.activeAlbumId,
	// 			uploadPayload,
	// 		);

	// 		if (!signedURLUpload?.[0]) {
	// 			throw new Error('Failed to get signed URL');
	// 		}

	// 		// Upload the image
	// 		await axios.put(signedURLUpload[1]['signedUrl'], image, {
	// 			headers: {
	// 				'Content-Type': image?.type,
	// 			},
	// 		});

	// 		const uploadedImageId = signedURLUpload?.[1]?._id;

	// 		setInfo((prev) => ({
	// 			...prev,
	// 			uploadImageId: uploadedImageId,
	// 			coverPhoto: true,
	// 		}));

	// 		// Wait for image processing
	// 		let attempts = 0;
	// 		const maxAttempts = 10;
	// 		while (attempts < maxAttempts) {
	// 			await new Promise((resolve) => setTimeout(resolve, 2000));
	// 			const imageStatus = await getImageUploadStatus(
	// 				galleryId,
	// 				info.activeAlbumId,
	// 				batchId,
	// 			);
	// 			if (imageStatus?.[0] && imageStatus?.[1]?.processedCount === 1) {
	// 				const imageDetails = await getImageDetail(uploadedImageId);
	// 				if (imageDetails?.[0]) {
	// 					// Check if gallery or album has no cover image and set this as cover
	// 					const shouldSetGalleryCover = !info?.activeGallery?.coverImage;
	// 					const shouldSetAlbumCover = !info?.activeAlbum?.coverImage;

	// 					if (shouldSetGalleryCover || shouldSetAlbumCover) {
	// 						const coverPayload = {
	// 							image_id: uploadedImageId,
	// 							xPosition: 0,
	// 							yPosition: 0,
	// 							givenFileName: imageDetails[1]?.activeVersion?.givenFileName,
	// 							width: 100,
	// 							height: 100,
	// 							zoom: 1,
	// 						};

	// 						// Set as gallery cover if needed
	// 						if (shouldSetGalleryCover) {
	// 							await updateGalleryCoverImage(coverPayload, galleryId);
	// 						}

	// 						// Set as album cover if needed
	// 						if (shouldSetAlbumCover) {
	// 							await updateAlbumCoverImage(
	// 								coverPayload,
	// 								galleryId,
	// 								info.activeAlbumId,
	// 							);
	// 						}

	// 						// Refresh data to show new covers
	// 						await Promise.all([
	// 							getAlbumImagesCount(galleryId),
	// 							getAlbums(galleryId),
	// 							getGalleries(),
	// 						]);

	// 						message.success('Cover images set automatically');
	// 					}

	// 					setInfo((prev) => ({
	// 						...prev,
	// 						coverImageDetails: imageDetails[1],
	// 						isLoadingCover: false,
	// 					}));

	// 					message.success({
	// 						content: 'Image uploaded successfully',
	// 						key: 'coverUpload',
	// 					});
	// 					return;
	// 				}
	// 			}
	// 			attempts++;
	// 		}
	// 		throw new Error('Image processing timed out');
	// 	} catch (error) {
	// 		console.error('Error uploading cover image:', error);
	// 		message.error({
	// 			content: error.message || 'Failed to upload cover image',
	// 			key: 'coverUpload',
	// 		});
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			isLoadingCover: false,
	// 		}));
	// 	}
	// };

	// ... rest of the code ...
	// const handleSetCoverPosition = async (focalPoint) => {
	// 	const payload = {
	// 		image_id: info?.uploadImageId || info?.coverImageDetails?._id,
	// 		xPosition: focalPoint?.x,
	// 		yPosition: focalPoint?.y,
	// 		givenFileName:
	// 			imageDetail?.activeVersion?.givenFileName || info?.coverImageDetails?.givenFileName,
	// 		width: 100,
	// 		height: 100,
	// 		zoom: 1,
	// 	};

	// 	try {
	// 		const response = await updateAlbumCoverImage(payload, galleryId, info.activeAlbumId);
	// 		if (response?.[0] === true) {
	// 			message.success('Cover position set successfully!');
	// 			// Refresh album details to show updated cover
	// 			getAlbumImagesCount(galleryId);
	// 		} else {
	// 			message.error('Something went wrong, please try again later');
	// 		}
	// 	} catch (error) {
	// 		message.error('Failed to update cover position');
	// 	}
	// };
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
		message.loading('Your gallery is being removed. Please wait...');

		const response = await deleteGallery(galleryId);

		if (response[0] === true) {
			message.success('Gallery deleted successfully');

			navigate('/galleries');
			await getGalleries({}, true);
		} else {
			message.error(response[1].message);
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
	const handleRearrange = async () => {
		setInfo((prev) => ({
			...prev,
			isRearranging: !prev.isRearranging,
			selectedImages: [],
			rearrangingLoading: true,
		}));
		const response = await getRearrangeStatus(galleryId, info?.activeAlbumId, info?.albumTagId);
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
		const galleryLink = `https://${workspaceId}.ve.ai/gallery/${info?.activeGallery?.slug}`;

		try {
			// Try the modern clipboard API first
			await navigator.clipboard.writeText(galleryLink);
			message.success('Gallery link copied to clipboard');
		} catch (err) {
			// Fallback for older browsers or when clipboard API fails
			const textArea = document.createElement('textarea');
			textArea.value = galleryLink;
			document.body.appendChild(textArea);
			textArea.select();

			try {
				document.execCommand('copy');
				message.success('Gallery link copied to clipboard');
			} catch (err) {
				message.error('Failed to copy link');
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

		getImageDetail(null, true, false);
		setsearchkeys({ uploadImageId: 'image-uploading' });

		message.loading(
			`Uploading ${info.coverType === 'gallery' ? 'Gallery' : 'Album'} cover image..`,
		);

		if (info?.imageURL) {
			setInfo((prev) => ({
				...prev,
				crop: {
					x: 0,
					y: 0,
				},
				zoom: 1,
				uploadImageId: null,
				imageURL: info?.imageURL,
				coverImageDetails: null,
				coverType: prev.coverType,
			}));
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
			}));

			if (uploadResponse.status === 200) {
				getImageDetails(signedURLUpload?.[1]?._id, batchId);
			}
		} else {
			message.error('Something went wrong, please try again later');
		}
	};

	const handleSetCoverPosition = async (focalPoint) => {
		if (handleSetCoverPosition.isProcessing) return;

		try {
			handleSetCoverPosition.isProcessing = true;

			message.loading('Updating cover position...');

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

			const payload = {
				image_id: currentImage._id,
				xPosition: focalPoint?.x || 0,
				yPosition: focalPoint?.y || 0,
				givenFileName: currentImage.activeVersion.givenFileName,
				width: 100,
				height: 100,
				zoom: info?.zoom || 1,
			};

			// Make the appropriate API call based on cover type
			const response =
				info.coverType === 'gallery'
					? await updateGalleryCoverImage(payload, galleryId)
					: await updateAlbumCoverImage(payload, galleryId, info.activeAlbumId);

			if (response?.[0]) {
				// Create updated cover image object
				const updatedCoverImage = {
					...currentImage,
					xPosition: focalPoint?.x || 0,
					yPosition: focalPoint?.y || 0,
					zoom: info?.zoom || 1,
				};

				// Update state
				setInfo((prev) => ({
					...prev,
					showUploadCover: false,
					uploadImageId: null,
					imageURL: '',
					coverImageDetails: updatedCoverImage,
					selectedImages: [], // Clear selected images
					crop: {
						x: focalPoint?.x || 0,
						y: focalPoint?.y || 0,
					},
					zoom: info?.zoom || 1,
					// Update the appropriate cover
					...(info.coverType === 'gallery'
						? {
								activeGallery: {
									...prev.activeGallery,
									coverImage: updatedCoverImage,
								},
						  }
						: {
								activeAlbum: {
									...prev.activeAlbum,
									coverImage: updatedCoverImage,
								},
						  }),
				}));

				// Refresh data
				await Promise.all(
					[
						getAlbumImagesCount(galleryId),
						getAlbums(galleryId),
						info.coverType === 'gallery' && getGalleries({}, true),
					].filter(Boolean),
				);

				message.success(
					`${
						info.coverType === 'gallery' ? 'Gallery' : 'Album'
					} cover updated successfully`,
				);
			} else {
				throw new Error('Failed to update cover position');
			}
		} catch (error) {
			console.error('Error updating cover position:', error);
			message.error(error.message || 'Failed to update cover position');
		} finally {
			setTimeout(() => {
				handleSetCoverPosition.isProcessing = false;
			}, 1000);
		}
	};

	// Initialize the processing flag
	handleSetCoverPosition.isProcessing = false;

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
		message.success('Images deleted successfully');
	};

	const handleFilter = async (filter) => {
		// albumTagId
		setInfo((prev) => ({
			...prev,
			sortType: filter,
			imagesList: [],
			page: 1,
		}));
		const payload = {
			sortType: filter,
		};
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
				info?.page,
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
				message.success('Tag removed successfully');
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
				message.success('Tag added successfully');
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
			message.success('Images moved to album successfully');
		} else {
			message.error('Something went wrong, please try again later');
		}
	};

	const dynamicHeightFunc = () => {
		const containerWidth = document.querySelector('.albums')?.clientWidth || 0;
		const cardWidth = 130;
		const numberOfCards =
			info.activeTab === 'Client Selections'
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
			message.success('Tag added successfully');
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
				message.error('Unable to set selected image as album cover');
			}
		} else {
			message.error('Please select only one image to set as album cover');
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
					crop: { x: 0, y: 0 },
					zoom: 1,
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
							x: selectedImage?.xPosition || 0,
							y: selectedImage?.yPosition || 0,
						},
						zoom: selectedImage?.zoom || 1,
					}));
				}
			}
		} catch (error) {
			console.error('Error opening cover upload:', error);
			message.error('Failed to open cover upload');
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
							x: selectedImage?.xPosition || 0,
							y: selectedImage?.yPosition || 0,
						},
						zoom: selectedImage?.zoom || 1,
					};

					return newState;
				});
			} else {
				console.error('Missing required data:', {
					hasFileName: !!selectedImage?.activeVersion?.givenFileName,
					hasCredentials: !!galleryCredentials,
				});
				message.error('Unable to set selected image as gallery cover');
			}
		} else {
			message.error('Please select only one image to set as gallery cover');
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
			message.loading('Your album is being removed. Please wait...');

			const response = await deleteAlbum(galleryId, info?.activeAlbumId);

			if (response[0] === true) {
				message.success('Album deleted successfully');
				await getAlbums(galleryId);
				navigate(`/galleries/${galleryId}`);
			} else {
				message.error(response[1].message);
			}
		} catch (error) {
			console.error('Error deleting album:', error);

			message.error('Failed to delete album');
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

		setInfo((prev) => ({
			...prev,
			isDragging: true,
			dragPosition: {
				x: e.clientX,
				y: e.clientY,
			},
		}));

		// Create and append ghost image container
		const ghostContainer = document.createElement('div');
		ghostContainer.style.position = 'fixed';
		ghostContainer.style.pointerEvents = 'none';
		ghostContainer.style.zIndex = '1000';
		ghostContainer.style.left = '-1000px';
		document.body.appendChild(ghostContainer);
		e.dataTransfer.setDragImage(ghostContainer, 0, 0);
	};

	const handleDrag = (e) => {
		if (!e.clientX || !e.clientY) return; // Ignore invalid drag events

		setInfo((prev) => ({
			...prev,
			dragPosition: {
				x: e.clientX,
				y: e.clientY,
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
		const selectedImageObjects = currentImages.filter((img) =>
			info.selectedImages.includes(img._id),
		);
		const remainingImages = currentImages.filter(
			(img) => !info.selectedImages.includes(img._id),
		);

		const beforeIndex =
			info.dropPlaceholder > 0
				? getCustomSortIndex(remainingImages[info.dropPlaceholder - 1])
				: 0;
		const afterIndex =
			info.dropPlaceholder < remainingImages.length
				? getCustomSortIndex(remainingImages[info.dropPlaceholder])
				: beforeIndex + (selectedImageObjects.length + 1);

		// Calculate step size for even distribution
		const stepSize = (afterIndex - beforeIndex) / (selectedImageObjects.length + 1);

		// Create payload with new sort indices

		const payload = selectedImageObjects.map((image, index) => ({
			image_id: image._id,
			customSortIndex: beforeIndex + (index + 1) * stepSize,
		}));
		setInfo((prev) => ({
			...prev,
			totalPayload: [...prev.totalPayload, ...payload],
		}));
		const updatedImages = selectedImageObjects.map((image, index) => ({
			...image,
			galleryTags: image.galleryTags.map((tag) =>
				tag._id === info.albumTagId
					? {
							...tag,
							customSortIndex: beforeIndex + (index + 1) * stepSize,
					  }
					: tag,
			),
		}));

		remainingImages.splice(info.dropPlaceholder, 0, ...updatedImages);

		setInfo((prev) => ({
			...prev,
			isDragging: false,
			selectedImages: [],
			dropPlaceholder: null,
		}));
		updateImageOrder(remainingImages);
	};
	const handleSaveImage = async () => {
		message.loading('Rearranging images...');
		// setInfo((prev) => ({
		// 	...prev,
		// 	imagesList: [],
		// }));
		const sortedPayload = [...info.totalPayload].sort(
			(a, b) => a.customSortIndex - b.customSortIndex,
		);
		if (sortedPayload.length > 0) {
			const response = await changeImageOrder(
				sortedPayload,
				galleryId,
				info.activeAlbumId,
				info.albumTagId,
			);
			if (response?.[0] === true) {
				message.success('Images rearranged successfully');
				setInfo((prev) => ({
					...prev,
					totalPayload: [],
					isRearranging: false,
				}));
			} else {
				message.error('Something went wrong, please try again later');
			}
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
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		}

		try {
			// Start with loading message
			message.loading('Preparing download...');

			// Single image download handling
			if (info?.selectedImages?.length === 1) {
				const selectedImageId = info.selectedImages[0];

				// Get single image download link
				const isLightGallery = info?.isLightGallery;
				const response = await getDownloadLinkForImage(selectedImageId, isLightGallery);

				if (response?.[0] === true) {
					message.success('Download completed');
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
				info.activeTab === 'Client Selections' &&
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
					message.success('Download started');
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
					imageType: 'original',
				};
				const response = await getDownloadForMultipleImages(payload, galleryId);

				if (response?.[0] === true) {
					message.success('Download completed');
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

					message.success('Download started');
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
			message.error(error.message || 'An error occurred during download');
		}
	};

	// ... rest of the code ...

	// Add this function to calculate drop position
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
		if (info.activeTab === 'Client Selections' && info?.clientSelectionID) {
			const selection = clientSelectionsData?.data?.find(
				(sel) => sel._id === info?.clientSelectionID,
			);
			pin = selection?.pin || '';
		} else if (info?.activeAlbum?._id) {
			pin = info?.activeAlbum?.guestAccess?.pin || '';
		} else {
			pin = info?.activeGallery?.guestAccess?.pin || '';
		}
		if (info.activeTab === 'Client Selections' && info?.clientSelectionName) {
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
	const galleryUrl = `${galleryCredentials?.baseURL}/${tenantAlbums?.tenant_id}/${galleryId}/optimized/${albumImagesCount?.coverImage?.givenFileName}?Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;

	return (
		<>
			<div className="galleryContainer">
				<div
					className="mainGalleryContainer"
					style={{
						height: 'fit-content',
					}}
				>
					<div className="galleryPic">
						<div className="galleryHeaderColumn">
							<div
								className="imageContaienr"
								style={{
									background:
										albumImagesCount?.coverImage?.givenFileName &&
										galleryCredentials
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
							<div className="galleryTitle">
								<p>{info?.activeGallery?.title || 'Untitled Gallery'}</p>
							</div>
						</div>
						{/* <div className="galleryOptionsContainer">
							<Tooltip
								trigger="click"
								arrow={false}
								color="transparent"
								onOpenChange={(isOpen) => {
									if (!isOpen) {
										setInfo((prev) => ({
											...prev,
											searchValue: '',
										}));
									}
								}}
								overlayClassName="filterTooltipPopUpContainer"
								placement="bottomRight"
								title={
									<EarnAndShareOverlay
										galleryUrl={galleryUrl}
										galleryDetails={info?.activeGallery}
										galleryLink={info?.galleryLink}
									/>
								}
							>
								<div className="galleryOption" style={{ cursor: 'pointer' }}>
									Edit & Share
								</div>
							</Tooltip>

							<div
								className="galleryOption"
								onClick={handleOnlineToggle}
								style={{ cursor: 'pointer' }}
							>
								<div
									className="liveIndicator"
									style={{
										backgroundColor: info?.isOnline ? '#009F0D' : ' red',
									}}
								></div>
								{info?.isOnline ? 'Publish' : 'Unpublish'}
							</div>
						</div> */}
					</div>
					<div className="albumsContianer">
						<div className="galleryContentContainer">
							<div className="content">
								{data?.map((item, index) => (
									<>
										{item?.name !== 'breaker' && (
											<div
												key={index}
												className={`galleryContent ${
													info?.activeTab === item?.name ? 'active' : ''
												}`}
												onClick={() =>
													handleClickContent(item?.name, item?.number)
												}
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
									</>
								))}
							</div>
							<div className="shareContainer">
								<div
									className="onlineContainer"
									onClick={handleOnlineToggle}
									style={{ cursor: 'pointer' }}
								>
									<div className="onlineIndicatorContainer">
										<div
											className="onlineStatus"
											style={{
												backgroundColor: info.isOnline
													? 'var(--success)'
													: 'var(--error)',
											}}
										></div>
										<p className="onlineText">
											{info.isOnline ? 'Online' : 'Offline'}
										</p>
									</div>
									<Switch
										checked={info.isOnline}
										onChange={handleOnlineToggle}
										size="small"
										style={{
											backgroundColor: info.isOnline
												? 'var(--success)'
												: 'var(--error)',
										}}
									/>
								</div>
								<div className="onlineContainer" onClick={openShareModal}>
									<ShareIcon className="shareIcon" />
									<p>Share</p>
								</div>
								<div
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
											className="optionsContainer"
											ref={optionsRef}
											onClick={(e) => e.stopPropagation()}
										>
											{/* <li>
												<GalleryPreview />
												<span>Preview Gallery</span>
											</li> */}
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
								</div>
							</div>
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
							>
								<DragDropContext onDragEnd={handleAlbumDragEnd}>
									<Droppable
										droppableId="droppableAlblumId"
										direction="horizontal"
									>
										{(provided) => (
											<div
												className="albums"
												style={{
													height: '160px',
												}}
												{...provided.droppableProps}
												ref={provided.innerRef}
											>
												{(info.activeTab === 'Albums' ||
													info.activeTab !== 'Client Selections') && (
													<div
														className="create-album"
														onClick={() =>
															setInfo((prevData) => ({
																...prevData,
																showCreateAlbum: true,
															}))
														}
													>
														<p>+ New Album</p>
													</div>
												)}

												{(info.activeTab === 'Albums' ||
													info.activeTab !== 'Client Selections') &&
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
																		style={{
																			background: src
																				? `url(${src})`
																				: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%), #C4C4C4`,
																			...provided
																				.draggableProps
																				.style,
																		}}
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
																		{src && (
																			<img
																				src={src}
																				style={{
																					width: '100%',
																					height: '100%',
																					objectFit:
																						'cover',
																				}}
																			/>
																		)}
																		{!isActive && (
																			<div
																				style={{
																					position:
																						'absolute',
																					top: 0,
																					left: 0,
																					right: 0,
																					bottom: 0,
																					backgroundColor:
																						'rgba(0, 0, 0, 0.8)', // Adjust opacity as needed
																					transition:
																						'background-color 0.3s ease',
																				}}
																			/>
																		)}
																		{!album?.isPublished && (
																			<div className="unpublished">
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
																			onClick={() =>
																				handleClickAlbum(
																					album,
																					'albumName',
																					album?.imagesCount,
																				)
																			}
																		>
																			<p>{album?.title}</p>
																			<p
																				style={{
																					display: 'flex',
																					flexDirection:
																						'row',
																					alignItems:
																						'center',
																					gap: '5px',
																				}}
																			>
																				{album?.guestAccess
																					?.isEnabled && (
																					<div
																						style={{
																							position:
																								'relative',
																						}}
																					>
																						<LockIcon
																							style={{
																								color: '#fff',
																								fontSize:
																									'12px',
																							}}
																						/>
																					</div>
																				)}
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
																		</div>
																		<div className="overlay"></div>
																	</div>
																)}
															</Draggable>
														);
													})}

												{info.activeTab === 'Client Selections' &&
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
				{info?.scrolledTillEnd && (
					<div className="galleryTitleWhenScrolled">
						<span className="galleryTitle">{info?.activeGallery?.title}</span>
						<span style={{ color: 'white' }}>/</span>
						<span className="albumTitle">{info?.activeAlbum?.title}</span>
					</div>
				)}
				{info.activeTab === 'Albums' &&
					(albumImagesCount?.albums?.length === 0 ? (
						<div className="noAlbumContainer">
							<Result
								status="404"
								title="Albums Not Found"
								subTitle="It's quiet for now... You haven't missed anything yet! Create your first album to start organizing your memories"
								extra={
									<button
										className="create-album-button"
										onClick={() =>
											setInfo((prevData) => ({
												...prevData,
												showCreateAlbum: true,
											}))
										}
									>
										<p>Create Album</p>
									</button>
								}
							/>
						</div>
					) : (
						<div className="galleryViewer">
							<div className="galleryNavbar">
								<div className="albumDetailsContainer">
									{!info?.isRearranging ? (
										<div className="albumContains">
											<DragDropContext onDragEnd={onDragEnd}>
												<Droppable
													droppableId="tags"
													direction="horizontal"
												>
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
																				? true
																				: false
																		}
																		boundaries="hideScrollBar"
																	>
																		{(provided, snapshot) => (
																			<div
																				ref={
																					provided.innerRef
																				}
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
																			>
																				<div
																					{...provided.dragHandleProps}
																					style={{
																						width: '14px',
																						height: '15px',
																						cursor:
																							contain?.displayName ===
																							'All'
																								? 'not-allowed'
																								: 'grab',
																					}}
																				>
																					<img
																						src={
																							sixDots
																						}
																						alt="sixDots"
																					/>
																				</div>
																				<p
																					className={
																						info?.albumContains ===
																						contain.displayName
																							? 'active'
																							: ''
																					}
																					onClick={() =>
																						handleClickAlbum(
																							contain,
																							'containName',
																						)
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
																					onClick={() =>
																						handleClickAlbum(
																							contain,
																							'containName',
																						)
																					}
																				>
																					{
																						contain.imagesCount
																					}
																				</p>
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
									) : (
										<div className="saveRearrange">
											<p onClick={handleSaveImage}>Save</p>
										</div>
									)}
									<div className="aboutAlbum">
										<div className="albumSearchCotainer">
											<div
												onClick={() =>
													setInfo((prevInfo) => ({
														...prevInfo,
														showShearch: !prevInfo.showShearch,
													}))
												}
												className="searchContainer"
												style={{
													width: info?.searchValue && '200px',
												}}
											>
												<SearchIcon />

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

											<div style={{ position: 'relative' }}>
												<div
													onClick={() =>
														setInfo((prevInfo) => ({
															...prevInfo,
															showFilter: !prevInfo.showFilter,
														}))
													}
													ref={filtersRef}
													className="iconsContainer"
												>
													<FilterIcon />
												</div>
												{info.showFilter && (
													<div
														ref={filtersOptionsRef}
														className="filterContianer"
													>
														<li
															onClick={() =>
																handleFilter('displayName')
															}
															className={
																info?.sortType === 'displayName'
																	? 'active'
																	: ''
															}
														>
															File name
														</li>
														<li
															onClick={() =>
																handleFilter('-displayName')
															}
															className={
																info?.sortType === '-displayName'
																	? 'active'
																	: ''
															}
														>
															File name (reverse)
														</li>
														<li
															onClick={() =>
																handleFilter('originalDateTime')
															}
															className={
																info?.sortType ===
																'originalDateTime'
																	? 'active'
																	: ''
															}
														>
															Date Captured
														</li>
														<li
															onClick={() =>
																handleFilter('-originalDateTime')
															}
															className={
																info?.sortType ===
																'-originalDateTime'
																	? 'active'
																	: ''
															}
														>
															Date captured (reverse)
														</li>
														<li
															onClick={() =>
																handleFilter('createdAt')
															}
															className={
																info?.sortType === 'createdAt'
																	? 'active'
																	: ''
															}
														>
															upload time
														</li>
														<li
															onClick={() =>
																handleFilter('-createdAt')
															}
															className={
																info?.sortType === '-createdAt'
																	? 'active'
																	: ''
															}
														>
															upload time (reverse)
														</li>
														<li
															onClick={() => handleFilter('custom')}
															className={
																info?.sortType === 'custom'
																	? 'active'
																	: ''
															}
														>
															Random
														</li>
													</div>
												)}
											</div>
											<div
												style={{
													cursor: 'pointer',
													color: 'var(--primary-font)',
													fontFamily: 'var(--primary-font-family)',
													fontSize: '14px',
													fontWeight: '400',
													lineHeight: '16px',
													textTransform: 'capitalize',
												}}
												onClick={handleRearrange}
											>
												Rearrange Manually
											</div>
											<div
												style={{ position: 'relative' }}
												ref={albumSettingsIconRef}
												onClick={() =>
													setInfo((prevInfo) => ({
														...prevInfo,
														showAlbumSettings:
															!prevInfo.showAlbumSettings,
													}))
												}
												className="albumSettingsIcon"
											>
												{/* <ThreeDotsIcon
												className="threeDotsIcon"
												style={{ cursor: 'pointer' }}
											/> */}
												<p style={{ cursor: 'pointer' }}>Album Settings</p>
												{info.showAlbumSettings && (
													<div
														className="galleryEditOptions"
														ref={albumSettingsRef}
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
																	justifyContent: 'space-between',
																	alignItems: 'center',
																	gap: '8px',
																}}
															>
																<span
																	style={{
																		color: 'var(--primary-font)',
																		fontFamily:
																			'var(--primary-font-family)',
																		fontSize: '14px',
																		fontWeight: '400',
																		lineHeight: '16px',
																		textTransform: 'capitalize',
																	}}
																>
																	Hide Album
																</span>
																<Switch
																	checked={
																		!info?.activeAlbum
																			?.isPublished
																	}
																	onClick={handleHideAlbum}
																	size="medium"
																	style={{
																		backgroundColor:
																			info?.isPublished
																				? '#575858'
																				: '#575858',
																	}}
																/>
															</div>
															<div
																className="toggle-option"
																style={{
																	display: 'flex',
																	justifyContent: 'space-between',
																	alignItems: 'center',
																	gap: '8px',
																}}
															>
																<span
																	style={{
																		color: 'var(--primary-font)',
																		fontFamily:
																			'var(--primary-font-family)',
																		fontSize: '14px',
																		fontWeight: '400',
																		lineHeight: '16px',
																		textTransform: 'capitalize',
																	}}
																>
																	Lock Album
																</span>
																<Switch
																	checked={
																		info?.activeAlbum
																			?.guestAccess?.isEnabled
																	}
																	onClick={handleLockAlbum}
																	size="medium"
																	style={{
																		backgroundColor:
																			!info.isEnabled
																				? '#575858'
																				: '#575858',
																	}}
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
															style={{
																display: 'flex',
																alignItems: 'center',
																gap: '4px',
															}}
														>
															<EditPen />
															Rename Album
														</li>
														<li
															onClick={() => {
																setInfo((prev) => ({
																	...prev,
																	showShareAlbum: true,
																	showGalleryOptions: false,
																	showOptions: false,
																}));
															}}
															style={{
																display: 'flex',
																alignItems: 'center',
																gap: '4px',
															}}
														>
															<ShareIcon />
															Share Album
														</li>
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
															style={{
																display: 'flex',
																alignItems: 'center',
																gap: '4px',
															}}
														>
															<DownloadIcon />
															Download album
														</li>
														<li
															onClick={handleLightRoomCopy}
															style={{
																display: 'flex',
																alignItems: 'center',
																gap: '4px',
															}}
														>
															<LightRoomIcon />
															Light Room Copy List
														</li>
														<li
															onClick={() =>
																handleUploadCoverOpen('album')
															}
															style={{
																display: 'flex',
																alignItems: 'center',
																gap: '4px',
															}}
														>
															<AlbumCoverIcon />
															Album Cover
														</li>
														{/* <li
														onClick={() =>
															handleAlbumSettings('album-overview')
														}
													>
														Album overview
													</li> */}

														<hr
															style={{
																border: '1px solid #1F1F1F',
																width: '100%',
																margin: '0px',
																opacity: 0.5,
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
												)}
												<div></div>
											</div>
										</div>
									</div>
								</div>

								<div
									style={{ overflow: info?.scrolledTillEnd ? 'auto' : 'hidden' }}
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
								>
									<InfiniteScroll
										dataLength={imagesList?.docs?.length || 0}
										next={fetchMoreImages}
										hasMore={imagesList?.hasNextPage || false}
										loader={
											<p style={{ textAlign: 'center', color: '#fff' }}>
												Loading
											</p>
										}
										scrollableTarget="galleryScrollTarget"
										refreshFunction={info?.resetInfinityScroll}
										disableDrop={true}
										scrollThreshold={info?.isRearranging ? 0.2 : 0.8}
									>
										{!info.isRearranging ? (
											<ResponsiveMasonry
												columnsCountBreakPoints={{
													300: 1,
													600: 2,
													900: 3,
													1300: 4,
													1600: 5,
												}}
											>
												<Masonry gutter="10px" columnsCount={4}>
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
																					display:
																						'block',
																				}}
																				draggable={false}
																			/>
																			{info.isMouseInGallery && (
																				<div className="imageOverlay"></div>
																			)}

																			<div
																				onClick={() =>
																					handleExpandClick(
																						image?._id,
																						'single',
																					)
																				}
																				style={{
																					zIndex: 3,
																				}}
																			>
																				<Tooltip
																					title="Full View"
																					placement="top"
																				>
																					<ArrowsOut className="rotating-circle" />
																				</Tooltip>
																			</div>
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
										) : (
											<>
												{!info?.rearrangingLoading ? (
													<div
														className="rearrange-image-container-wrapper"
														ref={rearrangeContainerRef}
													>
														{info?.imagesList?.docs
															// Filter out selected images during drag
															?.filter(
																(image) =>
																	!info.isDragging ||
																	!info.selectedImages.includes(
																		image._id,
																	),
															)
															?.map((image, index) => {
																const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
																const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_optimized?.key}?${params}`;

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
																				width: '200px',
																				height: '200px',
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
				{info.activeTab === 'Client Selections' &&
					(clientSelectionsData?.data?.length === 0 ? (
						<div className="noAlbumContainer">
							<Result
								status="404"
								title="Albums Not Found"
								subTitle="It's quiet for now... You haven't missed anything yet! Create your first album to start organizing your memories"
								extra={
									<button
										className="create-album-button"
										onClick={() =>
											setInfo((prevData) => ({
												...prevData,
												showCreateAlbum: true,
											}))
										}
									>
										<p>Create Album</p>
									</button>
								}
							/>
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
												<p style={{ cursor: 'pointer' }}>
													Selection Settings
												</p>
												{info.clientSubscriptionOptions && (
													<div
														className="galleryEditOptions"
														ref={optionsContainerRef}
														style={{
															position: 'absolute',
															right: '0',
															top: '100%',
															zIndex: 100,
															width: '200px',
														}}
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
														{/* <li
														onClick={() => {
															setInfo((prev) => ({
																...prev,
																showShareAlbum: true,
																clientSubscriptionOptions: false,
															}));
														}}
														style={{
															display: 'flex',
															alignItems: 'center',
															gap: '4px',
														}}
													>
														<ShareIcon />
														<span>Share</span>
													</li> */}
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
														<li
															onClick={() =>
																handleUploadCoverOpen('album')
															}
															style={{
																display: 'flex',
																alignItems: 'center',
																gap: '4px',
															}}
														>
															<AlbumCoverIcon />
															Album Cover
														</li>
														{/* <div
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
														</div> */}
													</div>
												)}
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
													width: info?.searchValue && '200px',
												}}
											>
												<SearchIcon />

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
								<div onClick={() => handleExpandClick(null, 'multiple')}>
									<ExpandIcon />
								</div>

								<div style={{ position: 'relative' }} ref={forwardIconRef}>
									<ForwardIcon onClick={handleForwardIcon} />

									{info.showForward && (
										<div className="forwardOptions" ref={forwardOptionsRef}>
											{/* <li style={{ cursor: 'not-allowed' }}>
																Copy to client selection
															</li> */}
											<li
												onClick={() =>
													setInfo((prev) => ({
														...prev,
														showMoveToAlbum: true,
													}))
												}
											>
												Move to Other Albums
											</li>
										</div>
									)}
								</div>
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
												?.filter((tag) =>
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
								<div style={{ position: 'relative' }} ref={optionsIconRef}>
									<OptionsIcon onClick={handleOptionsIcon} />
									{info.showAlbumOptionsMenu && (
										<div className="optionsContainer" ref={optionsContainerRef}>
											<li onClick={handleDownload}>Download</li>
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
											{/* <li>Share</li> */}
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
										</div>
									)}
								</div>
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
						link={`https://${workspaceId}.ve.ai/gallery/${info?.activeGallery?.slug}/pre-register`}
					/>
				)}
				{info.activeTab === 'Insights' && <Insights galleryId={galleryId} />}
			</div>

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
				showUploadPhoto={info?.selectedImages.length > 0}
				onClose={() => setInfo((prev) => ({ ...prev, showUploadCover: false }))}
				style={{ position: 'absolute', top: '60%', left: '0', right: '0', bottom: '0' }}
			/>

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
				title={'Album'}
				paragraph={'Images'}
				handleDelete={handleDeleteAlbum}
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
								message.success('Album renamed successfully');
							} else {
								// message.error('Failed to rename album');
							}
						} catch (error) {
							message.error('Error renaming album');
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
		</>
	);
};

export default memo(GalleryPage);
