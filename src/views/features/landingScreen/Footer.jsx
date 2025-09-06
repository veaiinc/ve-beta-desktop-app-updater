import { memo } from 'react';
import s from '../../../assets/scss/landingScreen/footer.module.scss';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
import { ReactComponent as LinkedinLogo } from '../../../assets/svg/landingScreen/linkedinLogo.svg';
import { ReactComponent as YoutubeLogo } from '../../../assets/svg/landingScreen/youtubeLogo.svg';
import { ReactComponent as InstagramLogo } from '../../../assets/svg/landingScreen/instagramLogo.svg';
import { ReactComponent as FacebookLogo } from '../../../assets/svg/landingScreen/facebookLogo.svg';
import { ReactComponent as ArrowUp } from '../../../assets/svg/ai_agents/arrow-up-dark.svg';
import GoldenGateImage from '../../../assets/images/goldenGate.png';
import { LINKEDIN_URL, INSTAGRAM_URL } from '../../../helpers/ConstantUrls';

import { Link } from 'react-router-dom';
import Context from '../../../context/context';
import { useContext, useState } from 'react';
import { message } from '../../components/globalComponents/CustomToast';
import Spinner from '../../components/loaders/Spinner';
import VeSvg from '../../../assets/svg/veSvg';
// Email validation regex pattern
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const initialState = {
	email: '',
	loading: false,
	error: '',
};
const Footer = () => {
	const {
		authInfo: { subscribeToNewsletter },
	} = useContext(Context);
	const [info, setInfo] = useState(initialState);
	const handleSubscribe = async () => {
		if (!info.email) {
			setInfo({ ...info, error: 'Email is required' });
			return;
		}
		if (!emailRegex.test(info.email)) {
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
		<div className={s.footer}>
			<div className={s.container}>
				<div className={s.top}>
					<div className={s.top__leftPart}>
						<VeSvg width={36} height={24} fill="var(--primary-font)" />
						<span className={s.heading}>From the Founder&apos;s Desk</span>
						<p className={s.description}>
							Hi, I&apos;m Vijay. I&apos;m building Ve.ai — the world&apos;s first
							Proactive AI OS. If you want a front-row seat to see how memory,
							cognition, and reasoning are being redefined, subscribe below. No spam.
							Just raw, early insights as we build.
						</p>
						<div className={s.emailInput}>
							<input
								type="text"
								placeholder="example@gmail.com"
								onChange={handleEmailChange}
								value={info.email}
								onKeyDown={handleKeyDown}
								className={info.error ? s.errorInput : ''}
							/>
							{info.error && (
								<p
									className={[s.errorMessage, info.error ? s.visible : ''].join(
										' ',
									)}
								>
									{info.error || ''}
								</p>
							)}

							<button
								className={s.subscribeButton}
								onClick={handleSubscribe}
								disabled={info.loading}
								style={info.loading || info.error ? { opacity: 0.5 } : {}}
							>
								Subscribe {info.loading && <Spinner />}
							</button>
							<p className={s.terms}>
								By submitting, you allow Ve.ai to store and process your information
								to deliver what you requested. Read our privacy policy for details.
							</p>
						</div>
					</div>
					<div className={s.top__rightPart}>
						<div className={s.about}>
							<ul>
								<li>
									<span className={s.listHeading}>About</span>
								</li>
								<li>
									<Link to="/manifesto">Manifesto</Link>
								</li>
								<li>
									<Link to="/contact-us">For Enterprise</Link>
								</li>
								{/* <li>
									<Link to="/forenterprise">Investor Updates</Link>
								</li> */}
							</ul>
						</div>
						<div className={s.about}>
							<ul>
								<li>
									<span className={s.listHeading}>Resources</span>
								</li>

								<li>
									<Link to="/cookie-policy">Cookie</Link>
								</li>
								{/* <li>
									<Link to="/changelog">Changelog</Link>
								</li> */}
							</ul>
						</div>
					</div>
				</div>
				{/* <div className={s.middle}>
				<div className={s.middle__leftPart}></div>
				<div className={s.middle__rightPart}></div>
				<div className=""></div>
			</div> */}
				<div className={s.bottom}>
					<div className={s.bottom__topPart}>
						<div className={s.bottom__topPart_leftPart}>
							<span>Socials</span>
							<div className={s.socials}>
								{[
									{
										Icon: LinkedinLogo,
										label: 'LinkedIn',
										url: LINKEDIN_URL, // Replace with actual URL
									},
									// {
									// 	Icon: FacebookLogo,
									// 	label: 'Facebook',
									// 	url: '#', // Replace with actual URL
									// },
									{
										Icon: InstagramLogo,
										label: 'Instagram',
										url: INSTAGRAM_URL, // Replace with actual URL
									},
									// {
									// 	Icon: YoutubeLogo,
									// 	label: 'YouTube',
									// 	url: '#', // Replace with actual URL
									// },
								].map(({ Icon, label, url }) => (
									<a
										href={url}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={label}
										className={s.social}
										key={label}
									>
										<Icon />
									</a>
								))}
							</div>
						</div>
						<div className={s.bottom__topPart_rightPart}>
							<div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
								<span>Back top </span>
								<ArrowUp />
							</div>
						</div>
					</div>
					<div className={s.bottom__bottomPart}>
						<div className={s.bottom__bottomPart_leftPart}>
							<div className={s.linksContainer}>
								<Link to="/privacy-policy">Privacy Policy</Link>
								<Link to="/terms-of-service">Terms of Use</Link>
							</div>
						</div>
						<div className={s.bottom__bottomPart_rightPart}>
							<img src={GoldenGateImage} alt="golden gate" />
							<span>Researched & Innovated in San Francisco</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(Footer);
