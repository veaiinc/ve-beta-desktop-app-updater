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

const MySettings = () => {
	const {
		profileInfo: {
			getTenantSettings,
			getUserDetails,
			getTenantUserDetails,
			get2FAQrCode,
			set2FASettings,
			tennantSettingsData,
			userDetailsData,
			tenantUserDetails,
			updateUserDetails,
			qrcode,
			// set2FASetting,
		},
	} = useContext(Context);

	// sample data
	const defaultWorkspace = [
		{ id: '1', name: 'Made in heaven' },
		{ id: '2', name: 'Ballads of Love' },
		{ id: '3', name: 'Alphavisual Studioes' },
		{ id: '4', name: 'Day One Stories' },
		{ id: '5', name: 'Photographies' },
	];
	const [showForm, setShowForm] = useState(false);
	const [isToggleOn, setIsToggleOn] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [errors, setErrors] = useState({});
	const [activeTheme, setActiveTheme] = useState('light');
	const [userDetails, setUserDetails] = useState({
		fullName: '',
		email: '',
		phoneNumber: '',
	});

	console.log(userDetails.fullName, 'this is full name');

	const [isAdmin, setIsAdmin] = useState(false);
	const [activeItem, setActiveItem] = useState('profile');

	const handleNavigation = (id) => {
		setActiveItem(id);
		document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		if (userDetailsData) {
			setUserDetails({
				fullName: userDetailsData.firstName || '',
				email: userDetailsData.email || '',
				phoneNumber: userDetailsData.phoneNumber || '',
			});
		}
		if (isToggleOn) {
			get2FAQrCode();
		}
	}, [userDetailsData, isToggleOn]);

	console.log('tennantSettingsData:', tennantSettingsData);
	console.log('userDetailsData:', userDetailsData);
	console.log('tenantUserDetails:', tenantUserDetails);
	console.log('qrcode:', qrcode);

	useEffect(() => {
		const fetchData = async () => {
			let usertoken = localStorage.getItem('usertoken');
			let decoded = jwt_decode(usertoken);
			let workspaceID = localStorage.getItem('workspaceId');
			let role = atob(localStorage.getItem(`userRole::${workspaceID}::${decoded.user_id}`));
			console.log(role, 'this is the role'); // admin
			setIsAdmin(role === 'admin');

			console.log('this is decoded:', decoded, 'workspaceid', workspaceID);

			getTenantSettings();
			getUserDetails();
			getTenantUserDetails();
		};

		fetchData();
	}, []);

	const getInitials = () => {
		const names = userDetailsData?.firstName + ' ' + userDetailsData?.lastName;
		const nameParts = names.split(' ');
		const initials = nameParts.map((part) => part[0].toUpperCase()).join('');
		return initials;
	};
	const handleFormPopUp = () => {
		setShowForm(true);
	};
	const handlePopupFormClose = () => {
		setShowForm(false);
	};
	const toggleEnable = async (e) => {
		setIsToggleOn((prev) => !prev);
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
					profilePicture: reader.result,
				});
			};
			reader.readAsDataURL(file);
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
					<form
						onSubmit={handleSubmit}
						className={`${'formsMain'} ${isEditMode ? 'formsEdit' : ''}`}
					>
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
						<div className={'formContainerMain'}>
							<div className={'profileImgName'}>
								<div className={'profileImgContainerMain'}>
									<input
										type="file"
										id="profilePicture"
										name="profilePicture"
										onChange={handleImageChange}
										style={{ display: 'none' }}
									/>
									<label htmlFor="profilePicture">{getInitials()}</label>
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
									value={userDetailsData?.phoneNumber}
									onChange={handleChange}
									isError={false}
									errorMessage={''}
									disabled={!isEditMode}
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
									disabled={!isEditMode}
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
								<ToggleSlider onChange={toggleEnable} />
							</div>

							{isToggleOn ? (
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
				<div className="settingsTheme" id="theme">
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
				</div>
				{/* Notifications */}
				<div className={'notificationContainer'} id="notifications">
					<div className={'notificationMain'}>
						<div className={'notificationText'}>
							<h4>Notifications</h4>
							<p>
								We see you're in several workspaces. Choose one to update your
								notification settings.
							</p>
						</div>
					</div>
				</div>

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
							<div className={'gridContainer'}>
								{/* sample data access */}
								{defaultWorkspace.map((item) => (
									<button key={item.id} className={'gridItem'}>
										{item.name}
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
							{/* {defaultWorkspace.map((item) => (
						<div key={item.id} className={styles.notificationWorkspace}>
							<img src={workspaces} alt='workspace'/>
							<div className={styles.workspaceContainer}>
							<h4>{item.name}</h4>
							<p>Current Members: {item.members || 0}</p> 
							</div>
							<button>Leave</button>
						</div>
						
						))} */}
						</div>
					</div>
				</div>
			</div>
			<div className="linksContainer">
				<div className="linksContainerProfile">
					<div className="profile-img">{getInitials()}</div>
					<div className="linkContainerProfileDetails">
						<h3>{userDetails?.fullName}</h3>
						<p>{isAdmin ? 'Admin' : ''}</p>
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
					<li
						className={activeItem === 'theme' ? 'active' : ''}
						onClick={() => handleNavigation('theme')}
					>
						Theme Preference
					</li>
					<li
						className={activeItem === 'notifications' ? 'active' : ''}
						onClick={() => handleNavigation('notifications')}
					>
						Notifications
					</li>
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
