import * as React from 'react';
// import _ from 'lodash';
import Icon from '../../svgs/placeholder.jsx';
const Placeholder = (props) => {
	let theme;
	if (props.theme === 'light') {
		theme = '#707070';
	} else {
		theme = '#c4c4c4';
	}
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				overflow: 'hidden',
				backgroundColor: '#eee',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				...(props.isFluid
					? {
							display: 'inherit',
							gridArea: 'inherit',
					  }
					: {}),
			}}
		>
			<a
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					...(props.isFluid
						? {
								display: 'inherit',
								gridArea: 'inherit',
						  }
						: {}),
				}}
			>
				<Icon />
			</a>
		</div>
	);
};
export default Placeholder;
