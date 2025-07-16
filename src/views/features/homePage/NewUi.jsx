import { memo, useEffect, useRef, useState } from 'react';
import '../../../assets/scss/home_page/newUi.scss';
const array = [{ value: 0 }, { value: 1 }, { value: 0 }, { value: 1 }];

const getCardStyles = (index, activeIndex, dataLength) => {
	const prev1 = (activeIndex - 1 + dataLength) % dataLength;
	const prev2 = (activeIndex - 2 + dataLength) % dataLength;
	const prev3 = (activeIndex - 3 + dataLength) % dataLength;

	const next = (activeIndex + 1) % dataLength;
	if (index === activeIndex) {
		return {
			top: '18%',
			bottom: '0%',
			width: '100%',
			opacity: 1,
		};
	} else if (index === prev1) {
		return {
			top: '6%',
			bottom: '82%',
			width: '88%',
			opacity: 1,
		};
	} else if (index === prev2) {
		return {
			top: 0,
			bottom: '94%',
			width: '75%',
			opacity: 1,
		};
	} else if (index === prev3) {
		return {
			top: 0,
			bottom: '100%',
			width: '50%',
			opacity: 0.25,
		};
	} else if (index === next) {
		return {
			top: '100%',
			bottom: '0%',
			width: '100%',
			opacity: 0.25,
		};
	} else if (index < prev2) {
		return {
			top: 0,
			bottom: '100%',
			width: '50%',
			opacity: 0.25,
		};
	}
};
const SCROLL_DELAY = 600;

const NewUi = () => {
	const lastScrollTime = useRef(0);
	const [info, setInfo] = useState({
		activeIndex: array?.length - 2,
		dataLength: array?.length,
		realDataLength: 2,
	});

	const handleWheel = (e) => {
		console.log(e?.deltaY, 'deltaY');
		const now = Date.now();
		if (now - lastScrollTime.current < SCROLL_DELAY) return;
		lastScrollTime.current = now;

		setInfo((prev) => {
			if (e?.deltaY > 0) {
				return {
					...prev,
					activeIndex: (prev?.activeIndex + 1) % prev?.dataLength,
				};
			}
			return {
				...prev,
				activeIndex:
					prev?.activeIndex - 1 < 0 ? prev?.dataLength - 1 : prev?.activeIndex - 1,
			};
		});
	};

	useEffect(() => {
		window.addEventListener('wheel', handleWheel, { passive: true });
		return () => window.removeEventListener('wheel', handleWheel);
	}, []);

	return (
		<div className="new-ui-wrapper">
			{array?.map((item, index) => (
				<div
					key={index}
					className="new-ui-item"
					style={getCardStyles(index, info?.activeIndex, info?.dataLength)}
				>
					{item?.value}
				</div>
			))}
		</div>
	);
};

export default memo(NewUi);
