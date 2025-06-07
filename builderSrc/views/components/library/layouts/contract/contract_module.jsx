import _ from 'lodash';
import React, { Component } from 'react';

export default class ContractModule extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		<>
			<div
				className="contract_signature"
				style={{
					backgroundColor: this.state?.contractBg,
					padding: this.state?.previewType === 'm' && '0px 24px',
				}}
			>
				{_.size(this.props.signatures) > 0 ? (
					<div
						className="sign_box sign_box_text"
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 10,
							alignItems: 'center',
							height: 'auto',
						}}
					>
						{this.props.signatures?.filter(
							(signature) => signature.userType === 'tenantUser',
						)[0]?.type === 'text' ? (
							<label>
								{' '}
								{this.props.signatures[_.size(this.props.signatures) - 1].value}
							</label>
						) : this.props.signatures?.filter(
								(signature) => signature.userType === 'tenantUser',
						  )[0]?.s3_300w_key ? (
							<a
								style={{
									backgroundColor: '#fff',
									boxShadow: '0px 4px 40px 0px rgba(0, 0, 0, 0.12)',
									width: 'auto',
									minHeight: '80px',
									height: '100%',
								}}
							>
								<img
									src={
										// this.state.signatures[
										// 	_.size(this.state.signatures) - 1
										// ].s3_300w_key

										this.props.signatures?.filter(
											(signature) => signature.userType === 'tenantUser',
										)[0]?.s3_300w_key
									}
									style={{
										width: '100%',
										height: '100%',
									}}
								/>
							</a>
						) : (
							' Tenant signature pending'
						)}
					</div>
				) : (
					<div className="sign_box"></div>
				)}
				{_.size(this.props.signatures) > 0 ? (
					''
				) : (
					<>
						<div className="cs_name">
							<span>(Company Representative)</span>
						</div>
						<label>*Signature required</label>
						{/* <a>Signer details</a> */}
					</>
				)}
			</div>
			<div
				className="contract_signature"
				style={{
					backgroundColor: this.props?.contractBg,
					padding: this.props?.previewType === 'm' && '0px 24px',
				}}
			>
				{_.size(this.props.signatures) > 0 ? (
					<div
						className="sign_box sign_box_text"
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 10,
							alignItems: 'center',
							height: 'auto',
						}}
					>
						{this.props.signatures?.filter(
							(signature) => signature.userType === 'endUser',
						)[0].type === 'text' ? (
							<label>
								{' '}
								{this.props.signatures[_.size(this.props.signatures) - 1].value}
							</label>
						) : (
							this.props.signatures?.filter(
								(signature) => signature.userType === 'endUser',
							)[0]?.s3_300w_key && (
								<a
									style={{
										backgroundColor: '#fff',
										boxShadow: '0px 4px 40px 0px rgba(0, 0, 0, 0.12)',
										width: 'auto',
										minHeight: '80px',
										// height: '100%',
									}}
								>
									<img
										src={
											// this.state.signatures[
											// 	_.size(this.state.signatures) - 1
											// ].s3_300w_key
											this.props.signatures?.filter(
												(signature) => signature.userType === 'endUser',
											)[0]?.s3_300w_key
										}
										style={{
											width: '100%',
											height: '100%',
										}}
									/>
								</a>
							)
						)}
					</div>
				) : (
					<div className="sign_box"></div>
				)}
				{_.size(this.props.signatures) > 0 ? (
					''
				) : (
					<>
						<div className="cs_name">
							<div>(Client Name)</div>
						</div>
						<label>*Signature required</label>
						{/* <a>Signer details</a> */}
					</>
				)}
			</div>
		</>;
	}
}
