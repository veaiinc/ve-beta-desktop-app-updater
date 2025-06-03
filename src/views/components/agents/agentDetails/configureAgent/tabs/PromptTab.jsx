import { memo } from 'react';
import s from './promptTab.module.scss';

const PromptTab = () => {
	return (
		<div className={s.promptTabContainer}>
			<div className={s.promptTabHeader}>
				<h1>Prompt</h1>
			</div>
		</div>
	);
};

export default memo(PromptTab);
