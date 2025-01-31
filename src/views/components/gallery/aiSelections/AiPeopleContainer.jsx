import React, { useContext, useEffect, useState } from 'react';
import Context from '../../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import PeopleCard from '../galleryView/PeopleCard';

const AiPeopleContainer = ({ galleryId, galleryCredentials, handleFaceClick }) => {
	const {
		galleryInfo: { getAiFace, aiFace },
	} = useContext(Context);
	const [info, setInfo] = useState({
		page: 1,
		hasNextPage: false,
	});
	useEffect(() => {
		if (!aiFace) {
			getAiFace(galleryId, 1, 35, true);
		}
		setInfo((prev) => ({
			...prev,
			hasNextPage: aiFace?.hasNextPage,
		}));
	}, [aiFace]);

	// const fetchMoreFaces = () => {
	// 	console.log('fetchMoreFaces');
	// 	const nextPage = info?.page + 1;
	// 	getAiFace(galleryId, nextPage).then(() => {
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			page: nextPage,
	// 		}));
	// 	});
	// };

	return (
		<div className="aiPeople-container">
			<p>All Faces detected in the Images using AI</p>
			<InfiniteScroll
				dataLength={aiFace?.faces?.length || 0}
				next={() => getAiFace(galleryId, aiFace?.currentPage + 1, 35)}
				hasMore={info?.hasNextPage || false}
				loader={<h4 style={{ textAlign: 'center', color: '#fff' }}>Loading...</h4>}
				scrollableTarget="galleryScrollTarget_aiPeople"
				scrollThreshold={0.5}
			>
				<div className="aiPeople" id="galleryScrollTarget_aiPeople">
					{aiFace?.faces?.map((face) => {
						const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
						const src = `${galleryCredentials?.baseURL}/${face?.displayImage?.optimizedImageS3Key}?${params}`;
						return (
							<div className="aiPeople-person" onClick={() => handleFaceClick(face)}>
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
	);
};

export default AiPeopleContainer;
