import React, { useState, memo } from 'react';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';
import '../../../assets/scss/onboarding/index.scss';

const Username = ({ step, username, setUsername, animateStage1AndStep1Exit }) => {
	const [info, setInfo] = useState({
		isHovering: false,
		enterPressed: false,
	});

	const handleSetUsername = (e) => {
		if (step !== 1) return;
		const username = e?.target?.value ?? '';
		formatUsername(username);
	};

	const formatUsername = (username) => {
		username = username?.replace(/[^a-zA-Z\s]/g, '');
		let firstNameWithSpace = false;
		if (username?.includes(' ') && username?.split(' ')[1]?.length === 0) {
			firstNameWithSpace = true;
			username = username?.trim() + ' ';
		}

		const firstName = username?.split(' ')[0];
		const lastName = username?.split(' ')[1];
		const capitalizedFirstName = firstName
			? firstName?.charAt(0)?.toUpperCase() + firstName?.slice(1)?.toLowerCase()
			: '';
		if (lastName) {
			const capitalizedLastName = lastName
				? lastName?.charAt(0)?.toUpperCase() + lastName?.slice(1)?.toLowerCase()
				: '';

			const formattedName = `${capitalizedFirstName} ${capitalizedLastName}`;
			setUsername(formattedName);
		} else {
			const formattedName = capitalizedFirstName;
			setUsername(firstNameWithSpace ? username : formattedName);
		}
	};

	const handleNext = (e, type) => {
		if ((e?.key === 'Enter' || type === 'click') && !info?.enterPressed && username?.length) {
			setInfo((prev) => ({ ...prev, enterPressed: true }));
			animateStage1AndStep1Exit();
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
				placeholder="Your Full Name"
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
