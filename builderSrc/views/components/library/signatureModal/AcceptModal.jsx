import React, { Component } from 'react';
import Modal from '../modals';
import './index.scss';
import CloseModal from '../svgs/signatureModal/close-modal';
import Ve from '../svgs/signatureModal/ve';
import Secure from '../svgs/signatureModal/secure';
import BottomModal from '../modals/BottomModal';

class SignatureModal extends Component {
	constructor(props) {
		super();

		this.state = {
			signatureType: 'text',
			name: '',
			email: '',
			termsChecked: false,
			isError: false,
		};

		this.canvasRef = React.createRef();
		this.borderBtmRef = React.createRef();
	}

	componentWillReceiveProps = (nextProps) => {};
	componentDidUpdate = (prevProps, prevState) => {};

	onChangeHandler = (e) => {
		let value = e?.target?.value;
		let key = e?.target?.name;

		this.setState({
			[key]: value,
		});
	};

	submitAcceptHandlerFunction = (e) => {
		e.preventDefault();

		if (!this.state.termsChecked) {
			return;
		}

		const details = {
			email: this.state.email,
			name: this.state.name,
		};
		this.props.submitButtonHandler(e, details);
		setTimeout(() => {
			this.props.handleClose();
		}, 1000);
	};

	render() {
		return (
			<div className="sign-block-wrapper">
				{window.innerWidth > 768 ? (
					<Modal {...this.props}>
						<form
							className="sign-block-container"
							onSubmit={this.submitAcceptHandlerFunction}
							style={{ height: 'auto' }}
						>
							<div className="header">
								<p>Accept</p>
								<span
									className="close-modal"
									onClick={() => this.props.handleClose()}
								>
									<CloseModal />
								</span>
							</div>
							<div className="body">
								<div className="e-sign-date">
									<span className="title">Accept</span>
									<span className="date">{new Date().toLocaleDateString()}</span>
								</div>

								<div className="sign-details">
									<input
										type="text"
										name="name"
										value={this.state.name}
										placeholder="Name"
										onChange={this.onChangeHandler}
										required
									/>
									<input
										type="email"
										name="email"
										value={this.state.email}
										placeholder="Email"
										onChange={this.onChangeHandler}
										required
									/>
								</div>

								<div className="terms-and-submit">
									<div className="terms">
										<label class="container">
											<input
												type="checkbox"
												checked={this.state.termsChecked}
												onChange={(e) =>
													this.setState({
														termsChecked: !this.state.termsChecked,
													})
												}
												required
											/>
											<span class="checkmark"></span>
										</label>
										<p>
											I agree that my electronic signature is as valid a
											legally bindings handwritten signature.
										</p>
									</div>
									<button
										className={`submit ${
											this.state.termsChecked &&
											this.state.name !== '' &&
											this.state.email !== ''
												? ''
												: 'submit-disabled'
										}`}
										type="submit"
										style={{
											cursor:
												this.state.termsChecked && true
													? 'pointer'
													: 'not-allowed',
										}}
									>
										Agree
									</button>
								</div>
								<div className="secured-by-ve">
									<Secure />
									Secured by
									<Ve />
								</div>
							</div>
						</form>
					</Modal>
				) : (
					<BottomModal
						onHide={this.props.handleClose}
						show={this.props.show}
						height={'80%'}
					>
						<form
							className="sign-block-container"
							onSubmit={this.submitAcceptHandlerFunction}
							style={{ width: '100%', height: '100%' }}
						>
							<div className="header">
								<p>Accept</p>
								<span
									className="close-modal"
									onClick={() => this.props.handleClose()}
								>
									<CloseModal />
								</span>
							</div>
							<div className="body">
								<div className="e-sign-date">
									<span className="title">Accept</span>
									<span className="date">{new Date().toLocaleDateString()}</span>
								</div>

								<div className="sign-details">
									<input
										type="text"
										name="name"
										value={this.state.name}
										placeholder="Name"
										onChange={this.onChangeHandler}
										required
									/>
									<input
										type="email"
										name="email"
										value={this.state.email}
										placeholder="Email"
										onChange={this.onChangeHandler}
										required
									/>
								</div>

								<div className="terms-and-submit">
									<div className="terms">
										<label class="container">
											<input
												type="checkbox"
												checked={this.state.termsChecked}
												onChange={(e) =>
													this.setState({
														termsChecked: !this.state.termsChecked,
													})
												}
												required
											/>
											<span class="checkmark"></span>
										</label>
										<p>
											I agree that my electronic signature is as valid a
											legally bindings handwritten signature.
										</p>
									</div>
									<button
										className={`submit ${
											this.state.termsChecked &&
											this.state.name !== '' &&
											this.state.email !== ''
												? ''
												: 'submit-disabled'
										}`}
										type="submit"
										style={{
											cursor:
												this.state.termsChecked && true
													? 'pointer'
													: 'not-allowed',
										}}
									>
										Agree
									</button>
								</div>
								<div className="secured-by-ve">
									<Secure />
									Secured by
									<Ve />
								</div>
							</div>
						</form>
					</BottomModal>
				)}
			</div>
		);
	}
}

export default SignatureModal;
