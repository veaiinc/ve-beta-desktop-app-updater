import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';
import Context from '../../../context/context';
import { Select } from 'antd';

const WorkflowDropDown = () => {
	const {
		templates: { getMyWorkflows, myWorkflows, myMoreWorkflows },
	} = useContext(Context);

	const [info, setInfo] = useState({
		loading: true,
		myWorkflowData: null,
		hasNextPage: false,
		currentPage: 1,
		workflowOptions: [],
		selectedWorkflow: null,
	});
	console.log('workflowOptions', info?.workflowOptions);

	useEffect(() => {
		console.log('calling getMyWorkflowTemplatesData API onMount of WorkflowDropDown');
		getMyWorkflowTemplatesData(1);
	}, []);

	useEffect(() => {
		if (myWorkflows) {
			console.log('calling myWorkflowsDataParser whenn myWorkflows context is updated');
			myWorkflowsDataParser(myWorkflows);
		}
	}, [myWorkflows]);

	useEffect(() => {
		if (myMoreWorkflows) {
			console.log('calling myWorkflowsDataParser whenn myMoreWorkflows context is updated');
			myWorkflowsDataParser(myMoreWorkflows, true);
		}
	}, [myMoreWorkflows]);

	const getMyWorkflowTemplatesData = useCallback((page, fetchMore = false) => {
		const payload = {
			filters: {
				limit: 10,
				page: page,
				type: 'workspace',
				status: 'published',
				sortBy: 'createdAt',
				sortType: -1,
			},
		};
		getMyWorkflows(payload, fetchMore);
	}, []);

	useEffect(() => {
		if (info?.myWorkflowData && info?.myWorkflowData?.length > 0) {
			mapWorkflowOptions();
		}
	}, [info?.myWorkflowData]);

	const fetchMoreMyWorkflows = useCallback(() => {
		console.log('fetchMoreMyWorkflows');
		getMyWorkflowTemplatesData(info?.currentPage + 1, true);
	}, [info?.hasNextPage, info?.currentPage]);

	const myWorkflowsDataParser = useCallback(
		(dataToBeUsed, fetchMore = false) => {
			let { data, currentPage, hasNextPage } = dataToBeUsed;
			let myWorkflowData = [];
			if (currentPage === 1 && !data?.length) return;

			for (let i = 0; i < data?.length; i++) {
				if (
					data?.[i]?.tenantId &&
					data?.[i]?.tenantId !== null &&
					data?.[i]?.status === 'published'
				) {
					myWorkflowData?.push(data?.[i]);
				}
			}

			if (fetchMore) {
				myWorkflowData = [...(info?.myWorkflowData || [])]?.concat(myWorkflowData);
			}
			setInfo((prev) => ({
				...prev,
				loading: false,
				myWorkflowData,
				currentPage,
				hasNextPage,
			}));
		},
		[info?.myWorkflowData],
	);

	const mapWorkflowOptions = useCallback(() => {
		if (info?.myWorkflowData && info?.myWorkflowData?.length > 0) {
			let workflowOptions = [];
			for (let i = 0; i < info?.myWorkflowData?.length; i++) {
				workflowOptions?.push({
					label: info?.myWorkflowData?.[i]?.title,
					value: info?.myWorkflowData?.[i]?._id,
				});
			}
			setInfo((prev) => ({
				...prev,
				workflowOptions,
			}));
		}
	}, [info?.myWorkflowData]);

	return (
		<>
			<Select
				allowClear
				showSearch
				loading={info?.loading}
				style={{ width: 150 }}
				placeholder="Workflows"
				options={info?.workflowOptions || []}
				optionFilterProp="label"
				dropdownRender={(menu) => (
					<div>
						<InfiniteScroll
							dataLength={info?.myWorkflowData?.length || 0}
							next={fetchMoreMyWorkflows}
							hasMore={info?.hasNextPage}
							loader={<FetchMoreLoaderComp />}
							scrollableTarget={'ant-select-dropdown'}
							endMessage={
								<div
									style={{ textAlign: 'center', padding: '10px', color: '#999' }}
								>
									No more workflows
								</div>
							}
							// scrollableTarget={'ant-select-dropdown'}
							height={250} // Change 2: Match listHeight
							style={{ overflow: 'auto' }} // Change 3: Enable scrolling
						>
							{menu}
						</InfiniteScroll>
					</div>
				)}
				listHeight={250}
				dropdownStyle={{
					overflow: 'auto', // Enable scrolling in dropdown
				}}
				getPopupContainer={(trigger) => trigger.parentNode}
				onChange={(value) => {
					setInfo((prev) => ({
						...prev,
						selectedWorkflow: value,
					}));
				}}
			/>
		</>
	);
};

export default memo(WorkflowDropDown);
