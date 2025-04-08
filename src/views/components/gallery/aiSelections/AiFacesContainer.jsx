import React, { useContext, useEffect, useState } from 'react';
import Context from '../../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import PeopleCard from '../galleryView/PeopleCard';
import { ReactComponent as BackIcon } from '../../../../assets/svg/gallery/back-gray.svg';
import Skeleton from 'react-loading-skeleton';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

const AiFacesContainer = ({ galleryId, galleryCredentials, handleBackClick }) => {
	const {
		galleryInfo: { getAiFace, aiFace, getAiFaceImages, aiFaceImages, aiFaceImagesReset },
	} = useContext(Context);
	const [info, setInfo] = useState({
		page: 1,
		imagePage: 1,
		activeFace: aiFace?.faces?.[0]?._id,
	});
	useEffect(() => {
		if (!aiFace) {
			getAiFace(galleryId, 1, 40, true);
		}
	}, [aiFace]);
	useEffect(() => {
		getAiFaceImages(galleryId, info?.activeFace, info?.imagePage, 25, true);
	}, [info?.activeFace]);

	const fetchMoreFaces = () => {
		const nextPage = info?.page + 1;
		getAiFace(galleryId, nextPage).then(() => {
			setInfo((prev) => ({
				...prev,
				page: nextPage,
			}));
		});
	};
	const fetchMoreImages = () => {
		const nextPage = info?.imagePage + 1;
		getAiFaceImages(galleryId, info?.activeFace, nextPage).then(() => {
			setInfo((prev) => ({
				...prev,
				imagePage: nextPage,
			}));
		});
	};

	const handleFaceClick = (face) => {
		setInfo((prev) => ({
			...prev,
			activeFace: face?._id,
			imagePage: 1,
		}));
		aiFaceImagesReset();
	};
	return (
		<div className="aiFaces-container">
			<div className="aiFaces-header-back" onClick={handleBackClick}>
				<BackIcon style={{ fill: 'var(--primary-font)' }} />
				<p>Back</p>
			</div>
			<div className="aiFaces-container-scroll" id="aiFaces-Trigger">
				<InfiniteScroll
					dataLength={aiFace?.faces?.length || 0}
					next={fetchMoreFaces}
					hasMore={aiFace?.hasNextPage || false}
					scrollableTarget="aiFaces-Trigger"
					horizontal={true}
				>
					<div className="aiPeople">
						{aiFace?.faces?.map((face) => {
							const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
							const src = `${galleryCredentials?.baseURL}/${face?.displayImage?.optimizedImageS3Key}?${params}`;

							return (
								<div
									className="aiPeople-person"
									onClick={() => handleFaceClick(face)}
									style={{
										border:
											info?.activeFace === face?._id
												? '1px solid #B89CF9'
												: '1px solid transparent',
										borderRadius: '50%',
									}}
								>
									<div className="aiPeople-person-image">
										<PeopleCard
											url={src}
											people={face?.displayImage}
											thumbwidth={58}
											thumbHeight={58}
											key={face?._id}
											match={{ params: { tenantID: face?.tenant_id } }}
											originalWidth={
												face?.imageDetails?.activeVersion?.originalWidth
											}
											originalHeight={
												face?.imageDetails?.activeVersion?.originalHeight
											}
										/>
									</div>
									<p>{face?.name}</p>
								</div>
							);
						})}
					</div>
				</InfiniteScroll>
			</div>
			<div>
				<div className="aiFaces-image-container" id="aiFaces-image-Trigger">
					<InfiniteScroll
						dataLength={aiFaceImages?.images?.length || 0}
						next={fetchMoreImages}
						hasMore={aiFaceImages?.hasNextPage || false}
						scrollableTarget="aiFaces-image-Trigger"
						scrollThreshold={0.8}
					>
						<ResponsiveMasonry
							columnsCountBreakPoints={{
								350: 1,
								750: 2,
								900: 3,
								1200: 4,
							}}
						>
							<Masonry gutter="10px">
								{aiFaceImages?.images
									? aiFaceImages?.images?.map((image, index) => {
											const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
											const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_optimized?.key}?${params}`;
											return (
												<div key={index}>
													<img
														src={src}
														alt={`Gallery image ${index}`}
														style={{
															width: '100%',
															display: 'block',
														}}
														draggable={false}
													/>
												</div>
											);
									  })
									: [...Array(10)].map((_, index) => (
											<div key={index} className="imageContainer">
												<Skeleton width="100%" height="200px" />
											</div>
									  ))}
							</Masonry>
						</ResponsiveMasonry>
					</InfiniteScroll>
				</div>
			</div>
		</div>
	);
};

export default AiFacesContainer;
