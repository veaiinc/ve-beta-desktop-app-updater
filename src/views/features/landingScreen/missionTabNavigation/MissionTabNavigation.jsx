import { memo } from 'react';
import s from './missionTabNavigation.module.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Tab = ({ tab, navigate, setInfo, activeTab }) => {
	return (
		<li
			key={tab.label}
			className={`${s.tab} ${tab.path === activeTab ? s.active : ''}`}
			onClick={() => {
				setInfo({ currentTab: tab.path });
				navigate(tab.path);
			}}
			role="tab"
			aria-selected={tab.path === activeTab}
			tabIndex={0}
		>
			{tab.label}
		</li>
	);
};

const MissionTabNavigation = ({ tabs }) => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({ currentTab: '/manifesto' });
	const tab = tabs[tabs.length - 1];
	return (
		<aside className={s.missionTabsContainer} aria-label="Mission navigation">
			<ul className={s.mainTabs}>
				{tabs.slice(0, tabs.length - 1).map((tab) => (
					<Tab
						tab={tab}
						key={tab.label}
						navigate={navigate}
						setInfo={setInfo}
						activeTab={info.currentTab}
					/>
				))}
				<div className={s.divider}></div>
				<li
					role="tab"
					aria-selected={tab.path === info.currentTab}
					tabIndex={0}
					className={`${s.tab} ${tab.path === info.currentTab ? s.active : ''}`}
					onClick={() => {
						setInfo({ currentTab: tab.path });
						navigate(tab.path);
					}}
				>
					{tab.label}
				</li>
			</ul>
		</aside>
	);
};

export default memo(MissionTabNavigation);
