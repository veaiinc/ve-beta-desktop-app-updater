import React, { useState, useRef, useEffect } from 'react';
import CarouselComponent from './CarouselComponent';
import { newLoginDescription } from './newconstant';
import Carousel1 from './assets/LoginImages/Carousel-1.png';
import Carousel2 from './assets/LoginImages/Carousel-2.png';
import Carousel3 from './assets/LoginImages/Carousel-3.png';

const NewLoginDescription = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const imageContainerRef = useRef(null);

	const carouselImages = [Carousel1, Carousel2, Carousel3];

	const handleCarouselChange = (newIndex) => {
		if (typeof newIndex === 'function') {
			// Handle auto-slide case where newIndex is a function
			setActiveIndex((prevIndex) => {
				const nextIndex = newIndex(prevIndex);
				triggerSlideAnimation(nextIndex);
				return nextIndex;
			});
		} else {
			// Handle manual click case
			triggerSlideAnimation(newIndex);
			setActiveIndex(newIndex);
		}
	};

	const triggerSlideAnimation = (newIndex) => {
		setIsTransitioning(true);
		setTimeout(() => {
			setIsTransitioning(false);
		}, 500); // Match the CSS transition duration
	};

	return (
		<div className="new-login-description-container">
			<div className="carousel-content-wrapper">
				<div
					className={`carousel-image-container ${isTransitioning ? 'sliding' : ''}`}
					ref={imageContainerRef}
				>
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
							{newLoginDescription[activeIndex].description
								.split('\n')
								.map((line, index) => (
									<React.Fragment key={index}>
										{line}
										{index <
											newLoginDescription[activeIndex].description.split('\n')
												.length -
												1 && <br />}
									</React.Fragment>
								))}
						</p>
					</div>
				</div>
				<div className="carousel-controls">
					<CarouselComponent
						activeIndex={activeIndex}
						onCarouselChange={handleCarouselChange}
						autoSlide={true}
						slideDuration={3000}
					/>
				</div>
			</div>
		</div>
	);
};

export default NewLoginDescription;
