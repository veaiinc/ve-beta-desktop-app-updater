import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../../../assets/scss/dynamicWidget/dynamicWidget.scss';
import BinocularsIcon from '../../../assets/svg/dynamicWidget/Binoculars.svg?react';
import FileMagnifyingGlassIcon from '../../../assets/svg/dynamicWidget/FileMagnifyingGlass.svg?react';
import SpinnerGapIcon from '../../../assets/svg/dynamicWidget/SpinnerGap.svg?react';
import TreeStructureIcon from '../../../assets/svg/dynamicWidget/TreeStructure.svg?react';

const DynamicWidget = () => {
	const prompts = [
		{
			icon: <FileMagnifyingGlassIcon className="dynamic-widget-prompt-icon" />,
			title: 'Scanning your workspace...',
		},
		{
			icon: <BinocularsIcon className="dynamic-widget-prompt-icon" />,
			title: 'Looking for patterns...',
		},
		{
			icon: <TreeStructureIcon className="dynamic-widget-prompt-icon" />,
			title: 'Mapping your recent activity...',
		},
		{
			icon: (
				<SpinnerGapIcon className="dynamic-widget-prompt-icon dynamic-widget-prompt-icon-spin" />
			),
			title: 'Thinking deeply...',
		},
		{
			icon: <FileMagnifyingGlassIcon className="dynamic-widget-prompt-icon" />,
			title: 'Analyzing project timelines...',
		},
		{
			icon: <BinocularsIcon className="dynamic-widget-prompt-icon" />,
			title: 'Identifying core priorities...',
		},
		{
			icon: <TreeStructureIcon className="dynamic-widget-prompt-icon" />,
			title: 'Linking related documents...',
		},
		{
			icon: (
				<SpinnerGapIcon className="dynamic-widget-prompt-icon dynamic-widget-prompt-icon-spin" />
			),
			title: 'Fetching recent edits...',
		},
		{
			icon: <FileMagnifyingGlassIcon className="dynamic-widget-prompt-icon" />,
			title: 'Reviewing team notes...',
		},
		{
			icon: <BinocularsIcon className="dynamic-widget-prompt-icon" />,
			title: 'Surfacing key takeaways...',
		},
		{
			icon: <TreeStructureIcon className="dynamic-widget-prompt-icon" />,
			title: 'Connecting knowledge points...',
		},
		{
			icon: (
				<SpinnerGapIcon className="dynamic-widget-prompt-icon dynamic-widget-prompt-icon-spin" />
			),
			title: 'Generating insight threads...',
		},
		{
			icon: <FileMagnifyingGlassIcon className="dynamic-widget-prompt-icon" />,
			title: 'Exploring recent discussions...',
		},
		{
			icon: <BinocularsIcon className="dynamic-widget-prompt-icon" />,
			title: 'Spotting decision moments...',
		},
		{
			icon: <TreeStructureIcon className="dynamic-widget-prompt-icon" />,
			title: 'Tracing task dependencies...',
		},
		{
			icon: (
				<SpinnerGapIcon className="dynamic-widget-prompt-icon dynamic-widget-prompt-icon-spin" />
			),
			title: 'Synthesizing project goals...',
		},
		{
			icon: <FileMagnifyingGlassIcon className="dynamic-widget-prompt-icon" />,
			title: 'Looking at collaboration trails...',
		},
		{
			icon: <BinocularsIcon className="dynamic-widget-prompt-icon" />,
			title: 'Detecting momentum shifts...',
		},
		{
			icon: <TreeStructureIcon className="dynamic-widget-prompt-icon" />,
			title: 'Reviewing latest updates...',
		},
		{
			icon: (
				<SpinnerGapIcon className="dynamic-widget-prompt-icon dynamic-widget-prompt-icon-spin" />
			),
			title: 'Building a knowledge path...',
		},
		{
			icon: <FileMagnifyingGlassIcon className="dynamic-widget-prompt-icon" />,
			title: 'Inspecting shared links...',
		},
		{
			icon: <BinocularsIcon className="dynamic-widget-prompt-icon" />,
			title: 'Analyzing workspace behavior...',
		},
		{
			icon: <TreeStructureIcon className="dynamic-widget-prompt-icon" />,
			title: 'Finding intersections in content...',
		},
		{
			icon: (
				<SpinnerGapIcon className="dynamic-widget-prompt-icon dynamic-widget-prompt-icon-spin" />
			),
			title: 'Creating mental model...',
		},
		{
			icon: <FileMagnifyingGlassIcon className="dynamic-widget-prompt-icon" />,
			title: 'Digesting notes and docs...',
		},
		{
			icon: <BinocularsIcon className="dynamic-widget-prompt-icon" />,
			title: 'Spotting alignment gaps...',
		},
		{
			icon: <TreeStructureIcon className="dynamic-widget-prompt-icon" />,
			title: 'Extracting high-signal data...',
		},
		{
			icon: (
				<SpinnerGapIcon className="dynamic-widget-prompt-icon dynamic-widget-prompt-icon-spin" />
			),
			title: 'Compiling next actions...',
		},
		{
			icon: <FileMagnifyingGlassIcon className="dynamic-widget-prompt-icon" />,
			title: 'Summarizing research trails...',
		},
		{
			icon: <BinocularsIcon className="dynamic-widget-prompt-icon" />,
			title: 'Zeroing in on key challenges...',
		},
		{
			icon: <TreeStructureIcon className="dynamic-widget-prompt-icon" />,
			title: 'Translating ideas into structure...',
		},
		{
			icon: (
				<SpinnerGapIcon className="dynamic-widget-prompt-icon dynamic-widget-prompt-icon-spin" />
			),
			title: 'Creating thought snapshot...',
		},
		{
			icon: <FileMagnifyingGlassIcon className="dynamic-widget-prompt-icon" />,
			title: 'Aligning with workspace goals...',
		},
		{
			icon: <BinocularsIcon className="dynamic-widget-prompt-icon" />,
			title: 'Simulating next moves...',
		},
		{
			icon: <TreeStructureIcon className="dynamic-widget-prompt-icon" />,
			title: 'Linking context across files...',
		},
		{
			icon: (
				<SpinnerGapIcon className="dynamic-widget-prompt-icon dynamic-widget-prompt-icon-spin" />
			),
			title: 'Filtering noise, finding signal...',
		},
		{
			icon: <FileMagnifyingGlassIcon className="dynamic-widget-prompt-icon" />,
			title: 'Extracting problem threads...',
		},
		{
			icon: <BinocularsIcon className="dynamic-widget-prompt-icon" />,
			title: 'Locating priority areas...',
		},
		{
			icon: <TreeStructureIcon className="dynamic-widget-prompt-icon" />,
			title: 'Organizing knowledge clusters...',
		},
		{
			icon: (
				<SpinnerGapIcon className="dynamic-widget-prompt-icon dynamic-widget-prompt-icon-spin" />
			),
			title: 'Almost there...',
		},
	];

	const containerRef = useRef(null);
	const promptsRef = useRef([]);

	useEffect(() => {
		const container = containerRef.current;
		const promptElements = promptsRef.current;
		let currentIndex = 0;

		const animatePrompt = (index) => {
			const current = promptElements[index];
			const next = promptElements[(index + 1) % promptElements.length];

			gsap.set(current, { opacity: 1, y: 0, rotationX: 0 });
			gsap.set(next, { opacity: 0, y: 20, rotationX: -90 });

			const tl = gsap.timeline({
				onComplete: () => {
					setTimeout(() => {
						animatePrompt((index + 1) % promptElements.length);
					}, 1000);
				},
			});

			tl.to(current, {
				duration: 0.5,
				y: -20,
				rotationX: 90,
				opacity: 0,
				ease: 'power2.inOut',
			}).to(
				next,
				{
					duration: 0.5,
					y: 0,
					rotationX: 0,
					opacity: 1,
					ease: 'power2.inOut',
				},
				'-=0.3',
			);
		};

		promptElements.forEach((prompt, i) => {
			gsap.set(prompt, {
				opacity: i === 0 ? 1 : 0,
				y: i === 0 ? 0 : 20,
				rotationX: i === 0 ? 0 : -90,
			});
		});

		animatePrompt(0);

		return () => {
			gsap.killTweensOf(promptElements);
		};
	}, []);

	return (
		<div className="dynamic-widget">
			<div className="dynamic-widget-mini">
				<div className="dynamic-widget-title" ref={containerRef}>
					{prompts.map((prompt, index) => (
						<div
							key={index}
							className="dynamic-widget-prompt"
							ref={(el) => (promptsRef.current[index] = el)}
						>
							<span className="dynamic-widget-prompt-icon">{prompt.icon}</span>
							<span className="dynamic-widget-prompt-title">{prompt.title}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default DynamicWidget;
