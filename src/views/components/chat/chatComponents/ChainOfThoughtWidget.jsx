import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../../../../assets/scss/chat/chatComponents/chainOfThoughtWidget.scss';
import { ReactComponent as TickSvg } from '../../../../assets/svg/ai_agents/tick.svg';
import DeepResearchChainOfThought from './DeepResearchChainOfThought';
import DeepSearchChainOfThought from './DeepSearchChainOfThought';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';

const ChainOfThoughtWidget = ({ messageData }) => {
	const [info, setInfo] = useState({
		isExpanded: false,
		height: 54,
	});
	const contentContainerRef = useRef(null);
	const containerRef = useRef(null);
	const { deepSearch, deepResearch } = messageData;
	const chainOfThoughtCompleted = messageData?.message?.length > 0 || messageData?.stream_end;

	useEffect(() => {
		if (!contentContainerRef?.current) return;
		setTimeout(() => {
			let height = 54;
			const chainOfThoughtCompleted =
				messageData?.message?.length > 0 || messageData?.stream_end;
			const contentContainerHeight = contentContainerRef?.current?.scrollHeight;

			if (chainOfThoughtCompleted) {
				height = info?.isExpanded ? contentContainerHeight + 54 : 54;
			} else {
				height = contentContainerHeight + 54;
			}

			setInfo((prev) => {
				if (prev?.height === height) {
					return prev;
				}
				return {
					...prev,
					height,
				};
			});
		}, 0);
	}, [info?.isExpanded, messageData]);

	useEffect(() => {
		if (messageData?.message?.length > 0 || messageData?.stream_end) {
			return;
		}
		smoothScrollToBottom();
	}, [deepSearch?.cot?.length, deepResearch?.cot?.length, deepResearch?.sections?.length]);

	const smoothScrollToBottom = useCallback((type) => {
		const scrollElement = contentContainerRef?.current;
		if (!scrollElement) return;

		const scrollToPosition = (position) => {
			scrollElement?.scrollTo({
				top: position,
				behavior: type === 'instant' ? 'auto' : 'smooth',
			});
		};

		if (type === 'custom') {
			const scrollHeight = scrollElement.scrollHeight;
			const scrollOffset = 100;
			scrollToPosition(scrollHeight - scrollOffset);
		} else {
			scrollToPosition(scrollElement?.scrollHeight);
		}
	}, []);

	const text = useMemo(() => {
		if (messageData?.message?.length > 0 || messageData?.stream_end) {
			return messageData?.deepSearch ? 'Search Completed' : 'Research Completed';
		}
		return messageData?.deepResearch ? 'Researching' : 'Searching';
	}, [messageData]);

	// if (
	// 	!(
	// 		messageData?.deepResearch?.cot?.length > 0 ||
	// 		messageData?.deepResearch?.sections?.length > 0 ||
	// 		messageData?.deepResearch?.sections_refined?.length > 0 ||
	// 		messageData?.deepSearch?.cot?.length > 0
	// 	)
	// ) {
	// 	return null;
	// }

	return (
		<div
			className={`chain-of-thought-widget-container`}
			style={{
				height: `${info?.height}px`,
			}}
			ref={containerRef}
		>
			<div
				className="widget-header"
				onClick={() => setInfo({ isExpanded: !info?.isExpanded })}
			>
				<div className="left-container">
					<div className="icon-container">{chainOfThoughtCompleted && <TickSvg />}</div>
					<div className={`text-container ${chainOfThoughtCompleted ? '' : 'animate'}`}>
						{text}
					</div>
				</div>
				<div
					className="right-container"
					style={{
						transform: info?.isExpanded ? 'rotate(-90deg)' : 'rotate(90deg)',
					}}
				>
					<ChevronRightThinSvg />
				</div>
			</div>
			<div className="widget-content-container" ref={contentContainerRef}>
				<div className="content-container">
					{messageData?.deepResearch && (
						<DeepResearchChainOfThought
							data={messageData?.deepResearch}
							streamEnd={
								messageData?.message?.length > 0 || messageData?.stream_end || false
							}
						/>
					)}

					{messageData?.deepSearch && (
						<DeepSearchChainOfThought
							data={messageData?.deepSearch}
							showOnlyLastThought={!chainOfThoughtCompleted && !info?.isExpanded}
							streamEnd={
								messageData?.message?.length > 0 || messageData?.stream_end || false
							}
						/>
					)}
				</div>
				{/* {!(messageData?.message?.length > 0 || messageData?.stream_end) && (
					<div className="loader-container">
						<div className="loader-text">Thinking... </div>
					</div>
				)} */}
			</div>
		</div>
	);
};

export default memo(ChainOfThoughtWidget);
