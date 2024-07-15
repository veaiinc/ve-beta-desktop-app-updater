import React, { memo, useState, useCallback, useContext, useEffect } from 'react';
import '../../assets/scss/header.scss';
import { ReactComponent as VE } from '../../assets/svg/ve.svg';
import { useNavigate } from 'react-router-dom';
import HeadersDropDownComp from './dropDown/HeadersDropDownComp';
import SwitchWorkspaceModal from './modalsV2/switchWorkspaceModal';
import Context from '../../context/context';

const Header = ({ title, hideQuickNav = false, activeWorkspaceId }) => {
	const {
		profileInfo: { userWorkSpaceList, getUserWorkSpaceList },
	} = useContext(Context);
	const navigate = useNavigate();
	const accessibleWorkspaces = JSON.parse(localStorage.getItem('accessibleWorkspaces'));

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
		activeBusniessName: '',
	});
	useEffect(() => {
		if (!userWorkSpaceList) {
			getUserWorkSpaceList();
		}
	}, []);

	useEffect(() => {
		if (userWorkSpaceList) {
			const activeBusniessName = userWorkSpaceList?.find(
				(item) => item.activeWorkspaceId === activeWorkspaceId,
			);
			setInfo((prev) => ({ ...prev, activeBusniessName }));
		}
	}, [userWorkSpaceList]);

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
				selectedValue={info?.activeBusniessName?.businessName}
				activeImage={info?.activeBusniessName?.logo_s3_500w_key}
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
				showIcon={true}
			/>
			<SwitchWorkspaceModal
				open={info?.switchWorkspaceModal}
				closeModal={closeSwitchModal}
				accessibleWorkspaces={userWorkSpaceList}
				activeWorkspaceId={info?.activeBusniessName?.businessName}
			/>
		</div>
	);
};

export default memo(Header);
