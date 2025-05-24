import React, { useState } from 'react';
import '../styles.scss';
import { ReactComponent as Arrow } from '../../library/svgs/arrow.svg';
import { ReactComponent as DropdownArrow } from '../../library/svgs/logicform/backarrow.svg';
const Turn = ({ activeComponent, adjustAnimation }) => {
	const [selectedOption, setSelectedOption] = useState('In');
	const [orentation, setOrentation] = useState('Clockwise');
	const [isOptionOpen, setIsOptionOpen] = useState(false);
	const [isOrentationOpen, setIsOrentationOpen] = useState(false);
	const [scale, setScale] = useState(0);
	const [direction, setDirection] = useState('right');
	const [animation, setAnimation] = useState(50);

	const toggleOptionDropdown = () => {
		setIsOptionOpen(!isOptionOpen);
		setIsOrentationOpen(false);
	};

	const toggleOrentationDropdown = () => {
		setIsOrentationOpen(!isOrentationOpen);
		setIsOptionOpen(false);
	};

	const handleOptionSelect = (option) => {
		setSelectedOption(option);
		setIsOptionOpen(false);
	};

	const handleOrentationSelect = (option) => {
		setOrentation(option);
		setIsOrentationOpen(false);
	};

	return (
		<div className="adj-popup-container">
			<div className="adj-anime-type">
				<p className="adj-anime-name">Turn</p>
			</div>

			{/* In/Out Dropdown */}
			<div className="adj-element-position">
				<div className="adj-dropdown-container">
					<div className="adj-dropdown-header" onClick={toggleOptionDropdown}>
						<div className="adj-select-position">{selectedOption}</div>
						<p className="adj-dropdown-arrow">
							<DropdownArrow
								style={{ transform: 'rotate(270deg)' }}
								color="#8A8A8A"
							/>
						</p>
					</div>
					{isOptionOpen && (
						<div className="adj-dropdown-list">
							{['In', 'Out'].map((option) => (
								<div
									key={option}
									className={`adj-dropdown-item ${
										selectedOption === option ? 'adj-active-dropdown' : ''
									}`}
									onClick={() => handleOptionSelect(option)}
								>
									{option}
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			<div className="adj-line"></div>
			{/* Direction Buttons */}
			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Direction</b>
				<div className="adj-directions-container">
					<button
						className={`adj-arrow-button ${
							activeComponent?.animations?.adjustments?.direction === 'right'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('direction', 'right');
							setDirection('right');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							{/* Right */}
							<Arrow style={{ transform: 'rotate(0deg)' }} color="#8A8A8A" />
						</p>
					</button>
					<button
						className={`adj-arrow-button ${
							activeComponent?.animations?.adjustments?.direction === 'left'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('direction', 'left');
							setDirection('left');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							{/* Left */}
							<Arrow style={{ transform: 'rotate(180deg)' }} color="#8A8A8A" />
						</p>
					</button>
				</div>
			</div>

			{/* Orientation Dropdown */}
			<b className="adj-adjustment-title" style={{ marginLeft: '12px' }}>
				Orientation
			</b>
			<div className="adj-element-position">
				<div className="adj-dropdown-container">
					<div className="adj-dropdown-header" onClick={toggleOrentationDropdown}>
						<div className="adj-select-position">
							{activeComponent?.animations?.adjustments?.orientation || orentation}
						</div>
						<p className="adj-dropdown-arrow">
							<DropdownArrow
								style={{ transform: 'rotate(270deg)' }}
								color="#8A8A8A"
							/>
						</p>
					</div>
					{isOrentationOpen && (
						<div className="adj-dropdown-list">
							{['Clockwise', 'Counter-clockwise'].map((option) => (
								<div
									key={option}
									className={`adj-dropdown-item ${
										activeComponent?.animations?.adjustments?.orientation ===
										option
											? 'adj-active-dropdown'
											: ''
									}`}
									onClick={() => {
										adjustAnimation('orientation', option);
										handleOrentationSelect(option);
									}}
								>
									{option}
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* scale Slider */}
			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Scale</b>
				<div className="adj-popup-range-div">
					<div className="adj-slider-container">
						<input
							type="range"
							min="1"
							max="5"
							step="0.1"
							value={activeComponent?.animations?.adjustments?.scale || scale}
							onChange={(e) => {
								adjustAnimation('scale', e.target.value);
								setScale(e.target.value);
							}}
						/>
					</div>
					<div className="adj-slider-value">
						{activeComponent?.animations?.adjustments?.scale || scale}
					</div>
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

export default Turn;
