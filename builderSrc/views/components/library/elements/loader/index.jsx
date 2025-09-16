import React, { Component } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
class Loader extends Component {
	render() {
		return (
			<SkeletonTheme baseColor="#d1d1d1" highlightColor="#f8f8f8">
				<p style={{ display: 'flex', width: '100%' }} className="loader-p">
					<Skeleton height={300} width={'100%'} />
				</p>
			</SkeletonTheme>
		);
	}
}

export default Loader;
