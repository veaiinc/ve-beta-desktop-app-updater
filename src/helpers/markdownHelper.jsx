import React, { memo, useContext, useEffect, useState } from 'react';
import { default as ReactMarkdown } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
// import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom'; // Adjust if you're using another router
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

const components = {
	pre: ({ children }) => <CustomComponent>{children}</CustomComponent>,
	ol: ({ children, ...props }) => {
		return (
			<ol className="list-decimal list-outside ml-4" {...props}>
				{children}
			</ol>
		);
	},
	li: ({ children, ...props }) => {
		return (
			<li className="py-1" {...props}>
				<CustomComponent>{children}</CustomComponent>
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
				<CustomComponent>{children}</CustomComponent>
			</span>
		);
	},
	a: ({ children, ...props }) => {
		return (
			<Link
				className="text-blue-500 hover:underline"
				target="_blank"
				rel="noreferrer"
				{...props}
			>
				{children}
			</Link>
		);
	},
	h1: ({ children, ...props }) => {
		return (
			<h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
				<CustomComponent>{children}</CustomComponent>
			</h1>
		);
	},
	h2: ({ children, ...props }) => {
		return (
			<h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
				<CustomComponent>{children}</CustomComponent>
			</h2>
		);
	},
	h3: ({ children, ...props }) => {
		return (
			<h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
				<CustomComponent>{children}</CustomComponent>
			</h3>
		);
	},
	h4: ({ children, ...props }) => {
		return (
			<h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
				<CustomComponent>{children}</CustomComponent>
			</h4>
		);
	},
	h5: ({ children, ...props }) => {
		return (
			<h5 className="text-base font-semibold mt-6 mb-2" {...props}>
				<CustomComponent>{children}</CustomComponent>
			</h5>
		);
	},
	h6: ({ children, ...props }) => {
		return (
			<h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
				<CustomComponent>{children}</CustomComponent>
			</h6>
		);
	},
	p: ({ children, ...props }) => {
		return (
			<p className="mb-4" {...props}>
				<CustomComponent>{children}</CustomComponent>
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
	text: ({ children }) => {
		return <CustomComponent>{children}</CustomComponent>;
	},
};

// console.log('isChrome', isChrome);

// const remarkPlugins = [];
const updateTextWithCitations = (text) => {
	const regex = /\[CIT-\d+\]/g;
	const parts = text.split(regex);
	const matches = text.match(regex);

	if (!matches) return <span>{text}</span>;
	console.log(parts);

	return (
		<>
			{parts.map((part, index) => {
				return (
					<React.Fragment key={index}>
						{part}
						{matches[index] && (
							<CitationsTooltip
								key={index}
								citationId={matches[index]?.slice(1, -1)}
							/>
						)}
					</React.Fragment>
				);
			})}
		</>
	);
};

const CustomComponent = ({ children }) => {
	if (typeof children === 'string') {
		return updateTextWithCitations(children);
	} else if (Array.isArray(children)) {
		return (
			<>
				{children.map((child, index) => {
					if (typeof child === 'string') {
						return updateTextWithCitations(child);
					}
					return child;
				})}
			</>
		);
	}
};

const NonMemoizedMarkdown = ({ children }) => {
	return (
		<ReactMarkdown remarkPlugins={[]} components={components}>
			{children}
		</ReactMarkdown>
	);
};

export const Markdown = memo(
	NonMemoizedMarkdown,
	(prevProps, nextProps) => prevProps.children === nextProps.children,
);

export const TypingEffect = ({
	text,
	onComplete,
	customePencilClickFunc = null,
	smoothScrollToBottom,
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
		} else if (onComplete) {
			onComplete();
		}
	}, [currentIndex, text, onComplete]);

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
			<Markdown>{displayedText}</Markdown>

			{currentIndex === text?.length ? (
				<div className="hover-actions-container">
					<div className="icon-container">
						<Tooltip placement="bottom" arrow={false} trigger={'hover'} title={'Like'}>
							<ThumpsUpSvg />
						</Tooltip>
					</div>

					<div className="icon-container">
						<Tooltip
							placement="bottom"
							arrow={false}
							trigger={'hover'}
							title={'Dislike'}
						>
							<ThumpsDownSvg />
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
