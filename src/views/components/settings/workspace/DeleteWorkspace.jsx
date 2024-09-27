import { memo } from 'react';

const DeleteWorkpsaceComponent = () => {
	return (
		<>
			<h1>Delete Workspace?</h1>
			<p>
				You will be billed for the current, but you'll receive a refund for the remaining,
				if you paid for some duration.
			</p>
		</>
	);
};

export default memo(DeleteWorkpsaceComponent);
