import React, { useContext, useEffect, useState } from 'react';
import Context from '../../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import PeopleCard from '../galleryView/PeopleCard';
import { ReactComponent as BackIcon } from '../../../../assets/svg/gallery/back-gray.svg';

const AiFacesContainer = ({ galleryId, galleryCredentials }) => {
	const {
		galleryInfo: { getAiFace, aiFace, getAiFaceImages },
	} = useContext(Context);
	const [info, setInfo] = useState({
		page: 1,
		activeFace: aiFace?.faces?.[0]?._id,
	});
	useEffect(() => {
		if (!aiFace) {
			getAiFace(galleryId, 1, 40, true);
		}
	}, [aiFace]);
	useEffect(() => {
		getAiFaceImages(galleryId, info?.activeFace);
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
	const handleFaceClick = (face) => {
		setInfo((prev) => ({
			...prev,
			activeFace: face?._id,
		}));
	};
	return (
		<div className="aiFaces-container">
			<div className="aiFaces-header-back">
				<BackIcon />
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
							console.log(face, 'face');
							return (
								<div
									className="aiPeople-person"
									onClick={() => handleFaceClick(face)}
									style={{
										border:
											info?.activeFace === face?._id
												? '1px solid #B89CF9'
												: '1px solid transparent',
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
			<div></div>
		</div>
	);
};

export default AiFacesContainer;
