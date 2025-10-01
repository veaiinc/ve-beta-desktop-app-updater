import { memo } from 'react';
import { ReactComponent as ChatIcon } from '../../../../../assets/svg/landingScreen/Intelligence/Chat.svg';
import styles from './chatCard.module.scss';

const ChatCard = memo(function ChatCard({ chatContent }) {
	return (
		<div className={styles.chatCard}>
			<div className={styles.chatIcon}>
				<ChatIcon />
			</div>
		</div>
	);
});

export default ChatCard;
