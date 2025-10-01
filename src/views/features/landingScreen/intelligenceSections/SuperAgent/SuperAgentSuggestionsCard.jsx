import { memo } from 'react';
import { ReactComponent as MicrophoneIcon } from '../../../../../assets/svg/landingScreen/Intelligence/Microphone.svg';
import { ReactComponent as SendIcon } from '../../../../../assets/svg/landingScreen/Intelligence/sendd.svg';
import styles from './superAgentSuggestionsCard.module.scss';

const SuperAgentSuggestionsCard = memo(function SuperAgentSuggestionsCard({
	superAgentSuggestions,
}) {
	return (
		<div className={styles.superAgentCard}>
			<div className={styles.chatContainer}>
				<div className={styles.messageSection}>
					<div className={styles.messageText}>{superAgentSuggestions.message}</div>
				</div>
				<div className={styles.actionsSection}>
					<button className={styles.actionButton}>
						<div className={styles.iconWrapper}>
							<MicrophoneIcon className={styles.buttonIcon} />
						</div>
					</button>
					<button className={styles.actionButton}>
						<SendIcon className={styles.buttonIcon} />
					</button>
				</div>
			</div>
		</div>
	);
});

export default SuperAgentSuggestionsCard;
