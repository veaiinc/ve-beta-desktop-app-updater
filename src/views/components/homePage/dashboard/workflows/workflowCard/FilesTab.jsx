import React, { useContext, useEffect, useState, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import '../../../../../../assets/scss/home_page/workflows/workflowCard.scss';
import { ReactComponent as CheckIcon } from '../../../../../../assets/svg/home_page/Check.svg';
import Context from '../../../../../../context/context';
import { FetchMoreLoaderComp } from '../../../../../../helpers';
import MyWorkflowModalsLoader from '../../../../modalsV2/workflowsModals/MyWorkflowModalsLoader';
import { useNavigate } from 'react-router-dom';

const pendingActionsEnums = {
	counterSign: {
		title: 'Counter Sign',
	},
	sendProposal: {
		title: 'Send Proposal',
	},
};

const initialState = {
	loading: false,
	workflowsDetailslist: null,
	currentPage: 1,
	hasNextPage: false,
	durationOptionChanged: false,
	timeout: null,
};

const FilesTab = ({ data }) => {
	let {
		templates: { getWorkflowsList, workflowslistForFiles, moreWorkList, updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState(initialState);
	const navigate = useNavigate();

	useEffect(() => {
		getWorkflowsListFunc(1);
	}, []);

	useEffect(() => {
		const currentPage = workflowslistForFiles?.[data?._id]?.currentPage;
		const hasNextPage = workflowslistForFiles?.[data?._id]?.hasNextPage;
		setInfo((prev) => ({
			...prev,
			currentPage,
			hasNextPage,
		}));
	}, [workflowslistForFiles?.[[data?._id]]]);

	const getWorkflowsListFunc = useCallback(async (page, fetchMore = false) => {
		const payload = {
			filters: {
				limit: 30,
				page: page,
				templateId: data?._id,
			},
		};

		getWorkflowsList(payload, fetchMore);
	}, []);

	const fetcMoreWorkflowList = useCallback(async () => {
		getWorkflowsListFunc(info?.currentPage + 1, true);
	}, [info?.currentPage]);

	const filteredPendingActionsLength = info?.workflowsDetailslist?.filter(
		(item) => item?.requiredAction?.action,
	).length;

	const workflowsDetailsList = workflowslistForFiles?.[data?._id]?.data;

	return (
		<>
			<div
				style={{
					flex: 1,
					overflowY: 'auto',
					maxHeight: '100%',
					height: '100%',
					width: '100%',
				}}
				id="pendingActions"
			>
				<InfiniteScroll
					dataLength={filteredPendingActionsLength || 0}
					next={fetcMoreWorkflowList}
					hasMore={info?.hasNextPage}
					loader={<FetchMoreLoaderComp />}
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}
					scrollableTarget="pendingActions"
				>
					{info?.loading ? (
						<MyWorkflowModalsLoader width={'287px'} height={'48px'} />
					) : (
						<div className="pending-actions-container">
							{workflowsDetailsList
								?.filter((item) => item?.requiredAction?.action)
								.map((item, index) => {
									const name = item?.clientDetails?.name;
									const email = item?.clientDetails?.email;
									return (
										<div
											className="workflow-inner-card"
											key={index}
											onClick={() => {
												navigate(`/smart-file/${data?._id}/${item?._id}`);
											}}
										>
											<span className="left-text">
												{name}
												<br />
												{email}
											</span>
											<span className="right-text pending-actions-title">
												{
													pendingActionsEnums[
														item?.requiredAction?.action
													]?.title
												}

												<CheckIcon />
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
