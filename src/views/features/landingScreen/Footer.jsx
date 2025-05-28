import { memo } from 'react';
import s from '../../../assets/scss/landingScreen/footer.module.scss';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
import { ReactComponent as LinkedinLogo } from '../../../assets/svg/landingScreen/linkedinLogo.svg';
import { ReactComponent as YoutubeLogo } from '../../../assets/svg/landingScreen/youtubeLogo.svg';
import { ReactComponent as InstagramLogo } from '../../../assets/svg/landingScreen/instagramLogo.svg';
import { ReactComponent as FacebookLogo } from '../../../assets/svg/landingScreen/facebookLogo.svg';
import { ReactComponent as ArrowUp } from '../../../assets/svg/ai_agents/arrow-up-dark.svg';
import GoldenGateImage from '../../../assets/images/goldenGate.png';

import { Link } from 'react-router-dom';

const Footer = () => {
	return (
		<div className={s.footer}>
			<div className={s.container}>
				<div className={s.top}>
					<div className={s.top__leftPart}>
						<VeLogo />
						<span className={s.heading}>From the Founder&apos;s Desk</span>
						<p>
							Hi, I&apos;m Vijay. I&apos;m building Ve.ai — the world&apos;s first
							Proactive AI OS. If you want a front-row seat to how memory, cognition,
							and reasoning are being redefined, subscribe below. No spam. Just raw,
							early insights as we build.
						</p>
						<div className={s.emailInput}>
							<input type="text" placeholder="Example@gmail.com" />
							<button className={s.subscribeButton}>Subscribe</button>
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
									<Link to="/mission">Mission</Link>
								</li>
								<li>
									<Link to="/forenterprise">For Enterprise</Link>
								</li>
								<li>
									<Link to="/forenterprise">Investor Updates</Link>
								</li>
							</ul>
						</div>
						<div className={s.about}>
							<ul>
								<li>
									<span className={s.listHeading}>Resources</span>
								</li>
								<li>
									<Link to="/mission">Blog</Link>
								</li>
								<li>
									<Link to="/forenterprise">Cookie</Link>
								</li>
								<li>
									<Link to="/forenterprise">Changelog</Link>
								</li>
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
								<div className={s.social}>
									<LinkedinLogo />
								</div>
								<div className={s.social}>
									<FacebookLogo />
								</div>
								<div className={s.social}>
									<InstagramLogo />
								</div>
								<div className={s.social}>
									<YoutubeLogo />
								</div>
							</div>
						</div>
						<div className={s.bottom__topPart_rightPart}>
							<div>
								<span>Back top </span>
								<ArrowUp />
							</div>
						</div>
					</div>
					<div className={s.bottom__bottomPart}>
						<div className={s.bottom__bottomPart_leftPart}>
							<div className={s.linksContainer}>
								<Link to="/privacy-policy">Privacy Policy</Link>
								<Link to="/terms-of-use">Terms of Use</Link>
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
