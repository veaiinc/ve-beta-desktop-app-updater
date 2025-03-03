import React, { memo, useContext, useEffect, useState, useMemo, useCallback } from 'react';
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

// Move components outside to prevent recreation on every render
const baseComponents = {
	pre: ({ children }) => <>{children}</>,
	ol: ({ children, ...props }) => (
		<ol className="list-decimal list-outside ml-4" {...props}>
			{children}
		</ol>
	),
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
};

// Memoize citation-specific components
const createCitationComponents = (citations) => ({
	span: ({ children, citationId, ...props }) => {
		if (citationId) return <CitationsTooltip citationId={citationId} citations={citations} />;
		return <span {...props}>{children}</span>;
	},
});
const remarkPlugins = [remarkGfm];
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
			rehypePlugins={[rehypeCITPlugin]}
			components={components}
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
		smoothScrollToBottom,
		messageId = null,
		handleRatingClick = null,
		rating = null,
		citations = [],
		messageData,
	}) => {
		const {
			documentPreview: { setNoteContent },
		} = useContext(Context);

		const [isCopiedToClipboard, setIsCopiedToClipboard] = useState(false);

		const handleCopyTextClick = useCallback((text) => {
			navigator?.clipboard?.writeText(text).then(() => {
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
			setNoteContent(text);
		}, [customePencilClickFunc, text, setNoteContent]);

		const handleThumbsUp = useCallback(() => {
			handleRatingClick && handleRatingClick('thumbsUp', messageId);
		}, [handleRatingClick, messageId]);

		const handleThumbsDown = useCallback(() => {
			handleRatingClick && handleRatingClick('thumbsDown', messageId);
		}, [handleRatingClick, messageId]);

		return (
			<div className="typing-effect-container">
				<Markdown citations={citations}>{text?.replace(/\\n/g, '\n')}</Markdown>

				{messageData?.messageId && (
					<div className="hover-actions-container">
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

						<div className="icon-container">
							<Tooltip
								placement="bottom"
								arrow={false}
								trigger={'hover'}
								title={'Audio'}
							>
								<HeadPhoneSvg />
							</Tooltip>
						</div>

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
			prevProps.messageData?.messageId === nextProps.messageData?.messageId
		);
	},
);
