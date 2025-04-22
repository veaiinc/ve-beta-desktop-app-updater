import { memo, useMemo } from 'react';
import '../../../../assets/scss/chat/chatComponents/deepSearchChainOfThought.scss';

const ChainOfThought = ({ data, stream_end = false }) => {
	// const animationIndex = useMemo(() => {
	// 	let index = -1;
	// 	for (let i = data?.cot?.length - 1; i >= 0; i--) {
	// 		if (data?.cot[i]?.searching?.length > 0) {
	// 			index = i;
	// 			break;
	// 		}
	// 	}
	// 	return index;
	// }, [cot]);

	// const deepSearch = {
	// 	cot: [
	// 		{
	// 			reading: {
	// 				sub_query:
	// 					'What are the key historical milestones in the development of Artificial Intelligence?',
	// 				tool: 'search_web',
	// 				query: [
	// 					'key historical milestones in the development of Artificial Intelligence',
	// 				],
	// 				sources: [
	// 					'https://thehistory.tech/history-of-ai-evolution/',
	// 					'https://www.theainavigator.com/ai-timeline',
	// 					'https://medium.com/higher-neurons/10-historical-milestones-in-the-development-of-ai-systems-b99f21a606a9',
	// 					'https://www.coursera.org/articles/history-of-ai',
	// 					'https://www.britannica.com/science/history-of-artificial-intelligence',
	// 				],
	// 			},
	// 			sub_query_id: 'AJtq',
	// 			message_chunk_id: '68073235a7a3bf75a611764e_hG',
	// 		},
	// 		{
	// 			reading: {
	// 				sub_query:
	// 					'What are the current applications of Artificial Intelligence across different industries?',
	// 				tool: 'search_web',
	// 				query: [
	// 					'current applications of Artificial Intelligence across different industries 2025',
	// 				],
	// 				sources: [
	// 					'https://www.geeksforgeeks.org/applications-of-ai/',
	// 					'https://www.pynetlabs.com/applications-of-artificial-intelligence/',
	// 					'https://www2.deloitte.com/us/en/insights/focus/tech-trends.html',
	// 					'https://www.unite.ai/the-state-of-ai-in-2025-key-takeaways-from-stanfords-latest-ai-index-report/',
	// 					'https://www.milesit.com/progress-in-artificial-intelligence/',
	// 				],
	// 			},
	// 			sub_query_id: 'YmBB',
	// 			message_chunk_id: '68073235a7a3bf75a611764e_hG',
	// 		},
	// 		{
	// 			reading: {
	// 				sub_query:
	// 					'What are the predicted future trends and prospects for Artificial Intelligence?',
	// 				tool: 'search_web',
	// 				query: ['future trends and prospects for Artificial Intelligence 2025'],
	// 				sources: [
	// 					'https://blogs.unib.org/en/technology/2025/02/27/the-future-of-artificial-intelligence-in-2025-advances-and-challenges/',
	// 					'https://sloanreview.mit.edu/article/five-trends-in-ai-and-data-science-for-2025/',
	// 					'https://www.technologyreview.com/2025/01/08/1109188/whats-next-for-ai-in-2025/',
	// 					'https://www.forbes.com/sites/bernardmarr/2024/09/24/the-10-biggest-ai-trends-of-2025-everyone-must-be-ready-for-today/',
	// 					'https://setr.stanford.edu/technology/artificial-intelligence/2025',
	// 				],
	// 			},
	// 			sub_query_id: 'F5RT',
	// 			message_chunk_id: '68073235a7a3bf75a611764e_hG',
	// 		},
	// 	],
	// 	cot_refined: [],
	// 	initial_answer: {},
	// 	final_answer: {
	// 		final_answer:
	// 			"### Key Historical Milestones in AI Development\nArtificial Intelligence (AI) has evolved significantly over the decades, marked by several key milestones:\n- **1950**: Alan Turing's publication \"Computing Machinery and Intelligence\" introduced the Turing Test, a foundational concept for AI [C1].\n- **1956**: The term \"Artificial Intelligence\" was coined by John McCarthy at the Dartmouth Conference, marking the formal birth of AI as a field [C2].\n- **1970s**: Geoffrey Hinton's exploration of neural networks laid the groundwork for modern AI applications [C3].\n- **1997**: IBM's Deep Blue defeated chess champion Garry Kasparov, showcasing AI's capability in complex tasks [C4].\n- **2016**: AlphaGo's victory over Go champion Lee Sedol demonstrated AI's advanced strategic thinking [C5].\n- **2017**: The development of the Transformer model revolutionized natural language processing [C6].\n\n### Current Applications of AI Across Industries\nAI is transforming various industries with applications such as:\n- **Healthcare**: AI aids in diagnostics and personalized medicine by analyzing medical data [C7].\n- **Finance**: AI enhances fraud detection and algorithmic trading [C8].\n- **Customer Service**: AI-driven chatbots and virtual assistants improve customer interactions [C9].\n- **Education**: AI personalizes learning experiences to improve educational outcomes [C10].\n- **Entertainment**: AI is used for content creation and personalized media recommendations [C11].\n\n### Future Trends and Prospects for AI in 2025\nLooking ahead to 2025, AI is expected to continue its rapid evolution with several key trends:\n- **Generative AI and Productivity Gains**: AI is driving exponential productivity and efficiency improvements, fostering data-driven cultures [C12].\n- **Sectoral Transformation**: AI will further transform sectors like healthcare, justice, and education, automating tasks and advancing biomedicine and climate solutions [C13].\n- **Customized Chatbots and Multimodal Models**: The development of sophisticated chatbots and multimodal models is a growing trend, enhancing generative video and robotics [C14].\n- **AI as a Foundational Technology**: AI is seen as a foundational technology, akin to electricity and the internet, with transformative potential across societies and economies [C15].",
	// 		final_answer_citations: [
	// 			{
	// 				id: 'C1',
	// 				source: null,
	// 				snippet: 'Alan Turing published',
	// 				url: 'https://thehistory.tech/history-of-ai-evolution/',
	// 				name: 'https://thehistory.tech/history-of-ai-evolution/',
	// 				type: 'url',
	// 			},
	// 			{
	// 				id: 'C2',
	// 				source: null,
	// 				snippet: 'Dartmouth Conference',
	// 				url: 'https://www.britannica.com/science/history-of-artificial-intelligen',
	// 				name: 'https://www.britannica.com/science/history-of-artificial-intelligen',
	// 				type: 'url',
	// 			},
	// 			{
	// 				id: 'C3',
	// 				source: null,
	// 				snippet: 'Geoffrey Hinton began exploring',
	// 				url: 'https://www.coursera.org/articles/history-of-ai',
	// 				name: 'https://www.coursera.org/articles/history-of-ai',
	// 				type: 'url',
	// 			},
	// 			{
	// 				id: 'C4',
	// 				source: null,
	// 				snippet: 'Deep Blue defeated',
	// 				url: 'https://www.britannica.com/science/history-of-artificial-intelligen',
	// 				name: 'https://www.britannica.com/science/history-of-artificial-intelligen',
	// 				type: 'url',
	// 			},
	// 			{
	// 				id: 'C5',
	// 				source: null,
	// 				snippet: 'AlphaGo defeated Lee Sedol',
	// 				url: 'https://www.coursera.org/articles/history-of-ai',
	// 				name: 'https://www.coursera.org/articles/history-of-ai',
	// 				type: 'url',
	// 			},
	// 			{
	// 				id: 'C6',
	// 				source: null,
	// 				snippet: 'Transformer model',
	// 				url: 'https://medium.com/higher-neurons/10-historical-milestones-in-the-development-of-ai-systems-b99f21a606a9',
	// 				name: 'https://medium.com/higher-neurons/10-historical-milestones-in-the-development-of-ai-systems-b99f21a606a9',
	// 				type: 'url',
	// 			},
	// 			{
	// 				id: 'C7',
	// 				source: null,
	// 				snippet: 'AI assists with diagnostics and personalized medicine',
	// 				url: 'https://www.pynetlabs.com/applications-of-artificial-intelligence/',
	// 				name: 'https://www.pynetlabs.com/applications-of-artificial-intelligence/',
	// 				type: 'url',
	// 			},
	// 			{
	// 				id: 'C8',
	// 				source: null,
	// 				snippet: 'powers fraud detection and algorithmic trading',
	// 				url: 'https://www.pynetlabs.com/applications-of-artificial-intelligence/',
	// 				name: 'https://www.pynetlabs.com/applications-of-artificial-intelligence/',
	// 				type: 'url',
	// 			},
	// 			{
	// 				id: 'C9',
	// 				source: null,
	// 				snippet: 'AI in customer service',
	// 				url: 'https://www.pynetlabs.com/applications-of-artificial-intelligence/',
	// 				name: 'https://www.pynetlabs.com/applications-of-artificial-intelligence/',
	// 				type: 'url',
	// 			},
	// 			{
	// 				id: 'C10',
	// 				source: null,
	// 				snippet: 'AI continues to redefine various sectors',
	// 				url: 'https://www.unite.ai/the-state-of-ai-in-2025-key-takeaways-from-stanfords-latest-ai-index-report/',
	// 				name: 'https://www.unite.ai/the-state-of-ai-in-2025-key-takeaways-from-stanfords-latest-ai-index-report/',
	// 				type: 'url',
	// 			},
	// 			{
	// 				id: 'C11',
	// 				source: null,
	// 				snippet: 'reshape industries ranging from health care to entertainment',
	// 				url: 'https://www2.deloitte.com/us/en/insights/focus/tech-trends.html',
	// 				name: 'https://www2.deloitte.com/us/en/insights/focus/tech-trends.html',
	// 				type: 'url',
	// 			},
	// 			{
	// 				id: 'C12',
	// 				source: null,
	// 				snippet: 'exponential productivity or efficiency gains from AI',
	// 				url: 'https://sloanreview.mit.edu/article/five-trends-in-ai-and-data-science-for-2025/',
	// 				name: 'https://sloanreview.mit.edu/article/five-trends-in-ai-and-data-science-for-2025/',
	// 				type: 'url',
	// 			},
	// 			{
	// 				id: 'C13',
	// 				source: null,
	// 				snippet: 'AI will transform various sectors',
	// 				url: 'https://blogs.unib.org/en/technology/2025/02/27/the-future-of-artificial-intelligence-in-2025-advances-and-challenges/',
	// 				name: 'https://blogs.unib.org/en/technology/2025/02/27/the-future-of-artificial-intelligence-in-2025-advances-and-challenges/',
	// 				type: 'url',
	// 			},
	// 			{
	// 				id: 'C14',
	// 				source: null,
	// 				snippet: 'customized chatbots—interactive helper apps',
	// 				url: 'https://www.technologyreview.com/2025/01/08/1109188/whats-next-for-ai-in-2025/',
	// 				name: 'https://www.technologyreview.com/2025/01/08/1109188/whats-next-for-ai-in-2025/',
	// 				type: 'url',
	// 			},
	// 			{
	// 				id: 'C15',
	// 				source: null,
	// 				snippet: 'AI is a foundational technology',
	// 				url: 'https://setr.stanford.edu/technology/artificial-intelligence/2025',
	// 				name: 'https://setr.stanford.edu/technology/artificial-intelligence/2025',
	// 				type: 'url',
	// 			},
	// 		],
	// 		original_citations: [
	// 			{
	// 				id: 'C1',
	// 				source: 'https://thehistory.tech/history-of-ai-evolution/',
	// 				snippet: 'Alan Turing published',
	// 			},
	// 			{
	// 				id: 'C2',
	// 				source: 'https://www.britannica.com/science/history-of-artificial-intelligen',
	// 				snippet: 'Dartmouth Conference',
	// 			},
	// 			{
	// 				id: 'C3',
	// 				source: 'https://www.coursera.org/articles/history-of-ai',
	// 				snippet: 'Geoffrey Hinton began exploring',
	// 			},
	// 			{
	// 				id: 'C4',
	// 				source: 'https://www.britannica.com/science/history-of-artificial-intelligen',
	// 				snippet: 'Deep Blue defeated',
	// 			},
	// 			{
	// 				id: 'C5',
	// 				source: 'https://www.coursera.org/articles/history-of-ai',
	// 				snippet: 'AlphaGo defeated Lee Sedol',
	// 			},
	// 			{
	// 				id: 'C6',
	// 				source: 'https://medium.com/higher-neurons/10-historical-milestones-in-the-development-of-ai-systems-b99f21a606a9',
	// 				snippet: 'Transformer model',
	// 			},
	// 			{
	// 				id: 'C7',
	// 				source: 'https://www.pynetlabs.com/applications-of-artificial-intelligence/',
	// 				snippet: 'AI assists with diagnostics and personalized medicine',
	// 			},
	// 			{
	// 				id: 'C8',
	// 				source: 'https://www.pynetlabs.com/applications-of-artificial-intelligence/',
	// 				snippet: 'powers fraud detection and algorithmic trading',
	// 			},
	// 			{
	// 				id: 'C9',
	// 				source: 'https://www.pynetlabs.com/applications-of-artificial-intelligence/',
	// 				snippet: 'AI in customer service',
	// 			},
	// 			{
	// 				id: 'C10',
	// 				source: 'https://www.unite.ai/the-state-of-ai-in-2025-key-takeaways-from-stanfords-latest-ai-index-report/',
	// 				snippet: 'AI continues to redefine various sectors',
	// 			},
	// 			{
	// 				id: 'C11',
	// 				source: 'https://www2.deloitte.com/us/en/insights/focus/tech-trends.html',
	// 				snippet: 'reshape industries ranging from health care to entertainment',
	// 			},
	// 			{
	// 				id: 'C12',
	// 				source: 'https://sloanreview.mit.edu/article/five-trends-in-ai-and-data-science-for-2025/',
	// 				snippet: 'exponential productivity or efficiency gains from AI',
	// 			},
	// 			{
	// 				id: 'C13',
	// 				source: 'https://blogs.unib.org/en/technology/2025/02/27/the-future-of-artificial-intelligence-in-2025-advances-and-challenges/',
	// 				snippet: 'AI will transform various sectors',
	// 			},
	// 			{
	// 				id: 'C14',
	// 				source: 'https://www.technologyreview.com/2025/01/08/1109188/whats-next-for-ai-in-2025/',
	// 				snippet: 'customized chatbots—interactive helper apps',
	// 			},
	// 			{
	// 				id: 'C15',
	// 				source: 'https://setr.stanford.edu/technology/artificial-intelligence/2025',
	// 				snippet: 'AI is a foundational technology',
	// 			},
	// 		],
	// 		follow_up_query: [],
	// 		need_refinement: false,
	// 		message_chunk_id: '68073235a7a3bf75a611764e_hG',
	// 	},
	// };

	return (
		<div className="cot-wrapper">
			<div className="cot-container">
				{data?.cot?.map((item, index) => {
					const { sub_query, tool, query, sources } = item;
					return (
						<div className="cot" key={index}>
							<div className="logo-container">
								<div className="indicator" />
							</div>
							<div className="content">
								<div className="sub-query">{sub_query || ''}</div>
								{/* {item?.searching?.length > 0 && (
									<div className="searching-source-container">
										<div
											className={`text-container 
											// !stream_end && index === animationIndex ? 'animate' : ''
										`}
										>
											Searching :
										</div>

										{item?.searching?.map((search, idx) => (
											<div key={idx} className="search-item">
												{search}
											</div>
										))}
									</div>
								)} */}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default memo(ChainOfThought);
