import React, { useContext, useEffect, useState } from 'react';
import ReactModal from '../../../modalsV2';
import s from './switchWorkspaceModal.module.scss';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../../context/context';

const SwitchWorkspaceModal = ({ isOpen, closeWorkspaceModal }) => {
	const navigate = useNavigate();

	const [info, setInfo] = useState({
		searchWorkspace: '',
	});

	const {
		profileInfo: { userWorkSpaceList, getUserWorkSpaceList },
	} = useContext(Context);
	useEffect(() => {
		if (!userWorkSpaceList) {
			getUserWorkSpaceList();
		}
	}, [userWorkSpaceList]);

	const handleSwitchWorkspace = (activeWorkspaceId) => {
		localStorage.setItem('workspaceId', activeWorkspaceId);
		window.location.reload(true);
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={closeWorkspaceModal}
			modalType={'center'}
			customStyles={{
				overlay: { zIndex: 1001 },
				content: { borderRadius: '40px', zIndex: 1002 },
			}}
		>
			<div className={s.switchWorkspaceModal}>
				<header className={s.header}>
					<h1 className={s.title}>Switch Workspace</h1>
					<button
						className={s.closeButton}
						onClick={() => {
							closeWorkspaceModal();
							setInfo({ searchWorkspace: '' });
						}}
					>
						Close
					</button>
				</header>
				<div className={s.searchWorkspace}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="19"
						viewBox="0 0 18 19"
						fill="none"
					>
						<path
							d="M16.1488 15.8519L12.6283 12.3321C13.6487 11.1071 14.1575 9.53577 14.0489 7.94512C13.9403 6.35447 13.2226 4.86692 12.0452 3.79193C10.8678 2.71693 9.32124 2.13725 7.7273 2.17348C6.13336 2.2097 4.61474 2.85904 3.48737 3.98642C2.35999 5.1138 1.71065 6.63241 1.67442 8.22635C1.6382 9.82029 2.21788 11.3668 3.29287 12.5443C4.36787 13.7217 5.85542 14.4394 7.44607 14.548C9.03672 14.6566 10.608 14.1477 11.8331 13.1273L15.3529 16.6479C15.4052 16.7001 15.4672 16.7416 15.5355 16.7699C15.6038 16.7982 15.677 16.8127 15.7509 16.8127C15.8248 16.8127 15.898 16.7982 15.9662 16.7699C16.0345 16.7416 16.0966 16.7001 16.1488 16.6479C16.2011 16.5956 16.2426 16.5336 16.2708 16.4653C16.2991 16.397 16.3137 16.3238 16.3137 16.2499C16.3137 16.176 16.2991 16.1028 16.2708 16.0345C16.2426 15.9663 16.2011 15.9042 16.1488 15.8519ZM2.81336 8.37492C2.81336 7.37365 3.11027 6.39487 3.66655 5.56234C4.22282 4.72982 5.01348 4.08095 5.93853 3.69778C6.86358 3.31461 7.88148 3.21435 8.86351 3.40969C9.84554 3.60503 10.7476 4.08718 11.4556 4.79519C12.1636 5.50319 12.6458 6.40524 12.8411 7.38727C13.0364 8.3693 12.9362 9.3872 12.553 10.3123C12.1698 11.2373 11.521 12.028 10.6884 12.5842C9.85591 13.1405 8.87713 13.4374 7.87586 13.4374C6.53366 13.4359 5.24686 12.9021 4.29778 11.953C3.3487 11.0039 2.81485 9.71712 2.81336 8.37492Z"
							fill="#94989E"
						/>
					</svg>
					<input
						autoFocus
						type="text"
						placeholder="Search Workspace"
						value={info.searchWorkspace}
						onChange={(e) => setInfo({ ...info, searchWorkspace: e.target.value })}
					/>
				</div>
				<button
					onClick={() => navigate('/create-workspace')}
					className={s.createWorkspaceButton}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 18 18"
						fill="none"
					>
						<g clip-path="url(#clip0_171_2471)">
							<path
								d="M2.8125 9H15.1875"
								stroke="#79ECC9"
								stroke-width="1.125"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M9 2.8125V15.1875"
								stroke="#79ECC9"
								stroke-width="1.125"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</g>
						<defs>
							<clipPath id="clip0_171_2471">
								<rect width="18" height="18" fill="white" />
							</clipPath>
						</defs>
					</svg>
					<span>Create Workspace</span>
				</button>
				<div className={s.workspaceList}>
					{userWorkSpaceList
						?.filter(({ businessName }) =>
							businessName
								?.toLowerCase()
								.includes(info?.searchWorkspace?.toLowerCase()),
						)
						?.map(({ activeWorkspaceId, businessName, logo_s3_500w_key }) => (
							<button
								key={activeWorkspaceId}
								onClick={() => handleSwitchWorkspace(activeWorkspaceId)}
								className={s.workspaceItem}
							>
								<img
									className={s.workspaceLogo}
									src={logo_s3_500w_key}
									alt={businessName}
								/>
								<h2 className={s.workspaceName}>{businessName}</h2>
							</button>
						))}
				</div>
			</div>
		</ReactModal>
	);
};

export default SwitchWorkspaceModal;
