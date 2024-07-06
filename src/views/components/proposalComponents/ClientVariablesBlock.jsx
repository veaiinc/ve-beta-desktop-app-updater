import React from 'react';
import '../../../assets/scss/modules/proposal/fileClientVariables.scss';

const ClientVariablesBlock = () => {
	return (
		<div className="clientvaribalesContainer">
			<div className="clientHeader">
				<span className="header">Client Variables (To be filled by client)</span>
				<span className="subHeader">
					These variables are to be filled out by the client in their response and, in
					some cases, can be added by the business as well.
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

export default ClientVariablesBlock;
