import { memo } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/unintegratedAgentApps.scss';

const UnintegratedAgentApps = ({ apps = [] }) => {
	return <div className={s.unintegratedAgentAppsContainer}>UnintegratedAgentApps</div>;
};

export default memo(UnintegratedAgentApps);
