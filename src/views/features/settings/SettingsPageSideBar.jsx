import React, { memo } from 'react';
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
				{menuItems.map((item, index) => (
					<li
						key={item.id}
						onClick={() => changeRouteFunction(item.id)}
						className={type === item.id ? 'active' : ''}
						style={{
							animationDelay: `${index * 40}ms`,
							animationName: 'fadeIn',
						}}
					>
						<span>{item.label}</span>
					</li>
				))}
				<li
					// style={{ color: '#6055EC' }}
					style={{
						animationDelay: `${menuItems?.length * 10}ms`,
						animationName: 'fadeIn',
					}}
					onClick={() => navigate(`/create-workspace?authtenticated=true`)}
				>
					{' '}
					+ Create Workspace
				</li>
			</ul>
		</div>
	);
};

export default memo(SettingsPageSideBar);
