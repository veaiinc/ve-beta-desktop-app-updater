import Spinner from '../views/components/loaders/Spinner';

export const nameShortner = (name) => {
	let newName = name?.split(' ');
	let str = '';
	str += newName?.[0]?.[0] + (newName?.[1]?.[0] ? newName?.[1]?.[0] : '');
	return str?.toUpperCase();
};

export const FetchMoreLoaderComp = () => {
	return (
		<h4
			style={{
				display: 'flex',
				gap: '12px',
				color: '#fff',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Spinner width={'12px'} height={'12px'} />
			Fetching More...
		</h4>
	);
};
