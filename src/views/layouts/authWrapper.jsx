import React, { useEffect, memo, useContext, useState } from 'react';
import '../../assets/scss/authWrapper.scss';
import { Helmet } from 'react-helmet';
import useActiveWorkspace from '../hooks/useActiveWorkspace';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Sidebar from '../components/sidebar/Sidebar';
import useAuth from '../hooks/useAuth';
import useSubscription from '../hooks/useSubscription';
import useTokenExpiry from '../hooks/useTokenExpiry';
import BottomToolbar from '../components/ai_agents/BottomToolbar';
import { message } from 'antd';
import Context from '../../context/context';

const AuthWrapper = ({ title, children, maxWidth = '', showBottomToolbar = true }) => {
	const [workspaceId, setActiveWorkspaceId] = useActiveWorkspace();
	const [uploadedFiles, setUploadedFiles] = useState([]);

	const checkAuth = useAuth();
	// const data = useSubscription();
	const tokenData = useTokenExpiry();
	const {
		aiSetup: { uploadImageToKnowledgeBase },
	} = useContext(Context);

	useEffect(() => {
		checkAuth();
	}, []);

	const handleAiUploadImage = async (uploadedImage) => {
		try {
			const response = await uploadImageToKnowledgeBase(uploadedImage);
			if (response?.[0]) {
				const { _id, uploadBatchId, sessionId } = response?.[1];
				setUploadedFiles([
					...uploadedFiles,
					{ _id, uploadBatchId, sessionId, filename: uploadedImage?.name },
				]);
				return { _id, uploadBatchId, sessionId };
			} else {
				message.error('An error occurred while uploading the image.');
			}
		} catch (error) {
			console.log('Something went wrong! ', error);
		}
	};

	return (
		<div className="authParentContainer">
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title} | VE</title>
			</Helmet>

			<div
				style={{
					display: 'flex',
					height: '100vh',
					padding: '60px 0 0 32px',
				}}
			>
				<SkeletonTheme baseColor={'#313131'} highlightColor={'#525252'}>
					<Sidebar
						setActiveWorkspaceId={setActiveWorkspaceId}
						activeWorkspaceId={workspaceId}
					/>

					<div
						style={{ flex: 1, overflowY: 'auto', maxHeight: '100%', height: '100%' }}
						id="scrollableTarget"
					>
						<div className="childrenContainer" style={{ maxWidth: maxWidth || '' }}>
							{children}
						</div>
					</div>
				</SkeletonTheme>
			</div>
			{showBottomToolbar ? (
				<BottomToolbar
					outerContainerStyle={{ bottom: '10px' }}
					// chatList={info?.chatList}
					// onSend={handleSendMessage}
					// aiChatLoading={info?.aiChatLoading}
					handleAiUploadImage={handleAiUploadImage}
				/>
			) : (
				''
			)}
		</div>
	);
};

export default memo(AuthWrapper);
