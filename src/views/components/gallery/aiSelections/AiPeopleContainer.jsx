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
	});
	useEffect(() => {
		if (!aiFace) {
			getAiFace(galleryId, 1, 80, true);
		}
	}, [aiFace]);

	const fetchMoreFaces = () => {
		const nextPage = info?.page + 1;
		getAiFace(galleryId, nextPage).then(() => {
			setInfo((prev) => ({
				...prev,
				page: nextPage,
			}));
		});
	};

	return (
		<div className="aiPeople-container" id="galleryScrollTarget_aiPeople">
			<p>All Faces detected in the Images using AI</p>
			<InfiniteScroll
				dataLength={aiFace?.faces?.length || 0}
				next={fetchMoreFaces}
				hasMore={aiFace?.hasNextPage || false}
				loader={<h4>Loading...</h4>}
				scrollableTarget="galleryScrollTarget_aiPeople"
				// scrollThreshold={0.2}
			>
				<div className="aiPeople">
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
