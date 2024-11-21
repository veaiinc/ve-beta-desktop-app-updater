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

			{sendRequestList?.map((singleUser, index) => {
				return (
					<div key={'singleUser' + index}>
						<div className="sendRequestInputContainer">
							<div className="sendRequestInput">
								<input
									type="email"
									className="textInput"
									placeholder="Type here..."
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

						{singleUser?.emailIDError && !singleUser?.successTrue && (
							<p
								style={{
									color: 'crimson',
									fontSize: '11px',
									fontFamily: 'Inter',
									textAlign: 'end',
									marginTop: '10px',
								}}
							>
								{singleUser.emailIDMessage}
							</p>
						)}

						{singleUser?.successTrue && !singleUser?.emailIDError && (
							<p
								style={{
									color: 'green',
									fontSize: '11px',
									fontFamily: 'Inter',
									textAlign: 'end',
									marginTop: '10px',
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
					onClick={() => {
						if (info?.buttonLoading) return;
						setsendRequestList((prev) => [
							...prev,
							{
								email: '',
								userRole: 'admin',
								emailIDError: '',
								emailIDMessage: '',
								successTrue: false,
							},
						]);
					}}
				>
					<span>
						<PlusSvg />
					</span>
					<p>Add More</p>
				</div>
				<div style={{ minWidth: '150px', display: 'flex', gap: '5px' }}>
					{sendRequestList?.length > 1 && (
						<ReusableButtonSettings
							text="Reset"
							func={() =>
								setsendRequestList([
									{
										email: '',
										userRole: 'admin',
										emailIDError: '',
										emailIDMessage: '',
										successTrue: false,
									},
								])
							}
						/>
					)}
					<ReusableButtonSettings text="Send Request" func={handleSubmit} />
				</div>
			</div>
		</>
	);
};

export default InviteMembersWorkspaceComponent;
