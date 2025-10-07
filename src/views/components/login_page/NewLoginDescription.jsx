import React, { useState } from 'react';
import CarouselComponent from './CarouselComponent';
import { newLoginDescription } from './newconstant';
import Carousel1 from './assets/LoginImages/Carousel-1.png';
import Carousel2 from './assets/LoginImages/Carousel-2.png';
import Carousel3 from './assets/LoginImages/Carousel-3.png';

const NewLoginDescription = () => {
	const [activeIndex, setActiveIndex] = useState(0);

	const carouselImages = [Carousel1, Carousel2, Carousel3];

	const handleCarouselChange = (index) => {
		setActiveIndex(index);
	};

	return (
		<div className="new-login-description-container">
			<div className="carousel-content-wrapper">
				<div className="carousel-image-container">
					<img
						src={carouselImages[activeIndex]}
						alt={`Carousel ${activeIndex + 1}`}
						className="carousel-image"
					/>
					<div className="carousel-gradient-overlay"></div>
					<div className="carousel-text-overlay">
						<h2 className="carousel-title">{newLoginDescription[activeIndex].title}</h2>
						<h2 className="carousel-title">
							{newLoginDescription[activeIndex].subTitle}
						</h2>
						<p className="carousel-description">
							{newLoginDescription[activeIndex].description}
						</p>
					</div>
				</div>
				<div className="carousel-controls">
					<CarouselComponent
						activeIndex={activeIndex}
						onCarouselChange={handleCarouselChange}
					/>
				</div>
			</div>
		</div>
	);
};

export default NewLoginDescription;
