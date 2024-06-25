import React, { useState, useRef, useEffect } from 'react';
import '../../../assets/scss/sales/myWorkFlowDetails.scss';
import { ReactComponent as Timer } from '../../../assets/svg/timer.svg';
import { ReactComponent as Link } from '../../../assets/svg/link.svg';
import { ReactComponent as MoreOptions } from '../../../assets/svg/more-options-dots.svg';
import { ReactComponent as RightArrow } from '../../../assets/svg/right-arrow.svg';
import Modal from 'react-modal';

function SalesLeadCard(props) {
	const [showMoreOptions, setMoreOptions] = useState(false);
	const moreOptionsRef = useRef(null);

	const [modalIsOpen, setIsOpen] = useState(false);

	const openModal = () => {
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	const customModalStyles = {
		content: {
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
			padding: '20px',
			borderRadius: '8px',
			boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
			transition: 'transform 0.3s ease-in-out',
		},
		overlay: {
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			transition: 'opacity 0.3s ease-in-out',
		},
	};

	useEffect(() => {
		function handleClickOutside(event) {
			if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target)) {
				setMoreOptions(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [moreOptionsRef]);

	return (
		<div className="SalesLeadCardContainer">
			<div className="topLayer">
				<div className="status">
					<div className="timerInfoContainer">
						<Timer />
						<p>Since 16 days</p>
					</div>
					<div className="quickActionContainer">
						<div>
							<Link />
						</div>
						<div onClick={() => setMoreOptions(true)}>
							<MoreOptions />
						</div>
					</div>
				</div>

				<div className="clientsContainer">
					<div className="userProfileContainer">
						<p>JA</p>
					</div>

					<div className="usersDetails">
						<p className="fullName">Aaron Lemke</p>
						<p className="username">@johnatig</p>
					</div>
					<div className="cost">
						<p>$ 304</p>
					</div>
				</div>
			</div>
			<div className="bottomLayer">
				<div className="createdUserDetails">
					<p className="usersShortCut">JA</p>
					<p className="fullName">Surbhi Reddy</p>
				</div>
				<div className="moveToContainer" onClick={openModal}>
					<p>Move to</p>
					<RightArrow />
				</div>
			</div>

			<div
				className="moreOptionsPreviewContainer"
				style={{ display: showMoreOptions ? 'flex' : 'none' }}
				ref={moreOptionsRef}
			>
				<p onClick={() => setMoreOptions(false)}>Preview</p>
				<p onClick={() => setMoreOptions(false)}>Resend Proposal</p>
				<p onClick={() => setMoreOptions(false)} className="delete">
					Delete Proposal
				</p>
			</div>

			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				style={customModalStyles}
				contentLabel="Example Modal"
				ariaHideApp={false} // Required to prevent a11y warning
			>
				<h2>Modal Content</h2>
				<p>This is the content of the modal.</p>
				<button onClick={closeModal}>Close Modal</button>
			</Modal>
		</div>
	);
}

export default SalesLeadCard;
