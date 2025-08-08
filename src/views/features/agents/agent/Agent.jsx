import { memo, useEffect, useState } from 'react';
import s from './agent.module.scss';
import AgentDetails from '../../../components/agents/agentDetails/AgentDetails';
import RecentChat from '../../chat/RecentChat';
import { useSearchParams } from 'react-router-dom';
import { ReactComponent as MagicWandSvg } from './magicWand.svg';
import { ReactComponent as LeftArrowSvg } from '../../../../assets/svg/left.svg';
const Agent = () => {
	const [searchParams] = useSearchParams();
	const [info, setInfo] = useState({
		rerender: false,
		sId: null,
		agentAction: null,
		isDrawerCollapsed: false,
	});

	useEffect(() => {
		if (searchParams) {
			const sessionId = searchParams?.get('sId');
			const agentAction = searchParams?.get('agentAction');
			setInfo((prev) => ({
				...prev,
				sId: sessionId,
				agentAction: agentAction,
			}));
		}
	}, [searchParams]);

	const toggleDrawer = () => {
		setInfo((prev) => ({
			...prev,
			isDrawerCollapsed: !prev.isDrawerCollapsed,
		}));
	};

	return (
		<div className={s.agentContainer}>
			{info?.sId && info?.agentAction === 'buildAgent' && (
				<div className={`${s.chatBlock} ${info.isDrawerCollapsed ? s.collapsed : ''}`}>
					{!info.isDrawerCollapsed && (
						<div className={s.chatNav}>
							<button className={s.invBtn}>
								<MagicWandSvg />
								Inventor
							</button>
							<span className={s.invTitle}>Let me build this Agent for you</span>
						</div>
					)}

					{info.isDrawerCollapsed ? (
						<div className={s.collapsedContent}>
							<button className={s.magicWandBtn} onClick={toggleDrawer}>
								<MagicWandSvg />
							</button>
						</div>
					) : (
						<>
							<RecentChat
								isPreview={true}
								sId={info?.sId}
								animateChatBox={false}
								showHeader={false}
							/>
							<button className={s.collapseBtn} onClick={toggleDrawer}>
								<LeftArrowSvg />
							</button>
						</>
					)}
				</div>
			)}

			<div className={s.agentBlock}>
				<AgentDetails />
			</div>
		</div>
	);
};

export default memo(Agent);
