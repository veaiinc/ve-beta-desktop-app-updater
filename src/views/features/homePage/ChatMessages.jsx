import { memo, useLayoutEffect, useRef, useState, lazy, Suspense } from 'react';
import AIMessageRenderer from '../../components/chat/AIMessageRenderer';
import { UserMessageRenderer } from '../../../helpers/markdownHelper';
import s from '../../../assets/scss/home_page/chatMessages.module.scss';
const NoteComponentModal = lazy(() => import('../../components/notes/NoteComponentModal'));

const ChatMessages = ({ messages = [], sessionId = null }) => {
	const containerRef = useRef(null);
	const [info, setInfo] = useState({
		showViewDocument: false,
		noteModalIsOpen: false,
	});

	useLayoutEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTo({
				top: containerRef.current.scrollHeight,
			});
		}
	}, [messages]);

	const handleNoteComponentModalOpen = () => {
		setInfo((prev) => ({ ...prev, noteModalIsOpen: true }));
	};

	const handleNoteComponentModalClose = () => {
		setInfo((prev) => ({ ...prev, noteModalIsOpen: false }));
	};

	return (
		<>
			<div className={s.ChatMessagesContainer} ref={containerRef}>
				{messages?.map((chat, index) =>
					chat?.content ? (
						<Fragment key={index}>{chat?.content}</Fragment>
					) : (
						<div key={index}>
							{chat?.type?.toLowerCase() === 'ai' ? (
								<div className="content">
									<AIMessageRenderer
										messageData={chat}
										handleNoteComponentModalOpen={handleNoteComponentModalOpen}
										showViewDocument={info?.showViewDocument}
										isPublicChat={false}
										messageIndex={index}
										showCitationsButton={false}
										sessionId={sessionId}
									/>
								</div>
							) : (
								<UserMessageRenderer messageData={chat} />
							)}
						</div>
					),
				)}
			</div>
			{info?.noteModalIsOpen && (
				<Suspense fallback={'Loading...'}>
					<NoteComponentModal
						modalIsOpen={info?.noteModalIsOpen}
						closeModal={handleNoteComponentModalClose}
						sessionId={sessionId}
					/>
				</Suspense>
			)}
		</>
	);
};

export default memo(ChatMessages);
