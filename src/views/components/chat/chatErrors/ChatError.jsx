import { memo } from 'react';
import s from '../../../../assets/scss/chat/chatErrors/chatError.module.scss';
import CreditsExpired from './CreditsExpired';

const ChatError = ({ error }) => {
	const componentMapper = {
		credits_expired: <CreditsExpired />,
	};
	return <div className={s.chatErrorContainer}>{componentMapper[error?.type]}</div>;
};

export default memo(ChatError);
