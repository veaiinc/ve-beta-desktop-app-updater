import { useEffect, useState, useContext, useCallback } from 'react';
import s from './agentDrawer.module.scss';
import { ReactComponent as ChevronRight } from './assets/chevronRight.svg';
import { ReactComponent as LucidBotIcon } from './assets/lucid-bot.svg';
import { ReactComponent as ArrowCorner } from './assets/arrowCorner.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
// import Spinner from '../../components/loaders/Spinner';
import ChatBox from '../../components/chat/ChatBox';
import ObjectID from 'bson-objectid';
import { ReactComponent as DeleteSvg } from './assets/deleteSvg.svg';
import { ReactComponent as ShareSvg } from './assets/shareSvg.svg';
import DeleteFormModal from '../../components/modalsV2/DeleteModal/DeleteModal';
import { message } from '../../components/globalComponents/CustomToast';
import AgentShareComponent from '../../components/agents/agentShare/AgentShareComponent';

const shareButtonStyle = {
	width: '32px',
	height: '32px',
	padding: '0',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
};

const AgentDrawer = ({
	open,
	closeDrawer,
	agent,
	currentIndex,
	totalCount,
	handleCardClick,
	handleLeft,
	handleRight,
	isTemplate,
	handleAddTemplateToWorkspace,
	addTemplateAgentLoader,
}) => {
	const navigate = useNavigate();
	const {
		knowledgeAgent: {
			deleteKnowledgeAgent,
			activeKnowledgeAssistant,
			getActiveKnowledgeAgentDetails,
			fetchedKnowledgeAgents,
		},
		templates: { updateStateValues, handleGlobalChatMessages },
	} = useContext(Context);

	const [info, setInfo] = useState({
		sessionId: ObjectID()?.toString(),
	});

	useEffect(() => {
		if (agent) {
			handleGlobalChatMessages({
				sessionId: info?.sessionId,
				chatInfo: {
					agentType: 'knowledge_agent',
					assistantId: agent?._id,
				},
				updateExtraInfo: true,
			});
		}
	}, [agent]);

	useEffect(() => {
		if (agent?._id) {
			if (
				fetchedKnowledgeAgents === null ||
				fetchedKnowledgeAgents?.[agent?._id] === undefined
			) {
				getActiveKnowledgeAgentDetails(agent?._id, true);
			}
		}
	}, [agent?._id]);

	const handleCustomOnSendFunction = useCallback(
		(data) => {
			updateStateValues({ activePayloadForChat: data });
			navigate(
				`/chat/${info?.sessionId}?agentType=knowledge_agent&assistantId=${agent?._id}`,
			);
		},
		[info?.sessionId, agent?._id],
	);

	const handleDeleteAgent = async (agentId) => {
		if (info?.loading) return;
		setInfo((prev) => ({ ...prev, loading: true }));

		try {
			const [success, data] = await deleteKnowledgeAgent(agentId);
			if (success) {
				message.success('Agent deleted successfully');
				navigate('/agents');
			} else {
				message.error(data?.message || 'Failed to delete agent');
			}
		} catch (error) {
			message.error('Failed to delete agent');
		} finally {
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	};

	const handleOpenDeleteModal = () => {
		setInfo((prev) => ({
			...prev,
			deleteModal: { open: true },
		}));
	};

	const handleConfirmDelete = async () => {
		await handleDeleteAgent(agent?._id);
		setInfo((prev) => ({
			...prev,
			deleteModal: { open: false },
		}));
	};

	const handleCancelDelete = () => {
		setInfo((prev) => ({
			...prev,
			deleteModal: { open: false },
		}));
	};

	const activeAgent = fetchedKnowledgeAgents?.[agent?._id]
		? { data: fetchedKnowledgeAgents?.[agent?._id] }
		: null;

	return (
		<>
			<div className={`${s.agentMask} ${open ? s.open : ''}`} onClick={closeDrawer}></div>
			<div className={`${s.agentDrawer} ${open ? s.open : ''}`}>
				<div className={s.header}>
					<div className={s.navigation}>
						<div className={s.count}>
							<span>{currentIndex !== undefined ? currentIndex + 1 : 1}</span> /{' '}
							{totalCount || 0}
						</div>
						<button className={s.prev} onClick={handleLeft}>
							<ChevronRight />
						</button>
						<button className={s.next} onClick={handleRight}>
							<ChevronRight />
						</button>
					</div>
					<div className={s.headerActions}>
						{isTemplate ? (
							<>
								<button
									className={s.addWorkspaceButton}
									onClick={() => handleAddTemplateToWorkspace(agent?._id)}
									disabled={addTemplateAgentLoader}
								>
									{addTemplateAgentLoader ? 'Adding...' : 'Add to workspace'}
								</button>
							</>
						) : (
							<>
								<AgentShareComponent
									activeKnowledgeAssistant={activeAgent}
									buttonText={<ShareSvg />}
									buttonStyle={shareButtonStyle}
									agentId={agent?._id}
								/>
								<button className={s.deleteButton} onClick={handleOpenDeleteModal}>
									<DeleteSvg />
								</button>
							</>
						)}
					</div>
				</div>
				<div className={s.contentWtrapper}>
					<div className={s.agentDetails}>
						<div className={s.detailsSection}>
							<div className={s.avatar}>
								<div className={s.activeDotContainer}>
									<div
										className={s.activeDot}
										style={{
											backgroundColor: agent?.isActive
												? 'var(--success)'
												: 'var(--pending)',
										}}
									></div>
								</div>
								{agent?.knowledgeAgent_profile_picture_s3Key ? (
									<img
										src={agent?.knowledgeAgent_profile_picture_s3Key}
										alt={agent?.name || 'Agent'}
										className={s.agentImage}
									/>
								) : (
									<div className={s.defaultAvatar}>
										<LucidBotIcon />
									</div>
								)}
							</div>
							<div className={s.textSection}>
								<div className={s.name}>{agent?.name || 'Untitled Agent'}</div>
								<div className={s.role}>{agent?.role} &nbsp;</div>
							</div>

							<button
								className={s.gotoAgentPage}
								onClick={() =>
									navigate(`/agent/${agent?._id}?agentAction=buildAgent`)
								}
							>
								{isTemplate ? 'Preview flow' : 'Customize'} <ArrowCorner />
							</button>
						</div>
						<div className={s.descriptionSection}>
							{agent?.description || 'No description available'}
						</div>
						{/* <div className={s.divider}></div>
						<div className={s.toolsSection}>
							<span className={s.toolsSectionTitle}>Linked Tools:</span>
							<div className={s.toolsList}>
								{info.accountsLoading ? (
									<div className={s.loadingContainer}>
										<Spinner width="20px" height="20px" />
									</div>
								) : info.connectedAccounts.length === 0 ? (
									<div className={s.emptyState}>No tools connected yet.</div>
								) : (
									<div className={s.toolsListWrapper}>
										{info.connectedAccounts.map((account) => (
											<div className={s.toolIcon}>
												<img
													src={account.app.img_src}
													alt={account.app.name}
													className={s.appIcon}
												/>
											</div>
										))}
									</div>
								)}
							</div>
						</div> */}
					</div>
				</div>

				<div className={s.chatBoxContainer}>
					<ChatBox
						onSend={handleCustomOnSendFunction}
						customChatActions={true}
						showUpgradeSubscriptionBtn={false}
						sessionId={info?.sessionId}
						animateChatBox={false}
						placeholder="Guide me..."
						showBottomTools={false}
					/>
				</div>
				<DeleteFormModal
					isOpen={info?.deleteModal?.open}
					onClose={handleCancelDelete}
					onConfirm={handleConfirmDelete}
					title="Delete Agent?"
					itemType="agent"
					description="Are you sure you want to delete this agent?"
					warning="This agent will be permanently removed and cannot be recovered."
				/>
			</div>
		</>
	);
};

export default AgentDrawer;
