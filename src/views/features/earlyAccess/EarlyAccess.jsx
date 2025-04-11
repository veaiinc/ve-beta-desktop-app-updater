/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/earlyAccess/earlyAccess.scss';
import { ReactComponent as VeAiLogo } from '../../../assets/svg/landingScreen/veai-logo.svg';
import { ReactComponent as LinkedIn } from '../../../assets/svg/earlyAccess/linkedIn.svg';
import { ReactComponent as Instagram } from '../../../assets/svg/earlyAccess/instagram.svg';
import { ReactComponent as Twitter } from '../../../assets/svg/earlyAccess/twitter.svg';
import { ReactComponent as CopyIcon } from '../../../assets/svg/shareAndEarn/copy.svg';
import { ReactComponent as MailIcon } from '../../../assets/svg/earlyAccess/Email.svg';
import { ReactComponent as Arrowback } from '../../../assets/svg/gallery/back-gray.svg';
import {
	CHANGELOG_URL,
	LINKEDIN_URL,
	INSTAGRAM_URL,
	REFERRAL_BASE_URL,
	createEmailBody,
	TWITTER_POST_URL,
	TWEET_TEXT,
} from '../../../helpers/ConstantUrls';

import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import { Tag, Input } from 'antd';
import jwtDecode from 'jwt-decode';
import { message } from '../../components/globalComponents/CustomToast';

const navItems = [
	{ name: 'Privacy', route: '/privacy-policy' },
	{ name: 'Terms', route: '/terms-of-service' },
	{ name: 'Cookies', route: '/cookie-policy' },
	{ name: 'Blogs', route: '/blogs' },
	{ name: 'Changelog', route: CHANGELOG_URL, isExternal: true },
];

