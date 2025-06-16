import React, { useState } from 'react';
import '../styles.scss';
import { ReactComponent as Arrow } from '../../library/svgs/arrow.svg';
import { ReactComponent as DropdownArrow } from '../../library/svgs/logicform/backarrow.svg';
import { Slider } from 'antd';
import 'antd/dist/reset.css'; // For antd v5
const Shutters = ({ activeComponent, adjustAnimation }) => {
	const [selectedOption, setSelectedOption] = useState('In');
	const [isOpen, setIsOpen] = useState(false);
	const [intensity, setIntensity] = useState(0);
	const [isChecked, setIsChecked] = useState(false);
	const [animeArea, setAnimeArea] = useState(
		activeComponent?.animations?.adjustments?.animeArea || [10, 50],
	);
	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleSelect = (option) => {
		setSelectedOption(option);
		setIsOpen(false);
	};
	const directions = [
		{ label: 'top', value: 'top', rotation: 270 },
		{ label: 'right', value: 'right', rotation: 0 },
		{ label: 'down', value: 'down', rotation: 90 },
		{ label: 'left', value: 'left', rotation: 180 },
	];
	const handleDirectionChange = (dir) => {
		adjustAnimation('direction', dir);
	};
	const handleAnimeArea = (value) => {
		setAnimeArea(value);
		adjustAnimation('animeArea', value);
	};
	return (
		<div className="adj-popup-container">
			<div className="adj-anime-type">
				<p className="adj-anime-name">Shutters</p>
			</div>
			<div className="adj-element-position">
				<div className="adj-dropdown-container">
					<div className="adj-dropdown-header" onClick={toggleDropdown}>
						<div className="adj-select-position">
							{activeComponent?.animations?.adjustments?.triggerPoint ||
								selectedOption}
						</div>
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
									activeComponent?.animations?.adjustments?.triggerPoint === 'In'
										? 'adj-active-dropdown'
										: ''
								}`}
								onClick={() => {
									handleSelect('In');
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
									handleSelect('Out');
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
			{/*Directions */}
			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Direction</b>
				<div className="adj-shape-container">
					{directions.map(({ label, value, rotation }) => (
						<button
							key={label}
							className={`adj-arrow-button ${
								activeComponent?.animations?.adjustments?.direction == value
									? 'adj-active'
									: ''
							}`}
							onClick={() => {
								adjustAnimation('direction', value);
								handleDirectionChange(value);
							}}
						>
							<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
								<Arrow
									style={{ transform: `rotate(${rotation}deg)` }}
									color="#8A8A8A"
								/>
							</p>
						</button>
					))}
				</div>
			</div>

			{/* Parts  Slider */}
			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Number of Parts</b>
				<div className="adj-popup-range-div">
					<div className="adj-slider-container">
						<input
							type="range"
							min="2"
							max="24"
							step="1"
							value={activeComponent?.animations?.adjustments?.parts || intensity}
							onChange={(e) => {
								adjustAnimation('parts', e.target.value);
								setIntensity(e.target.value);
							}}
						/>
					</div>
					<div className="adj-slider-value">
						{activeComponent?.animations?.adjustments?.parts || intensity}
					</div>
				</div>
			</div>

			<div className="adj-checkbox">
				<label
					onClick={() => {
						setIsChecked(!isChecked);
						adjustAnimation('stagger', !isChecked);
					}}
				>
					<input
						type="checkbox"
						checked={activeComponent?.animations?.adjustments?.stagger || isChecked}
					/>
					<span className="adj-text">Stagger the animation</span>
				</label>
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

export default Shutters;
