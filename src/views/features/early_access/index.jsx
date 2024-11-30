/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/earlyAccess/earlyAccess.scss';
import { ReactComponent as VeAiLogo } from '../../../assets/svg/landingScreen/veai-logo.svg';
import { ReactComponent as LinkedIn } from '../../../assets/svg/earlyAccess/linkedIn.svg';
import { ReactComponent as Instagram } from '../../../assets/svg/earlyAccess/instagram.svg';
import { ReactComponent as Twitter } from '../../../assets/svg/earlyAccess/twitter.svg';
import { ReactComponent as CopyIcon } from '../../../assets/svg/shareAndEarn/copy.svg';
import { ReactComponent as MailIcon } from '../../../assets/svg/earlyAccess/Email.svg';
import { ReactComponent as ArrowBack } from '../../../assets/svg/left-arrow.svg';
import { ReactComponent as Arrowback } from '../../../assets/svg/gallery/back-gray.svg';

import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import { message, Tag, Input } from 'antd';
import jwtDecode from 'jwt-decode';

const navItems = [
	{ name: 'Privacy', route: '/privacy-policy' },
	{ name: 'Terms', route: '/terms-of-service' },
	{ name: 'Cookies', route: '/cookie-policy' },
	{ name: 'Blogs', route: '/blogs' },
	{ name: 'Changelog', route: 'https://veai.ve.ai/portal/changelog', isExternal: true },
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
			shareAndEarnData,
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
		shareAndEarnData?.referralDetails?.referralPlan?.referrerRewardInPercentage || 0;
	const refereeReward =
		shareAndEarnData?.referralDetails?.referralPlan?.refereeRewardInPercentage || 0;
	const decodedToken = jwtDecode(usertoken);
	const { userName } = decodedToken;

	const referralLink = `https://ve.ai?referralCode=${shareAndEarnData?.referralDetails?.referralCode}`;
	const tweetText =
		'Ve.Ai allows you to design stunning forms, proposals, invoices, contracts, I am referring you to join ve with me using my referral link and get 20% discount.';

	useEffect(() => {
		getUserWorkSpaceList();
		getShareAndEarn();
		getReferralDetails();
		getOnboardPosition();
	}, []);

	useEffect(() => {
		if (usertoken?.length === 0) {
			navigate('/');
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
			// navigate('/home');
		}
	}, [userWorkSpaceList]);
	const referralCode = shareAndEarnData?.referralDetails?.referralCode;

	const handleCopyReferralLink = useCallback(() => {
		const referralCode = shareAndEarnData?.referralDetails?.referralCode;
		const referralLink = `https://ve.ai?referralCode=${referralCode}`;

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
	}, [shareAndEarnData, isCopied]);

	const handleInputChange = (e) => {
		const value = e.target.value;
		setInputValue(value);
	};

	const handleSendInvitation = async () => {
		if (isButtonDisabled) return;
		setIsButtonDisabled(true);
		try {
			const referralCode = shareAndEarnData?.referralDetails?.referralCode;
			const referralLink = `https://ve.ai/verify-user?ref=${referralCode}`;
			const referrerDiscount =
				shareAndEarnData?.referralDetails?.referralPlan?.refereeRewardInPercentage || 0; // Extract referrer discount
			const payload = {
				clientEmail: emails,
				mailContent: {
					subject: 'Join Ve.ai with me using my Referral',
					cc: [],
					htmlBody: `
					<html>
						<p>
							<meta charset="UTF-8" />
							<meta name="viewport" content="width=device-width, initial-scale=1.0" />
							<meta content="IE=edge" http-equiv="X-UA-Compatible" />
							<meta name="x-apple-disable-message-reformatting" />
						</p>
						<div
							style="
								max-width: 600px;
								min-width: 290px;
								margin: auto;
								background-color: #ffffff;
								padding: 16px 24px;
								border-radius: 24px;
								box-shadow: 0 0 10px rgba(0, 0, 0, 0.12);
							"
						>
							<div style="font-size: 16px; line-height: 1.6; color: #000">
								<h3 style="color: #000">Explore Ve Ai with me,</h3>
								<p>
									Ve.Ai allows you to design stunning forms, proposals, invoices,
									contracts, and more.
								</p>
								<p>
									I am referring you to join ve with me using my referral link and
									get ${referrerDiscount}% discount.
								</p>
								<center>
									<a
										href="${referralLink}"
										target="_blank"
										style="
											background-color: #2383e2;
											color: white;
											padding: 10px 20px;
											border: none;
											border-radius: 5px;
											text-decoration: none;
											display: inline-block;
											margin: 16px 0;
										"
									>
										<strong>Explore Ve.ai</strong>
									</a>
									<br />
								</center>
								<div
									style="
										font-size: 12px;
										margin-top: 32px;
										color: #888;
										padding-bottom: 16px;
									"
								></div>
								<div>
									<a
										href="https://www.ve.ai/verify-user?n=email_footer"
										style="color: inherit"
										target="_blank"
									>
										<img
											height="14.87px"
											width="57px"
											src="https://ap.assets.ve.ai/logo/veaiblack.png"
											style="display: block; margin-bottom: 8px" />
									</a>
									AI workers who mind your business.
								</div>
							</div>
						</div>
					</html>
				`,
				},
			};

			const [success, response] = await sendCustomMailToClients(payload);

			if (success) {
				message.success('Emails sent successfully!');
				setShowEmailInput(false);
				setEmails([]);
			} else {
				message.error('Failed to send emails');
			}
		} catch (error) {
			console.error('Error sending emails:', error);
			message.error('Failed to send emails');
		} finally {
			setTimeout(() => {
				setIsButtonDisabled(false); // Re-enable the button after 10 seconds
			}, 5000);
		}
	};

	const handleInputKeyPress = (e) => {
		if (e.key === 'Enter' && inputValue.trim()) {
			const newEmail = inputValue.trim();

			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
			console.log('Previous emails:', prevEmails);
			return prevEmails.filter((_, i) => i !== index);
		});
	};
	return (
		<div className="landing-page-container2">
			<header className="header-container">
				<VeAiLogo aria-label="VeAi Logo" />
			</header>
			<main className="landing-page-content2">
				<section aria-label="Main content" className="hero-section-3">
					<h1 className="heading">Almost a beta user {userName} !</h1>
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
								<div className="top-container-text2">
									#{onboardPosition?.onboardPosition}
								</div>
							</div>
						</div>
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
									<div className="icons-container">
										<div
											className="icon-button"
											onClick={() =>
												window.open(
													`https://x.com/intent/post?text=${encodeURIComponent(
														tweetText,
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
												window.open(
													`https://www.linkedin.com/company/veai`,
													'_blank',
												);
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
									<div className="email-invitation-container">
										<div
											style={{
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'center',
											}}
										>
											<Input
												className="email-input"
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

			<footer className="footer-container">
				<nav>
					<ul>
						{navItems.map((item, i) => (
							<li
								key={i}
								onClick={(e) => {
									e.stopPropagation();
									if (item.isExternal) {
										window.open(item.route, '_blank');
									} else {
										navigate(item.route);
									}
								}}
							>
								{item.name}
							</li>
						))}
					</ul>
				</nav>
				<div className="icons-container">
					<Instagram
						style={{ width: '24px', height: '24px', cursor: 'pointer' }}
						onClick={() => window.open('https://www.instagram.com/veaihq', '_blank')}
					/>
					<LinkedIn
						style={{ width: '24px', height: '24px', cursor: 'pointer' }}
						onClick={() =>
							window.open('https://www.linkedin.com/company/veai', '_blank')
						}
					/>
				</div>
				<div>
					<p className="copyright"> 2024 Ve.ai</p>
				</div>
			</footer>
		</div>
	);
};

export default memo(EarlyAccess);

{
	/* <Arrowback
	className="back-arrow-icon"
	onClick={() => setShowEmailInput(false)}
	style={{ paddingRight: '20px' }}
/>; */
}
