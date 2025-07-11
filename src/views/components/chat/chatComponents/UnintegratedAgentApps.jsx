import { memo, useContext, useState } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/unintegratedAgentApps.module.scss';
import { createFrontendClient } from '@pipedream/sdk/browser';
import Context from '../../../../context/context';
import { message } from '../../globalComponents/CustomToast';
// import Spinner from '../../loaders/Spinner';

const UnintegratedAgentApps = ({ apps = [] }) => {
	const {
		templates: { updateStateValues },
		knowledgeAgent: { connectTool },
	} = useContext(Context);
	const [info, setInfo] = useState({
		loading: false,
		selectedIndex: null,
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
			const [connectSuccess, connectRes] = await connectTool({ app: app });
			if (!connectSuccess || !connectRes?.data?.token) {
				throw new Error(connectRes?.message || 'Failed to get connection token');
			}

			const { token } = connectRes.data;
			const pd = createFrontendClient();

			// 2. Use Pipedream SDK to connect account
			await pd.connectAccount({
				app: app,
				token: token,
				onSuccess: async () => {
					message.success('Tool added successfully');
					updateStateValues({ activeInputForChat: 'proceed' });
				},
				onError: () => {
					throw new Error('Failed to connect to the app');
				},
			});
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
					<div
						className={s.appContainer}
						key={index}
						onClick={() => handleAddTool(app, index)}
					>
						{app || ''}
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(UnintegratedAgentApps);
