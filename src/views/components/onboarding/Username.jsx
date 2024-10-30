import React, { useState, memo, useEffect } from 'react';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';
import '../../../assets/scss/onboarding/index.scss';

const Username = ({ onboardingInfo, setOnboardingInfo }) => {
	const [info, setInfo] = useState({
		isHovering: false,
	});

	useEffect(() => {
		console.log(onboardingInfo?.username);
	}, [onboardingInfo?.username]);

	const handleSetUsername = (e) => {
		setOnboardingInfo((prev) => ({
			...prev,
			username: e?.target?.value,
		}));
	};

	const handleNext = () => {
		setOnboardingInfo((prev) => ({
			...prev,
			stage: prev?.stage + 1,
		}));
	};

	return (
		<div className="username-input-container">
			<input
				value={onboardingInfo?.username}
				onChange={handleSetUsername}
				autoFocus={true}
				type="text"
				placeholder="Your first name"
			/>
			<button
				disabled={onboardingInfo?.username?.length > 0}
				style={{
					cursor: onboardingInfo?.username?.length > 0 ? 'not-allowed' : 'pointer',
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
