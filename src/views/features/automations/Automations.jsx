import React, { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/automations/index.scss';
import Context from '../../../context/context';
import AutomationCard from '../../components/automations/automationCard/AutomationCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';
import QuickActions from '../../components/globalComponents/QuickActions';
import { message } from 'antd';
import Skeleton from 'react-loading-skeleton';

const limit = 10;
const append = true;
const infiniteScrollStyle = {
	display: 'flex',
	flexWrap: 'wrap',
	alignItems: 'flex-end',
	alignContent: 'flex-start',
	gap: '14px',
	width: '100%',
	overflowX: 'hidden',
};
const infiniteScrollHeight = 'calc(100vh - 240px)';
const skeletonLoaders = Array.from({ length: 6 }, (_, index) => index + 1);

const Automations = () => {
	const {
		automationBuilder: { automationsList, getAutomationsList, deleteAutomation },
	} = useContext(Context);

	const [info, setInfo] = useState({
		deletedAutomationIds: [],
	});

	const automations = automationsList?.data;
	const automationsLoading = automationsList ? false : true;
	const automationsLength = automations?.length ?? 0;
	const automationsEmpty = automationsLength === 0 && !automationsLoading;
	const automationsHasNextPage = Boolean(automationsList?.hasNextPage);
	const automationsCurrentPage = Number(automationsList?.currentPage) || 1;

	useEffect(() => {
		getAutomationsList();
	}, []);

	const fetchNextAutomations = () => {
		if (automationsHasNextPage) {
			const page = automationsCurrentPage + 1;
			getAutomationsList(page, limit, append);
		}
	};

	const handleDeleteAutomation = async (automationId) => {
		const response = await deleteAutomation(automationId);
		if (response?.[0]) {
			setInfo((prev) => ({
				...prev,
				deletedAutomationIds: [...prev?.deletedAutomationIds, automationId],
			}));
			message?.success('Automation deleted successfully');
		} else message?.error('Failed to delete automation');
	};

	return (
		<div className="automationsContainer">
			<header className="header">
				<div className="titleAndSubtitle">
					<h1 className="title">Automations</h1>
					<h2 className="subtitle">You Created!</h2>
				</div>
				<QuickActions />
			</header>
			{automationsLoading ? (
				<div className="skeletonLoaderContainer">
					{skeletonLoaders?.map((skeletonId) => (
						<Skeleton
							key={skeletonId}
							width="340px"
							height="424px"
							borderRadius="24px"
						/>
					))}
				</div>
			) : automationsEmpty ? (
				<h1 className="emptyAutomations">No automations found!</h1>
			) : (
				<InfiniteScroll
					dataLength={automationsLength}
					next={fetchNextAutomations}
					hasMore={automationsHasNextPage}
					loader={<FetchMoreLoaderComp />}
					style={infiniteScrollStyle}
					height={infiniteScrollHeight}
				>
					{automations
						?.filter(
							(automation) => !info?.deletedAutomationIds?.includes(automation?._id),
						)
						?.map((automation) => (
							<AutomationCard
								key={automation?._id}
								automationId={automation?._id}
								automationTitle={automation?.name}
								automationStatus={automation?.status}
								automationSteps={automation?.steps}
								handleDeleteAutomation={handleDeleteAutomation}
							/>
						))}
				</InfiniteScroll>
			)}
		</div>
	);
};

export default memo(Automations);
