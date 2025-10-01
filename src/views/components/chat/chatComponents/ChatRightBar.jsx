import { memo, useMemo } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/chatRightBar.module.scss';
import CitationsModal from '../../modalsV2/chat/CitationsModal';

const ChatRightBar = ({ activeRightBar, handleRightBarToggle, handleCloseCitationsModal }) => {
	const componentMapper = useMemo(
		() => ({
			citations: <CitationsModal closeModal={handleCloseCitationsModal} />,
		}),
		[handleRightBarToggle, handleCloseCitationsModal],
	);

	return <div className={s.chatRightBar}>{componentMapper[activeRightBar] ?? ''}</div>;
};

export default memo(ChatRightBar);
