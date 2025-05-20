import { memo } from 'react';
import '../../../../assets/scss/tasks/status.scss';
import Tick from '../../../../assets/svg/tasks/tick.svg?react';

const StatusDropdown = ({
	colors,
	options,
	selected,
	onOptionClick,
	labelField = 'label',
	valueField = 'value',
}) => {
	return (
		<div className="status-dropdown-container" onClick={(e) => e?.stopPropagation()}>
			<div className="status-dropdown-header">
				<div className="status-dropdown-header-text">Status</div>
			</div>

			<div className="status-dropdown-body-wrapper">
				{[
					{
						group: 'To-do',
						options: options.todo || [],
					},
					{
						group: 'InProgress',
						options: options.inProgress || [],
					},
					{
						group: 'Completed',
						options: options.completed || [],
					},
				]?.map((item, index) => (
					<div
						className={`status-option-container ${
							!(index === 2) ? 'border-bottom' : ''
						}`}
						key={item?.group}
					>
						<div className="option-heading">{item?.group}</div>
						<div className="option-list">
							{item?.options?.map((option) => (
								<div
									key={option?._id}
									className={`select-listItem ${
										selected === option?._id ? 'selected' : ''
									}`}
									onClick={() => {
										onOptionClick(option?._id);
									}}
								>
									<div className="select-listItem-tag-wrapper">
										<div className="select-option-item">
											<div
												className="select-listItem-color"
												style={{
													backgroundColor: colors?.[option?.color]?.color,
												}}
											/>
											<div className="select-option-item-wrapper">
												<div className="select-option-label-wrapper">
													<div className="select-listItem-label">
														{option?.label}
													</div>
												</div>
												<div className="select-option-item-tick-wrapper">
													{selected === option?._id && <Tick />}
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(StatusDropdown);
