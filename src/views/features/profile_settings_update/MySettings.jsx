import React, { useState, useEffect, useContext } from 'react';
import jwt_decode from 'jwt-decode';
import '../../../assets/scss/profileSettings/mySettings.scss';
import Context from '../../../context/context';
import InputForModules from '../../components/input/inputForModules';
import ToggleSlider from '../../components/input/slider';
// import { collapseToast, useToast } from 'react-toastify';
import ReusableButtonSettings from '../workspace_settings/ReusableButtonSettings';
import validator from 'validator';
import MySettingsChangePasword from './MySettingsChangePasword';
import { getInitials } from './getInitials';

const MySettings = () => {
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
		<div className="myProfileSettings">
			<div className="settingsContainer">
				{/* Settings Profile details  */}

				<div className="settingProfileDetails" id="profile">
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
										value={userDetails?.fullName}
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

								{errors.phoneNumber && (
									<p className={'error'}>{errors.phoneNumber}</p>
								)}
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
				</div>

				{/* Settings Two Factor Authentication */}

				<div className="settingsTwoFactorAuthentication" id="twoFactorAuth">
					<div className={'twoFactorAuthMain'}>
						<div className={'twoFactorAuthText'}>
							<h4>Two Factor Authentication</h4>
							<p>
								Boost your account security effortlessly with two-factor
								authentication (2FA). Simply use your password along with a code
								from your phone or an app. This extra step makes it tough for
								hackers to break in, ensuring your peace of mind.
							</p>
						</div>
						<div className={'switchStep'}>
							<div className={'switchToggle'}>
								<p>Enable Two Factor Authentication</p>
								<ToggleSlider
									onChange={toggleEnable}
									value={userDetails?.is2FAEnabled}
								/>
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
											<p>
												Scan the following QR code in your authenticator app
											</p>

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
											<p>
												Install an authenticator app on your mobile device
											</p>
											<input placeholder="Enter Authentication App Password here.." />
										</div>
									</div>
								</div>
							) : (
								''
							)}
						</div>
					</div>
				</div>

				{/* Theme Preference */}

				{/* <div className="settingsTheme" id="theme">
					<div className={'themeMain'}>
						<h4>Theme performance</h4>
						<div>
							<button
								className={activeTheme === 'system' ? 'activeButton' : ''}
								onClick={() => handleTheme('system')}
							>
								Follow system preferences
							</button>
							<button
								className={activeTheme === 'light' ? 'activeButton' : ''}
								onClick={() => handleTheme('light')}
							>
								Light
							</button>
							<button
								className={activeTheme === 'dark' ? 'activeButton' : ''}
								onClick={() => handleTheme('dark')}
							>
								Dark
							</button>
						</div>
					</div>
				</div> */}
				{/* Notifications */}
				{/* <div className={'notificationContainer'} id="notifications">
					<div className={'notificationMain'}>
						<div className={'notificationText'}>
							<h4>Notifications</h4>
							<p>
								We see you're in several workspaces. Choose one to update your
								notification settings.
							</p>
						</div>
					</div>
				</div> */}

				{/* Access Settings */}
				<div className={'accessSettingsContainer'} id="access">
					<div className={'accessContainer'}>
						<h1>Access Settings</h1>
						<div className={'accessInfo'}>
							<h4>Strengthen your Account Security</h4>
							<p>
								As you've signed up through Google, we suggest adding a password for
								extra security.
							</p>
							{/* <button>Update my password</button> */}
							<ReusableButtonSettings
								text={'Update my password'}
								func={() => handleFormPopUp()}
							/>
						</div>
						<div className={'chooseWorkspaces'}>
							<h4>Choose your default workspace</h4>
							<p>
								We see you're part of multiple workspaces. Please select a default
								workspace to log in to automatically.
							</p>
							<div className={'workSpaceContainer'}>
								{/* sample data access */}
								{userWorkSpaceList &&
									userWorkSpaceList.map((item) => (
										<button
											key={item.id}
											onClick={() => handlehandleDefaultWorkspace(item)}
											className={
												activeWorkspace === item?.tenant_id
													? 'activeWorkspace'
													: 'workspaces'
											}
										>
											{item.businessName}
										</button>
									))}
							</div>
						</div>
						<div className={'leaveComponent'}>
							<h4>Do you want to leave your workspace?</h4>
							<p>
								When you leave your workspace, your work will be lost, and your team
								will be notified. Select a workspace you would like to leave
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className="linksContainer">
				<div className="linksContainerProfile">
					<div className="profile-img">
						{userDetails.logoURL ? (
							<img src={userDetails.logoURL} alt="logo" />
						) : (
							getInitials(
								userDetailsData?.firstName,

								userDetailsData?.lastName,
							)
						)}
					</div>
					<div className="linkContainerProfileDetails">
						<h3>{userDetails?.fullName}</h3>
						<p>{isAdmin ? 'Admin' : 'Member'}</p>
					</div>
				</div>
				<ul className={'sidebarList'}>
					<li
						className={activeItem === 'profile' ? 'active' : ''}
						onClick={() => handleNavigation('profile')}
					>
						My profile
					</li>
					<li
						className={activeItem === 'twoFactorAuth' ? 'active' : ''}
						onClick={() => handleNavigation('twoFactorAuth')}
					>
						Two Factor Authentication
					</li>
					{/* <li
						className={activeItem === 'theme' ? 'active' : ''}
						onClick={() => handleNavigation('theme')}
					>
						Theme Preference
					</li> */}
					{/* <li
						className={activeItem === 'notifications' ? 'active' : ''}
						onClick={() => handleNavigation('notifications')}
					>
						Notifications
					</li> */}
					<li
						className={activeItem === 'access' ? 'active' : ''}
						onClick={() => handleNavigation('access')}
					>
						Access Settings
					</li>
					<li style={{ color: '#6055EC', cursor: 'not-allowed' }}> + Create Workspace</li>
				</ul>
			</div>
			{showForm && <MySettingsChangePasword onClose={handlePopupFormClose} />}
		</div>
	);
};

export default MySettings;
