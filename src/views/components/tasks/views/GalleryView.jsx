import React, { useEffect, useRef, useState, useCallback } from 'react';
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
	const containerRef = useRef(null);
	const [shouldFetchMore, setShouldFetchMore] = useState(false);
	const lastCheckTime = useRef(Date.now());
	const checkInterval = 500; // Throttle check frequency

	// Check if we need to fetch more data based on scroll position
	const checkForMoreData = useCallback(() => {
		if (!containerRef.current || !hasMore || loading) return;

		const now = Date.now();
		if (now - lastCheckTime.current < checkInterval) return;
		lastCheckTime.current = now;

		const container = containerRef.current;
		const containerRect = container.getBoundingClientRect();
		const scrollContainer = container.querySelector('.infinite-scroll-component');

		if (!scrollContainer) return;

		const lastCard = scrollContainer.lastElementChild;
		if (!lastCard) return;

		const lastCardRect = lastCard.getBoundingClientRect();
		const buffer = containerRect.height * 1.5; // Load more when 1.5 viewport heights away

		// If the last card is within buffer distance of viewport bottom
		if (lastCardRect.bottom - containerRect.bottom < buffer) {
			setShouldFetchMore(true);
		} else {
			setShouldFetchMore(false);
		}
	}, [hasMore, loading]);

	// Set up intersection observer for cards
	useEffect(() => {
		if (!containerRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const isAnyCardVisible = entries.some((entry) => entry.isIntersecting);
				if (isAnyCardVisible) {
					checkForMoreData();
				}
			},
			{
				root: containerRef.current,
				threshold: 0.1,
			},
		);

		// Observe all cards
		const cards = containerRef.current.getElementsByClassName('card-item');
		Array.from(cards).forEach((card) => observer.observe(card));

		return () => observer.disconnect();
	}, [data, checkForMoreData]);

	// Fetch more data when needed
	useEffect(() => {
		if (shouldFetchMore && hasMore && !loading) {
			fetchMoreData();
			setShouldFetchMore(false);
		}
	}, [shouldFetchMore, hasMore, loading, fetchMoreData]);

	// Initial check for small content
	useEffect(() => {
		if (!loading && data?.length > 0) {
			requestAnimationFrame(checkForMoreData);
		}
	}, [loading, data, checkForMoreData]);

	// Set up resize observer
	useEffect(() => {
		if (!containerRef.current) return;

		const resizeObserver = new ResizeObserver(() => {
			requestAnimationFrame(checkForMoreData);
		});

		resizeObserver.observe(containerRef.current);
		return () => resizeObserver.disconnect();
	}, [checkForMoreData]);

	const renderContent = () => {
		if (loading) {
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
				height={infiniteScrollHeight || 'calc(100vh - 100px)'}
				className="gallery-view-wrapper"
				scrollThreshold={0.8}
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
							className="card-item"
						/>
					))}
					<div className="gallery-view-add-card" onClick={handleAddButtonOnClick}>
						<PlusSvg /> Add Card
					</div>
				</>
			</InfiniteScroll>
		);
	};

	return (
		<div className="gallery-view" ref={containerRef}>
			{renderContent()}
		</div>
	);
};

export default GalleryView;
