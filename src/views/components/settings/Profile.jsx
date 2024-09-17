import React, { useState, useEffect, useContext } from 'react';
import jwt_decode from 'jwt-decode';
import '../../../assets/scss/AccountSettings/myProfile.scss';
import Context from '../../../context/context';
import InputForModules from '../../components/input/inputForModules';
// import { collapseToast, useToast } from 'react-toastify';
import validator from 'validator';
import { getInitials } from '../../features/profile_settings/getInitials';
import ToggleSlider from '../../components/input/slider';
import ReusableButtonSettings from '../../features/workspace_settings/ReusableButtonSettings';
import MySettingsChangePasword from '../../features/profile_settings/MySettingsChangePasword';

// profile details component
export const ProfileDetailsComponent = ({
	handleSubmit,
	handleEditClick,
	isEditMode,
	userDetails,
	errors,
	handleChange,
	userDetailsData,
	showForm,
	handleImageChange,
	handlePopupFormClose,
}) => {
	return (
		<>
			<form onSubmit={handleSubmit} className={`${'formsMain'} `}>
				<div className={'profileMain'}>
					<h1>My Profile</h1>
					<p
						onClick={handleEditClick}
						className={isEditMode ? 'saveButton' : ''}
						style={{ cursor: 'pointer' }}
					>
						{isEditMode ? 'Save Changes' : 'Edit'}
					</p>
				</div>
				<div className={`${'formContainerMain'} ${isEditMode ? 'formsEdit' : ''}`}>
					<div className={'profileImgName'}>
						<div className={'profileImgContainerMain'}>
							<input
								type="file"
								id="profilePicture"
								name="profilePicture"
								onChange={handleImageChange}
								style={{ display: 'none' }}
							/>

							<label htmlFor="profilePicture">
								{userDetails?.logoURL ? (
									<img src={userDetails?.logoURL} alt="logo" />
								) : (
									<div>
										{getInitials(
											userDetailsData?.firstName,

											userDetailsData?.lastName,
										)}
									</div>
								)}
							</label>
						</div>
						<div className={'fullName'}>
							<InputForModules
								label={'Full Name'}
								type={'text'}
								placeholder={'Enter your Full Name'}
								name={'fullName'}
								value={userDetails?.fullName || ''}
								onChange={handleChange}
								isError={false}
								errorMessage={''}
								disabled={!isEditMode}
							/>
						</div>
					</div>

					<div>
						{/* <label>Phone Number</label> */}

						<InputForModules
							label={'Phone Number'}
							type={'phoneNumber'}
							placeholder={'Enter your Phone Number'}
							name={'phoneNumber'}
							value={userDetails?.phoneNumber}
							onChange={handleChange}
							isError={false}
							errorMessage={''}
							disabled={true}
							defaultCountry={'IN'}
						/>

						{errors.phoneNumber && <p className={'error'}>{errors.phoneNumber}</p>}
					</div>

					<div>
						<InputForModules
							label={'Email'}
							type={'email'}
							placeholder={'Enter your Email'}
							name={'email'}
							value={userDetails?.email}
							onChange={(e) => handleChange(e)}
							isError={false}
							errorMessage={''}
							disabled={true}
						/>
						{errors.email && <p className={'error'}>{errors.email}</p>}
						<label>Email Address cannot be changed once set</label>
					</div>
				</div>
			</form>

			{showForm && (
				<MySettingsChangePasword showForm={showForm} onClose={handlePopupFormClose} />
			)}
		</>
	);
};
// profile details component
export const Test = ({
	handleSubmit,
	handleEditClick,
	isEditMode,
	userDetails,
	errors,
	handleChange,
	userDetailsData,
	showForm,
	handleImageChange,
	handlePopupFormClose,
}) => {
	return (
		<>
			<form onSubmit={handleSubmit} className={`${'formsMain'} `}>
				<div className="profileHeader">
					<div className="imageCircleDiv">
						{!userDetails?.logoURL ? (
							<img
								src={userDetails?.logoURL}
								alt="logo"
								onError={(e) =>
									(e.target.src =
										'https://randomuser.me/api/portraits/men/75.jpg')
								}
							/>
						) : (
							<div className="noImageText">
								{getInitials(
									userDetailsData?.firstName,

									userDetailsData?.lastName,
								)}
							</div>
						)}

						<div className="editImage">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="15"
								viewBox="0 0 15 14"
								fill="none"
							>
								<path
									d="M3.85354 9.81771H4.41632L9.39683 4.87207L8.83405 4.31323L3.85354 9.25886V9.81771ZM3.19531 10.4713V8.98334L9.4943 2.71878C9.5624 2.64973 9.63569 2.60058 9.71417 2.57134C9.79265 2.54201 9.87489 2.52734 9.96088 2.52734C10.047 2.52734 10.1291 2.54104 10.2073 2.56845C10.2856 2.59585 10.3615 2.64437 10.4348 2.714L11.0025 3.27285C11.0727 3.34567 11.1223 3.42108 11.1515 3.4991C11.1807 3.57711 11.1953 3.65743 11.1953 3.74006C11.1953 3.82813 11.18 3.91218 11.1492 3.9922C11.1184 4.07223 11.0695 4.14539 11.0025 4.21167L4.69379 10.4713H3.19531ZM9.1105 4.59756L8.83405 4.31323L9.39683 4.87207L9.1105 4.59756Z"
									fill="#E8EAED"
								/>
							</svg>
						</div>
					</div>
					<div className="details">
						<div>
							<div className="full_name_div">
								<p>{userDetails?.fullName || ''}</p>

								<span className="point"></span>
								<p className="role">{userDetails?.fullName || ''}</p>
							</div>

							<p>{userDetails?.email}</p>
						</div>
					</div>
				</div>
			</form>

			{showForm && (
				<MySettingsChangePasword showForm={showForm} onClose={handlePopupFormClose} />
			)}
		</>
	);
};

