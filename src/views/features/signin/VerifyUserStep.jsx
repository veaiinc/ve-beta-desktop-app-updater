import '../../../assets/scss/signin.scss';
import React, { useState, useEffect, useContext, useRef } from 'react';
import GoogleLogo from '../../../assets/images/googleLogo.png';
import Context from '../../../context/context';
import { ReactComponent as VE } from '../../../assets/svg/ve.svg';
import { useParams, useNavigate } from 'react-router-dom';
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

	const handleUserExists = async (event, type) => {
		if (event?.key === 'Enter' || type === 'click') {
			if (isLoading) {
				return;
			}
			if (usersData['emailId'] && validator.isEmail(usersData['emailId'])) {
				setLoading(true);
				let response = await verifyAccountExistsUsingEmail(usersData['emailId']);

				if (response[0] && response[1]?.isAccountExist) {
					setStage('login-with-password');
					setLoading(false);
				} else if (response[0] && response[1]?.isAccountExist == false) {
					setStage('signup-user');
					setLoading(false);
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
	return (
		<div className={`stepOne`}>
			<p className="heading">
				Welcome to <VE /> <span>AI</span>
			</p>
			<p className="description">Your AI assistant for work</p>

			<a className="signinWithGoogle" href="https://api.ve.co/tenant-users/1.0/auth/google">
				<img src={GoogleLogo} alt={'G'} />
				<p>Continue with Google</p>
			</a>

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
				<p>
					<span>Terms of Use</span> & <span>Privacy Policy</span>
				</p>
			</div>
		</div>
	);
};

export default VerifyUserStep;
