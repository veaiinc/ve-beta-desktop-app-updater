import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { FetchMoreLoaderComp } from '../../../helpers/index';
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
		selectedWorkflowId: null,
	});

	useEffect(() => {
		getMyWorkflowTemplatesData(1);
	}, []);

	useEffect(() => {
		if (myWorkflows) {
			myWorkflowsDataParser(myWorkflows);
		}
	}, [myWorkflows]);

	useEffect(() => {
		if (myMoreWorkflows) {
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
		setInfo((prev) => ({ ...prev, loading: true }));
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

	console.log('selectedWorkflowId', JSON.stringify(info?.selectedWorkflowId));

	return (
		<Select
			allowClear
			showSearch
			loading={info?.loading}
			style={{ width: 120, height: 35 }}
			placeholder="Workflows"
			options={info?.workflowOptions || []}
			optionFilterProp="label"
			dropdownRender={(menu) => (
				<div>
					{menu}
					{info?.loading && (
						<FetchMoreLoaderComp
							wrapperStyle={{
								fontSize: '10px',
								fontWeight: '500',
							}}
							spinnerWidth="10px"
							spinnerHeight="10px"
							spinnerColor="white"
							gap="8px"
						/>
					)}
				</div>
			)}
			listHeight={250}
			onPopupScroll={(e) => {
				const target = e.target;
				const isBottom =
					Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 1;

				if (!info?.loading && info?.hasNextPage && isBottom) {
					fetchMoreMyWorkflows();
				}
			}}
			onChange={(workflowId) => {
				setInfo((prev) => ({
					...prev,
					selectedWorkflowId: workflowId,
				}));
			}}
			getPopupContainer={(trigger) => trigger.parentNode}
		/>
	);
};

export default memo(WorkflowDropDown);
