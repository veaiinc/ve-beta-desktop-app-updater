import React, { useState } from 'react';
import '../styles.scss';
import { ReactComponent as Arrow } from '../../library/svgs/arrow.svg';
import { ReactComponent as DropdownArrow } from '../../library/svgs/logicform/backarrow.svg';

const Reveal = ({ activeComponent, adjustAnimation }) => {
	const [selectedOption, setSelectedOption] = useState('In');
	const [isOpen, setIsOpen] = useState(false);
	const [direction, setDirection] = useState('top');
	const [animation, setAnimation] = useState(50);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleSelect = (option) => {
		setSelectedOption(option);
		setIsOpen(false);
	};
	const directions = [
		{ name: 'top', angle: 270 },
		{ name: 'right', angle: 0 },
		{ name: 'bottom', angle: 90 },
		{ name: 'left', angle: 180 },
	];

	return (
		<div className="adj-popup-container">
			<div className="adj-anime-type">
				<p className="adj-anime-name">Reveal</p>
			</div>

			<div className="adj-element-position">
				<div className="adj-dropdown-container">
					<div className="adj-dropdown-header" onClick={toggleDropdown}>
						<div className="adj-select-position">{selectedOption}</div>
						<div>
							<p className="adj-dropdown-arrow">
								<DropdownArrow
									style={{ transform: 'rotate(270deg)' }}
									color="#8A8A8A"
								/>
							</p>
						</div>
					</div>

					{isOpen && (
						<div className="adj-dropdown-list">
							<div
								className={`adj-dropdown-item ${
									selectedOption === 'In' ? 'adj-active-dropdown' : ''
								}`}
								onClick={() => handleSelect('In')}
							>
								In
							</div>
							<div
								className={`adj-dropdown-item ${
									selectedOption === 'Out' ? 'adj-active-dropdown' : ''
								}`}
								onClick={() => handleSelect('Out')}
							>
								Out
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="adj-line"></div>

			{/*Directions */}

			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Direction</b>
				<div className="adj-directions-container">
					{directions.map(({ name, angle }) => (
						<button
							key={name}
							className={`adj-arrow-button ${direction === name ? 'adj-active' : ''}`}
							onClick={() => {
								adjustAnimation('direction', name);
								setDirection(name);
							}}
						>
							<p className="adj-dropdown-arrow">
								<Arrow
									style={{ transform: `rotate(${angle}deg)` }}
									color="#8A8A8A"
								/>
							</p>
						</button>
					))}
				</div>
			</div>

			{/* Animation Slider */}
			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Animation area</b>
				<div className="adj-popup-range-div">
					<div className="adj-slider-wrapper">
						<input
							type="range"
							min="0"
							max="100"
							step="1"
							value={activeComponent?.animations?.adjustments?.animeArea || animation}
							onChange={(e) => {
								setAnimation(e.target.value);
								adjustAnimation('animeArea', e.target.value);
							}}
							className="adj-animation-slider"
						/>
						<div className="adj-slider-labels">
							<span>0%</span>
							<span>50%</span>
							<span>100%</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Reveal;
