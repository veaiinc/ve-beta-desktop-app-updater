import { Drawer } from 'antd';
import React from 'react';
import { ReactComponent as Back } from '../../../../assets/svg/sidebar/notifications/back.svg';
import { ReactComponent as Search } from '../../../../assets/svg/sidebar/notifications/search.svg';
import { ReactComponent as Filter } from '../../../../assets/svg/sidebar/notifications/filter.svg';
import { ReactComponent as Menu } from '../../../../assets/svg/sidebar/notifications/menu.svg';

const ctaMapper = [
	{
		id: 1,
		icon: <Back />,
	},
	{
		id: 2,
		icon: <Search />,
	},
	{
		id: 3,
		icon: <Filter />,
	},
	{
		id: 4,
		icon: <Menu />,
	},
];

const Notifications = ({ showNotificationsDrawer, setShowNotificationsDrawer }) => {
	return (
		<Drawer
			title={null}
			open={showNotificationsDrawer}
			onClose={() => setShowNotificationsDrawer(false)}
			placement="left"
			width={346}
			rootClassName="sidebar-notifications-drawer"
			closeIcon={null}
		>
			<div className="notifications-drawer-container">
				<div className="header">
					<h1 className="title">Notifications</h1>
					<div className="cta-container">
						{ctaMapper?.map((cta) => (
							<div key={cta?.id}>{cta?.icon}</div>
						))}
					</div>
				</div>
				<div className="body"></div>
			</div>
		</Drawer>
	);
};

export default Notifications;
