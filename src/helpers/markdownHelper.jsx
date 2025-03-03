import React, { memo, useContext, useEffect, useState, useMemo } from 'react';
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

const rehypeCITPlugin = () => {
	return (tree) => {
		const visit = (node) => {
			if (!node || typeof node !== 'object') return;

			if (node?.type === 'text' && node?.value) {
				const regex = /(\[C\d+\])/g;
				const matches = node?.value?.match(regex);
				if (!matches) return;

				// Transform the current node in place
				Object.assign(node, {
					type: 'element',
					tagName: 'span',
					properties: node?.properties || {},
					children: node?.value
						?.split(regex)
						?.filter((part) => part !== '')
						?.map((part) => {
							const match = part.match(/\[C\d+\]/);
							if (match) {
								return {
									type: 'element',
									tagName: 'span',
									properties: { citationId: match[0]?.slice(1, -1) },
									children: [{ type: 'text', value: 'Citation' }],
								};
							}
							return { type: 'text', value: part };
						}),
				});
			}

			// Recursively visit children
			if (node?.children && Array.isArray(node?.children)) {
				node.children.forEach(visit);
			}
		};

		visit(tree);
	};
};

const NonMemoizedMarkdown = ({ children, citations }) => {
	const components = useMemo(() => {
		return {
			pre: ({ children }) => <>{children}</>,
			ol: ({ children, ...props }) => {
				return (
					<ol className="list-decimal list-outside ml-8" {...props}>
						{children}
					</ol>
				);
			},
			li: ({ children, ...props }) => {
				return (
					<li className="py-1" {...props}>
						{children}
					</li>
				);
			},
			ul: ({ children, ...props }) => {
				return (
					<ul className="list-decimal list-outside ml-4" {...props}>
						{children}
					</ul>
				);
			},
			strong: ({ children, ...props }) => {
				return (
					<span className="font-semibold" {...props}>
						{children}
					</span>
				);
			},
			a: ({ children, ...props }) => {
				return (
					<a
						className="text-blue-500 hover:underline"
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
					<h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
						{children}
					</h1>
				);
			},
			h2: ({ children, ...props }) => {
				return (
					<h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
						{children}
					</h2>
				);
			},
			h3: ({ children, ...props }) => {
				return (
					<h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
						{children}
					</h3>
				);
			},
			h4: ({ children, ...props }) => {
				return (
					<h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
						{children}
					</h4>
				);
			},
			h5: ({ children, ...props }) => {
				return (
					<h5 className="text-base font-semibold mt-6 mb-2" {...props}>
						{children}
					</h5>
				);
			},
			h6: ({ children, ...props }) => {
				return (
					<h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
						{children}
					</h6>
				);
			},
			p: ({ children, ...props }) => {
				return (
					<p className="text-white" {...props}>
						{children}
					</p>
				);
			},
			img: ({ children, ...props }) => {
				return (
					<div className="markdown-image-wrapper">
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
			span: ({ children, citationId, ...props }) => {
				if (citationId)
					return <CitationsTooltip citationId={citationId} citations={citations} />;
				return <span {...props}>{children}</span>;
			},
		};
	}, [citations]);

	return (
		<ReactMarkdown remarkPlugins={[]} rehypePlugins={[rehypeCITPlugin]} components={components}>
			{children}
		</ReactMarkdown>
	);
};

export const Markdown = memo(
	NonMemoizedMarkdown,
	(prevProps, nextProps) =>
		prevProps.children === nextProps.children && prevProps.citations === nextProps.citations,
);

export const TypingEffect = ({
	text,
	onComplete = null,
	customePencilClickFunc = null,
	smoothScrollToBottom,
	messageId = null,
	handleRatingClick = null,
	showTypingEffect = false,
	rating = null,
	citations = [],
}) => {
	const {
		documentPreview: { setNoteContent },
	} = useContext(Context);

	const [displayedText, setDisplayedText] = useState('');
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isCopiedToClipboard, setIsCopiedToClipboard] = useState(false);

	useEffect(() => {
		if (currentIndex < text?.length) {
			const timeout = setTimeout(() => {
				setDisplayedText((prev) => prev + text[currentIndex]);
				setCurrentIndex((prev) => prev + 1);
				if (smoothScrollToBottom) {
					smoothScrollToBottom();
				}
			}, 5); // Adjust speed as needed

			return () => clearTimeout(timeout);
		} else if (onComplete && showTypingEffect) {
			onComplete();
		}
	}, [currentIndex, text, onComplete]);

	useEffect(() => {
		if (!showTypingEffect) {
			setCurrentIndex(text?.length);
			setDisplayedText(text);
		}
	}, [showTypingEffect]);

	const handleCopyTextClick = (text) => {
		navigator?.clipboard?.writeText(text).then(() => {
			setIsCopiedToClipboard(true);
			setTimeout(() => {
				setIsCopiedToClipboard(false);
			}, 1000);
		});
	};

	return (
		<div className="typing-effect-container">
			{showTypingEffect ? (
				<Markdown>{displayedText?.replace(/\\n/g, '\n')}</Markdown>
			) : (
				<Markdown citations={citations}>{text?.replace(/\\n/g, '\n')}</Markdown>
			)}

			{currentIndex === text?.length ? (
				<div className="hover-actions-container">
					<div className="icon-container">
						<Tooltip placement="bottom" arrow={false} trigger={'hover'} title={'Like'}>
							<ThumpsUpSvg
								fill={rating === 'thumbsUp' ? '#f2f2f3' : 'none'}
								onClick={() =>
									handleRatingClick && handleRatingClick('thumbsUp', messageId)
								}
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
								onClick={() =>
									handleRatingClick && handleRatingClick('thumbsDown', messageId)
								}
							/>
						</Tooltip>
					</div>

					<div className="icon-container">
						<Tooltip placement="bottom" arrow={false} trigger={'hover'} title={'Audio'}>
							<HeadPhoneSvg />
						</Tooltip>
					</div>

					<div className="icon-container">
						<Tooltip placement="bottom" arrow={false} trigger={'hover'} title={'Edit'}>
							<PencilSparkleIcon
								onClick={() => {
									if (customePencilClickFunc) {
										customePencilClickFunc();
									}
									setNoteContent(text);
								}}
							/>
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
								<CopyIcon
									onClick={() => {
										handleCopyTextClick(text);
									}}
								/>
							)}
						</Tooltip>
					</div>

					{/* <CopyIcon
						onClick={() => {
							handleCopyTextClick(text);
						}}
					/> */}
				</div>
			) : (
				''
			)}
		</div>
	);
};
