import { Tooltip } from 'antd';
import { memo } from 'react';

const tooltipTitleStyle = {
	color: 'var(--primary-font, #F2F2F3)',
	textAlign: 'right',
	fontFamily: 'Inter',
	fontSize: '13px',
	fontStyle: 'normal',
	fontWeight: 500,
	lineHeight: 'normal',
	padding: '8px 14px',
	borderRadius: '8px',
	border: '1px solid var(--stroke-hover, #424548)',
	background: 'var(--popup, #202123)',
	boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.12)',
};

const tooltipOverlayInnerStyle = {
	borderRadius: '10px',
	fontSize: '14px',
	backgroundColor: 'var(--card)',
	color: 'var(--primary-font)',
	textAlign: 'center',
	marginLeft: '8px',
	minWidth: 'fit-content',
	minHeight: 'fit-content',
	padding: '0px',
};

const SidebarTooltip = ({ label, icon, onClick }) => (
	<Tooltip
		title={<div style={tooltipTitleStyle}>{label}</div>}
		placement="bottomRight"
		arrow={false}
		overlayInnerStyle={tooltipOverlayInnerStyle}
	>
		<div className="eachOption" onClick={onClick}>
			{icon}
		</div>
	</Tooltip>
);

export default memo(SidebarTooltip);
