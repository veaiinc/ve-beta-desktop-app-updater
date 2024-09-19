import React, { useEffect, useContext, useCallback, useState } from 'react';
import google from '../../../assets/images/companySettings/google.svg';
import meta from '../../../assets/images/companySettings/meta.svg';
import stripe from '../../../assets/images/companySettings/stripe.svg';
import paypal from '../../../assets/images/companySettings/paypal.svg';
import square from '../../../assets/images/companySettings/square.svg';
import '../../../assets/scss/AccountSettings/integrations.scss';
import Line from './Line';
import Context from '../../../context/context';
import ReusableButtonSettings from '../workspace_settings/ReusableButtonSettings';
import { ve_conversations_api } from '../../../services/config';
import axios from 'axios';

const Temp = () => {
	const {
		chatInfo: { getPageInfo, pageInfoData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		metaInteg: false,
		openMoreFacebook: false,
		loader: false,
	});
	useEffect(() => {
		fetchMetaInfo();
	}, []);

	useEffect(() => {
		if (pageInfoData) {
			const { data } = pageInfoData;
			let updatedValue;
			if (data?.length) {
				updatedValue = true;
			} else {
				updatedValue = false;
			}
			setInfo((prev) => ({ ...prev, metaInteg: updatedValue }));
		}
	}, [pageInfoData]);

	const fetchMetaInfo = useCallback(async () => {
		const payload = {
			filters: {
				limit: 100,
				page: 1,
			},
		};
		getPageInfo(payload);
	}, []);

	const handleFaceBookConnection = async () => {
		if (info.loader) {
			return;
		}
		if (info.metaInteg) {
			return;
		}
		setInfo((prev) => ({
			...prev,
			loader: true,
		}));
		const usertoken = localStorage.getItem('usertoken');
		const workspaceID = localStorage.getItem('workspaceId');
		const link = `${ve_conversations_api}/oauth/${workspaceID}/login`;
		const response = await axios.get(link, {
			headers: {
				Authorization: `Bearer ${usertoken}`,
			},
		});
		if (response.status === 200) {
			setInfo((prev) => ({
				...prev,
				loader: false,
			}));

			const url = response?.data;
			window.location.href = url;
		} else {
			setInfo((prev) => ({
				...prev,
				loader: false,
			}));
		}
	};

	return (
		<div className="companyIntegrationsMainContainer">
			<div className="companyIntegrationsContainer">
				<h1 className="title">Integrations</h1>
				<div className="integrationsTypes">
					<div className="integrationContainer">
						<div className="imageContainer">
							<img src={meta} alt="meta" />
							<div className="textContainer">
								<h1>Meta Leads</h1>
								<p>Integrate your Facebook Suite</p>
							</div>
						</div>
						{!info.openMoreFacebook && (
							<ReusableButtonSettings
								text={!info.metaInteg ? 'Connect' : 'Connected'}
								func={!info.metaInteg ? handleFaceBookConnection : null}
								loader={info.loader}
								active={info.metaInteg}
								disableHover={!info.metaInteg}
							/>
						)}
					</div>

					<Line />
					<div className="integrationContainer">
						<div className="imageContainer">
							<img src={google} alt="google" />
							<div className="textContainer">
								<h1>Google Integration</h1>
								<p>Sync your Google Account</p>
							</div>
						</div>
						<ReusableButtonSettings text={'Connect'} />
					</div>

					<Line />
					<div className="integrationContainer">
						<div className="imageContainer">
							<img src={stripe} alt="stripe" />
							<div className="textContainer">
								<h1>Stripe Integration</h1>
								<p>Sync Stripe to your account for all your payments</p>
							</div>
						</div>
						<ReusableButtonSettings text={'Connect'} />
					</div>
				</div>
			</div>
		</div>
	);
};

const Configs = [
	{ isActive: true, title: 'Meta Leads', icon: meta },
	{ isActive: false, title: 'Google', icon: google },
	{ isActive: true, title: 'Stripe', icon: stripe },
	{ isActive: true, title: 'Paypal', icon: paypal },
	{ isActive: false, title: 'Square', icon: square },
];

const Integrations = () => {
	const {
		chatInfo: { getPageInfo, pageInfoData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		metaInteg: false,
		openMoreFacebook: false,
		loader: false,
	});
	useEffect(() => {
		fetchMetaInfo();
	}, []);

	useEffect(() => {
		if (pageInfoData) {
			const { data } = pageInfoData;
			let updatedValue;
			if (data?.length) {
				updatedValue = true;
			} else {
				updatedValue = false;
			}
			setInfo((prev) => ({ ...prev, metaInteg: updatedValue }));
		}
	}, [pageInfoData]);

	const fetchMetaInfo = useCallback(async () => {
		const payload = {
			filters: {
				limit: 100,
				page: 1,
			},
		};
		getPageInfo(payload);
	}, []);

	const handleFaceBookConnection = async () => {
		if (info.loader) {
			return;
		}
		if (info.metaInteg) {
			return;
		}
		setInfo((prev) => ({
			...prev,
			loader: true,
		}));
		const usertoken = localStorage.getItem('usertoken');
		const workspaceID = localStorage.getItem('workspaceId');
		const link = `${ve_conversations_api}/oauth/${workspaceID}/login`;
		const response = await axios.get(link, {
			headers: {
				Authorization: `Bearer ${usertoken}`,
			},
		});
		if (response.status === 200) {
			setInfo((prev) => ({
				...prev,
				loader: false,
			}));

			const url = response?.data;
			window.location.href = url;
		} else {
			setInfo((prev) => ({
				...prev,
				loader: false,
			}));
		}
	};

	return (
		<div className="IntegrationsContainer">
			<h1 className="title">Integrations</h1>

			<div className="integrationsTypes">
				{Configs.map((singleIntegration) => {
					// logic

					return (
						<div className="integrationSingleList">
							<div className="imageContainer">
								<img src={singleIntegration.icon} alt="meta" />
								<div className="textContainer">
									<h1>{singleIntegration.title}</h1>
								</div>
							</div>

							<div className="buttonsContainer">
								{singleIntegration.isActive ? (
									<>
										<div className="disconnectButton">
											<ReusableButtonSettings
												text={'Disconnect'}
												func={
													!info.metaInteg
														? handleFaceBookConnection
														: null
												}
												loader={info.loader}
												active={info.metaInteg}
												disableHover={!info.metaInteg}
											/>
										</div>

										<div className="configButton">
											<ReusableButtonSettings
												text={'Configure'}
												func={
													!info.metaInteg
														? handleFaceBookConnection
														: null
												}
												loader={info.loader}
												active={info.metaInteg}
												disableHover={!info.metaInteg}
											/>
										</div>
									</>
								) : (
									<div className="connectButton">
										<ReusableButtonSettings
											text={'Connect'}
											func={!info.metaInteg ? handleFaceBookConnection : null}
											loader={info.loader}
											active={info.metaInteg}
											disableHover={!info.metaInteg}
										/>
									</div>
								)}
							</div>

							{singleIntegration.isActive && <div className="activeCirlce"></div>}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Integrations;
