import React from 'react';
import '../../../../assets/scss/tasks/status.scss';

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
			{/* <div className="status-dropdown-header-wrapper">
				<span className="select-listItem">
					<span
						className="select-listItem-color"
						style={{
							backgroundColor: colors?.[selected?.color]?.color,
						}}
					></span>
					<span className="select-listItem-label">
						{selected?.[labelField] || (!value ? 'Select status' : '')}
					</span>
				</span>
			</div> */}
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
								<span
									key={option?._id}
									className="select-listItem"
									onClick={() => {
										onOptionClick(option?._id);
									}}
								>
									<span
										className="select-listItem-color"
										style={{
											backgroundColor: colors?.[option?.color]?.color,
										}}
									></span>
									<span className="select-listItem-label">{option?.label}</span>
								</span>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default StatusDropdown;
