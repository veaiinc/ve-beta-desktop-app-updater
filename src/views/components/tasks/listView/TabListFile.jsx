import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import ListViewRow from './ListViewRow';
import { ReactComponent as TextSvg } from '../../../../assets/svg/tasks/letterA.svg';
import '../../../../assets/scss/tasks/tabListView.scss';
import Skeleton from 'react-loading-skeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../../helpers';
import Context from '../../../../context/context';

const TabListFile = ({
	rowTypes,
	colors,
	handleRowClick,
	refetchDocsFilesList,
	updateListViewInfo,
}) => {
	let {
		templates: { getDocsFilesList, docsFilesList, moreDocsFilesList },
	} = useContext(Context);
	const [info, setInfo] = useState({
		docsData: [],
		isOptionsDropDownOpen: false,
		isCreateModalOpen: false,
		properties: [],
		sidebarIsOpen: false,
		selectedRow: null,
		page: 1,
		hasMore: false,
		loadingSkeleton: true,
		error: null,
		sort: [],
		filters: [],
		searchValue: '',
		updated: false,
		isSidebarExpanded: false,
	});

	const responseMetadata = useMemo(
		() => ({
			title: {
				type: 'text',
				name: 'Title',
				isTitle: true,
				Icon: TextSvg,
				doSplit: true,
			},
			status: {
				type: 'status',
				name: 'Status',
				Icon: TextSvg,
				props: {
					options: [
						{
							_id: 'filesViewed',
							label: 'Files Viewed',
							color: '1',
						},
						{
							_id: 'enquiry',
							label: 'Enquiry',
							color: '2',
						},
						{
							_id: 'filesSent',
							label: 'Sent',
							color: '3',
						},
						{
							_id: 'confirmed',
							label: 'Confirmed',
							color: '4',
						},
						{
							_id: 'expired',
							label: 'Expired',
							color: '5',
						},
						{
							_id: 'accepted',
							label: 'Accepted',
							color: '6',
						},
						{
							_id: 'proposalAccepted',
							label: 'Proposal Accepted',
							color: '7',
						},
						{
							_id: 'expired',
							label: 'Expired',
							color: '5',
						},
						{
							_id: 'accepted',
							label: 'Accepted',
							color: '6',
						},
						{
							_id: 'proposalAccepted',
							label: 'Proposal Accepted',
							color: '7',
						},
					],
				},
			},
		}),
		[rowTypes, colors],
	);

	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			properties: mapPropertyType(),
		}));
		getDocsFilesListFunc(1, false);
	}, []);
	useEffect(() => {
		if (docsFilesList) {
			parseDocsFilesListDeatils(docsFilesList, false);
		}
	}, [docsFilesList]);
	useEffect(() => {
		if (moreDocsFilesList) {
			parseDocsFilesListDeatils(moreDocsFilesList, true);
		}
	}, [moreDocsFilesList]);

	useEffect(() => {
		if (refetchDocsFilesList) {
			getDocsFilesListFunc(1, false);
			updateListViewInfo('refetchDocsFilesList', false);
		}
	}, [refetchDocsFilesList]);

	const getDocsFilesListFunc = useCallback(
		async (page, fetchMore = false) => {
			if (!fetchMore) {
				setInfo((prev) => ({
					...prev,
					loading: true,
				}));
			}

			const payload = {
				filters: {
					limit: 30,
					page: page,
					title: info?.searchValue,
				},
			};
			if (info?.selectedFilterOptions?.templateName) {
				payload.filters.templateId = info?.selectedFilterOptions?.templateName?._id;
			}
			if (info?.selectedFilterOptions?.clientName) {
				payload.filters.clientId = info?.selectedFilterOptions?.clientName?._id;
			}
			if (info?.selectedFilterOptions?.status) {
				payload.filters.status = info?.selectedFilterOptions?.status?._id;
			}
			getDocsFilesList(payload, fetchMore);
		},
		[info?.searchValue, info?.selectedFilterOptions],
	);

	const fetcMoreDocsFilesList = useCallback(async () => {
		getDocsFilesListFunc(info?.currentPage + 1, true);
	}, [info?.currentPage]);

	const parseDocsFilesListDeatils = useCallback(async (variableType, fetchMore = false) => {
		let { hasNextPage, currentPage, data } = variableType || {};

		setInfo((prev) => ({
			...prev,
			loading: false,
			docsData: fetchMore ? prev?.docsData?.concat(data) : data,
			currentPage,
			hasNextPage,
		}));
	}, []);

	const mapPropertyType = useCallback(() => {
		let properties = [];
		for (let key in responseMetadata) {
			if (
				key === '__typename' ||
				key === '_id'
				// key === 'workflowTemplateId' ||
				// key === 'completedAt'
			) {
				continue;
			}

			const {
				type = null,
				name = null,
				Icon = null,
				isTitle = false,
			} = responseMetadata[key];

			properties.push({
				value: key,
				type,
				label: name,
				Icon,
				show: true,
				isTitle,
			});
		}
		return properties;
	}, [responseMetadata]);

	return (
		<div className="tab-list-file">
			{info?.loading ? (
				[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]?.map(
					(ele, index) => <Skeleton key={index} height={36} />,
				)
			) : (
				<InfiniteScroll
					dataLength={info?.docsData?.length || 0}
					next={fetcMoreDocsFilesList}
					hasMore={info?.hasNextPage}
					loader={<FetchMoreLoaderComp />}
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
						width: '100%',
					}}
					className="tetsing"
					height="calc(100vh - 500px)"
				>
					{info?.docsData?.map((ele, index) => (
						<ListViewRow
							key={index}
							task={ele}
							properties={info.properties}
							rowTypes={rowTypes}
							updatePropertyValue={() => {}}
							responseMetadata={responseMetadata}
							handleEditPropertyChange={() => {}}
							colors={colors}
							handleRowClick={handleRowClick}
							fromTabList={true}
							isSubTask={true}
						/>
					))}
				</InfiniteScroll>
			)}
		</div>
	);
};

export default memo(TabListFile);
