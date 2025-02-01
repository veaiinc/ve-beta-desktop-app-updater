import React from 'react';
import '../../../../assets/scss/tasks/galleryView.scss';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import CardItem from '../listView/CardItem';
import Skeleton from 'react-loading-skeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../../helpers';
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
	return (
		<div className="gallery-view">
			{loading ? (
				<div className="gallery-view-wrapper">
					{[...Array(10)].map((_, index) => (
						<div className="cardItemSkeleton" key={index}>
							<Skeleton width="230px" height="200px" borderRadius="12px" />
						</div>
					))}
				</div>
			) : error ? (
				<span
					style={{
						color: '#808080',
						margin: '10px auto',
						alignSelf: 'center',
						display: 'block',
						textAlign: 'center',
						padding: '30px 0',
					}}
				>
					{error}
				</span>
			) : data?.length !== 0 ? (
				<InfiniteScroll
					dataLength={data?.length || 0}
					next={fetchMoreData}
					hasMore={hasMore}
					loader={<FetchMoreLoaderComp />}
					height={infiniteScrollHeight || 'calc(100vh - 100px)'}
					className="gallery-view-wrapper"
					scrollThreshold="90%"
				>
					<>
						{data?.map((task, index) => (
							<CardItem
								key={task._id}
								task={task}
								responseMetadata={responseMetadata}
								colors={colors}
								rowTypes={rowTypes}
								properties={properties}
								handleUpdate={handleUpdate}
								onClick={() => handleRowClick(task)}
							/>
						))}
						<div className="gallery-view-add-card" onClick={handleAddButtonOnClick}>
							<PlusSvg /> Add Card
						</div>
					</>
				</InfiniteScroll>
			) : (
				<span
					style={{
						color: '#808080',
						margin: '10px auto',
						alignSelf: 'center',
						display: 'block',
						textAlign: 'center',
						padding: '30px 0',
					}}
				>
					No tasks found
				</span>
			)}
		</div>
	);
};

export default GalleryView;
