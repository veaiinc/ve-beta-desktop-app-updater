import { memo } from 'react';
import '../../../assets/scss/settings/settingsPageSidebar.scss';
import { settingsItems } from '../topNavbar/components/settings/Settings';
import { useNavigate, useParams } from 'react-router-dom';

const SettingsPageSidebar = ({ toggleSidebar }) => {
	const navigate = useNavigate();
	const { type } = useParams();

	return (
		<div className={`${toggleSidebar ? 'topSettingsSidebar' : 'accountSettingsSidebar'}`}>
			<div className="settingsSidebarOptions">
				{settingsItems.map((item) => (
					<div
						className={`settingsSidebarEachOption ${
							type === item?.value ? 'active' : ''
						}`}
						onClick={() => {
							if (item?.route) {
								navigate(item?.route);
							} else {
								item?.handleClick();
							}
						}}
					>
						{item?.icon}
						<span className="settingsSidebarEachOptionLabel"> {item?.label}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(SettingsPageSidebar);
