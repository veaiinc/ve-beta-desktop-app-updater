import { memo, useState } from 'react';
import s from './promptTab.module.scss';
import PromptInput from './PromptInput';

const PromptTab = () => {
	const [info, setInfo] = useState({
		prompt: '',
		initialContent: '',
	});
	const handleSubmit = () => {
		console.log(info?.prompt);
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
