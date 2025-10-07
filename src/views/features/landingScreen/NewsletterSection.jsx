import { memo, useState, useContext } from 'react';
import s from './newsletterSection.module.scss';
import Context from '../../../context/context';
import { message } from '../../components/globalComponents/CustomToast';
import Spinner from '../../components/loaders/Spinner';
import { ReactComponent as LinkedinLogo } from '../../../assets/svg/landingScreen/linkedinLogo.svg';
import { ReactComponent as InstagramLogo } from '../../../assets/svg/landingScreen/instagramLogo.svg';
// import { ReactComponent as SansLogo } from '../../../assets/svg/landingScreen/logo.svg';
// import { ReactComponent as FacebookLogo } from '../../../assets/svg/landingScreen/facebookLogo.svg';
// import { ReactComponent as YoutubeLogo } from '../../../assets/svg/landingScreen/youtubeLogo.svg';
import { ReactComponent as ArrowUp } from '../../../assets/svg/ai_agents/arrow-up-dark.svg';
// import GoldenGateImage from '../../../assets/images/goldenGate.png';
import { LINKEDIN_URL, INSTAGRAM_URL, HELP_CENTER_URL } from '../../../helpers/ConstantUrls';
import { isValidEmail } from '../../../helpers/index.jsx';
import { Link } from 'react-router-dom';

const initialState = {
	email: '',
	loading: false,
	error: '',
};

