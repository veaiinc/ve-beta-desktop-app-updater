import React, { useEffect, useContext, useCallback, useState, memo } from 'react';
import google from '../../../assets/svg/Settings/google.svg';
import meta from '../../../assets/svg/Settings/meta.svg';
import stripe from '../../../assets/svg/Settings/stripe.svg';
import paypal from '../../../assets/svg/Settings/paypal.svg';
import square from '../../../assets/svg/Settings/square.svg';
import '../../../assets/scss/settings/integrations.scss';
import Context from '../../../context/context';
import ReusableButtonSettings from '../../components/settings/ReusableButtonSettings';
import { ve_conversations_api } from '../../../services/config';
import axios from 'axios';

const Configs = [
	{ isActive: false, title: 'Google', icon: google },
	{ isActive: false, title: 'Stripe', icon: stripe },
	{ isActive: false, title: 'Paypal', icon: paypal },
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
	// useEffect(() => {
	// 	fetchMetaInfo();
	// }, []);

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
			} catch (error) {}
		},
	};

	return (
		<div className="IntegrationsContainer">
			<h1 className="title">Integrations</h1>

			<div className="integrationsTypes">
				{/* meta */}
				<div className="integrationSingleList">
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
				</div>

				{/* other only static  */}
				{Configs.map((singleIntegration) => {
					return (
						<div className="integrationSingleList" key={singleIntegration?.title}>
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
										<ReusableButtonSettings text={'Connect'} />
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

export default memo(Integrations);
