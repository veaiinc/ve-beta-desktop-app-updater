import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/knowledgeAgent/agentDetails.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { Drawer } from 'antd';
import CreateAgentHeader from '../../components/ai_assistant/CreateAgentHeader';
// import TabHeader from '../../components/ai_assistant/TabHeader';
import Context from '../../../context/context';
// import AiPlayGround from '../../components/ai_assistant/AiPlayGround';
// import AiChatLogs from '../../components/ai_assistant/AiChatLogs';
import EditSvg from '../../../assets/svg/ai_assistant/EditSvg';
import { message } from '../../components/globalComponents/CustomToast';
import jwtDecode from 'jwt-decode';
import ChatBox from '../../components/chat/ChatBox';
import AgentCredentials from '../../components/agents/agentDetails/agentCredentials/AgentCredentials';
import AgentActivities from '../../components/agents/agentDetails/AgentActivities';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';

import { ReactComponent as Delete } from '../../components/agents/agentDetails/configureAgent/tabs/assets/delete.svg';
import Spinner from '../../components/loaders/Spinner';
import ObjectID from 'bson-objectid';
import { ReactComponent as AgentIcon } from './agenticon.svg';
import { ReactComponent as StatusIcon } from './status.svg';
import { ReactComponent as ClockIcon } from './clock.svg';
import { ReactComponent as CreditIcon } from './credit.svg';

