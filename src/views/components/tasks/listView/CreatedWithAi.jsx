import { memo } from 'react';
import { ReactComponent as AiStars } from '../../../../assets/svg/tasks/AiStars.svg';
import '../../../../assets/scss/tasks/listItems.scss';

const CreatedWithAi = () => {
	return (
		<div className="created-with-ai">
			<AiStars />
			AI
		</div>
	);
};

export default memo(CreatedWithAi);
