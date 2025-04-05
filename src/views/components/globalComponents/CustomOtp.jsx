import { useRef, useEffect, memo } from 'react';

const CustomOtp = ({ otp, setOtp, onComplete, error }) => {
	const otpInputRefs = useRef([]);

	useEffect(() => {
		otpInputRefs.current[0]?.focus();
	}, []);

	const handleChange = (e, index) => {
		const value = e.target.value;

		// Only accept a single digit
		if (!/^\d$/.test(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		// Move focus to the next input
		if (index < otp.length - 1) {
			otpInputRefs.current[index + 1]?.focus();
			otpInputRefs.current[index + 1]?.select(); // Auto-select next input
		}

		// Trigger onComplete if all filled
		if (newOtp.every((digit) => digit !== '')) {
			onComplete?.(newOtp.join(''));
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === 'Backspace') {
			const newOtp = [...otp];

			if (otp[index] === '') {
				if (index > 0) {
					otpInputRefs.current[index - 1]?.focus();
					newOtp[index - 1] = '';
				}
			} else {
				newOtp[index] = '';
			}

			setOtp(newOtp);
		}
	};

	const handlePaste = (e) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData('text');
		const digits = pastedData.replace(/\D/g, '').slice(0, otp.length).split('');

		if (digits.length === 0) return;

		const newOtp = [...otp];
		for (let i = 0; i < digits.length; i++) {
			newOtp[i] = digits[i];
			otpInputRefs.current[i].value = digits[i];
		}
		setOtp(newOtp);

		const nextIndex = digits.length < otp.length ? digits.length : otp.length - 1;
		otpInputRefs.current[nextIndex]?.focus();
		otpInputRefs.current[nextIndex]?.select();

		if (digits.length === otp.length) {
			onComplete?.(digits.join(''));
		}
	};

	return (
		<div className="custom-otp-wrapper">
			<p className="error-message">{error}</p>
			<div className="otp-input-container">
				<div id="otpContainer">
					{otp.map((digit, i) => (
						<input
							key={i}
							type="text"
							inputMode="numeric"
							className="otp-input"
							maxLength="1"
							value={digit}
							onChange={(e) => handleChange(e, i)}
							onKeyDown={(e) => handleKeyDown(e, i)}
							onPaste={handlePaste}
							onFocus={(e) => e.target.select()}
							ref={(el) => (otpInputRefs.current[i] = el)}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default memo(CustomOtp);