const KnowledgeAgentDetails = () => {
	const {
		knowledgeAgent: { activeKnowledgeAssistant, getActiveKnowledgeAgentDetails },
		templates: { updateStateValues, handleGlobalChatMessages },
	} = useContext(Context);

	const { agentId } = useParams();
	const navigate = useNavigate();

	const [info, setInfo] = useState({
		activeAiAssistant: null,
		loading: true,
		access: 'view',
		sessionId: ObjectID().toString(),
		drawerOpen: false,
		connectedAccounts: [
			{
				id: '1',
				app: {
					name: 'Personalize LinkedIn Requests Using Posts or Profile',
					name_slug: 'gmail',
					img_src: 'https://cdn.jsdelivr.net/gh/ComposioHQ/open-logos@master/gmail.svg',
				},
				created_at: Date.now() - 86400000, // 1 day ago
			},
			{
				id: '2',
				app: {
					name: 'Personalize LinkedIn Requests Using Posts or Profile',
					name_slug: 'slack',
					img_src: 'https://cdn.jsdelivr.net/gh/ComposioHQ/open-logos@master/slack.svg',
				},
				created_at: Date.now() - 172800000, // 2 days ago
			},
			{
				id: '3',
				app: {
					name: 'Personalize LinkedIn Requests Using Posts or Profile',
					name_slug: 'notion',
					img_src: 'https://cdn.jsdelivr.net/gh/ComposioHQ/open-logos@master/notion.svg',
				},
				created_at: Date.now() - 259200000, // 3 days ago
			},
		],
		agentDetails: [
			{
				label: 'Created By',
				value: 'You',
				icon: <AgentIcon />,
			},
			{
				label: 'Status',
				value: 'Active',
				icon: <StatusIcon />,
			},
			{
				label: 'Date Created',
				value: new Date(Date.now()).toLocaleDateString(),
				icon: <ClockIcon />,
			},
			{
				label: 'Credit Used',
				value: 100,
				icon: <CreditIcon />,
			},
		],
		deletingAccountId: null,
	});

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
		if (agentId && info?.sessionId) {
			// updateStateValues({
			// 	chatInfo: {
			// 		...chatInfo,
			// 		agentType: 'knowledge_agent',
			// 		assistantId: agentId,
			// 	},
			// });
			handleGlobalChatMessages({
				sessionId: info?.sessionId,
				chatInfo: {
					agentType: 'knowledge_agent',
					assistantId: agentId,
				},
				updateExtraInfo: true,
			});
		}
	}, [agentId]);

	useEffect(() => {
		checkAccess();
	}, [info?.activeAiAssistant]);

	const handleCustomOnSendFunction = useCallback(
		(data) => {
			updateStateValues({ activePayloadForChat: data });
			navigate(`/chat/${info?.sessionId}?agentType=knowledge_agent&assistantId=${agentId}`);
		},
		[info?.sessionId],
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

	const drawerStyles = {
		header: { display: 'none' },
		body: {
			padding: 0,
			height: '100vh',
			overflow: 'auto',
		},
	};

	const handleDeleteAccount = async (accountId, appName, e) => {
		if (info?.deletingAccountId === accountId) return;
		e.stopPropagation();
		setInfo((prev) => ({
			...prev,
			deletingAccountId: accountId,
		}));

		// Simulate API call delay
		setTimeout(() => {
			setInfo((prev) => ({
				...prev,
				connectedAccounts: prev.connectedAccounts.filter(
					(account) => account.id !== accountId,
				),
				deletingAccountId: null,
			}));
			message.success('Account deleted successfully');
		}, 1000);
	};

	return (
		<div className="agent-details-wrappe-container">
			<div className="agent-activity-section-container">
				<AgentActivities />
			</div>
			<div style={{ width: '100%', paddingRight: 10 }} className="agent-details-container">
				<AgentCredentials agentId={agentId} agentForRunAgent={true} />
				<div className="agent-details-wrapper">
					<div className="chat-box-wrapper">
						<ChatBox
							onSend={handleCustomOnSendFunction}
							customChatActions={true}
							showUpgradeSubscriptionBtn={false}
							sessionId={info?.sessionId}
						/>
					</div>
				</div>
			</div>

			{/* Drawer for agent details */}
			<div
				style={{ width: info.drawerOpen ? `30%` : `0px` }}
				className="agent-details-drawer"
			>
				<Drawer
					open={info.drawerOpen}
					placement="right"
					closable={false}
					mask={false}
					styles={drawerStyles}
					style={{ position: 'relative', width: '100%' }}
					className="agent-details__right agent-details__right--open"
					getContainer={false}
					width="100%"
				>
					<div className="agent-details__sidebar-closing">
						<SidebarClosingSvg
							onClick={() => setInfo((prev) => ({ ...prev, drawerOpen: false }))}
						/>
					</div>
					<div className="agent-details__drawer-content">
						<div className="agent-details__drawer-header"></div>

						<div className="agent-details__tools-content">
							{info.connectedAccounts.length === 0 ? (
								<div className="agent-details__empty-state">
									<p>No Info Found</p>
								</div>
							) : (
								<div className="agent-details__tools-content-wrapper">
									<div className="agent-details__details-header">
										<p className="agent-details__details-header-text">
											Details
										</p>
										<div className="agent-details__detail-items">
											{info.agentDetails.map((detail) => (
												<div
													className="agent-details__detail-item"
													key={detail.label}
												>
													<div className="agent-details__detail-icon">
														{detail.icon}
														<p className="agent-details__detail-label">
															{detail.label}
														</p>
													</div>
													<p className="agent-details__detail-value">
														{detail.value}
													</p>
												</div>
											))}
										</div>
									</div>
									<div className="agent-details__divider"></div>
									<div className="agent-details__tools-list">
										<p className="agent-details__tools-list-header">Linked tools</p>
										<div className="agent-details__tools-list-content">
										{info.connectedAccounts.map((account) => (
											<div
												key={account.id}
												className="agent-details__tool-card"
											>
												<div className="agent-details__tool-icon">
													<img
														src={account.app.img_src}
														alt={account.app.name}
														className="agent-details__app-icon"
													/>
												</div>
												<p className="agent-details__tool-name">
													{account.app.name}
												</p>
												</div>
											))}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</Drawer>
				{!info.drawerOpen && (
					<div className="agent-details__sidebar-closing">
						<SidebarClosingSvg
							onClick={() => setInfo((prev) => ({ ...prev, drawerOpen: true }))}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(KnowledgeAgentDetails);
