import { memo, useState } from 'react';
import { Tooltip } from 'antd';
import { layouts } from '../../tasks/listView/TaskHeader';
import { ReactComponent as Dustbin } from '../../../../assets/svg/tasks/dustBin.svg';
import DuplicateSvg from '../../../../assets/svg/tasks/DuplicateSvg';
import { ReactComponent as Pencil } from '../../../../assets/svg/tasks/pencilWithLine.svg';
const tabTooltipContent = [
	{ label: 'Edit', value: 'edit', icon: <Pencil /> },
	{ label: 'Duplicate', value: 'duplicate', icon: <DuplicateSvg /> },
];

const TabEditDropdown = ({
	tab,
	activeTab,
	handleTabChange,
	handleTabDropdownClick,
	tabLength,
}) => {
	const [info, setInfo] = useState({
		showEditViewDropDown: false,
	});

	const handleStateChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const handleTabClick = (tab) => {
		if (tab?._id === activeTab) {
			handleStateChange({ showEditViewDropDown: !info?.showEditViewDropDown });
		} else {
			handleTabChange(tab);
		}
	};

	const customHandleTabDropdownClick = (option) => {
		handleTabDropdownClick(option);
		handleStateChange({ showEditViewDropDown: false });
	};

	return (
		<Tooltip
			title={
				<div className="tab-tooltip-content">
					{tabTooltipContent?.map((item, index) => (
						<div
							className="tab-tooltip-content-item"
							key={index}
							onClick={() =>
								customHandleTabDropdownClick({
									value: item?.value,
									tabId: tab?._id,
								})
							}
						>
							<div className="tab-tooltip-content-item-icon">{item?.icon}</div>
							<div className="tab-tooltip-content-item-label">{item?.label}</div>
						</div>
					))}
					{tabLength > 1 && (
						<div
							className="delete-view-container"
							onClick={() =>
								customHandleTabDropdownClick({ value: 'delete', tabId: tab?._id })
							}
						>
							<div className="delete-view-icon">
								<Dustbin />
							</div>
							<div className="delete-view-label">Delete</div>
						</div>
					)}
				</div>
			}
			key={tab?._id}
			arrow={false}
			trigger={'click'}
			color={'transparent'}
			overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
			style={{ padding: 0 }}
			placement="bottomLeft"
			open={info?.showEditViewDropDown}
			onOpenChange={(open) => {
				if (!open) {
					handleStateChange({ showEditViewDropDown: false });
				}
			}}
		>
			<div
				className={`tab-item ${activeTab === tab?._id && 'tab-active'}`}
				onClick={() => handleTabClick(tab)}
				// onContextMenu={(e) => {
				// 	e.preventDefault();
				// 	handleStateChange({ showEditViewDropDown: !info?.showEditViewDropDown });
				// }}
			>
				<div className="tab-icon">{layouts[tab?.viewType || tab?.type]?.Icon}</div>
				<div className="tab-title">{tab?.label}</div>
			</div>
		</Tooltip>
	);
};

export default memo(TabEditDropdown);
