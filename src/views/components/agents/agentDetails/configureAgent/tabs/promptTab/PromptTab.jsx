import { memo, useContext, useState } from 'react';
import s from './promptTab.module.scss';
import PromptInput from './PromptInput';
import Context from '../../../../../../../context/context';
import { useParams } from 'react-router-dom';
import { message } from '../../../../../../components/globalComponents/CustomToast';

const PromptTab = () => {
	const { agentId } = useParams();
	const {
		knowledgeAgent: { addInstructionToKnowledgeAgent },
	} = useContext(Context);

	const [info, setInfo] = useState({
		prompt: '',
		initialContent: '',
	});
	const handleSubmit = async () => {
		const instructions = JSON.stringify(info.prompt);
		const response = await addInstructionToKnowledgeAgent(agentId, instructions);
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
			<PromptInput onInputChange={handleInputChange} initialContent={info?.initialContent} />
			<button className={s.submitBtn} onClick={handleSubmit}>
				Submit
			</button>
		</div>
	);
};

export default memo(PromptTab);
