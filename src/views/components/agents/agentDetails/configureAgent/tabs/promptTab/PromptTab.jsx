import { memo, useContext, useEffect, useState } from 'react';
import s from './promptTab.module.scss';
import PromptInput from './PromptInput';
import Context from '../../../../../../../context/context';
import { useParams } from 'react-router-dom';
import { message } from '../../../../../../components/globalComponents/CustomToast';
import KnowledgeAgentPrompt from '../../../../../knowledgeAgent/KnowledgeAgentPrompt';

const PromptTab = () => {
	const { agentId } = useParams();
	const {
		knowledgeAgent: { activeKnowledgeAssistant, getActiveKnowledgeAgentDetails },
	} = useContext(Context);

	const [info, setInfo] = useState({
		title: '',
		prompt: '',
		initialContent: '',
	});

	useEffect(() => {
		if (agentId) {
			getActiveKnowledgeAgentDetails(agentId);
		}
	}, [agentId]);

	const agentData = activeKnowledgeAssistant?.data;

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
			<KnowledgeAgentPrompt assistant={agentData} />
		</div>
	);
};

export default memo(PromptTab);
