import { memo, useContext, useState } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/unintegratedAgentApps.module.scss';
import { createFrontendClient } from '@pipedream/sdk/browser';
import Context from '../../../../context/context';
import { message } from '../../globalComponents/CustomToast';
import Spinner from '../../loaders/Spinner';
import { ReactComponent as CircleTick } from '../../../../assets/svg/circleTick.svg';

const UnintegratedAgentApps = ({ apps = [] }) => {
	const {
		templates: { updateStateValues },
		knowledgeAgent: { connectTool },
	} = useContext(Context);
	const [info, setInfo] = useState({
		loading: false,
		selectedIndex: null,
		connectedTools: {},
	});

	const handleAddTool = async (app, index) => {
		if (info?.loading) return;
		setInfo((prev) => ({
			...prev,
			loading: true,
			selectedIndex: index,
		}));
		try {
			// 1. Connect tool to get connection token
			const [connectSuccess, response] = await connectTool({
				slug: app,
			});
			// if (!connectSuccess || !connectRes?.data?.token) {
			// 	throw new Error(connectRes?.message || 'Failed to get connection token');
			// }

			if (connectSuccess && response?.data?.oauth_url) {
				window.open(response.data.oauth_url, '_blank');

				message.success('App connected successfully');
				updateStateValues({ activeInputForChat: 'I have integrated, please proceed' });
				setInfo((prev) => ({
					...prev,
					connectedTools: {
						...prev?.connectedTools,
						[index]: true,
					},
				}));
			} else {
				throw new Error('Failed to initiate OAuth connection');
			}

			// const { token } = connectRes.data;
			// const pd = createFrontendClient();

			// // 2. Use Pipedream SDK to connect account
			// await pd.connectAccount({
			// 	app: app,
			// 	token: token,
			// 	onSuccess: async () => {
			// 		message.success('Tool added successfully');
			// 		updateStateValues({ activeInputForChat: 'proceed' });
			// 		setInfo((prev) => ({
			// 			...prev,
			// 			connectedTools: {
			// 				...prev?.connectedTools,
			// 				[index]: true,
			// 			},
			// 		}));
			// 	},
			// 	onError: () => {
			// 		throw new Error('Failed to connect to the app');
			// 	},
			// });
		} catch (error) {
			message?.error(error?.message || '');
		}
		setInfo((prev) => ({
			...prev,
			loading: false,
			selectedIndex: null,
		}));
	};

	return (
		<div className={s.unintegratedAgentAppsContainer}>
			<div className={s.text}>Connect these tools</div>
			<div className={s.appsContainer}>
				{apps?.map((app, index) => (
					<div className={s.appContainer} key={index}>
						<img src={app?.image_url} alt={app?.app} className={s.appIcon} />
						<div className={s.title}>{app?.app || ''}</div>
						{info?.connectedTools[index] && <CircleTick />}
						{!info?.connectedTools[index] && (
							<button
								className={s.connectBtn}
								onClick={() => handleAddTool(app?.app, index)}
							>
								Connect
								{info?.loading && info?.selectedIndex === index && (
									<Spinner width={'12px'} height={'12px'} />
								)}
							</button>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(UnintegratedAgentApps);
