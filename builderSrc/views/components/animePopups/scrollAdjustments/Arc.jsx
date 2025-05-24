import React, { useState } from 'react';
import '../styles.scss';
import { ReactComponent as Horizontal } from '../../library/svgs/adjustmentSvgs/horizontal-icon.svg';
import { ReactComponent as Vertical } from '../../library/svgs/adjustmentSvgs/vertical.svg';
import { ReactComponent as DropdownArrow } from '../../library/svgs/logicform/backarrow.svg';
const Arc = ({ activeComponent, adjustAnimation }) => {
	const [selectedOption, setSelectedOption] = useState('In');
	const [isOpen, setIsOpen] = useState(false);
	const [animation, setAnimation] = useState(50);
	const [direction, setDirection] = useState('horizontal');

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
				<p className="adj-anime-name">Arc</p>
			</div>
			<div className="adj-element-position">
				<div className="adj-dropdown-container">
					<div className="adj-dropdown-header" onClick={toggleDropdown}>
						<div className="adj-select-position">{selectedOption}</div>
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
									selectedOption === 'In' ? 'adj-active-dropdown' : ''
								}`}
								onClick={() => handleSelect('In')}
							>
								In
							</div>
							<div
								className={`adj-dropdown-item ${
									selectedOption === 'Out' ? 'adj-active-dropdown' : ''
								}`}
								onClick={() => handleSelect('Out')}
							>
								Out
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="adj-line"></div>
			{/*direction */}
			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Direction</b>
				<div className="adj-directions-container">
					<button
						className={`adj-arrow-button ${
							activeComponent?.animations?.adjustments?.direction === 'vertical'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('direction', 'vertical');
							setDirection('vertical');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							<Horizontal />
						</p>
					</button>
					<button
						className={`adj-arrow-button  ${
							activeComponent?.animations?.adjustments?.direction === 'horizontal'
								? 'adj-active'
								: ''
						}`}
						onClick={() => {
							adjustAnimation('direction', 'horizontal');
							setDirection('horizontal');
						}}
					>
						<p className="adj-dropdown-arrow" style={{ paddingRight: '0px' }}>
							<Vertical />
						</p>
					</button>
				</div>
			</div>
			{/* Animation Slider */}
			<div className="adj-popup-shapes-range-wrapper">
				<b className="adj-adjustment-title">Animation area</b>
				<div className="adj-popup-range-div">
					<div className="adj-slider-wrapper">
						<input
							className="adj-animation-slider"
							type="range"
							min="0"
							max="100"
							step="1"
							value={activeComponent?.animations?.adjustments?.animeArea || animation}
							onChange={(e) => {
								setAnimation(e.target.value);
								adjustAnimation('animeArea', e.target.value);
							}}
						/>
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

export default Arc;
