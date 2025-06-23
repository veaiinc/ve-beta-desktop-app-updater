import { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/onboarding/stages.scss';
import Context from '../../../context/context';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { message } from '../globalComponents/CustomToast';
import Skeleton from 'react-loading-skeleton';
import { ReactComponent as GreenTick } from '../../../assets/svg/onboarding/green-tick.svg';
import { ReactComponent as DarkIcon } from '../../../assets/svg/onboarding/dark.svg';
import { ReactComponent as LightIcon } from '../../../assets/svg/onboarding/light.svg';
import { ReactComponent as UploadIcon } from '../../../assets/svg/onboarding/upload-icon.svg';
import { ReactComponent as DeskTopIcon } from '../../../../builderSrc/assets/svg/smartFile/Desktop.svg';
import { Tooltip } from 'antd';
import ToolTipContainer from '../popover/ToolTipContainer';
import Spinner from '../loaders/Spinner';
import WorkspaceTypeOptions from './WorkspaceTypeOptions';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { formatUsername, fetchDomainName } from '../../../helpers';
import Cookies from 'js-cookie';
let usernameTimeoutId, companyLogoFile;

const themePreferences = [
	{
		id: 1,
		label: 'System Default',
		icon: <DeskTopIcon />,
		value: 'systemDefault',
	},
	{
		id: 2,
		label: 'Dark',
		icon: <DarkIcon />,
		value: 'dark',
	},
	{
		id: 3,
		label: 'Light',
		icon: <LightIcon />,
		value: 'light',
	},
];

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
	const invitedUserOnboarding = invitedWorkspaceId && invitedUserEmail;
	const pathname = location?.pathname;
	if (pathname === '/create-workspace') {
		localStorage.setItem('stage', 2);
	}
	const usertoken = localStorage.getItem('usertoken');
	const isUserOnboard = localStorage?.getItem('isOnboard') === 'true';

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

	const continueBtnDisabled =
		!info?.username ||
		!info?.isPhoneNumberVerified ||
		!info?.companyName ||
		!info?.workspaceHandle ||
		!info?.isWorkspaceHandleAvailable ||
		!info?.workspaceType ||
		info?.continueBtnLoading;

	useEffect(() => {
		if (!usertoken) {
			message?.error('Session expired! Please login again');
			setTimeout(() => {
				window.location.href = '/verify-user';
			}, 1500);
		}
		if (
			isUserOnboard &&
			pathname !== '/onboarding' &&
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
			if (otp?.length > 4) otp = otp?.slice(0, 4);
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
				onNext(info);
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
				{/* {info?.userDetailsLoading ? (
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
				)} */}

				{/* Combined Single Stage Form */}
				<div className="singleStage">
					<header className="header">
						<h1 className="title">Let's get started</h1>
						<h2 className="subtitle">Personalize your experience</h2>
					</header>

					<main className="singleStageContent">
						{/* User Details Section */}
						<div className="userDetailsSection">
							<div className="nameInputContainer">
								<p className="question">What is your name?</p>
								{info?.userDetailsLoading ? (
									<Skeleton
										width="100%"
										height="41px"
										style={{
											'--highlight-color': 'gray',
											'--base-color': 'transparent',
										}}
									/>
								) : (
									<div className="nameInputAndProfilePictureContainer">
										<input
											className="nameInput"
											value={info?.username}
											onChange={handleSetUsername}
											type="text"
											placeholder="Full Name"
											autoFocus
										/>
										<Tooltip
											title={
												<ToolTipContainer
													customContainerStyle={customContainerStyle}
													contentStyling={contentStyling}
													title={''}
													content={'Upload your profile picture'}
													removeClassName={true}
												/>
											}
											arrow={true}
											color={'var(--card)'}
										>
											<div className="profilePictureContainer">
												<label htmlFor="profilePictureInput">
													<input
														id="profilePictureInput"
														type="file"
														accept="image/*"
														onChange={handleSetProfilePicture}
														className="profilePictureInput"
													/>
													{/* {info?.profilePicture ? (
														<img
															src={info?.profilePicture}
															alt={info?.username}
															className="profilePicture"
														/>
													) : (
														<UploadIcon />
													)} */}
												</label>
											</div>
										</Tooltip>
									</div>
								)}
							</div>

							{info?.otpSent ? (
								<div className="otpInputContainer">
									<p className="question">
										Enter the OTP that was sent to {info?.phoneNumber}
									</p>
									<input
										className={`otpInput ${info?.otpSent && 'animate'}`}
										value={info?.otp}
										placeholder="0000"
										onChange={handleSetOTP}
										type="text"
									/>
									{info?.verifyOtpLoader && (
										<div className="spinnerContainer">
											<Spinner width={'16px'} height={'16px'} />
										</div>
									)}
									<button
										onClick={handleResendOtp}
										className="resendOtpBtn"
										style={{
											opacity: info?.resendOtpLoading ? 0.5 : 1,
											cursor: info?.resendOtpLoading
												? 'not-allowed'
												: 'pointer',
										}}
										disabled={info?.resendOtpLoading}
									>
										{info?.resendOtpLoading ? 'Resending...' : 'Resend OTP'}
									</button>
									<button
										onClick={handleSetOTPSentToFalse}
										className="changePhoneNumberBtn"
									>
										Change Phone Number
									</button>
								</div>
							) : (
								<div className="phoneInputContainer">
									<p className="question">Enter your phone number</p>
									<div className="phoneInputContain">
										{info?.userDetailsLoading ? (
											<Skeleton
												width="100%"
												height="41px"
												style={{
													'--highlight-color': 'gray',
													'--base-color': 'transparent',
												}}
											/>
										) : (
											<PhoneInput
												placeholder="Enter phone number"
												value={info?.phoneNumber}
												onChange={handleSetPhoneNumber}
												defaultCountry={(() => {
													try {
														const locationDetails = JSON.parse(
															localStorage.getItem('locationDetails'),
														);
														return locationDetails?.countryCode || 'US';
													} catch {
														return 'US';
													}
												})()}
												className="phoneInputNumber"
												countryCallingCodeEditable={true}
												autoComplete="tel"
												disabled={info?.isPhoneNumberVerified}
											/>
										)}
										{info?.isPhoneNumberVerified ? (
											<div className="phoneNumberVerifiedContainer">
												<GreenTick />
											</div>
										) : (
											info?.phoneNumber && (
												<button
													onClick={handleVerifyPhoneNumber}
													className="verifyPhoneNumberBtn"
													style={{
														opacity: info?.verifyPhoneNumberLoading
															? 0.5
															: 1,
														cursor: info?.verifyPhoneNumberLoading
															? 'not-allowed'
															: 'pointer',
													}}
													disabled={info?.verifyPhoneNumberLoading}
												>
													{info?.verifyPhoneNumberLoading
														? 'Verifying...'
														: 'Verify now'}
												</button>
											)
										)}
									</div>
								</div>
							)}
							{/* Workspace Details Section */}
							<div className="workspaceDetailsSection">
								<div className="companyNameContainer">
									<p className="question">Name of your Workspace handle?</p>
									<div className="companyNameAndLogoInputs">
										<input
											className="companyNameInput"
											type="text"
											placeholder="Company Name"
											value={info?.companyName}
											onChange={handleSetCompanyName}
										/>
										<Tooltip
											title={
												<ToolTipContainer
													customContainerStyle={customContainerStyle}
													contentStyling={contentStyling}
													title={''}
													content={'Upload your company logo'}
													removeClassName={true}
												/>
											}
											arrow={true}
											color={'var(--card)'}
										>
											<div className="companyLogoInputContainer">
												<label htmlFor="companyLogoInput">
													<input
														id="companyLogoInput"
														type="file"
														accept="image/*"
														onChange={handleSetCompanyLogo}
														className="companyLogoInput"
													/>
													{/* {info?.companyLogo ? (
														<img
															className="companyLogo"
															src={info?.companyLogo}
															alt="Company Logo"
														/>
													) : (
														<UploadIcon />
													)} */}
												</label>
											</div>
										</Tooltip>
									</div>

									<div className="domainInfoContainer">
										{info?.workspaceHandle?.length > 0 &&
											(info?.workspaceHandle.length < 4 ? (
												<span className="unavailable">
													Workspace handle must be at least 4 characters
												</span>
											) : (
												<>
													<span className="domainName">
														{info?.workspaceHandle}.ve.ai
													</span>
													{info?.checkingWorkspaceHandle ? (
														<Spinner width="16px" height="16px" />
													) : info?.isWorkspaceHandleAvailable ? (
														<span className="available">
															will be your domain
														</span>
													) : (
														<span className="unavailable">
															is already taken
														</span>
													)}
												</>
											))}
									</div>
								</div>

								<div className="workspaceTypeContainer">
									<p className="question">Your workspace type?</p>
									<Tooltip
										open={workspaceTypeContainerOpen}
										trigger={[]}
										title={
											<WorkspaceTypeOptions
												width={workspaceTypeContainerWidth}
												handleSetWorkspaceType={handleSetWorkspaceType}
												searchTerm={info?.workspaceType}
												setWorkspaceTypeContainerOpen={
													setWorkspaceTypeContainerOpen
												}
											/>
										}
										placement="bottom"
										color={'transparent'}
									>
										<div className="workspaceTypeInputContainer">
											<input
												type="text"
												placeholder="Type to search"
												className="workspaceTypeInput"
												value={info?.workspaceType}
												onChange={handleWorkspaceTypeInput}
											/>
											{/* <div className="workspaceTypeDropdown">
											<div className="labelContainer">
												<DownArrow />
											</div>
										</div> */}
										</div>
									</Tooltip>
								</div>
							</div>
							<div className="themeInputContainer">
								<p className="question">How do you want things to look?</p>
								<div className="themeOptionsContainer">
									{themePreferences.map((theme) => (
										<div
											key={theme.id}
											className={`themeOption ${
												info?.themePreference === theme.value
													? 'active'
													: ''
											}`}
											onClick={() => handleSetThemePreference(theme.value)}
										>
											{theme.icon}
											<span className="themeOptionLabel">{theme.label}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>
			<div className="btnsContainer">
				<button
					style={{
						opacity: continueBtnDisabled ? 0.4 : 1,
						cursor: continueBtnDisabled ? 'not-allowed' : 'pointer',
					}}
					disabled={continueBtnDisabled}
					className="continueBtn"
					onClick={handleContinue}
				>
					Continue
				</button>
			</div>
		</>
	);
};

export default memo(Stages);
