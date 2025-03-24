import React, { useState, useEffect, useContext, useCallback, memo, useRef } from 'react';
import '../../../assets/scss/settings/myProfile.scss';
import Context from '../../../context/context';
import validator from 'validator';
import ProfileDetailsComponent from '../../components/settings/profile/ProfileDetails';
import ThemePreferenceComponent from '../../components/settings/profile/ThemePreference';
import UpdatePasswordComponent from '../../components/settings/profile/UpdatePassword';
import TwoFactorAuthenticationComponent from '../../components/settings/profile/TwoFactorAuthentication';
import LeaveWorkspaceComponent from '../../components/settings/profile/LeaveWorkspace';
import Notifications from '../../components/settings/profile/Notifications';
import { message } from 'antd';
import Cookies from 'js-cookie';

const MyProfile = () => {
	const fullNameRef = useRef(null);
	const {
		profileInfo: {
			get2FAQrCode,
			set2FASettings,
			userDetailsData,
			updateUserPhoneNumber,
			qrcode,
			updateUserLogo,
			getTenantUserDetails,
			tenantUserDetails,
			updateUserDetailsState,
		},
		companyInfo: { getTenantPreferences, tenantPreferenceData },
		themeInfo: { theme, updateTheme },
		authInfo: { updateUserDetails },
	} = useContext(Context);
	// # States
	const [showForm, setShowForm] = useState(false);
	const [isEditMode, setIsEditMode] = useState({ isValueChanged: false, timeout: null });
	const [errors, setErrors] = useState({});

	const [userDetails, setUserDetails] = useState({
		fullName: '',
		email: '',
		phoneNumber: '',
		is2FAEnabled: '',
		logoURL: '',
		cropSettings: { crop: { x: 0, y: 0 }, zoom: 1 },
	});
	const [initialState, setInitialState] = useState({ ...userDetails });

	const [logoFile, setlogoFile] = useState(null);

	useEffect(() => {
		if (!tenantPreferenceData) {
			getTenantPreferences();
		}
		if (!tenantUserDetails) {
			getTenantUserDetails();
		}
	}, []);

	useEffect(() => {
		if (userDetailsData) {
			const firstName = userDetailsData?.firstName || '';
			const lastName = userDetailsData?.lastName || '';
			setUserDetails((prev) => ({
				...prev,
				fullName: firstName + ' ' + lastName,
				email: userDetailsData?.email || '',
				phoneNumber: userDetailsData?.phoneNumber || '',
				is2FAEnabled: userDetailsData?.is2FAEnabled || false,
				logoURL: userDetailsData?.dp_s3_500w_key || '',
				cropSettings: userDetailsData?.dp_style || { crop: { x: 0, y: 0 }, zoom: 1 },
			}));
			setInitialState((prev) => ({
				...prev,
				fullName: firstName + ' ' + lastName,
				email: userDetailsData?.email || '',
				phoneNumber: userDetailsData?.phoneNumber || '',
				is2FAEnabled: userDetailsData?.is2FAEnabled || false,
				logoURL: userDetailsData?.dp_s3_500w_key || '',
				cropSettings: userDetailsData?.dp_style || { crop: { x: 0, y: 0 }, zoom: 1 },
			}));
		}
	}, [userDetailsData]);

	useEffect(() => {
		if (userDetails.is2FAEnabled) {
			get2FAQrCode();
		}
	}, [userDetails.is2FAEnabled]);

	useEffect(() => {
		if (userDetails?.fullName) {
			handleDebounceSearch('name');
		}
	}, [userDetails?.fullName]);

	useEffect(() => {
		if (userDetails?.phoneNumber) {
			handleDebounceSearch('phone');
		}
	}, [userDetails?.phoneNumber]);

	// # Functions
	const handleDebounceSearch = useCallback(
		(typeCall = '') => {
			clearInterval(isEditMode?.timeout);
			const timeout = setTimeout(() => {
				if (isEditMode?.isValueChanged || typeCall === 'name') {
					handleSubmit(typeCall);
				}
				setIsEditMode((prev) => ({ ...prev, timeout: null }));
			}, 800);
			setIsEditMode((prev) => ({ ...prev, timeout }));
		},
		[isEditMode?.timeout, userDetails?.fullName, userDetails?.phoneNumber],
	);

	const handleFormPopUp = () => {
		setShowForm(true);
	};
	const handlePopupFormClose = () => {
		setShowForm(false);
	};
	const toggleEnable = async (e) => {
		setUserDetails((prevState) => ({
			...prevState,
			is2FAEnabled: !prevState.is2FAEnabled,
		}));
		await set2FASettings(e);
	};

	const validateField = (name, value) => {
		let error = '';
		const stringValue = value ?? '';
		switch (name) {
			case 'fullName':
				if (validator.isEmpty(stringValue)) {
					error = 'First Name is required';
				} else if (initialState?.fullName === stringValue) {
					error = 'Name cannot be the same as the current one';
				}
				break;

			case 'phoneNumber':
				if (!validator.isMobilePhone(stringValue, 'any', { strictMode: true })) {
					error = 'Phone Number is invalid';
				} else if (initialState.phoneNumber === stringValue) {
					error = 'Phone Number is already in use';
				}
				break;
			case 'email':
				if (validator.isEmpty(stringValue)) {
					error = 'Email is required';
				} else if (!validator.isEmail(stringValue)) {
					error = 'Email is invalid';
				}
				break;
			default:
				break;
		}
		return error;
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

			setUserDetails((prevDetails) => ({
				...prevDetails,
				fullName: formattedName,
			}));
		} else {
			const formattedName = capitalizedFirstName;
			setUserDetails((prevDetails) => ({
				...prevDetails,
				fullName: firstNameWithSpace ? username : formattedName,
			}));
		}
	};

	const handleUsernameAndPhoneNumberUpdate = async ({ type, value }) => {
		if (type === 'fullName') {
			if (value === '') {
				message.error('Name cannot be empty');
				setUserDetails((prev) => ({ ...prev, fullName: '' }));
				return;
			}
			formatUsername(fullNameRef?.current?.value);
		}

		if (
			type === 'phoneNumber' &&
			!validateField('phoneNumber', value) &&
			value !== initialState?.phoneNumber
		) {
			const response = await updateUserDetails('', value);
			if (response[0] === true) {
				message.success('Phone Number updated successfully');
			} else {
				setErrors((prev) => ({ ...prev, phoneNumber: response[1]?.message }));
			}
		}
	};

	const updateProfileImage = async (settings) => {
		let json = {
			dp_style: settings,
		};
		const response = await updateUserDetails(json);

		if (response[0]) {
			setUserDetails((prev) => ({ ...prev, cropSettings: settings }));
			updateUserLogo(logoFile);
		}
	};

	const updateDpThemeHandler = async (color) => {
		let json = {
			dp_style: {
				...userDetails?.cropSettings,
				profileDpColor: color,
			},
		};

		const response = await updateUserDetails(json);
		if (response[0]) {
			updateUserDetailsState({
				...json.dp_style,
			});
		}
	};

	const validate = () => {
		const newErrors = {};
		Object.keys(userDetails).forEach((key) => {
			const error = validateField(key, userDetails[key]);
			if (error) {
				newErrors[key] = error;
			}
		});
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (nameApi = 'name') => {
		if (nameApi === 'name') {
			const response = await updateUserDetails(userDetails?.fullName);
			if (response[0] !== true)
				return setErrors((prev) => ({ ...prev, fullName: response[1]?.message }));
		} else if (nameApi === 'phone' && !validateField('phoneNumber', userDetails?.phoneNumber)) {
			const response = await updateUserDetails('', userDetails?.phoneNumber);
			if (response[0] !== true)
				return setErrors((prev) => ({ ...prev, phoneNumber: response[1]?.message }));
		}
	};

	// const updateThemeSubmitHandler = async (mode) => {
	// 	const json = {
	// 		theme: mode,
	// 	};
	// 	const response = await updatePrefernces(json);
	// 	if (response[0]) {
	// 		setActiveTheme(mode);
	// 	}
	// };
	const updateThemeSubmitHandler = async (theme) => {
		updateTheme(theme);
	};

	const handleThemeChange = (selectedTheme) => {
		updateThemeSubmitHandler(selectedTheme);
	};

	return (
		<div className="myProfileComponent">
			<div className="settingsContainer">
				{/* Settings Profile details  */}

				<div className="ProfileDetailsComponent activeBackgroundColor" id="profile">
					<ProfileDetailsComponent
						fullNameRef={fullNameRef}
						userDetails={userDetails}
						errors={errors}
						handleUsernameAndPhoneNumberUpdate={handleUsernameAndPhoneNumberUpdate}
						userDetailsData={userDetailsData}
						showForm={showForm}
						updateProfileImage={updateProfileImage}
						handlePopupFormClose={handlePopupFormClose}
						role={tenantUserDetails?.role === 'admin' ? 'Admin' : 'Member'}
						setUserDetails={setUserDetails}
						setlogoFile={setlogoFile}
						updateDpThemeHandler={updateDpThemeHandler}
					/>
				</div>

				{/* Theme Preference */}
				{/* <div className="settingsTheme activeBackgroundColor" id="theme">
					<ThemePreferenceComponent
						updateThemeSubmitHandler={updateThemeSubmitHandler}
						activeTheme={theme}
					/>
				</div> */}

				{/* Access Settings */}
				{/* <div className={'accessSettingsContainer'} id="updatepassword">
					<UpdatePasswordComponent handleFormPopUp={handleFormPopUp} />
				</div> */}

				{/* Settings Two Factor Authentication */}
				{/* <div className="settingsTwoFactorAuthentication" id="twoFactorAuth">
					<TwoFactorAuthenticationComponent
						toggleEnable={toggleEnable}
						userDetails={userDetails}
						qrcode={qrcode}
					/>
				</div> */}
				<div className="theme-container">
					<div className="theme-container-item">
						<p>Change Theme</p>
						<div className="theme-container-item-content">
							<p
								onClick={() => handleThemeChange('light')}
								className={theme === 'light' ? 'active' : ''}
								style={{ cursor: 'pointer' }}
							>
								Light Mode
							</p>
							<span className="theme-container-item-content-separator">|</span>
							<p
								onClick={() => handleThemeChange('dark')}
								className={theme === 'dark' ? 'active' : ''}
								style={{ cursor: 'pointer' }}
							>
								Dark Mode
							</p>
						</div>
					</div>
				</div>
				{/* Temporary Hide */}
				<Notifications />

				<div className="danger-zone">
					<div className="danger-zone-header">
						<p className="danger-zone-title">DANGER ZONE</p>
					</div>
					<div className={'accessSettingsContainer'} id="leaveworkspace">
						<LeaveWorkspaceComponent />
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(MyProfile);
