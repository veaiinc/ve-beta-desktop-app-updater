import { memo, useMemo, useCallback } from 'react';
import '../../../assets/scss/settings/settingsPageSidebar.scss';
import { settingsItems } from '../topNavbar/components/settings/Settings';
import { useNavigate, useLocation } from 'react-router-dom';

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
const SettingsCategory = memo(({ title, items, currentPath, onItemClick }) => (
	<>
		<div className="settingsSidebarOptionsTitle">{title}</div>
		{items.map((item) => (
			<SettingsItem
				key={item.value}
				item={item}
				isActive={item.route === currentPath}
				onItemClick={onItemClick}
			/>
		))}
	</>
));

SettingsCategory.displayName = 'SettingsCategory';

const SettingsPageSidebar = ({ toggleSidebar }) => {
	const navigate = useNavigate();
	const { pathname, search } = useLocation();
	const currentPath = pathname + search;

	// Memoize filtered items to prevent unnecessary recalculations
	const categorizedItems = useMemo(() => {
		const accountItems = settingsItems.filter((item) => item.category === 'account');
		const workspaceItems = settingsItems.filter((item) => item.category === 'workspace');
		return { accountItems, workspaceItems };
	}, []);

	// Memoize click handler to prevent unnecessary re-renders
	const handleItemClick = useCallback(
		(item) => {
			console.log(item, 'item');
			if (item.route) {
				navigate(item.route);
			} else if (item.label === 'Help') {
				if (window.Intercom) {
					window.Intercom('show');
				}
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
					currentPath={currentPath}
					onItemClick={handleItemClick}
				/>
				<SettingsCategory
					title="Workspace"
					items={categorizedItems.workspaceItems}
					currentPath={currentPath}
					onItemClick={handleItemClick}
				/>
			</div>
		</div>
	);
};

export default memo(SettingsPageSidebar);
