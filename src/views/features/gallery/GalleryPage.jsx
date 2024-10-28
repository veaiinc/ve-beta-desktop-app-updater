import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import share from '../../../assets/svg/gallery/share.svg';
import sixDots from '../../../assets/svg/gallery/sixdots.svg';
import threeDots from '../../../assets/svg/gallery/threeDots.svg';
import { ReactComponent as SearchIcon } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as FilterIcon } from '../../../assets/svg/chat/filter.svg';
import { ReactComponent as ExpandIcon } from '../../../assets/svg/gallery/expand.svg';
import { ReactComponent as ForwardIcon } from '../../../assets/svg/gallery/forward.svg';
import { ReactComponent as PinIcon } from '../../../assets/svg/gallery/pin.svg';
import { ReactComponent as OptionsIcon } from '../../../assets/svg/gallery/dotsThree.svg';
import { ReactComponent as GridStyleVertical } from '../../../assets/svg/gallery/gridStyleVertical.svg';
import { ReactComponent as ThumbnailV } from '../../../assets/svg/gallery/thumbnailV.svg';
import { ReactComponent as GridStyleHorizontal } from '../../../assets/svg/gallery/gridStyleH.svg';
import { ReactComponent as ThumbnailH } from '../../../assets/svg/gallery/thumbnailH.svg';
import { ReactComponent as CloudUpload } from '../../../assets/svg/Settings/CloudUpload.svg';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ReactComponent as UpArrow } from '../../../assets/svg/workflow/downArrow.svg';
import ToggleSlider from '../../../views/components/input/slider';
import { message } from 'antd';
// import AlbumSettings from './AlbumSettings';
import ShareModal from '../../../views/components/modalsV2/gallery/ShareModal';
import CreateAlbum from '../../components/modalsV2/gallery/CreateAlbum';
import CollaboratorPopup from '../../components/modalsV2/gallery/CollaboratorPopup';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Context from '../../../context/context';
import { DatePicker } from 'antd';
import moment from 'moment';
import { updateProposalQuery } from '../../../context/Templates/graphQlFunctions';
import { getInitials } from '../../../helpers/index';
import InfiniteScroll from 'react-infinite-scroll-component';

const imageURL = 'https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg';
const image1 =
	'https://i0.wp.com/picjumbo.com/wp-content/uploads/silhouette-of-a-guy-with-a-cap-at-red-sky-sunset-free-image.jpeg?h=800&quality=80';
const image2 =
	'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp';
const image3 = 'https://assets.techrepublic.com/uploads/2023/05/tr5423-what-is-generative-ai.jpeg';
const image4 =
	'https://www.nttdata.com/global/en/-/media/nttdataglobal/1_images/insights/generative-ai/generative-ai_d.jpg?h=1680&iar=0&w=2800&rev=4e69afcc968d4bab9480891634b63b34';

const data = [
	{ name: 'Albums', number: 14 },
	// { name: 'Videos', number: 2 },
	// { name: 'Slide Show', number: 1 },
	// { name: 'Client Selections', number: 6 },
	{ name: 'AI', number: '' },
];
const albumContains = [
	{ name: 'Portraits', number: 40 },
	{ name: 'Documents', number: 23 },
	{ name: 'Decor', number: 89 },
	{ name: 'All', number: 60 },
];
function createRandomImageArray() {
	const images = [image1, image2, image3, image4];
	const result = [];

	for (let i = 0; i < 40; i++) {
		const randomIndex = Math.floor(Math.random() * images.length);
		result.push(images[randomIndex]);
	}

	return result;
}

