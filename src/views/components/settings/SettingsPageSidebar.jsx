import { memo, useMemo, useCallback, act, useState } from 'react';
import '../../../assets/scss/settings/settingsPageSidebar.scss';
import { settingsItems } from '../topNavbar/components/settings/Settings';
import { useNavigate, useParams } from 'react-router-dom';
import TypedInputNumber from 'antd/es/input-number';

// Memoized settings item component to prevent unnecessary re-renders
const SettingsItem = memo(({ item, isActive, onItemClick }) => {
	const handleClick = useCallback(() => {
		onItemClick(item);
	}, [item, onItemClick]);

	const handleKeyDown = useCallback(
		(event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				handleClick();
			}
		},
		[handleClick],
	);

	return (
		<div
			className={`settingsSidebarEachOption ${isActive ? 'active' : ''}`}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			tabIndex={0}
			role="button"
			aria-label={`Navigate to ${item.label} settings`}
		>
			{item.icon}
			<span className="settingsSidebarEachOptionLabel">{item.label}</span>
		</div>
	);
});

SettingsItem.displayName = 'SettingsItem';

// Memoized category section component
const SettingsCategory = memo(({ title, items, activeType, onItemClick }) => (
	<>
		<div className="settingsSidebarOptionsTitle">{title}</div>
		{items.map((item) => (
			<SettingsItem
				key={item.value}
				item={item}
				isActive={activeType === item.label}
				onItemClick={onItemClick}
			/>
		))}
	</>
));

SettingsCategory.displayName = 'SettingsCategory';

const SettingsPageSidebar = ({ toggleSidebar }) => {
	const navigate = useNavigate();
	// const { type } = useParams();
	const [info, setInfo] = useState({
		activeType: '',
	});

	// Memoize filtered items to prevent unnecessary recalculations
	const categorizedItems = useMemo(() => {
		const accountItems = settingsItems.filter((item) => item.category === 'account');
		const workspaceItems = settingsItems.filter((item) => item.category === 'workspace');
		return { accountItems, workspaceItems };
	}, []);

	// Memoize click handler to prevent unnecessary re-renders
	const handleItemClick = useCallback(
		(item) => {
			setInfo((prev) => ({
				...prev,
				activeType: item.label,
			}));
			if (item.route) {
				navigate(item.route);
			} else if (item.handleClick) {
				item.handleClick();
			}
		},
		[navigate],
	);

	// Memoize CSS class to prevent string concatenation on every render
	const sidebarClassName = useMemo(
		() => (toggleSidebar ? 'topSettingsSidebar' : 'accountSettingsSidebar'),
		[toggleSidebar],
	);

	return (
		<div className={sidebarClassName}>
			<div className="settingsSidebarOptions">
				<SettingsCategory
					title="Account"
					items={categorizedItems.accountItems}
					activeType={info.activeType}
					onItemClick={handleItemClick}
				/>
				<SettingsCategory
					title="Workspace"
					items={categorizedItems.workspaceItems}
					activeType={info.activeType}
					onItemClick={handleItemClick}
				/>
			</div>
		</div>
	);
};

export default memo(SettingsPageSidebar);
