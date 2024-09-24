import { memo } from 'react';

const DeleteWorkpsaceComponent = () => {
	return (
		<>
			<h1>Do you want to delete your workspace?</h1>
			<p>
				You will be billed for the month, but you'll receive a refund for the remaining, if
				you paid for some duration.
			</p>
		</>
	);
};

export default memo(DeleteWorkpsaceComponent);
