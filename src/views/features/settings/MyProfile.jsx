import React, { useState, useEffect, useContext } from 'react';
import jwt_decode from 'jwt-decode';
import '../../../assets/scss/AccountSettings/myProfile.scss';
import Context from '../../../context/context';
// import { collapseToast, useToast } from 'react-toastify';
import validator from 'validator';
import ProfileDetailsComponent from '../../components/settings/profile/ProfileDetails';
import ThemePreferenceComponent from '../../components/settings/profile/ThemePreference';
import UpdatePasswordComponent from '../../components/settings/profile/UpdatePassword';
import TwoFactorAuthenticationComponent from '../../components/settings/profile/TwoFactorAuthentication';
import LeaveWorkspaceComponent from '../../components/settings/profile/LeaveWorkspace';

const MyProfile = () => {
	const {
		profileInfo: {
			getTenantSettings,
			getUserDetails,
			getTenantUserDetails,
			get2FAQrCode,
			set2FASettings,
			userDetailsData,
			updateUserDetails,
			qrcode,
			getUserWorkSpaceList,
			userWorkSpaceList,
			chooseDefaultWorkspace,
			tennantSettingsData,
			updateUserLogo,
		},
	} = useContext(Context);
	const [showForm, setShowForm] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [errors, setErrors] = useState({});
	const [activeTheme, setActiveTheme] = useState('light');
	const [activeWorkspace, setActiveWorkspace] = useState(null);
	const [userDetails, setUserDetails] = useState({
		fullName: '',
		email: '',
		phoneNumber: '',
		is2FAEnabled: '',
		logoURL: '',
	});

	const [isAdmin, setIsAdmin] = useState(false);
	const [activeItem, setActiveItem] = useState('profile');

	const handleNavigation = (id) => {
		setActiveItem(id);
		document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
	};
	useEffect(() => {
		if (userWorkSpaceList && userWorkSpaceList.length > 0) {
			setActiveWorkspace(userWorkSpaceList?.[0].tenant_id);
		}
	}, [userWorkSpaceList]);

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
		if (userDetails.is2FAEnabled) {
			get2FAQrCode();
		}
	}, [userDetails.is2FAEnabled]);

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		const timeOut = setTimeout(() => {
			if (userDetails?.fullName && isEditMode) {
				handleSubmit();
			}
		}, 800);

		return () => {
			clearTimeout(timeOut);
		};
	}, [userDetails?.fullName]);

	// const handleDebounceSearch = useCallback(() => {
	// 	clearInterval(info?.timeout);
	// 	const timeout = setTimeout(() => {
	// 		if (userDetails?.fullName && isEditMode) {
	// 			handleSubmit();
	// 		}
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			timeout: null,
	// 		}));
	// 	}, 800);
	// 	setInfo((prev) => ({ ...prev, timeout }));
	// }, [info?.timeout, info?.searchValue, info?.searchValueChanged]);

	const fetchData = async () => {
		let usertoken = localStorage.getItem('usertoken');
		let decoded = jwt_decode(usertoken);
		let workspaceID = localStorage.getItem('workspaceId');
		let role = atob(localStorage.getItem(`userRole::${workspaceID}::${decoded.user_id}`));
		setIsAdmin(role === 'admin');
		if (!tennantSettingsData) {
			getTenantSettings();
		}
		if (!userDetailsData) {
			getUserDetails();
		}
		if (!userWorkSpaceList) {
			getUserWorkSpaceList();
		}
		getTenantUserDetails();
	};

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

	const handlehandleDefaultWorkspace = (data) => {
		setActiveWorkspace(data?.tenant_id);
		chooseDefaultWorkspace(data);
	};

	const handleChange = (e) => {
		if (!isEditMode) setIsEditMode(true);
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

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setUserDetails({
					...userDetails,
					logoURL: reader.result,
				});
			};
			reader.readAsDataURL(file);
			updateUserLogo(file);
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

	const handleSubmit = () => {
		if (validate()) {
			setIsEditMode(false);
		}
		let json = {
			firstName: userDetails.fullName,
			lastName: userDetails.fullName,
		};
		updateUserDetails(json);
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
						handleImageChange={handleImageChange}
						handlePopupFormClose={handlePopupFormClose}
					/>
				</div>

				{/* Theme Preference */}
				<div className="settingsTheme activeBackgroundColor" id="theme">
					<ThemePreferenceComponent
						setActiveTheme={setActiveTheme}
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

export default MyProfile;
