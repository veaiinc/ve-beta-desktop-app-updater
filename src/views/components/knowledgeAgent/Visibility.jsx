import React, { memo, useState, useEffect, useContext } from 'react';
import '../../../assets/scss/knowledgeAgent/visibility.scss';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as Check } from '../../../assets/svg/tasks/checkmark.svg';
import Context from '../../../context/context';
import { ReactComponent as PersonSvg } from '../../../assets/svg/tasks/person.svg';
import { message } from '../globalComponents/CustomToast';
import jwtDecode from 'jwt-decode';

import { Tooltip } from 'antd';
import Skeleton from 'react-loading-skeleton';

const accessOptions = [
	{
		label: 'Owner',
		value: 'owner',
		level: 0,
	},
	{
		label: 'Can edit',
		value: 'edit',
		level: 1,
	},
	{
		label: 'Can view',
		value: 'view',
		level: 2,
	},
	{
		label: 'Remove',
		value: 'remove',
		level: 3,
	},
];

const accessData = {
	owner: {
		label: 'Owner',
		value: 'owner',
		level: 0,
	},
	edit: {
		label: 'Can edit',
		value: 'edit',
		level: 1,
	},
	view: {
		label: 'Can view',
		value: 'view',
		level: 2,
	},
};

const Visibility = () => {
	const {
		companyInfo: { getTeamMembers, tenantsUserList },
		knowledgeAgent: {
			activeKnowledgeAssistant,
			updateVisibilityOfKnowledgeAgent,
			removeVisibilityOfKnowledgeAgent,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		search: '',
		teamMembers: [],
		accessMembers: [],
		myAccess: null,
	});

	useEffect(() => {
		if (tenantsUserList) {
			updateState({ teamMembers: tenantsUserList });
		} else {
			getTeamMembers();
		}
	}, [tenantsUserList]);

	useEffect(() => {
		if (activeKnowledgeAssistant && info?.teamMembers?.length > 0) {
			const access = activeKnowledgeAssistant?.data?.sharedWith;
			const mapper = new Map(info?.teamMembers?.map((item) => [item._id, item]));

			const token = localStorage.getItem('usertoken');
			const { user_id } = jwtDecode(token);
			let myAccess = null;

			const newAccessMembers = access?.map((item) => {
				const dataFromMapper = mapper?.get(item?.userId) || {};
				const accessInfo = {
					_id: dataFromMapper?._id,
					name: `${dataFromMapper?.firstName} ${dataFromMapper?.lastName || ''}`,
					email: dataFromMapper?.email,
					access: item?.access,
				};
				if (item?.userId === user_id) {
					myAccess = accessInfo;
					myAccess.level = accessData?.[item?.access]?.level;
				}
				return accessInfo;
			});
			updateState({ accessMembers: newAccessMembers, myAccess });
		}
	}, [activeKnowledgeAssistant, info?.teamMembers]);

	const updateState = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const handleChangeAccess = async (userId, value = 'view') => {
		let response = null;
		let rollBackInfo = info?.accessMembers;
		let newAccessInfo = info?.accessMembers?.map((item) => {
			if (item?._id === userId) {
				item.access = value;
			}
			return item;
		});
		if (value !== 'noAccess') {
			response = await updateVisibilityOfKnowledgeAgent(activeKnowledgeAssistant?.data?._id, {
				userId,
				access: value,
			});
		} else {
			response = await removeVisibilityOfKnowledgeAgent(
				activeKnowledgeAssistant?.data?._id,
				userId,
			);
		}
		if (response?.[0]) {
			updateState({ accessMembers: newAccessInfo });
		} else {
			message?.error(response?.[1]?.message || 'Failed to update visibility');
			updateState({ accessMembers: [...rollBackInfo] });
		}
	};

	return (
		<div className="knowledge-agent-visibility">
			<div className="visibility-header-wrapper">
				<h2 className="visibility-header-title">Share with your team</h2>
				<p className="visibility-header-description">
					Add your teammates and create a shared ownership for this agent
				</p>
			</div>

			<SearchDropdown options={info?.teamMembers} onOptionClick={handleChangeAccess} />

			<div className="access-members-container">
				{info?.accessMembers?.length > 0
					? info?.accessMembers
							?.filter(
								(member) =>
									member?.name
										?.toLowerCase()
										?.includes(info?.search?.toLowerCase()) ||
									member?.email
										?.toLowerCase()
										?.includes(info?.search?.toLowerCase()),
							)
							?.map((member) => (
								<div className="access-member-item" key={member?._id}>
									<div className="knowledge-agent-member-avatar">
										{member?.name?.charAt(0)?.toUpperCase()}
									</div>
									<div className="knowledge-agent-member-name">
										{member?.email}
									</div>
									{member?._id !== info?.myAccess?._id &&
									accessData[info?.myAccess?.access]?.level <=
										accessData[member?.access]?.level ? (
										<AccessDropdown
											selectedAccess={member?.access}
											onChange={(value) =>
												handleChangeAccess(member?._id, value)
											}
											myAccess={info?.myAccess}
											sameUser={member?._id === info?.myAccess?._id}
										/>
									) : (
										<div className="agent-visibility-dropdown-access my-access ">
											<span className="agent-visibility-dropdown-access-text">
												{accessData[member?.access]?.label}
											</span>
											<ChevronRightThinSvg
												style={{
													transform: info?.isOpen
														? 'rotate(-90deg)'
														: 'rotate(90deg)',
												}}
											/>
										</div>
									)}
								</div>
							))
					: [...Array(7)].map((_, index) => (
							<div key={index} className="access-member-item-skeleton">
								<Skeleton width="100%" height="36px" borderRadius="6px" />
							</div>
					  ))}
			</div>
		</div>
	);
};

