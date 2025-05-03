import React from 'react';
import '../../../../assets/scss/tasks/galleryView.scss';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import CardItem from '../listView/CardItem';
import Skeleton from 'react-loading-skeleton';
import InfiniteScroll from '../../../components/globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../../helpers';
import GalleryCard from '../listView/GalleryCard';

const GalleryView = ({
	responseMetadata,
	colors,
	fetchMoreData,
	handleRowClick,
	handleUpdate,
	data,
	loading,
	hasMore,
	error,
	rowTypes,
	properties,
	handleAddButtonOnClick,
	infiniteScrollHeight,
}) => {
	const renderContent = () => {
		if (loading && !data?.length) {
			return (
				<div className="gallery-view-wrapper">
					{[...Array(10)].map((_, index) => (
						<div className="cardItemSkeleton" key={index}>
							<Skeleton width="230px" height="200px" borderRadius="12px" />
						</div>
					))}
				</div>
			);
		}

		if (error) {
			return <span className="gallery-view-message">{error}</span>;
		}

		if (!data?.length) {
			return <span className="gallery-view-message">No tasks found</span>;
		}

		return (
			<InfiniteScroll
				dataLength={data?.length || 0}
				next={fetchMoreData}
				hasMore={hasMore}
				loader={<FetchMoreLoaderComp />}
				height={infiniteScrollHeight || '100%'}
				scrollThreshold={0.8}
			>
				<div className="gallery-view-wrapper">
					{data?.map((task) => (
						// <CardItem
						// 	key={task._id}
						// 	task={task}
						// 	responseMetadata={responseMetadata}
						// 	colors={colors}
						// 	rowTypes={rowTypes}
						// 	properties={properties}
						// 	handleUpdate={handleUpdate}
						// 	onClick={() => handleRowClick(task)}
						// 	className="card-item"
						// />
						<GalleryCard
							key={task._id}
							task={task}
							responseMetadata={responseMetadata}
							handleUpdate={handleUpdate}
						/>
					))}
					<div className="gallery-view-add-card" onClick={handleAddButtonOnClick}>
						<PlusSvg /> Add Card
					</div>
				</div>
			</InfiniteScroll>
		);
	};

	return <div className="gallery-view">{renderContent()}</div>;
	// return <div className="gallery-view">hiiii</div>;
};

export default GalleryView;
