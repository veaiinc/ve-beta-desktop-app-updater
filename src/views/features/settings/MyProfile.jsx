import React, { useState, useEffect, useContext, useCallback, memo } from 'react';
import '../../../assets/scss/AccountSettings/myProfile.scss';
import Context from '../../../context/context';
import validator from 'validator';
import ProfileDetailsComponent from '../../components/settings/profile/ProfileDetails';
import ThemePreferenceComponent from '../../components/settings/profile/ThemePreference';
import UpdatePasswordComponent from '../../components/settings/profile/UpdatePassword';
import TwoFactorAuthenticationComponent from '../../components/settings/profile/TwoFactorAuthentication';
import LeaveWorkspaceComponent from '../../components/settings/profile/LeaveWorkspace';

const MyProfile = () => {
	// # Context
	const {
		profileInfo: {
			get2FAQrCode,
			set2FASettings,
			userDetailsData,
			updateUserDetails,
			updateUserPhoneNumber,
			qrcode,
			updateUserLogo,
			getTenantUserDetails,
			tenantUserDetails,
		},
		companyInfo: { updatePrefernces, getTenantPreferences, tenantPreferenceData },
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
	});

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
			setUserDetails((prev) => ({
				...prev,
				fullName: userDetailsData?.firstName || '',
				email: userDetailsData?.email || '',
				phoneNumber: userDetailsData?.phoneNumber || '',
				is2FAEnabled: userDetailsData?.is2FAEnabled || false,
				logoURL: userDetailsData?.dp_s3_500w_key || '',
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
				if (userDetails?.fullName && isEditMode?.isValueChanged && typeCall === 'name') {
					handleSubmit(typeCall);
				} else if (
					userDetails?.phoneNumber &&
					isEditMode?.isValueChanged &&
					typeCall === 'phone'
				) {
					handleSubmit(typeCall);
				}
				setIsEditMode((prev) => ({ ...prev, timeout: null }));
			}, 1500);
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
				}
				break;

			case 'phoneNumber':
				if (validator.isEmpty(stringValue)) {
					error = 'Phone Number is required';
				} else if (!validator.isMobilePhone(stringValue, 'any', { strictMode: false })) {
					error = 'Phone Number is invalid';
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

	const handleChange = (e) => {
		if (!isEditMode?.isValueChanged)
			setIsEditMode((prev) => ({ ...prev, isValueChanged: true }));
		const { name, value } = e.target;
		setUserDetails((prevDetails) => ({
			...prevDetails,
			[name]: value,
		}));

		const error = validateField(name, value);
		setErrors({
			...errors,
			[name]: error,
		});
	};

	const updateProfileImage = () => {
		updateUserLogo(userDetails?.logoURL);
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
		if (!validate()) return;

		if (nameApi === 'name') {
			let json = {
				firstName: userDetails.fullName,
				lastName: userDetails.fullName,
			};
			const response = await updateUserDetails(json);

			if (response[0] !== true)
				setErrors((prev) => ({ ...prev, fullName: response[1]?.message }));
		} else if (nameApi === 'phone') {
			let json = {
				phoneNumber: userDetails?.phoneNumber,
			};
			const response = await updateUserPhoneNumber(json);

			if (response[0] !== true)
				setErrors((prev) => ({ ...prev, phoneNumber: response[1]?.message }));
		}
	};

	const updateThemeSubmitHandler = (mode) => {
		const json = {
			theme: mode,
		};
		setActiveTheme(mode);
		updatePrefernces(json);
	};

	return (
		<div className="myProfileComponent">
			<div className="settingsContainer">
				{/* Settings Profile details  */}

				<div className="ProfileDetailsComponent activeBackgroundColor" id="profile">
					<ProfileDetailsComponent
						handleSubmit={handleSubmit}
						userDetails={userDetails}
						errors={errors}
						handleChange={handleChange}
						userDetailsData={userDetailsData}
						showForm={showForm}
						updateProfileImage={updateProfileImage}
						handlePopupFormClose={handlePopupFormClose}
						role={tenantUserDetails?.role === 'admin' ? 'Admin' : 'Member'}
						setUserDetails={setUserDetails}
					/>
				</div>

				{/* Theme Preference */}
				<div className="settingsTheme activeBackgroundColor" id="theme">
					<ThemePreferenceComponent
						updateThemeSubmitHandler={updateThemeSubmitHandler}
						activeTheme={activeTheme}
					/>
				</div>

				{/* Access Settings */}
				<div className={'accessSettingsContainer'} id="updatepassword">
					<UpdatePasswordComponent handleFormPopUp={handleFormPopUp} />
				</div>

				{/* Settings Two Factor Authentication */}
				<div className="settingsTwoFactorAuthentication" id="twoFactorAuth">
					<TwoFactorAuthenticationComponent
						toggleEnable={toggleEnable}
						userDetails={userDetails}
						qrcode={qrcode}
					/>
				</div>

				<div className={'accessSettingsContainer'} id="leaveworkspace">
					<LeaveWorkspaceComponent />
				</div>
			</div>
		</div>
	);
};

export default memo(MyProfile);
