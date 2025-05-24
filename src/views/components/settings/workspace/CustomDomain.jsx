import { memo, useContext, useEffect, useState } from 'react';
import '../../../../assets/scss/settings/workspace/customDomain.scss';
import { ReactComponent as InfoIcon } from '../../../../assets/svg/Settings/info-icon.svg';
import Context from '../../../../context/context';
import { message } from '../../globalComponents/CustomToast';

const domainRegex =
	/^(\*\.)?(((?!-)[A-Za-z0-9-]{1,62}[A-Za-z0-9])\.)+((?!-)[A-Za-z0-9-]{1,62}[A-Za-z0-9])$/;

const CustomDomain = () => {
	const {
		customDomainInfo: {
			customDomainData,
			requestCustomDomainConnection,
			getCustomDomainStatus,
		},
	} = useContext(Context);

	const { domain, status, statusMessage, validationRecords } = customDomainData ?? {};
	const { name, value, type } = validationRecords ?? {};

	const [info, setInfo] = useState({
		customDomain: '',
		customDomainStatus: 'Connected',
	});

	useEffect(() => {
		if (domain?.length > 0) {
			getCustomDomainStatus(domain);
		}
	}, [domain]);

	useEffect(() => {
		if (statusMessage?.length > 0) {
			message.info(statusMessage);
		}
	}, [statusMessage]);

	const handleSetCustomDomain = (e) => {
		const URL = e?.target?.value;
		setInfo({
			...info,
			customDomain: URL,
		});
	};

	const handleRequestCustomDomainConnection = async (e) => {
		if (e?.key === 'Enter') {
			const domain = info?.customDomain?.trim();

			if (domain) {
				const isDomainUrlValid = domainRegex.test(domain);
				if (!isDomainUrlValid) {
					message.error('Invalid domain URL');
					return;
				}
				const [success] = await requestCustomDomainConnection(domain);
				if (success) {
					message.success('Domain is valid');
				} else {
					message.error('Domain is invalid');
				}
			}
		}
	};

	return (
		<div className="customDomainContainer">
			<header className="headerContainer">
				<h1 className="title">Custom Domain</h1>
				<h2 className="subTitle">Boost your brand with a custom domain.</h2>
			</header>
			<div className="domainInputContainer">
				<input
					className="domainInput"
					value={info?.customDomain}
					onChange={handleSetCustomDomain}
					onKeyDown={handleRequestCustomDomainConnection}
					type="text"
					placeholder="https://www.mycustomdomain.com"
				/>
				<div className="connectionStatus">Connected</div>
			</div>
			<header className="headerContainer">
				<h1 className="title">{info?.customDomainStatus}</h1>
				<h2 className="subTitle">
					Please ensure your DNS records are configured with the following values.
				</h2>
			</header>
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
						<td>{type}</td>
						<td>
							{/* <InfoIcon /> */}
							{name}
						</td>
						<td>{value}</td>
						<td>600 seconds</td>
						<td>{status}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default memo(CustomDomain);
