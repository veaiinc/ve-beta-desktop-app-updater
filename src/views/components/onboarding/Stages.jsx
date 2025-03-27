import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import '../../../assets/scss/onboarding/stages.scss';
import { formatUsername, getCountryCode } from '../../../helpers';
import Context from '../../../context/context';
import ProgressBar from './ProgressBar';
import { message } from 'antd';
import Spinner from '../loaders/Spinner';
import Stage1 from './Stage1';

const Stages = () => {
	const {
		authInfo: { checkWorkspaceHandleAvailability },
	} = useContext(Context);

	const [info, setInfo] = useState({
		stage: 1, // total 4 stages
		username: '',
		phoneNumber: '',
		countryCode: '',
		themePreference: 'systemDefault',
		companyName: '', // workspace handle
		companyLogo: null,
		checkingWorkspaceHandle: false,
		isWorkspaceHandleAvailable: null,
		continueBtnDisabled: true,
	});

	useEffect(() => {
		const countryCode = getCountryCode(info?.phoneNumber);
		setInfo((prev) => ({
			...prev,
			countryCode,
		}));
	}, []);

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			continueBtnDisabled: info?.stage === 1 && (!info?.username || !info?.phoneNumber),
		}));
	}, [info?.username, info?.phoneNumber, info?.stage]);

	useEffect(() => {
		if (info?.companyName?.length > 1) {
			const timeout = setTimeout(async () => {
				handleCheckWorkspaceHandleAvailability(info?.companyName);
			}, 500);

			return () => clearTimeout(timeout);
		} else {
			setInfo((prev) => ({
				...prev,
				checkingWorkspaceHandle: false,
				isWorkspaceHandleAvailable: null,
			}));
		}
	}, [info?.companyName]);

	const handleCheckWorkspaceHandleAvailability = useCallback(
		async (workspaceHandle) => {
			setInfo((prev) => ({
				...prev,
				checkingWorkspaceHandle: true,
				isWorkspaceHandleAvailable: false,
			}));
			const response = await checkWorkspaceHandleAvailability(workspaceHandle);
			if (response?.[0] === true) {
				const isAvailable = response?.[1]?.available;
				setInfo((prev) => ({ ...prev, isWorkspaceHandleAvailable: isAvailable }));
			} else {
				message?.error(response?.[1]?.message);
				setInfo((prev) => ({ ...prev, isWorkspaceHandleAvailable: false }));
			}
			setInfo((prev) => ({ ...prev, checkingWorkspaceHandle: false }));
		},
		[
			checkWorkspaceHandleAvailability,
			info?.isWorkspaceHandleAvailable,
			info?.checkingWorkspaceHandle,
		],
	);

	const handleSetUsername = useCallback(
		(e) => {
			const username = e?.target?.value ?? '';
			const formattedUsername = formatUsername(username);
			setInfo((prev) => ({ ...prev, username: formattedUsername }));
		},
		[info?.username],
	);

	const handleSetPhoneNumber = useCallback(
		(phoneNumber) => {
			if (phoneNumber) {
				const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');
				setInfo((prev) => ({
					...prev,
					phoneNumber: formattedPhoneNumber,
				}));
			}
		},
		[info?.phoneNumber],
	);

	const handleSetThemePreference = useCallback(
		(themePreference) => {
			setInfo((prev) => ({ ...prev, themePreference }));
		},
		[info?.themePreference],
	);

	const handleSetCompanyName = useCallback(
		(e) => {
			const companyName = e?.target?.value ?? '';
			const formattedCompanyName = companyName?.replace(/\s+/g, '')?.toLowerCase();
			setInfo((prev) => ({ ...prev, companyName: formattedCompanyName }));
		},
		[info?.companyName],
	);

	const handleSetCompanyLogo = useCallback((e) => {
		const file = e?.target?.files?.[0];
		const companyLogo = file ? URL.createObjectURL(file) : null;
		if (companyLogo) {
			setInfo((prev) => ({ ...prev, companyLogo }));
		}
	}, []);

	const handlePrevStage = useCallback(
		() => setInfo((prev) => ({ ...prev, stage: prev?.stage - 1 })),
		[info?.stage],
	);

	const handleNextStage = useCallback(
		() => setInfo((prev) => ({ ...prev, stage: prev?.stage + 1 })),
		[info?.stage],
	);

	const stageMapper = {
		1: (
			<Stage1
				username={info?.username}
				phoneNumber={info?.phoneNumber}
				countryCode={info?.countryCode}
				themePreference={info?.themePreference}
				handleSetUsername={handleSetUsername}
				handleSetPhoneNumber={handleSetPhoneNumber}
				handleSetThemePreference={handleSetThemePreference}
			/>
		),
		2: (
			<div className="stage2">
				<header className="header">
					<h1 className="title">Create a shared workspace</h1>
					<h2 className="subtitle">A home for your team</h2>
				</header>
				<main className="stage2Content">
					<div className="companyNameContainer">
						<p className="question">What's the name of your company or team?</p>
						<div className="companyNameAndLogoInputs">
							<input
								className="companyNameInput"
								type="text"
								placeholder="Company Name"
								value={info?.companyName}
								onChange={handleSetCompanyName}
								autoFocus
							/>
							<label htmlFor="companyLogoInput">
								<input
									id="companyLogoInput"
									type="file"
									accept="image/*"
									onChange={handleSetCompanyLogo}
									className="companyLogoInput"
								/>
								{info?.companyLogo ? (
									<div className="companyLogoContainer">
										<img
											className="companyLogo"
											src={info?.companyLogo}
											alt="Company Logo"
										/>
									</div>
								) : (
									<span className="companyLogoLabel">Upload Logo</span>
								)}
							</label>
						</div>

						<p className="domainInfoContainer">
							{info?.companyName?.length > 1 && (
								<>
									<span className="domainName">{info?.companyName}@ve.ai</span>
									{info?.checkingWorkspaceHandle ? (
										<Spinner width="16px" height="16px" />
									) : info?.isWorkspaceHandleAvailable === true ? (
										<span className="available"> will be your domain</span>
									) : info?.isWorkspaceHandleAvailable === false ? (
										<span className="unavailable"> is already taken</span>
									) : null}
								</>
							)}
						</p>
					</div>
				</main>
			</div>
		),
		3: <div>Stage 3</div>,
		4: <div>Stage 4</div>,
	};

	return (
		<>
			<ProgressBar stage={info?.stage} />
			{stageMapper?.[info?.stage]}
			<div className="btnsContainer">
				{info?.stage > 1 && (
					<button onClick={handlePrevStage} className="backBtn">
						Back
					</button>
				)}
				<button
					style={{
						opacity: info?.continueBtnDisabled ? 0.4 : 1,
						cursor: info?.continueBtnDisabled ? 'not-allowed' : 'pointer',
					}}
					className="continueBtn"
					onClick={handleNextStage}
				>
					Continue
				</button>
			</div>
		</>
	);
};

export default memo(Stages);
