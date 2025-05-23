/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback } from 'react';
import '../../../../assets/scss/tasks/listView.scss';
import { FetchMoreLoaderComp } from '../../../../helpers';
import ListViewRow from '../listView/ListViewRow';
import Skeleton from 'react-loading-skeleton';
import InfiniteScroll from '../../globalComponents/InfiniteScroll';

const ListView = ({
	responseMetadata,
	colors,
	fetchMoreData,
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
					height={'100%'}
					scrollThreshold="90%"
				>
					{data?.map((task, index) => (
						<ListViewRow
							task={task}
							key={task.id || index}
							properties={properties}
							rowTypes={rowTypes}
							handleUpdate={handleUpdate}
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
