import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/knowledgeAgent/editAgent.scss';
import '../../../assets/scss/ai_assistant/createAgentHeader.scss';
import TabHeader from '../../components/ai_assistant/TabHeader';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ReactComponent as BackSvg } from '../../../assets/svg/sidebar/leftarrowwhite.svg';
import { ReactComponent as PromptsSvg } from '../../../assets/svg/ai_agents/prompts.svg';
import { ReactComponent as Delete } from '../../../assets/svg/ai_assistant/delete.svg';
import KnowledgeInstructions from '../../components/knowledgeAgent/KnowledgeInstructions';
import KnowledgeBase from '../../components/knowledgeAgent/KnowledgeBase';
import AiShare from '../../components/ai_assistant/AiShare';
import AiLinkFile from '../../components/ai_assistant/AiLinkFile';
import DeleteAgentModal from '../../components/modalsV2/ai_assistant/DeleteAgentModal';
import Context from '../../../context/context';
import KnowledgeAgentPersonality from '../../components/knowledgeAgent/KnowledgeAgentPersonality';
import KnowledgeAgentActions from '../../components/knowledgeAgent/KnowledgeAgentActions';
import RecentChat from '../chat/RecentChat';
import ObjectID from 'bson-objectid';
import Visibility from '../../components/knowledgeAgent/Visibility';
const EditKnowledgeAgent = () => {
	const {
		knowledgeAgent: {
			updateKnowledgeAgent,
			getActiveKnowledgeAgentDetails,
			activeKnowledgeAssistant,
		},
		templates: { updateStateValues, chatInfo },
	} = useContext(Context);

	const navigate = useNavigate();
	const { agentId } = useParams();
	const [, setSearchParams] = useSearchParams();
	const [info, setInfo] = useState({
		activeTab: 'personality', // personality, instructions, actions, knowledgeBase, prompt, share, linkeafile
		selectedAgent: null,
		publishAgent: false,
		deleteAgentModal: false,
		assistantData: null,
		timeout: null,
		sessionId: ObjectID().toString(),
	});

	useEffect(() => {
		if (agentId) {
			getActiveKnowledgeAgentDetails(agentId);
			setSearchParams(
				{ agentType: 'knowledge_agent', assistantId: agentId },
				{ replace: true },
			);
		}
	}, [agentId]);

	useEffect(() => {
		if (activeKnowledgeAssistant?.data) {
			setInfo((prev) => ({
				...prev,
				assistantData: activeKnowledgeAssistant?.data,
			}));
		}
	}, [activeKnowledgeAssistant]);

	const handleDebounceUpdate = useCallback(
		(updateData) => {
			clearTimeout(info?.timeout);
			const timeout = setTimeout(() => {
				// Don't make API call if the final debounced name value is empty
				if (updateData.name !== undefined && !updateData.name?.trim()) {
					setInfo((prev) => ({
						...prev,
						timeout: null,
					}));
					return;
				}

				if (agentId) {
					updateKnowledgeAgent(agentId, updateData);
				}
				setInfo((prev) => ({
					...prev,
					timeout: null,
				}));
			}, 800);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info?.timeout, agentId, updateKnowledgeAgent],
	);

	const debouncedUpdateAssistantData = useCallback(
		(key, value) => {
			handleDebounceUpdate({ [key]: value });
		},
		[handleDebounceUpdate],
	);

	const updateAssistantData = useCallback(
		(key, value) => {
			// Update local state immediately
			setInfo((prevInfo) => ({
				...prevInfo,
				assistantData: {
					...prevInfo?.assistantData,
					[key]: value,
				},
			}));

			// Always queue the debounced update - check for empty name
			handleDebounceUpdate({ [key]: value });
		},
		[handleDebounceUpdate],
	);

	const updateAssistantInfo = useCallback((key, value) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			[key]: value,
		}));
	}, []);

	const onTabChange = useCallback(
		(tab) => {
			if (tab !== info?.activeTab) {
				setInfo((prev) => ({ ...prev, activeTab: tab }));
			}
		},
		[info?.activeTab],
	);

	const onDeleteClick = useCallback(() => {
		setInfo((prev) => ({ ...prev, deleteAgentModal: true }));
	}, []);

	const tabs = {
		personality: {
			value: 'personality',
			label: 'Personality',
			component: (
				<KnowledgeAgentPersonality
					assistant={info?.assistantData}
					updateAssistantInfo={updateAssistantInfo}
					updateAssistantData={updateAssistantData}
					debouncedUpdateAssistantData={debouncedUpdateAssistantData}
					isKnowledgeAgent={true}
				/>
			),
		},
		instructions: {
			value: 'instructions',
			label: 'Instructions',
			component: (
				<KnowledgeInstructions instructions={info?.assistantData?.instructions || []} />
			),
		},
		actions: {
			value: 'actions',
			label: 'Actions',
			component: <KnowledgeAgentActions assistant={info?.assistantData} />,
		},
		knowledgeBase: {
			value: 'knowledgeBase',
			label: 'Knowledge Base',
			component: <KnowledgeBase assistant={info?.assistantData} />,
		},
		visibility: {
			value: 'visibility',
			label: 'Visibility',
			component: <Visibility />,
		},
		// prompt: {
		// 	value: 'prompt',
		// 	label: 'Prompt',
		// 	component: <KnowledgeAgentPrompt assistant={info?.assistantData} />,
		// },
		// share: {
		// 	value: 'share',
		// 	label: 'Share',
		// 	component: <AiShare assistant={info?.assistantData} />,
		// },
		// linkFile: {
		// 	value: 'linkFile',
		// 	label: 'Link File',
		// 	component: <AiLinkFile assistant={info?.assistantData} />,
		// },
	};

	return (
		<div style={{ width: '100%' }}>
			<div className="edit-knowledge-agent">
				<div className="tabs-grid-container">
					<div className="tabs-grid-container-left">
						<div style={{ flexShrink: 0 }}>
							<div className="create-agent-header">
								<div className="create-agent-header-left">
									<div
										className="create-agent-header-left-back"
										onClick={() => navigate(-1)}
									>
										<div className="create-agent-header-left-back-icon">
											<BackSvg />
										</div>
										<div className="create-agent-header-left-back-text">
											Back to chat
										</div>
									</div>
									<div className="create-agent-header-left-agent-name">
										<div className="create-agent-header-left-agent-name-image">
											{info?.assistantData?.assitant_profile_picture_s3Key ? (
												<img
													src={
														info?.assistantData
															?.assitant_profile_picture_s3Key
													}
													alt="profile"
												/>
											) : (
												<span className="create-agent-header-left-agent-name-no-image">
													Ai
												</span>
											)}
										</div>

										{info?.assistantData?.name || 'Assistant'}
									</div>
								</div>

								<div className="create-agent-header-right">
									{/* <div
										className={`create-agent-header-delete-button`}
										onClick={onDeleteClick}
									>
										<Delete width={18} height={18} />
										Delete
									</div> */}
								</div>
							</div>

							<TabHeader
								activeTab={info?.activeTab}
								onTabChange={onTabChange}
								tabs={Object?.values(tabs)}
								position="start"
							/>
						</div>
						<div className="tabSection">{tabs[info?.activeTab]?.component}</div>
					</div>
					<div className="tabs-grid-container-right-chat-container">
						<div className="preview-header-wrapper">
							<span className="preview-heading">Preview</span>
							<div className="preview-icons">
								<PromptsSvg />
							</div>
						</div>
						<div className="chat-component-wrapper">
							<RecentChat sId={info?.sessionId} isPreview={true} />
						</div>
					</div>
				</div>
			</div>

			<DeleteAgentModal
				open={info?.deleteAgentModal}
				closeModal={() => setInfo((prev) => ({ ...prev, deleteAgentModal: false }))}
				deleteChatBot={() => {
					navigate(-1);
				}}
				deleteConversations={() => {
					navigate(-1);
				}}
			/>
		</div>
	);
};

export default memo(EditKnowledgeAgent);
