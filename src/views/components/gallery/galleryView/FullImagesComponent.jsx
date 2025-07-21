import React, { memo, useEffect } from 'react';
import InfiniteScroll from '../../globalComponents/InfiniteScroll';
import Skeleton from 'react-loading-skeleton';

const FullImagesComponent = ({
	galleryCredentials,
	fetchMoreImages,
	imagesList,
	largeImageFunction,
	info,
	setInfo,
	selectedImages,
	isAiFace,
	activeImageIndex,
}) => {
	const displayedImages = (isAiFace ? imagesList?.images : imagesList?.docs)?.filter(
		(image) => selectedImages?.includes(image?._id) || !selectedImages,
	);

	useEffect(() => {
		const handleKeyDown = (e) => {
			const currentIndex = activeImageIndex;

			if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
				// Go to previous image
				const prevIndex = Math.max(currentIndex - 1, 0);
				const prevImage = displayedImages[prevIndex];
				if (prevImage) {
					setInfo((prev) => ({
						...prev,
						activeImage: prevImage._id,
						activeImageIndex: prevIndex,
					}));
					document.getElementById(prevImage._id)?.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});
				}
			} else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
				// Go to next image
				const nextIndex = Math.min(currentIndex + 1, displayedImages.length - 1);
				const nextImage = displayedImages[nextIndex];
				if (nextImage) {
					setInfo((prev) => ({
						...prev,
						activeImage: nextImage._id,
						activeImageIndex: nextIndex,
					}));
					document.getElementById(nextImage._id)?.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [activeImageIndex, displayedImages]);

	// useEffect(() => {
	// 	if (info?.activeImageIndex) {
	// 		const activeImage = imagesList?.docs[info?.activeImageIndex];
	// 		console.log(activeImage, 'activeImage');
	// 	}
	// }, [info?.activeImageIndex]);
	return (
		<div className="activeImageWrapper" id="activeImageWrapper-target">
			<InfiniteScroll
				dataLength={displayedImages.length}
				next={selectedImages ? () => {} : fetchMoreImages}
				hasMore={selectedImages ? false : imagesList?.hasNextPage || false}
				loader={<h4 style={{ color: 'white', textAlign: 'center' }}>Loading...</h4>}
				scrollableTarget="activeImageWrapper-target"
				style={{
					display: 'flex',
					flexDirection: 'row',
					gap: '72px',
					alignItems: 'center',
					width: '100vw',
				}}
				onScroll={() => setInfo((prev) => ({ ...prev, imageDetailId: null }))}
				horizontal={true}
			>
				{galleryCredentials && imagesList
					? displayedImages.map((image, index) => {
							const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
							const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_optimized?.key}?${params}`;

							return (
								<div
									key={image?._id || index}
									className="imageContainer"
									id={image?._id}
								>
									<img
										key={info?.activeImage}
										src={src}
										alt={`Gallery image ${index}`}
										style={{
											transform: `
											rotate(${image?.rotation || 0}deg)
											scale(${image?._id === info?.activeImage ? info?.imageScalling || 1 : 1})
										`,
											transformOrigin: 'center',
										}}
										onClick={() => largeImageFunction(image?._id, index)}
									/>
								</div>
							);
					  })
					: [...Array(5)].map((_, index) => (
							<div key={index} className="imageContainer" style={{ width: '500px' }}>
								<Skeleton width="800px" height="900px" />
							</div>
					  ))}
			</InfiniteScroll>
		</div>
	);
};

export default memo(FullImagesComponent);