const EarlyAccess = () => {
	const usertoken = localStorage.getItem('usertoken') ?? '';
	const workspaceId = localStorage.getItem('workspaceId') ?? '';
	const navigate = useNavigate();

	const [showEmailInput, setShowEmailInput] = useState(false);
	const [emails, setEmails] = useState([]);
	const [inputValue, setInputValue] = useState('');
	const [isCopied, setIsCopied] = useState(false);
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const {
		profileInfo: { userWorkSpaceList, getUserWorkSpaceList },
		subscriptionInfo: {
			sendCustomMailToClients,
			referralData,
			referralDetails,
			getShareAndEarn,
			getReferralDetails,
			onboardPosition,
			getOnboardPosition,
		},
	} = useContext(Context);

	const firstProgressWidth = referralDetails?.totalReferrals
		? (referralDetails.totalReferrals / 10) * 100
		: 0;
	const secondProgressWidth = referralDetails?.totalReferrals
		? (referralDetails.totalReferrals / 50) * 100
		: 0;

	const referrerReward =
		referralData?.referralDetails?.referralPlan?.referrerRewardInPercentage || 0;
	const refereeReward =
		referralData?.referralDetails?.referralPlan?.refereeRewardInPercentage || 0;
	const decodedToken = jwtDecode(usertoken);
	const { userName } = decodedToken;

	const referralLink = `${REFERRAL_BASE_URL}${referralData?.referralDetails?.referralCode}`;

	useEffect(() => {
		getUserWorkSpaceList();
		getShareAndEarn();
		getReferralDetails();
		getOnboardPosition();
	}, []);

	useEffect(() => {
		if (usertoken?.length === 0) {
			window.location.replace('/');
		}
		if (userWorkSpaceList) {
			checkIsOnBoardUser();
		}
	}, [userWorkSpaceList]);

	const checkIsOnBoardUser = useCallback(() => {
		let isOnboard = JSON.parse(localStorage.getItem('isOnboard'));

		const currentWorkspaceData = (userWorkSpaceList || [])?.filter(
			(ele) => ele?.activeWorkspaceId === workspaceId,
		);

		if (currentWorkspaceData) {
			isOnboard = currentWorkspaceData[0]?.isOnboard;
		}
		if (isOnboard) {
			localStorage.setItem('isOnboard', true);
			navigate('/home');
		}
	}, [userWorkSpaceList]);

	const handleCopyReferralLink = useCallback(() => {
		const referralCode = referralData?.referralDetails?.referralCode;
		// const referralLink = `${REFERRAL_BASE_URL}/referralCode/:${referralCode}`;
		const referralLink =
			window.location.hostname === 'localhost'
				? `http://localhost:8000/referral/${referralCode}`
				: `${REFERRAL_BASE_URL}/${referralCode}`;

		if (!isCopied) {
			navigator.clipboard
				.writeText(referralLink)
				.then(() => {
					message.success('Referral link copied!');
					setIsCopied(true);
					setTimeout(() => {
						setIsCopied(false);
					}, 5000);
				})
				.catch((err) => {
					message.error('Failed to copy:', err);
				});
		}
	}, [referralData, isCopied]);

	const handleInputChange = (e) => {
		const value = e.target.value;
		setInputValue(value);
	};

	const handleSendInvitation = async () => {
		if (isButtonDisabled) return;
		setIsButtonDisabled(true);
		try {
			const referralCode = referralData?.referralDetails?.referralCode;
			const referralLink =
				window.location.hostname === 'localhost'
					? `http://localhost:8000/referral/${referralCode}`
					: `${REFERRAL_BASE_URL}/${referralCode}`;
			const referrerDiscount =
				referralData?.referralDetails?.referralPlan?.refereeRewardInPercentage || 0;

			const payload = {
				clientEmail: emails,
				mailContent: {
					subject: 'Join Ve.ai with me using my Referral',
					cc: [],
					htmlBody: createEmailBody(referrerDiscount, referralLink),
				},
			};

			const [success, response] = await sendCustomMailToClients(payload);

			if (success) {
				message.success('Emails sent successfully!');
				setShowEmailInput(false);
				setEmails([]);
				setIsButtonDisabled(false);
			} else {
				message.error('Failed to send emails');
			}
		} catch (error) {
			message.error('Failed to send emails');
		}
	};

	const handleInputKeyPress = (e) => {
		if (e.key === 'Enter' && inputValue.trim()) {
			const newEmail = inputValue.trim();

			const emailRegex = /^[^\s@!#$%&*]+@[^\s@]+\.[^\s@]+$/;

			if (emailRegex.test(newEmail)) {
				if (!emails.includes(newEmail)) {
					setEmails((prevEmails) => [...prevEmails, newEmail]);
					setInputValue('');
				} else {
					message.error('This email is already added');
					setInputValue('');
				}
			} else {
				message.error('Please enter a valid email address');
				// setInputValue('');
			}
		}
	};

	const handleDeleteEmail = (email, index) => {
		setEmails((prevEmails) => {
			return prevEmails.filter((_, i) => i !== index);
		});
	};
	return (
		<div className="landing-page-container2">
			<header className="header-container2">
				<VeAiLogo aria-label="VeAi Logo" />
			</header>
			<main className="landing-page-content2">
				<section aria-label="Main content" className="hero-section-3">
					<h1 className="heading2">Almost a beta user {userName} !</h1>
					<p className="description2">
						You are on waitlist now, If you want to escape this and get access faster
						than anyone
					</p>
				</section>
				<section className="hero-section-7">
					<div className="content-container2">
						{onboardPosition?.onboardPosition && (
							<div className="top-container">
								<div>
									<div className="top-container-text">Your place</div>
									<div className="top-container-text2">
										#{onboardPosition?.onboardPosition}
									</div>
								</div>
							</div>
						)}
						<div className="outer-main-content-container">
							<div className="content-container-outer">
								<div className="content-text-container">
									<div className="heading-container">
										Get your friends to <VeAiLogo /> {'  '}and earn while you're
										at it!
									</div>
									<div className="paragraph-container">
										You get {referrerReward}% discount and your friends receive{' '}
										{refereeReward}% discount when you refer them
									</div>
								</div>
								<div className="content-bar-container2">
									<div className="content-bar-inner">
										<div className="content-bar-text">
											Refer 10 friends for a VIP onboarding
										</div>
										<div className="progress-bar">
											<div
												className="progress-fill"
												style={{
													width: `${Math.min(firstProgressWidth, 100)}%`,
												}}
											></div>
											<span className="progress-text">
												{referralDetails?.totalReferrals || 0}/10
											</span>
										</div>
										{/* ... */}
										<div className="content-bar-text">
											Get 6 month free access on launch !
										</div>
										<div className="progress-bar">
											<div
												className="progress-fill progress-fill-second"
												style={{
													width: `${Math.min(secondProgressWidth, 100)}%`,
												}}
											></div>
											<span className="progress-text">
												{referralDetails?.totalReferrals || 0}/50
											</span>
										</div>
									</div>
								</div>
							</div>
							<div className="button-container2">
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										gap: '20px',
										justifyContent: 'center',
										height: 'auto',
									}}
								>
									{!showEmailInput ? (
										''
									) : (
										<Arrowback
											className="back-arrow-icon"
											onClick={() => setShowEmailInput(false)}
											style={{ marginTop: '4px', cursor: 'pointer' }}
										/>
									)}
									<div className="share-text">Share on</div>
								</div>
								{!showEmailInput ? (
									<div className="icons-container2">
										<div
											className="icon-button"
											onClick={() =>
												window.open(
													`${TWITTER_POST_URL}${encodeURIComponent(
														TWEET_TEXT,
													)}&url=${encodeURIComponent(referralLink)}`,
													'_blank',
												)
											}
										>
											<Twitter />
										</div>
										<div
											className="icon-button"
											onClick={() => {
												window.open(LINKEDIN_URL, '_blank');
											}}
										>
											<LinkedIn />
										</div>
										<div
											className="icon-button"
											onClick={() => setShowEmailInput(true)}
										>
											<MailIcon fill="white" />
										</div>
										<div
											className="icon-button"
											onClick={handleCopyReferralLink}
										>
											{isCopied ? (
												<span style={{ color: 'white' }}>Copied!</span>
											) : (
												<CopyIcon />
											)}
										</div>
									</div>
								) : (
									<div className="email-invitation-container2">
										<div
											style={{
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'center',
											}}
										>
											<Input
												className="email-input"
												// type="email"
												placeholder="Email ID"
												value={inputValue}
												onChange={handleInputChange}
												onKeyPress={handleInputKeyPress}
											/>
										</div>

										<div className="email-tags" style={{ marginTop: '10px' }}>
											{emails.map((email, index) => (
												<Tag
													key={index}
													closable
													onClose={(e) => {
														e.stopPropagation();
														handleDeleteEmail(email, index);
													}}
													style={{
														marginBottom: '8px',
														marginRight: '8px',
													}}
												>
													{email}
												</Tag>
											))}
										</div>

										<button
											className="send-invitation-button"
											onClick={handleSendInvitation}
											disabled={emails.length === 0 || isButtonDisabled}
										>
											Send Invitation
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
					{/* </div> */}
				</section>
			</main>
		</div>
	);
};

export default memo(EarlyAccess);
