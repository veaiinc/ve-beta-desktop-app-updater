import React, { useState } from 'react';
import '../styles.scss';
import { ReactComponent as Arrow } from '../../library/svgs/arrow.svg';
import { ReactComponent as DropdownArrow } from '../../library/svgs/logicform/backarrow.svg';
const Rotate = ({ activeComponent, adjustAnimation }) => {
	const [selectedOption, setSelectedOption] = useState('From Current Position');
	const [isOpen, setIsOpen] = useState(false);
	const [angle, setAngle] = useState(0);
	const [duration, setDuration] = useState(0);
	const [delay, setDelay] = useState(0);
	const [direction, setDirection] = useState('');

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleSelect = (option) => {
		setSelectedOption(option);
		setIsOpen(false);
	};

	return (
		<div className="adj-popup-container">
			<div className="adj-anime-type">
				<p className="adj-anime-name">Rotate</p>
			</div>
			<div className="adj-element-position">
				<div className="adj-dropdown-container">
					<div className="adj-dropdown-header" onClick={toggleDropdown}>
						<div className="adj-select-position">
							{activeComponent?.animations?.adjustments?.position === 'from'
								? 'From Current Position'
								: 'Into Current Position'}
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

					{isOpen && (
						<div className="adj-dropdown-list">
							<div
								className={`adj-dropdown-item ${
									activeComponent?.animations?.adjustments?.position === 'from'
										? 'adj-active-dropdown'
										: ''
								}`}
								onClick={() => {
									handleSelect('From Current Position');
									adjustAnimation('position', 'from');
								}}
							>
								From Current Position
							</div>
							<div
								className={`adj-dropdown-item ${
									activeComponent?.animations?.adjustments?.position === 'into'
										? 'adj-active-dropdown'
										: ''
								}`}
								onClick={() => {
									handleSelect('Into Current Position');
									adjustAnimation('position', 'into');
								}}
							>
								Into Current Position
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="adj-line"></div>

			{/* Scale Slider */}
			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Angle</b>
				<div className="adj-popup-range-div">
					<div
						className="adj-slider-container"
						style={{ display: 'flex', maxWidth: 170 }}
					>
						<input
							type="range"
							min="0"
							max="360"
							step="5"
							value={activeComponent?.animations?.adjustments?.rotate || angle}
							onChange={(e) => {
								setAngle(e.target.value);
								adjustAnimation('rotate', e.target.value, 'rotate');
							}}
						/>
					</div>
					<div className="adj-slider-value">
						{activeComponent?.animations?.adjustments?.rotate || angle}°
					</div>
				</div>
			</div>

			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Direction</b>
				<div className="adj-directions-container">
					<button
						className={`adj-arrow-button  ${
							activeComponent?.animations?.adjustments?.direction === 'left'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							setDirection('left');
							adjustAnimation('direction', 'left');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							{/*left*/}
							<Arrow style={{ transform: 'rotate(180deg)' }} color="#8A8A8A" />
						</p>
					</button>
					<button
						className={`adj-arrow-button ${
							activeComponent?.animations?.adjustments?.direction === 'right'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							setDirection('right');
							adjustAnimation('direction', 'right');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							{/*right*/}
							<Arrow style={{ transform: 'rotate(360deg)' }} color="#8A8A8A" />
						</p>
					</button>
				</div>
			</div>

			{/* Duration Slider */}
			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Duration</b>
				<div className="adj-popup-range-div">
					<div
						className="adj-slider-container"
						style={{ display: 'flex', maxWidth: 170 }}
					>
						<input
							type="range"
							min="0"
							max="10"
							step="0.1"
							value={
								activeComponent?.animations?.adjustments?.animeDuration || duration
							}
							onChange={(e) => {
								setDuration(e.target.value);
								adjustAnimation('animeDuration', e.target.value);
							}}
						/>
					</div>
					<div className="adj-slider-value">
						{activeComponent?.animations?.adjustments?.animeDuration || duration}
						<span className="adj-duration">s</span>
					</div>
				</div>
			</div>

			{/* Delay Slider */}
			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Delay</b>
				<div className="adj-popup-range-div">
					<div
						className="adj-slider-container"
						style={{ display: 'flex', maxWidth: 170 }}
					>
						<input
							type="range"
							min="0"
							max="10"
							step="0.1"
							value={activeComponent?.animations?.adjustments?.animeDelay || delay}
							onChange={(e) => {
								setDelay(e.target.value);
								adjustAnimation('animeDelay', e.target.value);
							}}
						/>
					</div>
					<div className="adj-slider-value">
						{activeComponent?.animations?.adjustments?.animeDelay || delay}
						<span className="adj-duration">s</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Rotate;
