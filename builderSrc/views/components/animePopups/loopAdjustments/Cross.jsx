import React, { useState } from 'react';
import '../styles.scss';
import { ReactComponent as Arrow } from '../../library/svgs/arrow.svg';

const Cross = ({ activeComponent, adjustAnimation }) => {
	const [duration, setDuration] = useState(0);
	const [repeatDelay, setRepeatDelay] = useState(0);
	const [direction, setDirection] = useState('top');

	return (
		<div className="adj-popup-container">
			<div className="adj-anime-type">
				<p className="adj-anime-name">Cross</p>
			</div>
			<div className="adj-line"></div>

			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Direction</b>
				<div className="adj-directions-container">
					<button
						className={`adj-arrow-button  ${
							activeComponent?.animations?.adjustments?.direction === 'top'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							setDirection('top');
							adjustAnimation('direction', 'top');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							{/*top*/}
							<Arrow style={{ transform: 'rotate(270deg)' }} color="#8A8A8A" />
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
					<button
						className={`adj-arrow-button  ${
							activeComponent?.animations?.adjustments?.direction === 'bottom'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							setDirection('bottom');
							adjustAnimation('direction', 'bottom');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							{/*down*/}
							<Arrow style={{ transform: 'rotate(90deg)' }} color="#8A8A8A" />
						</p>
					</button>
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

			{/*Repeat Delay Slider */}
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

export default Cross;
