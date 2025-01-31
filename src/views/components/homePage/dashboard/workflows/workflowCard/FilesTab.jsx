import React, { useContext, useEffect, useState, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import '../../../../../../assets/scss/home_page/workflows/workflowCard.scss';
import { ReactComponent as ChevronRightThinIcon } from '../../../../../../assets/svg/tasks/chevronRightThin.svg';
import Context from '../../../../../../context/context';
import { FetchMoreLoaderComp } from '../../../../../../helpers';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

const initialState = {
	loading: true,
	currentPage: 1,
	hasNextPage: false,
};

const FilesTab = ({ data }) => {
	let {
		templates: { getWorkflowsListForFiles, workflowslistForFiles },
	} = useContext(Context);

	const [info, setInfo] = useState(initialState);
	const navigate = useNavigate();

	useEffect(() => {
		if (workflowslistForFiles?.[data?._id]) {
			const currentPage = workflowslistForFiles?.[data?._id]?.currentPage;
			const hasNextPage = workflowslistForFiles?.[data?._id]?.hasNextPage;
			setInfo((prev) => ({
				...prev,
				currentPage,
				hasNextPage,
				loading: false,
			}));
		} else {
			getWorkflowsListFunc(1);
		}
	}, [workflowslistForFiles]);

	const getWorkflowsListFunc = async (page) => {
		const payload = {
			filters: {
				limit: 10,
				page,
				templateId: data?._id,
			},
		};

		await getWorkflowsListForFiles(payload);
		setInfo((prev) => ({
			...prev,
			loading: false,
		}));
	};

	const fetcMoreWorkflowList = async () => {
		getWorkflowsListFunc(info?.currentPage + 1, true);
	};

	const workflowsDetailsList = workflowslistForFiles?.[data?._id]?.data;

	return (
		<>
			<div
				id="filesScrollable"
				style={{
					flex: 1,
					overflowY: 'auto',
					maxHeight: '100%',
					height: '100%',
					width: '100%',
				}}
			>
				<InfiniteScroll
					dataLength={workflowsDetailsList?.length || 0}
					next={fetcMoreWorkflowList}
					hasMore={info?.hasNextPage}
					loader={<FetchMoreLoaderComp />}
					scrollableTarget="filesScrollable"
				>
					{info?.loading ? (
						<div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
							{[{}, {}, {}, {}].map((ele, index) => (
								<Skeleton
									height={'59px'}
									width={'287px'}
									style={{
										borderRadius: '16px',
									}}
									key={index}
								/>
							))}
						</div>
					) : (
						<div className="pending-actions-container">
							{workflowsDetailsList?.map((file) => {
								const title = file?.title;
								const status = file?.status;
								return (
									<div
										className="workflow-inner-card"
										key={file?._id}
										onClick={() => {
											navigate(`/smart-file/${data?._id}/${file?._id}`);
										}}
									>
										<span className="left-text">
											{title}
											<br />
											{status}
										</span>
										<span className="right-text pending-actions-title">
											<ChevronRightThinIcon />
										</span>
									</div>
								);
							})}
						</div>
					)}
				</InfiniteScroll>
			</div>
		</>
	);
};

export default FilesTab;
