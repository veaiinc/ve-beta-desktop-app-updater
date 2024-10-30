import React, { useContext, useEffect, useState, useRef } from 'react';
import { useLocation, useSearchParams, useParams } from 'react-router-dom';
import Context from '../../../context/context';
import Thumbnails from '../../components/gallery/galleryView/Thumbnails';
import FullImagesComponent from '../../components/gallery/galleryView/FullImagesComponent';
import ImageDetailNav from '../../components/gallery/galleryView/ImageDetailNav';

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
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		index: 0,
		page: 1,
		limit: 20,
		activeImage: null,
		activeImageIndex: 0,
		imageDetailId: null,
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
			setsearchkeys({ tagId: searchkeys.get('tagId') });
		}

		if (imagesList) {
			const imageId = imagesList?.docs?.[searchkeys.get('image')] || 0;

			console.log(imageId);
			if (!imageId) return;

			setInfo((prev) => ({
				...prev,
				activeImage: imageId?._id,
			}));
			setTimeout(() => {
				const image = document.getElementById(imageId?._id || '');
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

				{info?.imageDetailId && <ImageDetailNav info={info} imageDetail={imageDetail} />}
			</div>
		</div>
	);
};

export default GalleryViewer;
