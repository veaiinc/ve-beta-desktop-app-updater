import React, { memo, useContext, useState, useEffect } from 'react';
import '../../../assets/scss/settings/settingsPageSidebar.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import { menuItems } from './indexConstant';
import Context from '../../../context/context';

const SettingsPageSideBar = ({ type, setType1 }) => {
	const navigate = useNavigate();
	const location = useLocation();

	const {
		profileInfo: { userDetailsData, userWorkSpaceList },
	} = useContext(Context);

	const [info, setinfo] = useState({
		role: 'default',
		tennatUserFromWorkspace: null,
	});

	useEffect(() => {
		if (userWorkSpaceList) {
			const localStorageWorkspace = localStorage.getItem('workspaceId');
			const tennatUserFromWorkspace = userWorkSpaceList?.find(
				(item) => item?.activeWorkspaceId === localStorageWorkspace,
			);

			setinfo({
				role: tennatUserFromWorkspace?.role || 'default',
				tennatUserFromWorkspace: tennatUserFromWorkspace,
			});

			let isHavingAccess = menuItems?.[tennatUserFromWorkspace?.role || 'default']?.includes(
				location.pathname.split('/')[2],
			);

			!isHavingAccess &&
				navigate(
					`/settings/${menuItems?.[tennatUserFromWorkspace?.role || 'default'][0]?.id}`,
				);
		}
	}, [userWorkSpaceList]);

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
				{menuItems?.[info?.role]?.map((item, index) => (
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
