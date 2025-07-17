import { memo, useCallback, useEffect, useRef, useState } from 'react';
import '../../../assets/scss/home_page/newUi.scss';
const array = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }];

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
	} else {
		return {
			top: 0,
			bottom: '100%',
			width: '50%',
			opacity: 0.25,
		};
	}
};

const SCROLL_THRESHOLD = 10;
const SCROLL_STOP_DELAY = 40; // time between wheel events to detect gesture end

let scrollTimeout = null;
let scrollLocked = false;

const NewUi = () => {
	const [info, setInfo] = useState({
		activeIndex: array?.length - 2,
		dataLength: array?.length,
		realDataLength: 2,
	});

	const handleWheel = useCallback((e) => {
		const delta = e.deltaY;

		// Ignore tiny scrolls
		if (Math.abs(delta) < SCROLL_THRESHOLD) return;

		// If not locked, this is a new scroll gesture
		if (!scrollLocked) {
			scrollLocked = true;

			setInfo((prev) => {
				const newIndex =
					delta > 0
						? (prev.activeIndex + 1) % prev.dataLength
						: prev.activeIndex - 1 < 0
						? prev.dataLength - 1
						: prev.activeIndex - 1;

				return { ...prev, activeIndex: newIndex };
			});
		}

		// Reset the timeout on every wheel event
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			scrollLocked = false; // Allow next gesture
		}, SCROLL_STOP_DELAY);
	}, []);

	useEffect(() => {
		window.addEventListener('wheel', handleWheel, { passive: true });
		return () => window.removeEventListener('wheel', handleWheel);
	}, []);

	return (
		<div className="new-ui-container">
			<div className="new-ui-wrapper">
				{array?.map((item, index) => (
					<div
						key={index}
						className="new-ui-item"
						style={getCardStyles(index, info?.activeIndex, info?.dataLength)}
					>
						<div
							className="item"
							style={{
								...(index === info?.activeIndex && {
									opacity: 1,
								}),
							}}
						></div>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(NewUi);
