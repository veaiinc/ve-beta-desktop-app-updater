import { memo, useCallback, useContext, useEffect, useState } from 'react';
import './agentDetails.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import InfiniteScroll from '../../globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../../helpers';
import dayjs from 'dayjs';
import Spinner from '../../loaders/Spinner';
import Context from '../../../../context/context';
const PAGE_LIMIT = 10;

const AgentActivities = () => {
	const navigate = useNavigate();
	const { agentId } = useParams();
	const {
		knowledgeAgent: { getActivitiesForKnowledgeAgent },
	} = useContext(Context);

	const [activitiesInfo, setActivitiesInfo] = useState({
		activities: [],
		hasNextPage: false,
		currentPage: 1,
		loadingActivities: false,
	});

	const fetchActivities = async (page = 1) => {
		setActivitiesInfo((prev) => ({ ...prev, loadingActivities: true }));
		try {
			const response = await getActivitiesForKnowledgeAgent(agentId, page, PAGE_LIMIT);
			if (response?.[0]) {
				const { data, hasNextPage: next, currentPage: cur } = response[1];
				setActivitiesInfo((prev) => ({
					...prev,
					activities: page === 1 ? data : [...prev.activities, ...data],
					hasNextPage: next,
					currentPage: cur,
					loadingActivities: false,
				}));
			} else {
				setActivitiesInfo((prev) => ({
					...prev,
					hasNextPage: false,
					loadingActivities: false,
				}));
			}
		} catch (err) {
			setActivitiesInfo((prev) => ({
				...prev,
				hasNextPage: false,
				loadingActivities: false,
			}));
		}
	};

	const fetchMoreActivities = () => {
		if (!activitiesInfo.loadingActivities && activitiesInfo.hasNextPage) {
			fetchActivities(activitiesInfo.currentPage + 1);
		}
	};

	useEffect(() => {
		if (agentId) fetchActivities(1);
		// eslint-disable-next-line
	}, [agentId]);

	const handleChatSessionClick = useCallback((activity) => {
		navigate(
			`/chat/${activity?.sessionID}?agentType=knowledge_agent&assistantId=${activity?.assistantId}`,
		);
	}, []);

	// Sort activities by createdAt desc
	const sortedActivities = [...activitiesInfo.activities].sort(
		(a, b) => b.createdAt - a.createdAt,
	);
	const [current, ...older] = sortedActivities;

	return (
		<div className="agent-activity-section">
			<h2 className="activity-title">Activities</h2>
			<div className="activity-group-wrapper">
				{activitiesInfo.activities.length === 0 && activitiesInfo.loadingActivities ? (
					<div className="activities-spinner-wrapper">
						<Spinner />
					</div>
				) : activitiesInfo.activities.length === 0 && !activitiesInfo.loadingActivities ? (
					<div className="activities-empty-message">No activities yet.</div>
				) : (
					<InfiniteScroll
						dataLength={activitiesInfo.activities.length}
						next={fetchMoreActivities}
						hasMore={activitiesInfo.hasNextPage}
						loader={<FetchMoreLoaderComp />}
						style={{ width: '100%' }}
					>
						<div className="activity-group current-group">
							<div className="activity-group-header">
								<span className="dot-current" />
								<span className="group-label">Current</span>
							</div>
							{current && (
								<div
									className="activity-card current"
									key={current?._id}
									onClick={() => handleChatSessionClick(current)}
								>
									<div className="activity-card-content">
										<div className="activity-title-main">
											{current.originalQuery}
										</div>
										<div className="activity-desc">{current.response}</div>
									</div>
									<div className="activity-time">
										{dayjs.unix(current.createdAt).format('hh:mm A')}
									</div>
								</div>
							)}
						</div>
						<div className="activity-group older-group">
							<div className="activity-group-header">
								<span className="group-label older">Older</span>
							</div>
							{older.map((activity) => (
								<div className="activity-card older" key={activity._id}>
									<div className="activity-card-content">
										<div className="activity-title-main">
											{activity.originalQuery}
										</div>
										<div className="activity-desc">{activity.response}</div>
									</div>
									<div className="activity-time">
										{dayjs.unix(activity.createdAt).format('hh:mm A')}
									</div>
								</div>
							))}
						</div>
					</InfiniteScroll>
				)}
			</div>
		</div>
	);
};

export default memo(AgentActivities);
