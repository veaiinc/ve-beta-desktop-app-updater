import { memo, useContext } from 'react';
import s from './listEmailsModal.module.scss';

// components
import ReactModal from '../../../../../../../components/modalsV2/';
import Context from '../../../../../../../../context/context';

// icons
import { ReactComponent as UpArrowIcon } from './assets/up-arrow.svg';
import { message } from '../../../../../../globalComponents/CustomToast';

// utils
const isValidEmail = (email) => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const ListEmailsModal = ({
	isOpen,
	onClose,
	setTriggerEmail,
	handleConnectToGmailTrigger,
	connectedEmails,
}) => {
	const {
		profileInfo: { userDetailsData },
	} = useContext(Context);

	const userEmail = userDetailsData?.email;
	const googleProfilePic = userDetailsData?.googleMeta?.picture;
	const profilePic = googleProfilePic ?? userDetailsData?.dp_s3_500w_key ?? null;

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			const email = e.target.value;
			if (isValidEmail(email)) {
				if (connectedEmails?.includes(email)) {
					message.error(`Email ${email} is already in use!`);
					return;
				}
				handleConnectToGmailTrigger(email);
				onClose();
			} else {
				message.error('Please enter a valid email');
			}
		}
	};

	const handleClick = () => {
		if (connectedEmails?.includes(userEmail)) {
			message.error(`Email ${userEmail} is already in use!`);
			return;
		}
		handleConnectToGmailTrigger(userEmail);
		onClose();
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={onClose}
			modalType={'center'}
			customStyles={{
				content: {
					zIndex: 1000,
				},
				overlay: {
					zIndex: 1001,
				},
			}}
		>
			<div className={s.listEmailsModalContainer}>
				<header>
					<h1>Select an account or enter an email</h1>
				</header>
				<div className={s.divider}></div>
				<ul>
					<li onClick={handleClick} className={s.emailItem}>
						<div className={s.content}>
							{profilePic && <img src={profilePic} alt="profile" />}
							<span>
								{userEmail?.split('@')[0] ?? ''}
								<span style={{ color: 'var(--secondary-font)' }}>
									@{userEmail?.split('@')[1] ?? ''}
								</span>
							</span>
						</div>
						<UpArrowIcon />
					</li>
					<li>
						<input
							type="email"
							onKeyDown={handleKeyDown}
							placeholder="Enter your email and hit enter ↵"
							autoFocus
						/>
					</li>
				</ul>
			</div>
		</ReactModal>
	);
};

export default memo(ListEmailsModal);
