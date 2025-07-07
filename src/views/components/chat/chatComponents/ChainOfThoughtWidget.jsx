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
	const { deepSearch, deepResearch, normalSearch, memory_thinking, stream_end, message } =
		messageData;
	const chainOfThoughtCompleted = message?.length > 0 || stream_end || false;

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

	const handleExpandClick = useCallback(() => {
		const chainOfThoughtCompleted = messageData?.stream_end || messageData?.message?.length > 0;
		if (
			chainOfThoughtCompleted ||
			messageData?.deepResearch ||
			messageData?.deepSearch ||
			messageData?.normalSearch
		) {
			setInfo((prev) => ({ ...prev, isExpanded: !prev?.isExpanded }));
		}
	}, [messageData]);

	const text = useMemo(() => {
		const { deepSearch, deepResearch, message, stream_end } = messageData || {};
		if (message?.length > 0 || stream_end) {
			return deepSearch || normalSearch
				? 'Search Completed'
				: deepSearch
				? 'Research Completed'
				: 'Thinking';
		}
		return deepResearch ? 'Researching' : deepSearch || normalSearch ? 'Searching' : 'Thinking';
	}, [messageData]);

	return (
		<div
			className={`chain-of-thought-widget-container`}
			style={{
				height: `${info?.height}px`,
			}}
			ref={containerRef}
		>
			<div className="widget-header" onClick={handleExpandClick}>
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
				{memory_thinking && !(deepResearch || deepSearch || normalSearch) && (
					<div className="memory-thinking">{memory_thinking || ''}</div>
				)}

				{(deepResearch || deepSearch) && (
					<div className="content-container">
						{deepResearch && (
							<DeepResearchChainOfThought
								data={deepResearch}
								streamEnd={chainOfThoughtCompleted || false}
							/>
						)}

						{(deepSearch || normalSearch) && (
							<DeepSearchChainOfThought
								data={deepSearch || normalSearch}
								showOnlyLastThought={!chainOfThoughtCompleted && !info?.isExpanded}
								streamEnd={chainOfThoughtCompleted || false}
								memoryThinking={memory_thinking}
							/>
						)}
					</div>
				)}

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
