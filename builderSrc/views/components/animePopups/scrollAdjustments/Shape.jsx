import React, { useState } from 'react';
import '../styles.scss';
import { ReactComponent as DropdownArrow } from '../../library/svgs/logicform/backarrow.svg';
import { Slider } from 'antd';
import 'antd/dist/reset.css'; // For antd v5
const Shape = ({ activeComponent, adjustAnimation }) => {
	const [selectedOption, setSelectedOption] = useState('In');
	const [isOpen, setIsOpen] = useState(false);
	const [intensity, setIntensity] = useState(0);
	const [direction, setShape] = useState('');
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
	const handleAnimeArea = (value) => {
		setAnimeArea(value);
		adjustAnimation('animeArea', value);
	};
	return (
		<div className="adj-popup-container">
			<div className="adj-anime-type">
				<p className="adj-anime-name">Shape</p>
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
				<b className="adj-adjustment-title">Choose shape</b>
				<div className="adj-shape-container">
					<button
						className={`adj-arrow-button  ${
							activeComponent?.animations?.adjustments?.direction === 'circle'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('direction', 'circle');
							setShape('circle');
						}}
					>
						<div
							className="adj-shape adj-circle"
							style={{
								width: '20px',
							}}
						></div>
					</button>
					<button
						className={`adj-arrow-button ${
							activeComponent?.animations?.adjustments?.direction === 'square'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('direction', 'square');
							setShape('square');
						}}
					>
						<div className="adj-shape"></div>
					</button>
					<button
						className={`adj-arrow-button  ${
							activeComponent?.animations?.adjustments?.direction === 'diamond'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('direction', 'diamond');
							setShape('diamond');
						}}
					>
						<div
							className="adj-shape adj-diamond"
							style={{
								width: '20px',
							}}
						></div>
					</button>
					<button
						className={`adj-arrow-button  ${
							activeComponent?.animations?.adjustments?.direction === 'oval'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('direction', 'oval');
							setShape('oval');
						}}
					>
						<div
							className="adj-shape adj-oval"
							style={{
								height: '16px',
							}}
						></div>
					</button>
				</div>
			</div>

			{/* Intensity Slider */}
			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Intensity</b>
				<div className="adj-popup-range-div">
					<div className="adj-slider-container">
						<input
							type="range"
							min="0.1"
							max="1"
							step="0.1"
							value={
								activeComponent?.animations?.adjustments?.animeIntensity ||
								intensity
							}
							onChange={(e) => {
								setIntensity(e.target.value);
								adjustAnimation('animeIntensity', e.target.value);
							}}
						/>
					</div>
					<div className="adj-slider-value">
						{activeComponent?.animations?.adjustments?.animeIntensity || intensity}
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

export default Shape;
