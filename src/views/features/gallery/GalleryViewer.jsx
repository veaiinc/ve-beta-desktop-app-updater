import React, { useContext, useEffect, useState, useRef } from 'react';
import { useLocation, useSearchParams, useParams } from 'react-router-dom';
import Context from '../../../context/context';
import Thumbnails from '../../components/gallery/galleryView/Thumbnails';
import FullImagesComponent from '../../components/gallery/galleryView/FullImagesComponent';
import ImageDetailNav from '../../components/gallery/galleryView/ImageDetailNav';

const GalleryViewer = () => {
	const location = useLocation();
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

	const { images } = location.state;
	const [info, setInfo] = useState({
		index: 0,
		page: 1,
		limit: 20,
		activeImage: null,
		activeImageIndex: 0,
		imageDetailId: null,
	});

	useEffect(() => {
		getGalleryImages(
			galleryId,
			albumId,
			searchkeys.get('tagId'),
			info?.page,
			info?.limit,
			true,
		);

		if (!galleryCredentials) {
			getGalleryCredentials(galleryId);
		}
	}, []);

	useEffect(() => {
		if (info?.activeImage) {
			const thumbnail = document.getElementById('thumbnail' + info?.activeImage);
			thumbnail.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

				{info?.imageDetailId && (
					<ImageDetailNav info={info} imageDetail={imageDetail} images={images} />
				)}
			</div>
		</div>
	);
};

export default GalleryViewer;
