import React, { useContext } from 'react';
import '../../../../assets/scss/tasks/galleryView.scss';
import Skeleton from 'react-loading-skeleton';
import InfiniteScroll from '../../../components/globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../../helpers';
import GalleryCard from '../listView/GalleryCard';
import Context from '../../../../context/context';

const GalleryView = ({
	responseMetadata,
	fetchMoreData,
	handleUpdate,
	data,
	loading,
	hasMore,
	error,
}) => {
	const {
		tasks: { listTasks },
	} = useContext(Context);
	const { today = 0 } = listTasks?.analytics || {};

	return (
		<div className="gallery-view">
			<div className="gallery-view-header">
				<div className="today-count">
					Today <span className="today-count-value">{today}</span>
				</div>
			</div>
			{loading ? (
				<div className="gallery-view-wrapper">
					{[...Array(6)].map((_, index) => (
						<div className="cardItemSkeleton" key={index}>
							<Skeleton width="310px" height="270px" borderRadius="12px" />
						</div>
					))}
				</div>
			) : error ? (
				<span className="gallery-view-message">{error}</span>
			) : !data?.length ? (
				<span className="gallery-view-message">No tasks found</span>
			) : (
				<InfiniteScroll
					dataLength={data?.length || 0}
					next={fetchMoreData}
					hasMore={hasMore}
					loader={<FetchMoreLoaderComp />}
					scrollThreshold={0.8}
					className="gallery-view-infinite-scroll"
				>
					<div className="gallery-view-wrapper">
						{data?.map((task) => (
							<GalleryCard
								key={task._id}
								task={task}
								responseMetadata={responseMetadata}
								handleUpdate={handleUpdate}
							/>
						))}
					</div>
				</InfiniteScroll>
			)}

			{/* {renderContent()} */}
		</div>
	);
};

export default GalleryView;
