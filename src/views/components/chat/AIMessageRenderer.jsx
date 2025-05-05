import { memo, useContext, useCallback, useState, useEffect } from 'react';
import '../../../assets/scss/chat/aiMessageRenderer.scss';
import { ReactComponent as Logo } from '../../../assets/svg/windmill.svg';
import { ReactComponent as Logo2 } from '../../../assets/svg/windmill2.svg';
import Context from '../../../context/context';
import { ReactComponent as LinkIcon } from '../../../assets/svg/ai_agents/link.svg';
import DeepSearchChainOfThought from './chatComponents/DeepSearchChainOfThought';
import DeepResearchChainOfThought from './chatComponents/DeepResearchChainOfThought';
import { getFaviconUrl, getWebsiteName } from '../../../helpers';
import { ReactComponent as ArrowRightIcon } from '../../../assets/svg/ai_agents/ArrowLineUpRight.svg';
import AIMessage from './AIMessage';
const AIMessageRenderer = ({
	messageData,
	handleNoteComponentModalOpen,
	handleRatingClick,
	tabsRefs,
	index,
	handleSendWebsocketMessage,
	toggleLatestStreamMessage,
	handleViewDocument,
	isPublicChat = false,
}) => {
	const {
		templates: { globalChatMessages },
	} = useContext(Context);
	const [info, setInfo] = useState({
		activeTab: 'response',
	});

	useEffect(() => {
		if (index === globalChatMessages?.length - 1) {
			if (messageData?.message?.length > 0 || messageData?.deepSearch?.cot?.length === 0) {
				if (info?.activeTab !== 'response') {
					setInfo((prev) => ({
						...prev,
						activeTab: 'response',
					}));
				}
			} else {
				if (info?.activeTab !== 'cot') {
					setInfo((prev) => ({
						...prev,
						activeTab: 'cot',
					}));
				}
			}
		}
	}, [globalChatMessages]);

	return (
		<div className="ai-message-renderer">
			<div
				className={`tabs-wrapper`}
				ref={(el) => {
					if (el) {
						tabsRefs.current[messageData?.messageId] = el;
					}
				}}
			>
				<div className="user-message-wrapper">
					{globalChatMessages[index - 1]?.type?.toLowerCase() === 'user' && (
						<div className="user-message-content">
							{globalChatMessages[index - 1]?.message}
						</div>
					)}
				</div>

				<div className="tab-buttons">
					<div
						className={`tab-btn ${info?.activeTab === 'response' ? 'active' : ''}`}
						onClick={() =>
							setInfo((prev) => ({
								...prev,
								activeTab: 'response',
							}))
						}
					>
						{messageData?.stream_end ? (
							<Logo2 className="" width={'24px'} height={'24px'} />
						) : (
							<Logo className="" width={'24px'} height={'24px'} />
						)}
						{messageData?.processing || 'Answer'}
					</div>
					{(messageData?.deepSearch?.cot?.length > 0 ||
						messageData?.deepResearch?.cot?.length > 0) && (
						<div
							className={`tab-btn ${info?.activeTab === 'cot' ? 'active' : ''}`}
							onClick={() =>
								setInfo((prev) => ({
									...prev,
									activeTab: 'cot',
								}))
							}
						>
							Chain of Thought
							<span className="citation-badge">
								{messageData?.deepSearch?.cot?.length ||
									messageData?.deepResearch?.cot?.length ||
									0}
							</span>
						</div>
					)}
					{messageData?.citations && messageData?.citations?.length > 0 && (
						<div
							className={`tab-btn ${info?.activeTab === 'source' ? 'active' : ''}`}
							onClick={() =>
								setInfo((prev) => ({
									...prev,
									activeTab: 'source',
								}))
							}
						>
							Sources
							<span className="citation-badge">{messageData?.citations?.length}</span>
						</div>
					)}
				</div>
			</div>
			{info?.activeTab == 'response' ? (
				<AIMessage
					text={messageData?.message}
					messageId={messageData?.messageId}
					customePencilClickFunc={handleNoteComponentModalOpen}
					handleRatingClick={handleRatingClick}
					rating={messageData?.rating}
					citations={messageData?.citations}
					messageData={messageData}
					isNewMessage={index === globalChatMessages?.length - 1}
					handleSendWebsocketMessage={handleSendWebsocketMessage}
					latestStreamMesage={info?.latestStreamMesage}
					lastQuery={info?.lastQuery}
					toggleLatestStreamMessage={toggleLatestStreamMessage}
					handleViewDocument={handleViewDocument}
					showViewDocument={info?.showViewDocument}
					isLastMessage={index === globalChatMessages?.length - 1}
					isPublicChat={isPublicChat}
				/>
			) : info?.activeTab === 'cot' ? (
				<div className="div">
					{messageData?.deepResearch && (
						<DeepResearchChainOfThought data={messageData?.deepResearch} />
					)}
					{messageData?.deepSearch && (
						<DeepSearchChainOfThought
							data={messageData?.deepSearch}
							stream_end={messageData?.stream_end}
						/>
					)}
				</div>
			) : (
				<div className="source-content">
					{messageData?.citations && messageData?.citations.length > 0
						? messageData?.citations.map((citation, idx) => (
								<div
									key={citation?.id || idx}
									className="citation-item"
									onClick={() => window?.open(citation?.name, '_blank')}
								>
									<div className="citation-header">
										<div className="citation-icon">
											{getFaviconUrl(citation.name) ? (
												<img
													src={getFaviconUrl(citation.name)}
													alt="favicon"
													className="favicon-image"
												/>
											) : (
												<div className="company-icon">
													{getWebsiteName(citation?.name)?.charAt(0)}
												</div>
											)}
										</div>
										<div className="citation-details">
											<div className="website-name">
												{getWebsiteName(citation?.name)}
											</div>
											<div className="citation-url">
												<LinkIcon className="link-icon" />
												{citation?.name}
											</div>
											<div className="citation-title">
												{citation?.snippet}
											</div>
										</div>
									</div>
									<ArrowRightIcon className="arrow-icon" />
								</div>
						  ))
						: null}
				</div>
			)}
		</div>
	);
};

export default memo(AIMessageRenderer);
