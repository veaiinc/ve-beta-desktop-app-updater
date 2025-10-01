import { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/onboarding/stages.scss';
import Context from '../../../context/context';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { message } from '../globalComponents/CustomToast';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-phone-number-input/style.css';
import { formatUsername, fetchDomainName } from '../../../helpers';
import Cookies from 'js-cookie';
import ThemeSelector from './ThemeSelector';
import WorkspaceTypeInput from './WorkspaceTypeInput';
import WorkspaceHandle from './WorkspaceHandle';
import NameInput from './NameInput';
import PhoneNumberInput from './PhoneNumberInput';
let usernameTimeoutId, companyLogoFile;

export const customContainerStyle = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: 'var(--card)',
};

export const contentStyling = {
	color: 'var(--primary-font)',
	fontFamily: 'var(--primary-font-family)',
	fontSize: '12px',
	fontStyle: 'normal',
	fontWeight: '500',
	lineHeight: 'normal',
};

const Stages = ({ onNext }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const invitedWorkspaceId = searchParams.get('invitedWorkspaceId') ?? false;
	const invitedUserEmail = searchParams.get('inviteeEmail') ?? false;
	const invitedUserOnboarding = Boolean(invitedWorkspaceId && invitedUserEmail);
	const pathname = location?.pathname;
	if (pathname === '/create-workspace') {
		localStorage.setItem('stage', 2);
	}
	const usertoken = localStorage.getItem('usertoken');
	const isUserOnboard = localStorage?.getItem('isOnboard') === 'true';

	// Check for workspace creation mode
	const isWorkspaceCreationMode =
		localStorage.getItem('stage') === '2' && localStorage.getItem('onboardingStep') === '1';

	const {
		authInfo: {
			checkWorkspaceHandleAvailability,
			updateUserDetails,
			requestResendOTPToMobile,
			verifyMobileOtpCode,
			createWorkspace,
		},
		profileInfo: {
			userDetailsFromTenantAPI,
			getUserDetailsFromTenantAPI,
			updateUserLogo,
			getUserWorkSpaceList,
			getTenantSettings,
		},
		companyInfo: { uploadTenantLogo },
		themeInfo: { updateTheme },
	} = useContext(Context);

	const [info, setInfo] = useState({
		username: '',
		phoneNumber: '',
		profilePicture: null,
		themePreference: localStorage.getItem('theme') ?? 'systemDefault',
		companyName: '',
		workspaceHandle: '',
		workspaceType: '',
		companyLogo: null,
		checkingWorkspaceHandle: false,
		isWorkspaceHandleAvailable: null,
		continueBtnLoading: false,
		otp: '',
		otpSent: false,
		resendOtpLoading: false,
		isPhoneNumberVerified: false,
		verifyPhoneNumberLoading: false,
		userDetailsLoading: true,
		verifyOtpLoader: false,
		isWorkspaceHandleLengthInvalid: true,
	});

	const [workspaceTypeContainerWidth, setWorkspaceTypeContainerWidth] = useState(0);
	const [workspaceTypeContainerOpen, setWorkspaceTypeContainerOpen] = useState(false);

	const emailCntxt = userDetailsFromTenantAPI?.email;
	const isPhoneNumberVerifiedCntxt = userDetailsFromTenantAPI?.isPhoneVerified;
	const phoneNumberExistsInDBCntxt = userDetailsFromTenantAPI?.phoneNumber?.length > 0;
	const firstNameCntxt = userDetailsFromTenantAPI?.firstName;
	const lastNameCntxt = userDetailsFromTenantAPI?.lastName;
	const phoneNumberCntxt = userDetailsFromTenantAPI?.phoneNumber;
	const profilePictureCntxt = userDetailsFromTenantAPI?.googleMeta?.picture ?? null;
	const userLogo = userDetailsFromTenantAPI?.dp_s3_500w_key ?? null;
	// Updated continue button validation based on mode
	const continueBtnDisabled = isWorkspaceCreationMode
		? !info?.companyName ||
		  !info?.workspaceHandle ||
		  !info?.isWorkspaceHandleAvailable ||
		  !info?.workspaceType ||
		  info?.continueBtnLoading
		: invitedUserOnboarding
		? !info?.username || !info?.isPhoneNumberVerified
		: !info?.username ||
		  !info?.isPhoneNumberVerified ||
		  !info?.companyName ||
		  !info?.workspaceHandle ||
		  !info?.isWorkspaceHandleAvailable ||
		  !info?.workspaceType ||
		  info?.continueBtnLoading;

	// Phone number verification button validation
	const phoneVerifyBtnDisabled =
		!info?.phoneNumber || info?.phoneNumber?.trim() === '' || info?.verifyPhoneNumberLoading;

	useEffect(() => {
		if (!usertoken) {
			message?.error('Session expired! Please login again');
			setTimeout(() => {
				window.location.href = '/verify-user';
			}, 1500);
		}
		if (
			isUserOnboard &&
			pathname === '/onboarding' &&
			!invitedWorkspaceId &&
			!invitedUserEmail
		) {
			message?.error('You are already onboarded');
			setTimeout(() => {
				navigate('/home');
			}, 1500);
		}
		if (!isUserOnboard && pathname === '/create-workspace') {
			message?.error('You are not onboarded! Redirecting to onboarding page');
			setTimeout(() => {
				navigate('/onboarding');
			}, 1500);
		}
		handleGetUserDetails();
	}, []);

	useEffect(() => {
		const selector = '.workspaceTypeContainer';
		const workspaceTypeContainer = document.querySelector(selector);
		if (workspaceTypeContainer) {
			const width = workspaceTypeContainer?.offsetWidth;
			setWorkspaceTypeContainerWidth(width);
		}
	}, []);

	useEffect(() => {
		if (pathname === '/create-workspace') return;
		if (isWorkspaceCreationMode) return; // Skip personal details in workspace creation mode
		if (firstNameCntxt || lastNameCntxt) {
			const formattedUsername = formatUsername(
				(firstNameCntxt ?? '') + ' ' + (lastNameCntxt ?? ''),
			);
			setInfo((prev) => ({
				...prev,
				username: formattedUsername,
			}));
		}
	}, [firstNameCntxt, lastNameCntxt, isWorkspaceCreationMode]);

	useEffect(() => {
		if (pathname === '/create-workspace') return;
		if (isWorkspaceCreationMode) return; // Skip personal details in workspace creation mode
		if (usernameTimeoutId) clearTimeout(usernameTimeoutId);
		usernameTimeoutId = setTimeout(() => {
			const username = info?.username;
			if (username) {
				updateUserDetails(username);
			}
		}, 1000);
	}, [info?.username, isWorkspaceCreationMode]);

	useEffect(() => {
		if (isWorkspaceCreationMode) return; // Skip personal details in workspace creation mode
		setInfo((prev) => ({
			...prev,
			phoneNumber: phoneNumberCntxt,
		}));
	}, [phoneNumberCntxt, isWorkspaceCreationMode]);

	useEffect(() => {
		if (isWorkspaceCreationMode) return; // Skip personal details in workspace creation mode
		setInfo((prev) => ({
			...prev,
			isPhoneNumberVerified: isPhoneNumberVerifiedCntxt,
		}));
	}, [isPhoneNumberVerifiedCntxt, isWorkspaceCreationMode]);

	useEffect(() => {
		if (isWorkspaceCreationMode) return; // Skip personal details in workspace creation mode
		const profilePicture = userLogo ?? profilePictureCntxt;
		if (profilePicture) {
			setInfo((prev) => ({
				...prev,
				profilePicture,
			}));
		}
	}, [profilePictureCntxt, userLogo, isWorkspaceCreationMode]);

	useEffect(() => {
		if (info?.companyName?.length > 0) {
			const timeout = setTimeout(async () => {
				const workspaceHandle = info?.companyName?.toLowerCase()?.replace(/[^a-z0-9]/g, '');
				if (workspaceHandle?.length >= 4) {
					handleCheckWorkspaceHandleAvailability(workspaceHandle);
				} else {
					setInfo((prev) => ({
						...prev,
						isWorkspaceHandleLengthInvalid: true,
						checkingWorkspaceHandle: false,
						isWorkspaceHandleAvailable: null,
						workspaceHandle: workspaceHandle,
					}));
				}
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
		if (info?.otp?.length === 4) {
			handleVerifyMobileOtpCode();
		}
	}, [info?.otp]);

	const handleGetUserDetails = useCallback(async () => {
		setInfo((prev) => ({ ...prev, userDetailsLoading: true }));
		const response = await getUserDetailsFromTenantAPI();
		const success = response?.[0] === true;
		if (!success) {
			const statusCode = response?.[1]?.statusCode;
			if (statusCode === 401) {
				message?.error('Session expired! Please login again');
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
			const formattedWorkspaceType = workspaceType
				.replace(/[^a-zA-Z0-9 ]/g, '')
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');
			setInfo((prev) => ({ ...prev, workspaceType: formattedWorkspaceType }));
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
		if (info?.username?.trim()?.length === 0) {
			message?.error('Please enter your name before verifying phone number');
			return;
		}
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
		(otp) => {
			// let otp = e?.target?.value?.replace(/[^0-9]/g, '') ?? '';
			// if (otp?.length > 4) otp = otp?.slice(0, 4);
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
				localStorage.setItem('theme', themePreference);
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

	const handleUploadCompanyLogo = useCallback(async () => {
		if (companyLogoFile) {
			const response = await uploadTenantLogo(companyLogoFile);
			const success = response?.[0] === true;
			return success;
		} else {
			return [false, 'No company logo file selected'];
		}
	}, [companyLogoFile]);

	const handleContinue = async () => {
		if (continueBtnDisabled) return;
		if (invitedUserOnboarding) {
			navigate('/home');
			return;
		}
		setInfo((prev) => ({ ...prev, continueBtnLoading: true }));
		try {
			const response = await createWorkspace({
				workspaceHandle: info?.workspaceHandle,
				workspaceType: info?.workspaceType,
				businessName: info?.companyName,
			});
			const success = response?.[0] === true;
			if (success) {
				const workspaceId = response?.[1]?.workspaceId;
				const region = response?.[1]?.region;
				localStorage.setItem('workspaceId', workspaceId);
				if (region) {
					localStorage.setItem('region', region);
					// Store region in cookies
					const host = fetchDomainName();
					Cookies.set('region', region, {
						sameSite: 'lax',
						domain: host,
					});
				}

				// Remove workspace creation mode keys after successful creation
				if (isWorkspaceCreationMode) {
					localStorage.removeItem('stage');
					localStorage.removeItem('onboardingStep');
				}

				getTenantSettings();
				await getUserWorkSpaceList();
				if (companyLogoFile) {
					const isCompanyLogoUploaded = await handleUploadCompanyLogo();
					if (isCompanyLogoUploaded) {
						message?.success('Workspace created successfully');
					} else {
						message?.error('Workspace created but failed to upload company logo');
					}
				} else {
					message?.success('Workspace created successfully');
				}
				// onNext(info);
				navigate('/download-app');
			} else {
				message?.error(response?.[1]?.message);
			}
		} catch (err) {
			message?.error('Something went wrong. Please try again.');
		}
		setInfo((prev) => ({ ...prev, continueBtnLoading: false }));
	};

	// Workspace type dropdown open logic
	const handleWorkspaceTypeInput = (e) => {
		handleSetWorkspaceType(e);
		const value = e?.target?.value || '';
		if (value.length > 0) {
			setWorkspaceTypeContainerOpen(true);
		} else {
			setWorkspaceTypeContainerOpen(false);
		}
	};

	return (
		<>
			<div className="stageContainer">
				{/* Combined Single Stage Form */}
				<div className="singleStage">
					<header className="header">
						{isWorkspaceCreationMode ? (
							<>
								<h1 className="title">Set up a collaborative workspace</h1>
								{/* <h2 className="subtitle">Set up your workspace details</h2> */}
							</>
						) : (
							<>
								<h1 className="title">
									Let's get <span className="title-highlight">started</span>
								</h1>
								<h2 className="subtitle">Personalize your experience</h2>
							</>
						)}
					</header>

					<main className="singleStageContent">
						{/* User Details Section - Only show if not in workspace creation mode */}
						{(!isWorkspaceCreationMode || invitedUserOnboarding) && (
							<div className={`userDetailsSection`}>
								<div
									className={`topAnimationSection ${
										!info?.isPhoneNumberVerified ? 'show' : ''
									}`}
								>
									<NameInput
										userDetailsLoading={info?.userDetailsLoading}
										username={info?.username}
										handleSetUsername={handleSetUsername}
										customContainerStyle={customContainerStyle}
										contentStyling={contentStyling}
										disabled={info?.otpSent}
									/>

									<PhoneNumberInput
										otpSent={info?.otpSent}
										phoneNumber={info?.phoneNumber}
										otp={info?.otp}
										handleSetOTP={handleSetOTP}
										verifyOtpLoader={info?.verifyOtpLoader}
										handleResendOtp={handleResendOtp}
										resendOtpLoading={info?.resendOtpLoading}
										handleSetOTPSentToFalse={handleSetOTPSentToFalse}
										userDetailsLoading={info?.userDetailsLoading}
										isPhoneNumberVerified={info?.isPhoneNumberVerified}
										handleSetPhoneNumber={handleSetPhoneNumber}
									/>
								</div>

								{/* Workspace Details Section */}
								{!invitedUserOnboarding && (
									<div
										className={`workspaceDetailsSection ${
											info?.isPhoneNumberVerified ? 'show' : ''
										}`}
									>
										<WorkspaceHandle
											companyName={info?.companyName}
											handleSetCompanyName={handleSetCompanyName}
											workspaceHandle={info?.workspaceHandle}
											checkingWorkspaceHandle={info?.checkingWorkspaceHandle}
											isWorkspaceHandleAvailable={
												info?.isWorkspaceHandleAvailable
											}
											customContainerStyle={customContainerStyle}
											contentStyling={contentStyling}
											handleSetCompanyLogo={handleSetCompanyLogo}
										/>
										<WorkspaceTypeInput
											workspaceTypeContainerOpen={workspaceTypeContainerOpen}
											workspaceTypeContainerWidth={
												workspaceTypeContainerWidth
											}
											handleSetWorkspaceType={handleSetWorkspaceType}
											handleWorkspaceTypeInput={handleWorkspaceTypeInput}
											workspaceType={info?.workspaceType}
											setWorkspaceTypeContainerOpen={
												setWorkspaceTypeContainerOpen
											}
										/>
										<ThemeSelector
											themePreference={info?.themePreference}
											handleSetThemePreference={handleSetThemePreference}
										/>
									</div>
								)}
							</div>
						)}
						{/* Workspace Details Section - Show for workspace creation mode */}
						{isWorkspaceCreationMode && !invitedUserOnboarding && (
							<div className="workspaceDetailsSection show">
								<WorkspaceHandle
									companyName={info?.companyName}
									handleSetCompanyName={handleSetCompanyName}
									workspaceHandle={info?.workspaceHandle}
									checkingWorkspaceHandle={info?.checkingWorkspaceHandle}
									isWorkspaceHandleAvailable={info?.isWorkspaceHandleAvailable}
									customContainerStyle={customContainerStyle}
									contentStyling={contentStyling}
									handleSetCompanyLogo={handleSetCompanyLogo}
								/>

								<WorkspaceTypeInput
									workspaceTypeContainerOpen={workspaceTypeContainerOpen}
									workspaceTypeContainerWidth={workspaceTypeContainerWidth}
									handleSetWorkspaceType={handleSetWorkspaceType}
									handleWorkspaceTypeInput={handleWorkspaceTypeInput}
									workspaceType={info?.workspaceType}
									setWorkspaceTypeContainerOpen={setWorkspaceTypeContainerOpen}
								/>
							</div>
						)}
						{/* Theme Preference Section - Only show if not in workspace creation mode */}
					</main>
				</div>
			</div>
			<div className="btnsContainer">
				{!info?.isPhoneNumberVerified && !info?.otpSent && !isWorkspaceCreationMode && (
					<button
						style={{
							opacity: phoneVerifyBtnDisabled ? 0.4 : 1,
							cursor: phoneVerifyBtnDisabled ? 'not-allowed' : 'pointer',
						}}
						disabled={phoneVerifyBtnDisabled}
						className="continueBtn"
						onClick={handleVerifyPhoneNumber}
					>
						{info?.verifyPhoneNumberLoading ? 'Verifying...' : 'Verify Number by OTP'}
					</button>
				)}
				{(info?.isPhoneNumberVerified || isWorkspaceCreationMode) && (
					<button
						style={{
							opacity: continueBtnDisabled ? 0.4 : 1,
							cursor: continueBtnDisabled ? 'not-allowed' : 'pointer',
						}}
						disabled={continueBtnDisabled}
						className="continueBtn"
						onClick={handleContinue}
					>
						{isWorkspaceCreationMode ? 'Create Workspace' : 'Continue'}
					</button>
				)}
			</div>
		</>
	);
};

export default memo(Stages);
