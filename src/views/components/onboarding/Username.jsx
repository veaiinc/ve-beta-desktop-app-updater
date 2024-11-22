import React, { useState, memo, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';
import '../../../assets/scss/onboarding/index.scss';

const Username = ({
	username,
	setUsername,
	incrementStage,
	animateStage1AndStep1Exit,
	handleInvitedUser,
	createAccountViaInvite = false,
}) => {
	const [info, setInfo] = useState({
		isHovering: false,
		enterPressed: false,
	});

	const handleSetUsername = (e) => {
		const value = e?.target?.value ?? '';
		const firstName = value.split(' ')[0];
		const capitalizedValue = firstName
			? firstName.charAt(0).toUpperCase() + firstName.slice(1)
			: '';
		setUsername(capitalizedValue);
	};

	const handleNext = (e, type) => {
		if ((e?.key === 'Enter' || type === 'click') && !info?.enterPressed && username?.length) {
			setInfo((prev) => ({ ...prev, enterPressed: true }));
			animateStage1AndStep1Exit();
			// incrementStage();
		}
	};

	return (
		<div className="username-input-container stage1">
			<input
				value={username}
				onChange={handleSetUsername}
				onKeyDown={handleNext}
				autoFocus={true}
				type="text"
				placeholder="Your first name"
			/>
			<button
				className="next-button"
				disabled={!username?.length}
				style={{
					cursor: !username?.length ? 'not-allowed' : 'pointer',
					background: !username?.length ? 'rgba(255, 255, 255, 0.1)' : 'white',
				}}
				onMouseEnter={() => setInfo({ ...info, isHovering: true })}
				onMouseLeave={() => setInfo({ ...info, isHovering: false })}
				onClick={() => handleNext(null, 'click')}
			>
				<span
					className="arrow-icon"
					style={{
						display: 'inline-block',
						transform: username?.length ? 'rotate(90deg)' : 'rotate(0deg)',
						transition: 'transform 0.4s ease',
					}}
				>
					{info?.isHovering || username?.length ? <UpArrowBlackHover /> : <UpArrowGrey />}
				</span>
			</button>
		</div>
	);
};

export default memo(Username);
