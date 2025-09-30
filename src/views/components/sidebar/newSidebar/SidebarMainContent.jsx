import { memo, useCallback, useContext, useState } from 'react';
import s from '../../../../assets/scss/sidebar/sidebarMainContent.module.scss';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as GiftSvg } from '../../../../assets/svg/sidebar/gift.svg';
import ChatHistory from '../chatHistory/ChatHistory';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';
import { message } from '../../globalComponents/CustomToast';
import { REFERRAL_BASE_URL } from '../../../../helpers/ConstantUrls';

const options = [
	{
		label: 'New Chat',
		route: '/new-chat',
		value: 'newChat',
	},
	{
		label: 'Proactive AI',
		route: '/home',
		value: 'proactiveAi',
	},
	{
		label: 'Meetings',
		route: '/meet',
		value: 'meet',
	},
];

const SidebarMainContent = ({
	activeTab,
	handleTabChange,
	activeType,
	handleTypeChange,
	expanded,
	handleToggleChatsExpand,
}) => {
	const {
		subscriptionInfo: { getShareAndEarn, referralData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		referralLoading: false,
	});
	const navigate = useNavigate();

	const handleTabClick = useCallback(
		(item) => {
			if (item?.value === activeTab) return;

			if (item?.route) {
				navigate(item?.route);
			}
			handleTabChange(item?.value);
		},
		[handleTabChange],
	);

	const handleReferralClick = useCallback(async () => {
		if (info?.referralLoading) {
			return;
		}

		if (!referralData?.referralDetails) {
			try {
				message.success('Fetching referral link...');
				setInfo((prev) => ({ ...prev, referralLoading: true }));
				const response = await getShareAndEarn();

				if (!response?.referralDetails) {
					message.error('Invalid response received');
					return;
				}

				const referralCode = response?.referralDetails?.referralCode;
				const referralLink = referralCode ? `${REFERRAL_BASE_URL}/${referralCode}` : '';

				navigator.clipboard.writeText(referralLink);
				message.success('Referral link copied to clipboard');
				setInfo((prev) => ({ ...prev, referralLoading: false }));
			} catch (error) {
				setInfo((prev) => ({ ...prev, referralLoading: false }));
				message.error(error.message || 'Something went wrong.');
			}
		} else {
			const referralCode = referralData?.referralDetails?.referralCode;
			const referralLink = referralCode ? `${REFERRAL_BASE_URL}/${referralCode}` : '';
			navigator.clipboard.writeText(referralLink);
			message.success('Referral link copied to clipboard');
		}
	}, [info?.referralLoading, referralData]);

	return (
		<div className={s.container}>
			<div className={s.sidebarDummy}></div>
			<div className={s.sidebarContent}>
				<button className={s.referralBtn} onClick={handleReferralClick}>
					<div className={s.giftIcon}>
						<GiftSvg />
					</div>
					<span>Invite Friends, Earn Credits</span>
				</button>

				{options?.map((option, index) => (
					<button
						className={`${s.btn} ${activeTab === option?.value ? s.active : ''}`}
						onClick={() => handleTabClick(option)}
						key={index}
					>
						{option?.label}
					</button>
				))}

				<div className={s.chatList}>
					<div className={s.leftContainer}>
						<button
							className={`${s.itemBtn} ${activeType === 'chats' ? s.active : ''}`}
							onClick={() => handleTypeChange('chats')}
						>
							Chats
						</button>
					</div>
					<div
						className={`${s.toggleExpand} ${expanded ? s.expanded : ''}`}
						onClick={handleToggleChatsExpand}
					>
						<ChevronRightThinSvg width={16} height={16} />
					</div>
				</div>
			</div>
			<div className={s.sidebarChats}>
				{expanded && activeType === 'chats' && <ChatHistory showNewChatBtn={false} />}
			</div>
		</div>
	);
};

export default memo(SidebarMainContent);
