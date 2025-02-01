// import { Tooltip } from 'antd';
// import React, { useContext, useState, useEffect } from 'react';
// import '../../../assets/scss/home_page/priorityDropDown.scss';
// import { ReactComponent as ChevronRightThinIcon } from '../../../assets/svg/tasks/chevronRightThin.svg';
// import Context from '../../../context/context';

// const optionItems = [
// 	{ id: 'all', label: 'All', checkBoxBorder: null },
// 	{ id: 'enquiry', label: 'Enquires', checkBoxBorder: '#FFB621' },
// 	{ id: 'counterSign', label: 'Counter Sign', checkBoxBorder: '#34908E' },
// 	{ id: 'emailApproval', label: 'Email Approvals', checkBoxBorder: '#004F65' },
// 	{ id: 'expiresInThreeDays', label: 'Expiring in 3 days', checkBoxBorder: '#FFD59E' },
// ];
// const PriorityDropDown = ({ selectedOption, handleOptionClick }) => {
// 	const [info, setInfo] = useState({
// 		dropdown: false,
// 	});

// 	let {
// 		templates: { getTabItemCount, tabItemCount },
// 	} = useContext(Context);

// 	useEffect(() => {
// 		if (!tabItemCount) {
// 			getTabItemCount();
// 		}
// 	}, []);

// 	const activeOption = optionItems?.find((item) => item?.id === selectedOption);
// 	const activeOptionLabel = activeOption?.label;
// 	const activeOptionCount = tabItemCount?.[activeOption?.id];

// 	return (
// 		<div className="priority-dropdown-container">
// 			<Tooltip
// 				placement="bottom"
// 				open={info?.dropdown}
// 				trigger={'click'}
// 				onOpenChange={(open) => setInfo({ ...info, dropdown: open })}
// 				color="transparent"
// 				title={
// 					<div className="priority-dropdown-options-container">
// 						{optionItems?.map((item) => (
// 							<div
// 								className="dropdown-option"
// 								onClick={() => {
// 									if (tabItemCount?.[item?.id] !== 0) {
// 										handleOptionClick(item?.id);
// 										setInfo((prev) => ({
// 											...prev,
// 											dropdown: false,
// 										}));
// 									}
// 								}}
// 								disabled={tabItemCount?.[item?.id] === 0}
// 								style={{
// 									opacity: tabItemCount?.[item?.id] === 0 ? 0.5 : 1,
// 									cursor:
// 										tabItemCount?.[item?.id] === 0 ? 'not-allowed' : 'pointer',
// 									userSelect: 'none',
// 								}}
// 								key={item?.id}
// 							>
// 								<span className="option-left">{item?.label}</span>
// 								<span className="option-right">{tabItemCount?.[item?.id]}</span>
// 							</div>
// 						))}
// 					</div>
// 				}
// 			>
// 				<button
// 					className="dropdown-header"
// 					onClick={() => setInfo({ ...info, dropdown: !info?.dropdown })}
// 				>
// 					{activeOptionLabel} {`(${activeOptionCount})`}
// 					<div className="icon-container">
// 						<ChevronRightThinIcon />
// 					</div>
// 				</button>
// 			</Tooltip>
// 		</div>
// 	);
// };

// export default PriorityDropDown;
