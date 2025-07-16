import { memo, useCallback, useContext, useEffect, useState } from 'react';
import s from './agentDetails.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import InfiniteScroll from '../../globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../../helpers';
import dayjs from 'dayjs';
import Spinner from '../../loaders/Spinner';
import Context from '../../../../context/context';
import { ReactComponent as BriefcaseIcon } from '../../../../assets/svg/agents/briefcase.svg';

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

	// Group activities by date
	const groupActivitiesByDate = () => {
		const today = dayjs().startOf('day');
		const thisWeek = dayjs().startOf('week');

		const todayActivities = [];
		const thisWeekActivities = [];
		const olderActivities = [];

		activitiesInfo.activities.forEach((activity) => {
			const activityDate = dayjs.unix(activity.createdAt);

			if (activityDate.isSame(today, 'day')) {
				todayActivities.push(activity);
			} else if (activityDate.isAfter(thisWeek)) {
				thisWeekActivities.push(activity);
			} else {
				olderActivities.push(activity);
			}
		});

		return { todayActivities, thisWeekActivities, olderActivities };
	};

	const { todayActivities, thisWeekActivities, olderActivities } = groupActivitiesByDate();

	const formatTimeAgo = (timestamp) => {
		const now = dayjs();
		const activityTime = dayjs.unix(timestamp);
		const diffHours = now.diff(activityTime, 'hour');
		const diffMinutes = now.diff(activityTime, 'minute');

		if (diffMinutes < 60) {
			return `${diffMinutes}m ago`;
		} else if (diffHours < 24) {
			return `${diffHours}h ago`;
		} else {
			return dayjs.unix(timestamp).format('MMM D');
		}
	};

	return (
		<div className={s.agentActivitiesContainer}>
			<div className={s.activitiesHeader}>
				<div className={s.headerLeft}>
					<BriefcaseIcon className={s.briefcaseIcon} />
					<span className={s.headerTitle}>All Tasks</span>
				</div>
				<div className={s.taskCount}>{activitiesInfo.activities.length}</div>
			</div>

			<div className={s.activitiesContent}>
				{activitiesInfo.activities.length === 0 && activitiesInfo.loadingActivities ? (
					<div className={s.loadingContainer}>
						<Spinner />
					</div>
				) : activitiesInfo.activities.length === 0 && !activitiesInfo.loadingActivities ? (
					<div className={s.emptyMessage}>No tasks yet.</div>
				) : (
					<InfiniteScroll
						dataLength={activitiesInfo.activities.length}
						next={fetchMoreActivities}
						hasMore={activitiesInfo.hasNextPage}
						loader={<FetchMoreLoaderComp />}
						style={{ width: '100%' }}
					>
						{todayActivities.length > 0 && (
							<div className={s.taskSection}>
								<div className={s.sectionTitle}>Today</div>
								<div className={s.taskList}>
									{todayActivities.map((activity, index) => (
										<div
											key={activity._id}
											className={`${s.taskItem} ${
												index === 0 ? s.activeTask : ''
											}`}
											onClick={() => handleChatSessionClick(activity)}
										>
											<div className={s.taskContent}>
												<div className={s.taskTitle}>
													{activity.originalQuery?.length > 50
														? `${activity.originalQuery.substring(
																0,
																50,
														  )}...`
														: activity.originalQuery}
												</div>
											</div>
											<div className={s.taskTime}>
												{formatTimeAgo(activity.createdAt)}
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{thisWeekActivities.length > 0 && (
							<div className={s.taskSection}>
								<div className={s.sectionTitle}>This week</div>
								<div className={s.taskList}>
									{thisWeekActivities.map((activity) => (
										<div
											key={activity._id}
											className={s.taskItem}
											onClick={() => handleChatSessionClick(activity)}
										>
											<div className={s.taskContent}>
												<div className={s.taskTitle}>
													{activity.originalQuery?.length > 50
														? `${activity.originalQuery.substring(
																0,
																50,
														  )}...`
														: activity.originalQuery}
												</div>
											</div>
											<div className={s.taskTime}>
												{formatTimeAgo(activity.createdAt)}
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{olderActivities.length > 0 && (
							<div className={s.taskSection}>
								<div className={s.sectionTitle}>Older</div>
								<div className={s.taskList}>
									{olderActivities.map((activity) => (
										<div
											key={activity._id}
											className={s.taskItem}
											onClick={() => handleChatSessionClick(activity)}
										>
											<div className={s.taskContent}>
												<div className={s.taskTitle}>
													{activity.originalQuery?.length > 50
														? `${activity.originalQuery.substring(
																0,
																50,
														  )}...`
														: activity.originalQuery}
												</div>
											</div>
											<div className={s.taskTime}>
												{formatTimeAgo(activity.createdAt)}
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</InfiniteScroll>
				)}
			</div>
		</div>
	);
};

export default memo(AgentActivities);
