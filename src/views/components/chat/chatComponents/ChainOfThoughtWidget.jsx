import { memo, useCallback, useEffect, useMemo, useRef, useState, Suspense, lazy } from 'react';
import '../../../../assets/scss/chat/chatComponents/chainOfThoughtWidget.scss';
import { ReactComponent as TickSvg } from '../../../../assets/svg/ai_agents/tick.svg';
import DeepSearchChainOfThought from './DeepSearchChainOfThought';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
const DeepResearchChainOfThought = lazy(() => import('./DeepResearchChainOfThought'));

const ChainOfThoughtWidget = ({ messageData }) => {
	const [info, setInfo] = useState({
		isExpanded: false,
		height: 20,
	});
	const contentContainerRef = useRef(null);
	const containerRef = useRef(null);
	const { deepResearch, stream_end, message, chainOfThought } = messageData;
	const chainOfThoughtCompleted = message?.length > 0 || stream_end || false;

	useEffect(() => {
		if (!contentContainerRef?.current) return;
		setTimeout(() => {
			let height = 54;
			const chainOfThoughtCompleted =
				messageData?.message?.length > 0 || messageData?.stream_end;
			const contentContainerHeight = contentContainerRef?.current?.scrollHeight;

			if (chainOfThoughtCompleted) {
				height = info?.isExpanded ? contentContainerHeight + 20 : 20;
			} else {
				height = contentContainerHeight + 20;
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
			messageData?.chainOfThought?.length > 0 ||
			messageData?.deepResearch
		) {
			setInfo((prev) => ({ ...prev, isExpanded: !prev?.isExpanded }));
		}
	}, [messageData]);

	const text = useMemo(() => {
		// const { deepResearch, message, stream_end, chainOfThought } = messageData || {};
		// if (message?.length > 0 || stream_end) {
		// 	return chainOfThought?.length > 0
		// 		? 'Search Completed'
		// 		: deepResearch
		// 		? 'Research Completed'
		// 		: 'Thinking';
		// }
		// return deepResearch ? 'Researching' : chainOfThought?.length > 0 ? 'Searching' : 'Thinking';
		return 'Thinking process';
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
					{/* <div className="icon-container">{chainOfThoughtCompleted && <TickSvg />}</div> */}
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
				{(deepResearch || chainOfThought?.length > 0) && (
					<div className="content-container">
						{deepResearch && (
							<Suspense fallback={''}>
								<DeepResearchChainOfThought
									data={deepResearch}
									streamEnd={chainOfThoughtCompleted || false}
								/>
							</Suspense>
						)}

						{chainOfThought?.length > 0 && (
							<DeepSearchChainOfThought
								data={chainOfThought}
								showOnlyLastThought={!chainOfThoughtCompleted && !info?.isExpanded}
								streamEnd={chainOfThoughtCompleted || false}
								showLastIndicatorLine={true}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(ChainOfThoughtWidget);
