import '../../../assets/scss/signin.scss';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import GoogleLogo from '../../../assets/images/googleLogo.png';
import Context from '../../../context/context';
import { ReactComponent as VE } from '../../../assets/svg/ve.svg';
import { useParams, useNavigate } from 'react-router-dom';
import { getLocationsDetails } from '../../../helpers';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
var validator = require('validator');

const VerifyUserStep = ({
	handleInput,
	usersData,
	isLoading,
	errorStates,
	setLoading,
	setStage,
	setErrorState,
}) => {
	let {
		userLogin: { verifyAccountExistsUsingEmail },
	} = useContext(Context);
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		googleLogin: false,
	});

	useEffect(() => {
		const usertoken = localStorage.getItem('usertoken');
		const region = localStorage.getItem('region');
		const workspaceId = localStorage.getItem('workspaceId');
		const isOnboard = JSON.parse(localStorage.getItem('isOnboard'));
		if (usertoken && region && workspaceId) {
			if (isOnboard === false) return navigate('/early-access');
			if (isOnboard) return navigate('/home');
		}

		return () => {
			setInfo((prev) => ({ ...prev, googleLogin: false }));
		};
	}, []);

	const handleUserExists = async (event, type) => {
		if (event?.key === 'Enter' || type === 'click') {
			if (isLoading) {
				return;
			}
			if (usersData['emailId'] && validator.isEmail(usersData['emailId'])) {
				setLoading(true);
				let response = await verifyAccountExistsUsingEmail(usersData['emailId']);

				if (response?.[0]) {
					const { isAccountExist } = response?.[1] || {};
					if (!isAccountExist) {
						setStage('signup-user');
					} else {
						setStage('login-with-password');
					}
					setLoading(false);
					return;
				}
			} else {
				setLoading(false);
				setErrorState((prevState) => ({
					...prevState,
					emailId: true,
				}));
			}
		}
	};

	const handleGoogleAuthentication = useCallback(async () => {
		setInfo((prev) => ({ ...prev, googleLogin: true }));
		let locationDetails = localStorage.getItem('locationDetails');
		if (!locationDetails) {
			const response = await getLocationsDetails();
			locationDetails = response;
		}
		locationDetails = encodeURIComponent(locationDetails);
		window.location.href = `https://auth.ve.ai/google/url?locationDetails=${locationDetails}`;
	}, []);

	return (
		<div className={`stepOne`}>
			<p className="heading">
				Welcome to <VE /> <span>AI</span>
			</p>
			<p className="description">Your AI assistant for work</p>

			<div className="signinWithGoogle" onClick={handleGoogleAuthentication}>
				<img src={GoogleLogo} alt={'G'} />

				<p
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						justifyContent: 'ceter',
					}}
				>
					{info?.googleLogin ? <Spin indicator={<LoadingOutlined spin />} /> : ''}
					Continue with Google
				</p>
			</div>

			<p className="or">or</p>

			<div className="inputContainer">
				<input
					type="email"
					placeholder="work@email.com"
					onChange={handleInput}
					name="emailId"
					value={usersData['emailId']}
					className={errorStates['emailId'] ? 'error' : ''}
					onKeyDown={handleUserExists}
					autoFocus={true}
				/>
			</div>
			<div
				className={`continueContainer ${
					validator.isEmail(usersData['emailId']) && isLoading == false ? 'active' : ''
				}`}
				onClick={() => (isLoading ? '' : handleUserExists(null, 'click'))}
			>
				{isLoading ? <p>Loading...</p> : <p>Continue</p>}
			</div>
			<p className="errorMessage">{errorStates['message']}</p>
			<div className="privacyPolicyContainer">
				<p>By signing up to create an account, I accept Company’s</p>
				<p style={{ cursor: 'pointer   ' }} onClick={() => navigate('/privacy-policy')}>
					<span>Terms of Use</span> & <span>Privacy Policy</span>
				</p>
			</div>
		</div>
	);
};

export default VerifyUserStep;
