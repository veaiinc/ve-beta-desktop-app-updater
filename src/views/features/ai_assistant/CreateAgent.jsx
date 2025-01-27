import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/ai_assistant/CreateAgent.scss';
import '../../../assets/scss/ai_assistant/createAgentHeader.scss';
// import CreateAgentHeader from '../../components/ai_assistant/CreateAgentHeader';
import TabHeader from '../../components/ai_assistant/TabHeader';
import { useNavigate } from 'react-router-dom';
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

const CreateAgent = () => {
	const navigate = useNavigate();

	const [info, setInfo] = useState({
		activeTab: 'personality', // personality, instructions, actions, knowledgeBase, prompt, share, linkeafile
		selectedAgent: null,
		publishAgent: false,
		deleteAgentModal: false,
	});

	const tabs = {
		personality: { value: 'personality', label: 'Personality', component: <AiPersonality /> },
		instructions: {
			value: 'instructions',
			label: 'Instructions',
			component: <AiInstructions />,
		},
		actions: { value: 'actions', label: 'Actions', component: <AiActions /> },
		knowledgeBase: {
			value: 'knowledgeBase',
			label: 'Knowledge Base',
			component: <AiKnowledgeBase />,
		},
		prompt: { value: 'prompt', label: 'Prompt', component: <AiPrompt /> },
		share: { value: 'share', label: 'Share', component: <AiShare /> },
		linkFile: { value: 'linkFile', label: 'Link File', component: <AiLinkFile /> },
	};

	const onTabChange = useCallback((tab) => {
		setInfo((prev) => ({ ...prev, activeTab: tab }));
	}, []);
	const onBack = useCallback(() => {
		navigate(-1);
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

	return (
		<>
			<div className="create-agent">
				<div style={{ flexShrink: 0 }}>
					<div className="create-agent-header">
						<div className="create-agent-header-left">
							<div className="create-agent-header-left-back" onClick={onBack}>
								<div className="create-agent-header-left-back-icon">
									<BackSvg />
								</div>
								<div className="create-agent-header-left-back-text">
									Back to AI Assistants
								</div>
							</div>
							<div className="create-agent-header-left-agent-name">
								<AgentIcon width={18} height={18} />
								{info?.agentName || 'Assistant'}
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

export default memo(CreateAgent);
