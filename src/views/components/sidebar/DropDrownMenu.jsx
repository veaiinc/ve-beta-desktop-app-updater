import React from 'react';
import { newBtnActions } from './sidebarindex';

const DropDrownMenu = () => {
	return (
		<div
			style={{
				position: 'absolute',
				top: '5px',
				left: '50px',
				width: '200px',
				height: '100px',
				minWidth: '200px',
				backgroundColor: '#151515',
				borderRadius: '10px',
				color: '#E4E5E6',
			}}
			// onMouseOver={onMouseHoverFunc ? handleOpen : null}
			// onMouseLeave={onMouseHoverFunc ? handleClose : null}
		>
			<div>
				{newBtnActions?.map((option, index) => (
					<div
						key={index}
						// className="dropdown-item"
						// onClick={() => handleOptionClick(option)}
						style={{
							color: '#E4E5E6',
							textOverflow: 'ellipsis',
							fontFamily: 'Inter',
							fontSize: '14px',
							fontStyle: 'normal',
							fontWeight: '400',
							lineHeight: '16px' /* 114.286% */,
							letterSpacing: '-0.3px',
							// backgroundColor: 'blue',
						}}
					>
						{option?.label}
					</div>
				))}
			</div>
		</div>
	);
};

export default DropDrownMenu;
