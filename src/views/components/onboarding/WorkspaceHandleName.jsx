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
		isHovering: false,
		isChecking: false,
		enterPressed: false,
	});

	const workspaceHandleNameRef = useRef(null);

	useEffect(() => {
		gsap.fromTo(
			workspaceHandleNameRef?.current,
			{ opacity: 0 },
			{
				opacity: 1,
				duration: 0.5,
				ease: 'power2.inOut',
			},
		);
	}, []);

	useEffect(() => {
		console.log('workspaceHandle', workspaceHandle);
		if (workspaceHandle?.length > 1) {
			setInfo((prev) => ({ ...prev, isChecking: true }));
			const timeout = setTimeout(async () => {
				await handleCheckWorkspaceHandleAvailability(workspaceHandle);
				setInfo((prev) => ({ ...prev, isChecking: false }));
			}, 1000);

			return () => clearTimeout(timeout);
		}
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
		if (info?.enterPressed) return;
		setInfo((prev) => ({ ...prev, enterPressed: true }));
		if (
			(e?.key === 'Enter' || type === 'click') &&
			!info?.isChecking &&
			workspaceHandle?.length > 1 &&
			isWorkspaceHandleAvailable
		) {
			gsap.to(workspaceHandleNameRef.current, {
				opacity: 0,
				duration: 0.5,
				ease: 'power2.inOut',
				onComplete: () => {
					incrementStep();
				},
			});
		}
	};

	return (
		<div
			ref={workspaceHandleNameRef}
			className="username-input-container workspace-handle-name-container"
		>
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
				disabled={
					info?.isChecking || workspaceHandle?.length || !isWorkspaceHandleAvailable
				}
				style={{
					cursor:
						info?.isChecking || workspaceHandle?.length || !isWorkspaceHandleAvailable
							? 'not-allowed'
							: 'pointer',
					background:
						info?.isChecking || workspaceHandle?.length || !isWorkspaceHandleAvailable
							? 'rgba(255, 255, 255, 0.1)'
							: '',
				}}
				onMouseEnter={() => setInfo({ ...info, isHovering: true })}
				onMouseLeave={() => setInfo({ ...info, isHovering: false })}
				onClick={() => handleNext(null, 'click')}
			>
				{info?.isHovering ? (
					<span>
						<UpArrowBlackHover />
					</span>
				) : (
					<UpArrowGrey />
				)}
			</button>
		</div>
	);
};

export default memo(WorkspaceHandleName);
