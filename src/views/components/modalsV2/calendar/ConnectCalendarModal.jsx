import React, { memo } from 'react';
import { Drawer } from 'antd';
import '../../../../assets/scss/calendar/modal/connectCalendarModal.scss';

const ConnectCalendarModal = ({ onClose }) => {
	return (
		<Drawer
			onClose={onClose}
			width={450}
			open={false}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			<div className="connectCalendarModalContainer">
				<div className="connectCalendarModalHeader">
					<h3>Connect Calendar</h3>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(ConnectCalendarModal);
