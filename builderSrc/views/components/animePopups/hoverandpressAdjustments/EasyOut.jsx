import React, { useState } from 'react';
import '../styles.scss';
import { ReactComponent as DropdownArrow } from '../../library/svgs/logicform/backarrow.svg';
const EasyOut = ({ activeComponent, adjustAnimation }) => {
	const [selectedOption, setSelectedOption] = useState('From Current Position');
	const [isOpen, setIsOpen] = useState(false);
	const [fontSize, setFontSize] = useState(0.1);
	const [duration, setDuration] = useState(0);
	const [delay, setDelay] = useState(0);

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
				<p className="adj-anime-name">Easy Out</p>
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
							</p>
						</div>
					</div>

					{isOpen && (
						<div className="adj-dropdown-list">
							<div
								className={`adj-dropdown-item ${
									selectedOption === 'From Current Position'
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
									selectedOption === 'Into Current Position'
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
				<b className="adj-adjustment-title">Scale</b>
				<div className="adj-popup-range-div">
					<div
						className="adj-slider-container"
						style={{ display: 'flex', maxWidth: 170 }}
					>
						<input
							type="range"
							min={1}
							max={5}
							step={0.1}
							value={activeComponent?.animations?.adjustments?.scale || fontSize}
							onChange={(e) => {
								setFontSize(e.target.value);
								adjustAnimation('scale', e.target.value, 'scale');
							}}
						/>
					</div>
					<div className="adj-slider-value">
						{activeComponent?.animations?.adjustments?.scale || fontSize}
					</div>
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
							step="1"
							value={activeComponent?.animations?.adjustments?.animeDelay || delay}
							onChange={(e) => {
								setDelay(e.target.value);
								adjustAnimation('animeDelay', e.target.value);
							}}
						/>
					</div>
					<div className="adj-slider-value">
						{activeComponent?.animations?.adjustments?.animeDelay || delay}
					</div>
				</div>
			</div>
		</div>
	);
};

export default EasyOut;
