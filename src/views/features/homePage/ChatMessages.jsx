import { Fragment, memo, useLayoutEffect, useRef, useState } from 'react';
import AIMessageRenderer from '../../components/chat/AIMessageRenderer';
import { UserMessageRenderer } from '../../../helpers/markdownHelper';
import s from '../../../assets/scss/home_page/chatMessages.module.scss';

const ChatMessages = ({ messages = [], sessionId = null }) => {
	const containerRef = useRef(null);
	const [info, setInfo] = useState({
		showViewDocument: false,
	});

	useLayoutEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTo({
				top: containerRef.current.scrollHeight,
			});
		}
	}, [messages]);

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
										showViewDocument={info?.showViewDocument}
										isPublicChat={false}
										messageIndex={index}
										showCitationsButton={false}
										sessionId={sessionId}
										showResponseEditBtn={false}
									/>
								</div>
							) : (
								<UserMessageRenderer messageData={chat} />
							)}
						</div>
					),
				)}
			</div>
		</>
	);
};

export default memo(ChatMessages);
