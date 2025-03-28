import { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/onboarding/stages.scss';
import { formatUsername, getCountryCode } from '../../../helpers';
import Context from '../../../context/context';
import ProgressBar from './ProgressBar';
import { message } from 'antd';
import Stage1 from './Stage1';
import Stage2 from './Stage2';

let usernameTimeoutId;

const Stages = () => {
	const {
		authInfo: {
			checkWorkspaceHandleAvailability,
			updateUserDetails,
			requestResendOTPToMobile,
			verifyMobileOtpCode,
		},
		profileInfo: { userDetailsData, getUserDetails },
		themeInfo: { theme, updateTheme },
	} = useContext(Context);

	const [info, setInfo] = useState({
		stage: 1, // total 4 stages
		username: '',
		phoneNumber: '',
		countryCode: '',
		themePreference: 'systemDefault',
		companyName: '', // workspace handle
		companyLogo: null,
		checkingWorkspaceHandle: false,
		isWorkspaceHandleAvailable: null,
		continueBtnDisabled: true,
		otp: '',
		otpSent: false,
		isPhoneNumberVerified: false,
	});

	const emailCntxt = userDetailsData?.email;
	const isPhoneNumberVerifiedCntxt = userDetailsData?.isPhoneVerified;
	const phoneNumberExistsInDBCntxt = userDetailsData?.phoneNumber?.length > 0;
	const firstNameCntxt = userDetailsData?.firstName;
	const lastNameCntxt = userDetailsData?.lastName;
	const phoneNumberCntxt = userDetailsData?.phoneNumber;

	useEffect(() => {
		handleGetUserDetails();
		const countryCode = getCountryCode(info?.phoneNumber);
		setInfo((prev) => ({
			...prev,
			countryCode,
		}));
	}, []);

	useEffect(() => {
		if (firstNameCntxt || lastNameCntxt) {
			const formattedUsername = formatUsername(
				(firstNameCntxt ?? '') + ' ' + (lastNameCntxt ?? ''),
			);
			setInfo((prev) => ({
				...prev,
				username: formattedUsername,
			}));
		}
	}, [firstNameCntxt, lastNameCntxt]);

	useEffect(() => {
		if (usernameTimeoutId) clearTimeout(usernameTimeoutId);
		usernameTimeoutId = setTimeout(() => {
			const username = info?.username;
			if (username) {
				updateUserDetails(username);
			}
		}, 1000);
	}, [info?.username]);

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			phoneNumber: phoneNumberCntxt,
		}));
	}, [phoneNumberCntxt]);

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			isPhoneNumberVerified: isPhoneNumberVerifiedCntxt,
		}));
	}, [isPhoneNumberVerifiedCntxt]);

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			continueBtnDisabled:
				info?.stage === 1 && (!info?.username || !info?.isPhoneNumberVerified),
		}));
	}, [info?.username, info?.isPhoneNumberVerified, info?.stage]);

	useEffect(() => {
		if (info?.companyName?.length > 1) {
			const timeout = setTimeout(async () => {
				handleCheckWorkspaceHandleAvailability(info?.companyName);
			}, 500);

			return () => clearTimeout(timeout);
		} else {
			setInfo((prev) => ({
				...prev,
				checkingWorkspaceHandle: false,
				isWorkspaceHandleAvailable: null,
			}));
		}
	}, [info?.companyName]);

	useEffect(() => {
		if (info?.otp?.length === 6) {
			handleVerifyMobileOtpCode();
		}
	}, [info?.otp]);

	const handleGetUserDetails = useCallback(async () => {
		const response = await getUserDetails();
		const success = response?.[0] === true;
		if (!success) {
			const statusCode = response?.[1]?.statusCode;
			if (statusCode === 401) {
				message?.error('Session expired! Please login again');
				setTimeout(() => {
					window.location.href = '/verify-user';
				}, 5000);
			}
		}
	}, [getUserDetails]);

	const handleCheckWorkspaceHandleAvailability = useCallback(
		async (workspaceHandle) => {
			setInfo((prev) => ({
				...prev,
				checkingWorkspaceHandle: true,
				isWorkspaceHandleAvailable: false,
			}));
			const response = await checkWorkspaceHandleAvailability(workspaceHandle);
			if (response?.[0] === true) {
				const isAvailable = response?.[1]?.available;
				setInfo((prev) => ({ ...prev, isWorkspaceHandleAvailable: isAvailable }));
			} else {
				message?.error(response?.[1]?.message);
				setInfo((prev) => ({ ...prev, isWorkspaceHandleAvailable: false }));
			}
			setInfo((prev) => ({ ...prev, checkingWorkspaceHandle: false }));
		},
		[
			checkWorkspaceHandleAvailability,
			info?.isWorkspaceHandleAvailable,
			info?.checkingWorkspaceHandle,
		],
	);

	const handleSetUsername = useCallback(
		(e) => {
			const username = e?.target?.value ?? '';
			const formattedUsername = formatUsername(username);
			setInfo((prev) => ({ ...prev, username: formattedUsername }));
		},
		[info?.username],
	);

	const handleSetPhoneNumber = useCallback(
		(phoneNumber) => {
			if (phoneNumber) {
				setInfo((prev) => ({
					...prev,
					phoneNumber,
				}));
			}
		},
		[info?.phoneNumber, info?.isPhoneNumberVerified],
	);

	const handleVerifyPhoneNumber = useCallback(async () => {
		const { username, phoneNumber } = info;
		if (!isPhoneNumberVerifiedCntxt && phoneNumberExistsInDBCntxt) {
			const response = await requestResendOTPToMobile();
			const success = response?.[0] === true;
			if (success) {
				message?.success(`An OTP has been sent to ${phoneNumber}`);
				setInfo((prev) => ({ ...prev, otpSent: true }));
			} else {
				message?.error(response?.[1]?.message);
			}
		} else {
			const response = await updateUserDetails(username, phoneNumber);
			const success = response?.[0] === true;
			if (success) {
				message?.success(`An OTP has been sent to ${phoneNumber}`);
				setInfo((prev) => ({ ...prev, otpSent: true }));
			} else {
				message?.error(response?.[1]?.message);
			}
		}
	}, [info?.username, info?.phoneNumber, info?.isPhoneNumberVerified]);

	const handleSetOTP = useCallback(
		(e) => {
			let otp = e?.target?.value ?? '';
			if (otp?.length > 6) otp = otp?.slice(0, 6);
			setInfo((prev) => ({ ...prev, otp }));
		},
		[info?.otp],
	);

	const handleSetOTPSentToFalse = useCallback(() => {
		setInfo((prev) => ({ ...prev, otpSent: false, otp: '' }));
	}, [info?.otpSent, info?.otp]);

	const handleVerifyMobileOtpCode = useCallback(async () => {
		const { phoneNumber, otp: verificationCode } = info;
		const response = await verifyMobileOtpCode(phoneNumber, verificationCode);
		if (response?.[0] === true) {
			message?.success('Phone number verified successfully');
			setInfo((prev) => ({
				...prev,
				isPhoneNumberVerified: true,
				otpSent: false,
				otp: '',
			}));
		} else {
			const errorMessage = response?.[1]?.message;
			message?.error(errorMessage);
		}
	}, [info?.phoneNumber, info?.otp]);

	const handleResendOtp = useCallback(async () => {
		const response = await requestResendOTPToMobile();
		const success = response?.[0] === true;
		if (success) {
			message?.success(`OTP resent to ${info?.phoneNumber}`);
		} else {
			const errorMessage = response?.[1]?.message;
			message?.error(errorMessage);
		}
	}, [info?.phoneNumber]);

	const handleSetThemePreference = useCallback(
		async (themePreference) => {
			const response = await updateTheme(themePreference);
			const success = response?.[0] === true;
			if (success) {
				setInfo((prev) => ({ ...prev, themePreference }));
			} else {
				message?.error(response?.[1]?.message);
			}
		},
		[info?.themePreference],
	);

	const handleSetCompanyName = useCallback(
		(e) => {
			const companyName = e?.target?.value ?? '';
			const formattedCompanyName = companyName
				?.replace(/\s+/g, '')
				?.toLowerCase()
				?.slice(0, 64);
			setInfo((prev) => ({ ...prev, companyName: formattedCompanyName }));
		},
		[info?.companyName],
	);

	const handleSetCompanyLogo = useCallback((e) => {
		const file = e?.target?.files?.[0];
		const companyLogo = file ? URL.createObjectURL(file) : null;
		if (companyLogo) {
			setInfo((prev) => ({ ...prev, companyLogo }));
		}
	}, []);

	const handlePrevStage = useCallback(
		() => setInfo((prev) => ({ ...prev, stage: prev?.stage - 1 })),
		[info?.stage],
	);

	const handleNextStage = useCallback(
		() => setInfo((prev) => ({ ...prev, stage: prev?.stage + 1 })),
		[info?.stage],
	);

	const stageMapper = {
		1: (
			<Stage1
				username={info?.username}
				phoneNumber={info?.phoneNumber}
				isPhoneNumberVerified={info?.isPhoneNumberVerified}
				countryCode={info?.countryCode}
				themePreference={info?.themePreference}
				handleSetUsername={handleSetUsername}
				handleSetPhoneNumber={handleSetPhoneNumber}
				handleSetThemePreference={handleSetThemePreference}
				handleVerifyPhoneNumber={handleVerifyPhoneNumber}
				otp={info?.otp}
				handleSetOTP={handleSetOTP}
				otpSent={info?.otpSent}
				handleSetOTPSentToFalse={handleSetOTPSentToFalse}
				handleResendOtp={handleResendOtp}
			/>
		),
		2: (
			<Stage2
				companyName={info?.companyName}
				companyLogo={info?.companyLogo}
				handleSetCompanyName={handleSetCompanyName}
				handleSetCompanyLogo={handleSetCompanyLogo}
				checkingWorkspaceHandle={info?.checkingWorkspaceHandle}
				isWorkspaceHandleAvailable={info?.isWorkspaceHandleAvailable}
			/>
		),
		3: <div>Stage 3</div>,
		4: <div>Stage 4</div>,
	};

	return (
		<>
			<ProgressBar stage={info?.stage} />
			<div className="stageContainer">
				<h1 className="email">{emailCntxt}</h1>
				{stageMapper?.[info?.stage]}
			</div>
			<div className="btnsContainer">
				{info?.stage > 1 && (
					<button onClick={handlePrevStage} className="backBtn">
						Back
					</button>
				)}
				<button
					style={{
						opacity: info?.continueBtnDisabled ? 0.4 : 1,
						cursor: info?.continueBtnDisabled ? 'not-allowed' : 'pointer',
					}}
					disabled={info?.continueBtnDisabled}
					className="continueBtn"
					onClick={handleNextStage}
				>
					Continue
				</button>
			</div>
		</>
	);
};

export default memo(Stages);
