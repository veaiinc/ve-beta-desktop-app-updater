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
	showResponseEditBtn = true,
}) => {
	return (
		<div className="ai-message-renderer">
			{/* Loading Message */}
			{messageData?.contentType === 'loading' ? (
				<AIMessageLoader />
			) : (
				<>
					{messageData?.is_error ? (
						<div className="error-message">Something went wrong. Please try again.</div>
					) : (
						<>
							{/* Chain of Thought */}
							{(messageData?.processing === 'Deep Research' ||
								messageData?.chainOfThought?.length > 0) && (
								<ChainOfThoughtWidget messageData={messageData} />
							)}
							{/* Actual AI response  */}
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
								showResponseEditBtn={showResponseEditBtn}
							/>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default memo(AIMessageRenderer);
