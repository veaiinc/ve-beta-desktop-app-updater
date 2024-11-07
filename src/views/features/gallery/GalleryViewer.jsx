import React, { useContext, useEffect, useState } from 'react';
import '../../../assets/scss/gallery/galleryViewer.scss';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import Thumbnails from '../../components/gallery/galleryView/Thumbnails';
import FullImagesComponent from '../../components/gallery/galleryView/FullImagesComponent';
import ImageDetailNav from '../../components/gallery/galleryView/ImageDetailNav';
import DeletePopup from '../../components/modalsV2/gallery/DeletePopup';
import { message } from 'antd';
import { ReactComponent as CrossWhite } from '../../../assets/svg/workspaceSettings/cross.svg';
import Skeleton from 'react-loading-skeleton';
const GalleryViewer = () => {
	const { galleryId, albumId } = useParams();
	const [searchkeys, setsearchkeys] = useSearchParams();

	const {
		galleryInfo: {
			getGalleryImages,
			imagesList,
			galleryCredentials,
			getGalleryCredentials,
			getImageDetail,
			imageDetail,
			deleteImages,
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
		if (!imagesList) {
			getGalleryImages(
				galleryId,
				albumId,
				searchkeys.get('tagId'),
				info?.page,
				info?.limit,
				true,
			);
			// setsearchkeys({ tagId: searchkeys.get('tagId') });
		}

		const imageId = searchkeys.get('image');
		if (imagesList && imageId) {
			setInfo((prev) => ({
				...prev,
				activeImage: searchkeys.get('image'),
				fakeLoading: true,
			}));
			setTimeout(() => {
				const image = document.getElementById(imageId || '');
				if (image) {
					image.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
	}, [imagesList]);

	useEffect(() => {
		if (info?.activeImage) {
			const thumbnail = document.getElementById('thumbnail' + info?.activeImage);
			if (thumbnail) {
				thumbnail.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}

			if (searchkeys.get('image')) {
				setsearchkeys({ tagId: searchkeys.get('tagId') });
			}
		}
	}, [info?.activeImage]);

	useEffect(() => {
		if (info?.imageDetailId) {
			getImageDetail(info?.imageDetailId);
		}
	}, [info?.imageDetailId]);

	const fetchMoreImages = () => {
		const nextPage = info.page + 1;
		getGalleryImages(galleryId, albumId, searchkeys.get('tagId'), nextPage, info?.limit).then(
			() => {
				setInfo((prev) => ({
					...prev,
					page: nextPage,
				}));
			},
		);
	};

	const activeThumbnailFunction = (id, index) => {
		setInfo((prev) => ({
			...prev,
			activeImage: id,
			activeImageIndex: index,
		}));

		setTimeout(() => {
			const image = document.getElementById(id);
			if (image) {
				image.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
		navigate(`/gallery-page/${galleryId}`);
	};

	return (
		<>
			<div className="closeGallery">
				<CrossWhite onClick={handleCloseGallery} />

				{info?.imageDetailId && (
					<p onClick={handleCloseGallery}>{imageDetail?.displayName}</p>
				)}
			</div>

			<div
				className="galleryViewerCotnainer"
				// style={{ display: info?.fakeLoading ? 'none' : 'flex' }}
			>
				<Thumbnails
					galleryCredentials={galleryCredentials}
					fetchMoreImages={fetchMoreImages}
					imagesList={imagesList}
					activeThumbnailFunction={activeThumbnailFunction}
					info={info}
				/>

				<div className="activeImageContainer">
					<FullImagesComponent
						galleryCredentials={galleryCredentials}
						fetchMoreImages={fetchMoreImages}
						imagesList={imagesList}
						largeImageFunction={largeImageFunction}
						info={info}
						setInfo={setInfo}
					/>

					{info?.imageDetailId && (
						<ImageDetailNav
							info={info}
							setInfo={setInfo}
							imageDetail={imageDetail}
							galleryCredentials={galleryCredentials}
							galleryId={galleryId}
							albumId={albumId}
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

			{/* <div
				className="galleryViewerCotnainer"
				style={{
					display: info?.fakeLoading ? 'flex' : 'none',
					maxHeight: '80vh',
					overflow: 'hidden',
				}}
			>
				<div
					className="galleryThumbnails"
					style={{ display: 'flex', flexDirection: 'column' }}
				>
					{[...Array(15)].map((_, index) => (
						<div key={index} className="imageContainer">
							<Skeleton width="79px" height="50px" />
						</div>
					))}
				</div>

				<div
					className="activeImageContainer"
					style={{ display: 'flex', flexDirection: 'column', gap: '72px' }}
				>
					{[...Array(3)].map((_, index) => (
						<div key={index} className="imageContainer" style={{ width: '500px' }}>
							<Skeleton
								width="100%"
								height={`${Math.floor(Math.random() * 200) + 200}px`}
							/>
						</div>
					))}
				</div>
			</div> */}
		</>
	);
};

export default GalleryViewer;
