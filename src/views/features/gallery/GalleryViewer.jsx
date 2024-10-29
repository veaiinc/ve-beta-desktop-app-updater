import React, { useContext, useEffect, useState, useRef } from 'react';
import { useLocation, useSearchParams, useParams } from 'react-router-dom';
import { ReactComponent as Download } from '../../../assets/svg/gallery/download.svg';
import { ReactComponent as Image } from '../../../assets/svg/gallery/gallery2.svg';
import { ReactComponent as Rotate } from '../../../assets/svg/gallery/rotate.svg';
import { ReactComponent as Share } from '../../../assets/svg/gallery/share.svg';
import { ReactComponent as Delete } from '../../../assets/svg/gallery/delete.svg';
import { ReactComponent as People } from '../../../assets/svg/gallery/persons.svg';
import { ReactComponent as Pin } from '../../../assets/svg/gallery/pin.svg';
import { ReactComponent as Edit } from '../../../assets/svg/gallery/editpen.svg';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';

const OptionsArray = [
	{
		icon: <Image />,
		label: 'Image',
	},
	{
		icon: <Rotate />,
		label: 'Rotate',
	},
	{
		icon: <Share />,
		label: 'Share',
	},
	{
		icon: <Download />,
		label: 'Download',
	},
	{
		icon: <Delete />,
		label: 'Delete',
	},
];

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
		if (!imagesList) {
			getGalleryImages(
				galleryId,
				albumId,
				searchkeys.get('tagId'),
				info?.page,
				info?.limit,
				true,
			);
		}

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
			<div className="galleryScroller" id="galleryScroller-target">
				<InfiniteScroll
					dataLength={imagesList?.docs?.length || 0}
					next={fetchMoreImages}
					hasMore={imagesList?.hasNextPage || false}
					loader={<h6 style={{ color: 'white', textAlign: 'center' }}>loading..</h6>}
					scrollableTarget="galleryScroller-target"
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '24px',
					}}
				>
					{galleryCredentials &&
						imagesList &&
						imagesList?.docs?.map((image, index) => {
							const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
							const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_thumbnail_100h?.key}?${params}`;
							return (
								<div
									className={`imageContainer ${
										info?.activeImage === image?._id ? 'active' : ''
									}`}
									id={'thumbnail' + image?._id}
									onClick={() => activeThumbnailFunction(image?._id, index)}
								>
									<img
										src={src}
										alt={`Gallery image ${index}`}
										style={{ cursor: 'pointer' }}
									/>
								</div>
							);
						})}
				</InfiniteScroll>
			</div>

			<div className="activeImageContainer">
				<div className="activeImageWrapper" id="activeImageWrapper-target">
					<InfiniteScroll
						dataLength={imagesList?.docs?.length || 0}
						next={fetchMoreImages}
						hasMore={imagesList?.hasNextPage || false}
						loader={<h4 style={{ color: 'white', textAlign: 'center' }}>Loading...</h4>}
						scrollableTarget="activeImageWrapper-target"
						style={{ display: 'flex', flexDirection: 'column', gap: '72px' }}
					>
						{galleryCredentials &&
							imagesList &&
							imagesList?.docs?.map((image, index) => {
								const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
								const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_optimized?.key}?${params}`;
								return (
									<div
										key={index}
										className="imageContainer"
										id={image?._id}
										onMouseEnter={() =>
											setInfo((prev) => ({
												...prev,
												activeImage: image?._id,
												activeImageIndex: index,
											}))
										}
										onClick={() => largeImageFunction(image?._id, index)}
									>
										<img
											src={src}
											alt={`Gallery image ${index}`}
											style={{ cursor: 'pointer' }}
										/>
									</div>
								);
							})}
					</InfiniteScroll>
				</div>

				{info?.imageDetailId && (
					<div className="galleryViewerNavbarContainer">
						<div className="galleryViewerNavbar">
							{OptionsArray?.map((option) => (
								<div key={option?.label}>{option.icon}</div>
							))}
						</div>
						<div className="gallerySelectionContainer">
							<div className="clientSelection">
								<p>Client Selection</p>
								<div className="clientSelectionImages">
									<div className="clientAlbum">
										<img src={images[0]} />
										<p>Album 1</p>
									</div>
									<div className="clientAlbum">
										<img src={images[1]} />
										<p>Album 2</p>
									</div>
									<div className="clientAlbum">
										<img src={images[2]} />
										<p>Album 3</p>
									</div>
									<div className="clientAlbum">
										<img src={images[3]} />
										<p>Album 4</p>
									</div>
								</div>
							</div>
							<div className="peopleSelection">
								<div className="peopleHeader">
									<div className="personIcon">
										<People />
									</div>
									<p>People</p>
								</div>
								<div className="peopleSelectionImages">
									<div className="rounded"></div>
									<div className="rounded"></div>
									<div className="rounded"></div>
									<div className="rounded"></div>
									<div className="rounded"></div>
									<div className="rounded"></div>
									<div className="rounded"></div>
									<div className="rounded"></div>
								</div>
							</div>
							<div className="labelsSelection">
								<div className="labelsHeader">
									<div className="labelIcon">
										<div className="pinIcon">
											<Pin />
										</div>
										<p>Labels</p>
									</div>
									<div>
										<Edit />
									</div>
								</div>
								<div>
									<p>Portraits, All</p>
									<p>
										{imageDetail?.galleryTags
											?.map((tag) => tag?.displayName)
											?.join(', ')}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default GalleryViewer;
