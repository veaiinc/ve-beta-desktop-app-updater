import React, { useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/scss/authWrapper.scss';
import Header from '../components/Header';
import { Helmet } from 'react-helmet';
import useActiveWorkspace from '../hooks/useActiveWorkspace';

const AuthWrapper = ({ title, children, hideQuickNav = false }) => {
	const navigate = useNavigate();
	const [workspaceId, setActiveWorkspaceId] = useActiveWorkspace();

	useEffect(() => {
		if (!localStorage.getItem('usertoken')) {
			return navigate('/');
		}
	}, [navigate]);

	return (
		<div className="authParentContainer">
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title} | VE</title>
			</Helmet>

			<Header
				title={title}
				hideQuickNav={hideQuickNav}
				setActiveWorkspaceId={setActiveWorkspaceId}
				activeWorkspaceId={workspaceId}
			/>
			<div className="childrenContainer">{children}</div>
		</div>
	);
};

export default memo(AuthWrapper);
