import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../../../../assets/scss/chat/chatComponents/researchWidget.scss';
import DeepResearchChainOfThought from './DeepResearchChainOfThought';
import DeepSearchChainOfThought from './DeepSearchChainOfThought';

const ResearchWidget = ({ messageData }) => {
	const [info, setInfo] = useState({
		isExpanded: false,
	});
	const contentContainerRef = useRef(null);
	const { deepSearch, deepResearch } = messageData;

	useEffect(() => {
		if (messageData?.message?.length > 0 || messageData?.stream_end) {
			return;
		}
		smoothScrollToBottom();
	}, [
		deepSearch?.cot?.length,
		deepSearch?.cot_refined?.length,
		deepResearch?.cot?.length,
		deepResearch?.sections?.length,
	]);

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
		return messageData?.deepResearch ? 'Researching...' : 'Searching...';
	}, [messageData]);

	if (
		!(
			messageData?.deepResearch?.cot?.length > 0 ||
			messageData?.deepResearch?.sections?.length > 0 ||
			messageData?.deepResearch?.sections_refined?.length > 0 ||
			messageData?.deepSearch?.cot?.length > 0 ||
			messageData?.deepSearch?.cot_refined?.length > 0
		)
	) {
		return null;
	}
	return (
		<div className="research-widget-container">
			<div className="widget-header">
				<div className="icon-container"></div>
				<div className="text-container">{text}</div>
			</div>
			<div
				className="widget-content-container"
				ref={contentContainerRef}
				// style={{
				// 	maxHeight: info?.isExpanded
				// 		? `${contentContainerRef?.current?.scrollHeight}px`
				// 		: '400px',
				// }}
			>
				<div className="content-container">
					{messageData?.deepResearch && (
						<DeepResearchChainOfThought data={messageData?.deepResearch} />
					)}
					{messageData?.deepSearch && (
						<DeepSearchChainOfThought
							data={messageData?.deepSearch}
							streamEnd={messageData?.message?.length > 0 || messageData?.stream_end}
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

export default memo(ResearchWidget);
