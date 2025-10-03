import React from 'react';
import './assets/scss/LoginCarousel.scss';

const CarouselComponent = ({ activeIndex, onCarouselChange }) => {
	const handleCarouselClick = (index) => {
		console.log('CarouselComponent: Clicked on index:', index);
		onCarouselChange(index);
	};

	return (
		<div className="carousel-container">
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
