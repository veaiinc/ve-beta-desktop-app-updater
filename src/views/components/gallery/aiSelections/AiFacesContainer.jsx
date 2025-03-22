import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import PeopleCard from '../galleryView/PeopleCard';
import { ReactComponent as BackIcon } from '../../../../assets/svg/gallery/back-gray.svg';
import Skeleton from 'react-loading-skeleton';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ReactComponent as ArrowsOut } from '../../../../assets/svg/gallery/arrowsOut.svg';
import { Tooltip } from 'antd';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
// import { ReactComponent as AddNewSvg } from '../../../../assets/svg/addNew.svg';
const AiFacesContainer = ({
	galleryId,
	galleryCredentials,
	handleBackClick,
	selectedFace,
	selectedFaceId,
	activeAlbumId,
	activeTagId,
}) => {
	const navigate = useNavigate();
	const {
		galleryInfo: { getAiFace, aiFace, getAiFaceImages, aiFaceImages, aiFaceImagesReset },
	} = useContext(Context);
	const [info, setInfo] = useState({
		page: 1,
		imagePage: 1,
		activeFace: selectedFaceId || selectedFace?._id || aiFace?.faces?.[0]?._id,
		selectedFace: selectedFace || null,
		addNewPeople: false,
		isHoveredIndex: null,
	});
	const scrollRef = useRef(null);
	const debounceTimerRef = useRef(null);

	useEffect(() => {
		if (!aiFace) {
			getAiFace(galleryId, 1, 40, true);
		} else if (selectedFace?._id || selectedFaceId) {
			// Ensure aiFace.faces exists
			if (!aiFace.faces || aiFace.faces.length === 0) return;

			const matchedFace = aiFace.faces.find(
				(face) => face._id === selectedFaceId || face._id === selectedFace?._id,
			);

			if (matchedFace) {
				setInfo((prev) => ({
					...prev,
					activeFace: matchedFace._id,
					selectedFace: matchedFace,
				}));
			}
		}
	}, [aiFace, selectedFace, selectedFaceId]);

	useEffect(() => {
		getAiFaceImages(galleryId, info?.activeFace, info?.imagePage, 35, true);
	}, [info?.activeFace]);

	useEffect(() => {
		scrollRef?.current?.addEventListener('scroll', debouncedHandleScroll);
		return () => {
			scrollRef?.current?.removeEventListener('scroll', debouncedHandleScroll);
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, [aiFace]);

	const handleScroll = useCallback(() => {
		if (scrollRef?.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollRef?.current;
			if (scrollLeft + clientWidth >= scrollWidth - 20) {
				if (aiFace?.hasNextPage) {
					getAiFace(galleryId, aiFace?.currentPage + 1, 40, false);
				}
			}
		}
	}, [aiFace, getAiFace]);

	const debouncedHandleScroll = () => {
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}
		debounceTimerRef.current = setTimeout(() => {
			handleScroll();
		}, 300);
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
		if (!face) {
			return;
		}
		setInfo((prev) => ({
			...prev,
			activeFace: face?._id,
			imagePage: 1,
			selectedFace: face,
		}));
		aiFaceImagesReset();
	};
	const handleExpandClick = (image) => {
		navigate(
			`/galleries/${image?.gallery_id}/${image?.album_id}/gallery-viewer?faceId=${info?.activeFace}&image=${image?._id}&aiface=true`,
			{
				state: {
					selectedFace: info?.selectedFace,
					fromAiFaces: true,
				},
			},
		);
	};
	const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
	const src = `${galleryCredentials?.baseURL}/${info?.selectedFace?.displayImage?.optimizedImageS3Key}?${params}`;
	return (
		<div className="aiFaces-container">
			<div className="aiFaces-container-header">
				{info?.selectedFace && (
					<div className="aiFaces-selected-face">
						<div className="aiFaces-header-back" onClick={handleBackClick}>
							<BackIcon />
							<p>Back</p>
						</div>
						{/* <div className="aiFaces-selected-face-header">
							Frequently appeared with {info?.selectedFace?.name}
						</div> */}
						<div className="aiFaces-selected-face-image-container">
							<div className="aiFaces-selected-face-image">
								<div className="aiFaces-selected-face-image-container">
									<PeopleCard
										url={src}
										people={info?.selectedFace?.displayImage}
										thumbwidth={58}
										thumbHeight={58}
										key={info?.selectedFace?._id}
										match={{
											params: { tenantID: info?.selectedFace?.tenant_id },
										}}
										originalWidth={
											info?.selectedFace?.imageDetails?.activeVersion
												?.originalWidth
										}
										originalHeight={
											info?.selectedFace?.imageDetails?.activeVersion
												?.originalHeight
										}
									/>
								</div>
								<div className="aiFaces-selected-face-image-name">
									<p>{info?.selectedFace?.name}</p>
									<span>{info?.selectedFace?.numberOfPhotos || 0} Images</span>
								</div>
							</div>
							{/* {info?.addNewPeople ? (
							<div
								className="aiFaces-selected-face-image-cross"
								onClick={() =>
									setInfo((prev) => ({ ...prev, addNewPeople: false }))
								}
							>
								<CrossSvg />
							</div>
						) : (
							<div
								className="aiFaces-selected-face-image-addNewPeople"
								onClick={() => setInfo((prev) => ({ ...prev, addNewPeople: true }))}
							>
								<AddNewSvg />
								<p>Add new people</p>
							</div>
						)} */}
						</div>
					</div>
				)}

				<div className="aiFaces-container-scroll" ref={scrollRef}>
					<div className="aiPeople">
						{aiFace?.faces?.map((face) => {
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
										padding: '4px',
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
				</div>
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
								300: 1,
								600: 2,
								900: 3,
								1300: 4,
								1600: 5,
								1900: 6,
								2200: 7,
							}}
						>
							<Masonry gutter="10px" className="aiFaces_masonry">
								{aiFaceImages?.images
									? aiFaceImages?.images?.map((image, index) => {
											const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
											const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_optimized?.key}?${params}`;
											return (
												<div
													key={index}
													className="aiFaces-image-singleImage"
													onClick={() => handleExpandClick(image)}
													onMouseEnter={() =>
														setInfo((prev) => ({
															...prev,
															isHoveredIndex: index,
														}))
													}
													onMouseLeave={() =>
														setInfo((prev) => ({
															...prev,
															isHoveredIndex: null,
														}))
													}
												>
													<img
														src={src}
														alt={`Gallery image ${index}`}
														onClick={() => handleExpandClick(image)}
														style={{
															width: '100%',
															display: 'block',
															borderRadius: '8px',
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
