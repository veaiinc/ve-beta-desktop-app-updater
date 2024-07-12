import React, { useState, useEffect, useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import { ReactComponent as CrossIcon } from '../../../assets/svg/workspaceSettings/cross.svg';
import { ReactComponent as LockIcon } from '../../../assets/svg/workspaceSettings/lock-big.svg';
import { ReactComponent as CheckIcon } from '../../../assets/svg/workspaceSettings/checkmark-green.svg';
import { ReactComponent as Shield } from '../../../assets/svg/workspaceSettings/shield-gray.svg';
import InputNew from '../../components/input/inputNew';
import validator from 'validator';
import { ReactComponent as PreviousIcon } from '../../../assets/svg/workspaceSettings/back3.svg';
import Context from '../../../context/context';

const AddNewUserModal = (props) => {
	const {
		companyInfo: { getTeamMembers, inviteNewuser },
	} = useContext(Context);
	const [state, setState] = useState({
		isLoading: false,
		isTenantInvitedLoading: false,
		sentInviteStep: props.step,
		emailID: props.email,
		errorMessage: '',
		isAdmin: props.isAdmin,
		isOwner: props.isOwner,
		tenantUser: props.tenantUser,
		tenantUserIsOwner: false,
		tenantTempUserRole: props.role === 'admin' ? 'admin' : 'default',

		accessInfoDesc: {
			project: [
				`This member won't see the project module but can access other parts of the workspace they're allowed to use.`,
				`This allows them to use the projects module. However, they'll only see projects they're part of or ones they create. They won't see all the projects unless they're added to them`,
				`With this setting enabled, they can freely access all projects in the workspace, even if they haven't been added to them individually.`,
			],
			gallery: [
				`This member won't see the gallery module but can access other parts of the workspace they're allowed to use.`,
				` This allows them to use the gallery module. However, they'll only see galleries they're part of or ones they create. They won't see all the galleries unless they're added to them.`,
				`With this setting enabled, they can freely access all galleries in the workspace, even if they haven't been added to them individually.`,
			],
			proposal: [
				`This member won't see the proposal module but can access other parts of the workspace they're allowed to use.`,
				`This allows them to use the proposal module. But they'll only see the proposals they create. They can use all templates, but can't edit the ones they didn't create.`,
				` With this setting enabled, they can freely access all proposals and templates in the workspace.`,
			],
			form: [
				`This member won't see the form section but can access other parts of the workspace they're allowed to use.`,
				`This allows them to use the forms module. However, they'll only view forms they create.`,
				`With this setting enabled, they can freely access all forms in the workspace, even if they haven't created them.`,
			],
		},
	});

	useEffect(() => {
		console.log('this is called ');
	}, []);
	const validateInput = (e) => {
		const { name, value } = e.target;
		const errorName = name + 'Error';
		const errorMessageKey = name + 'ErrorMessage';

		if (value === '') {
			setState((prevState) => ({
				...prevState,
				[name]: value,
				[errorName]: true,
				[errorMessageKey]: 'Required Field!',
				errorMessage: '',
			}));
		} else {
			setState((prevState) => ({
				...prevState,
				[name]: value,
				[errorName]: false,
				[errorMessageKey]: '',
				errorMessage: '',
			}));
		}
	};
	const validateEmail = () => {
		if (!state?.emailID || state?.emailID.trim() === '') {
			setState((prevState) => ({
				...prevState,
				emailIDError: true,
				emailIDErrorMessage: 'Required Field!',
			}));
			return;
		}

		if (!validator.isEmail(state?.emailID)) {
			setState((prevState) => ({
				...prevState,
				emailIDError: true,
				emailIDErrorMessage: 'Please enter a valid email address',
			}));
			return;
		}

		let isExisting = false;
		let userType = '';
		let userId = '';
		console.log(state.tenantUser, 'this are the tenantUser');
		const isUserExisting = state?.tenantUser.find(
			(o) =>
				(o.email && o.email === state?.emailID) ||
				(o.inviteeEmail && o.inviteeEmail === state?.emailID),
		);
		console.log(isUserExisting, 'this are the isUserExit');

		if (isUserExisting) {
			userId = isUserExisting._id;
			userType = isUserExisting.email ? 'active' : 'invited';
			isExisting = true;
		}

		if (!isExisting) {
			setState((prevState) => ({
				...prevState,
				sentInviteStep: 2,
				emailIDError: false,
				emailIDErrorMessage: '',
			}));
		} else if (userType === 'active') {
			setState((prevState) => ({
				...prevState,
				activeUserId: userId,
				sentInviteStep: 3,
				emailIDError: false,
				emailIDErrorMessage: '',
			}));
		} else if (userType === 'invited') {
			setState((prevState) => ({
				...prevState,
				activeUserId: userId,
				sentInviteStep: 4,
				emailIDError: false,
				emailIDErrorMessage: '',
			}));
		}
	};
	const InviteNewUser = async () => {
		props.close();
		const payload = {
			email: state.emailID,
			role: 'admin',
			accessControls: [
				{
					app: 'form',
					isEnabled: true,
					hasFullAccess: true,
				},
				{
					app: 'project',
					isEnabled: true,
					hasFullAccess: true,
					hasFinanceAccess: false,
				},
				{
					app: 'proposal',
					isEnabled: true,
					hasFullAccess: true,
				},
				{
					app: 'gallery',
					isEnabled: true,
					hasFullAccess: true,
				},
			],
		};
		inviteNewuser(payload);
		getTeamMembers();
	};

	const handleOnBlurEmail = (e) => {
		const { name, value } = e.target;
		const errorName = name + 'Error';
		const errorMessageKey = name + 'ErrorMessage';

		const isEmailValid = validator.isEmail(value.trim());

		if (!isEmailValid) {
			setState((prevState) => ({
				...prevState,
				[name]: value,
				[errorName]: true,
				[errorMessageKey]: 'Please enter correct email',
				errorMessage: '',
			}));
		}
	};

	const renderSendInviteEmail = () => {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					backgroundColor: '#383838',
					padding: '24px',
					borderRadius: '12px',
				}}
			>
				<div className="send-invite-msg">
					<p>Invite Member to Workspace</p>
					<span>
						Members you invite will have full access to your workspace unless you
						customise user roles according to your needs.
					</span>
				</div>
				<div className={'form-InputContainer'} style={{ marginBottom: '27px' }}>
					<InputNew
						placeholder={'email@domain.com'}
						type={'text'}
						name={'emailID'}
						onChange={(e) => validateInput(e)}
						value={state.emailID}
						isInputError={state.emailIDError}
						errorMessage={state.emailIDErrorMessage}
						width={'100%'}
						onBlur={(e) => handleOnBlurEmail(e)}
					/>
				</div>

				<div
					style={{ marginTop: '10px', position: 'relative' }}
					className={'form-button-container'}
				>
					<p style={{ fontSize: '10px', clear: 'both', color: 'red' }}>
						{state.errorMessage}
					</p>
				</div>
				<div className={'modal_foooter'}>
					<div className={'next_button'} onClick={() => validateEmail()}>
						<span>Next</span>
						<span className="next-back-icon">
							<PreviousIcon />
						</span>
					</div>
				</div>
			</div>
		);
	};

	const renderActiveUser = () => {
		return (
			<div
				style={{
					marginTop: '0px',
					backgroundColor: '#383838',
					padding: '24px',
					borderRadius: '12px',
				}}
				className="userDetailsContainer"
			>
				<div
					style={{ width: '100%', marginBottom: '45px' }}
					className="accessControlsContainer"
				>
					<div className="active-invited-user-container" style={{ color: '#fff' }}>
						<b>{state?.emailID + ' '}</b> is already added to your workspace as a
						Member.
					</div>
				</div>
				<div className={'modal_foooter'}>
					<div
						className={'back_button'}
						onClick={() => setState((prev) => ({ ...prev, sentInviteStep: 1 }))}
					>
						<span className="next-back-icon">
							<PreviousIcon />
						</span>
						<span>Back</span>
					</div>
				</div>
			</div>
		);
	};

	const renderInvitedUser = () => {
		return console.log('this is not coded');
	};

	const renderAccessControls = () => {
		return (
			<div style={{ height: '85vh', overflow: 'auto', maxHeight: '1169px' }}>
				<div
					style={{
						display: 'flex',
						width: '100%',
						justifyContent: 'space-between',
						alignItems: 'center',
						backgroundColor: '#111111',
						borderTopRightRadius: '40px',
						borderTopLeftRadius: '40px',
						padding: '2rem 2rem 0 2rem',
						maxWidth: '720px',
					}}
				>
					<div style={{ display: 'flex', gap: '20px' }}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '10px',
								justifyContent: 'center',
							}}
						>
							<div
								style={{
									fontSize: '16px',
									fontStyle: 'Inter',
									color: '#e4e5e6',
								}}
							>
								Invite Member to Workspace
							</div>
							<div
								style={{
									fontSize: '13px',
									fontStyle: 'Inter',
									color: '#a6a6a6',
								}}
							>
								Members you invite will have full access to your workspace unless
								you customise user roles according to your needs.
							</div>
						</div>
					</div>
					<span
						style={{ cursor: 'pointer' }}
						onClick={async () => {
							props.close();
							// await this.getTeamMembers('users');
						}}
					>
						<CrossIcon />
					</span>
				</div>
				<div
					className="profile-role-wrapper"
					style={{
						backgroundColor: '#111111',
						padding: '2rem 2rem 0 2rem',
						maxWidth: '720px',
						width: '100%',
					}}
				>
					<div className="profile-role-container">
						<div className="profile-left-header-container">
							<div className="profile-role-header-title">Role</div>
						</div>
						{state.tenantUserIsOwner === true ? (
							<div className="right-profile-role-admin-container">SUPER ADMIN</div>
						) : state.tenantTempUserRole === 'admin' && state.isOwner === false ? (
							<div className="right-profile-role-admin-container">ADMIN</div>
						) : state.isOwner === true ? (
							<div className="right-profile-role-toggle-container">
								<div className="forground-text-container">
									<span
										className={
											state.tenantTempUserRole === 'admin'
												? 'role-text active'
												: 'role-text'
										}
										// onClick={() => {
										// 	this.handleChangeUserRole('admin');
										// }}
									>
										ADMIN
									</span>
								</div>
								<div
									className={
										state.tenantTempUserRole !== 'admin'
											? 'active-button-bg active-button-bg-active'
											: 'active-button-bg'
									}
								></div>
							</div>
						) : (
							<div className="right-profile-role-admin-container">MEMBER</div>
						)}
						<div
							style={{
								height: '1px',
								backgroundColor: '#2827287A',
								margin: '40px 0 0 0',
							}}
						/>
					</div>
					{state.tenantUserIsOwner === true || state.tenantTempUserRole === 'admin' ? (
						<div
							className="access-permissions-container"
							style={{
								backgroundColor: '#111111',
								padding: '2rem 2rem 2rem 2rem',
								maxWidth: '720px',
								width: '100%',
							}}
						>
							<div className="access-control-info">
								<Shield />
								{state.accessInfoDesc['project'][0]}
							</div>
						</div>
					) : (
						''
					)}
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						padding: '0 24px 24px 24px',
						width: '100%',
						backgroundColor: '#111111',
						borderBottomRightRadius: '40px',
						borderBottomLeftRadius: '40px',
						// padding: '0 2rem 2rem 2rem',
						maxWidth: '720px',
						width: '100%',
					}}
				>
					<div style={{ width: '100%' }}>
						<div
							style={{
								border: '1px solid #242424A3',
								color: '#e4e5e6',
								backgroundColor: '#181818',
								cursor: 'pointer',
								borderRadius: '100px',
								padding: '16px 24px',
								height: '48px',
								// marginTop: '1rem',
								// display: 'inline-block',
								fontSize: '13px',
								fontFamily: 'Inter',
								textAlign: 'center',
							}}
							onClick={() => InviteNewUser()}
						>
							<div>
								<span>Save Changes</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const validateAddTenantUser = () => {
		// Implementation of validateAddTenantUser function
	};

	return (
		<>
			{state.isLoading || state.isTenantInvitedLoading ? (
				<Skeleton width={800} height={240} />
			) : (
				<>
					{props.isAdmin === true ? (
						<div style={{ overflowY: 'overlay' }} className={'invite-container'}>
							<div className="profile-setting-outer-container new-wrapper">
								{state.sentInviteStep === 1
									? renderSendInviteEmail()
									: state.sentInviteStep === 3
									? renderActiveUser()
									: state.sentInviteStep === 4
									? renderInvitedUser()
									: state.sentInviteStep === 2
									? renderAccessControls()
									: null}
								<div
									style={{ marginTop: '10px', position: 'relative' }}
									className={'form-button-container'}
								>
									<p style={{ fontSize: '10px', clear: 'both', color: 'red' }}>
										{state.errorMessage}
									</p>
								</div>
							</div>
						</div>
					) : (
						<div className={'new-no-access-modal-container'}>
							<div className="inner-no-access-wrapper">
								<div className="lock-icon">
									<LockIcon />
								</div>
								<div className="middle-title-desc-no-access">
									<div className="no-access-title">
										This action is not allowed
									</div>
									<div className="no-access-desc">
										You do not have the necessary access to perform this action.
										Please contact your account admin
									</div>
								</div>
								<div
									className="bottom-btn-no-access-okay"
									onClick={(e) => props.close(e)}
								>
									<span className="okay-icon">
										<CheckIcon />
									</span>
									<span className="okay-text">Okay</span>
								</div>
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
};

export default AddNewUserModal;
