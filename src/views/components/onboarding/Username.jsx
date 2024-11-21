import React, { useState, memo, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';
import '../../../assets/scss/onboarding/index.scss';

const Username = ({
	username,
	setUsername,
	animateStep1Exit,
	handleInvitedUser,
	createAccountViaInvite = false,
}) => {
	const [info, setInfo] = useState({
		isHovering: false,
		enterPressed: false,
	});
	useEffect(() => {
		if (usernameDivRef?.current) {
			gsap.to(usernameDivRef.current, {
				opacity: 0,
				duration: 0.5,
				ease: 'power2.inOut',
				onComplete: () => {
					animateStep1Exit();
				},
			});
		}
	}, []);

	const usernameDivRef = useRef(null);

	const handleSetUsername = (e) => {
		const value = e?.target?.value ?? '';
		const firstName = value.split(' ')[0];
		const capitalizedValue = firstName
			? firstName.charAt(0).toUpperCase() + firstName.slice(1)
			: '';
		setUsername(capitalizedValue);
	};
	const handleNext = (e, type) => {
		if (e.key === 'Enter' && (username?.length || type === 'click')) {
			if (info?.enterPressed) return;
			setInfo((prev) => ({ ...prev, enterPressed: true }));
			gsap.to(usernameDivRef.current, {
				opacity: 0,
				duration: 0.5,
				ease: 'power2.inOut',
				onComplete: () => {
					animateStep1Exit();
					if (createAccountViaInvite) {
						handleInvitedUser();
					}
				},
			});
		}
	};

	return (
		<div ref={usernameDivRef} className="username-input-container">
			<input
				value={username}
				onChange={handleSetUsername}
				onKeyDown={handleNext}
				autoFocus={true}
				type="text"
				placeholder="Your first name"
			/>
			<button
				disabled={!username?.length}
				style={{
					cursor: !username?.length ? 'not-allowed' : 'pointer',
					background: !username?.length ? 'rgba(255, 255, 255, 0.1)' : '',
				}}
				onMouseEnter={() => setInfo({ ...info, isHovering: true })}
				onMouseLeave={() => setInfo({ ...info, isHovering: false })}
				onClick={() => handleNext(null, 'click')}
			>
				{info?.isHovering ? <UpArrowBlackHover /> : <UpArrowGrey />}
			</button>
		</div>
	);
};

export default memo(Username);
