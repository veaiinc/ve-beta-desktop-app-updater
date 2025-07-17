import React, { useState } from 'react';
import '../styles.scss';
import { ReactComponent as DropdownArrow } from '../../library/svgs/logicform/backarrow.svg';
import { ReactComponent as Arrow } from '../../library/svgs/arrow.svg';
import { Slider } from 'antd';
import 'antd/dist/reset.css'; // For antd v5
const Move = ({ activeComponent, adjustAnimation }) => {
	const [selectedOption, setSelectedOption] = useState('In');
	const [isOpen, setIsOpen] = useState(false);
	const [distance, setDistance] = useState(0);
	const [animation, setAnimation] = useState(50);
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
				<p className="adj-anime-name">Move</p>
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

			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Direction</b>
				<div className="adj-directions-container">
					<button
						className={`adj-arrow-button  ${
							activeComponent?.animations?.adjustments?.direction === 'bottom'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('direction', 'bottom');
							// setDirection('right');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							{/*top*/}
							<Arrow style={{ transform: 'rotate(270deg)' }} color="#8A8A8A" />
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
							// setDirection('right');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							{/*right*/}
							<Arrow style={{ transform: 'rotate(360deg)' }} color="#8A8A8A" />
						</p>
					</button>
					<button
						className={`adj-arrow-button  ${
							activeComponent?.animations?.adjustments?.direction === 'top'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('direction', 'top');
							// setDirection('right');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							{/*down*/}
							<Arrow style={{ transform: 'rotate(90deg)' }} color="#8A8A8A" />
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
							// setDirection('right');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							{/*left*/}
							<Arrow style={{ transform: 'rotate(180deg)' }} color="#8A8A8A" />
						</p>
					</button>
				</div>
			</div>

			{/* Distance Slider */}
			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Distance</b>
				<div className="adj-popup-range-div">
					<div className="adj-slider-container">
						<input
							type="range"
							min="0"
							max="400"
							step="1"
							value={
								activeComponent?.animations?.adjustments?.animeDistance || distance
							}
							onChange={(e) => {
								adjustAnimation('animeDistance', e.target.value);
								setDistance(e.target.value);
							}}
						/>
					</div>
					<div className="adj-slider-value">
						{activeComponent?.animations?.adjustments?.animeDistance || distance}
						<span className="adj-units">px</span>
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

export default Move;
