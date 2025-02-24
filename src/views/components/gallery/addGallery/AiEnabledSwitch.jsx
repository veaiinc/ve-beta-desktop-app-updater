import React, { useContext } from 'react';
import { Switch } from 'antd';
import Context from '../../../../context/context';

const AiEnabledSwitch = ({ info, setinfo }) => {
	const {
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);

	const onChangeHandler = (checked) => {
		if (info?.startedUploading) return;

		if (checked && validateExpiryData?.liteImageLimitWithAiFace === 0) {
			updateSubscriptionState({ expiredSubscriptionModal: true });
			return;
		}

		if (checked && validateExpiryData?.liteImagesLimit <= validateExpiryData?.liteImageUsed) {
			updateSubscriptionState({ expiredSubscriptionModal: true });
			return;
		}

		setinfo((prev) => ({ ...prev, isAiEnabled: checked }));
	};
	return (
		<div className="duplicate_div" style={{ width: '100%' }}>
			<div className="text_div">
				<h1>AI Enabled</h1>
				<p></p>
			</div>
			<Switch
				checked={info?.isAiEnabled || false}
				onChange={onChangeHandler}
				disabled={info?.startedUploading}
			/>
		</div>
	);
};

export default AiEnabledSwitch;
