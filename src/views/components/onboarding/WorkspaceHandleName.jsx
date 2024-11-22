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
	setWorkspaceHandleAndBusinessName,
	setIsWorkspaceHandleAvailable,
	incrementStep,
}) => {
	const {
		authInfo: { checkWorkspaceHandleAvailability },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isChecking: false,
		enterPressed: false,
	});

	useEffect(() => {
		if (workspaceHandle?.length > 1) {
			setInfo((prev) => ({ ...prev, isChecking: true }));
			const timeout = setTimeout(async () => {
				await handleCheckWorkspaceHandleAvailability(workspaceHandle);
				setInfo((prev) => ({ ...prev, isChecking: false }));
			}, 1000);

			return () => clearTimeout(timeout);
		}
		setIsWorkspaceHandleAvailable(false);
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
		const value = e?.target?.value?.toLowerCase() ?? '';
		setWorkspaceHandleAndBusinessName(value);
	};

	const handleNext = async (e, type) => {
		if ((e?.key === 'Enter' || type === 'click') && isWorkspaceHandleAvailable) {
			if (info?.enterPressed) return;
			setInfo((prev) => ({ ...prev, enterPressed: true }));
			if (!info?.isChecking && workspaceHandle?.length > 1 && isWorkspaceHandleAvailable) {
				console.log('handleNext');
			}
		}
	};

	useEffect(() => {
		console.log(
			'workspaceHandle',
			info?.isChecking || workspaceHandle?.length > 1 || !isWorkspaceHandleAvailable,
		);
	}, [info?.isChecking, workspaceHandle?.length, isWorkspaceHandleAvailable]);

	return (
		<div className="username-input-container workspace-handle-name-container stage2">
			<input
				className="workspace-handle-name-input"
				value={workspaceHandle}
				onChange={handleSetWorkspaceHandle}
				onKeyDown={handleNext}
				autoFocus={true}
				type="text"
				placeholder="workspace name"
			/>
			<button
				className="next-button"
				disabled={!isWorkspaceHandleAvailable}
				style={{
					cursor: !isWorkspaceHandleAvailable ? 'not-allowed' : 'pointer',
					background: !isWorkspaceHandleAvailable ? 'rgba(255, 255, 255, 0.1)' : 'white',
					transition: 'all 0.3s ease',
				}}
				onClick={() => handleNext(null, 'click')}
			>
				<div
					className="arrow-container"
					style={{
						transition: 'all 0.3s ease',
						transform: isWorkspaceHandleAvailable ? 'rotate(90deg)' : 'rotate(0deg)',
					}}
				>
					{isWorkspaceHandleAvailable ? <UpArrowBlackHover /> : <UpArrowGrey />}
				</div>
			</button>
		</div>
	);
};

export default memo(WorkspaceHandleName);
