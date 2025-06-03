import { memo } from 'react';
import s from '../../../../../assets/scss/notes/dropdown/filterConditionDropdown.module.scss';
import { Tooltip } from 'antd';
import { ReactComponent as Tick } from '../../../../../assets/svg/tasks/tick.svg';

const FilterConditionDropdown = ({ conditions, selectedCondition, onChange, children }) => {
	return (
		<Tooltip
			title={
				<div className={s.filterConditionDropdown}>
					{conditions?.map((condition) => (
						<div
							key={condition.value}
							className={s.filterConditionDropdownItem}
							onClick={() => onChange(condition.value)}
						>
							{condition.label}
							{selectedCondition === condition.value && (
								<span className={s.filterConditionDropdownItemSelected}>
									<Tick />
								</span>
							)}
						</div>
					))}
				</div>
			}
			arrow={false}
			trigger={'click'}
			color={'transparent'}
			placement={'bottomLeft'}
			overlayStyle={{ minWidth: 'fit-content' }}
			destroyTooltipOnHide={true}
		>
			{children}
		</Tooltip>
	);
};

export default memo(FilterConditionDropdown);
