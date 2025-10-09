import React, { useEffect, useRef, useState } from 'react';
import './assets/scss/LoginCarousel.scss';

const CarouselComponent = ({
	activeIndex,
	onCarouselChange,
	autoSlide = true,
	slideDuration = 3000,
}) => {
	const intervalRef = useRef(null);
	const [isPaused, setIsPaused] = useState(false);

	useEffect(() => {
		if (autoSlide && !isPaused) {
			intervalRef.current = setInterval(() => {
				onCarouselChange((prevIndex) => (prevIndex + 1) % 3);
			}, slideDuration);

			return () => {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}
			};
		}
	}, [autoSlide, slideDuration, onCarouselChange, isPaused]);

	const handleCarouselClick = (index) => {
		// console.log('CarouselComponent: Clicked on index:', index);
		onCarouselChange(index);

		// Reset the auto-slide timer when user manually clicks
		if (autoSlide) {
			clearInterval(intervalRef.current);
			intervalRef.current = setInterval(() => {
				onCarouselChange((prevIndex) => (prevIndex + 1) % 3);
			}, slideDuration);
		}
	};

	return (
		<div
			className="carousel-container"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			{[0, 1, 2].map((index) => (
				<div
					key={index}
					className={`carousel ${activeIndex === index ? 'active' : 'inactive'}`}
					onClick={() => handleCarouselClick(index)}
				/>
			))}
		</div>
	);
};

export default CarouselComponent;
