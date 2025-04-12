import React, { memo, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { default as ReactMarkdown } from 'react-markdown';
import '../assets/scss/markdown.scss';
import '../assets/scss/markdownHelper.scss';
import { ReactComponent as PencilSparkleIcon } from '../assets/svg/notes/pencilSparkle.svg';
import { ReactComponent as ThumpsUpSvg } from '../assets/svg/ai_agents/thumps-up.svg';
import { ReactComponent as ThumpsDownSvg } from '../assets/svg/ai_agents/thumps-down.svg';
import { ReactComponent as HeadPhoneSvg } from '../assets/svg/ai_agents/head-phone.svg';
import { ReactComponent as TickSvg } from '../assets/svg/tick.svg';
import { ReactComponent as CopyIcon } from '../assets/svg/ai_agents/copy.svg';
import Context from '../context/context';
import { Tooltip } from 'antd';

import { CitationsTooltip } from '../views/components/modalsV2/chat/CitationsTooltip';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const rehypeCITPlugin = () => {
	return (tree) => {
		const visit = (node) => {
			if (!node || typeof node !== 'object') return;

			if (node?.type === 'text' && node?.value) {
				const regex = /(\[C\d+\])/g;
				const matches = node?.value?.match(regex);
				if (!matches) return;

				// Create a new node instead of modifying in place
				const newNode = {
					type: 'element',
					tagName: 'span',
					properties: node?.properties || {},
					children: node?.value?.split(regex)?.map((part) => {
						if (regex?.test(part)) {
							return {
								type: 'element',
								tagName: 'span',
								properties: { citationId: part?.slice(1, -1) },
								children: [{ type: 'text', value: 'Citation' }],
							};
						}
						return { type: 'text', value: part };
					}),
				};

				Object.assign(node, newNode);
			}

			if (node?.children && Array?.isArray(node?.children)) {
				node?.children?.forEach(visit);
			}
		};

		visit(tree);
	};
};

// Move components outside to prevent recreation on every render
const baseComponents = {
	pre: ({ children }) => <pre className="markdown-pre mb-4 ">{children}</pre>,
	hr: ({ children }) => <hr className="mb-2 " />,
	ol: ({ children, ...props }) => (
		<ol className=" list-outside mb-4 " {...props}>
			{children}
		</ol>
	),
	li: ({ children, ...props }) => {
		return (
			<li className="list-item" {...props}>
				{children}
			</li>
		);
	},
	ul: ({ children, ...props }) => {
		return (
			<ul className=" list-outside mb-4 " {...props}>
				{children}
			</ul>
		);
	},
	strong: ({ children, ...props }) => {
		return (
			<span className="font-semibold text-white common-markdown-font " {...props}>
				{children}
			</span>
		);
	},
	a: ({ children, ...props }) => {
		return (
			<a
				className="text-blue-500 hover:underline common-markdown-font "
				target="_blank"
				rel="noreferrer"
				{...props}
			>
				{children}
			</a>
		);
	},
	h1: ({ children, ...props }) => {
		return (
			<h1 className="text-3xl font-semibold mt-6 mb-4 " {...props}>
				{children}
			</h1>
		);
	},
	h2: ({ children, ...props }) => {
		return (
			<h2 className="text-2xl font-semibold mt-6 mb-4 " {...props}>
				{children}
			</h2>
		);
	},
	h3: ({ children, ...props }) => {
		return (
			<h3 className="text-xl font-semibold mt-6 mb-2 " {...props}>
				{children}
			</h3>
		);
	},
	h4: ({ children, ...props }) => {
		return (
			<h4 className="text-lg font-semibold mt-6 mb-2 " {...props}>
				{children}
			</h4>
		);
	},
	h5: ({ children, ...props }) => {
		return (
			<h5 className="text-base font-semibold mt-6 mb-2 " {...props}>
				{children}
			</h5>
		);
	},
	h6: ({ children, ...props }) => {
		return (
			<h6 className="text-sm font-semibold mt-6 mb-2 " {...props}>
				{children}
			</h6>
		);
	},
	p: ({ children, ...props }) => {
		return (
			<p className="text-white  mb-2 mt-2 common-markdown-font " {...props}>
				{children}
			</p>
		);
	},
	img: ({ children, ...props }) => {
		return (
			<div className="markdown-image-wrapper ">
				<img
					className="w-full h-auto"
					{...props}
					src={props?.src}
					alt="img"
					style={{ maxWidth: '50%', maxHeight: '50%', borderRadius: '4px' }}
				/>
			</div>
		);
	},
	table: ({ children, ...props }) => (
		<div className="table-container my-4 overflow-x-auto ">
			<table className="markdown-table w-full" {...props}>
				{children}
			</table>
		</div>
	),
	thead: ({ children, ...props }) => (
		<thead className="bg-gray-800 " {...props}>
			{children}
		</thead>
	),
	th: ({ children, ...props }) => (
		<th className="px-4 py-2 text-left border border-gray-700 " {...props}>
			{children}
		</th>
	),
	td: ({ children, ...props }) => (
		<td className="px-4 py-2 border border-gray-700 " {...props}>
			{children}
		</td>
	),
	tr: ({ children, ...props }) => (
		<tr className="border-b border-gray-700 hover:bg-gray-800" {...props}>
			{children}
		</tr>
	),
	code({ node, inline, className, children, ...props }) {
		const match = /language-(\w+)/.exec(className || '');
		return !inline && match ? (
			<SyntaxHighlighter style={dracula} language={match[1]} PreTag="div">
				{String(children).replace(/\n$/, '')}
			</SyntaxHighlighter>
		) : (
			<code {...props}>{children}</code>
		);
	},
};

// Memoize citation-specific components
const createCitationComponents = (citations) => ({
	span: ({ children, citationId, ...props }) => {
		if (citationId) return <CitationsTooltip citationId={citationId} citations={citations} />;
		return <span {...props}>{children}</span>;
	},
});
const remarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins = [rehypeKatex, rehypeCITPlugin, rehypeRaw];
const NonMemoizedMarkdown = ({ children, citations }) => {
	// Memoize the combined components object
	const components = useMemo(
		() => ({
			...baseComponents,
			...createCitationComponents(citations),
		}),
		[citations],
	);

	return (
		<ReactMarkdown
			remarkPlugins={remarkPlugins}
			rehypePlugins={rehypePlugins}
			components={components}
			className="markdown-custom-content"
		>
			{children}
		</ReactMarkdown>
	);
};

// Improve memo comparison
export const Markdown = memo(NonMemoizedMarkdown, (prevProps, nextProps) => {
	const citationsEqual =
		(!prevProps.citations && !nextProps.citations) ||
		(prevProps.citations?.length === nextProps.citations?.length &&
			JSON.stringify(prevProps.citations) === JSON.stringify(nextProps.citations));

	return prevProps.children === nextProps.children && citationsEqual;
});

export const TypingEffect = memo(
	({
		text,
		customePencilClickFunc = null,
		messageId = null,
		handleRatingClick = null,
		rating = null,
		citations = [],
		messageData,
		isNewMessage = false,
	}) => {
		const {
			documentPreview: { setNoteContent },
			templates: { updateStateValues },
		} = useContext(Context);
		const [isCopiedToClipboard, setIsCopiedToClipboard] = useState(false);
		const [renderTrigger, setRenderTrigger] = useState(0);

		const chunkSize = 200; // Size of each chunk (200 characters)\
		const textRef = useRef(text); // Store the latest text in a ref

		const chunkRef = useRef(''); // Ref for storing chunk
		const currentIndexRef = useRef(0); // Ref for storing currentIndex
		const timeIntervalRef = useRef(null);
		// useEffect(() => {
		// 	textRef.current = messageData;
		// }, [messageData]);

		// useEffect(() => {
		// 	if (messageData?.messageId) {
		// 		// setChunk(text);
		// 		chunkRef.current = text;
		// 		return;
		// 	}
		// 	setTimeout(() => {
		// 		const interval = setInterval(() => {
		// 			handleChunkRendering();
		// 		}, 500);
		// 		timeIntervalRef.current = interval;
		// 	}, 50);
		// }, []);

		// const handleChunkRendering = () => {
		// 	const currentText = textRef.current?.message;

		// 	if (currentIndexRef.current >= currentText?.length && textRef.current?.messageId) {
		// 		clearInterval(timeIntervalRef.current);
		// 		return (timeIntervalRef.current = null);
		// 	}

		// 	// Slice the current chunk from the text
		// 	let startIndex = currentIndexRef.current;
		// 	let endIndex =
		// 		currentIndexRef.current + chunkSize < currentText?.length
		// 			? currentIndexRef.current + chunkSize
		// 			: currentText?.length;
		// 	let subChunk = currentText?.slice(startIndex, endIndex);

		// 	chunkRef.current += subChunk;
		// 	currentIndexRef.current = endIndex;
		// 	setRenderTrigger((prev) => prev + 1);
		// };

		const handleCopyTextClick = useCallback((text) => {
			const textToBeCopied = text?.replace(/\\\[(.*?)\\\]/g, '$$$1$$')?.replace(/\\n/g, '\n');
			navigator?.clipboard?.writeText(textToBeCopied).then(() => {
				setIsCopiedToClipboard(true);
				setTimeout(() => {
					setIsCopiedToClipboard(false);
				}, 1000);
			});
		}, []);

		const handlePencilClick = useCallback(() => {
			if (customePencilClickFunc) {
				customePencilClickFunc();
			}
			setNoteContent(messageData);
		}, [customePencilClickFunc, text, setNoteContent]);

		const handleThumbsUp = useCallback(() => {
			handleRatingClick && handleRatingClick('thumbsUp', messageId);
		}, [handleRatingClick, messageId]);

		const handleThumbsDown = useCallback(() => {
			handleRatingClick && handleRatingClick('thumbsDown', messageId);
		}, [handleRatingClick, messageId]);

		const handlePromptClick = (prompt) => {
			updateStateValues({ activePromptForChat: prompt });
		};

		return (
			<div className="typing-effect-container">
				<Markdown citations={citations}>
					{/* {newText?.replace(/\\\[(.*?)\\\]/g, '$$$1$$')?.replace(/\\n/g, '\n')} */}
					{/* {chunkRef?.current?.replace(/\\\[(.*?)\\\]/g, '$$$1$$')?.replace(/\\n/g, '\n')} */}
					{text?.replace(/\\\[(.*?)\\\]/g, '$$$1$$')?.replace(/\\n/g, '\n')}
				</Markdown>

				{(messageData?.['follow_up_query'] || [])?.length > 0 && (
					<div className="suggested-prompts">
						<div className="title-text">Suggested Prompts</div>
						{(messageData?.['follow_up_query'] || [])?.map((query) => {
							return (
								<div
									className="prompt-container"
									onClick={() => handlePromptClick(query)}
								>
									<div className="prompt">{query}</div>
								</div>
							);
						})}
					</div>
				)}

				{messageData?.messageId && (
					<div
						className={`hover-actions-container`}
						style={{
							visibility: isNewMessage ? 'visible' : '',
						}}
					>
						<div className="icon-container">
							<Tooltip
								placement="bottom"
								arrow={false}
								trigger={'hover'}
								title={'Like'}
							>
								<ThumpsUpSvg
									fill={rating === 'thumbsUp' ? '#f2f2f3' : 'none'}
									onClick={handleThumbsUp}
								/>
							</Tooltip>
						</div>

						<div className="icon-container">
							<Tooltip
								placement="bottom"
								arrow={false}
								trigger={'hover'}
								title={'Dislike'}
							>
								<ThumpsDownSvg
									fill={rating === 'thumbsDown' ? '#f2f2f3' : 'none'}
									onClick={handleThumbsDown}
								/>
							</Tooltip>
						</div>

						{/* <div className="icon-container">
							<Tooltip
								placement="bottom"
								arrow={false}
								trigger={'hover'}
								title={'Audio'}
							>
								<HeadPhoneSvg />
							</Tooltip>
						</div> */}

						<div className="icon-container">
							<Tooltip
								placement="bottom"
								arrow={false}
								trigger={'hover'}
								title={'Edit'}
							>
								<PencilSparkleIcon onClick={handlePencilClick} />
							</Tooltip>
						</div>

						<div className="icon-container">
							<Tooltip
								placement="bottom"
								arrow={false}
								trigger={'hover'}
								title={isCopiedToClipboard ? 'Copied' : 'Copy'}
							>
								{isCopiedToClipboard ? (
									<TickSvg />
								) : (
									<CopyIcon onClick={() => handleCopyTextClick(text)} />
								)}
							</Tooltip>
						</div>
					</div>
				)}
			</div>
		);
	},
	(prevProps, nextProps) => {
		// Custom comparison function for TypingEffect
		return (
			prevProps.text === nextProps.text &&
			prevProps.messageId === nextProps.messageId &&
			prevProps.rating === nextProps.rating &&
			JSON.stringify(prevProps.citations) === JSON.stringify(nextProps.citations) &&
			prevProps.messageData?.messageId === nextProps.messageData?.messageId &&
			prevProps.isNewMessage === nextProps.isNewMessage
		);
	},
);

export const UserMessageRenderer = memo(({ messageData, activeUserMessageIndex }) => {
	const {
		templates: { updateStateValues },
	} = useContext(Context);
	const textRef = useRef(null);

	const [info, setinfo] = useState({
		isCopiedToClipboard: false,
		editUserQuery: false,
		userQuery: messageData?.message,
		isExpanded: false,
		isOverflowing: false,
	});

	useEffect(() => {
		adjustFontSize();
	}, [messageData?.message]);

	const checkOverflow = (element) => {
		return element?.scrollHeight > element?.clientHeight;
	};

	const adjustFontSize = () => {
		if (textRef?.current) {
			// Set initial font size
			textRef.current.style.fontSize = '1.5rem';
			textRef.current.style.lineHeight = '1.75rem';

			// Check again for overflow
			if (checkOverflow(textRef?.current)) {
				// If still overflowing, revert to 0.875rem
				textRef.current.style.fontSize = '0.875rem';
				textRef.current.style.lineHeight = '1.25rem';

				if (checkOverflow(textRef?.current)) {
					setinfo((prev) => ({ ...prev, isOverflowing: true }));
				}
			}
		}
	};

	const handleCopyTextClick = useCallback(
		(text) => {
			const textToBeCopied = text?.replace(/\\\[(.*?)\\\]/g, '$$$1$$')?.replace(/\\n/g, '\n');
			navigator?.clipboard?.writeText(textToBeCopied).then(() => {
				setinfo((prev) => ({ ...prev, isCopiedToClipboard: true }));
				setTimeout(() => {
					setinfo((prev) => ({ ...prev, isCopiedToClipboard: false }));
				}, 1000);
			});
		},
		[info],
	);

	const handleEditUserQueryToggle = useCallback(() => {
		setinfo((prev) => ({
			...prev,
			editUserQuery: !prev.editUserQuery,
			userQuery: messageData?.message || '',
		}));
	}, [info, messageData]);

	const handleSendUserEditedQuery = useCallback(
		(e, click = null) => {
			if (e?.key === 'Enter' || click) {
				if (e?.shiftKey) {
					return;
				}
				updateStateValues({ userEditedQuery: info?.userQuery });
				setinfo((prev) => ({
					...prev,
					editUserQuery: !prev.editUserQuery,
					userQuery: messageData?.message || '',
				}));
			}
		},
		[info, messageData],
	);

	const handleUserQueryChange = useCallback(
		(e) => {
			setinfo((prev) => ({ ...prev, userQuery: e.target.value }));
		},
		[info],
	);

	const toggleExpand = useCallback(() => {
		setinfo((prev) => ({ ...prev, isExpanded: !prev.isExpanded }));
	}, []);

	return (
		<div className="user-message-renderer-wrapper">
			{!info?.editUserQuery ? (
				<div>
					<div
						style={{
							opacity: activeUserMessageIndex ? 1 : 0.6,
							maxHeight: info?.isExpanded
								? `${textRef.current?.scrollHeight}px`
								: '147px',
						}}
						className="user-message-renderer-container"
						ref={textRef}
					>
						{(messageData?.message || '').split('\n').map((line, index) => (
							<span key={index}>
								{line}
								{index < messageData?.message.split('\n').length - 1 && <br />}
							</span>
						))}
					</div>
					{info?.isOverflowing && (
						<div className="expand-btn">
							<div className="btn-text" onClick={toggleExpand}>
								{info?.isExpanded ? 'Show less' : 'Show more'}
							</div>
						</div>
					)}
				</div>
			) : (
				<div className="user-edit-query-input-box-container">
					<textarea
						value={info?.userQuery}
						onChange={handleUserQueryChange}
						onKeyDown={handleSendUserEditedQuery}
					/>
					<div className="user-editQuery-actionBtnContainer">
						<div className="cancelBtn" onClick={handleEditUserQueryToggle}>
							Cancel
						</div>
						<div
							className="sendBtn"
							onClick={() => handleSendUserEditedQuery(null, 'click')}
						>
							Send
						</div>
					</div>
				</div>
			)}

			{!info?.editUserQuery ? (
				<div className="hover-actions-container">
					<div className="icon-container">
						<Tooltip placement="bottom" arrow={false} trigger={'hover'} title={'Edit'}>
							<PencilSparkleIcon onClick={handleEditUserQueryToggle} />
						</Tooltip>
					</div>

					<div className="icon-container">
						<Tooltip placement="bottom" arrow={false} trigger={'hover'} title={'Copy'}>
							{info?.isCopiedToClipboard ? (
								<TickSvg />
							) : (
								<CopyIcon
									onClick={() => handleCopyTextClick(messageData?.message)}
								/>
							)}
						</Tooltip>
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
});
