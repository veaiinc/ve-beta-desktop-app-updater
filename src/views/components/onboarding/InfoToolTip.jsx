import { Tooltip } from 'antd';
import { memo } from 'react';

const InnerStyles = {
	width: '16px',
	height: '16px',
	borderRadius: '20px',
	border: '1.125px solid var(--secondary-font)',
	color: 'var(--secondary-font)',
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	fontSize: '12px',
	fontWeight: '500',
	lineHeight: 'normal',
	cursor: 'pointer',
	marginLeft: '8px',
};
const TooltipStyles = {
	body: {
		display: 'flex',
		width: '250px',
		padding: '12px',
		justifyContent: 'center',
		alignItems: 'center',
		gap: '10px',
		borderRadius: '8px',
		border: '1px solid var(--stroke, #2C2D2E)',
		background: 'var(--popup, #202123)',
		color: 'var(--primary-font)',
		fontFamily: 'var(--primary-font-family)',
		fontSize: '13px',
		fontStyle: 'normal',
		fontWeight: '500',
		lineHeight: '22px',
	},
};

const InfoToolTip = ({ text }) => {
	return (
		<Tooltip title={text} arrow={false} styles={TooltipStyles}>
			<span style={InnerStyles}>?</span>
		</Tooltip>
	);
};

export default memo(InfoToolTip);
