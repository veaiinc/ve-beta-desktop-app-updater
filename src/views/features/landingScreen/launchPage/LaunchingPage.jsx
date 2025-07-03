import { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import s from './launchingPage.module.scss';
import { ReactComponent as VeLogo } from '../../../../assets/svg/veLogo.svg';
import { message } from '../../../components/globalComponents/CustomToast';
import { isValidEmail } from '../../../../helpers/index.jsx';

const LaunchingPage = () => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		email: '',
		isSubmitting: false,
	});

	const handleInput = (e) => {
		if (e.target.type === 'email') {
			setInfo((prev) => ({
				...prev,
				email: e.target.value,
			}));
		}

		if (e.key === 'Enter') {
			const validationError = isValidEmail(info.email);
			if (validationError) {
				message.error(validationError);
				return;
			}
			setInfo((prev) => ({
				...prev,
				isSubmitting: true,
			}));
		}
	};

	const handleSubmit = () => {
		const validationError = isValidEmail(info.email);
		if (validationError) {
			message.error(validationError);
			return;
		}
		setInfo((prev) => ({
			...prev,
			isSubmitting: true,
		}));
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
								value={info.email}
								onChange={handleInput}
								onKeyPress={handleInput}
								disabled={info.isSubmitting}
								aria-label="Email address"
							/>
						</div>
						<button
							className={s.launchingPageContentInputButton}
							onClick={handleSubmit}
							disabled={info.isSubmitting}
							aria-label="Submit email subscription"
						>
							Submit
						</button>
					</div>
				</div>
				<div className={s.launchingPageFooter}>
					<div className={s.launchingPageFooterLinks}>
						<div className={s.launchingPageFooterText}>
							<Link to="/privacy-policy" aria-label="Privacy Policy">
								Privacy Policy
							</Link>
						</div>
						<div className={s.launchingPageFooterText}>
							<Link to="/terms-of-service" aria-label="Terms and Conditions">
								Terms & Conditions
							</Link>
						</div>
						<div className={s.launchingPageFooterText}>
							<Link to="/cookie-policy" aria-label="Cookies Policy">
								Cookies Policy
							</Link>
						</div>
						{/* <div className={s.launchingPageFooterText}>
							<Link to="/help-center" aria-label="Help Center">
								Help Center
							</Link>
						</div> */}
					</div>
				</div>
			</div>
		</>
	);
};

export default memo(LaunchingPage);
