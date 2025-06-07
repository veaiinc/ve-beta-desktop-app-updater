import React, { useState } from 'react';
import '../styles.scss';
import { ReactComponent as DropdownArrow } from '../../library/svgs/logicform/backarrow.svg';
const Spin = ({ activeComponent, adjustAnimation }) => {
	const [selectedOption, setSelectedOption] = useState('Clockwise');
	const [isOpen, setIsOpen] = useState(false);
	const [duration, setDuration] = useState(0);
	const [animeDelay, setAnimeDelay] = useState(0);

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
				<p className="adj-anime-name">Spin</p>
			</div>
			<div className="adj-element-position">
				<div className="adj-dropdown-container">
					<div className="adj-dropdown-header" onClick={toggleDropdown}>
						<div className="adj-select-position">
							{activeComponent?.animations?.adjustments?.direction || selectedOption}
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
									activeComponent?.animations?.adjustments?.direction ===
									'Clockwise'
										? 'adj-active-dropdown'
										: ''
								}`}
								onClick={() => {
									handleSelect('Clockwise');
									adjustAnimation('direction', 'Clockwise');
								}}
							>
								Clockwise
							</div>
							<div
								className={`adj-dropdown-item ${
									activeComponent?.animations?.adjustments?.direction ===
									'Counter-clockwise'
										? 'adj-active-dropdown'
										: ''
								}`}
								onClick={() => {
									handleSelect('Counter-clockwise');
									adjustAnimation('direction', 'Counter-clockwise');
								}}
							>
								Counter-clockwise
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="adj-line"></div>

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
							min="1"
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
						<span className="adj-units">s</span>
					</div>
				</div>
			</div>

			{/* Repeat Delay Slider */}
			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Repeat delay</b>
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
								activeComponent?.animations?.adjustments?.animeDelay || animeDelay
							}
							onChange={(e) => {
								setAnimeDelay(e.target.value);
								adjustAnimation('animeDelay', e.target.value);
							}}
						/>
					</div>
					<div className="adj-slider-value">
						{activeComponent?.animations?.adjustments?.animeDelay || animeDelay}
						<span className="adj-units">s</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Spin;
