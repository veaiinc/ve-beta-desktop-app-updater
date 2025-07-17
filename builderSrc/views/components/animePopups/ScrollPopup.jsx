// import React from 'react';
const ScrollPopup = ({ activeElementAnimeName, handleElementAnimationsValue }) => {
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
								activeElementAnimeName == 'fade' ? '#ffffffcc' : '#2f2f2fa3',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('fade');
						}}
					>
						<div className=" a-h-p-c-i-box a-h-p-c-i-scroll-fade-box"></div>
					</div>
					<span>Fade</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'move' ? '#ffffffcc' : '#2f2f2fa3',
							overflow: 'hidden',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('move');
						}}
					>
						<div className="a-h-p-c-i-box a-h-p-c-i-scroll-move-box"></div>
					</div>
					<span>Move</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'expand' ? '#ffffffcc' : '#2f2f2fa3',
							overflow: 'hidden',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('expand');
						}}
					>
						<div className="a-h-p-c-i-box a-h-p-c-i-scroll-expand-box"></div>
					</div>
					<span>Expand</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'shrink' ? '#ffffffcc' : '#2f2f2fa3',
							overflow: 'hidden',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('shrink');
						}}
					>
						<div className="a-h-p-c-i-box a-h-p-c-i-scroll-shrink-box"></div>
					</div>
					<span>Shrink</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'spin' ? '#ffffffcc' : '#2f2f2fa3',
							overflow: 'hidden',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('spin');
						}}
					>
						<div className="a-h-p-c-i-box a-h-p-c-i-scroll-spin-box"></div>
					</div>
					<span>Spin</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'slide' ? '#ffffffcc' : '#2f2f2fa3',
							overflow: 'hidden',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('slide');
						}}
					>
						<div className="a-h-p-c-i-box  a-h-p-c-i-scroll-slide-box"></div>
					</div>
					<span>Slide</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'blur' ? '#ffffffcc' : '#2f2f2fa3',
							overflow: 'hidden',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('blur');
						}}
					>
						<div className="a-h-p-c-i-box  a-h-p-c-i-scroll-blur-box"></div>
					</div>
					<span>Blur</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'reveal' ? '#ffffffcc' : '#2f2f2fa3',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('reveal');
						}}
					>
						<div className="a-h-p-c-i-box  a-h-p-c-i-scroll-reveal-box"></div>
					</div>
					<span>Reveal</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == '3dspin' ? '#ffffffcc' : '#2f2f2fa3',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('3dspin');
						}}
					>
						<div className="a-h-p-c-i-box  a-h-p-c-i-scroll-3dspin-box"></div>
					</div>
					<span>3D Spin</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'fly' ? '#ffffffcc' : '#2f2f2fa3',
							overflow: 'hidden',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('fly');
						}}
					>
						<div className="a-h-p-c-i-box  a-h-p-c-i-scroll-fly-box"></div>
					</div>
					<span>Fly</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'turn' ? '#ffffffcc' : '#2f2f2fa3',
							overflow: 'hidden',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('turn');
						}}
					>
						<div className="a-h-p-c-i-box  a-h-p-c-i-scroll-turn-box"></div>
					</div>
					<span>Turn</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'tilt' ? '#ffffffcc' : '#2f2f2fa3',
							overflow: 'hidden',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('tilt');
						}}
					>
						<div className="a-h-p-c-i-box  a-h-p-c-i-scroll-tilt-box"></div>
					</div>
					<span>Tilt</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'stretch' ? '#ffffffcc' : '#2f2f2fa3',
							overflow: 'hidden',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('stretch');
						}}
					>
						<div className="a-h-p-c-i-box  a-h-p-c-i-scroll-stretch-box"></div>
					</div>
					<span>Stretch</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'flip' ? '#ffffffcc' : '#2f2f2fa3',
							overflow: 'hidden',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('flip');
						}}
					>
						<div className=" a-h-p-c-i-box a-h-p-c-i-scroll-flip-box">
							<div className="a-h-p-c-i-scroll-flip-box-line1"></div>
							<div className="a-h-p-c-i-scroll-flip-box"></div>
							<div className="a-h-p-c-i-scroll-flip-box-line1"></div>
						</div>
					</div>
					<span>Flip</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'parallax' ? '#ffffffcc' : '#2f2f2fa3',
							overflow: 'hidden',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('parallax');
						}}
					>
						<div className="a-h-p-c-i-box  a-h-p-c-i-scroll-parallax-box"></div>
					</div>
					<span>Parallax</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'arc' ? '#ffffffcc' : '#2f2f2fa3',
							overflow: 'hidden',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('arc');
						}}
					>
						<div className="a-h-p-c-i-box  a-h-p-c-i-scroll-arc-box"></div>
					</div>
					<span>Arc</span>
				</div>
				<div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'shape' ? '#ffffffcc' : '#2f2f2fa3',
							overflow: 'hidden',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('shape');
						}}
					>
						<div className="a-h-p-c-i-box  a-h-p-c-i-scroll-shape-box"></div>
					</div>
					<span>Shape</span>
				</div>
				{/* <div className="anime-hw-popup-content-item">
					<div
						className="a-h-p-i-icon"
						style={{
							borderColor:
								activeElementAnimeName == 'shutters' ? '#ffffffcc' : '#2f2f2fa3',
							overflow: 'hidden',
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleElementAnimationsValue('shutters');
						}}
					>
						<div className="a-h-p-c-i-box  a-h-p-c-i-scroll-shutters-box"></div>
					</div>
					<span>Shutters</span>
				</div> */}
			</div>
		</>
	);
};

export default ScrollPopup;