const randomizedImages = createRandomImageArray();

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

			getImage,

			updateCollaborators,
			basicAlbumDetails,
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
		activeTab: 'Albums',
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
	});
	console.log(layoutSettings, 'layoutSettings', info);
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
	const handleClickOutside = useCallback((event) => {
		const clickOutsideCheck = (ref, iconRef, stateName) => {
			if (
				ref.current &&
				!ref.current.contains(event.target) &&
				!iconRef.current.contains(event.target)
			) {
				setInfo((prevInfo) => ({ ...prevInfo, [stateName]: false }));
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
		if (!galleryCredentials) {
			getGalleryCredentials(galleryId);
		}
		if (galleryCredentials) {
			console.log(galleryCredentials, 'galleryCredentials');
		}
	}, [galleryCredentials]);
	useEffect(() => {
		if (!tenantAlbums) {
			getAlbums(galleryId);
		}
		if (!tenantPreferences) {
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
			}));
		}
		if (tenantPreferences) {
			setInfo((prev) => ({
				...prev,
				callToAction: tenantPreferences?.ctaPreferences,
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
		console.log(layoutSettings, 'this is called');
		if (!layoutSettings) {
			console.log('this is called');
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
	}, [info?.activeAlbumId]);
	useEffect(() => {
		if (info?.albumTagId && info?.activeAlbumId) {
			getGalleryImages(
				galleryId,
				info?.activeAlbumId,
				info?.albumTagId,
				info?.page,
				info?.limit,
			);
		}
	}, [info?.albumTagId, info?.activeAlbumId]);

	useEffect(() => {
		if (albumDetails?.tags?.length > 0) {
			setInfo((prev) => ({
				...prev,
				albumContains: albumDetails?.tags?.[0]?.displayName,
				albumTagId: albumDetails?.tags?.[0]?._id,
			}));
		}
	}, [albumDetails]);

	const fetchMoreImages = () => {
		console.log('calling');
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

	const handleImageSelect = (index) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			selectedImages: prevInfo.selectedImages.includes(index)
				? prevInfo.selectedImages.filter((i) => i !== index)
				: [...prevInfo.selectedImages, index],
		}));
	};

	const handleClickAlbum = (album, name) => {
		console.log(album, 'albumName======>');
		if (name === 'albumName') {
			setInfo((prevInfo) => ({
				...prevInfo,
				albumName: album?.title,
				activeAlbumId: album?._id,
				activeAlbum: album,
				albumSlug: album?.slug,
			}));
			// if (info?.albumName !== album?.title) {
			// 	getAlbumCount(galleryId, album?.title);
			// }
		} else if (name === 'containName') {
			setInfo((prevInfo) => ({
				...prevInfo,
				albumContains: album?.displayName,
				albumTagId: album?._id,
			}));
		}
	};

	const handleAlbumSettings = (sectionId) => {
		navigate(`/gallery/${galleryId}/album-settings`, {
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
		const selectedImageIndexes = info.selectedImages;
		const selectedImages = selectedImageIndexes.map((index) => randomizedImages[index]);
		const activeIndex = selectedImageIndexes[0];

		navigate(
			`/gallery-page/${galleryId}/${info?.activeAlbumId}/gallery-viewer?tagId=${info?.albumTagId}`,
			{
				state: {
					images: randomizedImages,
					selectedImages: selectedImages,
					activeIndex: activeIndex,
				},
			},
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
		setInfo((prevInfo) => ({ ...prevInfo, showPin: !prevInfo.showPin }));
	};
	const handleOptionsIcon = () => {
		setInfo((prevInfo) => ({
			...prevInfo,
			showOptionsContainer: !prevInfo.showOptionsContainer,
		}));
	};
	const handleClickContent = (name) => {
		setInfo((prevInfo) => ({ ...prevInfo, activeTab: name }));
	};
	const handleNavigateUpload = () => {
		navigate(`/gallery-page/${galleryId}/${info?.activeAlbumId}/upload-photos`);
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
			}, 800);
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
		console.log(data, 'updatedData');
		setInfo((prev) => ({
			...prev,
			collaboratorsData: data,
		}));
	};

	console.log(imagesList, 'imagesList');
	return (
		<>
			{console.log(info?.activeGallery, 'activeGallery')}
			<div className="galleryContainer">
				<div className="mainGalleryContainer">
					<div className="galleryPic">
						<div className="galleryPicSettings">
							<UpArrow />
							<p
								// onClick={() =>
								// 	setInfo((prevInfo) => ({
								// 		...prevInfo,
								// 		showSettings: !prevInfo.showSettings,
								// 	}))
								// }
								onClick={() => handleClickContent('Settings')}
								style={{ cursor: 'pointer' }}
							>
								Settings
							</p>
						</div>
						<div className="imageContaienr">
							<img src={imageURL} />
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
										onClick={() => handleClickContent(item.name)}
									>
										<p className="galleryName">{item.name}</p>
										<p className="count">{item.number}</p>
									</div>
								))}
							</div>
							<div className="shareContainer">
								<div className="icon" onClick={openShareModal}>
									<img src={share} />
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
									<img src={threeDots} />
									{info.showOptions && (
										<div
											className="optionsContainer"
											ref={optionsRef}
											onClick={(e) => e.stopPropagation()}
										>
											<li>Preview</li>
											<li>Copy link</li>
											<li>Share</li>
											<li>Unpublish</li>
										</div>
									)}
								</div>
							</div>
						</div>
						<div className="albums">
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
							{info?.tenantAlbums?.map((album, index) => (
								<div
									key={index}
									className={`album ${
										info?.albumSlug === album?.slug ? 'active' : ''
									}`}
									style={{
										background: album.image
											? ''
											: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%), #C4C4C4`,
									}}
								>
									{album.image && <img src={album?.image} />}

									<div
										className="albumDetails"
										onClick={() => handleClickAlbum(album, 'albumName')}
									>
										<p>{album?.title}</p>
										<p>{`${album?.photos} photos`}</p>
									</div>
									{/* <div className="overlay"></div> */}
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="line"></div>
				{info.activeTab === 'Albums' && (
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
												showGalleryOptions: !prevInfo.showGalleryOptions,
											}))
										}
									>
										<img src={threeDots} />
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
														handleAlbumSettings('lightroom-copy-list')
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
									<p>Rearrange manually</p>
									<div
										onClick={() =>
											setInfo((prevInfo) => ({
												...prevInfo,
												showShearch: !prevInfo.showShearch,
											}))
										}
										className="searchContainer"
									>
										<SearchIcon />
										<input type="text" placeholder="Search" />
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
												<li>File name</li>
												<li>File name (reverse)</li>
												<li>Date Captured</li>
												<li>Date captured (reverse)</li>
												<li>upload time</li>
												<li>upload time (reverse)</li>
												<li>Random</li>
											</div>
										)}
									</div>
								</div>
							</div>
							<div className="albumContains">
								{albumDetails?.tags?.map((contain, index) => (
									<div key={index} className="albumContain">
										<img src={sixDots} alt="sixDots" />
										<p
											className={
												info?.albumContains === contain.displayName
													? 'active'
													: ''
											}
											onClick={() =>
												handleClickAlbum(contain.displayName, 'containName')
											}
										>
											{contain.displayName}
										</p>
										<p className="count">{contain.imagesCount}</p>
									</div>
								))}
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
									hasMore={info.hasMore}
									loader={
										<h4 style={{ color: 'white', textAlign: 'center' }}>
											Loading...
										</h4>
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
											<div
												className="imageContainer"
												onClick={handleNavigateUpload}
											>
												<div className="imageUpload">
													<CloudUpload className="uploadIcon" />
													<p>Add Photos</p>
												</div>
											</div>

											{imagesList?.docs?.map((image, index) => {
												// Replace the problematic params construction with this fixed version
												const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
												const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_optimized?.key}?${params}`;
												return (
													<div
														key={index}
														className={`imageContainer ${
															info.selectedImages.includes(index)
																? 'selected'
																: ''
														}`}
														onClick={() => handleImageSelect(index)}
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
											})}
										</Masonry>
									</ResponsiveMasonry>
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
											<div style={{ position: 'relative' }} ref={pinIconRef}>
												<PinIcon onClick={handlePinIcon} />
												{info.showPin && (
													<div className="pinOptions" ref={pinSearchRef}>
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
														<div className="pinOptionsList">
															<label className="checkboxLabel">
																<input type="checkbox" />
																<span className="checkboxText">
																	Portraits
																</span>
															</label>
															<label className="checkboxLabel">
																<input type="checkbox" />
																<span className="checkboxText">
																	Documentary
																</span>
															</label>
															<label className="checkboxLabel">
																<input type="checkbox" />
																<span className="checkboxText">
																	Decor
																</span>
															</label>
														</div>
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
														<li>Delete</li>
													</div>
												)}
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				)}

				{info.activeTab === 'Settings' && (
					<div className="settingsMainContainer">
						<div className="settingsContianer">
							<div id="gallery-overview" className="settings-overview">
								<p className="heading">Gallery overview</p>
								<p className="subHeading">
									Gallery URL
									<span className="subTitle">- ankitttt.ve-s.../-my gallery</span>
								</p>
								<div className="renameGallery">
									<p className="subHeading">Rename Gallery </p>
									<p className="subTitle">
										Renaming affects the URL. Share the new link with clients
										each time.
									</p>
									{console.log(tenantGalleries, 'tenantGallery')}
									<input
										placeholder="Hannef x Mahi"
										value={info.activeGallery?.galleryData?.title}
										onChange={handleGalleryChange}
									/>
								</div>
								<div className="galleryDate">
									<p className="subHeading">Gallery Date </p>
									<p className="subTitle">
										Sort galleries by this date. Which is visible to the client
									</p>
									<div>
										{console.log(
											convertEpochToDate(
												info.activeGallery?.galleryData?.dueDateEpoch,
											),
											'dueDateEpoch',
										)}
										<DatePicker
											className="datePicker"
											format="DD-MM-YYYY"
											selected={convertEpochToDate(
												info.activeGallery?.galleryData?.dueDateEpoch,
											)}
											// onChange={(date, dateString) =>
											// 	handleAlbumNameChange(dateString, 'date')
											// }
										/>
									</div>
								</div>
								<div className="callToAction">
									<p className="subHeading">Call to Action (CTA)</p>
									<div className="callToActionToggle">
										<ToggleSlider
											value={info?.callToAction?.isEnabled}
											onChange={handleCallToAction}
										/>
										<p className="subTitle">
											Enable to display CTA for the gallery.
										</p>
									</div>
									<input
										placeholder="https://Instagtagram/sam/9tbevccxggvcxg"
										value={info?.callToAction?.link}
										onChange={handleLinkChange}
									/>
								</div>
								<div className="clientSubscription">
									<p className="subHeading">Client Subscription</p>
									<div className="clientSubscriptionToggle">
										<ToggleSlider />
										<p className="subTitle">
											Allow clients to subscribe and take ownership after
											expiry.
										</p>
									</div>
								</div>
								<div className="collaborators">
									<div className="collaboratorsContainer">
										<div>
											<p className="subHeading">3 Collaborators</p>
											<p className="subTitle">
												Collaborators are your team members that you want to
												add to or remove from this gallery.
											</p>
										</div>
										<p
											className="subHeading manageButton"
											onClick={handleManageCollaboratorPopup}
										>
											+ Manage Collaborators
										</p>
									</div>
									<div className="collaboratorsList">
										{info?.collaboratorsData?.map((ele, index) => (
											<div className="collaboratorsContainer">
												<div className="collaboratorsImage">
													<div className="tenantLogo">
														<p>
															{getInitials(
																ele?.firstName,
																ele?.lastName,
															)}
														</p>
													</div>
												</div>
												<p>{ele?.firstName}</p>
											</div>
										))}
									</div>
								</div>
							</div>
							<div id="design" className="settings-overview">
								<div className="designaContainer">
									<p className="heading">Design</p>
									<div className="previewLayout">
										<p className="subTitle">Preview layout</p>
										<UpArrow />
									</div>
								</div>
								<div className="coverDesign">
									<p className="subHeading">Select gallery cover design</p>
									<div className="selectDesign">
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
									</div>
								</div>
								<div className="aiBackground">
									<p className="subHeading">AI Background</p>
									<div className="aiTogglebar">
										<ToggleSlider />
										<p className="subTitle">
											Automatically choose cover color based on photo
										</p>
									</div>
								</div>
								<div className="titleText">
									<p className="subHeading">Title text</p>
									<div className="textContainer">
										<input
											type="text"
											placeholder="FreightText Pro + Futura PT "
										/>
										<UpArrow />
									</div>
								</div>
								<div className="grid-style">
									<p className="subHeading">Grid Style</p>
									<div className="grid-types">
										<div
											className={`box ${
												info?.gridStyle?.vertical ? 'activeBorder' : ''
											}`}
											onClick={() =>
												handleLayoutType('gridStyle', 'vertical')
											}
										>
											<GridStyleVertical
												className={
													info?.gridStyle?.vertical ? 'active' : ''
												}
											/>
											<p
												className={`subTitle ${
													info?.gridStyle?.vertical ? 'active' : ''
												}`}
											>
												Vertical
											</p>
										</div>
										<div
											className={`box ${
												info?.gridStyle?.horizontal ? 'activeBorder' : ''
											}`}
											onClick={() =>
												handleLayoutType('gridStyle', 'horizontal')
											}
										>
											<GridStyleHorizontal
												className={
													info?.gridStyle?.horizontal ? 'active' : ''
												}
											/>
											<p
												className={`subTitle ${
													info?.gridStyle?.horizontal ? 'active' : ''
												}`}
											>
												Horizontal
											</p>
										</div>
									</div>
								</div>
								<div className="thumbnail-size">
									<p className="subHeading">Thumbnail Size</p>
									<div className="thumbnail-types">
										<div
											className={`box ${
												info?.thumbnailSize?.regular ? 'activeBorder' : ''
											}`}
											onClick={() =>
												handleLayoutType('thumbnailSize', 'regular')
											}
										>
											<ThumbnailV
												className={
													info?.thumbnailSize?.regular ? 'active' : ''
												}
											/>
											<p
												className={`subTitle ${
													info?.thumbnailSize?.regular ? 'active' : ''
												}`}
											>
												Regular
											</p>
										</div>
										<div
											className={`box ${
												info?.thumbnailSize?.large ? 'activeBorder' : ''
											}`}
											onClick={() =>
												handleLayoutType('thumbnailSize', 'large')
											}
										>
											<ThumbnailH
												className={
													info?.thumbnailSize?.large ? 'active' : ''
												}
											/>
											<p
												className={`subTitle ${
													info?.thumbnailSize?.large ? 'active' : ''
												}`}
											>
												Large
											</p>
										</div>
									</div>
								</div>
							</div>
							<div id="delete" className="settings-overview">
								<p className="heading">Delete Gallery </p>
								<p className="subTitle">
									You cannot undo this. All your albums and information will be
									lost.
								</p>
								<p className="deletePermanently">Delete permanently</p>
							</div>
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

			<ShareModal open={info.shareModal} closeModal={openShareModal} />
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
		</>
	);
};

export default GalleryPage;
