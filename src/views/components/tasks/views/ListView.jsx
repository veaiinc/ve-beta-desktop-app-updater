/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback } from 'react';
import '../../../../assets/scss/tasks/listView.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../../helpers';
import ListViewRow from '../listView/ListViewRow';
import Skeleton from 'react-loading-skeleton';

const ListView = ({
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
	infiniteScrollHeight,
}) => {
	const generateSkeleton = useCallback(() => {
		return [...Array(6)].map((_, index) => (
			<div className="listItemSkeleton" key={index}>
				<Skeleton
					color="var(--primary-font)"
					width="100%"
					height="38px"
					borderRadius="12px"
				/>
			</div>
		));
	}, []);
	return (
		<div className="listViewContainer">
			{loading ? (
				generateSkeleton()
			) : error ? (
				<div className="errorContainer">{error}</div>
			) : data?.length !== 0 ? (
				<InfiniteScroll
					dataLength={data?.length || 0}
					next={fetchMoreData}
					hasMore={hasMore}
					loader={<FetchMoreLoaderComp />}
					style={{
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
						overflow: 'auto',
					}}
					height={infiniteScrollHeight || 'calc(100vh - 100px)'}
					scrollThreshold="90%"
				>
					{data?.map((task, index) => (
						<ListViewRow
							task={task}
							key={task.id || index}
							properties={properties}
							rowTypes={rowTypes}
							handleUpdate={handleUpdate}
							handleRowClick={handleRowClick}
							responseMetadata={responseMetadata}
							colors={colors}
						/>
					))}
				</InfiniteScroll>
			) : (
				<div className="noDataMessage">No Data found</div>
			)}
		</div>
	);
};

export default memo(ListView);