export default memo(Visibility);

const AccessDropdown = memo(({ selectedAccess, onChange = () => {}, myAccess }) => {
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

	const handleOptionClick = (option) => {
		if (myAccess?.level > option?.level) {
			message?.error('You are not authorized to change this access');
			return;
		}
		onChange(option?.value);
		handleInfoChange({ isOpen: false });
	};

	return (
		<Tooltip
			title={
				<div className="notes-share-dropdown-access-tooltip">
					<div className="notes-share-dropdown-access-tooltip-options">
						{accessOptions?.map((option) => (
							<div
								key={option?.value}
								className={`notes-share-dropdown-access-tooltip-options-item ${
									myAccess?.level > option?.level ? 'disabled' : ''
								}`}
								onClick={() => {
									handleOptionClick(option);
								}}
							>
								<div className="notes-share-dropdown-access-tooltip-options-item-text">
									<span className="notes-share-dropdown-access-tooltip-text-label">
										{option?.label}
									</span>
								</div>
								{info?.selectedAccess?.value === option?.value && (
									<Check width={16} height={16} />
								)}
							</div>
						))}
					</div>
				</div>
			}
			arrow={false}
			placement="bottomRight"
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
				className="agent-visibility-dropdown-access"
				onClick={() => handleInfoChange({ isOpen: !info.isOpen })}
			>
				<span className="agent-visibility-dropdown-access-text">
					{info.selectedAccess?.label}{' '}
				</span>
				<ChevronRightThinSvg
					style={{ transform: info?.isOpen ? 'rotate(-90deg)' : 'rotate(90deg)' }}
				/>
			</div>
		</Tooltip>
	);
});

const SearchDropdown = memo(({ options = [], onOptionClick = () => {} }) => {
	const [info, setInfo] = useState({
		isOpen: false,
		search: '',
		dropDownOptions: [],
	});

	const handleSearch = (e) => {
		const searchValue = e?.target?.value?.toLowerCase?.() || '';

		const filteredOptions = options?.filter((option) => {
			const { firstName = '', lastName = '', email = '' } = option;

			return (
				firstName?.toLowerCase()?.includes(searchValue) ||
				lastName?.toLowerCase()?.includes(searchValue) ||
				email?.toLowerCase()?.includes(searchValue)
			);
		});

		setInfo((prev) => ({
			...prev,
			search: searchValue,
			dropDownOptions: filteredOptions,
			isOpen: e?.target?.value?.length > 0 && filteredOptions?.length > 0,
		}));
	};

	// useEffect(() => {
	// 	if (selectedAccess) {
	// 		const selectedAccessOption = accessOptions.find(
	// 			(option) => option.value === selectedAccess,
	// 		);
	// 		handleInfoChange({ selectedAccess: selectedAccessOption });
	// 	}
	// }, [selectedAccess]);

	const handleInfoChange = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	};

	return (
		<Tooltip
			title={
				<div className="notes-share-dropdown-access-tooltip access-search-dropdown-access-tooltip">
					<div className="notes-share-dropdown-access-tooltip-options">
						{info?.dropDownOptions?.map((option) => (
							<div
								key={option?._id}
								className="notes-share-dropdown-access-tooltip-options-item"
								onClick={() => {
									onOptionClick(option?._id, 'view');
									handleInfoChange({ isOpen: false });
								}}
							>
								<div className="notes-share-dropdown-access-tooltip-options-item-text">
									<span className="notes-share-dropdown-access-tooltip-text-label">
										{option?.email}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			}
			arrow={false}
			placement="bottomLeft"
			color="transparent"
			overlayStyle={{ minWidth: 'fit-content' }}
			trigger="click"
			open={info?.isOpen}
			onOpenChange={(open) => {
				if (!open) {
					handleInfoChange({ isOpen: false });
				}
			}}
		>
			<div className="knowledge-agent-search-wrapper">
				<span className="icon">
					<PersonSvg />
				</span>
				<input
					type="text"
					className="knowledge-agent-search-input"
					placeholder="Add name or email"
					onChange={handleSearch}
					value={info?.search}
				/>
			</div>
		</Tooltip>
	);
});
