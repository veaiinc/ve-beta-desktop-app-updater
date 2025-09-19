import React, { useEffect, useContext, useCallback, useState, memo } from 'react';
import google from '../../../assets/svg/Settings/google.svg';
import meta from '../../../assets/svg/Settings/meta.svg';
import stripe from '../../../assets/svg/Settings/stripe.svg';
import paypal from '../../../assets/svg/Settings/paypal.svg';
import square from '../../../assets/svg/Settings/square.svg';
import zoho from '../../../assets/svg/Settings/zoho-logo.svg';
import slack from '../../../assets/svg/Settings/slack.svg';
import '../../../assets/scss/settings/OldintegrationsPage.scss';
import Context from '../../../context/context';
import ReusableButtonSettings from '../../components/settings/ReusableButtonSettings';
import axios from 'axios';
import { Spin } from 'antd';
import { message } from '../../components/globalComponents/CustomToast';
import getBaseUrl from '../../../services/baseUrls';

const availableIntegrations = [
	{
		title: 'Google',
		icon: google,
		connect_type: 'google',
		hasConfigure: true,
	},
	{ title: 'Zoho', icon: zoho, connect_type: 'zoho', hasConfigure: false },
	// {
	// 	title: 'Hubspot',
	// 	icon: hubspot,
	// 	connect_type: 'hubspot',
	// 	hasConfigure: false,
	// },
	{ title: 'Slack', icon: slack, connect_type: 'slack', hasConfigure: false },
];

const upcommingIntegrations = [
	{
		title: 'Meta',
		icon: meta,
		connect_type: 'meta',
		hasConfigure: true,
	},
	{
		title: 'Stripe',
		icon: stripe,
		connect_type: 'not_available',
	},
	{
		title: 'Paypal',
		icon: paypal,
		connect_type: 'not_available',
	},
	{
		title: 'Square',
		icon: square,
		connect_type: 'not_available',
	},
];

const OldIntegrationsPage = () => {
	const {
		chatInfo: { getPageInfo, pageInfoData },
		templates: { connectUrl, connectThirdParty },
		profileInfo: { tennantSettingsData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		metaInteg: false,
		openMoreFacebook: false,
		loader: false,
		connectedThirdParties: { google: false, zoho: false, hubspot: false, slack: false },
		clickLoader: '',
	});

	useEffect(() => {
		if (connectUrl?.[0] === true) {
			window.location.href = connectUrl?.[1];
		} else {
			if (connectUrl !== null) {
				message?.error(
					connectUrl?.[1]?.message || `error connecting with ${info?.clickLoader}`,
				);
				setInfo((prev) => ({ ...prev, clickLoader: false }));
			}
		}
	}, [connectUrl]);

	useEffect(() => {
		if (tennantSettingsData !== null && tennantSettingsData?.zoho) {
			setInfo((prev) => ({
				...prev,
				connectedThirdParties: {
					...prev.connectedThirdParties,
					zoho: tennantSettingsData?.zoho?.isEnabled,
				},
			}));
		}
	}, [tennantSettingsData]);

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

	const handleConnectThirdParty = async (connectType) => {
		setInfo((prev) => ({
			...prev,
			loader: true,
		}));
		await connectThirdParty(connectType);
		setInfo((prev) => ({
			...prev,
			loader: false,
		}));
	};

	const functionsObject = {
		handleFaceBookConnection: async () => {
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

			try {
				const usertoken = localStorage.getItem('usertoken');
				const workspaceId = localStorage.getItem('workspaceId');
				const region = localStorage.getItem('region');
				const baseURl = getBaseUrl('ve_conversations_api', region);
				const link = `${baseURl}/oauth/${workspaceId}/login`;
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
			} catch (error) {}
		},
	};

	return (
		<div className="IntegrationsContainer">
			<h1 className="title">Integrations</h1>

			<div className="integrationsTypes">
				{/* meta */}
				{/* <div className="integrationSingleList">
					<div className="imageContainer">
						<img src={meta} alt="meta" />
						<div className="textContainer">
							<h1>Meta Leads</h1>
						</div>
					</div>

					<div className="buttonsContainer">
						{info.openMoreFacebook ? (
							<>
								<div className="disconnectButton">
									<ReusableButtonSettings
										text={'Disconnect'}
										loader={info.loader}
										active={info.metaInteg}
										disableHover={!info.metaInteg}
									/>
								</div>

								<div className="configButton">
									<ReusableButtonSettings text={'Configure'} />
								</div>
							</>
						) : (
							<div className="connectButton">
								<ReusableButtonSettings
									text={'Connect'}
									func={!info.metaInteg ? null : null}
									loader={info.loader}
									// active={info.metaInteg}
									active={info.metaInteg}
									disableHover={!info.metaInteg}
								/>
							</div>
						)}
					</div>

					{info.openMoreFacebook && <div className="activeCirlce"></div>}
				</div> */}

				{availableIntegrations?.map((singleIntegration) => {
					return (
						<div className="integrationSingleList" key={singleIntegration?.title}>
							<div className="imageContainer">
								<img src={singleIntegration?.icon} alt="meta" />
								<div className="textContainer">
									<h1>{singleIntegration?.title}</h1>
								</div>
							</div>

							<div className="buttonsContainer">
								{info?.connectedThirdParties?.[singleIntegration?.connect_type] ===
								true ? (
									<span className="connected-indicator">Connected</span>
								) : (
									<div className="connectButton">
										<ReusableButtonSettings
											text={
												info?.clickLoader === singleIntegration?.title ? (
													<Spin />
												) : (
													'Connect'
												)
											}
											func={() => {
												setInfo((prev) => ({
													...prev,
													clickLoader: singleIntegration?.title,
												}));
												handleConnectThirdParty(
													singleIntegration?.connect_type,
												);
											}}
											// loader={info?.loader}
										/>
									</div>
								)}
							</div>

							{singleIntegration.isConnected && <div className="activeCirlce"></div>}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default memo(OldIntegrationsPage);
