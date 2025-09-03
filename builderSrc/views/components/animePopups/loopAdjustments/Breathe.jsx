import React, { useState } from 'react';
import '../styles.scss';
import { ReactComponent as Center } from '../../library/svgs/adjustmentSvgs/center.svg';
import { ReactComponent as Horizontal } from '../../library/svgs/adjustmentSvgs/horizontal-icon.svg';
import { ReactComponent as Vertical } from '../../library/svgs/adjustmentSvgs/vertical.svg';
const Breathe = ({ activeComponent, adjustAnimation }) => {
	const [distance, setDistance] = useState(0);
	const [duration, setDuration] = useState(0);
	const [repeatDelay, setRepeatDelay] = useState(0);
	const [direction, setDirection] = useState('horizontal');

	return (
		<div className="adj-popup-container">
			<div className="adj-anime-type">
				<p className="adj-anime-name">Breathe</p>
			</div>
			<div className="adj-line"></div>

			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Direction</b>
				<div className="adj-directions-container">
					<button
						className={`adj-arrow-button  ${
							activeComponent?.animations?.adjustments?.direction === 'vertical'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							setDirection('vertical');
							adjustAnimation('direction', 'vertical');
						}}
					>
						<p>
							<Horizontal />
						</p>
					</button>
					<button
						className={`adj-arrow-button ${
							activeComponent?.animations?.adjustments?.direction === 'center'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							setDirection('center');
							adjustAnimation('direction', 'center');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							<Center />
						</p>
					</button>
					<button
						className={`adj-arrow-button  ${
							activeComponent?.animations?.adjustments?.direction === 'horizontal'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							setDirection('horizontal');
							adjustAnimation('direction', 'horizontal');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							<Vertical />
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
							max="400"
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

			{/* Repeat delay Slider */}
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
								activeComponent?.animations?.adjustments?.animeDelay || repeatDelay
							}
							onChange={(e) => {
								setRepeatDelay(e.target.value);
								adjustAnimation('animeDelay', e.target.value);
							}}
						/>
					</div>
					<div className="adj-slider-value">
						{activeComponent?.animations?.adjustments?.animeDelay || repeatDelay}
						<span className="adj-units">s</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Breathe;
