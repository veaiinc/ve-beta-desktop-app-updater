import React, { memo } from 'react';
import { Drawer } from 'antd';

const SessionActivityModal = ({ modalIsOpen, showDrawer }) => {
	return (
		<Drawer
			title="Basic Drawer"
			onClose={showDrawer}
			open={modalIsOpen}
			width={420}
			style={{ padding: '0px', backgroundColor: 'transparent', border: '1px solid red' }}
			// headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			<div className="activitySidePanel">
				<div className="innerContainer">
					<div className="headContianer">Header</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(SessionActivityModal);
