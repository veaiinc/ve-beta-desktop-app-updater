import { memo, useEffect, useRef, useState } from 'react';
import s from '../../../assets/scss/home_page/chainOfThoughtInterpreter.module.scss';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import CombinedChainOfThought from '../chat/chatComponents/CombinedChainOfThought';

const ChainOfThoughtInterpreter = ({ data, citations = null, confidenceScore }) => {
	const containerRef = useRef(null);
	const [info, setInfo] = useState({
		isExpanded: false,
		height: 53,
	});

	useEffect(() => {
		if (!containerRef.current) return;

		let height = 53;
		if (info?.isExpanded) {
			height = containerRef.current?.scrollHeight;
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
	}, [info?.isExpanded]);

	return (
		<div
			className={s.chainOfThoughtContainer}
			ref={containerRef}
			style={{
				height: `${info?.height}px`,
			}}
		>
			<div
				className={s.containerHeader}
				onClick={() => setInfo({ isExpanded: !info?.isExpanded })}
			>
				<div className={s.leftContainer}>
					<div className={s.text}>Chain of Thought</div>
					<div
						className={s.iconContainer}
						style={{
							transform: info?.isExpanded ? 'rotate(-90deg)' : 'rotate(90deg)',
						}}
					>
						<ChevronRightThinSvg style={{ width: '18px', height: '18px' }} />
					</div>
				</div>

				{confidenceScore && (
					<div className={s.rightContainer}>
						<div className={s.confidenceScore}>
							<div className={s.text}>Confidence score</div>
							<div className={s.percentage}>{`${confidenceScore * 100}%`}</div>
						</div>
					</div>
				)}
			</div>
			<div className={s.content}>
				<CombinedChainOfThought data={data} citations={citations} />
			</div>
		</div>
	);
};

export default memo(ChainOfThoughtInterpreter);
