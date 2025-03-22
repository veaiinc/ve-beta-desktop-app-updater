import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
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
}) => {
	return (
		<div className="activeImageWrapper" id="activeImageWrapper-target">
			<InfiniteScroll
				dataLength={
					isAiFace ? imagesList?.images?.length || 0 : imagesList?.docs?.length || 0
				}
				next={selectedImages ? () => {} : fetchMoreImages}
				hasMore={selectedImages ? false : imagesList?.hasNextPage || false}
				loader={<h4 style={{ color: 'white', textAlign: 'center' }}>Loading...</h4>}
				scrollableTarget="activeImageWrapper-target"
				style={{ display: 'flex', flexDirection: 'column', gap: '72px' }}
				onScroll={() => setInfo((prev) => ({ ...prev, imageDetailId: null }))}
			>
				{galleryCredentials && imagesList
					? (isAiFace ? imagesList?.images : imagesList?.docs)
							?.filter(
								(image) => selectedImages?.includes(image?._id) || !selectedImages,
							)
							?.map((image, index) => {
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
									>
										<img
											src={src}
											alt={`Gallery image ${index}`}
											style={{
												transform: `rotate(${image?.rotation || 0}deg)`,
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

export default FullImagesComponent;
