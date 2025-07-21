import { memo, useState } from 'react';
import AIMessageRenderer from '../../components/chat/AIMessageRenderer';
import { UserMessageRenderer } from '../../../helpers/markdownHelper';
import s from '../../../assets/scss/home_page/chatMessages.module.scss';
import NoteComponentModal from '../../components/notes/NoteComponentModal';

const ChatMessages = ({ messages = [], sessionId = null }) => {
	const [info, setInfo] = useState({
		showViewDocument: false,
		noteModalIsOpen: false,
	});

	const handleNoteComponentModalOpen = () => {
		setInfo((prev) => ({ ...prev, noteModalIsOpen: true }));
	};

	const handleNoteComponentModalClose = () => {
		setInfo((prev) => ({ ...prev, noteModalIsOpen: false }));
	};

	return (
		<>
			<div className={s.ChatMessagesContainer} style={{ flex: 1 }}>
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
			<NoteComponentModal
				modalIsOpen={info?.noteModalIsOpen}
				closeModal={handleNoteComponentModalClose}
				sessionId={sessionId}
			/>
		</>
	);
};

export default memo(ChatMessages);
