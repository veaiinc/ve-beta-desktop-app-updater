import React, { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/automations/index.scss';
import Context from '../../../context/context';
import AutomationCard from '../../components/automations/automationCard/AutomationCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';
import QuickActions from '../../components/globalComponents/QuickActions';
import { message } from 'antd';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';

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
	const navigate = useNavigate();
	const {
		automationBuilder: {
			automationsList,
			getAutomationsList,
			createAutomation,
			deleteAutomation,
			updateContextStateInAutomationBuilder,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		deletedAutomationIds: [],
		createAutomationLoading: false,
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
			if (automationsLength === 1) {
				updateContextStateInAutomationBuilder({
					automationsList: {
						data: [],
						hasNextPage: false,
						currentPage: 1,
					},
				});
			}
		} else message?.error('Failed to delete automation');
	};

	const handleCreateAutomation = async () => {
		if (info?.createAutomationLoading) return;
		setInfo((prev) => ({ ...prev, createAutomationLoading: true }));
		const response = await createAutomation({
			name: 'Untitled Automation',
			version: 1,
			steps: [],
			status: 'draft',
		});
		if (response?.[0]) {
			setInfo((prev) => ({ ...prev, createAutomationLoading: false }));
			const automationId = response?.[1]?._id;
			navigate(`/automation-builder/${automationId}`);
		} else {
			message?.error('Failed to create automation');
			setInfo((prev) => ({ ...prev, createAutomationLoading: false }));
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
				<div className="emptyAutomationsContainer">
					<h1 className="emptyAutomations">No automations found!</h1>
					<button className="createAutomationButton" onClick={handleCreateAutomation}>
						Create Automation
					</button>
				</div>
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
