import React, { memo } from 'react';
import s from '../../../assets/scss/ai_assistant/actionButton.module.scss';

const ActionButton = ({ children, ...props }) => {
	return (
		<button {...props} className={s.actionButton}>
			{children}
		</button>
	);
};

export default memo(ActionButton);
