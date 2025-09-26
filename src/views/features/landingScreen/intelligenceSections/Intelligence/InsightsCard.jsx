import { memo } from 'react';
import styles from './insightsCard.module.scss';

const InsightsCard = memo(function InsightsCard({ insights, insightsTitle }) {
	return (
		<div className={styles.insightsCard}>
			<div className={styles.insightsTitle}>{insightsTitle}</div>
			<div className={styles.insightsList}>
				{insights.map((insight, index) => (
					<div key={index} className={styles.insightItem}>
						{insight}
					</div>
				))}
			</div>
		</div>
	);
});

export default InsightsCard;
