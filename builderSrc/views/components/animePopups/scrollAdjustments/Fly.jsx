import React, { useState } from 'react';
import '../styles.scss';
import { ReactComponent as Arrow } from '../../library/svgs/arrow.svg';
import { ReactComponent as DropdownArrow } from '../../library/svgs/logicform/backarrow.svg';
import { Slider } from 'antd';
import 'antd/dist/reset.css'; // For antd v5
const Fly = ({ activeComponent, adjustAnimation }) => {
	const [selectedOption, setSelectedOption] = useState('In');
	const [isOpen, setIsOpen] = useState(false);
	const [angle, setSkew] = useState(10);
	const [direction, setDirection] = useState('right');
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
				<p className="adj-anime-name">Fly</p>
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

			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Direction</b>
				<div className="adj-shape-container">
					<button
						className={`adj-arrow-button ${
							activeComponent?.animations?.adjustments?.direction === 'left'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('direction', 'left');
							setDirection('right');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							{/*right*/}
							<Arrow style={{ transform: 'rotate(360deg)' }} color="#8A8A8A" />
						</p>
					</button>

					<button
						className={`adj-arrow-button  ${
							activeComponent?.animations?.adjustments?.direction === 'right'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('direction', 'right');
							setDirection('left');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							{/*left*/}
							<Arrow style={{ transform: 'rotate(180deg)' }} color="#8A8A8A" />
						</p>
					</button>
				</div>
			</div>

			{/*Skew Slider*/}
			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Skew</b>
				<div className="adj-popup-range-div">
					<div className="adj-slider-container">
						<input
							type="range"
							min="10"
							max="24"
							step="1"
							value={activeComponent?.animations?.adjustments?.angle || angle}
							onChange={(e) => {
								adjustAnimation('angle', e.target.value);
								setSkew(e.target.value);
							}}
						/>
					</div>
					<div className="adj-slider-value">
						{activeComponent?.animations?.adjustments?.angle || angle}°
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

export default Fly;