// theme preference component
export const ThemePreferenceComponent = ({ setActiveTheme, activeTheme }) => {
	return (
		<div className={'themeMain'}>
			<h4>Theme performance</h4>
			<div>
				<button
					className={activeTheme === 'system' ? 'activeButton' : ''}
					onClick={() => setActiveTheme('system')}
				>
					Follow system preferences
				</button>
				<button
					className={activeTheme === 'light' ? 'activeButton' : ''}
					onClick={() => setActiveTheme('light')}
				>
					Light
				</button>
				<button
					className={activeTheme === 'dark' ? 'activeButton' : ''}
					onClick={() => setActiveTheme('dark')}
				>
					Dark
				</button>
			</div>
		</div>
	);
};

// update password component
export const UpdatePasswordComponent = () => {
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
	const fetchData = async () => {
		// let usertoken = localStorage.getItem('usertoken');
		// let decoded = jwt_decode(usertoken);
		// let workspaceID = localStorage.getItem('workspaceId');
		// let role = atob(localStorage.getItem(`userRole::${workspaceID}::${decoded.user_id}`));
		// setIsAdmin(role === 'admin');
		// if (!tennantSettingsData) {
		// 	getTenantSettings();
		// }
		// if (!userDetailsData) {
		// 	getUserDetails();
		// }
		// if (!userWorkSpaceList) {
		// 	getUserWorkSpaceList();
		// }
		// getTenantUserDetails();
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

	const handleTheme = (activeName) => {
		setActiveTheme(activeName);
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

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validate()) {
			setIsEditMode(false);
			let json = {
				firstName: userDetails.fullName,
				lastName: userDetails.fullName,
			};
			updateUserDetails(json);
		}
	};

	const handleEditClick = () => {
		if (isEditMode) {
			handleSubmit(new Event('submit'));
		} else {
			setIsEditMode(true);
		}
	};
	return (
		<div className={'accessContainer'}>
			<div className={'accessInfo'}>
				<h4>Strengthen your Account Security</h4>
				<p>
					As you've signed up through Google, we suggest adding a password for extra
					security.
				</p>
				{/* <button>Update my password</button> */}
				<ReusableButtonSettings
					text={'Update my password'}
					func={() => handleFormPopUp()}
				/>
			</div>
		</div>
	);
};

