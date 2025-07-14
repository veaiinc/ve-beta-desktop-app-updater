import { memo, useContext, useEffect, useState } from 'react';
import s from './promptTab.module.scss';
import PromptInput from './PromptInput';
import Context from '../../../../../../../context/context';
import { useParams } from 'react-router-dom';
import { message } from '../../../../../../components/globalComponents/CustomToast';
import KnowledgeAgentPrompt from '../../../../../knowledgeAgent/KnowledgeAgentPrompt';
const actionPattern = /<([^>]+)>/g;
const PromptTab = () => {
	const { agentId } = useParams();
	const {
		knowledgeAgent: {
			activeKnowledgeAssistant,
			getActiveKnowledgeAgentDetails,
			getPipeDreamAction,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		title: '',
		prompt: '',
		initialContent: '',
		actionDetails: [],
	});

	useEffect(() => {
		if (agentId) {
			getActiveKnowledgeAgentDetails(agentId);
		}
	}, [agentId]);

	const agentData = activeKnowledgeAssistant?.data;

	function getActionNamefromPrompt(prompt) {
		if (!prompt) return [];

		// Regular expression to match action names in angle brackets
	
		let actions = [];
		let match;

		// Find all matches in the prompt
		while ((match = actionPattern.exec(prompt)) !== null) {
			actions.push(match[1]); // match[1] contains the text inside brackets
		}

		return actions;
	}

	// useEffect(() => {
	// 	setInfo({
	// 		title: activeKnowledgeAssistant?.title,
	// 		prompt: activeKnowledgeAssistant?.instruction,
	// 		initialContent: activeKnowledgeAssistant?.instruction,
	// 	});
	// }, [activeKnowledgeAssistant?.data?.instructions]);

	const handleSubmit = async () => {
		const instruction = info.prompt;
		const title = info.title;
		const payload = {
			title,
			instruction,
		};

		const response = await addInstructionToKnowledgeAgent(agentId, payload);
		if (response?.[0]) {
			message.success('Instruction added successfully');
		} else {
			message.error('Failed to add instruction');
		}
	};
	const handleInputChange = (data) => {
		setInfo({ ...info, prompt: data });
	};

	useEffect(() => {
		const fetchPipeDreamAction = async () => {
			const actionNames = getActionNamefromPrompt(agentData?.prompt?.customEditedPrompt);
			const actionDetailsArray = [];

			for (const actionName of actionNames) {
				try {
					const response = await getPipeDreamAction(actionName);
					if (response?.[0] === true) {
						// Extract app name and get favicon URL

						actionDetailsArray.push({
							actionName,
							actionData: response?.[1],
						});
					}
				} catch (error) {
					message.error(`Error fetching action ${actionName}:`, error);
				}
			}

			setInfo({ ...info, actionDetails: actionDetailsArray });
		};

		if (agentData?.prompt?.customEditedPrompt) {
			fetchPipeDreamAction();
		}
	}, [agentData?.prompt?.customEditedPrompt]);

	return (
		<div className={s.promptTabContainer}>
			{/* <div className={s.titleInputContainer}>
				<input
					type="text"
					placeholder="Title"
					value={info.title}
					onChange={(e) => setInfo({ ...info, title: e.target.value })}
				/>
			</div>
			<div className={s.promptInputContainer}>
				<PromptInput
					onInputChange={handleInputChange}
					initialContent={info?.initialContent}
				/>
				<button className={s.submitBtn} onClick={handleSubmit}>
					Submit
				</button>
			</div> */}
			<KnowledgeAgentPrompt assistant={agentData} actionDetails={info?.actionDetails} />
		</div>
	);
};

export default memo(PromptTab);
