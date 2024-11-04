import React, { useState, memo, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ReactComponent as UpArrowGrey } from '../../../assets/svg/login_page/uparrow-grey.svg';
import { ReactComponent as UpArrowBlackHover } from '../../../assets/svg/login_page/up-arrow-black-hover.svg';
import '../../../assets/scss/onboarding/index.scss';

const WorkspaceHandleName = ({ onboardingInfo, setOnboardingInfo, animateStep4Enter }) => {
	const [info, setInfo] = useState({
		isHovering: false,
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

	const handleSetUsername = (e) => {
		setOnboardingInfo((prev) => ({
			...prev,
			workspaceHandle: e?.target?.value?.toLowerCase(),
		}));
	};

	const handleNext = () => {
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
		if (e.key === 'Enter' && onboardingInfo?.workspaceHandle?.length > 0) {
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
				onChange={handleSetUsername}
				onKeyDown={handleKeyDown}
				autoFocus={true}
				type="text"
				placeholder="workspace name"
			/>
			<button
				disabled={onboardingInfo?.workspaceHandle?.length === 0}
				style={{
					cursor:
						onboardingInfo?.workspaceHandle?.length === 0 ? 'not-allowed' : 'pointer',
					background:
						onboardingInfo?.workspaceHandle?.length === 0
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
