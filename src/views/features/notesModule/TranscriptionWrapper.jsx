import styles from '../../../assets/scss/notes/transcriptionWidget.module.scss';
import { memo, useState } from 'react';
import TranscriptionWidget from './TranscriptionWidget.jsx';
import { useSearchParams } from 'react-router-dom';
const TranscriptionWrapper = ({ chat, transcription }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [info, setInfo] = useState({
		isChatOpen: false,
	});

	const onChatButtonClick = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set('chat', 'true');
		newParams.delete('transcription');
		setSearchParams(newParams, { replace: true });
		setInfo({
			...info,
			isChatOpen: true,
		});
	};
	return (
		<div className={styles.transcriptionWrapper}>
			{!info?.isChatOpen && (
				<div className={styles.transcriptionWrapperButtonContainer}>
					<button
						className={styles.transcriptionWrapperButton}
						onClick={onChatButtonClick}
					>
						Chat
					</button>
				</div>
			)}
			<TranscriptionWidget />
		</div>
	);
};

export default memo(TranscriptionWrapper);
