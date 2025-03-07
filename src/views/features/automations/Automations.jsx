import React, { memo, useContext, useEffect } from 'react';
import '../../../assets/scss/automations/index.scss';
import Context from '../../../context/context';
import AutomationCard from '../../components/automations/automationCard/AutomationCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';
import QuickActions from '../../components/globalComponents/QuickActions';

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

const Automations = () => {
	const {
		automationBuilder: { automationsList, getAutomationsList },
	} = useContext(Context);
	const automations = automationsList?.data;
	const automationsLoading = automationsList ? false : true;
	const automationsLength = automations?.length ?? 0;
	const automationsEmpty = automationsLength === 0 && !automationsLoading;
	const automationsHasNextPage = automationsList?.hasNextPage;
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
				<h1 className="loadingAutomations">Loading Automations...</h1>
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
					{automations?.map((automation) => (
						<AutomationCard
							key={automation?._id}
							automationId={automation?._id}
							automationTitle={automation?.name}
							automationStatus={automation?.status}
							automationSteps={automation?.steps}
						/>
					))}
				</InfiniteScroll>
			)}
		</div>
	);
};

export default memo(Automations);
