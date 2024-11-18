import React, { useState, memo, useRef, useEffect, useContext } from 'react';
import gsap from 'gsap';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';
import '../../../assets/scss/onboarding/index.scss';
import { message } from 'antd';
import Context from '../../../context/context';

const WorkspaceHandleName = ({ onboardingInfo, setOnboardingInfo }) => {
	const {
		authInfo: { checkWorkspaceHandleAvailability },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isHovering: false,
		isChecking: false,
	});

	const workspaceHandleNameRef = useRef(null);

	useEffect(() => {
		gsap.fromTo(
			workspaceHandleNameRef.current,
			{ opacity: 0 },
			{
				opacity: 1,
				duration: 0.5,
				ease: 'power2.inOut',
			},
		);
	}, []);

	useEffect(() => {
		if (onboardingInfo?.workspaceHandle?.length > 1) {
			setInfo((prev) => ({ ...prev, isChecking: true }));
			const timeout = setTimeout(async () => {
				await handleCheckWorkspaceHandleAvailability(onboardingInfo?.workspaceHandle);
				setInfo((prev) => ({ ...prev, isChecking: false }));
			}, 1000);

			return () => clearTimeout(timeout);
		}
	}, [onboardingInfo?.workspaceHandle]);

	const handleCheckWorkspaceHandleAvailability = async (workspaceHandle) => {
		const response = await checkWorkspaceHandleAvailability(workspaceHandle);
		if (response?.[0] === true) {
			setOnboardingInfo((prev) => ({
				...prev,
				isWorkspaceHandleAvailable: response?.[1]?.available,
			}));
		} else {
			message.error(response?.[1]?.message);
		}
	};

	const handleSetWorkspaceHandle = (e) => {
		setOnboardingInfo((prev) => ({
			...prev,
			workspaceHandle: e?.target?.value?.toLowerCase(),
		}));
	};

	const handleNext = async () => {
		gsap.to(workspaceHandleNameRef.current, {
			opacity: 0,
			duration: 0.5,
			ease: 'power2.inOut',
			onComplete: () => {
				setOnboardingInfo((prev) => ({
					...prev,
					step: prev?.step + 1,
				}));
			},
		});
	};

	const handleKeyDown = (e) => {
		if (
			e.key === 'Enter' &&
			!info?.isChecking &&
			onboardingInfo?.workspaceHandle?.length > 1 &&
			onboardingInfo?.isWorkspaceHandleAvailable
		) {
			handleNext();
		}
	};

	return (
		<div
			ref={workspaceHandleNameRef}
			className="username-input-container workspace-handle-name-container"
		>
			<input
				className="workspace-handle-name-input"
				value={onboardingInfo?.workspaceHandle}
				onChange={handleSetWorkspaceHandle}
				onKeyDown={handleKeyDown}
				autoFocus={true}
				type="text"
				placeholder="workspace name"
			/>
			<button
				disabled={
					info?.isChecking ||
					onboardingInfo?.workspaceHandle?.length === 0 ||
					!onboardingInfo?.isWorkspaceHandleAvailable
				}
				style={{
					cursor:
						info?.isChecking ||
						onboardingInfo?.workspaceHandle?.length === 0 ||
						!onboardingInfo?.isWorkspaceHandleAvailable
							? 'not-allowed'
							: 'pointer',
					background:
						info?.isChecking ||
						onboardingInfo?.workspaceHandle?.length === 0 ||
						!onboardingInfo?.isWorkspaceHandleAvailable
							? 'rgba(255, 255, 255, 0.1)'
							: '',
				}}
				onMouseEnter={() => setInfo({ ...info, isHovering: true })}
				onMouseLeave={() => setInfo({ ...info, isHovering: false })}
				onClick={handleNext}
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
