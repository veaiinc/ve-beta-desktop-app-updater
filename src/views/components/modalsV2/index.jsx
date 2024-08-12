import React, { useState, memo, useCallback } from 'react';
import Modal from 'react-modal';

const ReactModal = ({ isOpen, closeModal, modalType, children, customStyles = {} }) => {
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
			right: isOpen ? '0%' : '-50%', // Slide in from right
			transform: isOpen ? 'translate(0%) scale(1)' : 'translate(0%) scale(0)', // Scale for fade-in effect
			transition: 'all 3s ease-in-out',
			borderRadius: '8px',
			boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
			border: 'none',
			padding: '0px',
			zIndex: 9999,
			height: '100vh',
			opacity: isOpen ? 1 : 0,
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
			opacity: isOpen ? 1 : 0, // Fade-in effect
		},
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onRequestClose={closeModal}
				style={
					modalType == 'right'
						? {
								content: {
									...customModalStylesForRight?.content,
									...customStyles?.content,
								},
								overlay: {
									...customModalStylesForRight?.overlay,
									...customStyles?.overlay,
								},
						  }
						: {
								content: {
									...customModalStylesForCenter?.content,
									...customStyles?.content,
								},
								overlay: {
									...customModalStylesForCenter?.overlay,
									...customStyles?.overlay,
								},
						  }
				}
				shouldCloseOnOverlayClick={true}
				ariaHideApp={false}
			>
				{children}
			</Modal>
		</>
	);
};

export default ReactModal;
