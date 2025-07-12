import { memo } from 'react';
import '../../../assets/scss/chat/aiMessageRenderer.scss';
import AIMessage from './AIMessage';
import ChainOfThoughtWidget from './chatComponents/ChainOfThoughtWidget';
import AIMessageLoader from './AIMessageLoader';

const AIMessageRenderer = ({
	messageData,
	handleNoteComponentModalOpen,
	handleViewDocument,
	showViewDocument = false,
	isPublicChat = false,
	handleSourcesClick = null,
	messageIndex = null,
	showCitationsButton = true,
	isLastMessage = false,
	sessionId = null,
}) => {
	return (
		<div className="ai-message-renderer">
			{messageData?.contentType === 'loading' ? (
				<AIMessageLoader />
			) : (
				<>
					{(messageData?.processing === 'Deep Search' ||
						messageData?.processing === 'Deep Research' ||
						messageData?.processing === 'normal_search' ||
						messageData?.memory_thinking) && (
						<ChainOfThoughtWidget messageData={messageData} />
					)}
					<AIMessage
						text={messageData?.message}
						messageId={messageData?.messageId}
						customePencilClickFunc={handleNoteComponentModalOpen}
						rating={messageData?.rating}
						citations={messageData?.citations}
						messageData={messageData}
						handleViewDocument={handleViewDocument}
						showViewDocument={showViewDocument}
						isLastMessage={isLastMessage}
						isPublicChat={isPublicChat}
						handleSourcesClick={handleSourcesClick}
						messageIndex={messageIndex}
						showCitationsButton={showCitationsButton}
						sessionId={sessionId}
					/>
				</>
			)}
		</div>
	);
};

export default memo(AIMessageRenderer);