const NewsletterSection = () => {
	const {
		authInfo: { subscribeToNewsletter },
	} = useContext(Context);
	const [info, setInfo] = useState(initialState);

	const handleSubscribe = async () => {
		if (!info.email) {
			setInfo({ ...info, error: 'Email is required' });
			return;
		}
		if (!isValidEmail(info.email)) {
			setInfo({ ...info, error: 'Please enter a valid email address' });
			return;
		}
		setInfo({ ...info, error: '' });
		try {
			setInfo({ ...info, loading: true });
			const res = await subscribeToNewsletter(info.email);
			if (res?.[0]) {
				message.success('Subscribed successfully');
				setInfo(initialState);
			} else {
				message.error(res?.[1]?.message);
			}
		} catch (error) {
			message.error('An unexpected error occurred. Please try again!');
		} finally {
			setInfo(initialState);
		}
	};

	const handleEmailChange = (e) => {
		setInfo({ ...info, email: e.target.value, error: '' });
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			handleSubscribe();
		}
	};

	return (
		<section className={s.newsletterSection}>
			<div className={s.container}>
				{/* Main Content Row - Newsletter + Footer Links */}
				<div className={s.topSection}>
					{/* Left Side - Newsletter Form */}
					<div className={s.newsletterForm}>
						<div className={s.textContent}>
							<h2 className={s.heading}>
								Be the <span>first to know</span>
							</h2>
							<p className={s.description}>
								Join our email list to get AI updates and insights from VE straight
								to your inbox.
							</p>
						</div>

						<div className={s.emailForm}>
							<div className={s.inputContainer}>
								<input
									type="email"
									placeholder="Example@gmail.com"
									value={info.email}
									onChange={handleEmailChange}
									onKeyDown={handleKeyDown}
									className={`${s.emailInput} ${info.error ? s.errorInput : ''}`}
									disabled={info.loading}
								/>
								{info.error && <p className={s.errorMessage}>{info.error}</p>}
							</div>
							<button
								className={s.submitButton}
								onClick={handleSubscribe}
								disabled={info.loading || !info.email}
							>
								{info.loading ? <Spinner /> : 'Submit'}
							</button>
						</div>
					</div>

					{/* Right Side - Footer Links */}
					<div className={s.footerLinks}>
						{/* Use case Column */}
						{/* <div className={s.linkColumn}>
							<div className={s.linkItem}>
								<span className={s.columnTitle}>Use case</span>
							</div>
							<div className={s.linkItem}>
								<Link to="#" className={s.linkText}>
									Sales
								</Link>
							</div>
							<div className={s.linkItem}>
								<Link to="#" className={s.linkText}>
									Support
								</Link>
							</div>
							<div className={s.linkItem}>
								<Link to="#" className={s.linkText}>
									Consulting
								</Link>
							</div>
							<div className={s.linkItem}>
								<Link to="#" className={s.linkText}>
									Recruiting
								</Link>
							</div>
						</div> */}

						{/* Resources Column */}
						{/* <div className={s.linkColumn}>
							<div className={s.linkItem}>
								<span className={s.columnTitle}>Resources</span>
							</div>
							<div className={s.linkItem}>
								<Link to="/manifesto" className={s.linkText}>
									Manifesto
								</Link>
							</div>
							<div className={s.linkItem}>
								<Link to="/careers" className={s.linkText}>
									Careers
								</Link>
							</div>
						</div> */}

						{/* Support Column */}
						<div className={s.linkColumn}>
							<div className={s.linkItem}>
								<span className={s.columnTitle}>Support</span>
							</div>
							<div className={s.linkItem}>
								<Link to={HELP_CENTER_URL} target="_blank" className={s.linkText}>
									Help Center
								</Link>
							</div>
							<div className={s.linkItem}>
								<Link to="/contact-us" className={s.linkText}>
									Contact us
								</Link>
							</div>
						</div>

						{/* Legal Column */}
						<div className={s.linkColumn}>
							<div className={s.linkItem}>
								<span className={s.columnTitle}>Legal</span>
							</div>
							<div className={s.linkItem}>
								<Link to="/privacy-policy" className={s.linkText}>
									Privacy policy
								</Link>
							</div>
							<div className={s.linkItem}>
								<Link to="/terms-of-service" className={s.linkText}>
									Terms and condition
								</Link>
							</div>
						</div>
					</div>
				</div>

				{/* Social and Back to Top Section */}
				<div className={s.socialSection}>
					<div className={s.socialContainer}>
						<div className={s.socialIcons}>
							{[
								{
									Icon: LinkedinLogo,
									label: 'LinkedIn',
									url: LINKEDIN_URL,
								},
								// {
								// 	Icon: FacebookLogo,
								// 	label: 'Facebook',
								// 	url: '#',
								// },
								{
									Icon: InstagramLogo,
									label: 'Instagram',
									url: INSTAGRAM_URL,
								},
								// {
								// 	Icon: YoutubeLogo,
								// 	label: 'YouTube',
								// 	url: '#',
								// },
							].map(({ Icon, label, url }) => (
								<div key={label} className={s.socialIconContainer}>
									<a
										href={url}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={label}
										className={s.socialIcon}
									>
										<Icon />
									</a>
								</div>
							))}
						</div>
						<button
							className={s.backToTop}
							onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
						>
							<span>Back top</span>
							<ArrowUp />
						</button>
					</div>
				</div>

				{/* Bottom Section */}
				{/* <div className={s.bottomSection}>
					<div className={s.separator} />
					<div className={s.bottomContent}>
						<div className={s.legalLinks}>
							<Link to="/privacy-policy" className={s.legalLink}>
								Privacy Policy
							</Link>
							<Link to="/terms-of-service" className={s.legalLink}>
								Terms of use
							</Link>
						</div>
						<div className={s.location}>
							<div className={s.locationIcon}>
								<img src={GoldenGateImage} alt="golden gate" />
							</div>
							<span className={s.locationText}>
								Researched & Innovated in San Francisco
							</span>
						</div>
					</div>
				</div> */}

				{/* <div
					className={s.locationCompanyContainer}
					onClick={() => window.open('https://livingintelligencecompany.com', '_blank')}
					style={{ cursor: 'pointer' }}
				>
					<div className={s.locationCompany}>
						<span>The</span> <br />
						Living Intelligence
					</div>
					<div className={s.locationDetail}>
						<span>Company of </span> San Fransisco <SansLogo />
					</div>
				</div> */}
			</div>
		</section>
	);
};

export default memo(NewsletterSection);
