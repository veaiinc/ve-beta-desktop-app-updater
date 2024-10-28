import React, { useContext, useEffect, useState } from 'react';
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

const GalleryViewer = () => {
	const location = useLocation();
	const { galleryId, albumId } = useParams();
	const [searchkeys, setsearchkeys] = useSearchParams();

	const {
		galleryInfo: { getGalleryImages, imagesList, galleryCredentials, getGalleryCredentials },
	} = useContext(Context);

	const { images, selectedImages, index: activeIndex } = location.state;
	const [info, setInfo] = useState({
		index: 0,
		page: 1,
		limit: 20,
		hasMore: false,
	});

	// useEffect(() => {
	// 	if (location.state) {
	// 		const { activeIndex } = location.state;
	// 		setInfo({
	// 			index: activeIndex || 0,
	// 		});
	// 	}
	// }, [location.state]);

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

	console.log(imagesList, galleryCredentials);

	const handleScroll = (event) => {
		const container = event.target;
		const scrollPosition = container.scrollLeft;
		const imageWidth = container.clientWidth;
		const newIndex = Math.round(scrollPosition / imageWidth);
		setInfo({ index: newIndex });
	};

	const fetchMoreImages = () => {
		const nextPage = info.page + 1;
		getGalleryImages(galleryId, albumId, searchkeys.get('tagId'), nextPage, info?.limit).then(
			() => {
				setInfo((prev) => ({
					...prev,
					page: nextPage,
					hasMore: imagesList?.hasNextPage || false,
				}));
			},
		);
	};

	return (
		<div className="galleryViewerCotnainer">
			<div className="galleryScroller">
				{/* {images.map((image, index) => (
					<div
						key={index}
						className={`imageContainer ${index === info.index ? 'active' : ''}`}
					>
						<img src={image} alt={`Gallery image ${index}`} />
					</div>
				))} */}

				{galleryCredentials &&
					imagesList &&
					imagesList?.docs?.map((image, index) => {
						// console.log(image.activeVersion.s3_original.key);
						const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
						const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_thumbnail_100h?.key}?${params}`;
						return (
							<div
								className={`imageContainer ${index === info.index ? 'active' : ''}`}
							>
								<img src={src} alt={`Gallery image ${index}`} />
							</div>
						);
					})}
			</div>

			<div className="activeImageContainer">
				<div
					className="activeImageWrapper"
					id="activeImageWrapper-target"
					onScroll={handleScroll}
				>
					<InfiniteScroll
						dataLength={imagesList?.docs?.length || 0}
						next={fetchMoreImages}
						hasMore={info.hasMore}
						loader={<h4 style={{ color: 'white', textAlign: 'center' }}>Loading...</h4>}
						scrollableTarget="activeImageWrapper-target"
					>
						{galleryCredentials &&
							imagesList &&
							imagesList?.docs?.map((image, index) => {
								const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
								const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_optimized?.key}?${params}`;
								return (
									<div key={index} className="imageContainer">
										<img src={src} alt={`Gallery image ${index}`} />
									</div>
								);
							})}
					</InfiniteScroll>
				</div>
				<div className="galleryViewerNavbarContainer">
					<div className="galleryViewerNavbar">
						<div>
							<Image />
						</div>
						<div>
							<Rotate />
						</div>
						<div>
							<Share />
						</div>
						<div>
							<Download />
						</div>
						<div>
							<Delete />
						</div>
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
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GalleryViewer;
