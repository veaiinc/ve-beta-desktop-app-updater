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

let newText = `# The Impact and Evolution of Artificial Intelligence  

## Introduction  
Artificial Intelligence (AI) is one of the most transformative technological advancements of our time. It enables machines to perform tasks that typically require human intelligence, such as learning, reasoning, problem-solving, and decision-making. AI has already revolutionized various industries, from healthcare and finance to manufacturing and entertainment. This essay explores the evolution of AI, its key applications, ethical considerations, and future prospects.  

## The Evolution of AI  
The concept of AI dates back to the mid-20th century when mathematicians and scientists like Alan Turing proposed the idea of machines simulating human intelligence. By the 1950s and 1960s, researchers developed the first AI programs capable of solving mathematical problems and playing chess. AI development continued in cycles, experiencing periods of rapid growth (AI booms) and stagnation (AI winters).  

In recent years, AI has witnessed an unprecedented surge, thanks to advancements in machine learning, deep learning, and neural networks. The availability of massive datasets, improved computational power, and breakthroughs in natural language processing (NLP) have propelled AI research to new heights. Models like OpenAI’s GPT-4, Google’s Gemini, and Mixtral’s AI systems are now capable of generating human-like text, translating languages, and assisting in complex problems.  

## Key Applications of AI  
AI is integrated into numerous sectors, improving efficiency, accuracy, and decision-making. Some of the most impactful applications include:  

### **Healthcare**  
AI models are being used for early disease detection, medical diagnosis, robot-assisted surgeries, and personalized treatment plans. AI-driven medical imaging and predictive analytics have significantly improved patient outcomes.  

### **Finance**  
AI helps detect fraudulent transactions, automate trading strategies, and enhance customer service through AI-powered chatbots and financial advisors. Predictive analytics enables better risk assessment and investment decisions.  

### **Education**  
AI-powered ed-tech platforms offer personalized learning experiences, automated grading, and virtual tutors, making education more accessible and engaging for students worldwide.  

### **Manufacturing and Robotics**  
AI-enabled robots improve precision in industrial processes, automate repetitive tasks, and increase productivity in industries such as automobile manufacturing and supply chain optimization.  

### **Entertainment and Media**  
AI creates personalized content recommendations on streaming platforms, develops AI-generated works of art and music, and plays a role in deepfake technology.  

## Ethical Considerations and Challenges  
Despite its benefits, AI also raises ethical and social concerns. Some challenges include:  

- **Bias and Discrimination**: AI models trained on biased data can lead to unfair outcomes, particularly in hiring processes, criminal justice, and facial recognition.  
- **Privacy and Security Risks**: AI-driven surveillance and data collection pose threats to personal privacy.  
- **Job Displacement**: The automation of repetitive and cognitive tasks may lead to job losses in various industries, affecting employment rates and economic stability.  
- **Autonomous Weapons and Misinformation**: AI's potential misuse in military applications and the spread of deepfakes raise concerns about security and misinformation.  

Governments and organizations are working on AI regulations and ethical guidelines to ensure responsible AI development and deployment.  

## Future Prospects of AI  
The future of AI holds exciting possibilities:  

- **Explainable AI (XAI)**: Researchers are working on transparent AI models that can explain decision-making processes to increase trust and accountability.  
- **Artificial General Intelligence (AGI)**: While current AI systems specialize in narrow tasks, AGI aims to create machines that can think and reason like humans across multiple domains.  
- **AI in Space Exploration**: AI-driven robots assist in space missions, helping space agencies gather critical data and conduct research on distant planets.  
- **AI and Quantum Computing**: The fusion of AI and quantum computing can accelerate problem-solving capabilities and lead to breakthroughs in science and medicine.  

## Conclusion  
AI is a powerful and evolving technology with the potential to reshape society. Its applications span multiple industries, enhancing efficiency and productivity while presenting ethical challenges that must be addressed. As AI research progresses, it is crucial to develop secure, fair, and responsible AI systems to benefit humanity. The future of AI depends on how we balance its advantages with ethical considerations, ensuring a world where technology serves as a force for good.
`;

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
	pre: ({ children }) => <pre className="markdown-pre mb-4 fade-in">{children}</pre>,
	hr: ({ children }) => <hr className="mb-2 fade-in" />,
	ol: ({ children, ...props }) => (
		<ol className=" list-outside ml-8 mb-4 fade-in" {...props}>
			{children}
		</ol>
	),
	li: ({ children, ...props }) => {
		return <li {...props}>{children}</li>;
	},
	ul: ({ children, ...props }) => {
		return (
			<ul className="list-decimal list-outside ml-8 mb-4 fade-in	" {...props}>
				{children}
			</ul>
		);
	},
	strong: ({ children, ...props }) => {
		return (
			<span className="font-semibold text-white common-markdown-font fade-in" {...props}>
				{children}
			</span>
		);
	},
	a: ({ children, ...props }) => {
		return (
			<a
				className="text-blue-500 hover:underline common-markdown-font fade-in"
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
			<h1 className="text-3xl font-semibold mt-6 mb-4 fade-in" {...props}>
				{children}
			</h1>
		);
	},
	h2: ({ children, ...props }) => {
		return (
			<h2 className="text-2xl font-semibold mt-6 mb-4 fade-in" {...props}>
				{children}
			</h2>
		);
	},
	h3: ({ children, ...props }) => {
		return (
			<h3 className="text-xl font-semibold mt-6 mb-2 fade-in" {...props}>
				{children}
			</h3>
		);
	},
	h4: ({ children, ...props }) => {
		return (
			<h4 className="text-lg font-semibold mt-6 mb-2 fade-in" {...props}>
				{children}
			</h4>
		);
	},
	h5: ({ children, ...props }) => {
		return (
			<h5 className="text-base font-semibold mt-6 mb-2 fade-in" {...props}>
				{children}
			</h5>
		);
	},
	h6: ({ children, ...props }) => {
		return (
			<h6 className="text-sm font-semibold mt-6 mb-2 fade-in" {...props}>
				{children}
			</h6>
		);
	},
	p: ({ children, ...props }) => {
		return (
			<p className="text-white  mb-2 mt-2 common-markdown-font fade-in" {...props}>
				{children}
			</p>
		);
	},
	img: ({ children, ...props }) => {
		return (
			<div className="markdown-image-wrapper fade-in">
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
		<div className="table-container my-4 overflow-x-auto fade-in">
			<table className="markdown-table w-full" {...props}>
				{children}
			</table>
		</div>
	),
	thead: ({ children, ...props }) => (
		<thead className="bg-gray-800 fade-in" {...props}>
			{children}
		</thead>
	),
	th: ({ children, ...props }) => (
		<th className="px-4 py-2 text-left border border-gray-700 fade-in" {...props}>
			{children}
		</th>
	),
	td: ({ children, ...props }) => (
		<td className="px-4 py-2 border border-gray-700 fade-in" {...props}>
			{children}
		</td>
	),
	tr: ({ children, ...props }) => (
		<tr className="border-b border-gray-700 hover:bg-gray-800 fade-in" {...props}>
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
		const [renderTrigger, setRenderTrigger] = useState(0);

		const chunkSize = 200; // Size of each chunk (200 characters)
		const textRef = useRef(text); // Store the latest text in a ref

		const chunkRef = useRef(''); // Ref for storing chunk
		const currentIndexRef = useRef(0); // Ref for storing currentIndex
		const timeIntervalRef = useRef(null);
		useEffect(() => {
			textRef.current = messageData;
		}, [messageData]);

		useEffect(() => {
			if (messageData?.messageId) {
				// setChunk(text);
				chunkRef.current = text;
				return;
			}
			setTimeout(() => {
				const interval = setInterval(() => {
					handleChunkRendering();
				}, 500);
				timeIntervalRef.current = interval;
			}, 50);
		}, []);

		const handleChunkRendering = () => {
			const currentText = textRef.current?.message;

			if (currentIndexRef.current >= currentText?.length && textRef.current?.messageId) {
				clearInterval(timeIntervalRef.current);
				return (timeIntervalRef.current = null);
			}

			// Slice the current chunk from the text
			let startIndex = currentIndexRef.current;
			let endIndex =
				currentIndexRef.current + chunkSize < currentText?.length
					? currentIndexRef.current + chunkSize
					: currentText?.length;
			let subChunk = currentText?.slice(startIndex, endIndex);

			chunkRef.current += subChunk;
			currentIndexRef.current = endIndex;
			setRenderTrigger((prev) => prev + 1);
		};

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
			setNoteContent(messageData);
		}, [customePencilClickFunc, text, setNoteContent]);

		const handleThumbsUp = useCallback(() => {
			handleRatingClick && handleRatingClick('thumbsUp', messageId);
		}, [handleRatingClick, messageId]);

		const handleThumbsDown = useCallback(() => {
			handleRatingClick && handleRatingClick('thumbsDown', messageId);
		}, [handleRatingClick, messageId]);

		return (
			<div className="typing-effect-container">
				<Markdown citations={citations}>
					{/* {newText?.replace(/\\\[(.*?)\\\]/g, '$$$1$$')?.replace(/\\n/g, '\n')} */}
					{chunkRef?.current?.replace(/\\\[(.*?)\\\]/g, '$$$1$$')?.replace(/\\n/g, '\n')}
					{/* {text?.replace(/\\\[(.*?)\\\]/g, '$$$1$$')?.replace(/\\n/g, '\n')} */}
				</Markdown>

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
