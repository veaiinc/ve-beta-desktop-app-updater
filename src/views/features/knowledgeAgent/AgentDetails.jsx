import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/knowledgeAgent/agentDetails.scss';
import { useParams, useNavigate } from 'react-router-dom';
import CreateAgentHeader from '../../components/ai_assistant/CreateAgentHeader';
import { ReactComponent as AgentIcon } from '../../../assets/svg/ai_assistant/agent.svg';
import { ReactComponent as EditIcon } from '../../../assets/svg/ai_assistant/edit.svg';
// import TabHeader from '../../components/ai_assistant/TabHeader';
import Context from '../../../context/context';
// import AiPlayGround from '../../components/ai_assistant/AiPlayGround';
// import AiChatLogs from '../../components/ai_assistant/AiChatLogs';
import EditSvg from '../../../assets/svg/ai_assistant/EditSvg';
import { message } from '../../components/globalComponents/CustomToast';
import jwtDecode from 'jwt-decode';
import ChatBox from '../../components/chat/ChatBox';
import AgentCredentials from '../../components/agents/agentDetails/agentCredentials/AgentCredentials';
import InfiniteScroll from '../../components/globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../helpers';
import dayjs from 'dayjs';
import Spinner from '../../components/loaders/Spinner';

const PAGE_LIMIT = 10;

const KnowledgeAgentDetails = () => {
	const {
		knowledgeAgent: {
			activeKnowledgeAssistant,
			getActiveKnowledgeAgentDetails,
			getActivitiesForKnowledgeAgent,
		},
		templates: { updateStateValues, currentSessionId, chatInfo },
	} = useContext(Context);

	const { agentId } = useParams();
	const navigate = useNavigate();

	const [info, setInfo] = useState({
		activeAiAssistant: null,
		loading: true,
		access: 'view',
		activities: [],
		hasNextPage: false,
		currentPage: 1,
		loadingActivities: false,
	});

	const fetchActivities = async (page = 1) => {
		setInfo((prev) => ({ ...prev, loadingActivities: true }));
		try {
			const response = await getActivitiesForKnowledgeAgent(agentId, page, PAGE_LIMIT);
			if (response?.[0]) {
				const { data, hasNextPage: next, currentPage: cur } = response[1];
				setInfo((prev) => ({
					...prev,
					activities: page === 1 ? data : [...prev.activities, ...data],
					hasNextPage: next,
					currentPage: cur,
					loadingActivities: false,
				}));
			} else {
				setInfo((prev) => ({ ...prev, hasNextPage: false, loadingActivities: false }));
			}
		} catch (err) {
			setInfo((prev) => ({ ...prev, hasNextPage: false, loadingActivities: false }));
		}
	};

	const fetchMoreActivities = () => {
		if (!info.loadingActivities && info.hasNextPage) {
			fetchActivities(info.currentPage + 1);
		}
	};

	useEffect(() => {
		if (agentId) fetchActivities(1);
		// eslint-disable-next-line
	}, [agentId]);

	useEffect(() => {
		if (agentId) {
			if (activeKnowledgeAssistant?.data && activeKnowledgeAssistant?.data?._id === agentId) {
				setInfo((prev) => ({
					...prev,
					activeAiAssistant: activeKnowledgeAssistant?.data,
					loading: false,
				}));
			} else if (activeKnowledgeAssistant?.error) {
				message.error(activeKnowledgeAssistant?.error);
				setInfo((prev) => ({
					...prev,
					loading: false,
				}));
			} else {
				getActiveKnowledgeAgentDetails(agentId);
			}
		}
	}, [agentId, activeKnowledgeAssistant]);

	useEffect(() => {
		if (agentId) {
			updateStateValues({
				chatInfo: {
					...chatInfo,
					agentType: 'knowledge_agent',
					assistantId: agentId,
				},
			});
		}
	}, [agentId]);

	useEffect(() => {
		checkAccess();
	}, [info?.activeAiAssistant]);

	const handleCustomOnSendFunction = useCallback(
		(data) => {
			updateStateValues({ activePayloadForChat: data });
			navigate(`/chat/${currentSessionId}?agentType=knowledge_agent&assistantId=${agentId}`);
		},
		[currentSessionId],
	);

	const checkAccess = useCallback(() => {
		const token = localStorage.getItem('usertoken');
		const { user_id } = jwtDecode(token);
		const access = info?.activeAiAssistant?.sharedWith?.find(
			(user) => user?.userId === user_id,
		);
		setInfo((prev) => ({
			...prev,
			access: access?.access || '',
		}));
	}, [info?.activeAiAssistant?.sharedWith]);

	const handleChatSessionClick = useCallback((activity) => {
		navigate(
			`/chat/${activity?.sessionID}?agentType=knowledge_agent&assistantId=${activity?.assistantId}`,
		);
	}, []);

	// Sort activities by createdAt desc
	const sortedActivities = [...info.activities].sort((a, b) => b.createdAt - a.createdAt);
	const [current, ...older] = sortedActivities;

	return (
		<div style={{ width: '100%', paddingRight: 10 }} className="agent-details-container">
			{/* <CreateAgentHeader
				backText="Back to Knowledge Agents"
				agentIcon={<AgentIcon width={16} height={16} />}
				name={info?.loading ? 'Loading...' : info?.activeAiAssistant?.name}
				onBack={() => navigate(-1)}
				actionBtnClassName="editAgentBtn"
				actionText="Edit"
				actionIcon={<EditSvg />}
				onActionClick={() =>
					navigate(`/knowledge-agent/${agentId}/edit`, {
						state: { assistant: info?.activeAiAssistant },
					})
				}
				assistant={info?.activeAiAssistant}
				showActionButton={info?.access === 'edit' || info?.access === 'owner'}
			/> */}
			<AgentCredentials agentId={agentId} />
			<div className="agent-details-wrapper">
				{/* <div className="agent-details-content">
					<h2>
						Ask <span className="agent-name">{info?.activeAiAssistant?.name}</span>
						<br /> anything
					</h2>

					{info?.activeAiAssistant?.handle && (
						<div className="handle-wrapper">@{info?.activeAiAssistant?.handle}</div>
					)}

					{info?.activeAiAssistant?.description && (
						<div className="description-wrapper">
							{info?.activeAiAssistant?.description}
						</div>
					)}
				</div> */}
				<div className="chat-box-wrapper">
					<ChatBox
						onSend={handleCustomOnSendFunction}
						customChatActions={true}
						showUpgradeSubscriptionBtn={false}
					/>
				</div>
			</div>

			<div className="agent-activity-section">
				<h2 className="activity-title">Activities</h2>
				<div className="activity-group-wrapper">
					{info.activities.length === 0 && info.loadingActivities ? (
						<div className="activities-spinner-wrapper">
							<Spinner />
						</div>
					) : info.activities.length === 0 && !info.loadingActivities ? (
						<div className="activities-empty-message">No activities yet.</div>
					) : (
						<InfiniteScroll
							dataLength={info.activities.length}
							next={fetchMoreActivities}
							hasMore={info.hasNextPage}
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
		</div>
	);
};

export default memo(KnowledgeAgentDetails);
