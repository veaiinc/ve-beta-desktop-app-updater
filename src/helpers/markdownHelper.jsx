import React, { memo, useContext, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { default as ReactMarkdown } from 'react-markdown';
import '../assets/scss/markdown.scss';
import '../assets/scss/markdownHelper.scss';
import { ReactComponent as PencilSparkleIcon } from '../assets/svg/notes/pencilSparkle.svg';
import { ReactComponent as TickSvg } from '../assets/svg/tick.svg';
import { ReactComponent as CopyIcon } from '../assets/svg/ai_agents/copy.svg';
import { ReactComponent as LinkArrowSvg } from '../assets/svg/sidebar/arrowupright.svg';
import Context from '../context/context';
import { Image, Tooltip } from 'antd';
import { CitationsTooltip } from '../views/components/modalsV2/chat/CitationsTooltip';
// import Plotly from '../views/components/chat/chatComponents/Plotly';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import AISuggestionsReportUserComponent from '../views/components/chat/chatComponents/AISuggestionsReportUserComponent';
import { fileTypeIcons, getBase64 } from '../helpers';
import { getFileType } from './chat/chatHelpers';
import { copyToClipboard } from './clipboardHelper';

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
		padding: 'calc(var(--font-size) * 0.85) calc(var(--font-size) * 1)',
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
		const visit = (node, parent) => {
			if (!node || typeof node !== 'object') return;

			// Only process text nodes
			if (node.type === 'text' && node.value) {
				const regex = /(\[C\d+\])/g;
				const parts = [];
				let lastIndex = 0;
				const matches = [...node.value.matchAll(regex)];

				// if (matches?.length === 0) return;

				if (matches?.length > 0) {
					let idx = 0;
					while (idx < matches.length) {
						const match = matches[idx];
						const start = match.index;
						const end = start + match[0].length;

						// push text before citation
						if (start > lastIndex) {
							parts.push({ type: 'text', value: node.value.slice(lastIndex, start) });
						}

						// group consecutive citations (no text between them)
						let groupEnd = end;
						const groupIds = [match[0].slice(1, -1)];

						while (matches[idx + 1] && matches[idx + 1].index === groupEnd) {
							groupIds.push(matches[idx + 1][0].slice(1, -1));
							groupEnd = matches[idx + 1].index + matches[idx + 1][0].length;
							idx++;
						}

						// push the grouped citation span (single span for all consecutive citations)
						parts.push({
							type: 'element',
							tagName: 'span',
							properties: { citationIds: groupIds },
							children: [{ type: 'text', value: 'Citation' }],
						});

						lastIndex = groupEnd;
						idx++;
					}

					// push remaining text
					if (lastIndex < node.value.length) {
						parts.push({ type: 'text', value: node.value.slice(lastIndex) });
					}

					// // Replace node value with new element
					// Object.assign(node, {
					// 	type: 'element',
					// 	tagName: 'span',
					// 	properties: node.properties || {},
					// 	children: parts,
					// });

					// Replace node in parent's children
					if (parent && parent.children) {
						const index = parent.children.indexOf(node);
						parent.children.splice(index, 1, ...parts);
					}

					return; // stop recursion for this node
				}
			}

			// Recurse into original children
			if (node.children && Array.isArray(node.children)) {
				node.children.forEach((child) => visit(child, node));
			}
		};

		visit(tree, null);
	};
};

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
	ol: ({ children, ...props }) => <ol className="ol">{children}</ol>,
	li: ({ children, ...props }) => <li className="li">{children}</li>,
	ul: ({ children, ...props }) => <ul className="ul">{children}</ul>,
	strong: ({ children, ...props }) => <strong className="strong">{children}</strong>,
	a: ({ children, href, ...props }) => (
		<a target="_blank" rel="noreferrer" href={href} className="a">
			{children}
			<span className="link-arrow">
				<LinkArrowSvg />
			</span>
		</a>
	),
	h1: ({ children, ...props }) => <h1 className="h1">{children}</h1>,
	h2: ({ children, ...props }) => <h2 className="h2">{children}</h2>,
	h3: ({ children, ...props }) => <h3 className="h3">{children}</h3>,
	h4: ({ children, ...props }) => <h4 className="h4">{children}</h4>,
	h5: ({ children, ...props }) => <h5 className="h5">{children}</h5>,
	h6: ({ children, ...props }) => <h6 className="h6">{children}</h6>,
	p: ({ children, ...props }) => <p className="p">{children}</p>,
	img: ({ children, ...props }) => (
		<div className="markdown-image-wrapper ">
			<img
				{...props}
				className="img"
				src={props?.src}
				alt="img"
				style={{ maxWidth: '50%', maxHeight: '50%', borderRadius: '4px' }}
			/>
		</div>
	),
	thead: ({ children, ...props }) => <thead>{children}</thead>,
	th: ({ children, ...props }) => <th>{children}</th>,
	td: ({ children, ...props }) => <td>{children}</td>,
	tr: ({ children, ...props }) => <tr>{children}</tr>,
	iframe: ({ children, ...props }) => (
		<div className="iframe-wrapper">
			<iframe {...props} className="iframe" />
		</div>
	),
	blockquote: ({ children, ...props }) => (
		<blockquote className="blockquote">{children}</blockquote>
	),
};

