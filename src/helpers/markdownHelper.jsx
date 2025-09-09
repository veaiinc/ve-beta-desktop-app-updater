import React, { memo, useContext, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { default as ReactMarkdown } from 'react-markdown';
import '../assets/scss/markdown.scss';
import '../assets/scss/markdownHelper.scss';
import { ReactComponent as PencilSparkleIcon } from '../assets/svg/notes/pencilSparkle.svg';
import { ReactComponent as TickSvg } from '../assets/svg/tick.svg';
import { ReactComponent as CopyIcon } from '../assets/svg/ai_agents/copy.svg';
import Context from '../context/context';
import { Image, Tooltip } from 'antd';
import { CitationsTooltip } from '../views/components/modalsV2/chat/CitationsTooltip';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import AISuggestionsReportUserComponent from '../views/components/chat/chatComponents/AISuggestionsReportUserComponent';
import { fileTypeIcons, getBase64 } from '../helpers';
import { getFileType } from './chat/chatHelpers';

const codeColorTheme = {
	'code[class*="language-"]': {
		color: 'var(--primary-font) !important',
		background: 'transparent',
		fontFamily: 'monospace, Consolas, Monaco, "Andale Mono", "Ubuntu Mono"',
		tabSize: '4',
		hyphens: 'none',
		whiteSpace: 'pre',
		wordBreak: 'normal',
		lineHeight: '1.5',
		wordWrap: 'normal',
		textAlign: 'left',
		wordSpacing: 'normal',
	},
	'pre[class*="language-"]': {
		color: 'var(--primary-font) !important',
		background: 'transparent',
		fontFamily: 'monospace, Consolas, Monaco, "Andale Mono", "Ubuntu Mono"',
		lineHeight: '1.5',
		padding: '16px',
		overflow: 'auto',
	},
	comment: {
		color: 'var(--secondary-font)', // Adjusted for better contrast
		fontStyle: 'italic',
	},
	prolog: {
		color: '#6a9955',
		fontStyle: 'italic',
	},
	cdata: {
		color: '#6a9955',
		fontStyle: 'italic',
	},
	punctuation: {
		color: 'var(--primary-font)',
	},
	property: {
		color: '#df3079',
	},
	tag: {
		color: 'var(--primary-font)',
	},
	boolean: {
		color: '#b5cea8',
	},
	number: {
		color: '#df3079',
	},
	constant: {
		color: '#b5cea8',
	},
	symbol: {
		color: 'var(--primary-font)',
	},
	deleted: {
		color: '#d16969',
	},
	selector: {
		color: '#df3079',
	},
	'attr-name': {
		color: '#df3079',
	},
	string: {
		color: '#00a67d',
	},
	char: {
		color: '#ce9178',
	},
	builtin: {
		color: '#e9950c',
	},
	inserted: {
		color: '#b5cea8',
	},
	operator: {
		color: 'var(--primary-font)',
	},
	entity: {
		color: 'var(--primary-font)',
	},
	url: {
		color: 'var(--primary-font)',
	},
	atrule: {
		color: '#c586c0',
	},
	'attr-value': {
		color: '#00a67d',
	},
	keyword: {
		color: '#2e95d3',
	},
	function: {
		color: '#f22c3d',
	},
	'class-name': {
		color: '#df3079',
	},
	regex: {
		color: '#d16969',
	},
	important: {
		color: '#2e95d3',
		fontWeight: 'bold',
	},
	variable: {
		color: 'var(--primary-font)',
	},
	bold: {
		fontWeight: 'bold',
	},
	italic: {
		fontStyle: 'italic',
	},
	':not(pre) > code[class*="language-"]': {
		background: '#1e1e1e',
		color: 'var(--primary-font)',
		padding: '0.1em',
		borderRadius: '0.3em',
		whiteSpace: 'normal',
	},
};

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
								properties: {
									citationId: part?.slice(1, -1),
								},
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

// const rehypeFadeInWords = () => {
// 	return (tree) => {
// 		const visit = (node, parent) => {
// 			if (!node || typeof node !== 'object') return;

// 			// Then transform text nodes
// 			if (node.type === 'text' && node.value) {
// 				const words = node.value.split(/(\s+)/); // keep spaces too

// 				const newNode = {
// 					type: 'element',
// 					tagName: 'span',
// 					properties: {},
// 					children: words.map((word) =>
// 						word.trim() === ''
// 							? { type: 'text', value: word }
// 							: {
// 									type: 'element',
// 									tagName: 'span',
// 									properties: { fadeIn: true },
// 									children: [{ type: 'text', value: word }],
// 							  },
// 					),
// 				};

// 				// Replace this node in the parent's children
// 				if (parent && parent.children) {
// 					const idx = parent.children.indexOf(node);
// 					parent.children[idx] = newNode;
// 				}
// 			}

// 			// Recurse first into existing children
// 			if (node.children && Array.isArray(node.children)) {
// 				node.children.forEach((child) => visit(child, node));
// 			}
// 		};

// 		visit(tree, null);
// 	};
// };

const rehypeFadeInWords = () => {
	return (tree) => {
		const visit = (node, parent) => {
			if (!node || typeof node !== 'object') return;

			if (Array.isArray(node.children)) {
				[...node.children].forEach((child) => visit(child, node));
			}

			if (node.type === 'text' && node.value && parent) {
				const words = node.value.split(/(\s+)/);
				const newNodes = words.map((word) =>
					word.trim() === ''
						? { type: 'text', value: word }
						: {
								type: 'element',
								tagName: 'span',
								properties: { fadeIn: true },
								children: [{ type: 'text', value: word }],
						  },
				);

				const idx = parent.children.indexOf(node);
				if (idx !== -1) parent.children.splice(idx, 1, ...newNodes);
			}
		};

		visit(tree, null);
	};
};

// Move components outside to prevent recreation on every render
const baseComponents = {
	pre: ({ children }) => <pre className="pre">{children}</pre>,
	hr: () => <hr />,
	ol: ({ children, ...props }) => (
		<ol className="ol" {...props}>
			{children}
		</ol>
	),
	li: ({ children, ...props }) => {
		return <li className="li">{children}</li>;
	},
	ul: ({ children, ...props }) => {
		return <ul className="ul">{children}</ul>;
	},
	strong: ({ children, ...props }) => {
		return <strong className="strong">{children}</strong>;
	},
	a: ({ children, ...props }) => {
		return (
			<a target="_blank" rel="noreferrer" {...props} className="a">
				{children}
			</a>
		);
	},
	h1: ({ children, ...props }) => {
		return <h1 className="h1">{children}</h1>;
	},
	h2: ({ children, ...props }) => {
		return <h2 className="h2">{children}</h2>;
	},
	h3: ({ children, ...props }) => {
		return <h3 className="h3">{children}</h3>;
	},
	h4: ({ children, ...props }) => {
		return <h4 className="h4">{children}</h4>;
	},
	h5: ({ children, ...props }) => {
		return <h5 className="h5">{children}</h5>;
	},
	h6: ({ children, ...props }) => {
		return <h6 className="h6">{children}</h6>;
	},
	p: ({ children, ...props }) => {
		return <p className="p">{children}</p>;
	},
	img: ({ children, ...props }) => {
		return (
			<div className="markdown-image-wrapper ">
				<img
					{...props}
					className="img"
					src={props?.src}
					alt="img"
					style={{ maxWidth: '50%', maxHeight: '50%', borderRadius: '4px' }}
				/>
			</div>
		);
	},
	thead: ({ children, ...props }) => <thead>{children}</thead>,
	th: ({ children, ...props }) => <th>{children}</th>,
	td: ({ children, ...props }) => <td>{children}</td>,
	tr: ({ children, ...props }) => <tr>{children}</tr>,
	iframe: ({ children, ...props }) => {
		return (
			<div className="iframe-wrapper">
				<iframe {...props} className="iframe" />
			</div>
		);
	},
};

const MarkdownCode = memo(({ code, match }) => {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopyCode = useCallback((code) => {
		navigator?.clipboard?.writeText(code);
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 1000);
	}, []);
	return (
		<div className="markdown-code-wrapper">
			<div className="code-header">
				<div className="code-language">{match[1]}</div>
				<button className="copy-code-btn" onClick={() => handleCopyCode(code || '')}>
					<Tooltip title={isCopied ? 'Copied Code' : 'Copy Code'} placement="bottom">
						{isCopied ? <TickSvg /> : <CopyIcon />}
					</Tooltip>
				</button>
			</div>

			<SyntaxHighlighter style={codeColorTheme} language={match[1]} PreTag="div">
				{String(code)?.replace(/\n$/, '')}
			</SyntaxHighlighter>
		</div>
	);
});

