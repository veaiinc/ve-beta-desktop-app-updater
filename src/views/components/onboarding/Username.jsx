import React, { useState, memo, useRef } from 'react';
import gsap from 'gsap';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';
import '../../../assets/scss/onboarding/index.scss';

const Username = ({ onboardingInfo, setOnboardingInfo, animateStep1Exit }) => {
	const [info, setInfo] = useState({
		isHovering: false,
	});

	const usernameDivRef = useRef(null);

	const handleSetUsername = (e) => {
		const value = e?.target?.value;
		const firstName = value.split(' ')[0];
		const capitalizedValue = firstName
			? firstName.charAt(0).toUpperCase() + firstName.slice(1)
			: '';

		setOnboardingInfo((prev) => ({
			...prev,
			username: capitalizedValue,
		}));
	};

	const handleNext = () => {
		gsap.to(usernameDivRef.current, {
			opacity: 0,
			duration: 0.5,
			ease: 'power2.inOut',
			onComplete: async () => {
				animateStep1Exit();
			},
		});
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && onboardingInfo?.username?.length > 0) {
			handleNext();
		}
	};

	return (
		<div ref={usernameDivRef} className="username-input-container">
			<input
				value={onboardingInfo?.username}
				onChange={handleSetUsername}
				onKeyDown={handleKeyDown}
				autoFocus={true}
				type="text"
				placeholder="Your first name"
			/>
			<button
				disabled={onboardingInfo?.username?.length === 0}
				style={{
					cursor: onboardingInfo?.username?.length === 0 ? 'not-allowed' : 'pointer',
					background:
						onboardingInfo?.username?.length === 0 ? 'rgba(255, 255, 255, 0.1)' : '',
				}}
				onMouseEnter={() => setInfo({ ...info, isHovering: true })}
				onMouseLeave={() => setInfo({ ...info, isHovering: false })}
				onClick={handleNext}
			>
				{info?.isHovering ? (
					<span>
						<UpArrowBlackHover />
					</span>
				) : (
					<UpArrowGrey />
				)}
			</button>
		</div>
	);
};

export default memo(Username);
