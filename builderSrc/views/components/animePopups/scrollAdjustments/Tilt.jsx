import React, { useState } from 'react';
import '../styles.scss';
import { ReactComponent as Arrow } from '../../library/svgs/arrow.svg';
import { ReactComponent as DropdownArrow } from '../../library/svgs/logicform/backarrow.svg';
import { Slider } from 'antd';
import 'antd/dist/reset.css'; // For antd v5
const Tilt = ({ activeComponent, adjustAnimation }) => {
	const [selectedOption, setSelectedOption] = useState('In');
	const [isOptionOpen, setIsOptionOpen] = useState(false);
	const [speed, setSpeed] = useState(0);
	const [animeArea, setAnimeArea] = useState(
		activeComponent?.animations?.adjustments?.animeArea || [10, 50],
	);

	const toggleOptionDropdown = () => {
		setIsOptionOpen(!isOptionOpen);
	};

	const handleOptionSelect = (option) => {
		setSelectedOption(option);
		setIsOptionOpen(!isOptionOpen);
	};
	const handleAnimeArea = (value) => {
		setAnimeArea(value);
		adjustAnimation('animeArea', value);
	};
	return (
		<div className="adj-popup-container">
			<div className="adj-anime-type">
				<p className="adj-anime-name">Tilt</p>
			</div>

			{/* In/Out Dropdown */}
			<div className="adj-element-position">
				<div className="adj-dropdown-container">
					<div className="adj-dropdown-header" onClick={toggleOptionDropdown}>
						<div className="adj-select-position">
							{activeComponent?.animations?.adjustments?.triggerPoint ||
								selectedOption}
						</div>
						<p className="adj-dropdown-arrow">
							<DropdownArrow
								style={{ transform: 'rotate(270deg)' }}
								color="#8A8A8A"
							/>
						</p>
					</div>
					{isOptionOpen && (
						<div className="adj-dropdown-list">
							<div
								className={`adj-dropdown-item ${
									activeComponent?.animations?.adjustments?.triggerPoint === 'In'
										? 'adj-active-dropdown'
										: ''
								}`}
								onClick={() => {
									setIsOptionOpen(false);
									adjustAnimation('triggerPoint', 'In');
								}}
							>
								In
							</div>
							<div
								className={`adj-dropdown-item ${
									activeComponent?.animations?.adjustments?.triggerPoint === 'Out'
										? 'adj-active-dropdown'
										: ''
								}`}
								onClick={() => {
									setIsOptionOpen(false);
									adjustAnimation('triggerPoint', 'Out');
								}}
							>
								Out
							</div>
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
							activeComponent?.animations?.adjustments?.direction === 'left'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('direction', 'left');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							{/* Right */}
							<Arrow style={{ transform: 'rotate(0deg)' }} color="#8A8A8A" />
						</p>
					</button>
					<button
						className={`adj-arrow-button ${
							activeComponent?.animations?.adjustments?.direction === 'right'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('direction', 'right');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							{/* Left */}
							<Arrow style={{ transform: 'rotate(180deg)' }} color="#8A8A8A" />
						</p>
					</button>
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

			{/* Animation Slider */}
			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Animation area</b>
				<div className="adj-popup-range-div">
					<div className="adj-slider-wrapper">
						<div
							className="adj-animation-slider"
							style={{
								width: '100%',
							}}
						>
							<Slider range step={2} value={animeArea} onChange={handleAnimeArea} />{' '}
						</div>
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

export default Tilt;
