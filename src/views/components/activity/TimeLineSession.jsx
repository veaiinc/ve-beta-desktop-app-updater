import React, { memo, useCallback, useState, useEffect } from 'react';
import '../../../assets/scss/sales/activity/modalSessionComponents.scss';
import { ReactComponent as PageAlignSvg } from '../../../assets/svg/activity/pagealign.svg';
import { ReactComponent as ReviewsSvg } from '../../../assets/svg/activity/reviews.svg';

const data = [
	{
		event: 'Session Started',
	},
	{
		event: 'User Left the File',
	},
	{
		event: 'User was Idle',
	},
	{
		event: 'Blocks Entered Screen in Proposal',
		details: {
			duration: '00:06:32',
			blocks: [
				{
					block_type: 'Header Block',
					text: 'Block text first line',
				},
				{
					block_type: 'Text Block',
					text: 'Block text first line',
				},
				{
					block_type: 'Image Block',
					text: 'Block text first line',
				},
				{
					block_type: 'List Block',
					text: 'Block text first line',
				},
				{
					block_type: 'Gallery Block',
					text: 'Block text first line',
				},
				{
					block_type: 'Magazine Block',
					text: 'Block text first line',
				},
				{
					block_type: 'Testimonial Block',
					text: 'Block text first line',
				},
				{
					block_type: 'Service Block',
					text: 'Block text first line',
				},
				{
					block_type: 'Event Block',
					text: 'Block text first line',
				},
			],
		},
	},
	{
		event: '{Button Name} - Interaction',
	},
	{
		event: '{Link Name} - Interaction',
	},
	{
		event: 'AI Interaction',
		details: [
			{
				prompt: 'prompt text',
				response: 'Ai response text',
			},
			{
				prompt: 'prompt text',
				response: 'Ai response text',
			},
			{
				prompt: 'prompt text',
				response: 'Ai response text',
			},
		],
	},
	{
		event: 'Block Folded',
		block: 'Text Block',
	},
	{
		event: 'Quote Changed',
		details: {
			block_name: 'Service Block',
			updated_cost: '$25,000',
			service_name: 'Candid Videography',
			status: 'Selected',
		},
	},
];

const TimeLineSession = () => {
	const [info, setInfo] = useState({
		expandedBlocks: {},
	});

	useEffect(() => {
		const initialExpandedState = data.reduce((acc, _, index) => {
			acc[index] = true;
			return acc;
		}, {});

		setInfo((prevState) => ({
			...prevState,
			expandedBlocks: initialExpandedState,
		}));
	}, []);

	// Toggle expand/collapse function
	const toggleExpand = useCallback((index) => {
		setInfo((prevState) => ({
			...prevState,
			expandedBlocks: {
				...prevState.expandedBlocks,
				[index]: !prevState.expandedBlocks[index],
			},
		}));
	}, []);

	return (
		<div className="timeLineWrapper">
			{data.map((singledata, index) => (
				<div
					className="blockParentContainer"
					onClick={() => toggleExpand(index)}
					key={index}
				>
					<div className="blockIcon">
						<PageAlignSvg />
					</div>
					<div className="blockContentContainer">
						{/* blockHeader */}
						<div className="blockHeader">
							<span className="blockTitle">{singledata?.event}</span>
							<div className="headerIcon">?</div>
						</div>
						{/* blockDescription */}
						<div className="blockDescription">
							<span className="blockKey">Duration:</span>
							<span className="blockValue">{singledata?.details?.duration}</span>
						</div>
						{/* blockElementsContainer */}
						<div
							className={
								info?.expandedBlocks[index] === true // Check if the block is expanded
									? 'blockElementsContainer'
									: 'hideBlockElementsContainer'
							}
						>
							{singledata?.details?.blocks?.map((block, index) => (
								<div className="blockElementWrapper" key={index}>
									<div className="blockElementIcon">
										<ReviewsSvg />
									</div>
									<div key={index} className="blockElementInfo">
										<span className="elementTitle">{block?.block_type}</span> -
										<span className="elementValue">{block?.text}</span>
									</div>
								</div>
							)) || ''}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(TimeLineSession);
