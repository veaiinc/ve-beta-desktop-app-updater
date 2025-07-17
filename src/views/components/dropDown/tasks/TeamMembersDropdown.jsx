import { memo, useContext, useMemo, useState, useEffect } from 'react';
import '../../../../assets/scss/tasks/personMultiSelect.scss';
import Context from '../../../../context/context';
import { ReactComponent as Tick } from '../../../../assets/svg/tasks/tick.svg';
import jwtDecode from 'jwt-decode';
import Skeleton from 'react-loading-skeleton';

let userId;

const TeamMembersDropdown = memo(({ selected = [], onOptionClick, title }) => {
	const {
		companyInfo: { tenantsUserList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		search: '',
		loading: true,
	});

	useEffect(() => {
		const token = localStorage.getItem('usertoken');
		const { user_id } = jwtDecode(token);
		userId = user_id;
	}, []);

	useEffect(() => {
		setInfo((prevInfo) => ({ ...prevInfo, loading: false }));
	}, [tenantsUserList]);

	const handleSearchChange = (search) => {
		setInfo((prevInfo) => ({ ...prevInfo, search }));
	};

	const filteredTenantsUserList = useMemo(() => {
		if (!tenantsUserList) return [];
		let filtered = tenantsUserList.filter((item) => {
			const name = `${item?.firstName} ${item?.lastName || ''}`;
			return name?.toLowerCase()?.includes(info?.search?.toLowerCase());
		});
		// Move current user to top
		if (userId) {
			const idx = filtered.findIndex((item) => item?._id === userId);
			if (idx !== -1) {
				const [currentUser] = filtered.splice(idx, 1);
				filtered = [{ ...currentUser, isMe: true }, ...filtered];
			}
		}
		return filtered;
	}, [tenantsUserList, info?.search, userId]);

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
					{info?.loading ? (
						<>
							{[{}, {}, {}].map((item, idx) => (
								<Skeleton
									key={idx}
									height={32}
									style={{
										borderRadius: '10px',
									}}
								/>
							))}
						</>
					) : filteredTenantsUserList?.length > 0 ? (
						filteredTenantsUserList?.map((option) => {
							const isSelected = selected?.some((item) => item?._id === option?._id);
							return (
								<div
									className="person-multi-select-selected-item"
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
											{option?.isMe
												? 'Me'
												: `${option?.firstName} ${option?.lastName || ''}`}
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
