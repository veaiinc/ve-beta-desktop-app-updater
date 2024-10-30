import React, { useState, memo } from 'react';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';
import '../../../assets/scss/onboarding/index.scss';

const Username = () => {
	const [info, setInfo] = useState({
		isHovering: false,
	});

	const handleSetUsername = (e) => {
		console.log(e?.target?.value);
	};

	const handleNext = () => {
		console.log('next');
	};

	return (
		<div className="username-input-container">
			<input
				value={info?.email}
				onChange={handleSetUsername}
				autoFocus={true}
				type="email"
				placeholder="Your first name"
			/>
			<button
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
