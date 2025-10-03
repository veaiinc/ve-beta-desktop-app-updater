import { memo } from 'react';
import styles from './superAgentOpportunityCard.module.scss';

const SuperAgentOpportunityCard = memo(function SuperAgentOpportunityCard({
	superAgentOpportunity,
}) {
	return (
		<div className={styles.superAgentOpportunityCard}>
			<div className={styles.headerSection}>
				<div className={styles.headerLabel}>{superAgentOpportunity.header}</div>
			</div>
			<div className={styles.contentSection}>
				<div className={styles.contentText}>{superAgentOpportunity.content}</div>
			</div>
		</div>
	);
});

export default SuperAgentOpportunityCard;
