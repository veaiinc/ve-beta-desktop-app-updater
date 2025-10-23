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
		label: 'Meetings',
		route: '/home',
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
		notes: { activeMeetingDetails },
		aiSetup: { aiChatSessions },
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
				setInfo((prev) => ({ ...prev, referralLoading: true }));
				const response = await getShareAndEarn();

				if (!response?.referralDetails) {
					message.error('Invalid response received');
					return;
				}

				const referralCode = response?.referralDetails?.referralCode;
				const referralLink = referralCode ? `${REFERRAL_BASE_URL}/${referralCode}` : '';

				// navigator.clipboard.writeText(referralLink);
				window?.electronApi.clipboard.writeText(referralLink);
				message.success('Referral link copied to clipboard');
				setInfo((prev) => ({ ...prev, referralLoading: false }));
			} catch (error) {
				setInfo((prev) => ({ ...prev, referralLoading: false }));
				message.error(error.message || 'Something went wrong.');
			}
		} else {
			const referralCode = referralData?.referralDetails?.referralCode;
			const referralLink = referralCode ? `${REFERRAL_BASE_URL}/${referralCode}` : '';
			// navigator.clipboard.writeText(referralLink);
			window?.electronApi.clipboard.writeText(referralLink);
			message.success('Referral link copied to clipboard');
		}
	}, [info?.referralLoading, referralData]);

	return (
		<div className={s.container}>
			<div className={s.sidebarDummy}></div>
			<div className={s.sidebarContent}>
				{/* <button className={s.referralBtn} onClick={handleReferralClick}>
					<div className={s.giftIcon}>
						<GiftSvg />
					</div>
					<span>Invite Friends, Earn Credits</span>
				</button> */}

				<div className={s.navButtons}>
					{options?.map((option, index) => (
						<button
							className={`${s.btn} ${activeTab === option?.value ? s.active : ''}`}
							onClick={() => handleTabClick(option)}
							key={index}
						>
							{option?.label}
						</button>
					))}
				</div>
				{activeMeetingDetails?.meetingId && (
					<button
						className={`${s.btn} ${activeTab === 'ongoingMeeting' ? s.active : ''}`}
						onClick={() =>
							handleTabClick({
								value: 'ongoingMeeting',
								route: '/ongoing-meeting',
							})
						}
					>
						Ongoing Meeting
					</button>
				)}

				{aiChatSessions?.data?.length > 0 && (
					<div className={s.chatList}>
						<button
							// className={`${s.itemBtn} ${activeType === 'chats' ? s.active : ''}`}
							className={`${s.itemBtn} ${s.chatItemBtn}`}
							onClick={() => handleTypeChange('chats')}
						>
							Chats
						</button>
						<button
							className={`${s.toggleExpand} ${expanded ? s.expanded : ''}`}
							onClick={handleToggleChatsExpand}
							aria-label={expanded ? 'Collapse chats' : 'Expand chats'}
						>
							<ChevronRightThinSvg width={16} height={16} />
						</button>
					</div>
				)}
			</div>
			<div className={s.sidebarChats}>
				{expanded && activeType === 'chats' && <ChatHistory showNewChatBtn={false} />}
			</div>
		</div>
	);
};

export default memo(SidebarMainContent);
