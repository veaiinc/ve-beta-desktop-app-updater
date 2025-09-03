import { memo, useEffect } from 'react';
import InfiniteScroll from '../../globalComponents/InfiniteScroll';
import Skeleton from 'react-loading-skeleton';

const Thumbnails = ({
	galleryCredentials,
	fetchMoreImages,
	imagesList,
	aiFaceImages,
	activeThumbnailFunction,
	info,
	selectedImages,
	isAiFace,
	activeImageIndex,
}) => {
	// Calculate the correct index in the full image list
	const currentImages = isAiFace ? imagesList?.images : imagesList?.docs;
	const correctActiveIndex =
		currentImages?.findIndex((img) => img?._id === info?.activeImage) ?? -1;
	useEffect(() => {
		if (info?.activeImage) {
			const thumbnail = document.getElementById('thumbnail' + info.activeImage);
			if (thumbnail) {
				thumbnail.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
			}
		}
	}, [info?.activeImage, activeImageIndex]);
	return (
		<div className="galleryThumbnails" id="galleryThumbnails-target">
			<InfiniteScroll
				// key={`thumbnails-${info?.page}-${
				// 	isAiFace ? aiFaceImages?.images?.length || 0 : imagesList?.docs?.length || 0
				// }`}
				dataLength={
					isAiFace ? imagesList?.images?.length || 0 : imagesList?.docs?.length || 0
				}
				next={fetchMoreImages}
				hasMore={imagesList?.hasNextPage || false}
				horizontal={true}
				style={{
					display: 'flex',
					gap: '16px',
					overflow: 'scroll',
				}}
			>
				{galleryCredentials && imagesList
					? (isAiFace ? imagesList?.images : imagesList?.docs)?.map((image, index) => {
							const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
							const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_optimized?.key}?${params}`;
							return (
								<div
									className={`imageContainer ${
										correctActiveIndex === index ? 'active' : ''
									}`}
									id={'thumbnail' + image?._id}
									key={image?._id || 'key-thumbnail' + index}
									onClick={() => activeThumbnailFunction(image?._id, index)}
								>
									<img
										src={src}
										alt="thumbnail"
										style={{
											width: '100%',
											borderRadius: '8px',
											objectFit: 'cover',
										}}
									/>
								</div>
							);
					  })
					: [...Array(15)].map((_, index) => (
							<div key={index} className="imageContainer">
								<Skeleton width="79px" height="50px" />
							</div>
					  ))}
			</InfiniteScroll>
		</div>
	);
};

export default memo(Thumbnails);
