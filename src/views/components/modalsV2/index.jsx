import React, { useState } from 'react';
import Modal from 'react-modal';

function ReactModal(props) {
	const customModalStylesForCenter = {
		content: {
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			transform: 'translate(-50%, -50%)',
			padding: '0px',
			outline: '0px',
			border: '0px',
			borderRadius: '8px',
			boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
			transition: 'transform 0.3s ease-in-out',
			backgroundColor: 'transparent',
		},
		overlay: {
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			//transition: 'opacity 0.3s ease-in-out',
		},
	};

	const customModalStylesForRight = {
		content: {
			position: 'fixed',
			top: '0%',
			left: 'auto',
			bottom: 'auto',
			right: props.isOpen ? '0%' : '-50%', // Slide in from right
			transform: props.isOpen ? 'translate(0%) scale(1)' : 'translate(0%) scale(0)', // Scale for fade-in effect
			transition: 'right 3s ease-in-out',
			borderRadius: '8px',
			boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
			border: 'none',
			zIndex: 9999,
			height: '100vh',
			opacity: props.isOpen ? 1 : 0,
			backgroundColor: 'transparent',
		},
		overlay: {
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			transition: 'opacity 0.3s ease-in-out',
			zIndex: 9998,
			opacity: props.isOpen ? 1 : 0, // Fade-in effect
		},
	};

	return (
		<>
			<Modal
				isOpen={props.isOpen}
				onRequestClose={props.closeModal}
				style={
					props.modalType == 'right'
						? customModalStylesForRight
						: customModalStylesForCenter
				}
				shouldCloseOnOverlayClick={true}
				ariaHideApp={false}
			>
				{props.children}
			</Modal>
		</>
	);
}

export default ReactModal;
