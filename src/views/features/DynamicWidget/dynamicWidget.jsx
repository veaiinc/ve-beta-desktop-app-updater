import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../../../assets/scss/dynamicWidget/dynamicWidget.scss';
import { ReactComponent as BinocularsIcon } from '../../../assets/svg/dynamicWidget/Binoculars.svg';
import { ReactComponent as FileMagnifyingGlassIcon } from '../../../assets/svg/dynamicWidget/FileMagnifyingGlass.svg';
import { ReactComponent as SpinnerGapIcon } from '../../../assets/svg/dynamicWidget/SpinnerGap.svg';
import { ReactComponent as TreeStructureIcon } from '../../../assets/svg/dynamicWidget/TreeStructure.svg';

const DynamicWidget = () => {
	const prompts = [
		{
			icon: <FileMagnifyingGlassIcon className="dynamic-widget-prompt-icon" />,
			title: 'Searching knowledge base...',
		},
		{
			icon: <BinocularsIcon className="dynamic-widget-prompt-icon" />,
			title: 'Identifying the core question...',
		},
		{
			icon: <TreeStructureIcon className="dynamic-widget-prompt-icon" />,
			title: 'Retrieving relevant knowledge...',
		},
		{
			icon: <FileMagnifyingGlassIcon className="dynamic-widget-prompt-icon" />,
			title: 'Searching knowledge base...',
		},
		{
			icon: (
				<SpinnerGapIcon className="dynamic-widget-prompt-icon dynamic-widget-prompt-icon-spin" />
			),
			title: 'Retrieving relevant knowledge...',
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
