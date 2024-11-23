/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/earlyAccess/earlyAccess.scss';
import { ReactComponent as VeAiLogo } from '../../../assets/svg/landingScreen/veai-logo.svg';
import { ReactComponent as VeAiLogoGrey } from '../../../assets/svg/landingScreen/veai-logo-grey.svg';
import { ReactComponent as ArrowUpBlack } from '../../../assets/svg/landingScreen/arrow-black.svg';
import { ReactComponent as DoubleQuote } from '../../../assets/svg/landingScreen/double-quote.svg';
import { ReactComponent as Facebook } from '../../../assets/svg/earlyAccess/facebook.svg';
import { ReactComponent as LinkedIn } from '../../../assets/svg/earlyAccess/linkedIn.svg';
import { ReactComponent as Instagram } from '../../../assets/svg/earlyAccess/instagram.svg';
import { ReactComponent as Twitter } from '../../../assets/svg/earlyAccess/twitter.svg';
import { ReactComponent as CopyIcon } from '../../../assets/svg/shareAndEarn/copy.svg';
import { ReactComponent as MailIcon } from '../../../assets/svg/footer/email.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import { message } from 'antd';
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
										You get {referrerReward}% cash back and your friends receive{' '}
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
								<div className="icons-container">
									<div className="icon-button">
										<Twitter />
									</div>
									<div className="icon-button">
										<LinkedIn />
									</div>
									<div className="icon-button">
										<MailIcon />
									</div>
									<div className="icon-button">
										<CopyIcon onClick={handleCopyReferralLink} />
									</div>
								</div>
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
							<li onClick={() => navigate(item.route)}>{item.name}</li>
						))}
					</ul>
				</nav>
				<div className="icons-container">
					<Instagram style={{ width: '40px', height: '40px' }} />
					<LinkedIn style={{ width: '40px', height: '40px' }} />
				</div>
				<div>
					<p className="copyright">2024 Ve.ai</p>
				</div>
			</footer>
		</div>
	);
};

export default memo(EarlyAccess);
