/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useState } from 'react';
import '../../../../assets/scss/tasks/listView.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../../helpers';
import ListViewRow from '../listView/ListViewRow';
import Skeleton from 'react-loading-skeleton';

const ListView = ({
	updatePropertyValue,
	responseMetadata,
	colors,
	fetchMoreData,
	handleRowClick,
	data,
	loading,
	hasMore,
	error,
	rowTypes,
	properties,
}) => {
	const generateSkeleton = useCallback(() => {
		return [...Array(6)].map((_, index) => (
			<div className="listItemSkeleton" key={index}>
				<Skeleton width="100%" height="38px" borderRadius="12px" />
			</div>
		));
	}, []);
	return (
		<div className="listViewContainer">
			{loading ? (
				generateSkeleton()
			) : error ? (
				<span style={{ color: '#ff9b9b', margin: '10px auto' }}>{error}</span>
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
					}}
					height="100%"
				>
					{data?.map((task, index) => (
						<ListViewRow
							task={task}
							key={index}
							properties={properties}
							rowTypes={rowTypes}
							updatePropertyValue={updatePropertyValue}
							handleRowClick={handleRowClick}
							responseMetadata={responseMetadata}
							colors={colors}
						/>
					))}
				</InfiniteScroll>
			) : (
				<span style={{ color: '#808080', margin: '10px auto' }}>No tasks found</span>
			)}
		</div>
	);
};

export default memo(ListView);
