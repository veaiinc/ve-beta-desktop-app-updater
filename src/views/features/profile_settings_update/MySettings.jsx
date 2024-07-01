import React, { useState, useEffect, useContext } from 'react';
import jwt_decode from 'jwt-decode';
import '../../../assets/scss/profileSettings/mySettings.scss';
import Context from '../../../context/context';
import InputForModules from '../../components/input/inputForModules';
import ToggleSlider from '../../components/input/slider';
// import { collapseToast, useToast } from 'react-toastify';
import ReusableButtonSettings from '../workspace_settings/ReusableButtonSettings';
import validator from 'validator';

const MySettings = () => {
    const {
        profileInfo: { getTenantSettings, getUserDetails, getTenantUserDetails, get2FAQrCode },
    } = useContext(Context);

    const [isToggleOn, setIsToggleOn] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState({});
    const [tenantSettings, setTenantSettings] = useState('');
    const [userDetails, setUserDetails] = useState('');
    const [getTenantDetails, setGetTenantDetails] = useState('');
    const [qrCode, setQrCode] = useState('');

    const [formData, setFormData] = useState({
        profilePicture: '',
        fullName: 'karthik',
        phoneNumber: '9999999999',
        countryCode: '+91',
        email: 'johnappleseed@email.com',
    });
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeItem, setActiveItem] = useState('profile');

    const handleNavigation = (id) => {
        setActiveItem(id);
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchData = async () => {
            let usertoken = localStorage.getItem('usertoken');
            let decoded = jwt_decode(usertoken);
            let workspaceID = localStorage.getItem('workspaceId');
            let role = atob(localStorage.getItem(`userRole::${workspaceID}::${decoded.user_id}`));
            console.log(role, 'this is the role'); // admin
            setIsAdmin(role === 'admin');

            console.log('this is decoded:', decoded, 'workspaceid', workspaceID);

            const tenantSettings = await getTenantSettings();
            setTenantSettings(tenantSettings);
            // console.log(tenantSettings, 'this are the tenant settings from the componet');

            const userDetails = await getUserDetails();
            setUserDetails(userDetails);
            // console.log(userDetails, 'these are the user details from the componet');

            const getTenantDetails = await getTenantUserDetails();
            setGetTenantDetails(getTenantDetails);
            // console.log(getTenantDetails, 'this are the tenant details from the componet');

            const qrCode = await get2FAQrCode();
            setQrCode(qrCode);
            // console.log(qrCode, 'this is the qr code scanner from the componet');
        };

        fetchData();
    }, []);

    // console.log(
    //     tenantSettings,
    //     userDetails,
    //     getTenantDetails,
    //     qrCode,
    //     'these all are from the functions of useState',
    // );
    console.log(userDetails, 'these are the tenent settings ');

    const handleToggleClick = () => {
        // For handling the toggle button
        setIsToggleOn((prevState) => !prevState);
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
        setFormData({
            ...formData,
            [name]: value,
        });

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
                setFormData({
                    ...formData,
                    profilePicture: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const validate = () => {
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
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
            // console.log(formData);
            setIsEditMode(false);
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
                                    <label htmlFor="profilePicture">
                                        {/* <img
                                    src={formData.profilePicture || defaultPic}
                                    alt="Profile"
                                    style={{ cursor: isEditMode ? 'pointer' : 'default' }}
                                /> */}
                                    </label>
                                </div>
                                <div className={'fullName'}>
                                    <InputForModules
                                        label={'Full Name'}
                                        type={'text'}
                                        placeholder={'First Name'}
                                        name={'fullName'}
                                        value={'karthikeya'}
                                        onChange={handleChange}
                                        isError={false}
                                        errorMessage={''}
                                    />
                                    {errors.fullName && (
                                        <span className="error">{errors.fullName}</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                {/* <label>Phone Number</label> */}

                                <InputForModules
                                    label={'Phone Number'}
                                    type={'phoneNumber'}
                                    placeholder={'Enter your Phone Number'}
                                    name={'phoneNumber'}
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    isError={false}
                                    errorMessage={''}
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
                                    value={formData.email}
                                    onChange={handleChange}
                                    isError={false}
                                    errorMessage={''}
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
                                <ToggleSlider onChange={handleToggleClick} />
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
                                            {/* <img src={scanner} alt='scanner'/> */}
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
                            <button>Follow system preferences</button>
                            <button>Light</button>
                            <button>Dark</button>
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
                            <button>Update my password</button>
                            <ReusableButtonSettings text={'Update'} />
                        </div>
                        <div className={'chooseWorkspaces'}>
                            <h4>Choose your default workspace</h4>
                            <p>
                                We see you're part of multiple workspaces. Please select a default
                                workspace to log in to automatically.
                            </p>
                            <div className={'gridContainer'}>
                                {/* {defaultWorkspace.map((item) => (
								<button key={item.id} className={styles.gridItem}>
								{item.name}
								</button>
							))} */}
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
                    <li style={{ color: '#6055EC' }}> + Create Workspace</li>
                </ul>
            </div>
        </div>
    );
};

export default MySettings;
