import { memo, useContext, useCallback, useState, useEffect } from 'react';
import '../../../assets/scss/chat/aiMessageRenderer.scss';
import { ReactComponent as Logo } from '../../../assets/svg/windmill.svg';
import { ReactComponent as Logo2 } from '../../../assets/svg/windmill2.svg';
import Context from '../../../context/context';
import { ReactComponent as LinkIcon } from '../../../assets/svg/ai_agents/link.svg';
import DeepSearchChainOfThought from './chatComponents/DeepSearchChainOfThought';
import DeepResearchChainOfThought from './chatComponents/DeepResearchChainOfThought';
import {
	getFaviconUrl,
	getWebsiteName,
	fileTypeIcons,
	redirectTo,
	redirectTypeMapper,
} from '../../../helpers';
import { ReactComponent as ArrowRightIcon } from '../../../assets/svg/ai_agents/ArrowLineUpRight.svg';
import AIMessage from './AIMessage';
import CombinedChainOfThought from './chatComponents/CombinedChainOfThought';
import ChainOfThoughtWidget from './chatComponents/ChainOfThoughtWidget';
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
}) => {
	return (
		<div className="ai-message-renderer">
			<>
				{(messageData?.processing === 'Deep Search' ||
					messageData?.processing === 'Deep Research') && (
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
				/>
			</>
		</div>
	);
};

export default memo(AIMessageRenderer);
