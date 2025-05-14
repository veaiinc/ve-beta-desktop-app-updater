import React, { memo } from 'react';
import '../../../assets/scss/knowledgeAgent/index.scss';
import QuickActions from '../../components/globalComponents/QuickActions';
import CardsContainer from '../../components/knowledgeAgent/CardsContainer';
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
const KnowledgeAgents = () => {
	return (
		<div className="knowledge-assistants-container">
			<header className="page-header">
				<h1>
					<span className="header-subtitle">Browse your Knowledge Agents</span>
					<span className="header-title">Curiosity is Superpower.</span>
				</h1>
				<QuickActions suggestedOptions={SuggestedOptions} />
			</header>
			<CardsContainer />
		</div>
	);
};

export default memo(KnowledgeAgents);
