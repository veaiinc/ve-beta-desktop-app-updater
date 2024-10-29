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

const GalleryViewer = () => {
	const location = useLocation();
	const { galleryId, albumId } = useParams();
	const [searchkeys, setsearchkeys] = useSearchParams();

	const {
		galleryInfo: { getGalleryImages, imagesList, galleryCredentials, getGalleryCredentials },
	} = useContext(Context);

	const { images } = location.state;
	const [info, setInfo] = useState({
		index: 0,
		page: 1,
		limit: 20,
		activeImage: null,
		activeImageIndex: 0,
	});

	const galleryScrollerRef = useRef(null);
	const activeImageWrapperRef = useRef(null);

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
			// // Find the index of the active image
			// const activeIndex = info?.activeImageIndex;

			// // Calculate the scroll position based on the active image
			// const scrollPosition = activeIndex * 50; // adjust based on your image height

			// // Check if the active image is below the overflow
			// const isBelowOverflow =
			// 	scrollPosition >
			// 	galleryScrollerRef.current.scrollHeight - galleryScrollerRef.current.clientHeight;

			// console.log(isBelowOverflow);

			// // If the image is below the overflow, scroll to the top of the next image
			// if (isBelowOverflow) {
			// 	const nextImageIndex = activeIndex + 1;
			// 	const nextImageScrollPosition = nextImageIndex * 120;
			// 	galleryScrollerRef.current.scrollTop = nextImageScrollPosition;
			// } else {
			// 	// Scroll the galleryScroller to match the active image position
			// 	// galleryScrollerRef.current.scrollTop = scrollPosition;
			// }

			galleryScrollerRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [info?.activeImage]);

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

	// console.log(info, imagesList);
	return (
		<div className="galleryViewerCotnainer">
			<div className="galleryScroller" id="galleryScroller-target" ref={galleryScrollerRef}>
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
				<div
					className="activeImageWrapper"
					id="activeImageWrapper-target"
					ref={activeImageWrapperRef}
				>
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
										onMouseEnter={() =>
											setInfo((prev) => ({
												...prev,
												activeImage: image?._id,
												activeImageIndex: index,
											}))
										}
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
