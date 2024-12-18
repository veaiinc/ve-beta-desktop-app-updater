import React, { memo, useState } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import '../../../assets/scss/onboarding/index.scss';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';

const PhoneNumber = ({ phoneNumber, handleSetPhoneNumber, updateUserNameAndPhoneNumber }) => {
	const [info, setInfo] = useState({
		isHovering: false,
		enterPressed: false,
	});

	const handlePressEnter = (e) => {
		if (e?.key === 'Enter' && isValidPhoneNumber(phoneNumber) && !info?.enterPressed) {
			updateUserNameAndPhoneNumber();
			setInfo((prev) => ({
				...prev,
				enterPressed: true,
			}));
		} else {
			setInfo((prev) => ({
				...prev,
				enterPressed: false,
			}));
		}
	};

	const handleUpdateUserDetails = () => {
		if (isValidPhoneNumber(phoneNumber) && !info?.enterPressed) {
			updateUserNameAndPhoneNumber();
			setInfo((prev) => ({
				...prev,
				enterPressed: true,
			}));
		} else
			setInfo((prev) => ({
				...prev,
				enterPressed: false,
			}));
	};

	return (
		<div className="phone-number-container stage5">
			<PhoneInput
				placeholder="Enter phone number"
				value={phoneNumber}
				onChange={handleSetPhoneNumber}
				defaultCountry={(() => {
					try {
						const locationDetails = JSON.parse(localStorage.getItem('locationDetails'));
						return locationDetails?.countryCode || 'US';
					} catch {
						return 'US';
					}
				})()}
				countryCallingCodeEditable={true}
				onKeyDown={handlePressEnter}
				autoFocus={true}
				autoComplete="tel"
			/>
			<button
				className="next-button"
				disabled={!isValidPhoneNumber(phoneNumber)}
				style={{
					cursor: !isValidPhoneNumber(phoneNumber) ? 'not-allowed' : 'pointer',
					background: !isValidPhoneNumber(phoneNumber)
						? 'rgba(255, 255, 255, 0.1)'
						: 'white',
				}}
				onMouseEnter={() => setInfo({ ...info, isHovering: true })}
				onMouseLeave={() => setInfo({ ...info, isHovering: false })}
				onClick={handleUpdateUserDetails}
			>
				<span
					className="arrow-icon"
					style={{
						display: 'inline-block',
						transform: isValidPhoneNumber(phoneNumber)
							? 'rotate(90deg)'
							: 'rotate(0deg)',
						transition: 'transform 0.4s ease',
					}}
				>
					{info?.isHovering || isValidPhoneNumber(phoneNumber) ? (
						<UpArrowBlackHover />
					) : (
						<UpArrowGrey />
					)}
				</span>
			</button>
		</div>
	);
};

export default memo(PhoneNumber);
