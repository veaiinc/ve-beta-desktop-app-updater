import { memo, useState } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import { Tooltip } from 'antd';
import TextFilter from '../../dropDown/tasks/TextFilter';
const TextField = ({ value, onChange, tooltipPlacement = 'bottom', title = 'text' }) => {
	const [info, setInfo] = useState({
		isOpen: false,
	});

	const handleStateChange = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	};
	return (
		<Tooltip
			title={<TextFilter value={value} onChange={onChange} title={title} />}
			arrow={false}
			trigger={'click'}
			color="transparent"
			placement={tooltipPlacement}
			overlayStyle={{ minWidth: 'fit-content' }}
			open={info?.isOpen}
			onOpenChange={(isOpen) => handleStateChange({ isOpen })}
			destroyTooltipOnHide
		>
			<div
				className="text-field filter-wrapper"
				onClick={() => handleStateChange({ isOpen: !info?.isOpen })}
			>
				{value}
			</div>
		</Tooltip>
	);
};

export default memo(TextField);
