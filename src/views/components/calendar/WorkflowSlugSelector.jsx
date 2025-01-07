import React, { memo, useState, useContext, useEffect, useCallback } from 'react';
import '../../../assets/scss/calendar/workflowSlugSelector.scss';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';
import { FetchMoreLoaderComp } from '../../../helpers/index';
import Context from '../../../context/context';
import { Select } from 'antd';

const WorkflowSlugList = ({
	updateCalendarInfo,
	workflowSlug,
	fetching,
	workflowOptions,
	fetchMoreWorkflows,
	hasNextPage,
}) => {
	const [info, setInfo] = useState({
		value: workflowSlug || null,
	});

	useEffect(() => {
		if (workflowSlug) {
			setInfo((prev) => ({ ...prev, value: workflowSlug || '' }));
		}
	}, [workflowSlug]);
	return (
		<div className="workflowSlugList">
			<Select
				showSearch
				allowClear
				loading={fetching}
				style={{ width: 255, height: 35 }}
				placeholder="Workflows"
				options={workflowOptions || []}
				optionFilterProp="label"
				value={info?.value}
				dropdownRender={(menu) => (
					<div>
						{menu}
						{fetching && (
							<FetchMoreLoaderComp
								wrapperStyle={{
									fontSize: '8px',
									fontWeight: '500',
								}}
								spinnerWidth="8px"
								spinnerHeight="8px"
								spinnerColor="white"
								gap="8px"
							/>
						)}
					</div>
				)}
				listHeight={90}
				onPopupScroll={(e) => {
					const target = e.target;
					const isBottom =
						Math.abs(target?.scrollHeight - target?.scrollTop - target?.clientHeight) <
						1;
					if (!fetching && hasNextPage && isBottom) {
						console.log('calling fetch more workflow slugs');
						fetchMoreWorkflows();
					}
				}}
				onChange={(workflowSlug) => {
					setInfo((prev) => ({ ...prev, value: workflowSlug || '' }));
					if (workflowSlug) {
						updateCalendarInfo('workflowSlug', workflowSlug);
					} else {
						updateCalendarInfo('workflowSlug', null);
					}
				}}
				getPopupContainer={(trigger) => trigger?.parentNode}
			/>
		</div>
	);
};

const WorkflowSlugSelector = ({ updateCalendarInfo, workflowSlug }) => {
	const {
		templates: { getWorkflowsList, workflowslist, moreWorkList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		fetching: false,
		isExpanded: false,
		workflowList: null,
		hasNextPage: false,
		currentPage: 1,
		workflowOptions: [],
	});

	useEffect(() => {
		console.log('info?.fetching==>', info?.fetching);
	}, [info?.fetching]);

	useEffect(() => {
		if (workflowslist) {
			workflowsDataParser(workflowslist);
		} else {
			getWorkflowsSlugList(1);
		}
	}, [workflowslist]);

	useEffect(() => {
		if (moreWorkList) {
			workflowsDataParser(moreWorkList, true);
		}
	}, [moreWorkList]);

	const getWorkflowsSlugList = useCallback((page, fetchMore = false) => {
		const payload = {
			filters: {
				limit: 10,
				page: page,
			},
		};
		getWorkflowsList(payload, fetchMore);
	}, []);

	const fetchMoreWorkflows = useCallback(() => {
		setInfo((prev) => ({ ...prev, fetching: true }));
		getWorkflowsSlugList(info?.currentPage + 1, true);
	}, [info?.hasNextPage, info?.currentPage]);

	const mapWorkflowOptions = useCallback((data) => {
		let workflowOptions = [];
		for (let i = 0; i < data?.length; i++) {
			workflowOptions?.push({
				label: data?.[i]?.title,
				value: data?.[i]?.slug,
			});
		}
		console.log('Mapped options:', workflowOptions);
		return workflowOptions;
	}, []);

	const workflowsDataParser = useCallback(
		(dataToBeUsed, fetchMore = false) => {
			let { data, currentPage, hasNextPage } = dataToBeUsed;
			let workflowList = [];

			for (let i = 0; i < data?.length; i++) {
				workflowList?.push(data?.[i]);
			}

			if (fetchMore) {
				workflowList = [...(info?.workflowList || [])]?.concat(workflowList);
			}

			const workflowOptions = mapWorkflowOptions([...(workflowList || [])]);
			setInfo((prev) => ({
				...prev,
				fetching: false,
				workflowList,
				currentPage,
				hasNextPage,
				workflowOptions,
			}));
		},
		[info?.workflowList, mapWorkflowOptions],
	);

	return (
		<div className="workflowSlugSelector">
			<div className="selectorHeader">
				<span>Choose a Project</span>
			</div>
			<div className={`selectorContainer ${info?.isExpanded ? 'expanded' : ''}`}>
				<div
					className={`selectBtn ${info?.isExpanded ? 'expanded' : ''}`}
					onClick={() =>
						setInfo((prevInfo) => ({ ...prevInfo, isExpanded: !prevInfo?.isExpanded }))
					}
				>
					<span>Select One</span>
					<DownSvg />
				</div>
			</div>

			<div className={`workflowDropDown ${info?.isExpanded ? 'expanded' : ''}`}>
				<WorkflowSlugList
					updateCalendarInfo={updateCalendarInfo}
					workflowSlug={workflowSlug}
					fetching={info?.fetching}
					workflowOptions={info?.workflowOptions}
					fetchMoreWorkflows={fetchMoreWorkflows}
					hasNextPage={info?.hasNextPage}
				/>
			</div>
		</div>
	);
};

export default memo(WorkflowSlugSelector);
