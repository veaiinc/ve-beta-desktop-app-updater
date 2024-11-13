import React, { useState, useEffect, useRef, useContext, useCallback, Children } from 'react';
import { ReactComponent as ShareIcon } from '../../../assets/svg/gallery/share.svg';
import sixDots from '../../../assets/svg/gallery/sixdots.svg';
import { ReactComponent as ThreeDotsIcon } from '../../../assets/svg/gallery/threeDots.svg';
import { ReactComponent as SearchIcon } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as FilterIcon } from '../../../assets/svg/chat/filter.svg';
import { ReactComponent as ExpandIcon } from '../../../assets/svg/gallery/expand.svg';
import { ReactComponent as ForwardIcon } from '../../../assets/svg/gallery/forward.svg';
import { ReactComponent as PinIcon } from '../../../assets/svg/gallery/pin.svg';
import { ReactComponent as DragIcon } from '../../../assets/svg/gallery/drag.svg';
import { ReactComponent as OptionsIcon } from '../../../assets/svg/gallery/dotsThree.svg';
import { ReactComponent as CloudUpload } from '../../../assets/svg/Settings/CloudUpload.svg';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ReactComponent as UpArrow } from '../../../assets/svg/workflow/downArrow.svg';
import { message, Result } from 'antd';
import ShareModal from '../../../views/components/modalsV2/gallery/ShareModal';
import CreateAlbum from '../../components/modalsV2/gallery/CreateAlbum';
import CollaboratorPopup from '../../components/modalsV2/gallery/CollaboratorPopup';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
import randomize from 'randomatic';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import { gsap } from 'gsap';
import slugify from 'slugify';

