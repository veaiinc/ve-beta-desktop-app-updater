import React, { useState } from 'react';
import '../styles.scss';
import { ReactComponent as DropdownArrow } from '../../library/svgs/logicform/backarrow.svg';
const Expand = ({ activeComponent, adjustAnimation }) => {
	const [selectedOption, setSelectedOption] = useState('In');
	const [direction, setDirection] = useState('Center');
	const [isOpen, setIsOpen] = useState(false);
	const [isDirectionOpen, setIsDirectionOpen] = useState(false);
	const [scale, setScale] = useState(0);
	const [speed, setSpeed] = useState(2);
	const [animation, setAnimation] = useState(50);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleSelect = (option) => {
		setSelectedOption(option);
		setIsOpen(false);
	};

	const toggleDirectionDropdown = () => {
		setIsDirectionOpen(!isDirectionOpen);
	};
	const handleDirectionSelect = (dir) => {
		setDirection(dir);
		setIsDirectionOpen(false);
	};

	return (
		<div className="adj-popup-container">
			<div className="adj-anime-type">
				<p className="adj-anime-name">Expand</p>
			</div>
			<div className="adj-element-position">
				<div className="adj-dropdown-container">
					<div className="adj-dropdown-header" onClick={toggleDropdown}>
						<div className="adj-select-position">{selectedOption}</div>
						<div>
							{' '}
							<p className="adj-dropdown-arrow">
								<DropdownArrow
									style={{ transform: 'rotate(270deg)' }}
									color="#8A8A8A"
								/>
							</p>{' '}
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

			{/* Scale Slider */}
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

			{/* Speed Slider */}
			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Speed</b>
				<div className="adj-popup-range-div">
					<div className="adj-slider-container">
						<input
							type="range"
							min="0.1"
							max="4"
							step="0.1"
							value={activeComponent?.animations?.adjustments?.speed || speed}
							onChange={(e) => {
								adjustAnimation('speed', e.target.value);
								setSpeed(e.target.value);
							}}
						/>
					</div>
					<div className="adj-slider-value">
						{activeComponent?.animations?.adjustments?.speed || speed}
					</div>
				</div>
			</div>

			{/* Direction Dropdown */}
			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Direction</b>
				<div className="adj-dropdown-container">
					<div className="adj-dropdown-header" onClick={toggleDirectionDropdown}>
						<div className="adj-select-position">
							{activeComponent?.animations?.adjustments?.direction || direction}
						</div>
						<div>
							{' '}
							<p className="adj-dropdown-arrow">
								<DropdownArrow
									style={{ transform: 'rotate(270deg)' }}
									color="#8A8A8A"
								/>
							</p>{' '}
						</div>
					</div>

					{isDirectionOpen && (
						<div className="adj-dropdown-list">
							{[
								'From Right',
								'From Top Right',
								'From Top',
								'From Top Left',
								'From Left',
								'From Bottom Left',
								'From Bottom Right',
								'Center',
							].map((dir) => (
								<div
									key={dir}
									className={`adj-dropdown-item ${
										activeComponent?.animations?.adjustments?.direction === dir
											? 'adj-active-dropdown'
											: ''
									}`}
									onClick={() => {
										adjustAnimation('direction', dir);
										handleDirectionSelect(dir);
									}}
								>
									{dir}
								</div>
							))}
						</div>
					)}
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

export default Expand;