const MarkdownCode = memo(({ code, match }) => {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopyCode = useCallback(async (code) => {
		try {
			const success = await copyToClipboard(code, {
				onSuccess: () => {
					setIsCopied(true);
					setTimeout(() => {
						setIsCopied(false);
					}, 1000);
				},
				onError: (error) => {
					console.error('Failed to copy code:', error);
				},
			});

			if (!success) {
				console.error('Copy operation failed');
			}
		} catch (error) {
			console.error('Copy operation failed:', error);
		}
	}, []);
	return (
		<div className="markdown-code-wrapper">
			<div className="code-header">
				<div className="code-language">{match[1]}</div>
				<Tooltip title={isCopied ? 'Copied Code' : 'Copy Code'} placement="bottom">
					<button className="copy-code-btn" onClick={() => handleCopyCode(code || '')}>
						{isCopied ? <TickSvg /> : <CopyIcon width="14px" height="14px" />}
					</button>
				</Tooltip>
			</div>

			<SyntaxHighlighter style={codeColorTheme} language={match[1]} PreTag="div">
				{String(code)?.trim()?.replace(/\n$/, '')}
			</SyntaxHighlighter>
		</div>
	);
});

MarkdownCode.displayName = 'MarkdownCode';

const MarkdownTable = memo(({ children, node, markdown }) => {
	const [isCopied, setIsCopied] = useState(false);

	const end = node?.position?.end?.offset;
	const start = node?.position?.start?.offset;
	const table = markdown?.slice(start, end);

	const handleCopyTable = useCallback(async (table) => {
		const textToCopy = table?.replace(/\[C\d+\]/g, '');
		try {
			const success = await copyToClipboard(textToCopy, {
				onSuccess: () => {
					setIsCopied(true);
					setTimeout(() => {
						setIsCopied(false);
					}, 1000);
				},
				onError: (error) => {
					console.error('Failed to copy table:', error);
				},
			});

			if (!success) {
				console.error('Copy operation failed');
			}
		} catch (error) {
			console.error('Copy operation failed:', error);
		}
	}, []);
	return (
		<div className="table-wrapper">
			<Tooltip title={isCopied ? 'Copied Table' : 'Copy Table'} placement="bottom">
				<button className="copy-table-btn" onClick={() => handleCopyTable(table || '')}>
					{isCopied ? <TickSvg /> : <CopyIcon width="14px" height="14px" />}
				</button>
			</Tooltip>
			<div className="table-container">
				<table className="table">{children}</table>
			</div>
		</div>
	);
});

MarkdownTable.displayName = 'MarkdownTable';

// Memoize citation-specific components
const createCustomComponents = (citationsRef, markdownRef, plotsRef) => ({
	span: ({ children, citationIds, fadeIn, ...props }) => {
		if (citationIds?.length > 0) {
			return (
				<CitationsTooltip
					citationIds={citationIds?.split(' ')}
					citations={citationsRef.current}
				/>
			);
		}

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
	// plotly: ({ attachmentid, ...props }) => {
	// 	return <Plotly attachmentId={attachmentid} plotly={plotsRef.current} />;
	// },
});
//use remaarkMath for math equations
const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeKatex, rehypeRaw];

const NonMemoizedMarkdown = ({ children, citations = [], plots = [], animate = false }) => {
	const markdownRef = useRef('');
	const citationsRef = useRef([]);
	const plotsRef = useRef([]);

	const markdown = children;

	markdownRef.current = children;
	citationsRef.current = citations;
	plotsRef.current = plots;

	// Memoize the combined components object
	const components = useMemo(
		() => ({
			...baseComponents,
			...createCustomComponents(citationsRef, markdownRef, plotsRef),
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
		async (text) => {
			const textToBeCopied = text?.replace(/\\\[(.*?)\\\]/g, '$$$1$$')?.replace(/\\n/g, '\n');
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
						<div
							className={`uploaded-image ${
								messageData?.images?.length === 1 ? 'count-one' : ''
							}`}
							key={index}
						>
							<img src={image?.preview} onClick={() => handlePreview(image)} />
						</div>
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
					<div className="icon-container" style={{ top: '-2px' }}>
						<Tooltip
							placement="bottom"
							arrow={false}
							trigger={'hover'}
							color="transparent"
							title={<div className="user-hover-icons-tooltip">Edit</div>}
						>
							<PencilSparkleIcon
								width={'19px'}
								height={'20px'}
								onClick={handleEditUserQueryToggle}
							/>
						</Tooltip>
					</div>
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
