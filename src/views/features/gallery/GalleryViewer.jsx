import { memo, useContext, useEffect, useState, useRef } from 'react';
import '../../../assets/scss/gallery/galleryViewer.scss';
import { useSearchParams, useParams, useNavigate, useLocation } from 'react-router-dom';
import Context from '../../../context/context';
import Thumbnails from '../../components/gallery/galleryView/Thumbnails';
import FullImagesComponent from '../../components/gallery/galleryView/FullImagesComponent';
import ImageDetailNav from '../../components/gallery/galleryView/ImageDetailNav';
import DeletePopup from '../../components/modalsV2/gallery/DeletePopup';
import { message } from '../../components/globalComponents/CustomToast';
import { ReactComponent as CrossWhite } from '../../../assets/svg/workspaceSettings/cross.svg';
import Skeleton from 'react-loading-skeleton';
import gsap from 'gsap';
import ReactModal from '../../components/modalsV2';
import { ReactComponent as InfoIcon } from '../../../assets/svg/gallery/info.svg';
import { ReactComponent as ChevronLeft } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { Slider } from 'antd';
import { ReactComponent as Pin } from '../../../assets/svg/gallery/pin.svg';
import { ReactComponent as Download } from '../../../assets/svg/gallery/download.svg';
import { ReactComponent as Delete } from '../../../assets/svg/gallery/delete-red.svg';
import { Tooltip } from 'antd';
import slugify from 'slugify';
import Peopleitem from '../../components/gallery/galleryView/PeopleCard';
import { ReactComponent as AlbumCoverIcon } from '../../../assets/svg/gallery/albumCoverIcon.svg';
import Loader from '../../components/loaders/Spinner';

// import { Background } from '@xyflow/react';

const FakeLoadingComponent = () => {
	return (
		<div
			className="galleryViewerCotnainer"
			style={{ position: 'absolute', top: '80px', left: 0 }}
		>
			<div className="galleryThumbnails" id="galleryThumbnails-target">
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '24px',
					}}
				>
					{[...Array(15)].map((_, index) => (
						<div key={index} className="imageContainer">
							<Skeleton width="79px" height="50px" />
						</div>
					))}
				</div>
			</div>

			<div className="activeImageContainer">
				<div className="activeImageWrapper" id="activeImageWrapper-target">
					{[...Array(1)].map((_, index) => (
						<div key={index} className="imageContainer" style={{ width: '800px' }}>
							<Skeleton width="1000px" height="900px" />
						</div>
					))}
				</div>

				<div className="galleryViewerNavbarContainer">
					<div className="galleryViewerNavbar"></div>

					<div className="gallerySelectionContainer"></div>
				</div>
			</div>
		</div>
	);
};

