import React from 'react';
import '../../../assets/scss/AccountSettings/settingsPageSidebar.scss';
import { useNavigate } from 'react-router-dom';
import { menuItems } from './indexConstant';

const SettingsPageSideBar = ({ type, setType1 }) => {
	const navigate = useNavigate();

	const changeRouteFunction = (route) => {
		setType1(route);
	};

	return (
		<div className="settingsPageLayout">
			<ul>
				{menuItems.map((item) => (
					<li
						key={item.id}
						onClick={() => changeRouteFunction(item.id)}
						className={type === item.id ? 'active' : ''}
					>
						<span>{item.label}</span>
					</li>
				))}
				<li
					// style={{ color: '#6055EC' }}
					onClick={() => navigate(`/create-workspace?authtenticated=true`)}
				>
					{' '}
					+ Create Workspace
				</li>
			</ul>
		</div>
	);
};

export default SettingsPageSideBar;
