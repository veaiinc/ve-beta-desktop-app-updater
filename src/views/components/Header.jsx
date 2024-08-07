import React, { memo, useState, useCallback, useContext, useEffect } from 'react';
import '../../assets/scss/header.scss';
import { ReactComponent as VE } from '../../assets/svg/ve.svg';
import { useNavigate } from 'react-router-dom';
import HeadersDropDownComp from './dropDown/HeadersDropDownComp';
import SwitchWorkspaceModal from './modalsV2/switchWorkspaceModal';
import Context from '../../context/context';
import CreateLeadModal from './modalsV2/proposalModals/CreateLeadModal';

const newBtnActions = [{ label: 'Lead' }, { label: 'Smart File' }, { label: 'Workflow' }];

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
			},

			{
				label: 'My Profile',
			},
			{
				label: 'Create Workspace',
			},
			{
				label: `Switch Workspace (${accessibleWorkspaces?.length})`,
			},
		],
		activeBusniessName: '',
		createLeadModal: false,
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

	const onOptionChangeFunc = useCallback(
		async (data) => {
			const { label } = data;

			if (label === 'Company Profile') {
				return navigate('/workspace-settings/company-overview-settings');
			}
			if (label === 'My Profile') {
				return navigate('/my-profile');
			}
			if (label === 'Create Workspace') {
				return navigate('/create-workspace');
			} else {
				setInfo((prev) => ({ ...prev, switchWorkspaceModal: true }));
			}
		},
		[accessibleWorkspaces, info],
	);

	const optionChangeForNewBtn = useCallback(async (data) => {
		if (data?.label === 'Lead') {
			return setInfo((prev) => ({ ...prev, createLeadModal: true }));
		}
		if (data?.label === 'Smart File') {
		} else {
			navigate('/sales/workflows');
		}
		return;
	}, []);

	const closeCreateLeadModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, createLeadModal: false }));
	}, []);

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

			<div className="headersTopRightButtonsContainer">
				<HeadersDropDownComp
					selectedValue={'+ New'}
					activeImage={info?.activeBusniessName?.logo_s3_500w_key}
					options={newBtnActions}
					containerStyle={{
						width: 'auto',
						display: 'flex',
						transform: 'rotate(0.037deg)',
						padding: '8px 16px',
						justifyContent: 'center',
						alignItems: 'center',
						gap: '10px',
						alignSelf: 'stretch',
						borderRadius: '100px',
						background: 'rgba(96, 85, 236, 0.12)',
					}}
					dropDownStyle={{
						top: '50px',
						left: 'unset',
						width: 'auto',
						height: 'auto',
						minWidth: '200px',
					}}
					outerContainerStyle={{ width: 'auto' }}
					showArrow={false}
					containerClassName="newHeaderBtn"
					activeHeaderStyling={{ backgroundColor: '#6055EC' }}
					onChangeFunc={(e) => optionChangeForNewBtn(e)}
				/>

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
					outerContainerStyle={{ width: 'auto' }}
					logoutOptions={true}
					showIcon={true}
					onMouseHoverFunc={true}
					onChangeFunc={(e) => onOptionChangeFunc(e)}
				/>
			</div>
			<SwitchWorkspaceModal
				open={info?.switchWorkspaceModal}
				closeModal={closeSwitchModal}
				accessibleWorkspaces={userWorkSpaceList}
				activeWorkspaceId={info?.activeBusniessName?.businessName}
			/>
			<CreateLeadModal
				modalIsOpen={info?.createLeadModal}
				closeModal={closeCreateLeadModal}
			/>
		</div>
	);
};

export default memo(Header);
