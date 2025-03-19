import { Tooltip } from 'antd';
import React, { memo } from 'react';
import ToolTipContainer from '../../popover/ToolTipContainer';

const customContainerStyle = {
	borderRadius: '16px',
	border: '1px solid rgba(100, 100, 100, 0.16)',
	background: '#202123',
	boxShadow: '0px 53px 53px 0px rgba(0, 0, 0, 0.09), 0px 13px 29px 0px rgba(0, 0, 0, 0.1)',
	width: 'fitContent',
	minWidth: '300px',
	padding: '12px',
};

const contentStyling = {
	color: 'var(--primary-font, #f2f2f3)',
	fontFamily: 'Inter',
	fontSize: '13px',
	fontStyle: 'normal',
	fontWeight: '400',
	lineHeight: '18px',
	alignSelf: 'stretch',
};

const ChatTitleAndQueryTooltip = ({ content, children }) => {
	return (
		<Tooltip
			title={
				<ToolTipContainer
					customContainerStyle={customContainerStyle}
					contentStyling={contentStyling}
					title={''}
					content={content}
					removeClassName={true}
				/>
			}
			arrow={true}
			color={'transparent'}
		>
			{children}
		</Tooltip>
	);
};

export default memo(ChatTitleAndQueryTooltip);