const MarkdownTable = memo(({ children, node, markdown }) => {
	const [isCopied, setIsCopied] = useState(false);

	const end = node?.position?.end?.offset;
	const start = node?.position?.start?.offset;
	const table = markdown?.slice(start, end);

	const handleCopyTable = useCallback((table) => {
		navigator?.clipboard?.writeText(table?.replace(/\[C\d+\]/g, ''));
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 1000);
	}, []);
	return (
		<div className="table-wrapper">
			<button className="copy-table-btn" onClick={() => handleCopyTable(table || '')}>
				<Tooltip title={isCopied ? 'Copied Table' : 'Copy Table'} placement="bottom">
					{isCopied ? <TickSvg /> : <CopyIcon />}
				</Tooltip>
			</button>
			<div className="table-container">
				<table className="table">{children}</table>
			</div>
		</div>
	);
});

// Memoize citation-specific components
const createCustomComponents = (citationsRef, markdownRef) => ({
	span: ({ children, citationId, fadeIn, ...props }) => {
		if (citationId)
			return <CitationsTooltip citationId={citationId} citations={citationsRef.current} />;

		if (fadeIn) {
			return <span className="chat-fade-in">{children}</span>;
		}

		return (
			<span className="span" {...props}>
				{children}
			</span>
		);
	},
	table: ({ node, children }) => {
		return (
			<MarkdownTable node={node} markdown={markdownRef.current}>
				{children}
			</MarkdownTable>
		);
	},
	code: ({ node, inline, className, children, ...props }) => {
		const match = /language-(\w+)/?.exec(className || '');
		const codeCheck = !inline && match && match[1] !== 'plaintext';
		let code;
		if (codeCheck) {
			code = markdownRef.current?.slice(
				node?.position?.start?.offset + (3 + match[1]?.length),
				node?.position?.end?.offset - 3,
			);
		}

		return codeCheck ? (
			<MarkdownCode code={code} match={match} node={node} />
		) : (
			<code {...props} className="code">
				{children}
			</code>
		);
	},
});
//use remaarkMath for math equations
const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeKatex, rehypeRaw];

