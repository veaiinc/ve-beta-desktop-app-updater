import React, { memo, useContext } from 'react';
import '../../../assets/scss/settings/settingsPageSidebar.scss';
import { useNavigate } from 'react-router-dom';
import { menuItems } from './indexConstant';
import Context from '../../../context/context';

const SettingsPageSideBar = ({ type, setType1 }) => {
	const navigate = useNavigate();

	const {
		profileInfo: { userDetailsData },
	} = useContext(Context);

	const changeRouteFunction = (route) => {
		setType1(route);
	};

	const handleCreateWorkspace = () => {
		const username = userDetailsData?.firstName ?? '';
		navigate(`/onboarding?username=${username}`);
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
					onClick={handleCreateWorkspace}
				>
					{' '}
					+ Create Workspace
				</li>
			</ul>
		</div>
	);
};

export default memo(SettingsPageSideBar);
