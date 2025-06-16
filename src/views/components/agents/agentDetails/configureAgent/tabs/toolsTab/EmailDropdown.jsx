import { Tooltip } from 'antd';
import { memo } from 'react';
import s from './emailDropdown.module.scss';
import { ReactComponent as TickSvg } from '../../../../../../../assets/svg/tick.svg';
import { ReactComponent as PlusSvg } from '../../../../../../../assets/svg/tasks/plus.svg';

const EmailDropdown = ({ children }) => {
	return (
		<Tooltip
			trigger={'click'}
			rootClassName={s.optionsDropdownTooltip}
			placement="bottomRight"
			arrow={false}
			color="transparent"
			title={
				<div className={s.dropdownOptionsContainer}>
					<div className={s.optionsContainer}>
						<div className={s.option}>
							<div className={s.textContainer}>{'Google Account'}</div>
							<TickSvg className={s.tickIcon} />
						</div>
						<div className={s.option}>
							<div className={s.textContainer}>{'Google Account'}</div>
						</div>

						{/* {options?.map((option, index) => {
							return (
								<div key={index} className={s.option}>
									<div className={s.textContainer}>{option || ''}</div>
									{value === option && <TickSvg />}
								</div>
							);
						})} */}
					</div>
					<hr className={s.divider} />
					<button className={s.addAccountContainer}>
						<PlusSvg className={s.plusIcon} />
						<div className={s.textContainer}>Add account</div>
					</button>
				</div>
			}
		>
			{children}
		</Tooltip>
	);
};

export default memo(EmailDropdown);
