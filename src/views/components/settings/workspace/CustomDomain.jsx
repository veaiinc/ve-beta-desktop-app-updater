import { memo, useContext, useEffect, useState } from 'react';
import '../../../../assets/scss/settings/workspace/customDomain.scss';
import { ReactComponent as CopyIcon } from '../../../../assets/svg/copy.svg';
import Context from '../../../../context/context';
import { message } from '../../globalComponents/CustomToast';
import Spinner from '../../loaders/Spinner';

// Simple domain validation - allows both simple names and full domains
const isValidDomain = (domain) => {
	// Allow simple names (like 'siva')
	if (/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]$/.test(domain)) {
		return true;
	}
	// Allow full domains (like 'example.com')
	if (/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](\.[a-zA-Z]{2,})+$/.test(domain)) {
		return true;
	}
	return false;
};

const CustomDomain = () => {
	const {
		customDomainInfo: {
			customDomainData,
			requestCustomDomainConnection,
			getCustomDomainStatus,
			customDomainStatus,
		},
	} = useContext(Context);

	const {
		domain,
		statusMessage: requestStatusMessage,
		validationRecords,
	} = customDomainData ?? {};
	const { status, validation_records, message: statusApiMessage } = customDomainStatus ?? {};
	const { name, value, type } = validation_records?.[0] ?? {};
	const [info, setInfo] = useState({
		appDomain: '',
		subDomain: '',
		customDomainStatus: 'Not Connected',
		isChecking: false,
		checkStatusButtonShow: false,
		isRequesting: false,
		isInitialLoading: false,
	});

	useEffect(() => {
		if (requestStatusMessage?.length > 0) {
			message.success(requestStatusMessage);
		}
		if (statusApiMessage?.length > 0) {
			message.success(statusApiMessage);
		}
		handleFetchCustomDomainStatus();
	}, []);

	const handleSetAppDomain = (e) => {
		const URL = e?.target?.value;
		setInfo({
			...info,
			appDomain: URL,
		});
	};

	const handleSetSubDomain = (e) => {
		const URL = e?.target?.value;
		setInfo({
			...info,
			subDomain: URL,
		});
	};

	const handleRequestCustomDomainConnection = async (e) => {
		if (e?.key === 'Enter') {
			const appDomain = info?.appDomain?.trim();
			const subDomain = info?.subDomain?.trim();

			if (!appDomain || !subDomain) {
				message.error('Please enter both app domain and subdomain');
				return;
			}

			// Validate both domains
			if (!isValidDomain(appDomain)) {
				message.error('App domain should be a valid domain (e.g., example.com)');
				return;
			}

			if (!isValidDomain(subDomain)) {
				message.error('Subdomain should be a valid domain (e.g., app.example.com)');
				return;
			}

			// Combine subdomain and app domain in the correct order
			const fullDomain = `${subDomain}.${appDomain}`; // This will create "siva.krishna.com"

			setInfo({
				...info,
				isRequesting: true,
				customDomainStatus: 'Validating...',
			});

			// Send the full domain in the correct format
			const [success] = await requestCustomDomainConnection(fullDomain);

			if (success) {
				message.success('Domain is valid');
				localStorage.setItem('customDomain', JSON.stringify({ appDomain, subDomain }));
				setInfo({
					...info,
					isRequesting: false,
					checkStatusButtonShow: true,
					customDomainStatus: 'Checking...',
				});
				handleFetchCustomDomainStatus();
			} else {
				message.error('Domain is invalid');
				setInfo({
					...info,
					isRequesting: false,
					checkStatusButtonShow: false,
					customDomainStatus: 'Not Connected',
				});
			}
		}
	};

	const handleFetchCustomDomainStatus = async () => {
		const savedDomains = localStorage.getItem('customDomain');
		if (!savedDomains) {
			setInfo({
				...info,
				checkStatusButtonShow: false,
				isInitialLoading: false,
				customDomainStatus: 'Not Connected',
			});
			return;
		}

		const { appDomain, subDomain } = JSON.parse(savedDomains);
		setInfo({
			...info,
			appDomain,
			subDomain,
			checkStatusButtonShow: true,
			isInitialLoading: true,
			customDomainStatus: 'Checking...',
		});

		// Combine subdomain and app domain in the correct order
		const fullDomain = `${subDomain}.${appDomain}`; // This will create "siva.krishna.com"
		const [success] = await getCustomDomainStatus(fullDomain);

		if (success) {
			setInfo({
				...info,
				customDomainStatus: customDomainStatus?.status || 'Connected',
				isInitialLoading: false,
			});
		} else {
			setInfo({
				...info,
				isInitialLoading: false,
				customDomainStatus: 'Not Connected',
			});
		}
	};

	const handleCheckStatus = async () => {
		const savedDomains = localStorage.getItem('customDomain');
		if (savedDomains) {
			const { appDomain, subDomain } = JSON.parse(savedDomains);
			setInfo({
				...info,
				isChecking: true,
				customDomainStatus: 'Checking...',
			});

			// Combine subdomain and app domain in the correct order
			const fullDomain = `${subDomain}.${appDomain}`; // This will create "siva.krishna.com"
			const [success] = await getCustomDomainStatus(fullDomain);

			if (success && customDomainStatus?.status && customDomainStatus.status !== 'PENDING') {
				localStorage.removeItem('customDomain');
				setInfo({
					...info,
					isChecking: false,
					checkStatusButtonShow: false,
					customDomainStatus: customDomainStatus.status,
				});
			} else {
				setInfo({
					...info,
					isChecking: false,
					customDomainStatus: customDomainStatus?.status || 'Not Connected',
				});
			}
		}
	};
	const handleCopyDNSNameRecord = () => {
		const formattedText = name;
		navigator.clipboard
			.writeText(formattedText)
			.then(() => {
				message.success('DNS name record copied to clipboard!');
			})
			.catch(() => {
				message.error('Failed to copy to clipboard');
			});
	};
	const handleCopyDNSValueRecord = () => {
		const formattedText = value;
		navigator.clipboard
			.writeText(formattedText)
			.then(() => {
				message.success('DNS value record copied to clipboard!');
			})
			.catch(() => {
				message.error('Failed to copy to clipboard');
			});
	};

	// Get display values from either customDomainData or customDomainStatus
	const displayDomain = domain || customDomainStatus?.domain;
	const displayStatus = status || info.customDomainStatus;
	const displayValidationRecords = validationRecords || validation_records;
	const displayType = type || displayValidationRecords?.[0]?.type;
	const displayName = name || displayValidationRecords?.[0]?.name;
	const displayValue = value || displayValidationRecords?.[0]?.value;

	return (
		<div className="customDomainContainer">
			<header className="headerContainer">
				<h1 className="title">Custom Domain</h1>
				<h2 className="subTitle">Boost your brand with a custom domain.</h2>
			</header>
			<div className="domainInputContainer">
				<div className="domainInputsWrapper">
					<div className="domainInputWrapper">
						<input
							className="domainInput"
							value={info?.subDomain}
							onChange={handleSetSubDomain}
							onKeyDown={handleRequestCustomDomainConnection}
							type="text"
							placeholder="subdomain"
						/>
					</div>
					<div className="domainInputWrapper">
						<input
							className="domainInput"
							value={info?.appDomain}
							onChange={handleSetAppDomain}
							onKeyDown={handleRequestCustomDomainConnection}
							type="text"
							placeholder="yourdomain.com"
						/>
					</div>
					{/* {info?.isRequesting && (
						<Spinner width={'16px'} height={'16px'} color={'var(--primary-font)'} />
					)} */}
					{info?.checkStatusButtonShow && !info?.isInitialLoading && (
						<div
							className={`connectionStatus ${info?.isChecking ? 'checking' : ''}`}
							onClick={handleCheckStatus}
							disabled={info?.isChecking}
							style={{
								cursor: info?.isChecking ? 'not-allowed' : 'pointer',
							}}
						>
							{info?.isChecking ? (
								<div className="statusLoading">
									<Spinner
										width={'16px'}
										height={'16px'}
										color={'var(--primary-font)'}
									/>
									<span>Checking...</span>
								</div>
							) : (
								'Check Status'
							)}
						</div>
					)}
					<div className="connectionStatus">
						{info?.isInitialLoading || info?.isRequesting ? (
							<div className="statusLoading">
								<Spinner
									width={'16px'}
									height={'16px'}
									color={'var(--primary-font)'}
								/>
								<span>{info?.isRequesting ? 'Validating...' : 'Loading...'}</span>
							</div>
						) : (
							displayStatus
						)}
					</div>
				</div>
			</div>
			<header className="headerContainer">
				<h1 className="title">{info?.customDomainStatus}</h1>
				<div className="copyButtonContainer">
					<h2 className="subTitle">
						Please ensure your DNS records are configured with the following values.
					</h2>
				</div>
			</header>
			{info?.isInitialLoading ? (
				<div className="tableLoading">
					<Spinner width={'24px'} height={'24px'} color={'var(--primary-font)'} />
					<span>Loading DNS records...</span>
				</div>
			) : (
				displayValidationRecords?.length > 0 && (
					<table className="DNSRecordsTable">
						<thead className="tableHeader">
							<tr>
								<th>Type</th>
								<th>Name</th>
								<th>Value</th>
								<th>TTL</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody className="tableBody">
							<tr>
								<td>
									<span className="key">Type</span>
									<span className="value">{displayType}</span>
								</td>
								<td>
									<span className="key">Name</span>
									<div className="value">
										<span>{displayName}</span>
										<CopyIcon onClick={handleCopyDNSNameRecord} />
									</div>
								</td>
								<td>
									<span className="key">Value</span>
									<div className="value">
										<span>{displayValue}</span>
										<CopyIcon onClick={handleCopyDNSValueRecord} />
									</div>
								</td>
								<td>
									<span className="key">TTL</span>
									<span className="value">600 seconds</span>
								</td>
								<td>
									<span className="key">Status</span>
									<span className="value">{displayStatus}</span>
								</td>
							</tr>
						</tbody>
					</table>
				)
			)}
		</div>
	);
};

export default memo(CustomDomain);
