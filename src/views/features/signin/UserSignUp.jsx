import '../../../assets/scss/signin.scss';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import Context from '../../../context/context';
import { ReactComponent as VE } from '../../../assets/svg/ve.svg';
import { ReactComponent as EyeOpen } from '../../../assets/svg/password-eye-open.svg';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
const UserSignUp = ({
	handleInput,
	usersData,
	isLoading,
	errorStates,
	setLoading,
	setStage,
	setErrorState,
	passwordView,
	setPasswordView,
	goBack,
	secondStageButtonActive,
	setUsersData,
}) => {
	let {
		userLogin: { createUsersAccount, signUpInvitedUser },
	} = useContext(Context);
	const location = useLocation();
	const navigate = useNavigate();
	const params = new URLSearchParams(location.search);
	const [geoGraphicData, setGeoGraphData] = useState(null);
	const [info, setInfo] = useState({
		invitedWorkspaceId: params.get('invitedWorkspaceId') || '',
		invitedEmail: params.get('inviteeEmail') || '',
		invitedUser: params.get('invitedWorkspaceId')?.length ? true : false,
	});

	useEffect(() => {
		if (!info?.invitedUser) {
			if (!usersData['emailId']?.length) {
				goBack('verify-user');
			}
		} else {
			setUsersData((prev) => ({ ...prev, emailId: info?.invitedEmail }));
		}
		localStorage.clear();
		getGeoGraphicData();
	}, []);

	const getGeoGraphicData = useCallback(async () => {
		const response = await axios.get('https://ipapi.co/json/');
		setGeoGraphData(response?.data);
	}, []);

	const handleUserSignUp = async () => {
		if (secondStageButtonActive && !info?.invitedUser) {
			setLoading(true);
			let json = {
				firstName: usersData['name'],
				email: usersData['emailId'],
				password: usersData['password'],
				country: geoGraphicData?.country_name || 'India',
				timezone: geoGraphicData?.timezone || 'Asia/Kolkata',
				currency: geoGraphicData?.currency || 'INR',
			};
			let response = await createUsersAccount(json);

			if (response[0]) {
				setLoading(false);
				setStage('verify-email-code');
			} else {
				setLoading(false);
				setErrorState((prevState) => ({
					...prevState,
					message: response[1]?.message,
				}));
			}
		}
		if (secondStageButtonActive && info?.invitedUser) {
			setLoading(true);
			let json = {
				firstName: usersData['name'],
				email: usersData['emailId'],
				password: usersData['password'],
				workspaceId: info?.invitedWorkspaceId,
			};
			const response = await signUpInvitedUser(json);
			if (response?.[0]) {
				navigate('/sales');
				setLoading(false);
			} else {
				setLoading(false);
				setErrorState((prevState) => ({
					...prevState,
					message: response?.[1]?.message || 'Something went wrong',
				}));
			}
		}
	};

	return (
		<div className={`stepOne`}>
			<p className="heading">
				Welcome to <VE /> <span>AI</span>
			</p>
			<p className="description">Your AI assistant for work</p>

			<div className="userSignUp">
				<div className="inputContainer">
					<input
						type="email"
						placeholder="work@email.com"
						onChange={handleInput}
						name="emailId"
						value={usersData['emailId']}
						className={errorStates['emailId'] ? 'error' : ''}
						readOnly={true}
					/>
				</div>
				<div className="inputContainer">
					<input
						type="text"
						placeholder="Type your Name here.."
						onChange={handleInput}
						name="name"
						value={usersData['name']}
						className={errorStates['name'] ? 'error' : ''}
						autoFocus={true}
					/>
				</div>
				<div className="inputContainer2 inputContainerPassword">
					<input
						type={passwordView ? 'password' : 'text'}
						placeholder="Add a Password here.."
						onChange={handleInput}
						name="password"
						value={usersData['password']}
						className={errorStates['password'] ? 'error' : ''}
						style={{ borderRadius: 0, border: 'none', height: 'auto' }}
					/>
					<span onClick={() => setPasswordView((prev) => !prev)}>
						<EyeOpen />
					</span>
				</div>
				<div className="continueButtonSplit">
					<div className="backButton " onClick={() => goBack('verify-user')}>
						<p>Back</p>
					</div>
					<div
						className={`continueContainer ${secondStageButtonActive ? 'active' : ''}`}
						onClick={() => (secondStageButtonActive ? handleUserSignUp() : '')}
					>
						{isLoading ? <p>Loading...</p> : <p>Continue</p>}
					</div>
				</div>
				<p className="errorMessage">{errorStates['message']}</p>
			</div>
			<div className="privacyPolicyContainer">
				<p>By signing up to create an account, I accept Company’s</p>
				<p>
					<span>Terms of Use</span> & <span>Privacy Policy</span>
				</p>
			</div>
		</div>
	);
};

export default UserSignUp;