const GalleryViewer = ({
	open,
	closeModal,
	selectedImage,
	currentSelectedImages = null,
	aiFace,
	activeGalleryId = null,
	activeAlbumId = null,
	selectedFace = null,
	tagId = null,
	handleOpenUploadCover,
	handleClickAlbum,
}) => {
	const [searchkeys, setsearchkeys] = useSearchParams();
	const selectedImages = currentSelectedImages;
	const aiface = aiFace;
	const faceId = selectedFace;
	const activeImageId = selectedImage;
	const hasRunFakeLoading = useRef(true);
	const navigate = useNavigate();
	const isThumbnailClicked = useRef(false); // New ref to track thumbnail clicks

	const isLightGallery = searchkeys.get('lite-gallery') === 'true';

	const customStyles = {
		content: { zIndex: 9999, height: '100vh', width: '100vw' },
		overlay: { zIndex: 9998, background: 'var(--card-over-card)' },
	};

	const {
		galleryInfo: {
			getGalleryImages,
			imagesList,
			galleryCredentials,
			getGalleryCredentials,
			getImageDetail,
			updateImageDetail,
			imageDetail,
			deleteImages,
			getGalleryTagsList,
			tagsList,
			addGalleryTag,
			removeTagFromImage,
			addTagToImage,
			getDownloadLinkForImage,
			getAiFaceImages,
			aiFaceImages,
			tenantAlbums,
			albumImagesCount,
			getAlbumCount,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		index: 0,
		page: 1,
		limit: 40,
		activeImage: null,
		activeImageIndex: null,
		imageDetailId: null,
		showDeleteAlbum: false,
		fakeLoading: false,
		imageScalling: 1,
		searchInput: '',
		showLabels: true,
		facesLoading: false,
		downloadLoading: false,
	});

	useEffect(() => {
		if (!aiface && !imagesList && tagId) {
			getGalleryImages(
				activeGalleryId,
				activeAlbumId,
				tagId,
				info?.page,
				info?.limit,
				'',
				true,
			);
		}

		if (aiface && faceId && (!aiFaceImages || aiFaceImages.images?.length === 0)) {
			getAiFaceImages(activeGalleryId, faceId, info?.page, info?.limit, true);
		}

		if (
			(imagesList || (aiFaceImages && aiFaceImages.images?.length > 0)) &&
			activeImageId &&
			hasRunFakeLoading.current
		) {
			hasRunFakeLoading.current = false;
			setInfo((prev) => ({
				...prev,
				fakeLoading: true,
			}));

			setTimeout(() => {
				setInfo((prev) => ({
					...prev,
					fakeLoading: false,
				}));
			}, 1500);
		}

		// Only set activeImage to activeImageId if we don't already have an active image
		// This prevents resetting to the first image when fetching more images
		if (
			(imagesList || (aiFaceImages && aiFaceImages.images?.length > 0)) &&
			activeImageId &&
			!info?.activeImage
		) {
			setInfo((prev) => ({
				...prev,
				activeImage: activeImageId,
			}));
			setTimeout(() => {
				const image = document.getElementById(activeImageId || '');
				if (image) {
					image.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}
			}, 1000);
		}

		if (!galleryCredentials) {
			getGalleryCredentials(activeGalleryId);
		}
	}, [imagesList, selectedImages, faceId, activeGalleryId, aiface, activeImageId]);

	useEffect(() => {
		if (info?.activeImage) {
			const thumbnail = document.getElementById('thumbnail' + info?.activeImage);
			if (thumbnail) {
				thumbnail.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		}
	}, [info?.activeImage]);
	// Update active image index when images list changes (after fetching more images)
	useEffect(() => {
		if (info?.activeImage && (imagesList || aiFaceImages)) {
			const currentImages = aiface ? aiFaceImages?.images : imagesList?.docs;
			if (currentImages) {
				const newIndex = currentImages.findIndex((img) => img?._id === info?.activeImage);
				if (newIndex !== -1 && newIndex !== info?.activeImageIndex) {
					setInfo((prev) => ({
						...prev,
						activeImageIndex: newIndex,
					}));

					// Restore scroll position to the active image after a short delay

					const image = document.getElementById(info?.activeImage);
					if (image) {
						image.scrollIntoView({ behavior: 'instant', block: 'start' });
					}
				}
			}
		}
	}, [imagesList, aiFaceImages, info?.activeImage, info?.activeImageIndex]);

	useEffect(() => {
		if (info?.imageDetailId && info?.imageDetailId !== imageDetail?._id) {
			getImageDetail(info?.imageDetailId);
		}

		if (info?.imageDetailId) {
			const duration = 0.5;
			const opacity = 0;
			const y = 90;
			gsap.from('.galleryViewerNavbarContainer', {
				opacity,
				duration,
				y: 70,
			});
			gsap.from('.stagger_step_animation1', {
				opacity,
				duration,
				y: 10,
			});
			gsap.from('.stagger_step_animation2', {
				opacity,
				duration,
				y: 90,
			});
			gsap.from('.stagger_step_animation3', {
				opacity,
				duration,
				height: 30,
				y: 70,
			});
			gsap.from('.stagger_step_animation4', {
				opacity,
				duration,
				y: 40,
			});
		}
	}, [info?.imageDetailId]);

	useEffect(() => {
		if (info?.activeImage) {
			const image = document.getElementById(info?.activeImage);
			if (image) {
				image.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		}
	}, [info?.activeImage]);

	useEffect(() => {
		if (!tagsList) {
			getGalleryTagsList(activeGalleryId);
		}
	}, []);
	const fetchMoreImages = () => {
		const nextPage = info.page + 1;

		if (aiface) {
			getAiFaceImages(activeGalleryId, selectedFace, nextPage, info?.limit).then(() => {
				setInfo((prev) => ({
					...prev,
					page: nextPage,
				}));
			});
		} else {
			getGalleryImages(activeGalleryId, activeAlbumId, tagId, nextPage, info?.limit).then(
				() => {
					setInfo((prev) => ({
						...prev,
						page: nextPage,
					}));
				},
			);
		}
	};

	const activeThumbnailFunction = (id, index) => {
		isThumbnailClicked.current = true; // Set flag to true when thumbnail is clicked
		setInfo((prev) => ({
			...prev,
			activeImage: id,
			activeImageIndex: index,
			imageDetailId: id, // Optionally open image details on thumbnail click
		}));

		// Scroll to the selected image in the FullImagesComponent
		setTimeout(() => {
			const imageElement = document.getElementById(id);
			if (imageElement) {
				imageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
			// Reset the flag after a short delay to allow observer to resume
			setTimeout(() => {
				isThumbnailClicked.current = false;
			}, 1000);
		}, 100);
	};
	const largeImageFunction = (id, index) => {
		setInfo((prev) => {
			let options =
				prev.activeImage === id
					? { imageDetailId: id }
					: { imageDetailId: id, activeImageIndex: index, activeImage: id };
			return {
				...prev,
				...options,
			};
		});
	};

	const handleAlbumDelete = async () => {
		const payload = {
			image_ids: [info?.activeImage],
		};

		const response = await deleteImages(payload, activeGalleryId, activeAlbumId);
		if (response[0] === true) {
			setInfo((prev) => ({
				...prev,
				showDeleteAlbum: false,
				imageDetailId: null,
			}));
			message.success('Images deleted successfully');
		} else {
			message.error('Failed to delete images');
		}
	};
	const handleCloseGallery = () => {
		closeModal();
	};

	const handleRotateImage = async (degree) => {
		const payload = {
			rotation: degree,
		};
		const response = await updateImageDetail(payload, info?.imageDetailId);
		if (response[0] === true) {
			message.success('Image rotated successfully');
		} else {
			message.error('Failed to rotate image');
		}
	};

	const currentActiveImage = aiface
		? aiFaceImages?.images?.find((image) => image?._id === info?.activeImage)
		: imagesList?.docs?.find((image) => image?._id === info?.activeImage);

	const displayedImages = (aiface ? aiFaceImages?.images : imagesList?.docs)?.filter(
		(image) => selectedImages?.includes(image?._id) || !selectedImages,
	);
	const handleNavigation = (direction) => {
		if (!displayedImages || displayedImages.length === 0) return;

		let newIndex = info.activeImageIndex;

		if (direction === 'prev') {
			newIndex = Math.max(info.activeImageIndex - 1, 0);
		} else if (direction === 'next') {
			newIndex = Math.min(info.activeImageIndex + 1, displayedImages.length - 1);
		}

		const newImage = displayedImages[newIndex];
		if (!newImage) return;

		setInfo((prev) => ({
			...prev,
			activeImage: newImage._id,
			activeImageIndex: newIndex,
		}));

		// Scroll to the newly selected image
		setTimeout(() => {
			const imageElement = document.getElementById(newImage._id);
			if (imageElement) {
				imageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		}, 100);

		// Optionally trigger `fetchMoreImages()` if at end
		if (
			direction === 'next' &&
			newIndex === displayedImages.length - 1 &&
			!selectedImages &&
			imagesList?.hasNextPage
		) {
			fetchMoreImages();
		}
	};

	const handleAlbumClick = (album) => {
		if (activeAlbumId === album?._id) return;
		setInfo((prev) => ({
			...prev,
			activeImageIndex: 0,
			activeImage: null,
			imageDetailId: null,
		}));
		handleClickAlbum(album, 'albumName');
	};

	const addTagHandler = async () => {
		if (
			!info?.searchInput.trim().length ||
			tagsList?.list.find((tag) => tag.displayName === info?.searchInput)
		) {
			return;
		}

		const json = {
			displayName: info.searchInput,
			slug: slugify(info.searchInput, { lower: true, strict: true }),
		};

		const response = await addGalleryTag(json, activeGalleryId);
		if (response?.[0] === true) {
			setInfo((prev) => ({
				...prev,
			}));
		}
	};
	const handleTagChange = (e, tagId, imageId) => {
		const isTagSelected = e.target.checked;
		const payload = {
			image_ids: [imageId],
		};
		if (isTagSelected) {
			addTagToImage(payload, activeGalleryId, activeAlbumId, tagId);
			getAlbumCount(activeGalleryId, activeAlbumId);
		} else {
			removeTagFromImage(payload, activeGalleryId, activeAlbumId, tagId);
		}
		message.success('Tag update Successfull');
	};

	const handleDownloadSingleImage = async () => {
		message.success('Downloading Started...');
		setInfo((prev) => ({
			...prev,
			downloadLoading: true,
		}));

		const response = await getImageDetail(info?.activeImage);
		const totalBytes = response?.[1]?.activeVersion?.s3_original?.size;
		if (response?.[0]) {
			const response = await getDownloadLinkForImage(
				info?.activeImage,
				isLightGallery,
				totalBytes,
			);
			setInfo((prev) => ({
				...prev,
				downloadLoading: false,
			}));
			if (response?.[0]) {
				message.success('Downloading Completed...');
			} else {
				message.error('Failed to download image');
			}
		}
	};
	const handleSelectedImage = async (open) => {
		if (open) {
			// Only fetch if faces are not already loaded for the current image
			if (
				!imageDetail ||
				imageDetail?._id !== info?.activeImage ||
				!imageDetail?.activeVersion?.faces
			) {
				setInfo((prev) => ({ ...prev, facesLoading: true }));
				await getImageDetail(info?.activeImage);
				setInfo((prev) => ({ ...prev, facesLoading: false }));
			}
		}
	};

	const handlePeopleClick = (face) => {
		const formattedFace = {
			_id: face.face_id || face._id,
			name: face.name || 'Unknown',
			displayImage: face.displayImage || {
				optimizedImageS3Key: face.optimizedImageS3Key || face.s3_optimized?.key,
			},
			tenant_id: face.tenant_id,
			imageDetails: face.imageDetails || {
				activeVersion: {
					originalWidth: face.originalWidth || 0,
					originalHeight: face.originalHeight || 0,
				},
			},
		};
		navigate(`/galleries/${activeGalleryId}`, {
			state: {
				activePeopleState: 'AI',
				activeTab: 'Ai People',
				selectedFace: formattedFace,
				returnFromViewer: true,
			},
		});
		closeModal();
	};
	const handleChangeCover = (type) => {
		const selectedImagesDetails = imagesList?.docs?.find(
			(image) => image._id === info?.activeImage,
		);

		if (selectedImagesDetails) {
			handleOpenUploadCover(selectedImagesDetails, type);
		}
	};
	return (
		<ReactModal isOpen={open} closeModal={closeModal} customStyles={customStyles}>
			<div className="galleryViewerCotnainer">
				<div className="closeGallery">
					<div className="closeGallery-left">
						<ChevronLeft
							onClick={handleCloseGallery}
							style={{ transform: 'rotate(180deg)', height: '24px', width: '24px' }}
						/>
						<div className="imageAlbumTabsContainer">
							{albumImagesCount?.albums
								?.filter((album) => album.imagesCount > 0) // Only include albums with images
								.map((album) => {
									let src = null;
									if (album?.coverImage?._id) {
										const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
										src = `${galleryCredentials?.baseURL}/${tenantAlbums?.tenant_id}/${activeGalleryId}/optimized/${album?.coverImage?.givenFileName}?${params}`;
									}
									return (
										<span
											key={album._id}
											className={`eachAlbumTab ${
												activeAlbumId === album?._id ? 'active' : ''
											}`}
											onClick={() => handleAlbumClick(album)}
										>
											{album?.coverImage?._id && (
												<img
													src={src}
													alt="album-cover"
													style={{
														width: '24px',
														height: '24px',
														borderRadius: '50%',
														overflow: 'hidden',
													}}
												/>
											)}
											<span className="eachAlbumDetails">{album.title}</span>
											<span className="eachAlbumCount">
												{album.imagesCount}
											</span>
										</span>
									);
								})}
						</div>
					</div>
					<div className="closeGallery-right">
						<Tooltip
							title={
								<div className="changeCoverContainer">
									<div
										className="changeCoverContainerItem"
										onClick={() => {
											handleChangeCover('album');
										}}
									>
										Change Album Cover
									</div>
									<div
										className="changeCoverContainerItem"
										onClick={() => {
											handleChangeCover('gallery');
										}}
									>
										Change Gallery Cover
									</div>
								</div>
							}
							trigger={'click'}
							overlayStyle={{ zIndex: 10000 }}
							arrow={false}
							placement="bottom"
							color="transparent"
						>
							<div className="eachImageOptions">
								<AlbumCoverIcon />
								Change Cover
							</div>
						</Tooltip>
						<Tooltip
							title={
								<div className="lablesContainer lablesListContainer">
									<div className="header">
										<input
											type="text"
											placeholder="type to Search or create"
											value={info?.searchInput}
											onChange={(e) =>
												setInfo((prev) => ({
													...prev,
													searchInput: e.target.value,
												}))
											}
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													addTagHandler();
												}
											}}
										/>
										<CrossWhite
											onClick={() =>
												setInfo((prev) => ({
													...prev,
													searchInput: '',
													// showLabels: true,
												}))
											}
										/>
									</div>

									<div className="line"></div>

									<div className="labelsList">
										{tagsList?.list
											?.filter((tag) =>
												tag?.displayName
													?.toLowerCase()
													.includes(info?.searchInput?.toLowerCase()),
											)
											?.map((tag) => (
												<div className="pinOptionsList">
													<input
														type="checkbox"
														checked={imageDetail?.galleryTags?.find(
															(checkTag) => tag._id === checkTag?._id,
														)}
														onChange={(e) =>
															handleTagChange(
																e,
																tag?._id,
																info?.activeImage,
															)
														}
													/>
													<span className="checkboxText">
														{tag?.displayName}
													</span>
												</div>
											))}
									</div>
								</div>
							}
							placement="bottom"
							arrow={false}
							trigger={'click'}
							zIndex={10000}
						>
							<div className="eachImageOptions">
								<Pin /> Tags
							</div>
						</Tooltip>
						<div
							className="eachImageOptions"
							onClick={() => handleDownloadSingleImage()}
						>
							{info?.downloadLoading ? <Loader /> : <Download />} Download
						</div>
						<div
							className="eachImageOptions deleteImage"
							onClick={() => setInfo((prev) => ({ ...prev, showDeleteAlbum: true }))}
						>
							<Delete /> Delete
						</div>
					</div>
				</div>
				<div className="activeImageContainer">
					{info?.activeImage && (imagesList || aiFaceImages) && (
						<FullImagesComponent
							key={activeAlbumId}
							galleryCredentials={galleryCredentials}
							fetchMoreImages={fetchMoreImages}
							imagesList={aiface ? aiFaceImages : imagesList}
							largeImageFunction={largeImageFunction}
							info={info}
							setInfo={setInfo}
							selectedImages={selectedImages}
							isAiFace={aiface}
							activeImageIndex={info?.activeImageIndex}
							isThumbnailClicked={isThumbnailClicked}
						/>
					)}
					{/* {info?.imageDetailId && (
						<ImageDetailNav
							info={info}
							setInfo={setInfo}
							imageDetail={imageDetail}
							galleryCredentials={galleryCredentials}
							galleryId={activeGalleryId}
							albumId={activeAlbumId}
							handleRotateImage={handleRotateImage}
							getGalleryTagsList={getGalleryTagsList}
							tagsList={tagsList}
							addGalleryTag={addGalleryTag}
							addTagToImage={addTagToImage}
							removeTagFromImage={removeTagFromImage}
							getDownloadLinkForImage={getDownloadLinkForImage}
							closeModal={() => closeModal()}
							handleOpenUploadCover={handleOpenUploadCover}
						/>
					)} */}

					<Tooltip
						title={
							<div
								className="peopleSelectionImages"
								style={{
									width: '100%',
									display: 'flex',

									gap: '8px',
								}}
							>
								{info?.facesLoading && (
									<div style={{ display: 'flex', gap: '8px', width: '100%' }}>
										{[...Array(2)].map((_, i) => (
											<Skeleton
												key={i}
												style={{
													width: '48px',
													height: '48px',
													borderRadius: '50%',
												}}
											/>
										))}
									</div>
								)}
								{!info?.facesLoading &&
									imageDetail?.activeVersion?.faces?.map((face) => {
										const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
										const src = `${galleryCredentials?.baseURL}/${imageDetail?.activeVersion?.s3_optimized?.key}?${params}`;

										return (
											// <div
											// 	className="rounded"
											// 	key={face?._id}
											// 	style={{
											// 		backgroundImage: `url(${src})`,
											// 		backgroundSize: 'cover',
											// 		backgroundRepeat: 'no-repeat',
											// 	}}
											// ></div>
											<div
												onClick={() => handlePeopleClick(face)}
												style={{ cursor: 'pointer' }}
											>
												<Peopleitem
													url={src}
													people={face}
													thumbwidth={48}
													thumbHeight={48}
													key={face?._id}
													originalWidth={
														imageDetail?.activeVersion?.originalWidth
													}
													originalHeight={
														imageDetail?.activeVersion?.originalHeight
													}
												/>
											</div>
										);
									})}
							</div>
						}
						onOpenChange={(open) => {
							handleSelectedImage(open);
						}}
						arrow={false}
						trigger={'hover'}
						color="transparent"
						placement="topLeft"
						zIndex={10000}
					>
						<div className="imageSelectedPeopleContainer">
							<InfoIcon />
							<span>People</span>
						</div>
					</Tooltip>
				</div>

				<div className="currentImageDetailsContainer">
					<div className="currentImageDetailsContainer-left">
						<div className="infoIcon">
							<InfoIcon />
						</div>
						<span>{currentActiveImage?.displayName}</span>
					</div>
					<div className="currentImageCountContainer">
						<ChevronLeft
							style={{ transform: 'rotate(180deg)', cursor: 'pointer' }}
							onClick={() => handleNavigation('prev')}
						/>
						<span className="currentImageCountContainerText">
							{info?.activeImageIndex + 1} /{' '}
							{!currentSelectedImages
								? aiface
									? aiFaceImages?.totalDocs
									: imagesList?.totalDocs
								: displayedImages?.length}
						</span>
						<ChevronLeft
							onClick={() => handleNavigation('next')}
							style={{ cursor: 'pointer' }}
						/>
					</div>
					<div className="currentImageScallingContainer">
						<span
							onClick={() =>
								setInfo((prev) => ({
									...prev,
									imageScalling: Math.max(0.1, prev.imageScalling - 0.1),
								}))
							}
						>
							-
						</span>
						<div style={{ position: 'relative', width: '137px', height: '100%' }}>
							<Slider
								min={1}
								max={200}
								value={info?.imageScalling * 100}
								onChange={(value) =>
									setInfo((prev) => ({ ...prev, imageScalling: value / 100 }))
								}
								trackStyle={{ backgroundColor: 'var(--primary-button)' }}
								railStyle={{ backgroundColor: 'var(--stroke)' }}
							/>

							<div
								style={{
									position: 'absolute',
									left: 'calc((100 - 1) / (200 - 1) * 100%)', // Position at 100 on a 1–200 scale
									top: 0,
									height: '100%',
									width: '1px',
									backgroundColor: 'var(--secondary-font)',
									pointerEvents: 'none',
									opacity: 0.5,
								}}
							/>
						</div>
						<span
							onClick={() =>
								setInfo((prev) => ({
									...prev,
									imageScalling: Math.min(2, prev.imageScalling + 0.1),
								}))
							}
						>
							+
						</span>
					</div>
				</div>
				<Thumbnails
					galleryCredentials={galleryCredentials}
					fetchMoreImages={fetchMoreImages}
					imagesList={aiface ? aiFaceImages : imagesList}
					aiFaceImages={aiFaceImages}
					activeThumbnailFunction={activeThumbnailFunction}
					info={info}
					selectedImages={selectedImages}
					isAiFace={aiface}
					activeImageIndex={info?.activeImageIndex}
				/>
				<DeletePopup
					open={info?.showDeleteAlbum}
					closeModal={() => setInfo((prev) => ({ ...prev, showDeleteAlbum: false }))}
					galleryId={activeGalleryId}
					title={'Permanently Delete  image?'}
					paragraph={
						'You cannot undo this action.All your photos in this album lined to this label will be lost'
					}
					handleDelete={handleAlbumDelete}
				/>
			</div>

			{/* {info?.fakeLoading && <FakeLoadingComponent />} */}
		</ReactModal>
	);
};

export default memo(GalleryViewer);
