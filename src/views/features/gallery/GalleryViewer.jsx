import React, { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/gallery/galleryViewer.scss';
import { useSearchParams, useParams, useNavigate, useLocation } from 'react-router-dom';
import Context from '../../../context/context';
import Thumbnails from '../../components/gallery/galleryView/Thumbnails';
import FullImagesComponent from '../../components/gallery/galleryView/FullImagesComponent';
import ImageDetailNav from '../../components/gallery/galleryView/ImageDetailNav';
import DeletePopup from '../../components/modalsV2/gallery/DeletePopup';
import { message } from 'antd';
import { ReactComponent as CrossWhite } from '../../../assets/svg/workspaceSettings/cross.svg';
import Skeleton from 'react-loading-skeleton';
import gsap from 'gsap';

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
							<Skeleton width="800px" height="900px" />
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

const GalleryViewer = () => {
	const { galleryId, albumId } = useParams();
	const [searchkeys, setsearchkeys] = useSearchParams();
	const location = useLocation();
	const selectedImages = location.state?.selectedImages || null;
	const [searchParams] = useSearchParams(); // Get query params
	const aiface = searchParams.get('aiface') === 'true';
	const faceId = searchParams.get('faceId');
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
			aiFaceImagesReset,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		index: 0,
		page: 1,
		limit: 20,
		activeImage: null,
		activeImageIndex: 0,
		imageDetailId: null,
		showDeleteAlbum: false,
		fakeLoading: false,
	});
	const navigate = useNavigate();

	useEffect(() => {
		if (!aiface && !imagesList) {
			getGalleryImages(
				galleryId,
				albumId,
				searchkeys.get('tagId'),
				info?.page,
				info?.limit,
				'',
				true,
			);
		}

		if (aiface && faceId && (!aiFaceImages || aiFaceImages.images?.length === 0)) {
			getAiFaceImages(galleryId, faceId, info?.page, info?.limit, true);
		}

		const imageId = searchkeys.get('image');

		if ((imagesList || (aiFaceImages && aiFaceImages.images?.length > 0)) && imageId) {
			setInfo((prev) => ({
				...prev,
				activeImage: searchkeys.get('image'),
				fakeLoading: true,
			}));
			setTimeout(() => {
				const image = document.getElementById(imageId || '');
				if (image) {
					image.scrollIntoView({ behavior: 'instant', block: 'start' });
				}
			}, 1000);

			setTimeout(() => {
				setInfo((prev) => ({
					...prev,
					fakeLoading: false,
				}));
			}, 1500);
		}

		if (!galleryCredentials) {
			getGalleryCredentials(galleryId);
		}
	}, [imagesList, selectedImages, faceId, galleryId, aiface]);

	// ... existing code ...

	useEffect(() => {
		if (info?.activeImage) {
			const thumbnail = document.getElementById('thumbnail' + info?.activeImage);
			if (thumbnail) {
				thumbnail.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}

			if (searchkeys.get('image')) {
				// Preserve all existing parameters when updating the URL
				const newParams = {
					tagId: searchkeys.get('tagId'),
				};

				// Keep the aiface parameter if it exists
				if (searchkeys.get('aiface')) {
					newParams.aiface = searchkeys.get('aiface');
				}

				// Keep the faceId parameter if it exists
				if (searchkeys.get('faceId')) {
					newParams.faceId = searchkeys.get('faceId');
				}

				setsearchkeys(newParams);
			}
		}
	}, [info?.activeImage]);

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
				// scale: 0.9,
				y: 10,
			});
			gsap.from('.stagger_step_animation2', {
				opacity,
				duration,
				// scale: 0.9,
				y: 90,
			});
			gsap.from('.stagger_step_animation3', {
				opacity,
				duration,
				height: 30,
				// scale: 0.9,
				y: 70,
			});
			gsap.from('.stagger_step_animation4', {
				opacity,
				duration,
				// height: 0,
				// scale: 0.9,
				y: 40,
			});
		}
	}, [info?.imageDetailId]);

	const fetchMoreImages = () => {
		const nextPage = info.page + 1;
		if (aiface) {
			getAiFaceImages(galleryId, searchkeys.get('faceId'), nextPage, info?.limit).then(() => {
				setInfo((prev) => ({
					...prev,
					page: nextPage,
				}));
			});
		} else {
			getGalleryImages(
				galleryId,
				albumId,
				searchkeys.get('tagId'),
				nextPage,
				info?.limit,
			).then(() => {
				setInfo((prev) => ({
					...prev,
					page: nextPage,
				}));
			});
		}
	};

	const activeThumbnailFunction = (id, index) => {
		setInfo((prev) => ({
			...prev,
			activeImage: id,
			activeImageIndex: index,
			imageDetailId: null,
		}));

		setTimeout(() => {
			const image = document.getElementById(id);
			if (image) {
				image.scrollIntoView({ behavior: 'instant', block: 'start' });
			}
		}, 300);
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
			image_ids: [info?.imageDetailId],
		};

		const response = await deleteImages(payload, galleryId, albumId);
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
		const fromAiPeople =
			aiface || location.state?.fromAiFaces || location.state?.activeTab === 'Ai People';

		const selectedFaceId = faceId || null;
		const currentImageId =
			info?.imageDetailId || info?.activeImage || searchParams.get('image');

		if (fromAiPeople) {
			navigate(`/galleries/${galleryId}`, {
				state: {
					returnFromViewer: true,
					activeAlbumId: albumId,
					activeTagId: searchkeys.get('tagId'),
					activeTab: fromAiPeople ? 'Ai People' : 'Albums',
					selectedImage: currentImageId,
					selectedFaceId: selectedFaceId,
				},
			});
		} else {
			navigate(-1);
		}
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

	return (
		<>
			<div className="closeGallery">
				<CrossWhite onClick={handleCloseGallery} />

				{info?.imageDetailId && (
					<p onClick={handleCloseGallery}>{imageDetail?.displayName}</p>
				)}
			</div>

			<div className="galleryViewerCotnainer" style={{ opacity: info?.fakeLoading ? 0 : 1 }}>
				<Thumbnails
					galleryCredentials={galleryCredentials}
					fetchMoreImages={fetchMoreImages}
					imagesList={aiface ? aiFaceImages : imagesList}
					activeThumbnailFunction={activeThumbnailFunction}
					info={info}
					selectedImages={selectedImages}
					isAiFace={aiface}
				/>

				<div className="activeImageContainer">
					<FullImagesComponent
						galleryCredentials={galleryCredentials}
						fetchMoreImages={fetchMoreImages}
						imagesList={aiface ? aiFaceImages : imagesList}
						largeImageFunction={largeImageFunction}
						info={info}
						setInfo={setInfo}
						selectedImages={selectedImages}
						isAiFace={aiface}
					/>

					{info?.imageDetailId && (
						<ImageDetailNav
							info={info}
							setInfo={setInfo}
							imageDetail={imageDetail}
							galleryCredentials={galleryCredentials}
							galleryId={galleryId}
							albumId={albumId}
							handleRotateImage={handleRotateImage}
							getGalleryTagsList={getGalleryTagsList}
							tagsList={tagsList}
							addGalleryTag={addGalleryTag}
							addTagToImage={addTagToImage}
							removeTagFromImage={removeTagFromImage}
							getDownloadLinkForImage={getDownloadLinkForImage}
						/>
					)}
				</div>

				<DeletePopup
					open={info?.showDeleteAlbum}
					closeModal={() => setInfo((prev) => ({ ...prev, showDeleteAlbum: false }))}
					galleryId={galleryId}
					title={'Permanently Delete  image?'}
					paragraph={
						'You cannot undo this action.All your photos in this album lined to this label will be lost'
					}
					handleDelete={handleAlbumDelete}
				/>
			</div>

			{info?.fakeLoading && <FakeLoadingComponent />}
		</>
	);
};

export default memo(GalleryViewer);
