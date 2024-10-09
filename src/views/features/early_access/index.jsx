import React, { memo, useCallback, useEffect } from 'react';
import '../../../assets/scss/earlyAccess/earlyAccess.scss';
import { ReactComponent as VE } from '../../../assets/svg/ve.svg';
import { ReactComponent as Facebook } from '../../../assets/svg/earlyAccess/facebook.svg';
import { ReactComponent as LinkedIn } from '../../../assets/svg/earlyAccess/linkedIn.svg';
import { ReactComponent as Instagram } from '../../../assets/svg/earlyAccess/instagram.svg';
import { useNavigate } from 'react-router-dom';
const EarlyAccess = () => {
	const navigate = useNavigate();
	useEffect(() => {
		checkIsOnBoardUser();
	}, []);

	const checkIsOnBoardUser = useCallback(() => {
		const isOnboard = JSON.parse(localStorage.getItem('isOnboard'));
		const usertoken = localStorage.getItem('usertoken');
		if (isOnboard && usertoken) {
			navigate('/home');
		}
	}, []);

	return (
		<div className="earlyAccessParentContainer">
			<VE />
			<div className="backdropStuff"></div>
			<div className="earlyAccessScreenTextContainer">
				<span className="earlyAccessMainText">
					Your request for <br></br>
					<span className="earlyAccessText">Early access</span> is submitted!
				</span>
				<span className="earlyAccessSubText">
					You will receive an email once your request is approved!
				</span>
			</div>
			{/* footer */}
			<div className="earlyAccessFooter">
				<span className="earlyAccessFooterText">Follow us for more updates</span>
				<div className="earlyAccessFooterIconHolder">
					<Facebook />
					<LinkedIn />
					<Instagram />
				</div>
			</div>
		</div>
	);
};

export default memo(EarlyAccess);
