import Spinner from '../loaders/Spinner';

const SuspenseFallback = () => {
	return (
		<div style={{ width: '100%', height: '100%', background: 'inherit' }}>
			<Spinner
				width="18px"
				height="18px"
				color="var(--primary-button)"
				borderTopColor="transparent"
				borderWidth={1.5}
			/>
		</div>
	);
};

export default SuspenseFallback;
