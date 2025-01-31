import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import Context from '../../../../../../context/context';
import '../../../../../../assets/scss/home_page/workflows/workflowCard.scss';
import { ReactComponent as ChevronRightThinIcon } from '../../../../../../assets/svg/tasks/chevronRightThin.svg';
import { FetchMoreLoaderComp } from '../../../../../../helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

const PendingActionsTab = ({ data }) => {
	let {
		templates: { getRequiredActionsForTemplate, requiredActionsForTemplate },
	} = useContext(Context);
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		hasNextPage: false,
		currentPage: 1,
		loading: true,
	});

	useEffect(() => {
		if (requiredActionsForTemplate?.[data?._id]) {
			const currentPage = requiredActionsForTemplate?.[data?._id]?.currentPage;
			const hasNextPage = requiredActionsForTemplate?.[data?._id]?.hasNextPage;
			setInfo((prev) => ({
				...prev,
				currentPage,
				hasNextPage,
				loading: false,
			}));
			return;
		}
		getRequiredActionsForTemplateFunc(1);
	}, [requiredActionsForTemplate]);

	const requiredActionsList = requiredActionsForTemplate?.[data?._id]?.data;

	const getRequiredActionsForTemplateFunc = async (page) => {
		const payload = {
			filters: {
				page: page,
				limit: 10,
				workflowTemplateId: data?._id,
			},
		};
		await getRequiredActionsForTemplate(payload);
		setInfo((prev) => ({
			...prev,
			loading: false,
		}));
	};

	const fetchMoreRequiredAcitonsList = () => {
		getRequiredActionsForTemplateFunc(info?.currentPage + 1);
	};
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
				id="requiredActionsScroller"
			>
				<InfiniteScroll
					dataLength={requiredActionsList?.length || 0}
					next={fetchMoreRequiredAcitonsList}
					hasMore={info?.hasNextPage}
					loader={<FetchMoreLoaderComp />}
					scrollableTarget="requiredActionsScroller"
				>
					{info?.loading ? (
						<div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
							{[{}, {}, {}, {}].map((ele, index) => (
								<Skeleton
									height={'59px'}
									width={'100%'}
									style={{
										borderRadius: '16px',
									}}
									key={index}
								/>
							))}
						</div>
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
