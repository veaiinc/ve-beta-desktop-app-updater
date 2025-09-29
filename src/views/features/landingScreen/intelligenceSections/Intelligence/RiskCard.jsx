import { memo } from 'react';
import styles from './riskCard.module.scss';

const RiskCard = memo(function RiskCard({ riskContent }) {
	return (
		<div className={styles.riskCard}>
			<div className={styles.riskHeader}>
				<div className={styles.riskTitle}>{riskContent.title}</div>
				<div className={styles.riskDescription}>{riskContent.description}</div>
			</div>
			<div className={styles.riskActions}>
				{riskContent.actions.map((action, index) => (
					<button key={index} className={styles.actionButton}>
						{action}
					</button>
				))}
			</div>
		</div>
	);
});

export default RiskCard;
