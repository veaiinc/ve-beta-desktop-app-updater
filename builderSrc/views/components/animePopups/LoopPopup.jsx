import React from 'react';

const LoopPopup = ({ activeElementAnimeName, handleElementAnimationsValue }) => {
	return (
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
					<span
						className="a-h-p-i-icon-none"
						style={{
							backgroundColor: '#ffffffcc',
							transform: 'rotate(45deg)',
						}}
					></span>
				</div>
				<span>none</span>
			</div>
			<div className="anime-hw-popup-content-item">
				<div
					className="a-h-p-i-icon"
					style={{
						borderColor:
							activeElementAnimeName == 'breathe' ? '#ffffffcc' : '#2f2f2fa3',
					}}
					onClick={(e) => {
						e.stopPropagation();
						handleElementAnimationsValue('breathe');
					}}
				>
					<div className="a-h-p-c-i-box a-h-p-c-i-Breathe-box">
						<div className="a-h-p-c-i-inner-Breathe-box"></div>
					</div>
				</div>
				<span> Breathe </span>
			</div>
			<div className="anime-hw-popup-content-item">
				<div
					className="a-h-p-i-icon"
					style={{
						borderColor: activeElementAnimeName == 'pulse' ? '#ffffffcc' : '#2f2f2fa3',
					}}
					onClick={(e) => {
						e.stopPropagation();
						handleElementAnimationsValue('pulse');
					}}
				>
					<div className="a-h-p-c-i-box a-h-p-c-i-pulse-box">
						<div className="a-h-p-c-i-inner-pulse-box">
							<div className="a-h-p-c-i-inner-pulse-box2"></div>
						</div>
					</div>
				</div>
				<span> Pulse </span>
			</div>

			<div className="anime-hw-popup-content-item">
				<div
					className="a-h-p-i-icon"
					style={{
						borderColor: activeElementAnimeName == 'spin' ? '#ffffffcc' : '#2f2f2fa3',
					}}
					onClick={(e) => {
						e.stopPropagation();
						handleElementAnimationsValue('spin');
					}}
				>
					<div className=" a-h-p-c-i-box a-h-p-c-i-spin-box">
						<div className="a-h-p-c-i-inner-spin-box"></div>
					</div>
				</div>
				<span>Spin</span>
			</div>
			<div className="anime-hw-popup-content-item">
				<div
					className="a-h-p-i-icon"
					style={{
						borderColor: activeElementAnimeName == 'poke' ? '#ffffffcc' : '#2f2f2fa3',
					}}
					onClick={(e) => {
						e.stopPropagation();
						handleElementAnimationsValue('poke');
					}}
				>
					<div className="a-h-p-c-i-box a-h-p-c-i-poke-box">
						<div className="a-h-p-c-i-inner-poke-box"></div>
					</div>
				</div>
				<span> Poke </span>
			</div>
			<div className="anime-hw-popup-content-item">
				<div
					className="a-h-p-i-icon"
					style={{
						borderColor: activeElementAnimeName == 'flash' ? '#ffffffcc' : '#2f2f2fa3',
					}}
					onClick={(e) => {
						e.stopPropagation();
						handleElementAnimationsValue('flash');
					}}
				>
					<div className=" a-h-p-c-i-box a-h-p-c-i-flash-box"></div>
				</div>
				<span>Flash</span>
			</div>
			<div className="anime-hw-popup-content-item">
				<div
					className="a-h-p-i-icon"
					style={{
						borderColor: activeElementAnimeName == 'swing' ? '#ffffffcc' : '#2f2f2fa3',
					}}
					onClick={(e) => {
						e.stopPropagation();
						handleElementAnimationsValue('swing');
					}}
				>
					<div className=" a-h-p-c-i-box a-h-p-c-i-swing-box">
						<div className="a-h-p-c-i-inner-swing-box"></div>
					</div>
				</div>
				<span>Swing</span>
			</div>
			<div className="anime-hw-popup-content-item">
				<div
					className="a-h-p-i-icon"
					style={{
						borderColor: activeElementAnimeName == 'flip' ? '#ffffffcc' : '#2f2f2fa3',
					}}
					onClick={(e) => {
						e.stopPropagation();
						handleElementAnimationsValue('flip');
					}}
				>
					<div className=" a-h-p-c-i-box a-h-p-c-i-flip-box-wrapper">
						<div className="a-h-p-c-i-flip-box-line1"></div>
						<div className="a-h-p-c-i-flip-box"></div>
						<div className="a-h-p-c-i-flip-box-line1"></div>
					</div>
				</div>
				<span>Flip</span>
			</div>
			<div className="anime-hw-popup-content-item">
				<div
					className="a-h-p-i-icon"
					style={{
						borderColor: activeElementAnimeName == 'rubber' ? '#ffffffcc' : '#2f2f2fa3',
					}}
					onClick={(e) => {
						e.stopPropagation();
						handleElementAnimationsValue('rubber');
					}}
				>
					<div className=" a-h-p-c-i-box a-h-p-c-i-rubber-box">
						<div className="a-h-p-c-i-inner-rubber-box"></div>
					</div>
				</div>
				<span>Rubber</span>
			</div>
			<div className="anime-hw-popup-content-item">
				<div
					className="a-h-p-i-icon"
					style={{
						borderColor: activeElementAnimeName == 'jello' ? '#ffffffcc' : '#2f2f2fa3',
					}}
					onClick={(e) => {
						e.stopPropagation();
						handleElementAnimationsValue('jello');
					}}
				>
					<div className=" a-h-p-c-i-box a-h-p-c-i-jello-box"></div>
				</div>
				<span>Jello</span>
			</div>
			<div className="anime-hw-popup-content-item">
				<div
					className="a-h-p-i-icon"
					style={{
						borderColor: activeElementAnimeName == 'bounce' ? '#ffffffcc' : '#2f2f2fa3',
					}}
					onClick={(e) => {
						e.stopPropagation();
						handleElementAnimationsValue('bounce');
					}}
				>
					<div className="a-h-p-c-i-box a-h-p-c-i-bounce-box">
						<div className="a-h-p-c-i-inner-bounce-box"></div>
					</div>
				</div>
				<span> Bounce </span>
			</div>
			<div className="anime-hw-popup-content-item">
				<div
					className="a-h-p-i-icon"
					style={{
						borderColor: activeElementAnimeName == 'wiggle' ? '#ffffffcc' : '#2f2f2fa3',
					}}
					onClick={(e) => {
						e.stopPropagation();
						handleElementAnimationsValue('wiggle');
					}}
				>
					<div className=" a-h-p-c-i-box a-h-p-c-i-wiggle-box"></div>
				</div>
				<span>Wiggle</span>
			</div>
			<div className="anime-hw-popup-content-item">
				<div
					className="a-h-p-i-icon"
					style={{
						borderColor: activeElementAnimeName == 'flap' ? '#ffffffcc' : '#2f2f2fa3',
						overflow: 'hidden',
					}}
					onClick={(e) => {
						e.stopPropagation();
						handleElementAnimationsValue('flap');
					}}
				>
					<div className=" a-h-p-c-i-box a-h-p-c-i-flap-box"></div>
				</div>
				<span>Flap</span>
			</div>
			<div className="anime-hw-popup-content-item">
				<div
					className="a-h-p-i-icon"
					style={{
						borderColor: activeElementAnimeName == 'cross' ? '#ffffffcc' : '#2f2f2fa3',
						overflow: 'hidden',
					}}
					onClick={(e) => {
						e.stopPropagation();
						handleElementAnimationsValue('cross');
					}}
				>
					<div className=" a-h-p-c-i-box a-h-p-c-i-cross-box"></div>
				</div>
				<span>Cross</span>
			</div>
		</div>
	);
};

export default LoopPopup;
