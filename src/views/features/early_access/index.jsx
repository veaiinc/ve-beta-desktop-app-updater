/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/earlyAccess/earlyAccess.scss';
import { ReactComponent as VeAiLogo } from '../../../assets/svg/landingScreen/veai-logo.svg';
import { ReactComponent as LinkedIn } from '../../../assets/svg/earlyAccess/linkedIn.svg';
import { ReactComponent as Instagram } from '../../../assets/svg/earlyAccess/instagram.svg';
import { ReactComponent as Twitter } from '../../../assets/svg/earlyAccess/twitter.svg';
import { ReactComponent as CopyIcon } from '../../../assets/svg/shareAndEarn/copy.svg';
import { ReactComponent as MailIcon } from '../../../assets/svg/footer/email.svg';
// import { ReactComponent as Copyright } from '../../../assets/svg/landingScreen/copyright.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import { message, Tag, Input } from 'antd';
import jwtDecode from 'jwt-decode';

const navItems = [
	{ name: 'Privacy', route: '/privacy-policy' },
	{ name: 'Terms', route: '/terms' },
	{ name: 'Blogs', route: '/blogs' },
];
const EarlyAccess = () => {
	const usertoken = localStorage.getItem('usertoken') ?? '';
	const workspaceId = localStorage.getItem('workspaceId') ?? '';
	const navigate = useNavigate();

	const [showEmailInput, setShowEmailInput] = useState(false);
	const [emails, setEmails] = useState([]);
	const [inputValue, setInputValue] = useState('');

	const {
		profileInfo: { userWorkSpaceList, getUserWorkSpaceList },
		subscriptionInfo: {
			shareAndEarnData,
			referralDetails,
			getShareAndEarn,
			getReferralDetails,
		},
	} = useContext(Context);

	const firstProgressWidth = referralDetails?.totalReferrals
		? (referralDetails.totalReferrals / 10) * 100
		: 0;
	const secondProgressWidth = referralDetails?.totalReferrals
		? (referralDetails.totalReferrals / 50) * 100
		: 0;

	const referrerReward =
		shareAndEarnData?.referralDetails?.referralPlan?.referrerRewardInPercentage || 0;
	const refereeReward =
		shareAndEarnData?.referralDetails?.referralPlan?.refereeRewardInPercentage || 0;
	const decodedToken = jwtDecode(usertoken);
	const { userName } = decodedToken;

	useEffect(() => {
		getUserWorkSpaceList();
		getShareAndEarn();
		getReferralDetails();
	}, []);

	useEffect(() => {
		if (usertoken?.length === 0) {
			// navigate('/');
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
		const referralCode = shareAndEarnData?.referralDetails?.referralCode;
		const referralLink = `https://ve.ai/verify-user?ref=${referralCode}`;

		navigator.clipboard
			.writeText(referralLink)
			.then(() => {
				message.success('Referral link copied!');
			})
			.catch((err) => {
				message.error('Failed to copy:', err);
			});
	}, [shareAndEarnData]);
	const handleSendInvitations = useCallback(() => {
		if (emails.length === 0) {
			message.error('Please enter at least one email');
			return;
		}

		const referralCode = shareAndEarnData?.referralDetails?.referralCode;
		const referralLink = `https://ve.ai/verify-user?ref=${referralCode}`;
		const subject = 'Join me on Ve.ai!';
		const body = `Hey! I'm using Ve.ai and thought you might be interested. Use my referral link to sign up and get ${refereeReward}% discount: ${referralLink}`;

		window.location.href = `mailto:?bcc=${encodeURIComponent(
			emails.join(','),
		)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

		setShowEmailInput(false);
		setEmails([]);
		setInputValue('');
		message.success('Invitation sent successfully!');
	}, [emails, shareAndEarnData, refereeReward]);
	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};

	const handleInputKeyPress = (e) => {
		if (e.key === 'Enter' && inputValue.trim()) {
			setEmails((prevEmails) => [...prevEmails, inputValue.trim()]);
			setInputValue('');
		}
	};

	const handleDeleteEmail = (index) => {
		// Changed parameter name from indexToDelete to index
		setEmails((prevEmails) => {
			console.log('Previous emails:', prevEmails); // Debug log
			return prevEmails.filter((_, i) => i !== index);
		});
	};
	return (
		<div className="landing-page-container">
			<header className="header-container">
				<VeAiLogo aria-label="VeAi Logo" />
			</header>
			<main className="landing-page-content2">
				<section aria-label="Main content" className="hero-section-1">
					<h1 className="heading">Almost a beta user, {userName} !</h1>
					<p className="description">
						You are on waitlist now, If you want to escape this and get access faster
						than anyone
					</p>
				</section>
				<section className="hero-section-7">
					<div className="content-container">
						<div className="top-container">
							<div>
								<div className="top-container-text">Your place</div>
								<div className="top-container-text2">#62382</div>
							</div>
						</div>
						<div className="outer-main-content-container">
							<div className="content-container-outer">
								<div className="content-text-container">
									<div className="heading-container">
										Get your friends to and earn while you're at it!
									</div>
									<div className="paragraph-container">
										You get {referrerReward}% discount and your friends receive{' '}
										{refereeReward}% discount when you refer them
									</div>
								</div>
								<div className="content-bar-container">
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
							<div className="button-container">
								<div className="share-text">Share on</div>
								{!showEmailInput ? (
									<div className="icons-container">
										<div className="icon-button">
											<Twitter />
										</div>
										<div className="icon-button">
											<LinkedIn />
										</div>
										<div className="icon-button">
											<MailIcon onClick={() => setShowEmailInput(true)} />
										</div>
										<div className="icon-button">
											<CopyIcon onClick={handleCopyReferralLink} />
										</div>
									</div>
								) : (
									<div className="email-invitation-container">
										<Input
											className="email-input"
											placeholder="Email ID"
											value={inputValue}
											onChange={handleInputChange}
											onKeyPress={handleInputKeyPress}
										/>
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
											onClick={handleSendInvitations}
											disabled={emails.length === 0}
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

			<footer className="footer-container">
				<nav>
					<ul>
						{navItems.map((item, i) => (
							<li
								key={i}
								onClick={(e) => {
									e.stopPropagation();
									navigate(item.route);
								}}
							>
								{item.name}
							</li>
						))}
					</ul>
				</nav>
				<div className="icons-container">
					<Instagram style={{ width: '40px', height: '40px' }} />
					<LinkedIn style={{ width: '40px', height: '40px' }} />
				</div>
				<div>
					<p className="copyright"> 2024 Ve.ai</p>
				</div>
			</footer>
		</div>
	);
};

export default memo(EarlyAccess);
