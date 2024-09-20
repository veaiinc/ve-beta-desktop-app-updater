import ReusableButtonSettings from '../ReusableButtonSettings';

// update password component
const UpdatePasswordComponent = ({ handleFormPopUp }) => {
	return (
		<div className={'accessContainer'}>
			<div className={'accessInfo'}>
				<h4>Strengthen your Account Security</h4>
				<p>
					As you've signed up through Google, we suggest adding a password for extra
					security.
				</p>
				{/* <button>Update my password</button> */}
				<ReusableButtonSettings
					text={'Update my password'}
					func={() => handleFormPopUp()}
				/>
			</div>
		</div>
	);
};

export default UpdatePasswordComponent;
