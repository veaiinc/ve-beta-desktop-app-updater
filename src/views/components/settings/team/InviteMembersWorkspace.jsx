import React from 'react';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/close.svg';
import ReusableButtonSettings from '../ReusableButtonSettings';

const InviteMembersWorkspaceComponent = ({
	handleChnage,
	info,
	handleSubmit,
	sendRequestList,
	setsendRequestList,
}) => {
	return (
		<>
			<div className="inviteMemberText">
				<h1>Invite Members to Workspace</h1>
				<p>
					Members you invite will have full access to your workspace unless you customise
					user roles
				</p>
			</div>

			{/* <div>
				<div className="sendRequestInputContainer">
					<div className="sendRequestInput">
						<input
							type="email"
							className="textInput"
							placeholder="Enter text here..."
							name="emailID"
							onChange={handleChnage}
							value={info.emailID}
						/>
						<div className="dropdownContainer">
							<select className="dropdownInput">
								<option value="">Admin</option>
								<option value="">Member</option>
							</select>
						</div>
					</div>
				</div>

				{info.emailIDError && (
					<p
						style={{
							color: 'crimson',
							fontSize: '11px',
							fontFamily: 'Inter',
							marginLeft: '10px',
						}}
					>
						{info.emailIDMessage}
					</p>
				)}
			</div> */}

			{sendRequestList?.map((singleUser, index) => {
				return (
					<div>
						<div className="sendRequestInputContainer">
							<div className="sendRequestInput">
								<input
									type="email"
									className="textInput"
									placeholder="Enter text here..."
									name="email"
									onChange={(e) => handleChnage(e, index)}
									value={singleUser?.email}
								/>
								<div className="dropdownContainer">
									<select
										className="dropdownInput"
										name="userRole"
										onChange={(e) => handleChnage(e, index)}
									>
										<option value="admin">Admin</option>
										<option value="default">Member</option>
									</select>
								</div>
							</div>
						</div>

						{singleUser.emailIDError && (
							<p
								style={{
									color: 'crimson',
									fontSize: '11px',
									fontFamily: 'Inter',
									marginLeft: '10px',
								}}
							>
								{singleUser.emailIDMessage}
							</p>
						)}
					</div>
				);
			})}

			<div className="buttonsContainer">
				<div
					className="addmore"
					onClick={() =>
						setsendRequestList((prev) => [
							...prev,
							{
								email: '',
								userRole: 'admin',
								emailID: '',
								emailIDError: '',
								emailIDMessage: '',
							},
						])
					}
				>
					<span>
						<PlusSvg />
					</span>
					<p>Add More</p>
				</div>
				<div style={{ minWidth: '150px' }}>
					<ReusableButtonSettings text="Send Request" func={handleSubmit} />
				</div>
			</div>
		</>
	);
};

export default InviteMembersWorkspaceComponent;
