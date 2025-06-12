import { memo } from 'react';
import s from '../../../../../assets/scss/notes/dropdown/filterHelperDropdown.module.scss';
import { Tooltip } from 'antd';
import { ReactComponent as Tick } from '../../../../../assets/svg/tasks/tick.svg';

const FilterHelperDropdown = ({ options, selectedOption, onChange, children }) => {
	return (
		<Tooltip
			title={
				<div className={s.filterConditionDropdown}>
					{options?.map((option) => (
						<div
							key={option?.value}
							className={s.filterConditionDropdownItem}
							onClick={() => onChange(option?.value)}
						>
							{option?.label}
							{selectedOption === option?.value && (
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
			overlayStyle={{ minWidth: 'fit-content', zIndex: 50004 }}
			destroyTooltipOnHide={true}
		>
			<div className={s.filterHelperDropdown}>{children}</div>
		</Tooltip>
	);
};

export default memo(FilterHelperDropdown);
