import React, { useContext, useEffect, useState } from 'react';
import Context from '../../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import PeopleCard from '../galleryView/PeopleCard';
import { ReactComponent as DownArrow } from '../../../../assets/svg/gallery/arrow-down.svg';
import { ReactComponent as SearchIcon } from '../../../../assets/svg/workflow/search.svg';
import { useLocation } from 'react-router-dom';

const AiPeopleContainer = ({
	galleryId,
	galleryCredentials,
	handleFaceClick,
	showSearch,
	searchValue,
	handleSearch,
}) => {
	const {
		galleryInfo: { getAiFace, aiFace },
	} = useContext(Context);
	const [info, setInfo] = useState({
		page: 1,
		hasNextPage: false,
		showMore: false,
	});
	useEffect(() => {
		if (!aiFace) {
			getAiFace(galleryId, 1, 65, true);
		}
		setInfo((prev) => ({
			...prev,
			hasNextPage: aiFace?.hasNextPage,
		}));
	}, [aiFace]);

	return (
		<>
			{aiFace?.faces?.length > 0 && (
				<div
					className="aiPeople-container"
					onClick={() => {
						setInfo((prev) => {
							const newShowMore = !prev.showMore;
							if (!newShowMore) {
								setTimeout(() => {
									document
										.getElementById('galleryScrollTarget_aiPeople')
										?.scrollTo({
											top: 0,
											behavior: 'smooth',
										});
								}, 100);
							}

							return { ...prev, showMore: newShowMore };
						});
					}}
				>
					<div className="aiPeople-container-header">
						<p>Ai People</p>
						<div
							className={`aiPeople-person-arrow ${info?.showMore ? 'rotated' : ''}`}
							onClick={(e) => {
								e.stopPropagation();
								setInfo((prev) => {
									const newShowMore = !prev.showMore;
									if (!newShowMore) {
										setTimeout(() => {
											document
												.getElementById('galleryScrollTarget_aiPeople')
												?.scrollTo({
													top: 0,
													behavior: 'smooth',
												});
										}, 100);
									}

									return { ...prev, showMore: newShowMore };
								});
							}}
						>
							<DownArrow />
						</div>
					</div>
					<div className="aiPeople-container-scroll">
						<InfiniteScroll
							dataLength={aiFace?.faces?.length || 0}
							next={() => getAiFace(galleryId, aiFace?.currentPage + 1, 35)}
							hasMore={info?.hasNextPage || false}
							// loader={<h4 style={{ textAlign: 'center', color: '#fff' }}>Loading...</h4>}
							scrollableTarget="galleryScrollTarget_aiPeople"
							scrollThreshold={0.5}
						>
							<div
								className={`aiPeople ${info?.showMore ? 'aiPeople-showMore' : ''}`}
								id="galleryScrollTarget_aiPeople"
							>
								{aiFace?.faces?.map((face) => {
									const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
									const src = `${galleryCredentials?.baseURL}/${face?.displayImage?.optimizedImageS3Key}?${params}`;
									return (
										<div
											className="aiPeople-person"
											onClick={() => handleFaceClick(face)}
										>
											<div className="aiPeople-person-image">
												<PeopleCard
													url={src}
													people={face?.displayImage}
													thumbwidth={58}
													thumbHeight={58}
													key={face?._id}
													match={{
														params: { tenantID: face?.tenant_id },
													}}
													originalWidth={
														face?.imageDetails?.activeVersion
															?.originalWidth
													}
													originalHeight={
														face?.imageDetails?.activeVersion
															?.originalHeight
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
				</div>
			)}
		</>
	);
};

export default AiPeopleContainer;
