import { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/onboarding/stages.scss';
import { formatUsername } from '../../../helpers';
import Context from '../../../context/context';
import ProgressBar from './ProgressBar';
import UserDetailsForm from './UserDetailsForm';
import WorkspaceDetailsForm from './WorkspaceDetailsForm';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import Skeleton from 'react-loading-skeleton';

let usernameTimeoutId, companyLogoFile;

const Stages = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const invitedWorkspaceId = searchParams.get('invitedWorkspaceId') ?? false;
	const invitedUserEmail = searchParams.get('inviteeEmail') ?? false;
	const invitedUserOnboarding = invitedWorkspaceId && invitedUserEmail;
	const pathname = location?.pathname;
	if (pathname === '/create-workspace') {
		localStorage.setItem('stage', 2);
	}
	const usertoken = localStorage.getItem('usertoken');
	const stageFromLocalStorage = Number(localStorage.getItem('stage') ?? 1);
	const isUserOnboard = localStorage?.getItem('isOnboard') === 'true' ?? false;

	const {
		authInfo: {
			checkWorkspaceHandleAvailability,
			updateUserDetails,
			requestResendOTPToMobile,
			verifyMobileOtpCode,
			createWorkspace,
		},
		profileInfo: { userDetailsFromTenantAPI, getUserDetailsFromTenantAPI, updateUserLogo },
		companyInfo: { uploadTenantLogo },
		themeInfo: { theme, updateTheme },
	} = useContext(Context);

	const [info, setInfo] = useState({
		stage: stageFromLocalStorage, // Stage 1: UserDetailsForm, Stage 2: WorkspaceDetailsForm
		username: '',
		phoneNumber: '',
		profilePicture: null,
		themePreference: 'systemDefault',
		companyName: '',
		workspaceHandle: '',
		workspaceType: '',
		companyLogo: null,
		checkingWorkspaceHandle: false,
		isWorkspaceHandleAvailable: null,
		continueBtnDisabled: true,
		continueBtnLoading: false,
		otp: '',
		otpSent: false,
		resendOtpLoading: false,
		isPhoneNumberVerified: false,
		verifyPhoneNumberLoading: false,
		userDetailsLoading: true,
		verifyOtpLoader: false,
	});

	const emailCntxt = userDetailsFromTenantAPI?.email;
	const isPhoneNumberVerifiedCntxt = userDetailsFromTenantAPI?.isPhoneVerified;
	const phoneNumberExistsInDBCntxt = userDetailsFromTenantAPI?.phoneNumber?.length > 0;
	const firstNameCntxt = userDetailsFromTenantAPI?.firstName;
	const lastNameCntxt = userDetailsFromTenantAPI?.lastName;
	const phoneNumberCntxt = userDetailsFromTenantAPI?.phoneNumber;
	const profilePictureCntxt = userDetailsFromTenantAPI?.googleMeta?.picture ?? null;
	const userLogo = userDetailsFromTenantAPI?.dp_s3_500w_key ?? null;

	useEffect(() => {
		if (!usertoken) {
			message?.error('Session expired! Please login again');
			localStorage.removeItem('stage');
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
				localStorage.removeItem('stage');
				navigate('/home');
			}, 1500);
		}
		if (!isUserOnboard && pathname === '/create-workspace') {
			message?.error('You are not onboarded! Redirecting to onboarding page');
			setTimeout(() => {
				setInfo((prev) => ({ ...prev, stage: 1 }));
				localStorage.setItem('stage', 1);
				navigate('/onboarding');
			}, 1500);
		}
		handleGetUserDetails();
		return () => {
			localStorage.removeItem('stage');
		};
	}, []);

	useEffect(() => {
		localStorage.setItem('stage', info?.stage);
	}, [info?.stage]);

	useEffect(() => {
		if (pathname === '/create-workspace') return;
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
		if (pathname === '/create-workspace') return;
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
				(info?.stage === 1 && (!info?.username || !info?.isPhoneNumberVerified)) ||
				(info?.stage === 2 &&
					(!info?.companyName ||
						!info?.workspaceHandle ||
						!info?.isWorkspaceHandleAvailable ||
						!info?.workspaceType)),
		}));
	}, [
		info?.username,
		info?.isPhoneNumberVerified,
		info?.stage,
		info?.companyName,
		info?.workspaceHandle,
		info?.isWorkspaceHandleAvailable,
		info?.workspaceType,
	]);

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
				workspaceHandle: '',
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
		setInfo((prev) => ({ ...prev, userDetailsLoading: true }));
		const response = await getUserDetailsFromTenantAPI();
		const success = response?.[0] === true;
		if (!success) {
			const statusCode = response?.[1]?.statusCode;
			if (statusCode === 401) {
				message?.error('Session expired! Please login again');
				localStorage.removeItem('stage');
				setTimeout(() => {
					window.location.href = '/verify-user';
				}, 1500);
			}
		}
		setInfo((prev) => ({ ...prev, userDetailsLoading: false }));
	}, []);

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
		(e, workspaceTypeOption) => {
			const workspaceType = e?.target?.value ?? workspaceTypeOption?.label ?? '';
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
		if (info?.isPhoneNumberVerified) return;
		setInfo((prev) => ({ ...prev, verifyPhoneNumberLoading: true }));
		const { username, phoneNumber } = info;
		if (
			!isPhoneNumberVerifiedCntxt &&
			phoneNumberExistsInDBCntxt &&
			phoneNumberCntxt === phoneNumber
		) {
			const response = await requestResendOTPToMobile();
			const success = response?.[0] === true;
			if (success) {
				message?.success(`An OTP has been sent to ${phoneNumber}`);
				setInfo((prev) => ({ ...prev, otpSent: true }));
			} else {
				message?.error(response?.[1]?.message?.toUpperCase());
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
			let otp = e?.target?.value?.replace(/[^0-9]/g, '') ?? '';
			if (otp?.length > 6) otp = otp?.slice(0, 6);
			setInfo((prev) => ({ ...prev, otp }));
		},
		[info?.otp],
	);

	const handleSetOTPSentToFalse = useCallback(() => {
		setInfo((prev) => ({ ...prev, otpSent: false, otp: '' }));
	}, [info?.otpSent, info?.otp]);

	const handleVerifyMobileOtpCode = useCallback(async () => {
		if (info?.verifyOtpLoader) return;
		setInfo((prev) => ({ ...prev, verifyOtpLoader: true }));
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
		setInfo((prev) => ({ ...prev, verifyOtpLoader: false }));
	}, [info?.phoneNumber, info?.otp]);

	const handleResendOtp = useCallback(async () => {
		if (info?.resendOtpLoading) return;
		setInfo((prev) => ({ ...prev, resendOtpLoading: true }));
		const response = await requestResendOTPToMobile();
		const success = response?.[0] === true;
		if (success) {
			message?.success(`OTP resent to ${info?.phoneNumber}`);
		} else {
			const errorMessage = response?.[1]?.message;
			message?.error(errorMessage);
		}
		setInfo((prev) => ({ ...prev, resendOtpLoading: false }));
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
						localStorage.removeItem('stage');
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
					localStorage.removeItem('stage');
					navigate('/home');
				}, 1000);
			}
		} else {
			message?.error(response?.[1]?.message);
		}
	}, [info?.companyName, info?.workspaceType, info?.workspaceHandle]);

	const handleNextStage = useCallback(async () => {
		if (invitedUserOnboarding) {
			localStorage.removeItem('stage');
			navigate('/home');
			return;
		}
		if (info?.stage === 2) {
			setInfo((prev) => ({ ...prev, continueBtnLoading: true }));
			await handleCreateWorkspace();
			setInfo((prev) => ({ ...prev, continueBtnLoading: false }));
			return;
		}
		setInfo((prev) => ({ ...prev, stage: prev?.stage + 1 }));
	}, [info?.stage, info?.companyName, info?.workspaceType, info?.continueBtnLoading]);

	const stageMapper = {
		1: (
			<UserDetailsForm
				userDetailsLoading={info?.userDetailsLoading}
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
				resendOtpLoading={info?.resendOtpLoading}
				verifyPhoneNumberLoading={info?.verifyPhoneNumberLoading}
				verifyOtpLoader={info?.verifyOtpLoader}
			/>
		),
		2: (
			<WorkspaceDetailsForm
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
			<ProgressBar
				stage={info?.stage}
				pathname={pathname}
				invitedUserOnboarding={invitedUserOnboarding}
			/>
			<div className="stageContainer">
				{info?.userDetailsLoading ? (
					<Skeleton
						width="300px"
						height="17px"
						style={{
							'--highlight-color': 'gray',
							'--base-color': 'transparent',
						}}
					/>
				) : (
					<h1 className="email">{emailCntxt}</h1>
				)}
				{stageMapper?.[info?.stage]}
			</div>
			<div className="btnsContainer">
				{info?.stage > 1 && pathname !== '/create-workspace' && (
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
					{info?.continueBtnLoading ? 'Creating workspace...' : 'Continue'}
				</button>
			</div>
		</>
	);
};

export default memo(Stages);
