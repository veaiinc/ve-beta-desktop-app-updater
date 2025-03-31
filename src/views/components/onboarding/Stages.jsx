import { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/onboarding/stages.scss';
import { formatUsername, getCountryCode } from '../../../helpers';
import Context from '../../../context/context';
import ProgressBar from './ProgressBar';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { message } from 'antd';

let usernameTimeoutId, companyLogoFile;

const Stages = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const pathname = location?.pathname;
	if (pathname === '/create-workspace') {
		localStorage.setItem('stage', 2);
	}
	const [searchParams] = useSearchParams();
	const invitedWorkspaceId = searchParams.get('invitedWorkspaceId');
	const invitedUserEmail = searchParams.get('inviteeEmail');
	const stageFromLocalStorage = localStorage.getItem('stage') ?? 1;
	const usertoken = localStorage.getItem('usertoken') ?? false;
	const isUserOnboard = localStorage?.getItem('isOnboard') === 'true' ?? false;

	const {
		authInfo: {
			checkWorkspaceHandleAvailability,
			updateUserDetails,
			requestResendOTPToMobile,
			verifyMobileOtpCode,
			createWorkspace,
		},
		profileInfo: { userDetailsData, getUserDetails, updateUserLogo, userLogo, getUserLogo },
		companyInfo: { uploadTenantLogo },
		themeInfo: { theme, updateTheme },
	} = useContext(Context);

	const [info, setInfo] = useState({
		stage: Number(stageFromLocalStorage),
		username: '',
		phoneNumber: '',
		profilePicture: null,
		countryCode: '',
		themePreference: 'systemDefault',
		companyName: '',
		workspaceHandle: '',
		workspaceType: '',
		companyLogo: null,
		checkingWorkspaceHandle: false,
		isWorkspaceHandleAvailable: null,
		continueBtnDisabled: true,
		otp: '',
		otpSent: false,
		isPhoneNumberVerified: false,
		verifyPhoneNumberLoading: false,
	});

	const emailCntxt = userDetailsData?.email;
	const isPhoneNumberVerifiedCntxt = userDetailsData?.isPhoneVerified;
	const phoneNumberExistsInDBCntxt = userDetailsData?.phoneNumber?.length > 0;
	const firstNameCntxt = userDetailsData?.firstName;
	const lastNameCntxt = userDetailsData?.lastName;
	const phoneNumberCntxt = userDetailsData?.phoneNumber;
	const profilePictureCntxt = userDetailsData?.googleMeta?.picture ?? null;

	useEffect(() => {
		if (!usertoken) {
			message?.error('Session expired! Please login again');
			setTimeout(() => {
				window.location.href = '/verify-user';
			}, 1500);
		}
		if (
			isUserOnboard &&
			pathname !== '/create-workspace' &&
			!invitedWorkspaceId &&
			!invitedUserEmail
		) {
			message?.error('You are already onboarded');
			setTimeout(() => {
				navigate('/home');
			}, 1500);
		}
		handleGetUserDetails();
		getUserLogo();
		const countryCode = getCountryCode(info?.phoneNumber);
		setInfo((prev) => ({
			...prev,
			countryCode,
		}));
		return () => {
			localStorage.removeItem('stage');
		};
	}, []);

	useEffect(() => {
		localStorage.setItem('stage', info?.stage);
	}, [info?.stage]);

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
		const profilePicture = userLogo ?? profilePictureCntxt;
		if (profilePicture) {
			setInfo((prev) => ({
				...prev,
				profilePicture,
			}));
		}
	}, [profilePictureCntxt, userLogo]);

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
				const workspaceHandle = info?.companyName?.toLowerCase()?.replace(/[^a-z0-9]/g, '');
				handleCheckWorkspaceHandleAvailability(workspaceHandle);
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

	useEffect(() => {
		if (theme) {
			setInfo((prev) => ({ ...prev, themePreference: theme }));
		}
	}, [theme]);

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
				workspaceHandle,
			}));
			const response = await checkWorkspaceHandleAvailability(workspaceHandle);
			if (response?.[0] === true) {
				const isAvailable = response?.[1]?.available;
				setInfo((prev) => ({
					...prev,
					isWorkspaceHandleAvailable: isAvailable,
				}));
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

	const handleSetWorkspaceType = useCallback(
		(e) => {
			const workspaceType = e?.target?.value ?? '';
			setInfo((prev) => ({ ...prev, workspaceType }));
		},
		[info?.workspaceType],
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

	const handleSetProfilePicture = useCallback(async (e) => {
		const file = e?.target?.files?.[0];
		const profilePicture = file ? URL.createObjectURL(file) : null;
		if (profilePicture) {
			setInfo((prev) => ({ ...prev, profilePicture }));
		}
		const response = await updateUserLogo(file);
		const success = response?.[0] === true;
		if (success) {
			message?.success('Profile picture uploaded successfully');
		} else {
			message?.error(response?.[1]?.message);
		}
	}, []);

	const handleVerifyPhoneNumber = useCallback(async () => {
		setInfo((prev) => ({ ...prev, verifyPhoneNumberLoading: true }));
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
		setInfo((prev) => ({ ...prev, verifyPhoneNumberLoading: false }));
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
			if (themePreference === info?.themePreference) return;
			setInfo((prev) => ({ ...prev, themePreference }));
			const response = await updateTheme(themePreference);
			const success = response?.[0] === true;
			if (success) {
				message?.success('Theme preference updated successfully');
			} else {
				message?.error(response?.[1]?.message);
			}
		},
		[info?.themePreference],
	);

	const handleSetCompanyName = useCallback((e) => {
		let companyName = e?.target?.value;
		const formattedCompanyName = companyName
			.replace(/[^a-zA-Z0-9 ]/g, '')
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

		setInfo((prev) => ({
			...prev,
			companyName: formattedCompanyName,
		}));
	}, []);

	const handleSetCompanyLogo = useCallback(
		async (e) => {
			companyLogoFile = e?.target?.files?.[0];
			const companyLogo = companyLogoFile ? URL.createObjectURL(companyLogoFile) : null;
			if (companyLogo) {
				setInfo((prev) => ({ ...prev, companyLogo }));
			}
		},
		[info?.companyLogo],
	);

	const handlePrevStage = useCallback(
		() => setInfo((prev) => ({ ...prev, stage: prev?.stage - 1 })),
		[info?.stage],
	);

	const handleUploadCompanyLogo = useCallback(async () => {
		if (companyLogoFile) {
			const response = await uploadTenantLogo(companyLogoFile);
			const success = response?.[0] === true;
			return success;
		} else {
			return [false, 'No company logo file selected'];
		}
	}, [companyLogoFile]);

	const handleCreateWorkspace = useCallback(async () => {
		const response = await createWorkspace({
			workspaceHandle: info?.workspaceHandle,
			workspaceType: info?.workspaceType,
			businessName: info?.companyName,
		});
		const success = response?.[0] === true;
		if (success) {
			if (companyLogoFile) {
				const isCompanyLogoUploaded = await handleUploadCompanyLogo();
				if (isCompanyLogoUploaded) {
					message?.success('Workspace created successfully');
					setTimeout(() => {
						navigate('/home');
					}, 1000);
				} else {
					message?.error(
						'Workspace created successfully but failed to upload company logo',
					);
				}
			} else {
				message?.success('Workspace created successfully');
				setTimeout(() => {
					navigate('/home');
				}, 1000);
			}
		} else {
			message?.error(response?.[1]?.message);
		}
	}, [info?.companyName, info?.workspaceType]);

	const handleNextStage = useCallback(() => {
		if (info?.stage === 2) {
			handleCreateWorkspace();
			return;
		}
		setInfo((prev) => ({ ...prev, stage: prev?.stage + 1 }));
	}, [info?.stage, info?.companyName, info?.workspaceType]);

	const stageMapper = {
		1: (
			<Stage1
				username={info?.username}
				phoneNumber={info?.phoneNumber}
				isPhoneNumberVerified={info?.isPhoneNumberVerified}
				profilePicture={info?.profilePicture}
				handleSetProfilePicture={handleSetProfilePicture}
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
				verifyPhoneNumberLoading={info?.verifyPhoneNumberLoading}
			/>
		),
		2: (
			<Stage2
				companyName={info?.companyName}
				workspaceHandle={info?.workspaceHandle}
				companyLogo={info?.companyLogo}
				handleSetCompanyName={handleSetCompanyName}
				handleSetCompanyLogo={handleSetCompanyLogo}
				checkingWorkspaceHandle={info?.checkingWorkspaceHandle}
				isWorkspaceHandleAvailable={info?.isWorkspaceHandleAvailable}
				workspaceType={info?.workspaceType}
				handleSetWorkspaceType={handleSetWorkspaceType}
			/>
		),
	};

	return (
		<>
			<ProgressBar stage={info?.stage} pathname={pathname} />
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
