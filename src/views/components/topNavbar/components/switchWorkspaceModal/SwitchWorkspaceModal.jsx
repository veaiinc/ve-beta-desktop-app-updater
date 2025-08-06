import { useEffect, useMemo, useRef, useState } from 'react';
import ReactModal from '../../../modalsV2';
import s from './switchWorkspaceModal.module.scss';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { fetchDomainName } from '../../../../../helpers';
import useBroadcastChannel from '../../../../../hooks/useBroadcastChannel';

const customStyles = {
	overlay: { zIndex: 1001 },
	content: { borderRadius: '40px', zIndex: 1002 },
};

const intialState = {
	searchWorkspace: '',
	selectedWorkspaceIndex: 0,
};

const SwitchWorkspaceModal = ({ isOpen, closeWorkspaceModal, userWorkSpaceList }) => {
	const currentWorkspaceId = localStorage.getItem('workspaceId');
	const navigate = useNavigate();
	const selectedWorkspaceRef = useRef(null);
	const channel = useBroadcastChannel();
	const [info, setInfo] = useState(intialState);

	useEffect(() => {
		if (selectedWorkspaceRef.current) {
			selectedWorkspaceRef.current.scrollIntoView({
				behavior: 'instant',
				block: 'nearest',
			});
		}
	}, [info.selectedWorkspaceIndex]);

	useEffect(() => {
		if (isOpen) {
			setInfo(intialState);
		}
	}, [isOpen]);

	const workspaceList = useMemo(() => {
		const filteredList = userWorkSpaceList?.filter(({ businessName }) =>
			businessName?.toLowerCase().includes(info?.searchWorkspace?.toLowerCase()),
		);
		if (!filteredList) return [];
		const currentWorkspaceIndex = filteredList.findIndex(
			({ activeWorkspaceId }) => activeWorkspaceId === currentWorkspaceId,
		);
		if (currentWorkspaceIndex > 0) {
			const currentWorkspace = filteredList[currentWorkspaceIndex];
			const newList = [
				currentWorkspace,
				...filteredList.slice(0, currentWorkspaceIndex),
				...filteredList.slice(currentWorkspaceIndex + 1),
			];
			return newList;
		}

		return filteredList;
	}, [userWorkSpaceList, currentWorkspaceId, info?.searchWorkspace]);
	const showWorkspaceSearch = userWorkSpaceList?.length > 3;

	const handleSwitchWorkspace = (activeWorkspaceId, region) => {
		if (activeWorkspaceId === currentWorkspaceId) {
			closeWorkspaceModal();
			return;
		}
		localStorage.setItem('workspaceId', activeWorkspaceId);
		localStorage.setItem('region', region);
		const host = fetchDomainName();
		Cookies.set('workspaceId', activeWorkspaceId, {
			sameSite: 'lax',
			domain: host,
		});
		Cookies.set('region', region, {
			sameSite: 'lax',
			domain: host,
		});
		channel.postMessage('reload');
		window.location.hash = '/home';
		if (window.api && typeof window.api.reloadApp === 'function') {
			window.api.reloadApp();
		} else {
			window.location.reload();
		}
	};

	const handleKeyboardNavigation = (e) => {
		const maxIndex = workspaceList.length - 1;
		let newIndex = info.selectedWorkspaceIndex;

		if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter') {
			e.preventDefault();
			e.stopPropagation();
		}

		if (e.key === 'ArrowUp') {
			newIndex = newIndex === 0 ? maxIndex : newIndex - 1;
		} else if (e.key === 'ArrowDown') {
			newIndex = newIndex === maxIndex ? 0 : newIndex + 1;
		}

		if (e.key === 'Enter') {
			handleSwitchWorkspace(
				workspaceList[newIndex].activeWorkspaceId,
				workspaceList[newIndex].region,
			);
		}

		if (newIndex !== info.selectedWorkspaceIndex) {
			setInfo({ ...info, selectedWorkspaceIndex: newIndex });
		}
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={() => {
				closeWorkspaceModal();
				setInfo(intialState);
			}}
			modalType={'center'}
			customStyles={customStyles}
		>
			<div className={s.switchWorkspaceModal} onKeyDown={handleKeyboardNavigation}>
				<header className={s.header}>
					<h1 className={s.title}>Switch Workspace</h1>
					<button
						className={s.closeButton}
						onClick={() => {
							closeWorkspaceModal();
							setInfo(intialState);
						}}
					>
						Close
					</button>
				</header>
				{showWorkspaceSearch && (
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
							onChange={(e) =>
								setInfo((prev) => ({
									...prev,
									searchWorkspace: e.target.value,
									selectedWorkspaceIndex: 0,
								}))
							}
						/>
					</div>
				)}
				<button
					onClick={() => {
						closeWorkspaceModal();
						navigate('/create-workspace');
					}}
					className={s.createWorkspaceButton}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 18 18"
						fill="none"
					>
						<g clipPath="url(#clip0_171_2471)">
							<path
								d="M2.8125 9H15.1875"
								stroke="#79ECC9"
								strokeWidth="1.125"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M9 2.8125V15.1875"
								stroke="#79ECC9"
								strokeWidth="1.125"
								strokeLinecap="round"
								strokeLinejoin="round"
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
					{workspaceList?.map(
						({ activeWorkspaceId, businessName, logo_s3_500w_key, region }, index) => (
							<button
								key={activeWorkspaceId}
								onClick={() =>
									handleSwitchWorkspace(activeWorkspaceId, region, businessName)
								}
								className={`${s.workspaceItem} ${
									activeWorkspaceId === currentWorkspaceId
										? s.currentWorkspace
										: index === info.selectedWorkspaceIndex
										? s.selectedWorkspace
										: ''
								}`}
								ref={
									index === info.selectedWorkspaceIndex
										? selectedWorkspaceRef
										: null
								}
							>
								{logo_s3_500w_key ? (
									<img
										className={s.workspaceLogo}
										src={logo_s3_500w_key}
										alt={businessName}
									/>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="36"
										height="36"
										viewBox="0 0 20 20"
										fill="none"
									>
										<path
											d="M19.375 16.25H18.125V7.5C18.2908 7.5 18.4497 7.43415 18.5669 7.31694C18.6842 7.19973 18.75 7.04076 18.75 6.875C18.75 6.70924 18.6842 6.55027 18.5669 6.43306C18.4497 6.31585 18.2908 6.25 18.125 6.25H14.375V3.75C14.5408 3.75 14.6997 3.68415 14.8169 3.56694C14.9342 3.44973 15 3.29076 15 3.125C15 2.95924 14.9342 2.80027 14.8169 2.68306C14.6997 2.56585 14.5408 2.5 14.375 2.5H3.125C2.95924 2.5 2.80027 2.56585 2.68306 2.68306C2.56585 2.80027 2.5 2.95924 2.5 3.125C2.5 3.29076 2.56585 3.44973 2.68306 3.56694C2.80027 3.68415 2.95924 3.75 3.125 3.75V16.25H1.875C1.70924 16.25 1.55027 16.3158 1.43306 16.4331C1.31585 16.5503 1.25 16.7092 1.25 16.875C1.25 17.0408 1.31585 17.1997 1.43306 17.3169C1.55027 17.4342 1.70924 17.5 1.875 17.5H19.375C19.5408 17.5 19.6997 17.4342 19.8169 17.3169C19.9342 17.1997 20 17.0408 20 16.875C20 16.7092 19.9342 16.5503 19.8169 16.4331C19.6997 16.3158 19.5408 16.25 19.375 16.25ZM16.875 7.5V16.25H14.375V7.5H16.875ZM4.375 3.75H13.125V16.25H11.25V12.5C11.25 12.3342 11.1842 12.1753 11.0669 12.0581C10.9497 11.9408 10.7908 11.875 10.625 11.875H6.875C6.70924 11.875 6.55027 11.9408 6.43306 12.0581C6.31585 12.1753 6.25 12.3342 6.25 12.5V16.25H4.375V3.75ZM10 16.25H7.5V13.125H10V16.25ZM5.625 6.25C5.625 6.08424 5.69085 5.92527 5.80806 5.80806C5.92527 5.69085 6.08424 5.625 6.25 5.625H7.5C7.66576 5.625 7.82473 5.69085 7.94194 5.80806C8.05915 5.92527 8.125 6.08424 8.125 6.25C8.125 6.41576 8.05915 6.57473 7.94194 6.69194C7.82473 6.80915 7.66576 6.875 7.5 6.875H6.25C6.08424 6.875 5.92527 6.80915 5.80806 6.69194C5.69085 6.57473 5.625 6.41576 5.625 6.25ZM9.375 6.25C9.375 6.08424 9.44085 5.92527 9.55806 5.80806C9.67527 5.69085 9.83424 5.625 10 5.625H11.25C11.4158 5.625 11.5747 5.69085 11.6919 5.80806C11.8092 5.92527 11.875 6.08424 11.875 6.25C11.875 6.41576 11.8092 6.57473 11.6919 6.69194C11.5747 6.80915 11.4158 6.875 11.25 6.875H10C9.83424 6.875 9.67527 6.80915 9.55806 6.69194C9.44085 6.57473 9.375 6.41576 9.375 6.25ZM5.625 9.375C5.625 9.20924 5.69085 9.05027 5.80806 8.93306C5.92527 8.81585 6.08424 8.75 6.25 8.75H7.5C7.66576 8.75 7.82473 8.81585 7.94194 8.93306C8.05915 9.05027 8.125 9.20924 8.125 9.375C8.125 9.54076 8.05915 9.69973 7.94194 9.81694C7.82473 9.93415 7.66576 10 7.5 10H6.25C6.08424 10 5.92527 9.93415 5.80806 9.81694C5.69085 9.69973 5.625 9.54076 5.625 9.375ZM9.375 9.375C9.375 9.20924 9.44085 9.05027 9.55806 8.93306C9.67527 8.81585 9.83424 8.75 10 8.75H11.25C11.4158 8.75 11.5747 8.81585 11.6919 8.93306C11.8092 9.05027 11.875 9.20924 11.875 9.375C11.875 9.54076 11.8092 9.69973 11.6919 9.81694C11.5747 9.93415 11.4158 10 11.25 10H10C9.83424 10 9.67527 9.93415 9.55806 9.81694C9.44085 9.69973 9.375 9.54076 9.375 9.375Z"
											fill="var(--primary-font)"
										/>
									</svg>
								)}
								<h2 className={s.workspaceName}>{businessName}</h2>
							</button>
						),
					)}
				</div>
			</div>
		</ReactModal>
	);
};

export default SwitchWorkspaceModal;
