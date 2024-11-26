import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from 'react-loading-skeleton';

const Thumbnails = ({
	galleryCredentials,
	fetchMoreImages,
	imagesList,
	activeThumbnailFunction,
	info,
	selectedImages,
}) => {
	return (
		<div className="galleryThumbnails" id="galleryThumbnails-target">
			<InfiniteScroll
				dataLength={imagesList?.docs?.length || 0}
				next={selectedImages ? () => {} : fetchMoreImages}
				hasMore={selectedImages ? false : imagesList?.hasNextPage || false}
				loader={<h6 style={{ color: 'white', textAlign: 'center' }}>loading..</h6>}
				scrollableTarget="galleryThumbnails-target"
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '24px',
				}}
			>
				{galleryCredentials && imagesList
					? imagesList?.docs
							?.filter(
								(image) => selectedImages?.includes(image?._id) || !selectedImages,
							)
							?.map((image, index) => {
								const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
								const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_thumbnail_100h?.key}?${params}`;
								return (
									<div
										className={`imageContainer ${
											info?.imageDetailId === image?._id ? 'active' : ''
										}`}
										id={'thumbnail' + image?._id}
										key={'key-thumbnail' + index + '+' + image?._id}
										onClick={() => activeThumbnailFunction(image?._id, index)}
										style={{
											border:
												info?.activeImage === image?._id &&
												info?.imageDetailId !== image?._id
													? '1.3px solid gray'
													: '',
										}}
									>
										<img
											src={src}
											alt={`Gallery image ${index}`}
											style={{ cursor: 'pointer' }}
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

export default Thumbnails;
