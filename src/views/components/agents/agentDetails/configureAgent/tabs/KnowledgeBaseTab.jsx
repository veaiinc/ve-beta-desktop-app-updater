import { memo, useContext, useEffect, useState } from 'react';
import s from './knowledgeBaseTab.module.scss';
import Context from '../../../../../../context/context';
import { ReactComponent as PlusSvg } from '../../../../../../assets/svg/ai_assistant/plus.svg';
import InfiniteScroll from '../../../../../components/globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../../../../helpers';
import { Switch } from 'antd';
import AddKnowledgeModal from '../../../../modalsV2/knowledgeAgent/AddKnowledgeModal';
const KnowledgeBaseTab = ({ agentId }) => {
	let {
		aiSetup: { getKnowledgeBaseFiles, knowledgeBaseFiles },
	} = useContext(Context);

	const [info, setInfo] = useState({
		knowledgeModalOpen: false,
	});

	useEffect(() => {
		if (agentId) {
			const page = 1,
				limit = 5,
				fetchMore = false;
			getKnowledgeBaseFiles(agentId, page, limit, fetchMore);
		}
	}, [agentId]);

	console.log(knowledgeBaseFiles);

	const fetchMoreKnowledgeBaseFiles = () => {
		const page = knowledgeBaseFiles?.currentPage + 1;
		const limit = 5;
		const fetchMore = true;
		getKnowledgeBaseFiles(agentId, page, limit, fetchMore);
	};

	knowledgeBaseFiles = {
		data: [
			{
				_id: '1',
				name: 'File 1',
				updatedAt: '2021-01-01',
				active: true,
			},
			{
				_id: '2',
				name: 'File 2',
				updatedAt: '2021-01-01',
				active: false,
			},
		],
		hasNextPage: true,
		currentPage: 1,
	};
	return (
		<div className={s?.knowledgeBaseContainer}>
			<div className={s?.knowledgeBaseHeader}>
				<div className={s?.headerContent}>
					<div className={s?.title}>Knowledge Base</div>
					<div className={s?.description}>
						Make files available to this AI assistant so it can use them as a source of
						knowledge for chats.
					</div>
				</div>
				<button className={s?.addKnowledgeBaseButton}>
					<div className={s?.iconContainer}>
						<PlusSvg />
					</div>
					Knowledge
				</button>
			</div>
			<div className={s?.assistantsListContainer}>
				<div className={s?.listHeader}>
					<div className={s?.title}>Title</div>
					<div className={s?.lastEdit}>Last edit</div>
					<div className={s?.active}>Active</div>
				</div>
				<div className={s?.assistantsList}>
					<InfiniteScroll
						dataLength={knowledgeBaseFiles?.data?.length || 0}
						next={fetchMoreKnowledgeBaseFiles}
						hasMore={knowledgeBaseFiles?.hasNextPage || false}
						loader={<FetchMoreLoaderComp />}
						height={'100%'}
						style={{
							width: '100%',
						}}
					>
						{knowledgeBaseFiles?.data?.map((file) => (
							<div className={s?.assistantItem} key={file?._id}>
								<div className={s?.assistantItemTitle}>{file?.name || ''}</div>
								<div className={s?.assistantItemLastEdit}>
									{file?.updatedAt || ''}
								</div>
								<div className={s?.assistantItemActive}>
									<Switch
										checked={file?.active || false}
										onChange={(checked) => {
											console.log(checked);
										}}
										size="small"
										style={{
											background: `${
												file?.active
													? 'var(--primary-font)'
													: 'var(--secondary-font)'
											}`,
										}}
										className={s?.agentSwitch}
									/>
								</div>
							</div>
						))}
					</InfiniteScroll>
				</div>
			</div>
			<AddKnowledgeModal
				isOpen={info?.knowledgeModalOpen}
				assistantId={agentId}
				toggleModal={() => {
					setInfo((prev) => ({ ...prev, knowledgeModalOpen: false }));
				}}
			/>
		</div>
	);
};

export default memo(KnowledgeBaseTab);
