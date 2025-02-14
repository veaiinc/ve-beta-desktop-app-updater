import React, { memo } from 'react';
import '../../../assets/scss/notes/index.scss';
import NoteComponent from '../../components/notes/NoteComponent';

const Notes = () => {
	const newMd = `Here is a structured outline for an essay about programming, along with key points to consider:

### Title: The Evolution and Impact of Programming

#### Introduction
- Define programming and its significance in the modern world.
- Present a thesis statement that outlines the main arguments of the essay.

#### Body Paragraph 1: History of Programming
- Discuss the origins of programming languages and early computing.
- Mention key figures and milestones in the development of programming (e.g., Ada Lovelace, the creation of the first programming languages).

#### Body Paragraph 2: Types of Programming Languages
- Explain the different categories of programming languages (e.g., high-level vs. low-level, compiled vs. interpreted).
- Provide examples of popular programming languages (e.g., Python, Java, C++) and their typical use cases.

#### Body Paragraph 3: The Role of Programming in Society
- Explore how programming has transformed various industries (e.g., healthcare, finance, entertainment).
- Discuss the importance of programming skills in the job market and the rise of coding bootcamps and educational programs.

#### Body Paragraph 4: Current Trends in Programming
- Highlight emerging trends such as artificial intelligence, machine learning, and the Internet of Things (IoT).
- Discuss the impact of open-source software and collaborative programming communities.

#### Conclusion
- Summarize the key points discussed in the essay.
- Reflect on the future of programming and its potential to shape society.

### Additional Tips:
- Use clear and concise language throughout the essay.
- Support arguments with evidence and examples from credible sources.
- Ensure proper citation of all references used in the essay.

For more detailed guidance, you can refer to resources like [IvyPanda](https://ivypanda.com/essays/subject/programming/) and [PHDessay](https://phdessay.com/free-essays-on/programming/).`;

	return <NoteComponent initialContent={newMd} />;
};

export default memo(Notes);
