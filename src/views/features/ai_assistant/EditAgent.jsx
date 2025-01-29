import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_assistant/EditAgent.scss';
import '../../../assets/scss/ai_assistant/createAgentHeader.scss';
// import CreateAgentHeader from '../../components/ai_assistant/CreateAgentHeader';
import TabHeader from '../../components/ai_assistant/TabHeader';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as AgentIcon } from '../../../assets/svg/ai_assistant/agent.svg';
import { ReactComponent as BackSvg } from '../../../assets/svg/sidebar/leftarrowwhite.svg';
import { ReactComponent as Delete } from '../../../assets/svg/ai_assistant/delete.svg';
import AiPersonality from '../../components/ai_assistant/AiPersonality';
import AiInstructions from '../../components/ai_assistant/AiInstructions';
import AiActions from '../../components/ai_assistant/AiActions';
import AiKnowledgeBase from '../../components/ai_assistant/AiKnowledgeBase';
import AiPrompt from '../../components/ai_assistant/AiPrompt';
import AiShare from '../../components/ai_assistant/AiShare';
import AiLinkFile from '../../components/ai_assistant/AiLinkFile';
import DeleteAgentModal from '../../components/modalsV2/ai_assistant/DeleteAgentModal';
import Context from '../../../context/context';

const EditAgent = () => {
	const {
		aiSetup: { updateAiAssistant, getActiveAiAssistantDetails, activeAiAssistantDetails },
	} = useContext(Context);

	const navigate = useNavigate();
	const { assistant } = useLocation()?.state || {};
	const { aiAssistantId } = useParams();

	const [info, setInfo] = useState({
		activeTab: 'personality', // personality, instructions, actions, knowledgeBase, prompt, share, linkeafile
		selectedAgent: null,
		publishAgent: false,
		deleteAgentModal: false,
		assistantData: assistant,
	});

	// console.log('activeAiAssistantDetails on EditAgent page', activeAiAssistantDetails);

	useEffect(() => {
		if (aiAssistantId) {
			getActiveAiAssistantDetails(aiAssistantId);
		}
	}, []);

	useEffect(() => {
		if (activeAiAssistantDetails) {
			console.log(
				'Detailed data is saved in assistantData : component EditAgent',
				activeAiAssistantDetails,
			);
			setInfo((prev) => ({ ...prev, assistantData: activeAiAssistantDetails }));
		}
	}, [activeAiAssistantDetails]);

	const onTabChange = useCallback((tab) => {
		setInfo((prev) => ({ ...prev, activeTab: tab }));
	}, []);
	const onActionClick = useCallback(() => {
		console.log('Action Clicked');
	}, []);

	const onDeleteClick = useCallback(() => {
		setInfo((prev) => ({ ...prev, deleteAgentModal: true }));
	}, []);
	const handleDeleteAgent = useCallback(() => {
		console.log('Delete Agent Clicked');
	}, []);

	const tabs = {
		personality: {
			value: 'personality',
			label: 'Personality',
			component: <AiPersonality assistant={info?.assistantData} />,
		},
		instructions: {
			value: 'instructions',
			label: 'Instructions',
			component: <AiInstructions assistant={info?.assistantData} />,
		},
		actions: {
			value: 'actions',
			label: 'Actions',
			component: <AiActions assistant={info?.assistantData} />,
		},
		knowledgeBase: {
			value: 'knowledgeBase',
			label: 'Knowledge Base',
			component: <AiKnowledgeBase assistant={info?.assistantData} />,
		},
		prompt: {
			value: 'prompt',
			label: 'Prompt',
			component: <AiPrompt assistant={info?.assistantData} />,
		},
		share: {
			value: 'share',
			label: 'Share',
			component: <AiShare assistant={info?.assistantData} />,
		},
		linkFile: {
			value: 'linkFile',
			label: 'Link File',
			component: <AiLinkFile assistant={info?.assistantData} />,
		},
	};

	return (
		<>
			<div className="create-agent">
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
									Back to AI Assistants
								</div>
							</div>
							<div className="create-agent-header-left-agent-name">
								<AgentIcon width={18} height={18} />
								{info?.assistantData?.name || 'Assistant'}
							</div>
						</div>

						<div className="create-agent-header-right">
							{info?.selectedAgent ? (
								<>
									<span className="create-agent-header-right-status">
										<div className="create-agent-header-right-status-icon" />
										{info?.selectedAgent?.status}
									</span>
									<button
										className={`create-agent-header-right-button`}
										onClick={onActionClick}
									>
										Publish
									</button>
								</>
							) : (
								<div
									className={`create-agent-header-delete-button`}
									onClick={onDeleteClick}
								>
									<Delete width={18} height={18} />
									Delete
								</div>
							)}
						</div>
					</div>

					<TabHeader
						activeTab={info?.activeTab}
						onTabChange={onTabChange}
						tabs={Object?.values(tabs)}
					/>
				</div>

				<div className="tabSection">{tabs[info?.activeTab]?.component}</div>
			</div>

			<DeleteAgentModal
				open={info?.deleteAgentModal}
				closeModal={() => setInfo((prev) => ({ ...prev, deleteAgentModal: false }))}
				deleteChatBot={() => {
					console.log('Delete Chat Bot Clicked');
					navigate(-1);
				}}
				deleteConversations={() => {
					console.log('Delete Conversations Clicked');
					navigate(-1);
				}}
			/>
		</>
	);
};

export default memo(EditAgent);
