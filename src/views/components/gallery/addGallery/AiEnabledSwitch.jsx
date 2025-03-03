import React, { useContext } from 'react';
import { Switch } from 'antd';
import Context from '../../../../context/context';

const AiEnabledSwitch = ({ isAiEnabled, isProcessing, setinfo }) => {
	const {
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);

	const onChangeHandler = (checked) => {
		if (isProcessing) return;

		if (
			checked &&
			(validateExpiryData?.liteImageLimitWithAiFace === 0 ||
				validateExpiryData?.liteImagesLimit <= validateExpiryData?.liteImageUsed)
		) {
			updateSubscriptionState({ expiredSubscriptionModal: true });
			return;
		}

		setinfo((prev) => ({ ...prev, isAiEnabled: checked }));
	};
	return (
		<div className="duplicate_div" style={{ width: '100%' }}>
			<div className="text_div">
				<h1>AI Enabled</h1>
			</div>
			<Switch
				checked={isAiEnabled || false}
				onChange={onChangeHandler}
				disabled={isProcessing}
			/>
		</div>
	);
};

export default AiEnabledSwitch;
