import React, { useState } from 'react';
import '../styles.scss';
import { ReactComponent as Arrow } from '../../library/svgs/arrow.svg';
import { ReactComponent as DropdownArrow } from '../../library/svgs/logicform/backarrow.svg';

const Move = ({ activeComponent, adjustAnimation }) => {
	const [selectedOption, setSelectedOption] = useState('From Current Position');
	const [isOpen, setIsOpen] = useState(false);
	const [distance, setDistance] = useState(10);
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
				<p className="adj-anime-name">Move</p>
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

			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Direction</b>
				<div className="adj-directions-container">
					<button
						className={`adj-arrow-button  ${
							activeComponent?.animations?.adjustments?.mDirection === 'top'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('mDirection', 'top', 'translate');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							{/*top*/}
							<Arrow style={{ transform: 'rotate(270deg)' }} color="#8A8A8A" />
						</p>
					</button>
					<button
						className={`adj-arrow-button ${
							activeComponent?.animations?.adjustments?.mDirection === 'right'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('mDirection', 'right', 'translate');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							{/*right*/}
							<Arrow style={{ transform: 'rotate(360deg)' }} color="#8A8A8A" />
						</p>
					</button>
					<button
						className={`adj-arrow-button  ${
							activeComponent?.animations?.adjustments?.mDirection === 'down'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('mDirection', 'down', 'translate');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							{/*down*/}
							<Arrow style={{ transform: 'rotate(90deg)' }} color="#8A8A8A" />
						</p>
					</button>
					<button
						className={`adj-arrow-button  ${
							activeComponent?.animations?.adjustments?.mDirection === 'left'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('mDirection', 'left', 'translate');
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
					<div
						className="adj-slider-container"
						style={{ display: 'flex', maxWidth: 170 }}
					>
						<input
							type="range"
							min="10"
							max="1000"
							step="10"
							value={
								activeComponent?.animations?.adjustments?.animeDistance || distance
							}
							onChange={(e) => {
								setDistance(e.target.value);
								adjustAnimation('animeDistance', e.target.value);
							}}
						/>
					</div>
					<div className="adj-slider-value">
						{activeComponent?.animations?.adjustments?.animeDistance || distance}
						<span className="adj-units">px</span>
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
						<span className="adj-units">s</span>
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
						<span className="adj-units">s</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Move;
