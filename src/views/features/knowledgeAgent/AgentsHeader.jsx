import React, { memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../../assets/scss/knowledgeAgent/AgentsHeader.scss';
// import QuickActions from '../../components/globalComponents/QuickActions';
import { message } from '../../components/globalComponents/CustomToast';

const SuggestedOptions = [
	{
		id: 1,
		title: 'Conversational Agent',
		value: 'ai-assistant',
		controlValue: 'conversationalAgent',
		action: async ({ setInfo, createNewAiAssistant, navigate }) => {
			try {
				setInfo((prev) => ({
					...prev,
					showLoader: true,
					loaderMessage: 'Creating AI Assistant...',
				}));
				const aiAssistantId = await createNewAiAssistant({
					name: 'Untitled Assistant',
				});
				if (aiAssistantId) {
					navigate(`/ai-assistant/${aiAssistantId}/edit`);
				}
			} catch (error) {
				message.error('Failed to create AI Assistant');
			} finally {
				setInfo((prev) => ({
					...prev,
					showLoader: false,
					loaderMessage: '',
				}));
			}
		},
	},
	{
		id: 2,
		title: 'Knowledge Agent',
		value: 'knowledge-agent',
		controlValue: 'knowledgeAgent',
		action: async ({ setInfo, navigate, createNewKnowledgeAgent }) => {
			try {
				setInfo((prev) => ({
					...prev,
					showLoader: true,
					loaderMessage: 'Creating knowledge agent...',
				}));
				const [, data] = await createNewKnowledgeAgent('Untitled Assistant');
				const aiAssistantId = data?.insertedId;
				if (aiAssistantId) {
					navigate(`/knowledge-agent/${aiAssistantId}/edit`);
				}
			} catch (error) {
				console.log(error);
				message.error('Failed to create knowledge agent');
			} finally {
				setInfo((prev) => ({
					...prev,
					showLoader: false,
					loaderMessage: '',
				}));
			}
		},
	},
];

const AgentsHeader = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const isKnowledgeAgent = location.pathname.includes('/knowledge-agent');

	const handleNavigation = (path) => {
		if (path === 'knowledge-agent' && !isKnowledgeAgent) {
			navigate('/knowledge-agent');
		} else if (path === 'ai-assistant' && isKnowledgeAgent) {
			navigate('/ai-assistant');
		}
	};

	return (
		<div className="agents-header">
			<div className="assistants-navigation-container">
				<div
					className={`assistants-navigation-item ${
						isKnowledgeAgent ? 'assistants-navigation-item-active' : ''
					}`}
					onClick={() => handleNavigation('knowledge-agent')}
				>
					<span>Knowledge Agents</span>
				</div>
				<div
					className={`assistants-navigation-item ${
						!isKnowledgeAgent ? 'assistants-navigation-item-active' : ''
					}`}
					onClick={() => handleNavigation('ai-assistant')}
				>
					<span>AI Assistants</span>
				</div>
			</div>
			<header className="page-header">
				<h1>
					<span className="header-subtitle">
						{isKnowledgeAgent ? 'Browse your Knowledge Agents' : 'Create AI Assistants'}
					</span>
					<span className="header-title">
						{isKnowledgeAgent ? 'Curiosity is Superpower.' : 'Build your AI Assistant'}
					</span>
				</h1>
				{/* <QuickActions suggestedOptions={SuggestedOptions} /> */}
			</header>
		</div>
	);
};

export default memo(AgentsHeader);
