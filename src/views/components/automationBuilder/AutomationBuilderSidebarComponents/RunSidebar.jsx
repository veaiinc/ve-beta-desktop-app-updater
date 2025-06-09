import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/runSidebar.scss';
import { ReactComponent as Tick } from '../../../../assets/svg/workflow/Tick.svg';
import HeaderComponent from './HeaderComponent';
import { Tooltip } from 'antd';
import Context from '../../../../context/context';
import Skeleton from 'react-loading-skeleton';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../../helpers';

const formatExecutionTime = (createdAt, completedAt) => {
	if (!createdAt || !completedAt) return 'Not available';

	const duration = moment.duration(moment.unix(completedAt).diff(moment.unix(createdAt)));
	const hours = duration.hours();
	const minutes = duration.minutes();
	const seconds = duration.seconds();

	let formattedTime = [];
	if (hours > 0) formattedTime.push(`${hours} hr`);
	if (minutes > 0) formattedTime.push(`${minutes} min`);
	if (seconds > 0 || formattedTime.length === 0) formattedTime.push(`${seconds} sec`);

	return formattedTime.join(' ');
};

const RunSidebar = ({ automationId, onClose }) => {
	const {
		automationBuilder: { executionHistory, getExecutionHistory },
	} = useContext(Context);

	const [info, setInfo] = useState({
		executionHistory: [],
		error: '',
		loading: true,
		page: 1,
		hasNextPage: false,
		totalDocs: 0,
		totalPages: 0,
	});

	const mounted = useRef(true);
	const isInitialLoad = useRef(true);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			mounted.current = false;
		};
	}, []);

	// Initial fetch
	useEffect(() => {
		if (!mounted.current) return;

		setInfo((prev) => ({ ...prev, loading: true, page: 1, executionHistory: [] }));
		getExecutionHistory(automationId, { page: 1, limit: 20 });
	}, [automationId]);

	// Handle execution history updates
	useEffect(() => {
		if (!mounted.current || !executionHistory) return;

		// Get execution history for this specific automation
		const automationHistory = executionHistory[automationId];

		// Update local state with the automation-specific data
		setInfo((prev) => {
			// If we have new data, update the state
			if (automationHistory?.data) {
				const newExecutionHistory =
					automationHistory.page === 1
						? automationHistory.data
						: [...prev.executionHistory, ...automationHistory.data];

				return {
					...prev,
					executionHistory: newExecutionHistory,
					error: automationHistory.error || '',
					loading: automationHistory.loading ?? false,
					hasNextPage: automationHistory.hasNextPage || false,
					totalDocs: automationHistory.totalDocs || 0,
					totalPages: automationHistory.totalPages || 1,
					page: automationHistory.page || prev.page,
				};
			}

			// If we're still loading, just update the loading state
			if (automationHistory?.loading !== undefined) {
				return {
					...prev,
					loading: automationHistory.loading,
					error: automationHistory.error || prev.error,
				};
			}

			return prev;
		});

		// Auto-fetch page 2 only on initial load
		if (
			isInitialLoad.current &&
			automationHistory?.page === 1 &&
			automationHistory?.hasNextPage &&
			!automationHistory?.loading
		) {
			isInitialLoad.current = false;
			setTimeout(() => {
				if (mounted.current) {
					getExecutionHistory(automationId, { page: 2, limit: 20 });
				}
			}, 100);
		}
	}, [executionHistory, automationId]);

	const fetchMoreData = useCallback(() => {
		if (info.hasNextPage && !info.loading) {
			const nextPage = info.page + 1;
			// console.log(`RunSidebar: Fetching page ${nextPage} for automation ${automationId}`);
			getExecutionHistory(automationId, { page: nextPage, limit: 20 });
		}
	}, [info.hasNextPage, info.loading, info.page, automationId, getExecutionHistory]);

	return (
		<div className="run-sidebar">
			<HeaderComponent heading="Run history" onBack={onClose} />
			<div className="run-sidebar-content">
				<div className="run-sidebar-execution-container" id="runSidebarScrollableDiv">
					{info.loading && info.executionHistory.length === 0 ? (
						[{}, {}, {}, {}, {}].map((_, index) => (
							<div key={index} style={{ width: '100%' }}>
								<Skeleton
									width="100%"
									height="38px"
									borderRadius={'12px'}
									padding={'6px'}
									baseColor="var(--stroke-hover)"
									highlightColor="#7a7e85"
								/>
							</div>
						))
					) : info.error ? (
						<span className="error-message">{info.error}</span>
					) : info.executionHistory.length > 0 ? (
						<InfiniteScroll
							dataLength={info.executionHistory.length}
							next={fetchMoreData}
							hasMore={info.hasNextPage}
							loader={<FetchMoreLoaderComp />}
							scrollableTarget="runSidebarScrollableDiv"
							scrollThreshold={0.8}
							style={{ overflow: 'visible' }}
						>
							{info.executionHistory.map((item, index) => (
								<Tooltip
									key={item?._id || index}
									title={
										<div className="run-sidebar-tooltip">
											<div className="run-sidebar-tooltip-container">
												<div className="run-sidebar-tooltip-item">
													<span className="run-sidebar-tooltip-item-title">
														Status
													</span>
													<span className="run-sidebar-tooltip-item-value">
														{item?.status}
													</span>
												</div>
												<div className="run-sidebar-tooltip-item">
													<span className="run-sidebar-tooltip-item-title">
														Runtime
													</span>
													<span className="run-sidebar-tooltip-item-value">
														{formatExecutionTime(
															item?.createdAt,
															item?.completedAt,
														)}
													</span>
												</div>
												<div className="run-sidebar-tooltip-item">
													<span className="run-sidebar-tooltip-item-title">
														Triggered
													</span>
													<span className="run-sidebar-tooltip-item-value">
														{item?.createdAt
															? moment
																	.unix(item?.createdAt)
																	?.format('DD MMM, YYYY hh:mm A')
															: 'Not available'}
													</span>
												</div>
												<div className="run-sidebar-tooltip-item">
													<span className="run-sidebar-tooltip-item-title">
														Completed
													</span>
													<span className="run-sidebar-tooltip-item-value">
														{item?.completedAt
															? moment
																	.unix(item?.completedAt)
																	?.format('DD MMM, YYYY hh:mm A')
															: 'Not available'}
													</span>
												</div>
												<div className="run-sidebar-tooltip-item">
													<span className="run-sidebar-tooltip-item-title">
														Credits used
													</span>
													<span className="run-sidebar-tooltip-item-value">
														0
													</span>
												</div>
											</div>
										</div>
									}
									placement="left"
									arrow={false}
									color="transparent"
									overlayStyle={{
										minWidth: 'fit-content',
									}}
								>
									<div className="execution-item">
										<div className="execution-item-status">
											<Tick height={20} width={20} className="tick-icon" />
										</div>
										<div className="execution-item-title">Run {index + 1}</div>
										<div className="execution-item-date">
											{item?.createdAt
												? moment.unix(item?.createdAt).fromNow()
												: 'Not available'}
										</div>
									</div>
								</Tooltip>
							))}
						</InfiniteScroll>
					) : (
						<span className="error-message">No runs found</span>
					)}
					{info.loading && info.executionHistory.length > 0 && (
						<div style={{ width: '100%' }}>
							<Skeleton
								width="100%"
								height="38px"
								borderRadius={'12px'}
								padding={'6px'}
								baseColor="var(--stroke-hover)"
								highlightColor="#7a7e85"
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default RunSidebar;
