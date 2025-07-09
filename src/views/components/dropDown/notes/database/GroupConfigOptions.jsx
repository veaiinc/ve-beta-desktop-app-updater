import { memo } from 'react';
import s from '../../../../../assets/scss/notes/dropdown/groupConfigOptions.module.scss';
import { ReactComponent as Tick } from '../../../../../assets/svg/tasks/tick.svg';
import DatabaseIcon from '../../../notes/DatabseComponents/DatabaseIcon';

const GroupConfigOptions = ({ options = [], selectedOption, onChange }) => {
	return (
		<div className={s.groupConfigOptions}>
			{options.map((option) => (
				<div
					key={option.value}
					className={s.groupConfigOption}
					onClick={() => onChange(option)}
				>
					<span className={s.text}>
						<DatabaseIcon type={option?.value} />
						{option.label}
					</span>
					{selectedOption === option.value && <Tick />}
				</div>
			))}
		</div>
	);
};

export default memo(GroupConfigOptions);
