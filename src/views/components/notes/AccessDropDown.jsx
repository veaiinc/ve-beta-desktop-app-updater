import { memo, useState, useEffect } from 'react';
import { Tooltip } from 'antd';
import '../../../assets/scss/notes/shareComponent.scss';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as Check } from '../../../assets/svg/tasks/checkmark.svg';

const accessOptions = [
	{
		label: 'Full access',
		value: 'full',
		description: 'Edit, comment and share with others',
	},
	{
		label: 'Can edit',
		value: 'edit',
		description: 'Edit, suggest and comment',
	},
	{
		label: 'Can view',
		value: 'view',
	},
];

const AccessDropdown = memo(({ selectedAccess, showRemoveButton = true, onChange = () => {} }) => {
	const [info, setInfo] = useState({
		isOpen: false,
		selectedAccess: null,
	});

	useEffect(() => {
		if (selectedAccess) {
			const selectedAccessOption = accessOptions.find(
				(option) => option.value === selectedAccess,
			);
			handleInfoChange({ selectedAccess: selectedAccessOption });
		}
	}, [selectedAccess]);

	const handleInfoChange = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	};

	return (
		<Tooltip
			title={
				<div className="notes-share-dropdown-access-tooltip">
					<div className="notes-share-dropdown-access-tooltip-options">
						{accessOptions?.map((option) => (
							<div
								key={option?.value}
								className="notes-share-dropdown-access-tooltip-options-item"
								onClick={() => {
									onChange(option?.value);
									handleInfoChange({ isOpen: false });
								}}
							>
								<div className="notes-share-dropdown-access-tooltip-options-item-text">
									<span className="notes-share-dropdown-access-tooltip-text-label">
										{option?.label}
									</span>
									{option?.description && (
										<span className="notes-share-dropdown-access-tooltip-text-description">
											{option?.description}
										</span>
									)}
								</div>
								{info?.selectedAccess?.value === option?.value && (
									<Check width={16} height={16} />
								)}
							</div>
						))}
					</div>
					{showRemoveButton && (
						<div className="notes-share-dropdown-access-tooltip-footer">
							<button
								className="notes-share-dropdown-access-tooltip-footer-button"
								onClick={() => {
									onChange('remove');
									handleInfoChange({ isOpen: false });
								}}
							>
								Remove
							</button>
						</div>
					)}
				</div>
			}
			arrow={false}
			placement="bottomLeft"
			color="transparent"
			overlayStyle={{
				minWidth: '256px',
			}}
			trigger="click"
			open={info?.isOpen}
			onOpenChange={(open) => {
				if (!open) {
					handleInfoChange({ isOpen: false });
				}
			}}
		>
			<div
				className="notes-share-dropdown-access"
				onClick={() => handleInfoChange({ isOpen: !info.isOpen })}
			>
				<span className="notes-share-dropdown-access-text">
					{info.selectedAccess?.label}{' '}
				</span>
				<ChevronRightThinSvg
					style={{ transform: info?.isOpen ? 'rotate(-90deg)' : 'rotate(90deg)' }}
				/>
			</div>
		</Tooltip>
	);
});

export default AccessDropdown;
