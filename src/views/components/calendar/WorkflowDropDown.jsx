import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { FetchMoreLoaderComp } from '../../../helpers/index';
import Context from '../../../context/context';
import { Select } from 'antd';

const WorkflowDropDown = ({ selectedWorkflowId, updateCalendarInfo }) => {
	const {
		templates: { getMyWorkflows, myWorkflows, myMoreWorkflows },
	} = useContext(Context);

	const [info, setInfo] = useState({
		loading: true,
		myWorkflowData: null,
		hasNextPage: false,
		currentPage: 1,
		workflowOptions: [],
	});

	// useEffect(() => {}, []);

	useEffect(() => {
		if (myWorkflows) {
			myWorkflowsDataParser(myWorkflows);
		} else {
			getMyWorkflowTemplatesData(1);
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

	const fetchMoreMyWorkflows = useCallback(() => {
		setInfo((prev) => ({ ...prev, loading: true }));
		getMyWorkflowTemplatesData(info?.currentPage + 1, true);
	}, [info?.hasNextPage, info?.currentPage]);

	const myWorkflowsDataParser = useCallback(
		(dataToBeUsed, fetchMore = false) => {
			let { data, currentPage, hasNextPage } = dataToBeUsed;
			let myWorkflowData = [];

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

			const workflowOptions = mapWorkflowOptions([...(myWorkflowData || [])]);
			setInfo((prev) => ({
				...prev,
				loading: false,
				myWorkflowData,
				currentPage,
				hasNextPage,
				workflowOptions,
			}));
		},
		[info?.myWorkflowData],
	);

	const mapWorkflowOptions = useCallback((data) => {
		let workflowOptions = [];
		for (let i = 0; i < data?.length; i++) {
			workflowOptions?.push({
				label: data?.[i]?.title,
				value: data?.[i]?._id,
			});
		}
		return workflowOptions;
	}, []);

	return (
		<Select
			// showSearch
			allowClear
			loading={info?.loading}
			style={{ width: 250, height: 35 }}
			placeholder="Workflows"
			options={info?.workflowOptions || []}
			optionFilterProp="label"
			value={selectedWorkflowId}
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
				if (workflowId) {
					updateCalendarInfo('selectedWorkflowId', workflowId);
				} else {
					updateCalendarInfo('selectedWorkflowId', null);
				}
			}}
			getPopupContainer={(trigger) => trigger?.parentNode}
		/>
	);
};

export default memo(WorkflowDropDown);
