import { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import '../../../../assets/scss/tasks/personMultiSelect.scss';
import InfiniteScroll from '../../globalComponents/InfiniteScroll';
import Context from '../../../../context/context';
import { ReactComponent as Tick } from '../../../../assets/svg/tasks/tick.svg';

const TeamMembersDropdown = memo(({ selected = [], onOptionClick, title }) => {
	const {
		companyInfo: { tenantsUserList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		search: '',
	});

	const handleSearchChange = (search) => {
		setInfo((prevInfo) => ({ ...prevInfo, search }));
	};
	const filteredTenantsUserList = useMemo(() => {
		return tenantsUserList?.filter((item) => {
			const name = `${item?.firstName} ${item?.lastName || ''}`;
			return name?.toLowerCase()?.includes(info?.search?.toLowerCase());
		});
	}, [tenantsUserList, info?.search]);

	return (
		<div className="person-drop-down-container" onClick={(e) => e?.stopPropagation()}>
			<div className="person-drop-down-header">
				<div className="person-drop-down-title">{title}</div>
				<div className="person-dropdown-menu-header-search">
					<input
						type="text"
						placeholder="Search..."
						value={info?.search}
						onChange={(e) => handleSearchChange(e?.target?.value)}
					/>
				</div>
			</div>
			<div className="person-drop-down-body">
				<div className="person-drop-down-body-list">
					{filteredTenantsUserList?.length > 0 ? (
						filteredTenantsUserList?.map((option) => {
							const isSelected = selected.some((item) => item?._id === option?._id);
							return (
								<div
									className={`person-multi-select-selected-item ${
										isSelected ? 'selected' : ''
									}`}
									key={option?._id}
									onClick={(e) => {
										e?.stopPropagation();
										onOptionClick?.({
											name:
												option?.firstName + ' ' + (option?.lastName || ''),
											_id: option?._id,
										});
									}}
								>
									<div className="person-multi-select-selected-item-avatar">
										{option?.firstName?.charAt(0)}
									</div>
									<div className="person-multi-select-selected-item-name">
										<span className="person-multi-select-selected-item-name-text">
											{option?.firstName}{' '}
											{option?.lastName && option?.lastName}
										</span>
									</div>
									<div className="select-option-item-tick-wrapper">
										{isSelected && <Tick />}
									</div>
								</div>
							);
						})
					) : (
						<span className="no-data-error-text">No team members</span>
					)}
				</div>
			</div>
		</div>
	);
});

export default TeamMembersDropdown;
