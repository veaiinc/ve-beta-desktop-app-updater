import { memo } from 'react';
import s from '../../../../../assets/scss/notes/dropdown/checkBoxFilterDropdown.module.scss';
import { ReactComponent as Tick } from '../../../../../assets/svg/tasks/tick.svg';

const options = [
	{ label: 'Checked', value: true },
	{ label: 'Unchecked', value: false },
];

const CheckBoxFilterDropdown = ({ value, title, onChange }) => {
	return (
		<div className={s.checkBoxFilterDropdown}>
			<div className={s.checkBoxFilterDropdownHeader}>
				<div className={s.checkBoxFilterDropdownHeaderTitle}>{title}</div>
			</div>
			<div className={s.checkBoxFilterDropdownBody}>
				{options.map((option) => (
					<div
						key={option.value}
						className={s.checkBoxFilterDropdownItem}
						onClick={() => onChange?.(option.value)}
					>
						{option.label} {value === option.value && <Tick />}
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(CheckBoxFilterDropdown);
