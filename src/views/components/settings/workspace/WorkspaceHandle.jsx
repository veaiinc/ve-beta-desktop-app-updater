import React, { useState } from 'react';

const WorkspaceHandleComponent = () => {
	const [domainUpdate, setdomainUpdate] = useState(true);

	const isActiveComponentFunc = () => {
		return (
			<div className="activeDomainDiv">
				<span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="11"
						height="10"
						viewBox="0 0 11 10"
						fill="none"
					>
						<circle cx="5.5" cy="5" r="5" fill="#09A935" fill-opacity="0.36" />
						<circle cx="5.5" cy="5" r="2.5" fill="#09A935" />
					</svg>
				</span>
				<p>Active</p>
			</div>
		);
	};

	return (
		<div>
			<div>
				<h1>Your workspace handle</h1>
			</div>

			<div className="domainContainer">
				<h2>Domain Name</h2>

				<div className="domainInput">
					<div className="inputDiv">
						<input placeholder="minimun 4 letters" value={'shahid'} />
						<p className="domainName">ve.ai</p>
					</div>
					{domainUpdate ? isActiveComponentFunc() : null}
				</div>
			</div>
		</div>
	);
};

export default WorkspaceHandleComponent;
