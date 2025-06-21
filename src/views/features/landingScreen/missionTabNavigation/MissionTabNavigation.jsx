import { memo } from 'react';
import s from './missionTabNavigation.module.scss';

// const tabs = ['Mission', 'Research', 'Careers'];
const tabs = ['Mission', 'Forefront'];
// const subTabs = [
// 	{
// 		blog: [{ label: 'Forefront', path: '/forefront' }],
// 	},
// ];

const MissionTabNavigation = ({ tab, handleSetNewTab }) => {
	return (
		<main className={s.missionTabsContainer} aria-label="Mission navigation">
			<ul className={s.mainTabs}>
				{tabs.map((label, index) => (
					<li
						key={`main-tab-${index}`}
						className={`${s.tab} ${tab === index ? s.active : ''}`}
						onClick={() => handleSetNewTab(index)}
						role="tab"
						aria-selected={tab === index}
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								handleSetNewTab(index);
							}
						}}
					>
						{label}
					</li>
				))}
			</ul>

			{/* {subTabs.map((subTab, subTabIndex) => (
				<section key={`subtab-section-${subTabIndex}`} className={s.subTabSection}>
					{Object.entries(subTab).map(([category, items], categoryIndex) => (
						<ul
							key={`subtab-${category}-${categoryIndex}`}
							className={s.subTabContainer}
						>
							<li className={s.subTab} style={{ pointerEvents: 'none', fontWeight: 600 }}>
								{category}
							</li>
							{items.map((item, itemIndex) => {
								const flatIndex = tabs.length + itemIndex; // <--- Key logic!
								return (
									<li
										key={`subtab-item-${itemIndex}`}
										className={`${s.subTab} ${tab === flatIndex ? s.active : ''}`}
										role="tab"
										tabIndex={0}
										onClick={() => handleSetNewTab(flatIndex)}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												handleSetNewTab(flatIndex);
											}
										}}
									>
										{item.label}
									</li>
								);
							})}
						</ul>
					))}
				</section>
			))} */}
		</main>
	);
};

export default memo(MissionTabNavigation);
