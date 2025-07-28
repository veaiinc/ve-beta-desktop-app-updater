import { memo, useState } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import { Tooltip } from 'antd';
import TextFilter from '../../dropDown/tasks/TextFilter';
const TextField = ({
	value,
	onChange,
	tooltipPlacement = 'bottom',
	title = 'text',
	prefix = '',
	maxWidth = false,
}) => {
	const [info, setInfo] = useState({
		isOpen: false,
	});

	const handleStateChange = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	};
	return (
		<Tooltip
			title={<TextFilter value={value} onChange={onChange} title={title} prefix={prefix} />}
			arrow={false}
			trigger={'click'}
			color="transparent"
			placement={tooltipPlacement}
			overlayStyle={{ minWidth: 'fit-content' }}
			open={info?.isOpen}
			onOpenChange={(isOpen) => handleStateChange({ isOpen })}
			destroyOnHidden={true}
		>
			<div
				className={`text-field filter-wrapper ${maxWidth ? 'max-width' : ''}`}
				onClick={(e) => {
					e.stopPropagation();
					handleStateChange({ isOpen: !info?.isOpen });
				}}
			>
				{title === 'Id' && prefix ? `${prefix} - ` : ''}
				{value}
			</div>
		</Tooltip>
	);
};

export default memo(TextField);
