import React, { useState } from 'react';
import '../styles.scss';
import { ReactComponent as DropdownArrow } from '../../library/svgs/logicform/backarrow.svg';
import { Slider } from 'antd';
import 'antd/dist/reset.css'; // For antd v5
const Expand = ({ activeComponent, adjustAnimation }) => {
	const [selectedOption, setSelectedOption] = useState('In');
	const [direction, setDirection] = useState('Center');
	const [isOpen, setIsOpen] = useState(false);
	const [isDirectionOpen, setIsDirectionOpen] = useState(false);
	const [scale, setScale] = useState(0);
	const [speed, setSpeed] = useState(2);
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

	const toggleDirectionDropdown = () => {
		setIsDirectionOpen(!isDirectionOpen);
	};
	const handleDirectionSelect = (dir) => {
		setDirection(dir);
		setIsDirectionOpen(false);
	};
	const handleAnimeArea = (value) => {
		setAnimeArea(value);
		adjustAnimation('animeArea', value);
	};
	return (
		<div className="adj-popup-container">
			<div className="adj-anime-type">
				<p className="adj-anime-name">Expand</p>
			</div>
			<div className="adj-element-position">
				<div className="adj-dropdown-container">
					<div className="adj-dropdown-header" onClick={toggleDropdown}>
						<div className="adj-select-position">
							{activeComponent?.animations?.adjustments?.triggerPoint ||
								selectedOption}
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

export default Expand;
