// import React from 'react';
import s from './pageLoader.module.scss';
import Spinner from '../../components/loaders/Spinner';
import useTheme from '../../../hooks/useTheme';
import useWorkspaceMode from '../../../hooks/useWorkspaceMode';

const PageLoader = () => {
	useTheme();
	const { workspaceNotFound } = useWorkspaceMode();
	return workspaceNotFound ? (
		<h1>Workspace Not Found!</h1>
	) : (
		<div className={s.loaderContainer}>
			<Spinner
				width="32px"
				height="32px"
				color="var(--primary-button)"
				borderTopColor="var(--background-color)"
				borderWidth="1.5"
			/>
		</div>
	);
};

export default PageLoader;
