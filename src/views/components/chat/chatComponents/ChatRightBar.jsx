import { memo, useMemo, lazy, Suspense } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/chatRightBar.module.scss';
import NoteComponentWrapper from '../../notes/NoteComponentWrapper';
const CitationsModal = lazy(() => import('../../modalsV2/chat/CitationsModal'));

const ChatRightBar = ({
	activeRightBar,
	handleRightBarToggle,
	handleCloseCitationsModal,
	sessionId,
	chatToNoteLoopOn = false,
}) => {
	const componentMapper = useMemo(
		() => ({
			citations: (
				<div className={s.citationsWrapper}>
					<Suspense fallback={'Loading...'}>
						<CitationsModal closeModal={handleCloseCitationsModal} />
					</Suspense>
				</div>
			),
			notes: (
				<div className={s.notesWrapper}>
					<NoteComponentWrapper
						closeModal={handleRightBarToggle}
						sessionId={sessionId}
						chatToNoteLoopOn={chatToNoteLoopOn}
					/>
				</div>
			),
		}),
		[handleRightBarToggle, handleCloseCitationsModal, sessionId, chatToNoteLoopOn],
	);

	return <div className={s.chatRightBar}>{componentMapper[activeRightBar] ?? ''}</div>;
};

export default memo(ChatRightBar);