const NonMemoizedMarkdown = ({ children, citations = [], animate = false }) => {
	const markdownRef = useRef('');
	const citationsRef = useRef([]);

	const markdown = children;

	markdownRef.current = children;
	citationsRef.current = citations;

	// Memoize the combined components object
	const components = useMemo(
		() => ({
			...baseComponents,
			...createCustomComponents(citationsRef, markdownRef),
		}),
		[],
	);

	//if you are adding new plugin try to check order, otherwise it will effect animation
	const updatedRehypePlugins = useMemo(() => {
		return animate
			? [...rehypePlugins, rehypeFadeInWords, rehypeCITPlugin]
			: [...rehypePlugins, rehypeCITPlugin];
	}, [animate]);

	return (
		<ReactMarkdown
			remarkPlugins={remarkPlugins}
			rehypePlugins={updatedRehypePlugins}
			components={components}
			className={`markdown-custom-content ${animate ? 'markdown-custom-animate' : ''}`}
		>
			{markdown}
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

export const UserMessageRenderer = memo(({ messageData }) => {
	const {
		templates: { updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isCopiedToClipboard: false,
		editUserQuery: false,
		userQuery: messageData?.message,
	});

	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');

	const handleCopyTextClick = useCallback(
		(text) => {
			const textToBeCopied = text?.replace(/\\\[(.*?)\\\]/g, '$$$1$$')?.replace(/\\n/g, '\n');
			navigator?.clipboard?.writeText(textToBeCopied).then(() => {
				setInfo((prev) => ({ ...prev, isCopiedToClipboard: true }));
				setTimeout(() => {
					setInfo((prev) => ({ ...prev, isCopiedToClipboard: false }));
				}, 1000);
			});
		},
		[info],
	);

	const handleEditUserQueryToggle = useCallback(() => {
		setInfo((prev) => ({
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
				setInfo((prev) => ({
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
			setInfo((prev) => ({ ...prev, userQuery: e.target.value }));
		},
		[info],
	);

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file?.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
	};

	return (
		<div className="user-message-renderer-wrapper">
			{messageData?.images?.length > 0 && (
				<div className="uploaded-images-container">
					{messageData?.images?.map((image, index) => (
						<img
							key={index}
							src={image?.preview}
							className="uploaded-image"
							onClick={() => handlePreview(image)}
						/>
					))}
				</div>
			)}

			{messageData?.attachments?.length > 0 && (
				<div className="uploaded-files-container">
					{messageData?.attachments?.map((file, index) => {
						return (
							<div className="uploaded-file" key={index}>
								<div className="file-type-icon">
									{fileTypeIcons?.[file?.sourceType]}
								</div>
								<div className="uploaded-file-info">
									<div className="uploaded-file-name">
										<div className="file-title">{file?.name || ''}</div>
									</div>
									<div className="file-source-type">{getFileType(file)}</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
			{!info?.editUserQuery ? (
				<div className="user-message-wrapper">
					{messageData?.moduleType === 'ai_suggestion_report' ? (
						<AISuggestionsReportUserComponent data={messageData?.data} />
					) : (
						<div className="user-message">
							<div className="user-message-renderer-container">
								{messageData?.message || ''}
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
					{/* <div className="icon-container" style={{ top: '-2px' }}>
						<Tooltip placement="bottom" arrow={false} trigger={'hover'} title={'Edit'}>
							<PencilSparkleIcon
								width={'19px'}
								height={'20px'}
								onClick={handleEditUserQueryToggle}
							/>
						</Tooltip>
					</div> */}

					<div className="icon-container">
						<Tooltip
							placement="bottom"
							arrow={false}
							trigger={'hover'}
							color="transparent"
							title={
								<div className="user-hover-icons-tooltip">
									{info?.isCopiedToClipboard ? 'Copied' : 'Copy'}
								</div>
							}
						>
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

			{previewImage && (
				<Image
					wrapperStyle={{
						display: 'none',
					}}
					rootClassName="chat-preview-image-container"
					preview={{
						visible: previewOpen,
						onVisibleChange: (visible) => setPreviewOpen(visible),
						afterOpenChange: (visible) => !visible && setPreviewImage(''),
					}}
					src={previewImage}
				/>
			)}
		</div>
	);
});

UserMessageRenderer.displayName = 'UserMessageRenderer';