export const TwoFactorAuthenticationComponent = () => {
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
	const fetchData = async () => {
		// let usertoken = localStorage.getItem('usertoken');
		// let decoded = jwt_decode(usertoken);
		// let workspaceID = localStorage.getItem('workspaceId');
		// let role = atob(localStorage.getItem(`userRole::${workspaceID}::${decoded.user_id}`));
		// setIsAdmin(role === 'admin');
		// if (!tennantSettingsData) {
		// 	getTenantSettings();
		// }
		// if (!userDetailsData) {
		// 	getUserDetails();
		// }
		// if (!userWorkSpaceList) {
		// 	getUserWorkSpaceList();
		// }
		// getTenantUserDetails();
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

	const handleTheme = (activeName) => {
		setActiveTheme(activeName);
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

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validate()) {
			setIsEditMode(false);
			let json = {
				firstName: userDetails.fullName,
				lastName: userDetails.fullName,
			};
			updateUserDetails(json);
		}
	};

	const handleEditClick = () => {
		if (isEditMode) {
			handleSubmit(new Event('submit'));
		} else {
			setIsEditMode(true);
		}
	};
	return (
		<div className={'twoFactorAuthMain'}>
			<div className={'twoFactorAuthText'}>
				<h4>Two Factor Authentication</h4>
				<p>
					Boost your account security effortlessly with two-factor authentication (2FA).
					Simply use your password along with a code from your phone or an app. This extra
					step makes it tough for hackers to break in, ensuring your peace of mind.
				</p>
			</div>
			<div className={'switchStep'}>
				<div className={'switchToggle'}>
					<p>Enable Two Factor Authentication</p>
					<ToggleSlider onChange={toggleEnable} value={userDetails?.is2FAEnabled} />
				</div>

				{userDetails?.is2FAEnabled ? (
					<div className={'toggleOptions'}>
						<div className={`${'step'} ${'stepOne'}`}>
							<h4>STEP 1</h4>
							<p>Install an authenticator app on your mobile device</p>
						</div>
						<div className={`${'step'} ${'stepTwo'}`}>
							<h4>STEP 2</h4>
							<div>
								<p>Scan the following QR code in your authenticator app</p>

								<img src={qrcode?.qrCode} alt="" />
							</div>
						</div>
						<div className={`${'step'} `}>
							<h4>STEP 3</h4>
							<div className={'stepThree'}>
								<p>Enter the code from your authenticator app below</p>
								<input placeholder="Enter Authentication App Password here.." />
							</div>
						</div>
						<div className={`${'step'}`}>
							<h4>STEP 4</h4>
							<div className={'stepFour'}>
								<p>Install an authenticator app on your mobile device</p>
								<input placeholder="Enter Authentication App Password here.." />
							</div>
						</div>
					</div>
				) : (
					''
				)}
			</div>
		</div>
	);
};

export const LeaveWorkspaceComponent = () => {
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
	const fetchData = async () => {
		// let usertoken = localStorage.getItem('usertoken');
		// let decoded = jwt_decode(usertoken);
		// let workspaceID = localStorage.getItem('workspaceId');
		// let role = atob(localStorage.getItem(`userRole::${workspaceID}::${decoded.user_id}`));
		// setIsAdmin(role === 'admin');
		// if (!tennantSettingsData) {
		// 	getTenantSettings();
		// }
		// if (!userDetailsData) {
		// 	getUserDetails();
		// }
		// if (!userWorkSpaceList) {
		// 	getUserWorkSpaceList();
		// }
		// getTenantUserDetails();
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

	const handleTheme = (activeName) => {
		setActiveTheme(activeName);
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

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validate()) {
			setIsEditMode(false);
			let json = {
				firstName: userDetails.fullName,
				lastName: userDetails.fullName,
			};
			updateUserDetails(json);
		}
	};

	const handleEditClick = () => {
		if (isEditMode) {
			handleSubmit(new Event('submit'));
		} else {
			setIsEditMode(true);
		}
	};
	return (
		<div className={'accessContainer'}>
			<div className={'leaveComponent'}>
				<h4>Do you want to leave your workspace?</h4>
				<p>
					When you leave your workspace, your work will be lost, and your team will be
					notified. Select a workspace you would like to leave
				</p>
			</div>
		</div>
	);
};
