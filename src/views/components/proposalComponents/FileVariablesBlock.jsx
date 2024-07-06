import React from 'react';

const FileVariablesBlock = () => {
	return (
		<div className="filevaribalesContainer">
			<div className="clientHeader">
				<span className="header">File Variables (To be filled by you)</span>
				<span className="subHeader">
					These variables are added by the business before sending the file to the client
					to ensure all necessary information is included.
				</span>
			</div>
			<div className="clientVariablesHolder">
				<div className="multipleInputContainer">
					<div className="inputHolder">
						<span className="serviceTitle">Project Name</span>
						<input
							type="text"
							className="propsalinputContainer"
							placeholder="Type Here ..."
						/>
					</div>
					<div className="inputHolder">
						<div
							className="errorState"
							style={{
								display: 'flex',
								flex: 1,
								alignSelf: 'stretch',
							}}
						>
							<span className="serviceTitle">Client First Name</span>
						</div>

						<input
							type="text"
							className="propsalinputContainer"
							placeholder="Type Here ..."
						/>
					</div>
				</div>
				<div className="multipleInputContainer">
					<div className="inputHolder">
						<span className="serviceTitle">Client Email Address</span>
						<input
							type="text"
							className="propsalinputContainer"
							placeholder="Type Here ..."
						/>
					</div>
					<div className="inputHolder">
						<div
							className="errorState"
							style={{
								display: 'flex',
								flex: 1,
								alignSelf: 'stretch',
							}}
						>
							<span className="serviceTitle">Project Budget</span>
						</div>

						<input
							type="text"
							className="propsalinputContainer"
							placeholder="Type Here ..."
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FileVariablesBlock;
