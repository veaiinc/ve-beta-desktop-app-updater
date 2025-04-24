import { memo } from 'react';
import '../../../../assets/scss/chat/chatComponents/deepResearchChainOfThought.scss';
import { Markdown } from '../../../../helpers/markdownHelper';
import { getFaviconUrl, getWebsiteName } from '../../../../helpers';
import { ReactComponent as HashTagSvg } from '../../../../assets/svg/ai_agents/hash-tag.svg';
import WebSvg from '../../../../assets/svg/ai_agents/webSvg';
import BookSvg from '../../../../assets/svg/ai_agents/bookSvg';

const DeepResearchChainOfThought = ({ data }) => {
	data = {
		cot: [
			{
				step: 'To create a comprehensive report plan on the history of AI, I need to gather authoritative information on several aspects: the chronological development of AI, key milestones, influential figures, major technological breakthroughs, and the societal impacts of AI over time. My first step will be to search the web for a broad overview of the history of AI, focusing on timelines and major events. This will help me identify the foundational structure for the report and ensure that I cover all significant periods and turning points. Once I have this foundational context, I will proceed to search for more specific details on important figures, breakthroughs, and societal impacts in subsequent steps.',
				tool: 'search_web',
				queries: ['history of artificial intelligence key milestones timeline'],
				sources: [],
			},
			{
				step: 'It seems there was an issue retrieving the initial search results. To ensure I provide a thorough and accurate report plan, I will attempt the web search again, this time refining my query to focus on a timeline of AI history and its major milestones. This should help me gather the necessary foundational information to structure the report effectively.',
				tool: 'search_web',
				queries: ['timeline of artificial intelligence history and major milestones'],
				sources: [],
			},
			{
				step: 'I have gathered sufficient information about the history of artificial intelligence (AI) from my internal knowledge base. I have decided to approach the report by structuring it chronologically and thematically to ensure a comprehensive exploration of the topic.',
				citations: [],
			},
			{
				step: 'I will begin by providing an overview of the origins of AI, including early theoretical foundations and the context in which AI research began.',
				citations: [],
			},
			{
				step: 'Next, I will outline key milestones in AI development, such as the Dartmouth Conference, the creation of early AI programs, and the emergence of machine learning.',
				citations: [],
			},
			{
				step: 'I will dedicate a section to important figures in AI, highlighting their contributions and influence on the field’s direction.',
				citations: [],
			},
			{
				step: 'A section on technological breakthroughs will explore pivotal innovations, such as expert systems, neural networks, deep learning, and natural language processing.',
				citations: [],
			},
			{
				step: 'I will analyze the societal impacts of AI over time, considering both positive and negative effects, and how public perception has evolved.',
				citations: [],
			},
			{
				step: 'Throughout the report, I will ensure that each section builds upon the previous one, creating a coherent narrative that connects historical context, technological progress, and societal change.',
				citations: [],
			},
			{
				step: 'I will include subtopics in each section, such as the influence of government funding, the role of academia and industry, and the interplay between theory and application.',
				citations: [],
			},
			{
				step: 'Comparative analysis will be used to show how different eras of AI research responded to technological and societal challenges.',
				citations: [],
			},
			{
				step: 'I will highlight the interconnections between key figures and breakthroughs, showing how collaboration and competition shaped the field.',
				citations: [],
			},
			{
				step: 'The report will also address ethical considerations and debates that have arisen alongside AI’s development.',
				citations: [],
			},
			{
				step: 'I will conclude by summarizing the key findings, reflecting on the current state of AI, and suggesting possible future directions.',
				citations: [],
			},
			{
				step: 'The structure will ensure a logical flow, starting from foundational concepts and moving toward contemporary issues and future prospects.',
				citations: [],
			},
			{
				step: 'Each section will be designed to provide unique value, avoiding generic content and focusing on analysis and insight.',
				citations: [],
			},
			{
				step: 'I have formulated a plan to write the report as follows:',
				citations: [],
			},
			{
				step: 'Introduction to the History of AI\nFoundational Milestones in AI Development\nImportant Figures in AI History\nTechnological Breakthroughs in AI\nSocietal Impacts of AI Over Time\nEthical Considerations and Public Perception\nConclusion',
				citations: [],
			},
		],
		sections: [
			{
				section: 'Technological Breakthroughs in AI',
				sub_queries: [
					{
						sub_query:
							'What are the key features and historical development of expert systems in AI?',
						readings: [
							{
								reading: {
									sub_query:
										'What are the key features and historical development of expert systems in AI?',
									tool: 'search_web',
									query: [
										'key features historical development expert systems AI',
									],
									sources: [
										'https://www.google.com',
										'https://geeksforgeeks.org',
										'https://youtube.com',
									],
								},
							},
							{
								reading: {
									sub_query:
										'What are the key features and historical development of expert systems in AI?',
									tool: 'search_web',
									query: ['expert systems AI history key features'],
									sources: [
										'https://www.google.com',
										'https://geeksforgeeks.org',
										'https://youtube.com',
									],
								},
							},
							{
								reading: {
									sub_query:
										'What are the key features and historical development of expert systems in AI?',
									tool: 'search_web',
									query: ['expert systems in AI historical development features'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the key features and historical development of expert systems in AI?',
									tool: 'search_web',
									query: ['history of expert systems in artificial intelligence'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the key features and historical development of expert systems in AI?',
									tool: 'search_web',
									query: ['expert systems AI features and history'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'How did the invention of neural networks contribute to advancements in AI technology?',
						readings: [
							{
								reading: {
									sub_query:
										'How did the invention of neural networks contribute to advancements in AI technology?',
									tool: 'search_web',
									query: [
										'invention of neural networks advancements in AI technology',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How did the invention of neural networks contribute to advancements in AI technology?',
									tool: 'search_web',
									query: ['neural networks contributions to AI advancements'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How did the invention of neural networks contribute to advancements in AI technology?',
									tool: 'search_web',
									query: ['impact of neural networks on AI technology'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How did the invention of neural networks contribute to advancements in AI technology?',
									tool: 'search_web',
									query: ['history of neural networks in AI'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How did the invention of neural networks contribute to advancements in AI technology?',
									tool: 'search_web',
									query: ['neural networks AI technology advancements'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'What breakthroughs in deep learning have significantly impacted AI applications?',
						readings: [
							{
								reading: {
									sub_query:
										'What breakthroughs in deep learning have significantly impacted AI applications?',
									tool: 'search_web',
									query: [
										'breakthroughs in deep learning impacting AI applications',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What breakthroughs in deep learning have significantly impacted AI applications?',
									tool: 'search_web',
									query: [
										'deep learning breakthroughs impact on AI applications',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What breakthroughs in deep learning have significantly impacted AI applications?',
									tool: 'search_web',
									query: [
										'significant breakthroughs in deep learning AI applications',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What breakthroughs in deep learning have significantly impacted AI applications?',
									tool: 'search_web',
									query: ['deep learning breakthroughs AI applications'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What breakthroughs in deep learning have significantly impacted AI applications?',
									tool: 'search_web',
									query: [
										'impact of deep learning breakthroughs on AI applications',
									],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'How has natural language processing evolved over time and what are its major milestones?',
						readings: [
							{
								reading: {
									sub_query:
										'How has natural language processing evolved over time and what are its major milestones?',
									tool: 'search_web',
									query: [
										'history of natural language processing milestones evolution',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How has natural language processing evolved over time and what are its major milestones?',
									tool: 'search_web',
									query: [
										'history of natural language processing milestones evolution',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How has natural language processing evolved over time and what are its major milestones?',
									tool: 'search_web',
									query: ['natural language processing evolution milestones'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How has natural language processing evolved over time and what are its major milestones?',
									tool: 'search_web',
									query: ['natural language processing history key milestones'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How has natural language processing evolved over time and what are its major milestones?',
									tool: 'search_web',
									query: ['natural language processing milestones'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'What are the real-world applications enabled by these technological innovations in AI?',
						readings: [
							{
								reading: {
									sub_query:
										'What are the real-world applications enabled by these technological innovations in AI?',
									tool: 'search_web',
									query: [
										'real-world applications of AI technological innovations expert systems neural networks deep learning natural language processing',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the real-world applications enabled by these technological innovations in AI?',
									tool: 'search_web',
									query: [
										'real-world applications of AI expert systems neural networks deep learning natural language processing',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the real-world applications enabled by these technological innovations in AI?',
									tool: 'search_web',
									query: [
										'applications of AI technologies expert systems neural networks deep learning natural language processing',
									],
									sources: [],
								},
							},
						],
					},
				],
				section_id: 'z31B',
			},
			{
				section: 'Societal Impacts of AI Over Time',
				sub_queries: [
					{
						sub_query:
							'What are the economic impacts of AI on job markets and employment rates?',
						readings: [
							{
								reading: {
									sub_query:
										'What are the economic impacts of AI on job markets and employment rates?',
									tool: 'search_web',
									query: [
										'economic impacts of AI on job markets and employment rates 2025',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the economic impacts of AI on job markets and employment rates?',
									tool: 'search_web',
									query: [
										'economic impacts of AI on job markets and employment rates 2025',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the economic impacts of AI on job markets and employment rates?',
									tool: 'search_web',
									query: [
										'AI economic impact on job markets employment rates 2025',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the economic impacts of AI on job markets and employment rates?',
									tool: 'search_web',
									query: ['AI impact on job markets employment rates 2025'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the economic impacts of AI on job markets and employment rates?',
									tool: 'search_web',
									query: ['economic impact of AI on employment job market 2025'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query: 'How has AI influenced cultural trends and societal norms?',
						readings: [
							{
								reading: {
									sub_query:
										'How has AI influenced cultural trends and societal norms?',
									tool: 'search_web',
									query: ['AI influence on cultural trends societal norms 2025'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How has AI influenced cultural trends and societal norms?',
									tool: 'search_web',
									query: ['AI influence on cultural trends societal norms'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How has AI influenced cultural trends and societal norms?',
									tool: 'search_web',
									query: ['impact of AI on culture and society'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'What ethical concerns have arisen from the implementation of AI technologies?',
						readings: [
							{
								reading: {
									sub_query:
										'What ethical concerns have arisen from the implementation of AI technologies?',
									tool: 'search_web',
									query: ['ethical concerns AI technologies 2025'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What ethical concerns have arisen from the implementation of AI technologies?',
									tool: 'search_web',
									query: ['ethical concerns AI technologies'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What ethical concerns have arisen from the implementation of AI technologies?',
									tool: 'search_web',
									query: ['AI technologies ethical concerns 2025'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What ethical concerns have arisen from the implementation of AI technologies?',
									tool: 'search_web',
									query: ['ethical implications of AI technologies'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What ethical concerns have arisen from the implementation of AI technologies?',
									tool: 'search_web',
									query: ['AI ethical concerns'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'How has public perception of AI changed over time, particularly in response to its societal impacts?',
						readings: [
							{
								reading: {
									sub_query:
										'How has public perception of AI changed over time, particularly in response to its societal impacts?',
									tool: 'search_web',
									query: ['public perception of AI societal impacts history'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How has public perception of AI changed over time, particularly in response to its societal impacts?',
									tool: 'search_web',
									query: ['public perception of AI societal impacts history'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How has public perception of AI changed over time, particularly in response to its societal impacts?',
									tool: 'search_web',
									query: ['how public perception of AI has changed over time'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How has public perception of AI changed over time, particularly in response to its societal impacts?',
									tool: 'search_web',
									query: ['AI public perception changes societal impacts'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'What policy responses have been enacted to address the challenges and opportunities presented by AI?',
						readings: [
							{
								reading: {
									sub_query:
										'What policy responses have been enacted to address the challenges and opportunities presented by AI?',
									tool: 'search_web',
									query: ['AI policy responses challenges opportunities 2025'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What policy responses have been enacted to address the challenges and opportunities presented by AI?',
									tool: 'search_web',
									query: ['AI policy responses challenges opportunities'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What policy responses have been enacted to address the challenges and opportunities presented by AI?',
									tool: 'search_web',
									query: ['AI policy responses 2025'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What policy responses have been enacted to address the challenges and opportunities presented by AI?',
									tool: 'search_web',
									query: ['AI policy responses to challenges and opportunities'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What policy responses have been enacted to address the challenges and opportunities presented by AI?',
									tool: 'search_web',
									query: ['AI policy responses 2023'],
									sources: [],
								},
							},
						],
					},
				],
				section_id: 'jxZt',
			},
			{
				section: 'Important Figures in AI History',
				sub_queries: [
					{
						sub_query:
							'Who are the key figures in the history of AI and what are their major contributions?',
						readings: [
							{
								reading: {
									sub_query:
										'Who are the key figures in the history of AI and what are their major contributions?',
									tool: 'search_web',
									query: ['key figures in the history of AI contributions'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'Who are the key figures in the history of AI and what are their major contributions?',
									tool: 'search_web',
									query: ['key figures in AI history contributions'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'Who are the key figures in the history of AI and what are their major contributions?',
									tool: 'search_web',
									query: ['influential individuals in AI history'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'Who are the key figures in the history of AI and what are their major contributions?',
									tool: 'search_web',
									query: ['important figures in AI history'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'Who are the key figures in the history of AI and what are their major contributions?',
									tool: 'search_web',
									query: ['key figures in artificial intelligence history'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'What collaborations have significantly advanced AI research and development?',
						readings: [
							{
								reading: {
									sub_query:
										'What collaborations have significantly advanced AI research and development?',
									tool: 'search_web',
									query: ['collaborations in AI research and development'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What collaborations have significantly advanced AI research and development?',
									tool: 'search_web',
									query: [
										'significant collaborations in AI research and development',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What collaborations have significantly advanced AI research and development?',
									tool: 'search_web',
									query: ['important collaborations in AI research'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What collaborations have significantly advanced AI research and development?',
									tool: 'search_web',
									query: ['AI research collaborations'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'How have the contributions of influential individuals shaped the direction of AI technologies?',
						readings: [
							{
								reading: {
									sub_query:
										'How have the contributions of influential individuals shaped the direction of AI technologies?',
									tool: 'search_web',
									query: [
										'influential individuals contributions AI technologies',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How have the contributions of influential individuals shaped the direction of AI technologies?',
									tool: 'search_web',
									query: ['influential individuals contributions to AI'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How have the contributions of influential individuals shaped the direction of AI technologies?',
									tool: 'search_web',
									query: ['key figures in AI history contributions'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How have the contributions of influential individuals shaped the direction of AI technologies?',
									tool: 'search_web',
									query: ['influential figures in artificial intelligence'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How have the contributions of influential individuals shaped the direction of AI technologies?',
									tool: 'search_web',
									query: ['important figures in AI history'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'What are the notable achievements and breakthroughs associated with these influential figures in AI?',
						readings: [
							{
								reading: {
									sub_query:
										'What are the notable achievements and breakthroughs associated with these influential figures in AI?',
									tool: 'search_web',
									query: [
										'notable achievements breakthroughs influential figures in AI',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the notable achievements and breakthroughs associated with these influential figures in AI?',
									tool: 'search_web',
									query: [
										'notable achievements breakthroughs influential figures in AI',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the notable achievements and breakthroughs associated with these influential figures in AI?',
									tool: 'search_web',
									query: ['key figures in AI history achievements breakthroughs'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the notable achievements and breakthroughs associated with these influential figures in AI?',
									tool: 'search_web',
									query: ['influential figures in AI and their contributions'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the notable achievements and breakthroughs associated with these influential figures in AI?',
									tool: 'search_web',
									query: [
										'influential AI researchers contributions breakthroughs',
									],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'In what ways have societal perceptions of AI been influenced by the work of these key individuals?',
						readings: [
							{
								reading: {
									sub_query:
										'In what ways have societal perceptions of AI been influenced by the work of these key individuals?',
									tool: 'search_web',
									query: [
										'societal perceptions of AI key individuals contributions influence',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'In what ways have societal perceptions of AI been influenced by the work of these key individuals?',
									tool: 'search_web',
									query: [
										'influence of key individuals on societal perceptions of AI',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'In what ways have societal perceptions of AI been influenced by the work of these key individuals?',
									tool: 'search_web',
									query: [
										'impact of influential figures on societal views of artificial intelligence',
									],
									sources: [],
								},
							},
						],
					},
				],
				section_id: 'IKpe',
			},
			{
				section: 'Introduction to the History of AI',
				sub_queries: [
					{
						sub_query:
							'What were the key philosophical and theoretical foundations that influenced the early development of artificial intelligence?',
						readings: [
							{
								reading: {
									sub_query:
										'What were the key philosophical and theoretical foundations that influenced the early development of artificial intelligence?',
									tool: 'search_web',
									query: [
										'philosophical theoretical foundations early development artificial intelligence',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the key philosophical and theoretical foundations that influenced the early development of artificial intelligence?',
									tool: 'search_web',
									query: [
										'philosophical theoretical foundations early development artificial intelligence',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the key philosophical and theoretical foundations that influenced the early development of artificial intelligence?',
									tool: 'search_web',
									query: ['philosophical foundations of artificial intelligence'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the key philosophical and theoretical foundations that influenced the early development of artificial intelligence?',
									tool: 'search_web',
									query: ['theoretical foundations of artificial intelligence'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the key philosophical and theoretical foundations that influenced the early development of artificial intelligence?',
									tool: 'search_web',
									query: [
										'history of artificial intelligence philosophical foundations',
									],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'What were the primary motivations and goals of the first AI researchers in the mid-20th century?',
						readings: [
							{
								reading: {
									sub_query:
										'What were the primary motivations and goals of the first AI researchers in the mid-20th century?',
									tool: 'search_web',
									query: [
										'motivations goals first AI researchers mid-20th century',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the primary motivations and goals of the first AI researchers in the mid-20th century?',
									tool: 'search_web',
									query: [
										'motivations goals first AI researchers mid-20th century',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the primary motivations and goals of the first AI researchers in the mid-20th century?',
									tool: 'search_web',
									query: ['early AI research motivations goals'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the primary motivations and goals of the first AI researchers in the mid-20th century?',
									tool: 'search_web',
									query: ['history of AI early researchers motivations'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'What initial questions and challenges did early AI researchers face in their work?',
						readings: [
							{
								reading: {
									sub_query:
										'What initial questions and challenges did early AI researchers face in their work?',
									tool: 'search_web',
									query: ['early AI researchers initial questions challenges'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What initial questions and challenges did early AI researchers face in their work?',
									tool: 'search_web',
									query: ['early AI research challenges questions'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What initial questions and challenges did early AI researchers face in their work?',
									tool: 'search_web',
									query: ['initial challenges faced by early AI researchers'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What initial questions and challenges did early AI researchers face in their work?',
									tool: 'search_web',
									query: ['challenges faced by early AI researchers'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What initial questions and challenges did early AI researchers face in their work?',
									tool: 'search_web',
									query: ['early AI research questions and challenges'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'Who were the significant figures in the early history of AI, and what contributions did they make to the field?',
						readings: [
							{
								reading: {
									sub_query:
										'Who were the significant figures in the early history of AI, and what contributions did they make to the field?',
									tool: 'search_web',
									query: [
										'significant figures early history of AI contributions',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'Who were the significant figures in the early history of AI, and what contributions did they make to the field?',
									tool: 'search_web',
									query: [
										'early history of AI significant figures contributions',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'Who were the significant figures in the early history of AI, and what contributions did they make to the field?',
									tool: 'search_web',
									query: ['key figures in early AI history contributions'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'Who were the significant figures in the early history of AI, and what contributions did they make to the field?',
									tool: 'search_web',
									query: ['important figures in artificial intelligence history'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'Who were the significant figures in the early history of AI, and what contributions did they make to the field?',
									tool: 'search_web',
									query: ['pioneers of artificial intelligence contributions'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'What were the major technological limitations and breakthroughs during the early stages of AI development?',
						readings: [
							{
								reading: {
									sub_query:
										'What were the major technological limitations and breakthroughs during the early stages of AI development?',
									tool: 'search_web',
									query: [
										'early stages of AI development technological limitations breakthroughs',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the major technological limitations and breakthroughs during the early stages of AI development?',
									tool: 'search_web',
									query: [
										'early AI development technological limitations breakthroughs',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the major technological limitations and breakthroughs during the early stages of AI development?',
									tool: 'search_web',
									query: [
										'history of AI technological limitations breakthroughs',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the major technological limitations and breakthroughs during the early stages of AI development?',
									tool: 'search_web',
									query: ['early AI development limitations breakthroughs'],
									sources: [],
								},
							},
						],
					},
				],
				section_id: '5qp4',
			},
			{
				section: 'Ethical Considerations and Public Perception',
				sub_queries: [
					{
						sub_query:
							'What are the key ethical concerns associated with AI development, particularly regarding bias and discrimination?',
						readings: [
							{
								reading: {
									sub_query:
										'What are the key ethical concerns associated with AI development, particularly regarding bias and discrimination?',
									tool: 'search_web',
									query: ['ethical concerns AI development bias discrimination'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the key ethical concerns associated with AI development, particularly regarding bias and discrimination?',
									tool: 'search_web',
									query: ['ethical concerns AI development bias discrimination'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the key ethical concerns associated with AI development, particularly regarding bias and discrimination?',
									tool: 'search_web',
									query: ['AI ethical concerns bias discrimination'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the key ethical concerns associated with AI development, particularly regarding bias and discrimination?',
									tool: 'search_web',
									query: ['AI ethics bias discrimination'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the key ethical concerns associated with AI development, particularly regarding bias and discrimination?',
									tool: 'search_web',
									query: ['AI development ethical concerns bias discrimination'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'How has AI impacted privacy rights and data protection, and what are the major controversies surrounding these issues?',
						readings: [
							{
								reading: {
									sub_query:
										'How has AI impacted privacy rights and data protection, and what are the major controversies surrounding these issues?',
									tool: 'search_web',
									query: [
										'AI impact on privacy rights data protection controversies 2025',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How has AI impacted privacy rights and data protection, and what are the major controversies surrounding these issues?',
									tool: 'search_web',
									query: [
										'AI impact on privacy rights data protection controversies',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How has AI impacted privacy rights and data protection, and what are the major controversies surrounding these issues?',
									tool: 'search_web',
									query: ['AI privacy rights data protection controversies 2025'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How has AI impacted privacy rights and data protection, and what are the major controversies surrounding these issues?',
									tool: 'search_web',
									query: ['AI privacy rights data protection controversies'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'What are the implications of AI on the future of work, including job displacement and the creation of new job categories?',
						readings: [
							{
								reading: {
									sub_query:
										'What are the implications of AI on the future of work, including job displacement and the creation of new job categories?',
									tool: 'search_web',
									query: [
										'implications of AI on the future of work job displacement new job categories 2025',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the implications of AI on the future of work, including job displacement and the creation of new job categories?',
									tool: 'search_web',
									query: [
										'AI future of work job displacement new job categories 2025',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the implications of AI on the future of work, including job displacement and the creation of new job categories?',
									tool: 'search_web',
									query: [
										'AI impact on future of work job displacement new job categories',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the implications of AI on the future of work, including job displacement and the creation of new job categories?',
									tool: 'search_web',
									query: [
										'AI job displacement new job categories implications 2025',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the implications of AI on the future of work, including job displacement and the creation of new job categories?',
									tool: 'search_web',
									query: ['AI impact on jobs future of work 2025'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'How has public perception of AI changed over the years, and what factors have influenced these shifts in opinion?',
						readings: [
							{
								reading: {
									sub_query:
										'How has public perception of AI changed over the years, and what factors have influenced these shifts in opinion?',
									tool: 'search_web',
									query: [
										'public perception of AI changes over the years factors influencing opinion',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How has public perception of AI changed over the years, and what factors have influenced these shifts in opinion?',
									tool: 'search_web',
									query: [
										'public perception of AI changes over the years factors influencing opinion',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How has public perception of AI changed over the years, and what factors have influenced these shifts in opinion?',
									tool: 'search_web',
									query: [
										'how public perception of AI has changed over the years',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How has public perception of AI changed over the years, and what factors have influenced these shifts in opinion?',
									tool: 'search_web',
									query: ['public perception of artificial intelligence history'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How has public perception of AI changed over the years, and what factors have influenced these shifts in opinion?',
									tool: 'search_web',
									query: ['public perception of AI over time'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'What are the proposed frameworks or guidelines for addressing ethical issues in AI development and deployment?',
						readings: [
							{
								reading: {
									sub_query:
										'What are the proposed frameworks or guidelines for addressing ethical issues in AI development and deployment?',
									tool: 'search_web',
									query: [
										'proposed frameworks guidelines ethical issues AI development deployment',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the proposed frameworks or guidelines for addressing ethical issues in AI development and deployment?',
									tool: 'search_web',
									query: [
										'ethical frameworks guidelines AI development deployment',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the proposed frameworks or guidelines for addressing ethical issues in AI development and deployment?',
									tool: 'search_web',
									query: ['AI ethical guidelines frameworks 2025'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the proposed frameworks or guidelines for addressing ethical issues in AI development and deployment?',
									tool: 'search_web',
									query: ['AI ethics frameworks guidelines 2025'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What are the proposed frameworks or guidelines for addressing ethical issues in AI development and deployment?',
									tool: 'search_web',
									query: ['AI ethical guidelines frameworks'],
									sources: [],
								},
							},
						],
					},
				],
				section_id: 'ESMu',
			},
			{
				section: 'Foundational Milestones in AI Development',
				sub_queries: [
					{
						sub_query:
							'What were the key milestones in AI development from the Dartmouth Conference to the present day?',
						readings: [
							{
								reading: {
									sub_query:
										'What were the key milestones in AI development from the Dartmouth Conference to the present day?',
									tool: 'search_web',
									query: [
										'key milestones in AI development from Dartmouth Conference to present day',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the key milestones in AI development from the Dartmouth Conference to the present day?',
									tool: 'search_web',
									query: [
										'key milestones in AI development from Dartmouth Conference to present day',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the key milestones in AI development from the Dartmouth Conference to the present day?',
									tool: 'search_web',
									query: [
										'history of AI milestones from Dartmouth Conference to present',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the key milestones in AI development from the Dartmouth Conference to the present day?',
									tool: 'search_web',
									query: ['AI development milestones timeline'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the key milestones in AI development from the Dartmouth Conference to the present day?',
									tool: 'search_web',
									query: ['AI milestones from Dartmouth Conference to present'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'What were the early AI programs developed after the Dartmouth Conference, and what were their contributions?',
						readings: [
							{
								reading: {
									sub_query:
										'What were the early AI programs developed after the Dartmouth Conference, and what were their contributions?',
									tool: 'search_web',
									query: [
										'early AI programs developed after the Dartmouth Conference contributions',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the early AI programs developed after the Dartmouth Conference, and what were their contributions?',
									tool: 'search_web',
									query: [
										'early AI programs after Dartmouth Conference contributions',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the early AI programs developed after the Dartmouth Conference, and what were their contributions?',
									tool: 'search_web',
									query: ['early AI programs after Dartmouth Conference'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the early AI programs developed after the Dartmouth Conference, and what were their contributions?',
									tool: 'search_web',
									query: [
										'early AI programs developed after Dartmouth Conference',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What were the early AI programs developed after the Dartmouth Conference, and what were their contributions?',
									tool: 'search_web',
									query: ['AI programs developed after Dartmouth Conference'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'What factors contributed to the rise and fall of expert systems in AI?',
						readings: [
							{
								reading: {
									sub_query:
										'What factors contributed to the rise and fall of expert systems in AI?',
									tool: 'search_web',
									query: ['rise and fall of expert systems in AI'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What factors contributed to the rise and fall of expert systems in AI?',
									tool: 'search_web',
									query: ['expert systems AI history rise fall'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What factors contributed to the rise and fall of expert systems in AI?',
									tool: 'search_web',
									query: ['expert systems AI rise and fall'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What factors contributed to the rise and fall of expert systems in AI?',
									tool: 'search_web',
									query: ['history of expert systems in AI'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What factors contributed to the rise and fall of expert systems in AI?',
									tool: 'search_web',
									query: ['expert systems AI rise fall factors'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'How did the emergence of machine learning change the landscape of AI technology?',
						readings: [
							{
								reading: {
									sub_query:
										'How did the emergence of machine learning change the landscape of AI technology?',
									tool: 'search_web',
									query: [
										'emergence of machine learning impact on AI technology',
									],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How did the emergence of machine learning change the landscape of AI technology?',
									tool: 'search_web',
									query: ['impact of machine learning on AI technology'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How did the emergence of machine learning change the landscape of AI technology?',
									tool: 'search_web',
									query: ['machine learning emergence impact on AI'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How did the emergence of machine learning change the landscape of AI technology?',
									tool: 'search_web',
									query: ['how machine learning changed AI technology'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'How did the emergence of machine learning change the landscape of AI technology?',
									tool: 'search_web',
									query: ['machine learning AI technology impact'],
									sources: [],
								},
							},
						],
					},
					{
						sub_query:
							'What societal impacts have resulted from the major milestones in AI history?',
						readings: [
							{
								reading: {
									sub_query:
										'What societal impacts have resulted from the major milestones in AI history?',
									tool: 'search_web',
									query: ['societal impacts of major milestones in AI history'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What societal impacts have resulted from the major milestones in AI history?',
									tool: 'search_web',
									query: ['societal impacts of major milestones in AI history'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What societal impacts have resulted from the major milestones in AI history?',
									tool: 'search_web',
									query: ['societal impacts of AI milestones'],
									sources: [],
								},
							},
							{
								reading: {
									sub_query:
										'What societal impacts have resulted from the major milestones in AI history?',
									tool: 'search_web',
									query: ['societal impacts of AI milestones'],
									sources: [],
								},
							},
						],
					},
				],
				section_id: 'ovCT',
			},
		],
		sections_refined: [
			{
				section: 'Societal Impacts of AI Over Time',
				refined_sub_queries: [
					{
						refined_sub_query:
							'What specific examples illustrate the economic impacts of AI on different job sectors over the last decade?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What specific examples illustrate the economic impacts of AI on different job sectors over the last decade?',
									tool: 'search_web',
									query: [
										'economic impacts of AI on job sectors last decade examples',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What specific examples illustrate the economic impacts of AI on different job sectors over the last decade?',
									tool: 'search_web',
									query: [
										'economic impacts of AI on job sectors last decade examples',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What specific examples illustrate the economic impacts of AI on different job sectors over the last decade?',
									tool: 'search_web',
									query: ['economic impacts of AI on job sectors examples 2023'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What specific examples illustrate the economic impacts of AI on different job sectors over the last decade?',
									tool: 'search_web',
									query: ['AI economic impact on job sectors examples'],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'How have cultural attitudes towards AI technologies shifted in various regions or demographics?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'How have cultural attitudes towards AI technologies shifted in various regions or demographics?',
									tool: 'search_web',
									query: ['cultural attitudes towards AI technologies 2025'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How have cultural attitudes towards AI technologies shifted in various regions or demographics?',
									tool: 'search_web',
									query: ['cultural attitudes towards AI technologies 2025'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How have cultural attitudes towards AI technologies shifted in various regions or demographics?',
									tool: 'search_web',
									query: ['cultural attitudes towards AI technologies 2024'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How have cultural attitudes towards AI technologies shifted in various regions or demographics?',
									tool: 'search_web',
									query: ['cultural attitudes towards AI technologies'],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'What are the most pressing ethical dilemmas associated with AI in healthcare and law enforcement?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What are the most pressing ethical dilemmas associated with AI in healthcare and law enforcement?',
									tool: 'search_web',
									query: ['ethical dilemmas AI healthcare 2025'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the most pressing ethical dilemmas associated with AI in healthcare and law enforcement?',
									tool: 'search_web',
									query: ['ethical dilemmas AI law enforcement 2025'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the most pressing ethical dilemmas associated with AI in healthcare and law enforcement?',
									tool: 'search_web',
									query: ['AI ethical dilemmas healthcare'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the most pressing ethical dilemmas associated with AI in healthcare and law enforcement?',
									tool: 'search_web',
									query: ['AI ethical dilemmas law enforcement'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the most pressing ethical dilemmas associated with AI in healthcare and law enforcement?',
									tool: 'search_web',
									query: ['AI ethics healthcare'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the most pressing ethical dilemmas associated with AI in healthcare and law enforcement?',
									tool: 'search_web',
									query: ['AI ethics law enforcement'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the most pressing ethical dilemmas associated with AI in healthcare and law enforcement?',
									tool: 'search_web',
									query: ['AI ethical issues in healthcare'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the most pressing ethical dilemmas associated with AI in healthcare and law enforcement?',
									tool: 'search_web',
									query: ['AI ethical issues in law enforcement'],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'What historical events or technological advancements have significantly influenced public perception of AI?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What historical events or technological advancements have significantly influenced public perception of AI?',
									tool: 'search_web',
									query: [
										'historical events technological advancements public perception of AI',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What historical events or technological advancements have significantly influenced public perception of AI?',
									tool: 'search_web',
									query: [
										'historical events technological advancements public perception of AI',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What historical events or technological advancements have significantly influenced public perception of AI?',
									tool: 'search_web',
									query: [
										'impact of historical events on public perception of AI',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What historical events or technological advancements have significantly influenced public perception of AI?',
									tool: 'search_web',
									query: [
										'key events that shaped public perception of artificial intelligence',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What historical events or technological advancements have significantly influenced public perception of AI?',
									tool: 'search_web',
									query: [
										'historical events that influenced AI public perception',
									],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'What specific policy measures have been implemented globally to regulate AI technologies and their societal impacts?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What specific policy measures have been implemented globally to regulate AI technologies and their societal impacts?',
									tool: 'search_web',
									query: [
										'global policy measures regulating AI technologies 2025',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What specific policy measures have been implemented globally to regulate AI technologies and their societal impacts?',
									tool: 'search_web',
									query: ['AI regulation policies 2025'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What specific policy measures have been implemented globally to regulate AI technologies and their societal impacts?',
									tool: 'search_web',
									query: ['AI regulation policies 2024'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What specific policy measures have been implemented globally to regulate AI technologies and their societal impacts?',
									tool: 'search_web',
									query: ['AI regulation global policies 2023'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What specific policy measures have been implemented globally to regulate AI technologies and their societal impacts?',
									tool: 'search_web',
									query: ['AI regulation policies 2023'],
									sources: [],
								},
							},
						],
					},
				],
				section_id: 'jxZt',
			},
			{
				section: 'Ethical Considerations and Public Perception',
				refined_sub_queries: [
					{
						refined_sub_query:
							'What are some notable case studies that illustrate bias and discrimination in AI systems, and what were the outcomes of these cases?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What are some notable case studies that illustrate bias and discrimination in AI systems, and what were the outcomes of these cases?',
									tool: 'search_web',
									query: ['case studies bias discrimination AI systems outcomes'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are some notable case studies that illustrate bias and discrimination in AI systems, and what were the outcomes of these cases?',
									tool: 'search_web',
									query: ['case studies bias discrimination AI systems outcomes'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are some notable case studies that illustrate bias and discrimination in AI systems, and what were the outcomes of these cases?',
									tool: 'search_web',
									query: ['AI bias discrimination case studies'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are some notable case studies that illustrate bias and discrimination in AI systems, and what were the outcomes of these cases?',
									tool: 'search_web',
									query: ['examples of bias in AI systems'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are some notable case studies that illustrate bias and discrimination in AI systems, and what were the outcomes of these cases?',
									tool: 'search_web',
									query: ['AI bias discrimination case studies outcomes'],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'What ethical frameworks or guidelines have been proposed by organizations or governments to address AI-related ethical issues, and how effective are they?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What ethical frameworks or guidelines have been proposed by organizations or governments to address AI-related ethical issues, and how effective are they?',
									tool: 'search_web',
									query: [
										'ethical frameworks guidelines AI organizations governments effectiveness',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What ethical frameworks or guidelines have been proposed by organizations or governments to address AI-related ethical issues, and how effective are they?',
									tool: 'search_web',
									query: [
										'AI ethical frameworks guidelines organizations governments effectiveness',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What ethical frameworks or guidelines have been proposed by organizations or governments to address AI-related ethical issues, and how effective are they?',
									tool: 'search_web',
									query: [
										'AI ethics guidelines frameworks organizations governments effectiveness',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What ethical frameworks or guidelines have been proposed by organizations or governments to address AI-related ethical issues, and how effective are they?',
									tool: 'search_web',
									query: [
										'AI ethical guidelines frameworks organizations governments',
									],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'How have specific events or technological advancements influenced public perception of AI, and what are some examples of these shifts?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'How have specific events or technological advancements influenced public perception of AI, and what are some examples of these shifts?',
									tool: 'search_web',
									query: [
										'public perception of AI technological advancements events influence',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How have specific events or technological advancements influenced public perception of AI, and what are some examples of these shifts?',
									tool: 'search_web',
									query: [
										'public perception of AI technological advancements events influence',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How have specific events or technological advancements influenced public perception of AI, and what are some examples of these shifts?',
									tool: 'search_web',
									query: [
										'events technological advancements influence public perception of AI',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How have specific events or technological advancements influenced public perception of AI, and what are some examples of these shifts?',
									tool: 'search_web',
									query: [
										'how events and technology influence public perception of AI',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How have specific events or technological advancements influenced public perception of AI, and what are some examples of these shifts?',
									tool: 'search_web',
									query: [
										'public perception of AI changes events technological advancements',
									],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'What are the potential long-term societal impacts of AI on privacy rights, and how have these concerns been addressed in recent legislation?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What are the potential long-term societal impacts of AI on privacy rights, and how have these concerns been addressed in recent legislation?',
									tool: 'search_web',
									query: [
										'long-term societal impacts of AI on privacy rights recent legislation 2025',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the potential long-term societal impacts of AI on privacy rights, and how have these concerns been addressed in recent legislation?',
									tool: 'search_web',
									query: ['AI privacy rights societal impacts legislation 2025'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the potential long-term societal impacts of AI on privacy rights, and how have these concerns been addressed in recent legislation?',
									tool: 'search_web',
									query: ['AI privacy rights societal impacts legislation 2024'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the potential long-term societal impacts of AI on privacy rights, and how have these concerns been addressed in recent legislation?',
									tool: 'search_web',
									query: ['AI privacy rights societal impacts legislation 2023'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the potential long-term societal impacts of AI on privacy rights, and how have these concerns been addressed in recent legislation?',
									tool: 'search_web',
									query: ['AI privacy rights societal impacts legislation 2022'],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'What are the arguments for and against the regulation of AI technologies, and what examples exist of successful or failed regulatory efforts?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What are the arguments for and against the regulation of AI technologies, and what examples exist of successful or failed regulatory efforts?',
									tool: 'search_web',
									query: [
										'arguments for and against AI regulation examples successful failed',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the arguments for and against the regulation of AI technologies, and what examples exist of successful or failed regulatory efforts?',
									tool: 'search_web',
									query: [
										'arguments for and against AI regulation examples successful failed',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the arguments for and against the regulation of AI technologies, and what examples exist of successful or failed regulatory efforts?',
									tool: 'search_web',
									query: ['AI regulation arguments for against examples'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the arguments for and against the regulation of AI technologies, and what examples exist of successful or failed regulatory efforts?',
									tool: 'search_web',
									query: ['AI regulation pros cons examples'],
									sources: [],
								},
							},
						],
					},
				],
				section_id: 'ESMu',
			},
			{
				section: 'Important Figures in AI History',
				refined_sub_queries: [
					{
						refined_sub_query:
							'What are some specific collaborations between influential figures in AI that have led to significant advancements in the field?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What are some specific collaborations between influential figures in AI that have led to significant advancements in the field?',
									tool: 'search_web',
									query: [
										'collaborations influential figures in AI significant advancements',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are some specific collaborations between influential figures in AI that have led to significant advancements in the field?',
									tool: 'search_web',
									query: [
										'collaborations influential figures in AI significant advancements',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are some specific collaborations between influential figures in AI that have led to significant advancements in the field?',
									tool: 'search_web',
									query: [
										'AI collaborations influential researchers advancements',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are some specific collaborations between influential figures in AI that have led to significant advancements in the field?',
									tool: 'search_web',
									query: [
										'collaborations in artificial intelligence key figures',
									],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'How have societal perceptions of AI changed over time due to the contributions of key individuals?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'How have societal perceptions of AI changed over time due to the contributions of key individuals?',
									tool: 'search_web',
									query: [
										'societal perceptions of AI contributions of key individuals',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How have societal perceptions of AI changed over time due to the contributions of key individuals?',
									tool: 'search_web',
									query: [
										'societal perceptions of AI contributions of key individuals',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How have societal perceptions of AI changed over time due to the contributions of key individuals?',
									tool: 'search_web',
									query: [
										'history of AI influential individuals societal perceptions',
									],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'What are the ethical implications of the work done by influential figures in AI and how have they shaped public opinion?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What are the ethical implications of the work done by influential figures in AI and how have they shaped public opinion?',
									tool: 'search_web',
									query: [
										'ethical implications influential figures in AI public opinion',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the ethical implications of the work done by influential figures in AI and how have they shaped public opinion?',
									tool: 'search_web',
									query: [
										'ethical implications influential figures in AI public opinion',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the ethical implications of the work done by influential figures in AI and how have they shaped public opinion?',
									tool: 'search_web',
									query: ['ethical implications of AI influential figures'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the ethical implications of the work done by influential figures in AI and how have they shaped public opinion?',
									tool: 'search_web',
									query: ['ethical implications AI influential figures'],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'What role did influential figures play in the establishment of AI research institutions and their impact on the field?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What role did influential figures play in the establishment of AI research institutions and their impact on the field?',
									tool: 'search_web',
									query: [
										'influential figures in AI research institutions impact on field',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What role did influential figures play in the establishment of AI research institutions and their impact on the field?',
									tool: 'search_web',
									query: [
										'influential figures in AI research institutions impact on field',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What role did influential figures play in the establishment of AI research institutions and their impact on the field?',
									tool: 'search_web',
									query: ['key figures in AI research institutions'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What role did influential figures play in the establishment of AI research institutions and their impact on the field?',
									tool: 'search_web',
									query: [
										'influential figures in AI history and their contributions',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What role did influential figures play in the establishment of AI research institutions and their impact on the field?',
									tool: 'search_web',
									query: [
										'impact of influential figures on AI research institutions',
									],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'How have the contributions of key individuals in AI influenced policy-making and regulations regarding artificial intelligence?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'How have the contributions of key individuals in AI influenced policy-making and regulations regarding artificial intelligence?',
									tool: 'search_web',
									query: [
										'key individuals in AI contributions policy-making regulations',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How have the contributions of key individuals in AI influenced policy-making and regulations regarding artificial intelligence?',
									tool: 'search_web',
									query: [
										'influential individuals in AI contributions to policy-making and regulations',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How have the contributions of key individuals in AI influenced policy-making and regulations regarding artificial intelligence?',
									tool: 'search_web',
									query: ['influential figures in AI policy-making regulations'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How have the contributions of key individuals in AI influenced policy-making and regulations regarding artificial intelligence?',
									tool: 'search_web',
									query: [
										'AI influential individuals contributions policy regulations',
									],
									sources: [],
								},
							},
						],
					},
				],
				section_id: 'IKpe',
			},
			{
				section: 'Introduction to the History of AI',
				refined_sub_queries: [
					{
						refined_sub_query:
							'What philosophical theories, such as those from Descartes or Turing, specifically influenced the early development of artificial intelligence?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What philosophical theories, such as those from Descartes or Turing, specifically influenced the early development of artificial intelligence?',
									tool: 'search_web',
									query: [
										'philosophical theories Descartes Turing influence early artificial intelligence',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What philosophical theories, such as those from Descartes or Turing, specifically influenced the early development of artificial intelligence?',
									tool: 'search_web',
									query: [
										'philosophical theories Descartes Turing influence early artificial intelligence',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What philosophical theories, such as those from Descartes or Turing, specifically influenced the early development of artificial intelligence?',
									tool: 'search_web',
									query: [
										'philosophical influences on artificial intelligence Descartes Turing',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What philosophical theories, such as those from Descartes or Turing, specifically influenced the early development of artificial intelligence?',
									tool: 'search_web',
									query: ['Descartes Turing philosophy artificial intelligence'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What philosophical theories, such as those from Descartes or Turing, specifically influenced the early development of artificial intelligence?',
									tool: 'search_web',
									query: ['philosophical foundations of artificial intelligence'],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'What were the specific goals of early AI projects, such as the Dartmouth Conference, and how did they shape the direction of AI research?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What were the specific goals of early AI projects, such as the Dartmouth Conference, and how did they shape the direction of AI research?',
									tool: 'search_web',
									query: [
										'Dartmouth Conference early AI projects goals impact on AI research',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the specific goals of early AI projects, such as the Dartmouth Conference, and how did they shape the direction of AI research?',
									tool: 'search_web',
									query: ['Dartmouth Conference AI goals impact on research'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the specific goals of early AI projects, such as the Dartmouth Conference, and how did they shape the direction of AI research?',
									tool: 'search_web',
									query: ['Dartmouth Conference 1956 AI goals significance'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the specific goals of early AI projects, such as the Dartmouth Conference, and how did they shape the direction of AI research?',
									tool: 'search_web',
									query: ['Dartmouth Conference AI research goals impact'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the specific goals of early AI projects, such as the Dartmouth Conference, and how did they shape the direction of AI research?',
									tool: 'search_web',
									query: ['Dartmouth Conference AI early goals significance'],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'What were the most significant technical challenges faced by early AI researchers, and how did they attempt to overcome them?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What were the most significant technical challenges faced by early AI researchers, and how did they attempt to overcome them?',
									tool: 'search_web',
									query: ['early AI researchers technical challenges solutions'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the most significant technical challenges faced by early AI researchers, and how did they attempt to overcome them?',
									tool: 'search_web',
									query: ['early AI research challenges solutions'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the most significant technical challenges faced by early AI researchers, and how did they attempt to overcome them?',
									tool: 'search_web',
									query: ['technical challenges faced by early AI researchers'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the most significant technical challenges faced by early AI researchers, and how did they attempt to overcome them?',
									tool: 'search_web',
									query: ['early artificial intelligence challenges solutions'],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'Who were the key figures in the early history of AI, such as Alan Turing and John McCarthy, and what specific contributions did they make to the field?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'Who were the key figures in the early history of AI, such as Alan Turing and John McCarthy, and what specific contributions did they make to the field?',
									tool: 'search_web',
									query: [
										'key figures in early history of AI Alan Turing John McCarthy contributions',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'Who were the key figures in the early history of AI, such as Alan Turing and John McCarthy, and what specific contributions did they make to the field?',
									tool: 'search_web',
									query: [
										'key figures in early history of AI Alan Turing John McCarthy contributions',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'Who were the key figures in the early history of AI, such as Alan Turing and John McCarthy, and what specific contributions did they make to the field?',
									tool: 'search_web',
									query: ['Alan Turing John McCarthy contributions to AI'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'Who were the key figures in the early history of AI, such as Alan Turing and John McCarthy, and what specific contributions did they make to the field?',
									tool: 'search_web',
									query: ['Alan Turing John McCarthy early AI contributions'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'Who were the key figures in the early history of AI, such as Alan Turing and John McCarthy, and what specific contributions did they make to the field?',
									tool: 'search_web',
									query: ['history of AI key figures contributions'],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'What were the societal perceptions and ethical considerations regarding artificial intelligence during its early development, and how did these influence research directions?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What were the societal perceptions and ethical considerations regarding artificial intelligence during its early development, and how did these influence research directions?',
									tool: 'search_web',
									query: [
										'societal perceptions ethical considerations artificial intelligence early development',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the societal perceptions and ethical considerations regarding artificial intelligence during its early development, and how did these influence research directions?',
									tool: 'search_web',
									query: [
										'societal perceptions ethical considerations artificial intelligence early development',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the societal perceptions and ethical considerations regarding artificial intelligence during its early development, and how did these influence research directions?',
									tool: 'search_web',
									query: [
										'early artificial intelligence societal perceptions ethical considerations',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the societal perceptions and ethical considerations regarding artificial intelligence during its early development, and how did these influence research directions?',
									tool: 'search_web',
									query: [
										'history of artificial intelligence societal perceptions ethics',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the societal perceptions and ethical considerations regarding artificial intelligence during its early development, and how did these influence research directions?',
									tool: 'search_web',
									query: [
										'early AI development societal perceptions ethical issues',
									],
									sources: [],
								},
							},
						],
					},
				],
				section_id: '5qp4',
			},
			{
				section: 'Foundational Milestones in AI Development',
				refined_sub_queries: [
					{
						refined_sub_query:
							'What were the specific societal impacts of early AI programs developed after the Dartmouth Conference?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What were the specific societal impacts of early AI programs developed after the Dartmouth Conference?',
									tool: 'search_web',
									query: [
										'societal impacts early AI programs after Dartmouth Conference',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the specific societal impacts of early AI programs developed after the Dartmouth Conference?',
									tool: 'search_web',
									query: [
										'societal impacts early AI programs after Dartmouth Conference',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the specific societal impacts of early AI programs developed after the Dartmouth Conference?',
									tool: 'search_web',
									query: [
										'societal impacts of early AI programs post-Dartmouth Conference',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the specific societal impacts of early AI programs developed after the Dartmouth Conference?',
									tool: 'search_web',
									query: ['Dartmouth Conference AI societal impacts'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the specific societal impacts of early AI programs developed after the Dartmouth Conference?',
									tool: 'search_web',
									query: ['early AI programs societal impacts'],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'What were the key challenges and limitations faced by expert systems that contributed to their decline?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What were the key challenges and limitations faced by expert systems that contributed to their decline?',
									tool: 'search_web',
									query: ['challenges limitations expert systems decline'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the key challenges and limitations faced by expert systems that contributed to their decline?',
									tool: 'search_web',
									query: ['expert systems decline challenges limitations'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the key challenges and limitations faced by expert systems that contributed to their decline?',
									tool: 'search_web',
									query: ['expert systems limitations challenges decline'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the key challenges and limitations faced by expert systems that contributed to their decline?',
									tool: 'search_web',
									query: ['limitations of expert systems'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the key challenges and limitations faced by expert systems that contributed to their decline?',
									tool: 'search_web',
									query: ['expert systems decline reasons'],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'How did the introduction of machine learning influence the development of AI applications in various industries?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'How did the introduction of machine learning influence the development of AI applications in various industries?',
									tool: 'search_web',
									query: [
										'impact of machine learning on AI applications in industries',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How did the introduction of machine learning influence the development of AI applications in various industries?',
									tool: 'search_web',
									query: [
										'impact of machine learning on AI applications in industries',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How did the introduction of machine learning influence the development of AI applications in various industries?',
									tool: 'search_web',
									query: [
										'machine learning influence on AI applications in industries',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How did the introduction of machine learning influence the development of AI applications in various industries?',
									tool: 'search_web',
									query: [
										'machine learning impact on AI applications in various industries',
									],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'What are some notable case studies that illustrate the societal impacts of major AI milestones?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What are some notable case studies that illustrate the societal impacts of major AI milestones?',
									tool: 'search_web',
									query: ['notable case studies societal impacts AI milestones'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are some notable case studies that illustrate the societal impacts of major AI milestones?',
									tool: 'search_web',
									query: ['case studies societal impacts AI milestones'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are some notable case studies that illustrate the societal impacts of major AI milestones?',
									tool: 'search_web',
									query: ['case studies AI milestones societal impacts'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are some notable case studies that illustrate the societal impacts of major AI milestones?',
									tool: 'search_web',
									query: ['AI milestones case studies societal impacts'],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'What were the technological breakthroughs that enabled the transition from expert systems to machine learning in AI?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What were the technological breakthroughs that enabled the transition from expert systems to machine learning in AI?',
									tool: 'search_web',
									query: [
										'technological breakthroughs transition expert systems to machine learning AI',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the technological breakthroughs that enabled the transition from expert systems to machine learning in AI?',
									tool: 'search_web',
									query: [
										'technological breakthroughs expert systems to machine learning AI',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the technological breakthroughs that enabled the transition from expert systems to machine learning in AI?',
									tool: 'search_web',
									query: [
										'transition from expert systems to machine learning AI breakthroughs',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What were the technological breakthroughs that enabled the transition from expert systems to machine learning in AI?',
									tool: 'search_web',
									query: [
										'breakthroughs in AI from expert systems to machine learning',
									],
									sources: [],
								},
							},
						],
					},
				],
				section_id: 'ovCT',
			},
			{
				section: 'Technological Breakthroughs in AI',
				refined_sub_queries: [
					{
						refined_sub_query:
							'What are the specific applications of expert systems in industries such as healthcare and finance?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What are the specific applications of expert systems in industries such as healthcare and finance?',
									tool: 'search_web',
									query: [
										'applications of expert systems in healthcare and finance',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the specific applications of expert systems in industries such as healthcare and finance?',
									tool: 'search_web',
									query: ['expert systems applications in healthcare finance'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the specific applications of expert systems in industries such as healthcare and finance?',
									tool: 'search_web',
									query: ['expert systems in healthcare finance applications'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the specific applications of expert systems in industries such as healthcare and finance?',
									tool: 'search_web',
									query: [
										'applications of expert systems in healthcare and finance',
									],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'How have neural networks been applied in real-world scenarios, particularly in image and speech recognition?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'How have neural networks been applied in real-world scenarios, particularly in image and speech recognition?',
									tool: 'search_web',
									query: [
										'neural networks applications image speech recognition',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How have neural networks been applied in real-world scenarios, particularly in image and speech recognition?',
									tool: 'search_web',
									query: [
										'neural networks applications in image and speech recognition',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How have neural networks been applied in real-world scenarios, particularly in image and speech recognition?',
									tool: 'search_web',
									query: [
										'neural networks real world applications image recognition speech recognition',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How have neural networks been applied in real-world scenarios, particularly in image and speech recognition?',
									tool: 'search_web',
									query: [
										'neural networks applications in image recognition and speech recognition',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How have neural networks been applied in real-world scenarios, particularly in image and speech recognition?',
									tool: 'search_web',
									query: [
										'neural networks applications image recognition speech recognition 2025',
									],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'What are the most impactful applications of deep learning in sectors like autonomous vehicles and robotics?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What are the most impactful applications of deep learning in sectors like autonomous vehicles and robotics?',
									tool: 'search_web',
									query: [
										'impactful applications of deep learning in autonomous vehicles and robotics',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the most impactful applications of deep learning in sectors like autonomous vehicles and robotics?',
									tool: 'search_web',
									query: [
										'deep learning applications in autonomous vehicles and robotics',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the most impactful applications of deep learning in sectors like autonomous vehicles and robotics?',
									tool: 'search_web',
									query: [
										'deep learning applications in autonomous vehicles robotics',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the most impactful applications of deep learning in sectors like autonomous vehicles and robotics?',
									tool: 'search_web',
									query: ['deep learning in autonomous vehicles and robotics'],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What are the most impactful applications of deep learning in sectors like autonomous vehicles and robotics?',
									tool: 'search_web',
									query: [
										'applications of deep learning in autonomous vehicles and robotics',
									],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'How is natural language processing utilized in customer service and virtual assistants, and what are its limitations?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'How is natural language processing utilized in customer service and virtual assistants, and what are its limitations?',
									tool: 'search_web',
									query: [
										'natural language processing in customer service virtual assistants limitations',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How is natural language processing utilized in customer service and virtual assistants, and what are its limitations?',
									tool: 'search_web',
									query: [
										'natural language processing customer service virtual assistants limitations',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How is natural language processing utilized in customer service and virtual assistants, and what are its limitations?',
									tool: 'search_web',
									query: [
										'NLP applications in customer service and virtual assistants',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How is natural language processing utilized in customer service and virtual assistants, and what are its limitations?',
									tool: 'search_web',
									query: [
										'natural language processing customer service virtual assistants',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'How is natural language processing utilized in customer service and virtual assistants, and what are its limitations?',
									tool: 'search_web',
									query: ['NLP in customer service and virtual assistants'],
									sources: [],
								},
							},
						],
					},
					{
						refined_sub_query:
							'What potential risks and ethical considerations arise from the deployment of AI technologies like deep learning and NLP in society?',
						readings: [
							{
								reading: {
									refined_sub_query:
										'What potential risks and ethical considerations arise from the deployment of AI technologies like deep learning and NLP in society?',
									tool: 'search_web',
									query: [
										'risks ethical considerations AI technologies deep learning NLP',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What potential risks and ethical considerations arise from the deployment of AI technologies like deep learning and NLP in society?',
									tool: 'search_web',
									query: [
										'risks ethical considerations AI technologies deep learning NLP',
									],
									sources: [],
								},
							},
							{
								reading: {
									refined_sub_query:
										'What potential risks and ethical considerations arise from the deployment of AI technologies like deep learning and NLP in society?',
									tool: 'search_web',
									query: [
										'ethical risks AI deep learning natural language processing',
									],
									sources: [],
								},
							},
						],
					},
				],
				section_id: 'z31B',
			},
		],
	};
	return (
		<div className="deep-research-container">
			<div className="chain-of-thought">
				<div className="cot-container">
					{data?.cot?.map((item, index) => (
						<div className="cot" key={index}>
							<div className="logo-container">
								<div className="indicator" />
							</div>
							<div className="content">
								<div
									className="line"
									style={{
										...(index === data?.cot?.length - 1 && {
											display: data?.sections?.length > 0 ? 'block' : 'none',
										}),
									}}
								/>
								<div className="step">
									<Markdown citations={item?.citations || []}>
										{item?.step || ''}
									</Markdown>

									{item?.tool && (
										<div className="tool-container">
											<div className="tool-name">
												{item?.tool === 'search_web'
													? 'Searched Web For :'
													: item?.tool === 'search_knowledge_base'
													? 'Searched Knowledge Base For :'
													: 'Searched For :'}
											</div>
											{item?.queries?.length > 0 && (
												<div className="queries-container">
													{item?.queries?.map((query, idx) => (
														<div key={idx} className="query">
															{query}
														</div>
													))}
												</div>
											)}
										</div>
									)}

									{item?.sources?.length > 0 && (
										<div className="sources-container">
											<div className="text-container">Sources</div>
											<div className="sources">
												{item?.sources?.map?.((source, index) => {
													return (
														<div
															className="source"
															key={index}
															onClick={() => {
																window?.open(source, '_blank');
															}}
														>
															<div className="icon">
																{getFaviconUrl(source) ? (
																	<img
																		src={getFaviconUrl(source)}
																		alt="favicon"
																		className="favicon-image"
																	/>
																) : (
																	<div className="company-icon">
																		{getWebsiteName(
																			source,
																		)?.charAt(0)}
																	</div>
																)}
															</div>
															<div className="website-name">
																{getWebsiteName(source)}
															</div>
														</div>
													);
												})}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="sections">
				{data?.sections?.map((sec, index) => {
					const { sub_queries, section } = sec;
					return (
						<div className="section" key={index}>
							<div className="logo-container">
								<div className="indicator" />
							</div>
							<div className="section-content">
								<div className="section-title">{section || ''}</div>
								<div className="sub-queries">
									{sub_queries?.map((subQuery, idx) => {
										const { sub_query, readings } = subQuery || {};
										return (
											<div className="sub-query" key={idx}>
												<div className="sub-query-title">
													<div className="sub-query-logo">
														<HashTagSvg />
													</div>
													<div className="title-text">
														{sub_query || ''}
													</div>
												</div>
												<div className="sub-query-readings">
													{readings?.map((reading, idx) => {
														const { tool, query, sources } =
															reading?.reading || {};
														return (
															<div className="reading" key={idx}>
																{query?.length > 0 && (
																	<div className="queries-wrapper">
																		<div className="tool-container">
																			{tool ===
																			'search_web' ? (
																				<div className="search">
																					<div className="svg">
																						<WebSvg />
																					</div>
																					<div className="search-text">
																						Searched Web
																						For :
																					</div>
																				</div>
																			) : tool ===
																			  'search_knowledge_base' ? (
																				<div className="search">
																					<div className="svg">
																						<BookSvg />
																					</div>
																					<div className="search-text">
																						Searched
																						Knowledge
																						Base For :
																					</div>
																				</div>
																			) : (
																				''
																			)}
																		</div>

																		<div className="queries-container">
																			{query?.map(
																				(
																					queryItem,
																					idx,
																				) => (
																					<div
																						key={idx}
																						className="query"
																					>
																						{queryItem ||
																							''}
																					</div>
																				),
																			)}
																		</div>
																	</div>
																)}

																{sources?.length > 0 && (
																	<div className="sources-container">
																		<div className="source-text">
																			Sources
																		</div>
																		<div className="sources">
																			{sources?.map?.(
																				(source, index) => {
																					return (
																						<div
																							className="source"
																							key={
																								index
																							}
																							onClick={() => {
																								window?.open(
																									source,
																									'_blank',
																								);
																							}}
																						>
																							<div className="icon">
																								{getFaviconUrl(
																									source,
																								) ? (
																									<img
																										src={getFaviconUrl(
																											source,
																										)}
																										alt="favicon"
																										className="favicon-image"
																									/>
																								) : (
																									<div className="company-icon">
																										{getWebsiteName(
																											source,
																										)?.charAt(
																											0,
																										)}
																									</div>
																								)}
																							</div>
																							<div className="website-name">
																								{getWebsiteName(
																									source,
																								)}
																							</div>
																						</div>
																					);
																				},
																			)}
																		</div>
																	</div>
																)}
															</div>
														);
													})}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default memo(DeepResearchChainOfThought);
