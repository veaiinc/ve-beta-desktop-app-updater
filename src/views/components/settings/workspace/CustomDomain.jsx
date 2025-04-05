import { memo, useState } from 'react';
import '../../../../assets/scss/settings/workspace/customDomain.scss';
import { ReactComponent as InfoIcon } from '../../../../assets/svg/Settings/info-icon.svg';
import { isURL } from '../../../../helpers/index';

const CustomDomain = () => {
	const [info, setInfo] = useState({
		customDomain: '',
		customDomainStatus: 'Connected',
	});

	const handleSetCustomDomain = (e) => {
		const URL = e?.target?.value;
		// const isURLValid = isURL(URL);
		// if (!isURLValid) return;
		setInfo({
			...info,
			customDomain: URL,
		});
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
						<th>Name</th>
						<th>Type</th>
						<th>Value</th>
					</tr>
				</thead>
				<tbody className="tableBody">
					<tr>
						<td>www</td>
						<td>
							<InfoIcon />
							CNAME
						</td>
						<td>hello.huemn.com</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default memo(CustomDomain);
