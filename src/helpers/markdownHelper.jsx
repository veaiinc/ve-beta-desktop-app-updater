import React, { memo, useContext, useEffect, useState } from 'react';
import { default as ReactMarkdown } from 'react-markdown';
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
const components = {
	pre: ({ children }) => <>{children}</>,
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
	// p: ({ children, ...props }) => {
	// 	return (
	// 		<h1 className="mt-6 mb-2" {...props}>
	// 			{children}
	// 		</h1>
	// 	);
	// },
};

// console.log('isChrome', isChrome);

// const remarkPlugins = [];
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
			<div className="typing-effect">
				<Markdown>{displayedText}</Markdown>
				{currentIndex < text?.length && <span className="typing-cursor" />}
			</div>

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
