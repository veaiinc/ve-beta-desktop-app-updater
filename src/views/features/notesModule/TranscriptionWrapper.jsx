import styles from '../../../assets/scss/notes/transcriptionWidget.module.scss';
import { memo, useContext, useEffect, useState } from 'react';
import TranscriptionWidget from './TranscriptionWidget.jsx';
import { useSearchParams } from 'react-router-dom';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as Sparks } from '../../../assets/svg/notes/sparks.svg';
import Context from '../../../context/context.js';

const TranscriptionWrapper = ({
	chat,
	transcription,
	transcriptList = [],
	sessionId,
	botJoined,
	botJoinedTime,
	meetingPlatform,
}) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const {
		templates: { updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState({
		userInput: '',
		sessionId: null,
	});
	useEffect(() => {
		const sessionId = searchParams.get('sId');
		if (sessionId) {
			setInfo((prev) => ({ ...prev, sessionId: sessionId }));
		}
	}, [searchParams]);

	const onChatButtonClick = () => {
		if (!info.userInput) return;

		const newParams = new URLSearchParams(searchParams);
		newParams.set('chat', 'true');
		newParams.delete('transcription');
		updateStateValues({
			activePromptForChat: {
				prompt: info.userInput,
				sessionId: info?.sessionId,
			},
		});
		setInfo((prev) => ({ ...prev, userInput: '' }));
		setSearchParams(newParams, { replace: true });
	};
	return (
		<div
			className={styles.transcriptionWrapper}
			style={{
				right: chat || transcription ? '400px' : '0px',
			}}
		>
			<div className={styles.transcriptionWrapperContent}>
				<div className={styles.chatInputContainer}>
					<div className="chatInputSparkle">
						<Sparks />
					</div>
					<input
						type="text"
						placeholder="Search or Ask AI for goal help"
						className={styles.chatInput}
						value={info.userInput}
						onChange={(e) => setInfo({ ...info, userInput: e.target.value })}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								onChatButtonClick();
							}
						}}
					/>
					<button className={styles.sendButton} onClick={onChatButtonClick}>
						<UpArrowGrey className={styles.sendButtonIcon} />
					</button>
				</div>
				{botJoined && (
					<TranscriptionWidget
						transcriptList={transcriptList}
						botJoinedTime={botJoinedTime}
						meetingPlatform={meetingPlatform}
					/>
				)}
			</div>
		</div>
	);
};

export default memo(TranscriptionWrapper);