const GalleryPage = () => {
	const { galleryId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
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
		},
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
		activeGallery: location?.state,
		activeAlbumId: tenantAlbums?.albums?.[0]?._id,
		callToAction: tenantPreferences?.ctaPreferences,
		timeout: null,
		linkUpdateError: '',
		gridStyle: layoutSettings?.gridStyle,
		thumbnailSize: layoutSettings?.thumbnailSize,
		collaboratorsData: collaborators,
		tenantAlbums: tenantAlbums?.albums,
		activeAlbum: {},
		albumSlug: tenantAlbums?.albums?.[0]?.slug,
		albumTagId: '',
		hasMore: true,
		page: 1,
		limit: 20,
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
		isPublished: tenantAlbums?.isPublished || false,
		showDragIconOfAlbum: null,
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
	const fileInputRef = useRef();

	const data = [
		{ name: 'Albums', number: albumImagesCount?.albums?.length },
		// { name: 'Videos', number: 2 },
		// { name: 'Slide Show', number: 1 },
		{ name: 'Client Selections', number: clientSelectionsData?.totalDocs },
		{ name: 'AI', number: '' },
	];

	const handleClickOutside = useCallback((event) => {
		const clickOutsideCheck = (ref, iconRef, stateName) => {
			if (
				ref.current &&
				!ref.current.contains(event.target) &&
				!iconRef.current.contains(event.target)
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

		if (tenantAlbums) {
			setInfo((prev) => ({
				...prev,
				albumName: tenantAlbums?.albums?.[0]?.title,
				activeAlbumId: tenantAlbums?.albums?.[0]?._id,
				activeAlbum: tenantAlbums?.albums?.[0],
				tenantAlbums: tenantAlbums?.albums,
				albumSlug: tenantAlbums?.albums?.[0]?.slug,
				isPublished: tenantAlbums?.isPublished,
			}));
		}
		if (tenantPreferences) {
			setInfo((prev) => ({
				...prev,
				callToAction: tenantPreferences?.ctaPreferences,
				clientSubscription: tenantPreferences?.allowClientsToSubscribe || false,
			}));
		}
	}, [tenantPreferences, tenantAlbums]);

	useEffect(() => {
		if (updateActiveAlbum !== null && updateActiveAlbum !== info?.activeAlbum) {
			let updatedArray = info.tenantAlbums.map((album) => {
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
				gridStyle: layoutSettings?.gridStyle,
				thumbnailSize: layoutSettings?.thumbnailSize,
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
		// if image detail is upload image id
		if (imageDetail?._id === info?.uploadImageId && galleryCredentials) {
			const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
			const src = `${galleryCredentials?.baseURL}/${imageDetail?.activeVersion?.s3_optimized?.key}?${params}`;
			setInfo((prev) => ({
				...prev,
				imageURL: src,
			}));
		}

		if (albumImagesCount?.coverImage?._id && galleryCredentials && !imageDetail) {
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

	const handleImageSelect = (index, images) => {
		setInfo((prevInfo) => {
			const isDeselecting = prevInfo.selectedImages.includes(images?._id);
			const newSelectedImages = isDeselecting
				? prevInfo.selectedImages.filter((i) => i !== images?._id)
				: [...prevInfo.selectedImages, images?._id];
			let newSelectedImagesTags;
			if (isDeselecting) {
				const remainingImages = info?.imagesList?.docs.filter(
					(img) => newSelectedImages.includes(img._id) && img._id !== images?._id,
				);
				newSelectedImagesTags = [
					...new Set(
						remainingImages.flatMap((img) => img.galleryTags).map((tag) => tag._id),
					),
				];
			} else {
				newSelectedImagesTags = [
					...new Set([
						...(prevInfo.selectedImagesTags || []),
						...images?.galleryTags.map((tag) => tag._id),
					]),
				];
			}

			return {
				...prevInfo,
				selectedImages: newSelectedImages,
				selectedImagesTags: newSelectedImagesTags,
			};
		});
	};

	const handleClickAlbum = (album, name) => {
		if (album?.displayName !== info?.albumContains) {
			setInfo((prevInfo) => ({
				...prevInfo,
				albumLoading: true,
			}));
		}
		if (name === 'albumName') {
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
				albumSlug: album?.slug,
				resetInfinityScroll: !prevInfo.resetInfinityScroll,
				activeTab: 'Albums',
			}));
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
			}));
		} else if (name === 'clientSelection') {
			setInfo((prevInfo) => ({
				...prevInfo,
				activeClientSelection: album?.slug,
				clientSelectionID: album?._id,
				clientSelectionName: album?.title,
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
		setInfo((prevInfo) => ({ ...prevInfo, shareModal: !prevInfo.shareModal }));
	};
	const handleClearSelectedImages = () => {
		setInfo((prevInfo) => ({ ...prevInfo, selectedImages: [] }));
	};
	const handleExpandClick = () => {
		navigate(
			`/galleries/${galleryId}/${info?.activeAlbumId}/gallery-viewer?tagId=${info?.albumTagId}&image=${info?.selectedImages?.[0]}`,
		);
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
			showOptionsContainer: !prevInfo.showOptionsContainer,
		}));
	};
	const handleClickContent = (name, count) => {
		if (count === 0) return;
		setInfo((prevInfo) => ({ ...prevInfo, activeTab: name, page: 1 }));
	};
	const handleNavigateUpload = () => {
		info?.albumContains === 'All'
			? navigate(`/galleries/${galleryId}/${info?.activeAlbumId}/upload-photos`)
			: navigate(
					`/galleries/${galleryId}/${info?.activeAlbumId}/upload-photos?tag=${info?.albumContains}`,
			  );
	};
	const convertEpochToDate = (value) => {
		if (!value) return null;
		if (moment(value).isValid()) {
			return moment.unix(value).format('DD-MM-YYYY');
		}
		// const epochDate = moment(parseInt(value));
		// if (epochDate.isValid()) {
		// 	return epochDate.toDate();
		// }
		return null;
	};
	const handleCallToAction = useCallback(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			callToAction: {
				...info?.callToAction,
				isEnabled: !info?.callToAction?.isEnabled,
			},
		}));
		const payload = {
			ctaPreferences: {
				isEnabled: !info.callToAction?.isEnabled,
			},
		};
		editPreferences(galleryId, payload);
	}, [getEditPreferences, info.callToAction?.isEnabled]);

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
	const handleGalleryChange = useCallback(
		(e) => {
			const value = e.target.value;
			setInfo((prev) => ({
				...prev,
				activeGallery: {
					galleryData: {
						...prev?.activeGallery?.galleryData,
						title: value,
					},
				},
			}));
			handleDebouceFunctionCall(updateGallery, value);
		},
		[info?.activeGallery?.galleryData?.title],
	);

	const updateGallery = useCallback(async (value) => {
		const payload = {
			title: value,
		};
		const response = await postGallery(payload, galleryId);
		if (response?.[0]) {
			message.success('galleryUpdated');
		} else {
			setInfo((prev) => ({
				...prev,
				linkUpdateError: 'Error while updatating the gallery',
			}));
		}
	}, []);

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
		}
		if (styleName === 'thumbnailSize') {
			const newThumbnailSize = {
				regular: value === 'regular',
				large: value === 'large',
			};
			setInfo((prev) => ({
				...prev,
				thumbnailSize: newThumbnailSize,
			}));
			putLayoutSettings({ thumbnailSize: { [value]: true } }, galleryId);
		}
	};
	const handleManageCollaboratorPopup = () => {
		setInfo((prev) => ({
			...prev,
			showCollaborators: !info?.showCollaborators,
		}));
	};
	const handleManageCollaborator = (data) => {
		setInfo((prev) => ({
			...prev,
			collaboratorsData: data,
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
	const handleRearrange = () => {
		setInfo((prev) => ({
			...prev,
			isRearranging: !prev.isRearranging,
			selectedImages: [],
		}));
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

	// const handleDragStart = (result) => {
	// 	const selectedIndexes = info.selectedImages;

	// 	setInfo((prev) => ({
	// 		...prev,
	// 		isDragging: true,
	// 		draggedImages: selectedIndexes,
	// 	}));
	// };

	// // Add this new function to handle drag end
	// const handleDragEnd = (result) => {
	// 	if (!result.destination) {
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			isDragging: false,
	// 			draggedImages: [],
	// 			selectedImages: [],
	// 		}));
	// 		return;
	// 	}
	// 	const images = [...info?.imagesList?.docs];

	// 	const selectedImages = info.draggedImages.map((index) => images[index]);

	// 	const sortedIndices = [...info.draggedImages].sort((a, b) => b - a);

	// 	// Remove images from their original positions
	// 	sortedIndices.forEach((index) => {
	// 		images.splice(index, 1);
	// 	});

	// 	const destinationIndex = result.destination.index;

	// 	images.splice(destinationIndex, 0, ...selectedImages);

	// 	setInfo((prev) => ({
	// 		...prev,
	// 		isDragging: false,
	// 		draggedImages: [],
	// 		selectedImages: [],
	// 		imagesList: {
	// 			...prev.imagesList,
	// 			docs: images,
	// 		},
	// 	}));
	// };
	const handleDragStart = (start, provided) => {
		const selectedIndexes = info.selectedImages;

		setInfo((prev) => ({
			...prev,
			isDragging: true,
			draggedImages: selectedIndexes,
			// dragPreviewPosition: null,
			insertIndex: null,
		}));

		// Add mousemove event listener
		document.addEventListener('mousemove', handleDragMove);
	};

	// Add handleDragMove function
	const handleDragMove = (e) => {
		// Get the element under the cursor
		const elementsUnderCursor = document.elementsFromPoint(e.clientX, e.clientY);

		// Find the closest image container
		const imageContainer = elementsUnderCursor.find((el) =>
			el.closest('.masonry-image-container'),
		);

		if (imageContainer) {
			const rect = imageContainer.getBoundingClientRect();
			const index = parseInt(imageContainer.dataset.index);

			// Determine if cursor is in first or second half of the image
			const isInFirstHalf = e.clientY < rect.top + rect.height / 2;
			const insertPosition = isInFirstHalf ? index : index + 1;

			setInfo((prev) => ({
				...prev,
				insertIndex: insertPosition,
				dragPreviewPosition: {
					x: e.clientX,
					y: isInFirstHalf ? rect.top : rect.bottom,
				},
			}));
		}
	};

	const handleDragEnd = (result) => {
		if (!result.destination) {
			setInfo((prev) => ({
				...prev,
				isDragging: false,
				draggedImages: [],
				selectedImages: [],
			}));
			return;
		}

		const images = [...info?.imagesList?.docs];
		const selectedImages = info.draggedImages.map((index) => images[index]);
		const sortedIndices = [...info.draggedImages].sort((a, b) => b - a);

		// Remove images from their original positions
		sortedIndices.forEach((index) => {
			images.splice(index, 1);
		});

		// Insert images at the new position
		const destinationIndex = result.destination.index;
		images.splice(destinationIndex, 0, ...selectedImages);

		setInfo((prev) => ({
			...prev,
			isDragging: false,
			draggedImages: [],
			selectedImages: [],
			imagesList: {
				...prev.imagesList,
				docs: images,
			},
		}));
	};

	const handleCopyGalleryLink = () => {
		const workspaceId = localStorage.getItem('workspaceId');
		navigator.clipboard.writeText(
			`https://${workspaceId}.ve.ai/galleries/${info?.activeGallery?.galleryData?.slug}`,
		);
		message.success('Gallery link copied to clipboard');
		setInfo((prev) => ({
			...prev,
			showOptions: !prev.showOptions,
		}));
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
				message.destroy();
			}
		}, 2000);
	};

	const uploadGalleryCoverChangeHandler = async (e) => {
		const image = e.target.files[0];

		if (!image) {
			return;
		}

		message.open({
			type: 'loading',
			content: 'Uploading Gallery cover image..',
			duration: 0,
		});
		if (info?.imageURL) {
			setInfo((prev) => ({
				...prev,
				crop: {
					x: 0,
					y: 0,
				},
				zoom: 1,
				uploadImageId: null,
				imageURL: '',
				coverImageDetails: null,
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
			message.destroy();
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
				coverPhoto: true,
			}));

			if (uploadResponse.status === 200) {
				getImageDetails(signedURLUpload?.[1]?._id, batchId);
			}
		} else {
			message.destroy();
			message.error('Something went wrong, please try again later');
		}
	};

	const handleSetCoverPosition = async (focalPoint) => {
		const json = {
			image_id: info?.uploadImageId || albumImagesCount?.coverImage?._id,
			xPosition: focalPoint?.x,
			yPosition: focalPoint?.y,
			givenFileName:
				imageDetail?.activeVersion?.givenFileName ||
				albumImagesCount?.coverImage?.givenFileName,
			width: 100,
			height: 100,
			zoom: info?.zoom,
		};
		const respone = await updateGalleryCoverImage(json, galleryId);
		if (respone?.[0] === true) {
			message.success('Cover position set successfully!');
			getAlbumImagesCount(galleryId);
			setInfo((prev) => ({
				...prev,
				activeTab: 'Albums',
			}));
		} else {
			message.error('Something went wrong, please try again later');
		}
	};

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
			showDeleteAlbum: false,
		}));
		message.success('Images deleted successfully');
	};

	const handleFilter = async (filter) => {
		// albumTagId
		setInfo((prev) => ({
			...prev,
			sortType: filter,
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

		console.log(
			'numberOfCards',
			numberOfCards,
			'cardsPerRow',
			cardsPerRow,
			'totalRows',
			totalRows,
		);

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
			console.log(items);

			updateAlbumOrder(payload, galleryId, info?.activeAlbumId, items);
		}

		// setInfo((prev) => ({
		// 	...prev,
		// 	albumTags: items,
		// }));
	};

	const handleSetAlbumCover = async () => {
		if (info?.selectedImages?.length < 2) {
			navigate(
				`/galleries/${galleryId}/${info?.activeAlbumId}/album-settings?uploadImageId=${info?.selectedImages[0]}`,
				{
					state: {
						activeAlbumId: info?.activeAlbumId,
					},
				},
			);
		} else {
			message.error('Cant set album cover with more than 1 image');
		}
	};

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
						<div className="galleryPicSettings">
							<UpArrow className="upArrow" />
							<p
								onClick={() => handleClickContent('Settings')}
								style={{ cursor: 'pointer' }}
							>
								Settings
							</p>
						</div>
						<div className="imageContaienr">
							{albumImagesCount?.coverImage?.givenFileName && galleryCredentials && (
								<img
									src={`${galleryCredentials?.baseURL}/${tenantAlbums?.tenant_id}/${galleryId}/optimized/${albumImagesCount?.coverImage?.givenFileName}?Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`}
								/>
							)}
							<div className="publishIndicator">
								<div
									className="liveIndicator"
									style={{
										backgroundColor: info?.isPublished ? '#368748' : ' #FFA500',
									}}
								></div>
								<p>{info?.isPublished ? 'LIVE' : 'DRAFT'}</p>
							</div>
						</div>
					</div>

					<div className="albumsContianer">
						<div className="galleryContentContainer">
							<div className="content">
								{data.map((item, index) => (
									<div
										key={index}
										className={`galleryContent ${
											info.activeTab === item.name ? 'active' : ''
										}`}
										onClick={() => handleClickContent(item.name, item.number)}
									>
										<p className="galleryName">{item.name}</p>
										<p className="count">{item.number}</p>
									</div>
								))}
							</div>
							<div className="shareContainer">
								<div className="icon" onClick={openShareModal}>
									<ShareIcon className="shareIcon" />
								</div>
								<div
									className="icon"
									ref={iconRef}
									onClick={() =>
										setInfo((prevInfo) => ({
											...prevInfo,
											showOptions: !prevInfo.showOptions,
										}))
									}
								>
									<ThreeDotsIcon className="threeDotsIcon" />
									{info.showOptions && (
										<div
											className="optionsContainer"
											ref={optionsRef}
											onClick={(e) => e.stopPropagation()}
										>
											<li style={{ cursor: 'not-allowed' }}>Preview</li>
											<li onClick={handleCopyGalleryLink}>Copy link</li>
											<li onClick={openShareModal}>Share</li>
											<li onClick={handleUnpublish}>
												{info?.isPublished ? 'Unpublish' : 'Publish'}
											</li>
										</div>
									)}
								</div>
							</div>
						</div>
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
								<Droppable droppableId="droppableAlblumId" direction="horizontal">
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
												albumImagesCount?.albums
													?.sort(
														(a, b) =>
															a.customSortIndex - b.customSortIndex,
													)
													?.map((album, index) => {
														let src = null;
														if (album?.coverImage?._id) {
															const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
															src = `${galleryCredentials?.baseURL}/${tenantAlbums?.tenant_id}/${galleryId}/optimized/${album?.coverImage?.givenFileName}?${params}`;
														}
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
																		// {...provided.dragHandleProps}
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

																		{info?.showDragIconOfAlbum ===
																			album?._id && (
																			<span
																				{...provided.dragHandleProps}
																				style={{
																					position:
																						'absolute',
																					top: '10px',
																					right: '10px',
																					zIndex: '10',
																					transition:
																						'all 0.3s ease',
																				}}
																			>
																				<DragIcon />
																			</span>
																		)}

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
																			<p>{`${
																				album?.imagesCount ||
																				0
																			} ${
																				album?.imagesCount >
																				1
																					? 'photos'
																					: 'photo'
																			}`}</p>
																		</div>
																		<div className="overlay"></div>
																	</div>
																)}
															</Draggable>
														);
													})}

											{info.activeTab === 'Client Selections' &&
												clientSelectionsData?.data?.map((album, index) => {
													let src = null;
													if (album?.coverImage?._id) {
														const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
														src = `${galleryCredentials?.baseURL}/${tenantAlbums?.tenant_id}/${galleryId}/optimized/${album?.coverImage?.givenFileName}?${params}`;
													}
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
																	{...provided.dragHandleProps}
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
																		backgroundSize: 'cover ',
																		backgroundPosition:
																			'center',
																		...provided.draggableProps
																			.style,
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
															)}
														</Draggable>
													);
												})}
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
					</div>
				</div>

				<div className="line"></div>

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
								<div className="aboutAlbum">
									<div className="albumName">
										<p>{info.albumName}</p>
										<div
											style={{ position: 'relative' }}
											ref={galleryIconRef}
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
											/>
											{info.showGalleryOptions && (
												<div
													className="galleryEditOptions"
													ref={galleryOptionsRef}
												>
													<li
														onClick={() =>
															handleAlbumSettings('album-overview')
														}
													>
														Album overview
													</li>
													<li
														onClick={() =>
															handleAlbumSettings('download-album')
														}
													>
														Download album
													</li>
													<li
														onClick={() =>
															handleAlbumSettings(
																'lightroom-copy-list',
															)
														}
													>
														Light Room Copy List
													</li>
													<li
														onClick={() =>
															handleAlbumSettings('album-cover')
														}
													>
														Album Cover
													</li>
													<li
														onClick={() =>
															handleAlbumSettings('delete-album')
														}
														style={{ color: '#A74A49' }}
													>
														Delete album
													</li>
												</div>
											)}
											<div></div>
										</div>
									</div>
									<div className="albumSearchCotainer">
										{/* <p onClick={handleRearrange} style={{ cursor: 'pointer' }}>
											Rearrange manually
										</p> */}
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
												style={{ display: info?.searchValue && 'block' }}
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
														onClick={() => handleFilter('displayName')}
														className={
															info?.sortType === 'displayName'
																? 'active'
																: ''
														}
													>
														File name
													</li>
													<li
														onClick={() => handleFilter('-displayName')}
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
															info?.sortType === 'originalDateTime'
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
															info?.sortType === '-originalDateTime'
																? 'active'
																: ''
														}
													>
														Date captured (reverse)
													</li>
													<li
														onClick={() => handleFilter('createdAt')}
														className={
															info?.sortType === 'createdAt'
																? 'active'
																: ''
														}
													>
														upload time
													</li>
													<li
														onClick={() => handleFilter('-createdAt')}
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
									</div>
								</div>
								<div className="albumContains">
									<DragDropContext onDragEnd={onDragEnd}>
										<Droppable droppableId="tags" direction="horizontal">
											{(provided) => (
												<div
													{...provided.droppableProps}
													ref={provided.innerRef}
													style={{
														display: 'flex',
														gap: '30px',
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
																	contain._id || `tag-${index}`
																}
																index={index}
																isDragDisabled={
																	contain?.displayName === 'All'
																		? true
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
																			marginBottom: '8px', // Add spacing between items
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
																				src={sixDots}
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
																			{contain.displayName}
																		</p>
																		<p
																			className="count"
																			onClick={() =>
																				handleClickAlbum(
																					contain,
																					'containName',
																				)
																			}
																		>
																			{contain.imagesCount}
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
								{/* <div className="galleryImagesContainer">
							<ResponsiveMasonry
								columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
							>
								<Masonry gutter="10px">
									{randomizedImages.map((image, index) => (
										<div className="imageContainer" key={index}>
											<img
												src={image}
												alt={`Gallery image ${index}`}
												style={{ width: '100%', display: 'block' }}
											/>
										</div>
									))}
								</Masonry>
							</ResponsiveMasonry>
						</div> */}

								<div
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
												Loading...
											</p>
										}
										scrollableTarget="galleryScrollTarget"
										refreshFunction={info?.resetInfinityScroll}
										disableDrop={true}
									>
										{!info.isRearranging ? (
											<ResponsiveMasonry
												columnsCountBreakPoints={{
													350: 1,
													750: 2,
													900: 3,
													1200: 4,
												}}
											>
												<Masonry gutter="10px">
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
											''
											// <DragDropContext
											// 	onDragStart={handleDragStart}
											// 	onDragEnd={handleDragEnd}
											// 	disableDrop={true}
											// >
											// 	<Droppable
											// 		droppableId="masonry-grid"
											// 		// direction="horizontal"
											// 		direction={
											// 			info?.gridStyle?.vertical
											// 				? 'vertical'
											// 				: 'horizontal'
											// 		}
											// 		type={
											// 			info?.gridStyle?.vertical
											// 				? 'VERTICAL'
											// 				: 'HORIZONTAL'
											// 		}
											// 	>
											// 		{(provided, snapshot) => (
											// 			<div
											// 				{...provided.droppableProps}
											// 				ref={provided.innerRef}
											// 			>
											// 				<ResponsiveMasonry
											// 					columnsCountBreakPoints={{
											// 						350: 1,
											// 						750: 2,
											// 						900: 3,
											// 						1200: 4,
											// 					}}
											// 				>
											// 					<Masonry gutter="10px">
											// 						{info?.imagesList?.docs?.map(
											// 							(image, index) => {
											// 								const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
											// 								const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_optimized?.key}?${params}`;

											// 								// Hide original items while being dragged
											// 								if (
											// 									info.isDragging &&
											// 									info.draggedImages.includes(
											// 										index,
											// 									)
											// 								) {
											// 									return null;
											// 								}

											// 								return (
											// 									<>
											// 										{info.insertIndex ===
											// 											index &&
											// 											info.isDragging && (
											// 												<div
											// 													className="drop-preview"
											// 													style={{
											// 														height: '4px',
											// 														background:
											// 															'#007bff',
											// 														margin: '8px 0',
											// 														transition:
											// 															'all 0.2s',
											// 													}}
											// 												/>
											// 											)}
											// 										<Draggable
											// 											key={
											// 												image._id ||
											// 												`image-${index}`
											// 											}
											// 											draggableId={
											// 												image._id ||
											// 												`image-${index}`
											// 											}
											// 											index={
											// 												index
											// 											}
											// 											isDragDisabled={
											// 												!info.selectedImages.includes(
											// 													index,
											// 												)
											// 											}
											// 										>
											// 											{(
											// 												provided,
											// 												snapshot,
											// 											) => (
											// 												<div
											// 													ref={
											// 														provided.innerRef
											// 													}
											// 													{...provided.draggableProps}
											// 													{...provided.dragHandleProps}
											// 													className="masonry-image-container"
											// 													data-index={
											// 														index
											// 													}
											// 													style={{
											// 														...provided
											// 															.draggableProps
											// 															.style,
											// 														position:
											// 															'relative',
											// 														transition:
											// 															'all 0.2s',
											// 														opacity:
											// 															snapshot.isDragging
											// 																? 0.8
											// 																: 1,
											// 														cursor: snapshot.isDragging
											// 															? 'grabbing'
											// 															: 'pointer',
											// 														border: info.selectedImages.includes(
											// 															index,
											// 														)
											// 															? '2px solid #007bff'
											// 															: 'none',
											// 														borderRadius:
											// 															'4px',
											// 														overflow:
											// 															'hidden',
											// 														transform:
											// 															snapshot.isDragging
											// 																? `${provided.draggableProps.style.transform} scale(1.02)`
											// 																: provided
											// 																		.draggableProps
											// 																		.style
											// 																		.transform,
											// 													}}
											// 												>
											// 													<img
											// 														src={
											// 															src
											// 														}
											// 														alt={`Gallery image ${index}`}
											// 														style={{
											// 															width: '100%',
											// 															display:
											// 																'block',
											// 															pointerEvents:
											// 																info.isDragging
											// 																	? 'none'
											// 																	: 'auto',
											// 														}}
											// 														onClick={() =>
											// 															!info.isDragging &&
											// 															handleImageSelect(
											// 																index,
											// 															)
											// 														}
											// 													/>
											// 												</div>
											// 											)}
											// 										</Draggable>
											// 									</>
											// 								);
											// 							},
											// 						)}
											// 						{provided.placeholder}
											// 					</Masonry>
											// 				</ResponsiveMasonry>
											// 			</div>
											// 		)}
											// 	</Droppable>

											// 	{/* Drag Preview */}
											// 	{info.isDragging &&
											// 		info.draggedImages.length > 0 && (
											// 			<div
											// 				style={{
											// 					position: 'fixed',
											// 					left:
											// 						info.dragPreviewPosition?.x ||
											// 						0,
											// 					top:
											// 						info.dragPreviewPosition?.y ||
											// 						0,
											// 					transform: 'translate(-50%, -50%)',
											// 					pointerEvents: 'none',
											// 					zIndex: 9999,
											// 					display: 'flex',
											// 					gap: '4px',
											// 				}}
											// 			>
											// 				{info.draggedImages.map((index) => {
											// 					const image =
											// 						info?.imagesList?.docs[index];
											// 					const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
											// 					const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_optimized?.key}?${params}`;

											// 					return (
											// 						<img
											// 							key={index}
											// 							src={src}
											// 							alt="Drag Preview"
											// 							style={{
											// 								width: '100px',
											// 								height: '100px',
											// 								objectFit: 'cover',
											// 								opacity: 0.8,
											// 								borderRadius: '4px',
											// 								boxShadow:
											// 									'0 2px 8px rgba(0,0,0,0.2)',
											// 							}}
											// 						/>
											// 					);
											// 				})}
											// 			</div>
											// 		)}
											// </DragDropContext>
											// <div
											// 	className="rearrange-grid"
											// 	style={{
											// 		display: 'flex',
											// 		flexWrap: 'wrap',
											// 		gap: '10px',
											// 		padding: '10px',
											// 	}}
											// >
											// 	{info?.imagesList?.docs?.map((image, index) => {
											// 		const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
											// 		const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_optimized?.key}?${params}`;

											// 		return (
											// 			<div
											// 				key={index}
											// 				className={`rearrange-image-container ${
											// 					info.selectedImages.includes(index)
											// 						? 'selected'
											// 						: ''
											// 				}`}
											// 				draggable={info.selectedImages.includes(
											// 					index,
											// 				)}
											// 				onDragStart={(e) =>
											// 					handleDragStart(e, index)
											// 				}
											// 				onDragOver={(e) => e.preventDefault()}
											// 				onDrop={(e) => handleDragEnd(e, index)}
											// 				onClick={() => handleImageSelect(index)}
											// 				style={{
											// 					width: '200px',
											// 					height: '200px',
											// 					position: 'relative',
											// 					cursor: info.selectedImages.includes(
											// 						index,
											// 					)
											// 						? 'grab'
											// 						: 'pointer',
											// 				}}
											// 			>
											// 				<img
											// 					src={src}
											// 					alt={`Gallery image ${index}`}
											// 					style={{
											// 						width: '100%',
											// 						height: '100%',
											// 						objectFit: 'cover',
											// 					}}
											// 				/>
											// 				{info.isMouseInGallery && (
											// 					<div className="imageOverlay"></div>
											// 				)}
											// 			</div>
											// 		);
											// 	})}
											// </div>
										)}
									</InfiniteScroll>

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
											<div className="selectedImagesActions">
												{info?.selectedImages?.length === 1 && (
													<div onClick={handleExpandClick}>
														<ExpandIcon />
													</div>
												)}
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
																<input
																	type="text"
																	placeholder="type to Search or create"
																	value={info.tagSearchValue}
																	onChange={(e) =>
																		setInfo((prev) => ({
																			...prev,
																			tagSearchValue:
																				e.target.value,
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
															<li
																style={{
																	cursor:
																		info?.selectedImages
																			.length === 1
																			? 'pointer'
																			: 'not-allowed',
																}}
																onClick={() =>
																	handleSetAlbumCover()
																}
															>
																Set as cover
															</li>
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
									)}
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
								<div className="aboutAlbum">
									<div className="albumName">
										<p>{info?.clientSelectionName}</p>
										<div
											style={{ position: 'relative' }}
											// onClick={() =>

											// }
										>
											<ThreeDotsIcon
												className="threeDotsIcon"
												style={{ cursor: 'pointer' }}
											/>

											<div></div>
										</div>
									</div>
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
												style={{ display: info?.searchValue && 'block' }}
											/>
										</div>
									</div>
								</div>
								<div
									className="galleryImagesContainer clientSelectionImagesContainer"
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
										dataLength={clientSelectionImages?.docs?.length || 0}
										next={fetchMoreImages}
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
																		// onClick={() =>
																		// 	handleImageSelect(
																		// 		index,
																		// 		image,
																		// 	)
																		// }
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

									{/* {info.selectedImages.length > 0 && (
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

				{info.activeTab === 'Settings' && (
					<div className="settingsMainContainer">
						<div className="settingsContianer">
							<GalleryOverview
								info={info}
								handleGalleryChange={handleGalleryChange}
								handleCallToAction={handleCallToAction}
								handleClientSubscription={handleClientSubscription}
								handleManageCollaboratorPopup={handleManageCollaboratorPopup}
								convertEpochToDate={convertEpochToDate}
								handleLinkChange={handleLinkChange}
							/>

							<DesignOverviewComp info={info} handleLayoutType={handleLayoutType} />

							<UploadGalleryImageCover
								info={info}
								setInfo={setInfo}
								fileInputRef={fileInputRef}
								uploadGalleryCoverChangeHandler={uploadGalleryCoverChangeHandler}
								handleSetCoverPosition={handleSetCoverPosition}
								message={message}
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
								onClick={() => scrollToSection('delete')}
								className={info.activeLink === 'delete' ? 'active' : ''}
							>
								Delete
							</li>
						</div>
					</div>
				)}
			</div>

			<ShareModal
				open={info.shareModal}
				closeModal={openShareModal}
				galleryId={galleryId}
				activeGallery={info?.activeGallery?.galleryData}
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
				title={'Permanently Delete All the selected images?'}
				paragraph={
					'You cannot undo this action.All your photos in this album lined to this label will be lost'
				}
				handleDelete={handleAlbumDelete}
			/>
			<MoveToAlbumPopup
				open={info?.showMoveToAlbum}
				closeModal={() => setInfo((prev) => ({ ...prev, showMoveToAlbum: false }))}
				galleryId={galleryId}
				albums={albumImagesCount?.albums}
				albumName={info?.albumName}
				moveImageToAlbum={(e) => handleMoveImageToAlbum(e)}
			/>
		</>
	);
};

export default GalleryPage;
