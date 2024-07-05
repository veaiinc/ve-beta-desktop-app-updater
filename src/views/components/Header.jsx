import React, { memo, useState, useCallback } from 'react';
import '../../assets/scss/header.scss';
import { ReactComponent as VE } from '../../assets/svg/ve.svg';
import { useNavigate, useParams } from 'react-router-dom';
import HeadersDropDownComp from './dropDown/HeadersDropDownComp';
import SwitchWorkspaceModal from './modals/workspace/switchWorkspaceModal';

const Header = ({ title, hideQuickNav = false, setActiveWorkspaceId, activeWorkspaceId }) => {
	const navigate = useNavigate();
	const params = useParams();
	const accessibleWorkspaces = JSON.parse(localStorage.getItem('accessibleWorkspaces'));
	// const activeWorkspaceId = activeWorkspaceId;
	const [info, setInfo] = useState({
		switchWorkspaceModal: false,
		items: [
			{
				label: 'Company Profile',
				onClickFunc: async () => navigate('/workspace-settings/company-overview-settings'),
			},
			{
				label: 'My Profile',
				onClickFunc: async () => navigate('/my-profile'),
			},
			{
				label: 'Create Workspace',
				onClickFunc: async () => navigate('/create-workspace'),
			},
			{
				label: `Switch Workspace (${accessibleWorkspaces?.length})`,
				onClickFunc: () => setInfo((prev) => ({ ...prev, switchWorkspaceModal: true })),
			},
		],
	});

	const closeSwitchModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, switchWorkspaceModal: false }));
	}, [info?.switchWorkspaceModal]);

	return (
		<div className="headerContainer">
			<VE />
			{/* {header modules} */}
			{hideQuickNav ? (
				''
			) : (
				<div className="headerPlaceCenter">
					<div className="headerModulesContainer">
						<div
							className={`filterButton ${
								title === 'Inbox' ? 'filterButtonActive' : ''
							}`}
							onClick={() => navigate('/inbox')}
						>
							Inbox
						</div>
						<div
							className={`filterButton ${
								title === 'Sales' ? 'filterButtonActive' : ''
							}`}
							onClick={() => navigate('/sales')}
						>
							Sales
						</div>
					</div>
				</div>
			)}

			<HeadersDropDownComp
				selectedValue={activeWorkspaceId}
				options={info?.items}
				containerStyle={{
					padding: '10px 12px 10px 10px',
					gap: '6px',
					width: 'auto',
				}}
				dropDownStyle={{
					right: 0,
					top: '50px',
					left: 'unset',
					width: 'auto',
					height: 'auto',
					minWidth: '200px',
					minHeight: '200px',
				}}
				logoutOptions={true}
			/>
			<SwitchWorkspaceModal
				open={info?.switchWorkspaceModal}
				closeModal={closeSwitchModal}
				accessibleWorkspaces={accessibleWorkspaces}
				activeWorkspaceId={activeWorkspaceId}
			/>
		</div>
	);
};

export default memo(Header);
