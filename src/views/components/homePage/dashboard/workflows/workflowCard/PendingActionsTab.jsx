import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import Context from '../../../../../../context/context';
import '../../../../../../assets/scss/home_page/workflows/workflowCard.scss';
import { ReactComponent as ChevronRightThinIcon } from '../../../../../../assets/svg/tasks/chevronRightThin.svg';
import MyWorkflowModalsLoader from '../../../../modalsV2/workflowsModals/MyWorkflowModalsLoader';
import { FetchMoreLoaderComp } from '../../../../../../helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';

const PendingActionsTab = ({ data }) => {
	let {
		templates: { getRequiredActionsForTemplate, requiredActionsForTemplate },
	} = useContext(Context);
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		hasNextPage: false,
		currentPage: 1,
	});

	useEffect(() => {
		if (requiredActionsForTemplate?.[data?._id]) {
			const currentPage = requiredActionsForTemplate?.[data?._id]?.currentPage;
			const hasNextPage = requiredActionsForTemplate?.[data?._id]?.hasNextPage;
			setInfo((prev) => ({
				...prev,
				currentPage,
				hasNextPage,
			}));
			return;
		}
		getRequiredActionsForTemplateFunc(1, true);
	}, []);

	useEffect(() => {
		const currentPage = requiredActionsForTemplate?.[data?._id]?.currentPage;
		const hasNextPage = requiredActionsForTemplate?.[data?._id]?.hasNextPage;
		setInfo((prev) => ({
			...prev,
			currentPage,
			hasNextPage,
		}));
	}, [
		requiredActionsForTemplate?.[data?._id]?.currentPage,
		requiredActionsForTemplate?.[data?._id]?.hasNextPage,
	]);

	const requiredActionsList = requiredActionsForTemplate?.[data?._id]?.data;

	const getRequiredActionsForTemplateFunc = (page, resetRequiredActionsForTemplate = false) => {
		const payload = {
			filters: {
				page: page,
				limit: 6,
				workflowTemplateId: data?._id,
			},
			resetRequiredActionsForTemplate,
		};
		getRequiredActionsForTemplate(payload);
	};

	const fetchMoreRequiredAcitonsList = () => {
		console.log('fetching');
		getRequiredActionsForTemplateFunc(info?.currentPage + 1, false);
	};
	// console.log(requiredActionsForTemplate);
	return (
		<>
			<div
				style={{
					flex: 1,
					maxHeight: '100%',
					height: '100%',
					width: '100%',
				}}
			>
				<InfiniteScroll
					dataLength={requiredActionsList?.length || 0}
					next={fetchMoreRequiredAcitonsList}
					hasMore={info?.hasNextPage}
					loader={<FetchMoreLoaderComp />}
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
						width: '100%',
						overflowY: 'auto',
					}}
					height={350}
				>
					{info?.loading ? (
						<MyWorkflowModalsLoader width={'287px'} height={'48px'} />
					) : (
						<div className="pending-actions-container">
							{requiredActionsList?.map((action) => {
								return (
									<div
										className="workflow-inner-card"
										key={action?._id}
										onClick={() => {
											navigate(`/smart-file/${data?._id}/${action?._id}`);
										}}
									>
										<span className="left-text">
											{action?.title}
											<br />
											{action?.status}
										</span>
										<span className="right-text">
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

export default PendingActionsTab;
