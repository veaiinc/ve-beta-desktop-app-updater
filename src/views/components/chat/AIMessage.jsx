import { memo, useContext, useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import Context from '../../../context/context';
import { Markdown } from '../../../helpers/markdownHelper';
import { Tooltip } from 'antd';
import { ReactComponent as PencilSparkleIcon } from '../../../assets/svg/notes/pencilSparkle.svg';
import { ReactComponent as GraduationCapSvg } from '../../../assets/svg/graduationCap.svg';
import { ReactComponent as TickSvg } from '../../../assets/svg/tick.svg';
import { ReactComponent as CopyIcon } from '../../../assets/svg/ai_agents/copy.svg';
import { ReactComponent as ViewDocumentIcon } from '../../../assets/svg/chat/viewDocument.svg';
import '../../../assets/scss/chat/aiMessage.scss';
import PromptPopup from '../homePage/PromptPopup';
import { fileTypeIcons, getFaviconUrl, getWebsiteName } from '../../../helpers';
import { ReactComponent as VeLogoSvg } from '../../../assets/svg/veLogo.svg';
import TextSelector from './chatComponents/TextSelector';
import { copyToClipboard } from '../../../helpers/clipboardHelper';

const FormWidget = lazy(() => import('./FormWidget'));
const BrowserChainOfThought = lazy(() => import('./chatComponents/BrowserChainOfThought'));
const IntermediateSteps = lazy(() => import('./chatComponents/IntermediateSteps'));
const AISuggestionsReportAiComponent = lazy(() =>
	import('./chatComponents/AiSuggestionsReportAiComponent'),
);
const ClarifyWidget = lazy(() => import('./chatWidgets/ClarifyWidget'));
const UnintegratedAgentApps = lazy(() => import('./chatComponents/UnintegratedAgentApps'));

const tooltipStyles = {
	body: { color: 'var(--primary-font)' },
};

const builderAgentMapper = {
	formBuilderAgent: true,
	invoiceBuilderAgent: true,
	contractBuilderAgent: true,
};
const pencilIconStyles = {
	width: '20px',
	height: '20px',
	position: 'relative',
	top: '-2px',
};

const replyElementInitialState = { visible: false, styles: { top: 0, left: 0 }, selectedText: '' };
const AIMessage = ({
	text,
	customePencilClickFunc = null,
	citations = [],
	messageData,
	isLastMessage = false,
	showCanvas = true,
	handleViewDocument = null,
	showViewDocument = false,
	isNoteCanvas = false,
	handleSourcesClick = null,
	messageIndex = null,
	showCitationsButton = true,
	sessionId = null,
	showResponseEditBtn = true,
}) => {
	const {
		documentPreview: { setNoteContent },
		templates: { updateStateValues, aiMessagesInfo, globalChatMessages },
	} = useContext(Context);

	const markdownContainerRef = useRef(null);

	const [info, setInfo] = useState({
		isCopiedToClipboard: false,
		feedbackPopupOpen: false,
		liked: null,
		usedAgents: [],
		replyElementStyles: replyElementInitialState,
	});

	const isCancelled = messageData?.status === 'cancelled';
	const primaryText = typeof text === 'string' && text?.length >= 0 ? text : '';
	const hasText = (primaryText || '')?.trim()?.length > 0;
	const isSkipped = !hasText && isCancelled;
	const effectiveStreamEnd = isSkipped ? true : messageData?.stream_end || false;
	const displayText = isSkipped ? 'Answer skipped' : primaryText;

	useEffect(() => {
		if (markdownContainerRef.current) {
			markdownContainerRef.current.addEventListener('mouseup', handleMouseUp);
		}

		return () => {
			if (markdownContainerRef.current) {
				markdownContainerRef.current.removeEventListener('mouseup', handleMouseUp);
			}
		};
	}, [text]);

	useEffect(() => {
		document.addEventListener('mousedown', handleMouseDown);
		return () => {
			document.removeEventListener('mousedown', handleMouseDown);
		};
	}, []);

	useEffect(() => {
		if (messageData?.used_agents) {
			const usedAgents = messageData?.used_agents?.filter(
				(agent) => builderAgentMapper[agent],
			);
			setInfo((prev) => ({ ...prev, usedAgents: usedAgents }));
		}
	}, [messageData?.used_agents]);

	const handleUpdateId = (workflowTemplateId, moduleTemplateId) => {
		updateStateValues({
			documentPreviewIds: {
				workflowTemplateId,
				moduleTemplateId,
			},
		});
	};

	const handleCopyTextClick = useCallback(async (text) => {
		const textToBeCopied = text?.replace(/\[C\d+\]/g, '');

		try {
			const success = await copyToClipboard(textToBeCopied, {
				onSuccess: () => {
					setInfo((prev) => ({ ...prev, isCopiedToClipboard: true }));
					setTimeout(() => {
						setInfo((prev) => ({ ...prev, isCopiedToClipboard: false }));
					}, 1000);
				},
				onError: (error) => {
					console.error('Failed to copy text:', error);
					// Show error feedback to user
					setInfo((prev) => ({ ...prev, isCopiedToClipboard: false }));
				},
			});

			if (!success) {
				console.error('Copy operation failed');
				setInfo((prev) => ({ ...prev, isCopiedToClipboard: false }));
			}
		} catch (error) {
			console.error('Copy operation failed:', error);
			setInfo((prev) => ({ ...prev, isCopiedToClipboard: false }));
		}
	}, []);

	const handlePencilClick = useCallback(() => {
		if (customePencilClickFunc) {
			customePencilClickFunc();
		}
		setNoteContent(messageData);
	}, [customePencilClickFunc, setNoteContent, messageData]);

	const handleTeachMeClick = useCallback(() => {
		setInfo((prev) => ({ ...prev, feedbackPopupOpen: true }));
	}, []);

	const handleMouseDown = useCallback(() => {
		setInfo((prev) => {
			const { visible, styles, selectedText } = prev?.replyElementStyles || {};

			if (
				prev?.replyElementStyles &&
				(visible || styles?.top !== 0 || styles?.left !== 0 || selectedText)
			) {
				return {
					...prev,
					replyElementStyles: replyElementInitialState,
				};
			}
			return prev;
		});
	}, []);

	const handleMouseUp = useCallback(() => {
		setTimeout(() => {
			const selection = window?.getSelection();

			if (selection && !selection?.isCollapsed) {
				const range = selection?.getRangeAt(0);
				const rects = range?.getClientRects();
				const selectedText = selection?.toString();

				if (rects?.length > 0) {
					const firstRect = rects[0];
					const x = firstRect?.left + window?.scrollX;
					const y = firstRect?.top + window?.scrollY;

					const containerRect = markdownContainerRef.current?.getBoundingClientRect();

					// Calculate x and y relative to the infinite scroll container
					const relativeX = x - (containerRect?.left || 0);
					const relativeY = y - 44 - (containerRect?.top || 0);

					setInfo((prev) => ({
						...prev,
						replyElementStyles: {
							selectedText,
							visible: true,
							styles: { top: relativeY, left: relativeX },
						},
					}));
				}
			} else {
				setInfo((prev) => {
					const { visible, styles, selectedText } = prev?.replyElementStyles || {};
					if (
						visible === false &&
						styles?.top === 0 &&
						styles?.left === 0 &&
						!selectedText
					)
						return prev;
					return {
						...prev,
						replyElementStyles: replyElementInitialState,
					};
				});
			}
		}, 0);
	}, []);

	const handlePromptClick = (prompt) => {
		if (prompt && sessionId) {
			updateStateValues({
				activePromptForChat: {
					prompt,
					sessionId,
				},
			});
		}
	};

	const handleFeedbackUpdateSuccess = (feedbackReq = {}) => {
		// Clone the existing globalChatMessages safely
		const newGlobalChatMessages = { ...(globalChatMessages || {}) };

		// Ensure the session exists before modifying
		if (newGlobalChatMessages[sessionId]?.messages) {
			newGlobalChatMessages[sessionId].messages = newGlobalChatMessages[
				sessionId
			].messages.map((message) => {
				if (message?.messageId === messageData?.messageId) {
					return {
						...message,
						...feedbackReq,
					};
				}
				return message;
			});

			// Apply updated state
			updateStateValues({
				globalChatMessages: newGlobalChatMessages,
			});
		}
	};

	const handleReplyElementClose = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			replyElementStyles: replyElementInitialState,
		}));
	}, []);

	return (
		<div className="ai-message-container">
			<TextSelector
				styles={info?.replyElementStyles?.styles}
				text={info?.replyElementStyles?.selectedText}
				visible={info?.replyElementStyles?.visible}
				handleReplyElementClose={handleReplyElementClose}
			/>

			{info?.usedAgents?.length > 0 &&
				messageData?.workflow_template_id &&
				messageData?.module_template_id &&
				(showCanvas && !isNoteCanvas ? (
					info?.usedAgents?.map((agent, index) => (
						<Suspense fallback={''}>
							<FormWidget
								workflowTemplateId={messageData?.workflow_template_id}
								moduleTemplateId={messageData?.module_template_id}
								handleViewDocument={handleViewDocument}
								showViewDocument={showViewDocument}
								isLastMessage={isLastMessage}
								messageData={messageData}
								agent={agent}
								key={index}
								sessionId={sessionId}
							/>
						</Suspense>
					))
				) : (
					<div
						className="view-document-container"
						onClick={() =>
							handleUpdateId(
								messageData?.workflow_template_id,
								messageData?.module_template_id,
							)
						}
					>
						<ViewDocumentIcon />
						<p>View Document</p>
					</div>
				))}

			{messageData?.browserChainOfThought && !isSkipped ? (
				<Suspense fallback={''}>
					<BrowserChainOfThought chainOfThought={messageData?.browserChainOfThought} />
				</Suspense>
			) : (
				''
			)}

			{messageData?.tool_invocations?.length > 0 && !isSkipped ? (
				<Suspense fallback={''}>
					<IntermediateSteps
						steps={messageData?.tool_invocations}
						isStreaming={effectiveStreamEnd === false}
					/>
				</Suspense>
			) : (
				''
			)}

			{messageData?.moduleType === 'ai_suggestion_report' ? (
				<Suspense fallback={''}>
					<AISuggestionsReportAiComponent data={messageData?.data} />
				</Suspense>
			) : messageData?.widget_type === 'clarifyWidget' ? (
				<Suspense fallback={''}>
					<ClarifyWidget data={messageData?.data} sessionId={sessionId} />
				</Suspense>
			) : (
				<div className="markdown-container" ref={markdownContainerRef}>
					{/* Dedicated UI for skipped answer */}
					{isSkipped ? (
						<div className="answer-skipped">Answer skipped</div>
					) : (
						/* here animate key's initial value only used, next updated animate value will not reach markdown component */
						<Markdown
							citations={citations}
							animate={!(messageData?.stream_end ?? false)}
						>
							{displayText}
						</Markdown>
					)}
				</div>
			)}

			{messageData?.unintegrated_apps?.length > 0 ? (
				<Suspense fallback={''}>
					<UnintegratedAgentApps apps={messageData?.unintegrated_apps} />
				</Suspense>
			) : (
				''
			)}

			<div
				className="hover-actions-container"
				style={{
					...(isLastMessage && { opacity: 1 }),
					display: messageData?.stream_end ? 'flex' : 'none',
				}}
			>
				<div className="left-container">
					{text?.length > 0 && (
						<>
							<div className="icon-container">
								<Tooltip
									placement="bottom"
									arrow={false}
									trigger={'hover'}
									title={
										<div className="hover-icons-tooltip">
											{info?.isCopiedToClipboard ? 'Copied' : 'Copy'}
										</div>
									}
									color="transparent"
									styles={tooltipStyles}
								>
									{info?.isCopiedToClipboard ? (
										<TickSvg />
									) : (
										<CopyIcon onClick={() => handleCopyTextClick(text)} />
									)}
								</Tooltip>
							</div>

							{showResponseEditBtn && (
								<div className="icon-container">
									<Tooltip
										placement="bottom"
										arrow={false}
										trigger={'hover'}
										color="transparent"
										title={<div className="hover-icons-tooltip">Edit</div>}
										styles={tooltipStyles}
									>
										<PencilSparkleIcon
											style={pencilIconStyles}
											onClick={handlePencilClick}
										/>
									</Tooltip>
								</div>
							)}
						</>
					)}

					{/* <Tooltip
							placement="bottom"
							arrow={false}
							trigger={'hover'}
							color="transparent"
							title={<div className="hover-icons-tooltip">Feedback</div>}
							styles={tooltipStyles}
						>
							<div className="teach-me-container" onClick={handleTeachMeClick}>
								<GraduationCapSvg
									className="teach-me-icon"
									style={{ width: '19px', height: '19px' }}
								/>
							</div>
						</Tooltip> */}

					{messageData?.citations?.length > 0 && showCitationsButton && (
						<div
							className="ai-message-sources-container"
							onClick={() => handleSourcesClick?.(messageIndex)}
						>
							<div className="imgs-container">
								{messageData?.citations?.slice(0, 3)?.map((citation, index) => (
									<div className="ai-message-icon" key={index}>
										{citation?.type === 'url' ? (
											getFaviconUrl(citation?.name) ? (
												<img
													src={getFaviconUrl(citation?.name)}
													alt="favicon"
													className="ai-message-favicon-image"
												/>
											) : (
												<div className="ai-message-source-icon">
													{getWebsiteName(citation?.name)?.charAt(0)}
												</div>
											)
										) : (
											<div className="ai-message-source-icon">
												{citation?.type === 's3_key'
													? fileTypeIcons[
															citation?.name?.match(/\.(\w+)$/)?.[1]
													  ] || <VeLogoSvg />
													: fileTypeIcons[citation?.type] || (
															<VeLogoSvg />
													  )}
											</div>
										)}
									</div>
								))}
							</div>
							<div className="source-text-container">Sources</div>
						</div>
					)}
				</div>
			</div>

			{/* {(aiMessagesInfo?.[messageData?.messageId]?.followUpQuery?.length > 0 ||
				((messageData?.['follow_up_query'] || [])?.length > 0 &&
					typeof messageData?.['follow_up_query'] === 'object')) && (
				<div className="chat-suggestions-container">
					{(aiMessagesInfo?.[messageData?.messageId]?.followUpQuery?.length > 0 ||
						(messageData?.['follow_up_query'] || [])?.length > 0) && (
						<div className="suggested-prompts">
							<div className="title-text">Suggested Prompts</div>
							<div className="prompts-container">
								{(
									aiMessagesInfo?.[messageData?.messageId]?.followUpQuery ||
									messageData?.['follow_up_query'] ||
									[]
								)?.map((query, index) => (
									<div
										className="prompt-container"
										key={index}
										onClick={() => handlePromptClick(query?.action_query)}
									>
										<PlusSvg
											style={{ width: '18px', height: '18px', flexShrink: 0 }}
										/>
										<div className="prompt">{query?.display_query || ''}</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)} */}

			<PromptPopup
				messageId={messageData?.messageId}
				liked={messageData?.rating}
				open={info?.feedbackPopupOpen}
				feedbackMessage={messageData?.userRemarks}
				feedbackPopupOpen={info?.feedbackPopupOpen}
				selectedFeedback={messageData?.userFeedbackReasons}
				handleFeedbackUpdateSuccess={handleFeedbackUpdateSuccess}
				isTrained={
					messageData?.rating ||
					messageData?.userRemarks ||
					messageData?.userFeedbackReasons?.length
				}
				closeModal={() => setInfo((prev) => ({ ...prev, feedbackPopupOpen: false }))}
			/>
		</div>
	);
};

export default memo(AIMessage, (prevProps, nextProps) => {
	return (
		prevProps.text === nextProps.text &&
		prevProps.messageId === nextProps.messageId &&
		prevProps.rating === nextProps.rating &&
		JSON.stringify(prevProps.citations) === JSON.stringify(nextProps.citations) &&
		prevProps.messageData?.messageId === nextProps.messageData?.messageId &&
		JSON.stringify(prevProps.messageData?.tool_invocations) ===
			JSON.stringify(nextProps.messageData?.tool_invocations) &&
		prevProps.messageData?.stream_end === nextProps.messageData?.stream_end &&
		prevProps.isLastMessage === nextProps.isLastMessage &&
		prevProps.handleSourcesClick === nextProps.handleSourcesClick &&
		prevProps.messageIndex === nextProps.messageIndex &&
		prevProps.showCitationsButton === nextProps.showCitationsButton &&
		prevProps.sessionId === nextProps.sessionId &&
		prevProps.showResponseEditBtn === nextProps.showResponseEditBtn
	);
});
