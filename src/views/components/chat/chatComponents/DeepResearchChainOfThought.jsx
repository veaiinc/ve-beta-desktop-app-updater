import { memo } from 'react';
import '../../../../assets/scss/chat/chatComponents/deepResearchChainOfThought.scss';
import { Markdown } from '../../../../helpers/markdownHelper';
// const deepResearch = {
// 	cot: [
// 		{
// 			step: 'To create a comprehensive report plan for an essay on Artificial Intelligence (AI), I need to first gather up-to-date and authoritative information on the topic. This will help me identify the key themes, historical context, current applications, ethical considerations, and future prospects of AI. I will start by searching the web for a general overview of Artificial Intelligence, focusing on its definition, history, and major developments. This foundational information will guide the structure and depth of the report outline.',
// 			tool: 'search_web',
// 			queries: ['Artificial Intelligence overview, history, and key developments'],
// 			sources: [],
// 		},
// 		{
// 			step: 'It seems there was an issue retrieving information from the web. To ensure a thorough and accurate report plan, I will attempt the search again, refining my query to focus on the essential aspects of Artificial Intelligence, such as its definition, evolution, and major milestones. This will help me gather the necessary context to build a well-structured outline for the essay.',
// 			tool: 'search_web',
// 			queries: ['What is Artificial Intelligence? History, applications, and ethical issues'],
// 			sources: [],
// 		},
// 		{
// 			step: 'I have gathered sufficient information about Artificial Intelligence from my internal knowledge base. I have decided to approach the report by outlining the key aspects that define, contextualize, and analyze AI.',
// 			citations: [],
// 		},
// 		{
// 			step: 'I will begin by introducing Artificial Intelligence, providing a clear definition and explaining its significance in the modern world.',
// 			citations: [],
// 		},
// 		{
// 			step: 'Next, I will explore the historical development of AI, highlighting major milestones, influential figures, and technological breakthroughs that have shaped the field.',
// 			citations: [],
// 		},
// 		{
// 			step: 'I will then examine the core technologies and methodologies that underpin AI, such as machine learning, neural networks, and natural language processing.',
// 			citations: [],
// 		},
// 		{
// 			step: 'A section will be dedicated to real-world applications of AI, showcasing its impact across various industries including healthcare, finance, transportation, and entertainment.',
// 			citations: [],
// 		},
// 		{
// 			step: 'Ethical considerations and societal implications will be addressed, discussing issues such as bias, privacy, job displacement, and the need for responsible AI development.',
// 			citations: [],
// 		},
// 		{
// 			step: 'I will also analyze the challenges and limitations facing AI today, including technical, ethical, and regulatory hurdles.',
// 			citations: [],
// 		},
// 		{
// 			step: 'The report will include a section on the future of AI, exploring emerging trends, potential advancements, and speculative scenarios.',
// 			citations: [],
// 		},
// 		{
// 			step: 'Throughout the report, I will ensure that each section builds upon the previous one, creating a coherent and engaging narrative.',
// 			citations: [],
// 		},
// 		{
// 			step: 'I will highlight interconnections between the historical context, technological foundations, applications, and ethical debates to provide a holistic understanding of AI.',
// 			citations: [],
// 		},
// 		{
// 			step: 'The conclusion will synthesize the key findings, reflect on the broader implications, and offer recommendations or predictions for the future of AI.',
// 			citations: [],
// 		},
// 		{
// 			step: 'I have formulated a plan to write the report as follows:',
// 			citations: [],
// 		},
// 		{
// 			step: 'Introduction to Artificial Intelligence\nHistorical Evolution of AI\nCore Technologies and Methodologies in AI\nApplications of Artificial Intelligence\nEthical and Societal Implications of AI\nChallenges and Limitations of AI\nThe Future of Artificial Intelligence\nConclusion',
// 			citations: [],
// 		},
// 	],
// 	sections: [
// 		{
// 			section: 'The Future of Artificial Intelligence',
// 			sub_queries: [
// 				{
// 					sub_query:
// 						'What are the current emerging trends in artificial intelligence as identified by experts?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the current emerging trends in artificial intelligence as identified by experts?',
// 								tool: 'search_web',
// 								query: ['emerging trends in artificial intelligence 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the current emerging trends in artificial intelligence as identified by experts?',
// 								tool: 'search_web',
// 								query: ['emerging trends in artificial intelligence 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the current emerging trends in artificial intelligence as identified by experts?',
// 								tool: 'search_web',
// 								query: ['current trends in artificial intelligence 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the current emerging trends in artificial intelligence as identified by experts?',
// 								tool: 'search_web',
// 								query: ['artificial intelligence trends 2025'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					sub_query:
// 						'What potential advancements in artificial intelligence are predicted for the next decade?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'What potential advancements in artificial intelligence are predicted for the next decade?',
// 								tool: 'search_web',
// 								query: [
// 									'predicted advancements in artificial intelligence next decade 2030',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What potential advancements in artificial intelligence are predicted for the next decade?',
// 								tool: 'search_web',
// 								query: ['future advancements in artificial intelligence 2030'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What potential advancements in artificial intelligence are predicted for the next decade?',
// 								tool: 'search_web',
// 								query: ['future trends in artificial intelligence 2030'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What potential advancements in artificial intelligence are predicted for the next decade?',
// 								tool: 'search_web',
// 								query: ['emerging trends in artificial intelligence 2030'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What potential advancements in artificial intelligence are predicted for the next decade?',
// 								tool: 'search_web',
// 								query: ['artificial intelligence advancements predictions 2030'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					sub_query:
// 						'What are the optimistic and cautionary perspectives regarding the future impact of artificial intelligence on society?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the optimistic and cautionary perspectives regarding the future impact of artificial intelligence on society?',
// 								tool: 'search_web',
// 								query: [
// 									'optimistic and cautionary perspectives future impact of artificial intelligence on society',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the optimistic and cautionary perspectives regarding the future impact of artificial intelligence on society?',
// 								tool: 'search_web',
// 								query: [
// 									'optimistic and cautionary perspectives future impact of artificial intelligence on society',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the optimistic and cautionary perspectives regarding the future impact of artificial intelligence on society?',
// 								tool: 'search_web',
// 								query: [
// 									'future impact of artificial intelligence on society optimistic cautionary perspectives',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the optimistic and cautionary perspectives regarding the future impact of artificial intelligence on society?',
// 								tool: 'search_web',
// 								query: ['future impact of artificial intelligence on society'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the optimistic and cautionary perspectives regarding the future impact of artificial intelligence on society?',
// 								tool: 'search_web',
// 								query: [
// 									'AI future impact society optimistic cautionary perspectives',
// 								],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 			],
// 			section_id: 'tpDr',
// 		},
// 		{
// 			section: 'Introduction to Artificial Intelligence',
// 			sub_queries: [
// 				{
// 					sub_query:
// 						'What is the definition of Artificial Intelligence and its key components?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'What is the definition of Artificial Intelligence and its key components?',
// 								tool: 'search_web',
// 								query: [
// 									'definition of Artificial Intelligence and its key components',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What is the definition of Artificial Intelligence and its key components?',
// 								tool: 'search_web',
// 								query: [
// 									'definition of Artificial Intelligence and its key components',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What is the definition of Artificial Intelligence and its key components?',
// 								tool: 'search_web',
// 								query: [
// 									'definition of Artificial Intelligence and its key components',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What is the definition of Artificial Intelligence and its key components?',
// 								tool: 'search_web',
// 								query: ['Artificial Intelligence definition and key components'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What is the definition of Artificial Intelligence and its key components?',
// 								tool: 'search_web',
// 								query: ['Artificial Intelligence definition and components'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					sub_query:
// 						'What are the current applications of Artificial Intelligence in various industries?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the current applications of Artificial Intelligence in various industries?',
// 								tool: 'search_web',
// 								query: [
// 									'current applications of Artificial Intelligence in various industries 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the current applications of Artificial Intelligence in various industries?',
// 								tool: 'search_web',
// 								query: [
// 									'current applications of Artificial Intelligence in various industries 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the current applications of Artificial Intelligence in various industries?',
// 								tool: 'search_web',
// 								query: [
// 									'current applications of Artificial Intelligence in various industries 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					sub_query:
// 						'What are the societal implications and ethical considerations associated with the use of Artificial Intelligence?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the societal implications and ethical considerations associated with the use of Artificial Intelligence?',
// 								tool: 'search_web',
// 								query: [
// 									'societal implications ethical considerations Artificial Intelligence',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the societal implications and ethical considerations associated with the use of Artificial Intelligence?',
// 								tool: 'search_web',
// 								query: [
// 									'societal implications ethical considerations Artificial Intelligence',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the societal implications and ethical considerations associated with the use of Artificial Intelligence?',
// 								tool: 'search_web',
// 								query: [
// 									'societal implications ethical considerations Artificial Intelligence',
// 								],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 			],
// 			section_id: 'SVkh',
// 		},
// 		{
// 			section: 'Challenges and Limitations of AI',
// 			sub_queries: [
// 				{
// 					sub_query:
// 						'What are the current technical challenges and limitations facing artificial intelligence development?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the current technical challenges and limitations facing artificial intelligence development?',
// 								tool: 'search_web',
// 								query: [
// 									'current technical challenges limitations artificial intelligence 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the current technical challenges and limitations facing artificial intelligence development?',
// 								tool: 'search_web',
// 								query: [
// 									'current technical challenges limitations artificial intelligence 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the current technical challenges and limitations facing artificial intelligence development?',
// 								tool: 'search_web',
// 								query: [
// 									'technical challenges limitations artificial intelligence 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					sub_query:
// 						'What ethical concerns are associated with the deployment of artificial intelligence technologies?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'What ethical concerns are associated with the deployment of artificial intelligence technologies?',
// 								tool: 'search_web',
// 								query: [
// 									'ethical concerns associated with artificial intelligence deployment',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What ethical concerns are associated with the deployment of artificial intelligence technologies?',
// 								tool: 'search_web',
// 								query: [
// 									'ethical concerns associated with artificial intelligence deployment',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What ethical concerns are associated with the deployment of artificial intelligence technologies?',
// 								tool: 'search_web',
// 								query: ['ethical issues in artificial intelligence'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					sub_query:
// 						'What regulatory barriers exist that impact the implementation and advancement of artificial intelligence?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'What regulatory barriers exist that impact the implementation and advancement of artificial intelligence?',
// 								tool: 'search_web',
// 								query: ['regulatory barriers artificial intelligence 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What regulatory barriers exist that impact the implementation and advancement of artificial intelligence?',
// 								tool: 'search_web',
// 								query: ['regulatory barriers artificial intelligence 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What regulatory barriers exist that impact the implementation and advancement of artificial intelligence?',
// 								tool: 'search_web',
// 								query: ['regulatory challenges artificial intelligence 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What regulatory barriers exist that impact the implementation and advancement of artificial intelligence?',
// 								tool: 'search_web',
// 								query: ['AI regulatory barriers 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What regulatory barriers exist that impact the implementation and advancement of artificial intelligence?',
// 								tool: 'search_web',
// 								query: ['current regulatory challenges in artificial intelligence'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 			],
// 			section_id: 'EQIb',
// 		},
// 		{
// 			section: 'Historical Evolution of AI',
// 			sub_queries: [
// 				{
// 					sub_query:
// 						'What are the key historical milestones in the development of artificial intelligence from its inception to the present day?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the key historical milestones in the development of artificial intelligence from its inception to the present day?',
// 								tool: 'search_web',
// 								query: [
// 									'key historical milestones in the development of artificial intelligence',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the key historical milestones in the development of artificial intelligence from its inception to the present day?',
// 								tool: 'search_web',
// 								query: ['history of artificial intelligence milestones'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the key historical milestones in the development of artificial intelligence from its inception to the present day?',
// 								tool: 'search_web',
// 								query: ['historical milestones in artificial intelligence'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the key historical milestones in the development of artificial intelligence from its inception to the present day?',
// 								tool: 'search_web',
// 								query: ['timeline of artificial intelligence development'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					sub_query:
// 						'Who are the influential researchers in the field of artificial intelligence, and what contributions have they made?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'Who are the influential researchers in the field of artificial intelligence, and what contributions have they made?',
// 								tool: 'search_web',
// 								query: [
// 									'influential researchers in artificial intelligence contributions',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'Who are the influential researchers in the field of artificial intelligence, and what contributions have they made?',
// 								tool: 'search_web',
// 								query: [
// 									'key researchers in artificial intelligence and their contributions',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'Who are the influential researchers in the field of artificial intelligence, and what contributions have they made?',
// 								tool: 'search_web',
// 								query: ['influential AI researchers and their contributions'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'Who are the influential researchers in the field of artificial intelligence, and what contributions have they made?',
// 								tool: 'search_web',
// 								query: ['important figures in artificial intelligence history'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'Who are the influential researchers in the field of artificial intelligence, and what contributions have they made?',
// 								tool: 'search_web',
// 								query: ['notable AI researchers and their contributions'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					sub_query:
// 						'What major technological breakthroughs have significantly advanced artificial intelligence, and how have they impacted its evolution?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'What major technological breakthroughs have significantly advanced artificial intelligence, and how have they impacted its evolution?',
// 								tool: 'search_web',
// 								query: [
// 									'major technological breakthroughs in artificial intelligence',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What major technological breakthroughs have significantly advanced artificial intelligence, and how have they impacted its evolution?',
// 								tool: 'search_web',
// 								query: ['key milestones in artificial intelligence development'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What major technological breakthroughs have significantly advanced artificial intelligence, and how have they impacted its evolution?',
// 								tool: 'search_web',
// 								query: ['historical milestones in artificial intelligence'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What major technological breakthroughs have significantly advanced artificial intelligence, and how have they impacted its evolution?',
// 								tool: 'search_web',
// 								query: ['history of artificial intelligence breakthroughs'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What major technological breakthroughs have significantly advanced artificial intelligence, and how have they impacted its evolution?',
// 								tool: 'search_web',
// 								query: [
// 									'artificial intelligence technological advancements timeline',
// 								],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 			],
// 			section_id: 'tMcZ',
// 		},
// 		{
// 			section: 'Core Technologies and Methodologies in AI',
// 			sub_queries: [
// 				{
// 					sub_query:
// 						'What are the key principles and methodologies of machine learning in the context of artificial intelligence?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the key principles and methodologies of machine learning in the context of artificial intelligence?',
// 								tool: 'search_web',
// 								query: [
// 									'key principles methodologies of machine learning in artificial intelligence',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the key principles and methodologies of machine learning in the context of artificial intelligence?',
// 								tool: 'search_web',
// 								query: [
// 									'key principles methodologies of machine learning in artificial intelligence',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the key principles and methodologies of machine learning in the context of artificial intelligence?',
// 								tool: 'search_web',
// 								query: [
// 									'machine learning principles methodologies artificial intelligence',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the key principles and methodologies of machine learning in the context of artificial intelligence?',
// 								tool: 'search_web',
// 								query: ['machine learning principles methodologies'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the key principles and methodologies of machine learning in the context of artificial intelligence?',
// 								tool: 'search_web',
// 								query: ['machine learning principles and methodologies'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					sub_query:
// 						'How do neural networks function, and what is their significance in the development of AI technologies?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'How do neural networks function, and what is their significance in the development of AI technologies?',
// 								tool: 'search_web',
// 								query: [
// 									'how do neural networks function significance in AI technologies',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'How do neural networks function, and what is their significance in the development of AI technologies?',
// 								tool: 'search_web',
// 								query: [
// 									'how do neural networks function significance in AI technologies',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'How do neural networks function, and what is their significance in the development of AI technologies?',
// 								tool: 'search_web',
// 								query: ['neural networks function significance AI technologies'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'How do neural networks function, and what is their significance in the development of AI technologies?',
// 								tool: 'search_web',
// 								query: ['neural networks how they work significance in AI'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'How do neural networks function, and what is their significance in the development of AI technologies?',
// 								tool: 'search_web',
// 								query: ['neural networks function significance AI technologies'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					sub_query:
// 						'What are the main applications and techniques of natural language processing, and how do they contribute to the advancement of AI?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the main applications and techniques of natural language processing, and how do they contribute to the advancement of AI?',
// 								tool: 'search_web',
// 								query: [
// 									'main applications and techniques of natural language processing 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the main applications and techniques of natural language processing, and how do they contribute to the advancement of AI?',
// 								tool: 'search_web',
// 								query: [
// 									'applications and techniques of natural language processing 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the main applications and techniques of natural language processing, and how do they contribute to the advancement of AI?',
// 								tool: 'search_web',
// 								query: ['natural language processing applications techniques 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the main applications and techniques of natural language processing, and how do they contribute to the advancement of AI?',
// 								tool: 'search_web',
// 								query: ['natural language processing applications techniques 2024'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the main applications and techniques of natural language processing, and how do they contribute to the advancement of AI?',
// 								tool: 'search_web',
// 								query: ['natural language processing applications techniques 2023'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 			],
// 			section_id: 'fgMO',
// 		},
// 		{
// 			section: 'Applications of Artificial Intelligence',
// 			sub_queries: [
// 				{
// 					sub_query:
// 						'What are the key applications of AI in the healthcare industry, and what are some notable case studies?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the key applications of AI in the healthcare industry, and what are some notable case studies?',
// 								tool: 'search_web',
// 								query: ['AI applications in healthcare industry case studies 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the key applications of AI in the healthcare industry, and what are some notable case studies?',
// 								tool: 'search_web',
// 								query: ['AI applications in healthcare industry case studies'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the key applications of AI in the healthcare industry, and what are some notable case studies?',
// 								tool: 'search_web',
// 								query: ['AI in healthcare applications case studies 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the key applications of AI in the healthcare industry, and what are some notable case studies?',
// 								tool: 'search_web',
// 								query: ['AI healthcare applications case studies 2024'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the key applications of AI in the healthcare industry, and what are some notable case studies?',
// 								tool: 'search_web',
// 								query: ['AI applications in healthcare 2024'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					sub_query:
// 						'How is AI utilized in the finance sector, and what examples demonstrate its effectiveness?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'How is AI utilized in the finance sector, and what examples demonstrate its effectiveness?',
// 								tool: 'search_web',
// 								query: [
// 									'AI applications in finance sector examples effectiveness 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'How is AI utilized in the finance sector, and what examples demonstrate its effectiveness?',
// 								tool: 'search_web',
// 								query: ['AI applications in finance sector examples effectiveness'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'How is AI utilized in the finance sector, and what examples demonstrate its effectiveness?',
// 								tool: 'search_web',
// 								query: ['AI in finance sector applications case studies 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'How is AI utilized in the finance sector, and what examples demonstrate its effectiveness?',
// 								tool: 'search_web',
// 								query: ['AI applications in finance 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'How is AI utilized in the finance sector, and what examples demonstrate its effectiveness?',
// 								tool: 'search_web',
// 								query: ['AI in finance sector applications effectiveness 2025'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					sub_query:
// 						'What role does AI play in transportation, including specific technologies and case studies that highlight its impact?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'What role does AI play in transportation, including specific technologies and case studies that highlight its impact?',
// 								tool: 'search_web',
// 								query: ['AI in transportation technologies case studies 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What role does AI play in transportation, including specific technologies and case studies that highlight its impact?',
// 								tool: 'search_web',
// 								query: ['AI in transportation technologies case studies 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What role does AI play in transportation, including specific technologies and case studies that highlight its impact?',
// 								tool: 'search_web',
// 								query: ['AI applications in transportation 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What role does AI play in transportation, including specific technologies and case studies that highlight its impact?',
// 								tool: 'search_web',
// 								query: ['AI in transportation case studies 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What role does AI play in transportation, including specific technologies and case studies that highlight its impact?',
// 								tool: 'search_web',
// 								query: ['AI in transportation technologies impact case studies'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					sub_query:
// 						'In what ways is AI transforming the entertainment industry, and what are some significant examples of its application?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'In what ways is AI transforming the entertainment industry, and what are some significant examples of its application?',
// 								tool: 'search_web',
// 								query: [
// 									'AI transforming entertainment industry applications examples 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'In what ways is AI transforming the entertainment industry, and what are some significant examples of its application?',
// 								tool: 'search_web',
// 								query: [
// 									'AI transforming entertainment industry applications examples 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'In what ways is AI transforming the entertainment industry, and what are some significant examples of its application?',
// 								tool: 'search_web',
// 								query: ['AI in entertainment industry applications examples 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'In what ways is AI transforming the entertainment industry, and what are some significant examples of its application?',
// 								tool: 'search_web',
// 								query: ['AI applications in entertainment industry 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'In what ways is AI transforming the entertainment industry, and what are some significant examples of its application?',
// 								tool: 'search_web',
// 								query: ['AI impact on entertainment industry 2025'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 			],
// 			section_id: 'fnWc',
// 		},
// 		{
// 			section: 'Ethical and Societal Implications of AI',
// 			sub_queries: [
// 				{
// 					sub_query:
// 						'What are the ethical challenges associated with bias in AI systems, and how do they impact decision-making processes?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the ethical challenges associated with bias in AI systems, and how do they impact decision-making processes?',
// 								tool: 'search_web',
// 								query: [
// 									'ethical challenges bias in AI systems impact decision-making processes',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the ethical challenges associated with bias in AI systems, and how do they impact decision-making processes?',
// 								tool: 'search_web',
// 								query: [
// 									'ethical challenges bias in AI systems impact decision-making processes',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the ethical challenges associated with bias in AI systems, and how do they impact decision-making processes?',
// 								tool: 'search_web',
// 								query: ['bias in AI systems ethical challenges decision-making'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the ethical challenges associated with bias in AI systems, and how do they impact decision-making processes?',
// 								tool: 'search_web',
// 								query: ['AI bias ethical challenges decision-making impact'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					sub_query:
// 						'What are the privacy concerns related to AI technologies, and what measures can be implemented to protect user data?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the privacy concerns related to AI technologies, and what measures can be implemented to protect user data?',
// 								tool: 'search_web',
// 								query: [
// 									'privacy concerns AI technologies measures protect user data',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the privacy concerns related to AI technologies, and what measures can be implemented to protect user data?',
// 								tool: 'search_web',
// 								query: [
// 									'privacy concerns AI technologies measures protect user data',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the privacy concerns related to AI technologies, and what measures can be implemented to protect user data?',
// 								tool: 'search_web',
// 								query: ['AI privacy concerns and data protection measures'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'What are the privacy concerns related to AI technologies, and what measures can be implemented to protect user data?',
// 								tool: 'search_web',
// 								query: ['AI privacy concerns data protection measures'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					sub_query:
// 						'How does AI contribute to job displacement in various industries, and what strategies are proposed to mitigate its effects on the workforce?',
// 					readings: [
// 						{
// 							reading: {
// 								sub_query:
// 									'How does AI contribute to job displacement in various industries, and what strategies are proposed to mitigate its effects on the workforce?',
// 								tool: 'search_web',
// 								query: [
// 									'AI job displacement strategies mitigate effects workforce 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'How does AI contribute to job displacement in various industries, and what strategies are proposed to mitigate its effects on the workforce?',
// 								tool: 'search_web',
// 								query: [
// 									'AI job displacement strategies mitigate effects workforce 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'How does AI contribute to job displacement in various industries, and what strategies are proposed to mitigate its effects on the workforce?',
// 								tool: 'search_web',
// 								query: ['AI job displacement impact strategies 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'How does AI contribute to job displacement in various industries, and what strategies are proposed to mitigate its effects on the workforce?',
// 								tool: 'search_web',
// 								query: ['AI job displacement effects and mitigation strategies'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								sub_query:
// 									'How does AI contribute to job displacement in various industries, and what strategies are proposed to mitigate its effects on the workforce?',
// 								tool: 'search_web',
// 								query: ['AI job displacement impact and mitigation strategies'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 			],
// 			section_id: 'VUBp',
// 		},
// 	],
// 	sections_refined: [
// 		{
// 			section: 'Introduction to Artificial Intelligence',
// 			refined_sub_queries: [
// 				{
// 					refined_sub_query:
// 						'What are specific examples of Artificial Intelligence applications in healthcare, finance, and transportation?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are specific examples of Artificial Intelligence applications in healthcare, finance, and transportation?',
// 								tool: 'search_web',
// 								query: ['Artificial Intelligence applications in healthcare 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are specific examples of Artificial Intelligence applications in healthcare, finance, and transportation?',
// 								tool: 'search_web',
// 								query: ['Artificial Intelligence applications in finance 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are specific examples of Artificial Intelligence applications in healthcare, finance, and transportation?',
// 								tool: 'search_web',
// 								query: [
// 									'Artificial Intelligence applications in transportation 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are specific examples of Artificial Intelligence applications in healthcare, finance, and transportation?',
// 								tool: 'search_web',
// 								query: ['AI applications in healthcare 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are specific examples of Artificial Intelligence applications in healthcare, finance, and transportation?',
// 								tool: 'search_web',
// 								query: ['AI applications in finance 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are specific examples of Artificial Intelligence applications in healthcare, finance, and transportation?',
// 								tool: 'search_web',
// 								query: ['AI applications in transportation 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are specific examples of Artificial Intelligence applications in healthcare, finance, and transportation?',
// 								tool: 'search_web',
// 								query: ['current AI applications in healthcare'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are specific examples of Artificial Intelligence applications in healthcare, finance, and transportation?',
// 								tool: 'search_web',
// 								query: ['current AI applications in finance'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are specific examples of Artificial Intelligence applications in healthcare, finance, and transportation?',
// 								tool: 'search_web',
// 								query: ['current AI applications in transportation'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					refined_sub_query:
// 						'What are the ethical dilemmas and societal risks associated with the deployment of Artificial Intelligence technologies?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the ethical dilemmas and societal risks associated with the deployment of Artificial Intelligence technologies?',
// 								tool: 'search_web',
// 								query: [
// 									'ethical dilemmas societal risks Artificial Intelligence technologies 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the ethical dilemmas and societal risks associated with the deployment of Artificial Intelligence technologies?',
// 								tool: 'search_web',
// 								query: [
// 									'ethical dilemmas societal risks Artificial Intelligence technologies',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the ethical dilemmas and societal risks associated with the deployment of Artificial Intelligence technologies?',
// 								tool: 'search_web',
// 								query: [
// 									'ethical dilemmas societal risks Artificial Intelligence technologies 2024',
// 								],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					refined_sub_query:
// 						'How does the definition of Artificial Intelligence evolve with advancements in technology and research?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'How does the definition of Artificial Intelligence evolve with advancements in technology and research?',
// 								tool: 'search_web',
// 								query: [
// 									'definition of Artificial Intelligence evolution advancements technology research',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'How does the definition of Artificial Intelligence evolve with advancements in technology and research?',
// 								tool: 'search_web',
// 								query: [
// 									'definition of Artificial Intelligence evolution advancements technology research',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'How does the definition of Artificial Intelligence evolve with advancements in technology and research?',
// 								tool: 'search_web',
// 								query: [
// 									'Artificial Intelligence definition evolution technology research',
// 								],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 			],
// 			section_id: 'SVkh',
// 		},
// 		{
// 			section: 'Challenges and Limitations of AI',
// 			refined_sub_queries: [
// 				{
// 					refined_sub_query:
// 						'What are the potential risks associated with the deployment of artificial intelligence in various industries?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the potential risks associated with the deployment of artificial intelligence in various industries?',
// 								tool: 'search_web',
// 								query: [
// 									'risks associated with deployment of artificial intelligence in industries',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the potential risks associated with the deployment of artificial intelligence in various industries?',
// 								tool: 'search_web',
// 								query: [
// 									'risks associated with deployment of artificial intelligence in industries',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the potential risks associated with the deployment of artificial intelligence in various industries?',
// 								tool: 'search_web',
// 								query: [
// 									'risks of artificial intelligence deployment in industries',
// 								],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					refined_sub_query:
// 						'How do current technical limitations of AI impact its real-world applications and effectiveness?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'How do current technical limitations of AI impact its real-world applications and effectiveness?',
// 								tool: 'search_web',
// 								query: [
// 									'current technical limitations of AI impact real-world applications effectiveness 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'How do current technical limitations of AI impact its real-world applications and effectiveness?',
// 								tool: 'search_web',
// 								query: [
// 									'current technical limitations of AI impact real-world applications effectiveness 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'How do current technical limitations of AI impact its real-world applications and effectiveness?',
// 								tool: 'search_web',
// 								query: ['technical limitations of AI 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'How do current technical limitations of AI impact its real-world applications and effectiveness?',
// 								tool: 'search_web',
// 								query: ['AI technical limitations impact applications 2025'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					refined_sub_query:
// 						'What are the implications of existing ethical frameworks on the development and use of artificial intelligence technologies?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the implications of existing ethical frameworks on the development and use of artificial intelligence technologies?',
// 								tool: 'search_web',
// 								query: [
// 									'implications of ethical frameworks on artificial intelligence development and use',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the implications of existing ethical frameworks on the development and use of artificial intelligence technologies?',
// 								tool: 'search_web',
// 								query: ['ethical frameworks artificial intelligence implications'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the implications of existing ethical frameworks on the development and use of artificial intelligence technologies?',
// 								tool: 'search_web',
// 								query: ['ethical frameworks impact on artificial intelligence'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 			],
// 			section_id: 'EQIb',
// 		},
// 		{
// 			section: 'Historical Evolution of AI',
// 			refined_sub_queries: [
// 				{
// 					refined_sub_query:
// 						'What are the specific historical milestones in artificial intelligence development, including dates and events that marked significant progress?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the specific historical milestones in artificial intelligence development, including dates and events that marked significant progress?',
// 								tool: 'search_web',
// 								query: [
// 									'historical milestones in artificial intelligence development',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the specific historical milestones in artificial intelligence development, including dates and events that marked significant progress?',
// 								tool: 'search_web',
// 								query: [
// 									'historical milestones in artificial intelligence development',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the specific historical milestones in artificial intelligence development, including dates and events that marked significant progress?',
// 								tool: 'search_web',
// 								query: ['key milestones in artificial intelligence history'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the specific historical milestones in artificial intelligence development, including dates and events that marked significant progress?',
// 								tool: 'search_web',
// 								query: ['timeline of artificial intelligence milestones'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the specific historical milestones in artificial intelligence development, including dates and events that marked significant progress?',
// 								tool: 'search_web',
// 								query: ['artificial intelligence historical milestones'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					refined_sub_query:
// 						'Who are the key researchers in artificial intelligence, and what are their notable contributions and publications that have influenced the field?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'Who are the key researchers in artificial intelligence, and what are their notable contributions and publications that have influenced the field?',
// 								tool: 'search_web',
// 								query: [
// 									'key researchers in artificial intelligence notable contributions publications',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'Who are the key researchers in artificial intelligence, and what are their notable contributions and publications that have influenced the field?',
// 								tool: 'search_web',
// 								query: [
// 									'key researchers in artificial intelligence notable contributions publications',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'Who are the key researchers in artificial intelligence, and what are their notable contributions and publications that have influenced the field?',
// 								tool: 'search_web',
// 								query: [
// 									'key researchers in artificial intelligence contributions publications',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'Who are the key researchers in artificial intelligence, and what are their notable contributions and publications that have influenced the field?',
// 								tool: 'search_web',
// 								query: [
// 									'important researchers in artificial intelligence and their contributions',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'Who are the key researchers in artificial intelligence, and what are their notable contributions and publications that have influenced the field?',
// 								tool: 'search_web',
// 								query: [
// 									'key figures in artificial intelligence history contributions publications',
// 								],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					refined_sub_query:
// 						'What are the specific technological breakthroughs in artificial intelligence, including examples of applications and their impact on various industries?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the specific technological breakthroughs in artificial intelligence, including examples of applications and their impact on various industries?',
// 								tool: 'search_web',
// 								query: [
// 									'technological breakthroughs in artificial intelligence applications impact industries',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the specific technological breakthroughs in artificial intelligence, including examples of applications and their impact on various industries?',
// 								tool: 'search_web',
// 								query: [
// 									'technological breakthroughs in artificial intelligence applications impact industries',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the specific technological breakthroughs in artificial intelligence, including examples of applications and their impact on various industries?',
// 								tool: 'search_web',
// 								query: [
// 									'recent breakthroughs in artificial intelligence applications and their industry impact',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the specific technological breakthroughs in artificial intelligence, including examples of applications and their impact on various industries?',
// 								tool: 'search_web',
// 								query: [
// 									'AI technological breakthroughs applications impact industries',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the specific technological breakthroughs in artificial intelligence, including examples of applications and their impact on various industries?',
// 								tool: 'search_web',
// 								query: [
// 									'artificial intelligence breakthroughs applications impact',
// 								],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 			],
// 			section_id: 'tMcZ',
// 		},
// 		{
// 			section: 'Core Technologies and Methodologies in AI',
// 			refined_sub_queries: [
// 				{
// 					refined_sub_query:
// 						'What are some real-world case studies demonstrating the application of machine learning in various industries?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are some real-world case studies demonstrating the application of machine learning in various industries?',
// 								tool: 'search_web',
// 								query: [
// 									'real-world case studies machine learning applications industries',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are some real-world case studies demonstrating the application of machine learning in various industries?',
// 								tool: 'search_web',
// 								query: [
// 									'real-world case studies machine learning applications industries',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are some real-world case studies demonstrating the application of machine learning in various industries?',
// 								tool: 'search_web',
// 								query: ['real-world case studies machine learning applications'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are some real-world case studies demonstrating the application of machine learning in various industries?',
// 								tool: 'search_web',
// 								query: ['machine learning case studies in various industries'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are some real-world case studies demonstrating the application of machine learning in various industries?',
// 								tool: 'search_web',
// 								query: ['machine learning applications case studies'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					refined_sub_query:
// 						'How do the performance metrics of neural networks compare to traditional algorithms in specific tasks like image recognition and natural language processing?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'How do the performance metrics of neural networks compare to traditional algorithms in specific tasks like image recognition and natural language processing?',
// 								tool: 'search_web',
// 								query: [
// 									'performance metrics neural networks vs traditional algorithms image recognition natural language processing',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'How do the performance metrics of neural networks compare to traditional algorithms in specific tasks like image recognition and natural language processing?',
// 								tool: 'search_web',
// 								query: [
// 									'neural networks performance metrics traditional algorithms image recognition natural language processing',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'How do the performance metrics of neural networks compare to traditional algorithms in specific tasks like image recognition and natural language processing?',
// 								tool: 'search_web',
// 								query: [
// 									'neural networks vs traditional algorithms performance metrics image recognition natural language processing',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'How do the performance metrics of neural networks compare to traditional algorithms in specific tasks like image recognition and natural language processing?',
// 								tool: 'search_web',
// 								query: [
// 									'comparison of neural networks and traditional algorithms in image recognition and natural language processing',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'How do the performance metrics of neural networks compare to traditional algorithms in specific tasks like image recognition and natural language processing?',
// 								tool: 'search_web',
// 								query: [
// 									'neural networks performance metrics traditional algorithms image recognition NLP',
// 								],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					refined_sub_query:
// 						'What are the potential risks and ethical considerations associated with the use of natural language processing technologies in AI applications?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the potential risks and ethical considerations associated with the use of natural language processing technologies in AI applications?',
// 								tool: 'search_web',
// 								query: [
// 									'risks ethical considerations natural language processing AI applications',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the potential risks and ethical considerations associated with the use of natural language processing technologies in AI applications?',
// 								tool: 'search_web',
// 								query: [
// 									'risks ethical considerations natural language processing AI applications',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the potential risks and ethical considerations associated with the use of natural language processing technologies in AI applications?',
// 								tool: 'search_web',
// 								query: [
// 									'risks ethical considerations natural language processing AI applications',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the potential risks and ethical considerations associated with the use of natural language processing technologies in AI applications?',
// 								tool: 'search_web',
// 								query: [
// 									'risks ethical considerations natural language processing AI applications',
// 								],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 			],
// 			section_id: 'fgMO',
// 		},
// 		{
// 			section: 'The Future of Artificial Intelligence',
// 			refined_sub_queries: [
// 				{
// 					refined_sub_query:
// 						'What specific emerging trends in artificial intelligence have been identified in recent expert reports or studies?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What specific emerging trends in artificial intelligence have been identified in recent expert reports or studies?',
// 								tool: 'search_web',
// 								query: [
// 									'emerging trends in artificial intelligence 2025 expert reports studies',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What specific emerging trends in artificial intelligence have been identified in recent expert reports or studies?',
// 								tool: 'search_web',
// 								query: [
// 									'emerging trends in artificial intelligence 2025 expert reports studies',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What specific emerging trends in artificial intelligence have been identified in recent expert reports or studies?',
// 								tool: 'search_web',
// 								query: ['emerging trends in artificial intelligence 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What specific emerging trends in artificial intelligence have been identified in recent expert reports or studies?',
// 								tool: 'search_web',
// 								query: ['2025 artificial intelligence trends'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					refined_sub_query:
// 						'What are some concrete examples of potential advancements in artificial intelligence expected in the next decade, particularly in specific industries?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are some concrete examples of potential advancements in artificial intelligence expected in the next decade, particularly in specific industries?',
// 								tool: 'search_web',
// 								query: [
// 									'potential advancements in artificial intelligence next decade 2025 2035 specific industries',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are some concrete examples of potential advancements in artificial intelligence expected in the next decade, particularly in specific industries?',
// 								tool: 'search_web',
// 								query: [
// 									'future advancements in artificial intelligence 2025 2035 industry specific examples',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are some concrete examples of potential advancements in artificial intelligence expected in the next decade, particularly in specific industries?',
// 								tool: 'search_web',
// 								query: ['future AI advancements 2025 2035 industry examples'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are some concrete examples of potential advancements in artificial intelligence expected in the next decade, particularly in specific industries?',
// 								tool: 'search_web',
// 								query: ['AI advancements expected in next decade 2025 2035'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are some concrete examples of potential advancements in artificial intelligence expected in the next decade, particularly in specific industries?',
// 								tool: 'search_web',
// 								query: ['future trends in artificial intelligence 2025 2035'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					refined_sub_query:
// 						'What case studies illustrate the optimistic and cautionary perspectives on the future impact of artificial intelligence on society?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What case studies illustrate the optimistic and cautionary perspectives on the future impact of artificial intelligence on society?',
// 								tool: 'search_web',
// 								query: [
// 									'case studies optimistic cautionary perspectives future impact artificial intelligence society',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What case studies illustrate the optimistic and cautionary perspectives on the future impact of artificial intelligence on society?',
// 								tool: 'search_web',
// 								query: [
// 									'case studies optimistic cautionary perspectives future impact artificial intelligence society',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What case studies illustrate the optimistic and cautionary perspectives on the future impact of artificial intelligence on society?',
// 								tool: 'search_web',
// 								query: [
// 									'case studies AI future impact society optimistic cautionary',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What case studies illustrate the optimistic and cautionary perspectives on the future impact of artificial intelligence on society?',
// 								tool: 'search_web',
// 								query: ['case studies AI impact society optimistic cautionary'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What case studies illustrate the optimistic and cautionary perspectives on the future impact of artificial intelligence on society?',
// 								tool: 'search_web',
// 								query: ['AI case studies optimistic cautionary perspectives'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 			],
// 			section_id: 'tpDr',
// 		},
// 		{
// 			section: 'Ethical and Societal Implications of AI',
// 			refined_sub_queries: [
// 				{
// 					refined_sub_query:
// 						'What are some real-world examples of bias in AI systems, and what impact have they had on affected communities?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are some real-world examples of bias in AI systems, and what impact have they had on affected communities?',
// 								tool: 'search_web',
// 								query: [
// 									'real-world examples of bias in AI systems impact on communities',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are some real-world examples of bias in AI systems, and what impact have they had on affected communities?',
// 								tool: 'search_web',
// 								query: [
// 									'real-world examples of bias in AI systems impact on communities',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are some real-world examples of bias in AI systems, and what impact have they had on affected communities?',
// 								tool: 'search_web',
// 								query: ['examples of bias in AI systems'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are some real-world examples of bias in AI systems, and what impact have they had on affected communities?',
// 								tool: 'search_web',
// 								query: ['AI bias examples impact on communities'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are some real-world examples of bias in AI systems, and what impact have they had on affected communities?',
// 								tool: 'search_web',
// 								query: ['AI bias case studies'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					refined_sub_query:
// 						'What specific case studies illustrate privacy breaches caused by AI technologies, and what lessons can be learned from them?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What specific case studies illustrate privacy breaches caused by AI technologies, and what lessons can be learned from them?',
// 								tool: 'search_web',
// 								query: ['case studies privacy breaches AI technologies'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What specific case studies illustrate privacy breaches caused by AI technologies, and what lessons can be learned from them?',
// 								tool: 'search_web',
// 								query: ['AI privacy breaches case studies'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What specific case studies illustrate privacy breaches caused by AI technologies, and what lessons can be learned from them?',
// 								tool: 'search_web',
// 								query: ['AI privacy breaches case studies'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What specific case studies illustrate privacy breaches caused by AI technologies, and what lessons can be learned from them?',
// 								tool: 'search_web',
// 								query: ['AI privacy breaches examples'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What specific case studies illustrate privacy breaches caused by AI technologies, and what lessons can be learned from them?',
// 								tool: 'search_web',
// 								query: ['AI privacy breaches case studies'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					refined_sub_query:
// 						'What are the long-term societal implications of job displacement due to AI, and what innovative solutions have been proposed to address these challenges?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the long-term societal implications of job displacement due to AI, and what innovative solutions have been proposed to address these challenges?',
// 								tool: 'search_web',
// 								query: [
// 									'long-term societal implications of job displacement due to AI innovative solutions 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the long-term societal implications of job displacement due to AI, and what innovative solutions have been proposed to address these challenges?',
// 								tool: 'search_web',
// 								query: [
// 									'long-term societal implications of job displacement due to AI innovative solutions',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the long-term societal implications of job displacement due to AI, and what innovative solutions have been proposed to address these challenges?',
// 								tool: 'search_web',
// 								query: [
// 									'job displacement due to AI societal implications solutions',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the long-term societal implications of job displacement due to AI, and what innovative solutions have been proposed to address these challenges?',
// 								tool: 'search_web',
// 								query: ['AI job displacement societal implications solutions 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are the long-term societal implications of job displacement due to AI, and what innovative solutions have been proposed to address these challenges?',
// 								tool: 'search_web',
// 								query: ['AI job displacement long-term implications solutions'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					refined_sub_query:
// 						'What frameworks or guidelines exist for responsible AI development, and how have they been implemented in practice?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What frameworks or guidelines exist for responsible AI development, and how have they been implemented in practice?',
// 								tool: 'search_web',
// 								query: [
// 									'frameworks guidelines responsible AI development implementation 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What frameworks or guidelines exist for responsible AI development, and how have they been implemented in practice?',
// 								tool: 'search_web',
// 								query: [
// 									'responsible AI development frameworks guidelines implementation 2025',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What frameworks or guidelines exist for responsible AI development, and how have they been implemented in practice?',
// 								tool: 'search_web',
// 								query: [
// 									'responsible AI development frameworks guidelines implementation',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What frameworks or guidelines exist for responsible AI development, and how have they been implemented in practice?',
// 								tool: 'search_web',
// 								query: ['AI ethics frameworks guidelines implementation 2025'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What frameworks or guidelines exist for responsible AI development, and how have they been implemented in practice?',
// 								tool: 'search_web',
// 								query: ['responsible AI development frameworks guidelines'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 			],
// 			section_id: 'VUBp',
// 		},
// 		{
// 			section: 'Applications of Artificial Intelligence',
// 			refined_sub_queries: [
// 				{
// 					refined_sub_query:
// 						'What are specific case studies demonstrating the effectiveness of AI in healthcare, including metrics on patient outcomes and operational efficiency?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are specific case studies demonstrating the effectiveness of AI in healthcare, including metrics on patient outcomes and operational efficiency?',
// 								tool: 'search_web',
// 								query: [
// 									'AI in healthcare case studies patient outcomes operational efficiency',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are specific case studies demonstrating the effectiveness of AI in healthcare, including metrics on patient outcomes and operational efficiency?',
// 								tool: 'search_web',
// 								query: [
// 									'AI in healthcare case studies patient outcomes operational efficiency',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are specific case studies demonstrating the effectiveness of AI in healthcare, including metrics on patient outcomes and operational efficiency?',
// 								tool: 'search_web',
// 								query: [
// 									'AI healthcare case studies patient outcomes operational efficiency',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are specific case studies demonstrating the effectiveness of AI in healthcare, including metrics on patient outcomes and operational efficiency?',
// 								tool: 'search_web',
// 								query: ['AI in healthcare case studies'],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are specific case studies demonstrating the effectiveness of AI in healthcare, including metrics on patient outcomes and operational efficiency?',
// 								tool: 'search_web',
// 								query: ['AI healthcare case studies patient outcomes'],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					refined_sub_query:
// 						'Can a comparative analysis of AI applications in finance provide metrics on fraud detection success rates versus traditional methods?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'Can a comparative analysis of AI applications in finance provide metrics on fraud detection success rates versus traditional methods?',
// 								tool: 'search_web',
// 								query: [
// 									'AI applications in finance fraud detection success rates comparison traditional methods',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'Can a comparative analysis of AI applications in finance provide metrics on fraud detection success rates versus traditional methods?',
// 								tool: 'search_web',
// 								query: [
// 									'AI applications in finance fraud detection success rates comparison traditional methods',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'Can a comparative analysis of AI applications in finance provide metrics on fraud detection success rates versus traditional methods?',
// 								tool: 'search_web',
// 								query: [
// 									'AI fraud detection success rates finance traditional methods',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'Can a comparative analysis of AI applications in finance provide metrics on fraud detection success rates versus traditional methods?',
// 								tool: 'search_web',
// 								query: [
// 									'AI fraud detection finance success rates comparison traditional methods',
// 								],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					refined_sub_query:
// 						'What are detailed case studies of AI in transportation, including statistics on accident reduction and traffic flow improvements?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are detailed case studies of AI in transportation, including statistics on accident reduction and traffic flow improvements?',
// 								tool: 'search_web',
// 								query: [
// 									'AI in transportation case studies accident reduction traffic flow improvements',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are detailed case studies of AI in transportation, including statistics on accident reduction and traffic flow improvements?',
// 								tool: 'search_web',
// 								query: [
// 									'AI in transportation case studies accident reduction traffic flow improvements',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are detailed case studies of AI in transportation, including statistics on accident reduction and traffic flow improvements?',
// 								tool: 'search_web',
// 								query: [
// 									'AI in transportation case studies accident reduction traffic flow improvements',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are detailed case studies of AI in transportation, including statistics on accident reduction and traffic flow improvements?',
// 								tool: 'search_web',
// 								query: [
// 									'AI transportation case studies accident reduction traffic flow',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'What are detailed case studies of AI in transportation, including statistics on accident reduction and traffic flow improvements?',
// 								tool: 'search_web',
// 								query: [
// 									'AI in transportation accident reduction traffic flow improvements',
// 								],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 				{
// 					refined_sub_query:
// 						'How do AI-driven recommendation systems in entertainment compare in terms of user engagement metrics before and after implementation?',
// 					readings: [
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'How do AI-driven recommendation systems in entertainment compare in terms of user engagement metrics before and after implementation?',
// 								tool: 'search_web',
// 								query: [
// 									'AI-driven recommendation systems entertainment user engagement metrics before after implementation',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'How do AI-driven recommendation systems in entertainment compare in terms of user engagement metrics before and after implementation?',
// 								tool: 'search_web',
// 								query: [
// 									'AI recommendation systems entertainment user engagement metrics comparison',
// 								],
// 								sources: [],
// 							},
// 						},
// 						{
// 							reading: {
// 								refined_sub_query:
// 									'How do AI-driven recommendation systems in entertainment compare in terms of user engagement metrics before and after implementation?',
// 								tool: 'search_web',
// 								query: [
// 									'impact of AI recommendation systems on user engagement in entertainment',
// 								],
// 								sources: [],
// 							},
// 						},
// 					],
// 				},
// 			],
// 			section_id: 'fnWc',
// 		},
// 	],
// };
const DeepResearchChainOfThought = ({ data }) => {
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
								<div className="step">
									<Markdown citations={item?.citations || []}>
										{item?.step || ''}
									</Markdown>

									{item?.tool && (
										<div className="tool-container">
											<div className="tool-name">
												{item?.tool === 'search_web'
													? 'Searching web:'
													: item?.tool === 'search_knowledge_base'
													? 'Searching Knowledge Base:'
													: ''}
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
											<div className="text-container">
												Searching Sources :
											</div>
											{item?.sources?.map((url, idx) => (
												<a
													className="source"
													href={url}
													target="_blank"
													rel="noreferrer"
													key={idx}
												>
													{url}
												</a>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default memo(DeepResearchChainOfThought);
