// import React from 'react';

const HoverPopup = ({ activeElementAnimeName, handleElementAnimationsValue }) => {
	// const handleAdjustAnimations = () => {
	// console.log('Adjust Animations button clicked!');
	// };
	return (
		<>
			<div className="anime-hw-popup-content-items">
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'none' || activeElementAnimeName == ''
									? '#ffffffcc'
									: '#2f2f2fa3',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('none');
						}}
					>
						<span className="a-h-p-i-icon-none"></span>
					</div>
					<span>none</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'easeOut' ? '#ffffffcc' : '#2f2f2fa3',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('easeOut');
						}}
					>
						<div className=" a-h-p-c-i-box a-h-p-c-i-outer-box1">
							<div className="a-h-p-c-i-inner-box1"></div>
						</div>
					</div>
					<span>Easy Out</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'easeIn' ? '#ffffffcc' : '#2f2f2fa3',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('easeIn');
						}}
					>
						<div className="a-h-p-c-i-box a-h-p-c-i-outer-box1">
							<div className="a-h-p-c-i-inner-box1-2"></div>
						</div>
					</div>
					<span>Easy In</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'skew' ? '#ffffffcc' : '#2f2f2fa3',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('skew');
						}}
					>
						<div className=" a-h-p-c-i-box a-h-p-c-i-skew-box">
							{/* <div className="a-h-p-c-i-inner-box1-2"></div> */}
						</div>
					</div>
					<span>Skew</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'rotate' ? '#ffffffcc' : '#2f2f2fa3',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('rotate');
						}}
					>
						<div className=" a-h-p-c-i-box a-h-p-c-i-rotate-box">
							{/* <div className="a-h-p-c-i-inner-box1-2"></div> */}
						</div>
					</div>
					<span>Rotate</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'move' ? '#ffffffcc' : '#2f2f2fa3',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('move');
						}}
					>
						<div className="a-h-p-c-i-box a-h-p-c-i-move-box">
							<div className="a-h-p-c-i-inner-move-box"></div>
						</div>
					</div>
					<span> Move </span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'appear' ? '#ffffffcc' : '#2f2f2fa3',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('appear');
						}}
					>
						<div className=" a-h-p-c-i-box a-h-p-c-i-appear-box">
							<div className="a-h-p-i-appear-child"></div>
						</div>
					</div>
					<span>Appear</span>
				</div>
			</div>
		</>
	);
};

export default HoverPopup;
