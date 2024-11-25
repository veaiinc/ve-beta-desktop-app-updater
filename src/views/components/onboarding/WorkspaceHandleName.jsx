import React, { useState, memo, useRef, useEffect, useContext } from 'react';
import gsap from 'gsap';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';
import '../../../assets/scss/onboarding/index.scss';
import { message } from 'antd';
import Context from '../../../context/context';

const WorkspaceHandleName = ({
	workspaceHandle,
	isWorkspaceHandleAvailable,
	isCheckingWorkspaceHandle,
	setIsCheckingWorkspaceHandle,
	setWorkspaceHandleAndBusinessName,
	setIsWorkspaceHandleAvailable,
	animateStage2AndStep3Exit,
}) => {
	const {
		authInfo: { checkWorkspaceHandleAvailability },
	} = useContext(Context);

	const [info, setInfo] = useState({
		enterPressed: false,
	});

	useEffect(() => {
		if (workspaceHandle?.length > 1) {
			setIsCheckingWorkspaceHandle(true);
			const timeout = setTimeout(async () => {
				await handleCheckWorkspaceHandleAvailability(workspaceHandle);
				setIsCheckingWorkspaceHandle(false);
			}, 1000);

			return () => clearTimeout(timeout);
		}
		setIsWorkspaceHandleAvailable(false);
		setInfo((prev) => ({ ...prev, enterPressed: false }));
	}, [workspaceHandle]);

	const handleCheckWorkspaceHandleAvailability = async (workspaceHandle) => {
		const response = await checkWorkspaceHandleAvailability(workspaceHandle);
		if (response?.[0] === true) {
			const isAvailable = response?.[1]?.available;
			setIsWorkspaceHandleAvailable(isAvailable);
		} else {
			message.error(response?.[1]?.message);
		}
	};

	const handleSetWorkspaceHandle = (e) => {
		let value = e?.target?.value?.toLowerCase() ?? '';
		value = value.replace(/[^a-z0-9]/g, '');
		if (value.length > 20) {
			value = value.substring(0, 20);
			message.warning('Workspace handle cannot be longer than 20 characters', 1.5);
			return;
		}
		setWorkspaceHandleAndBusinessName(value);
	};

	const handleNext = async (e, type) => {
		if ((e?.key === 'Enter' || type === 'click') && isWorkspaceHandleAvailable) {
			if (info?.enterPressed) return;
			setInfo((prev) => ({ ...prev, enterPressed: true }));
			if (
				!isCheckingWorkspaceHandle &&
				workspaceHandle?.length > 1 &&
				isWorkspaceHandleAvailable
			) {
				animateStage2AndStep3Exit();
			}
		}
	};

	return (
		<div className="username-input-container workspace-handle-name-container stage2">
			<input
				className="workspace-handle-name-input"
				value={workspaceHandle}
				onChange={handleSetWorkspaceHandle}
				onKeyDown={handleNext}
				autoFocus={true}
				type="text"
				placeholder="workspace-name"
			/>
			<button
				className="next-button"
				disabled={!isWorkspaceHandleAvailable || isCheckingWorkspaceHandle}
				style={{
					cursor:
						!isWorkspaceHandleAvailable || isCheckingWorkspaceHandle
							? 'not-allowed'
							: 'pointer',
					background:
						!isWorkspaceHandleAvailable || isCheckingWorkspaceHandle
							? 'rgba(255, 255, 255, 0.1)'
							: 'white',
					transition: 'all 0.3s ease',
				}}
				onClick={() => handleNext(null, 'click')}
			>
				<div
					className="arrow-container"
					style={{
						transition: 'all 0.3s ease',
						transform:
							isWorkspaceHandleAvailable && !isCheckingWorkspaceHandle
								? 'rotate(90deg)'
								: 'rotate(0deg)',
					}}
				>
					{isWorkspaceHandleAvailable && !isCheckingWorkspaceHandle ? (
						<UpArrowBlackHover />
					) : (
						<UpArrowGrey />
					)}
				</div>
			</button>
		</div>
	);
};

export default memo(WorkspaceHandleName);
