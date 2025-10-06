import { memo } from 'react';
import styles from './opportunityCard.module.scss';

const OpportunityCard = memo(function OpportunityCard({ opportunityContent }) {
	return (
		<div className={styles.opportunityCard}>
			<div className={styles.opportunityHeader}>
				<div className={styles.glowCircle}></div>
				<div className={styles.headerText}>{opportunityContent.header}</div>
			</div>
			<div className={styles.opportunityDescription}>{opportunityContent.description}</div>
		</div>
	);
});

export default OpportunityCard;
