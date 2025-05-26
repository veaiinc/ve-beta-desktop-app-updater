import React, { memo } from 'react';
import styles from '../../../assets/scss/ai_assistant/actionButton.module.scss';

const ActionButton = ({ children, ...props }) => {
	return (
		<button {...props} className={styles.actionButton}>
			{children}
		</button>
	);
};

export default memo(ActionButton);
