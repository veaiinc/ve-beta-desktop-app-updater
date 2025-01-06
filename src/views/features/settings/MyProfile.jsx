import React, { useState, useEffect, useContext, useCallback, memo, useRef } from 'react';
import '../../../assets/scss/settings/myProfile.scss';
import Context from '../../../context/context';
import validator from 'validator';
import ProfileDetailsComponent from '../../components/settings/profile/ProfileDetails';
import ThemePreferenceComponent from '../../components/settings/profile/ThemePreference';
import UpdatePasswordComponent from '../../components/settings/profile/UpdatePassword';
import TwoFactorAuthenticationComponent from '../../components/settings/profile/TwoFactorAuthentication';
import LeaveWorkspaceComponent from '../../components/settings/profile/LeaveWorkspace';
import { message } from 'antd';

const MyProfile = () => {
	const fullNameRef = useRef(null);
	// # Context
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
		companyInfo: { updatePrefernces, getTenantPreferences, tenantPreferenceData },
		authInfo: { updateUserDetails },
	} = useContext(Context);

	// # States
	const [showForm, setShowForm] = useState(false);
	const [isEditMode, setIsEditMode] = useState({ isValueChanged: false, timeout: null });
	const [errors, setErrors] = useState({});
	const [activeTheme, setActiveTheme] = useState('dark');
	const [userDetails, setUserDetails] = useState({
		fullName: '',
		email: '',
		phoneNumber: '',
		is2FAEnabled: '',
		logoURL: '',
		cropSettings: { crop: { x: 0, y: 0 }, zoom: 1 },
	});
	const [usernameUpdateLoader, setUsernameUpdateLoader] = useState(false);
	const [initialState, setInitialState] = useState({ ...userDetails });

	const [logoFile, setlogoFile] = useState(null);

	// # Useeffects
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
		if (tenantPreferenceData) {
			setActiveTheme(tenantPreferenceData?.theme);
		}
	}, [tenantPreferenceData?.theme]);

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
		let error;
		const stringValue = value || '';
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
		let firstNameWithSpace = false;
		if (username?.includes(' ') && username?.split(' ')[1]?.length === 0) {
			firstNameWithSpace = true;
		}

		const firstName = username?.split(' ')[0];
		const lastName = username?.split(' ')[1];
		const capitalizedFirstName = firstName
			? firstName?.charAt(0)?.toUpperCase() + firstName?.slice(1)
			: '';
		if (lastName) {
			const capitalizedLastName = lastName
				? lastName?.charAt(0)?.toUpperCase() + lastName?.slice(1)
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
	const updateUserName = async (formattedName) => {
		if (usernameUpdateLoader) return;
		setUsernameUpdateLoader(true);
		try {
			const response = await updateUserDetails(formattedName);
			if (response?.[0] === true) {
				message?.success('Name updated successfully');
			}
		} catch (error) {
			message?.error('Name update failed');
		} finally {
			setUsernameUpdateLoader(false);
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

		if (type === 'phoneNumber') {
			if (!validator.isMobilePhone(value, 'any', { strictMode: true })) {
				return setErrors((prev) => ({ ...prev, phoneNumber: 'Phone Number is invalid' }));
			}
			const response = await updateUserDetails('', value);
			if (response[0] === true) {
				message.success('Phone Number updated successfully');
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
			message?.success('Username Updated');
			// updateUserDetailsState(json);
		} else if (nameApi === 'phone' && !validateField('phoneNumber', userDetails?.phoneNumber)) {
			let json = {
				phoneNumber: userDetails?.phoneNumber,
			};
			const response = await updateUserPhoneNumber(json);

			if (response[0] !== true)
				return setErrors((prev) => ({ ...prev, phoneNumber: response[1]?.message }));

			updateUserDetailsState(json);
		}
	};

	const updateThemeSubmitHandler = async (mode) => {
		const json = {
			theme: mode,
		};
		const response = await updatePrefernces(json);
		if (response[0]) {
			setActiveTheme(mode);
		}
	};

	return (
		<div className="myProfileComponent">
			<div className="settingsContainer">
				{/* Settings Profile details  */}

				<div className="ProfileDetailsComponent activeBackgroundColor" id="profile">
					<ProfileDetailsComponent
						fullNameRef={fullNameRef}
						handleSubmit={handleSubmit}
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
						activeTheme={activeTheme}
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

				{/* Temporary Hide */}
				<div className={'accessSettingsContainer'} id="leaveworkspace">
					<LeaveWorkspaceComponent />
				</div>
			</div>
		</div>
	);
};

export default memo(MyProfile);
