import React, { useContext, useEffect, useState } from 'react';
import '../../../assets/scss/gallery/galleryViewer.scss';
import { useSearchParams, useParams } from 'react-router-dom';
import Context from '../../../context/context';
import Thumbnails from '../../components/gallery/galleryView/Thumbnails';
import FullImagesComponent from '../../components/gallery/galleryView/FullImagesComponent';
import ImageDetailNav from '../../components/gallery/galleryView/ImageDetailNav';
import DeletePopup from '../../components/modalsV2/gallery/DeletePopup';
import { message } from 'antd';

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
	});

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

		if (imagesList) {
			const imageId = searchkeys.get('image');

			if (!imageId) return;

			setInfo((prev) => ({
				...prev,
				activeImage: searchkeys.get('image'),
			}));
			setTimeout(() => {
				const image = document.getElementById(imageId || '');
				image.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}, 1000);
		}

		if (!galleryCredentials) {
			getGalleryCredentials(galleryId);
		}
	}, [imagesList]);

	useEffect(() => {
		if (info?.activeImage) {
			const thumbnail = document.getElementById('thumbnail' + info?.activeImage);
			thumbnail.scrollIntoView({ behavior: 'smooth', block: 'center' });

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
			image.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

	const handleAlbumDelete = () => {
		const payload = {
			image_ids: [info?.imageDetailId],
		};

		deleteImages(payload, galleryId, albumId).then((response) => {
			console.log('response==>', response);
			if (response[0] === true) {
				setInfo((prev) => ({
					...prev,
					showDeleteAlbum: false,
				}));
				message.success('Images deleted successfully');
			} else {
				message.error('Failed to delete images');
			}
		});
	};

	return (
		<div className="galleryViewerCotnainer">
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
	);
};

export default GalleryViewer;
