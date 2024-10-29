import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const FullImagesComponent = ({
	galleryCredentials,
	fetchMoreImages,
	imagesList,
	largeImageFunction,
	info,
	setInfo,
}) => {
	return (
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
	);
};

export default FullImagesComponent;
