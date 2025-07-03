import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './launchingPage.module.scss';
import { ReactComponent as VeLogo } from '../../../../assets/svg/veLogo.svg';
import { message } from '../../../components/globalComponents/CustomToast';

const LaunchingPage = () => {
	const [email, setEmail] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const navigate = useNavigate();

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handleSubmit = async () => {
		if (!email.trim()) {
			message.error('Please enter a valid email address');
			return;
		}

		if (!email.includes('@')) {
			message.error('Please enter a valid email address');
			return;
		}

		setIsSubmitting(true);
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSubmit();
		}
	};

	return (
		<>
			<div className={s.launchingPage}>
				<div className={s.launchingPageHeader}>
					<div className={s.logo} onClick={() => navigate('/')}>
						<VeLogo />
					</div>
				</div>
				<div className={s.launchingPageContent}>
					<div className={s.launchingPageContentHeader}>Launching Soon</div>
					<div className={s.launchingPageContentBody}>
						<div className={s.launchingPageContentTitle}>
							Be First to Build with <span>VE.AI</span>
						</div>
						<div className={s.launchingPageContentDescription}>
							Join our early access program and get hands-on with the world's first
							proactive AI OS. Surface priorities, automate tasks, and operate faster
							— without micromanaging.
						</div>
					</div>
					<div className={s.launchingPageContentInput}>
						<div className={s.launchingPageContentInputField}>
							<input
								type="email"
								placeholder="Enter your Email"
								value={email}
								onChange={handleEmailChange}
								disabled={isSubmitting}
								onKeyPress={handleKeyPress}
								aria-label="Email address"
							/>
						</div>
						<button
							className={s.launchingPageContentInputButton}
							onClick={handleSubmit}
							disabled={isSubmitting}
							aria-label="Submit email subscription"
						>
							Submit
						</button>
					</div>
				</div>
				<div className={s.launchingPageFooter}>
					<div className={s.launchingPageFooterLinks}>
						<div className={s.launchingPageFooterText}>
							<a href="/" aria-label="Privacy Policy">
								Privacy Policy
							</a>
						</div>
						<div className={s.launchingPageFooterText}>
							<a href="/" aria-label="Terms and Conditions">
								Terms & Conditions
							</a>
						</div>
						<div className={s.launchingPageFooterText}>
							<a href="/" aria-label="Cookies Policy">
								Cookies Policy
							</a>
						</div>
						<div className={s.launchingPageFooterText}>
							<a href="/" aria-label="Help Center">
								Help Center
							</a>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default memo(LaunchingPage);
