import { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/AiSetup/memoryBlock.scss';
import { ReactComponent as Dustbin } from '../../../assets/svg/worflow_builder/dustbin.svg';
// import { ReactComponent as Pencil } from '../../../assets/svg/calendar/pencil.svg';
import Context from '../../../context/context';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../helpers';
import { message } from '../globalComponents/CustomToast';
import DeleteModal from '../modalsV2/DeleteModal/DeleteModal';
import { Markdown } from '../../../helpers/markdownHelper';

const limit = 10;
const infiniteScrollStyle = {
	display: 'flex',
	flexWrap: 'wrap',
	alignItems: 'flex-end',
	alignContent: 'flex-start',
	gap: '14px',
	width: '100%',
	overflowX: 'hidden',
};

const MemoryBlock = () => {
	const {
		aiSetup: { AIMemoryInfo, getAIMemoryInfo, deleteAIMemory },
	} = useContext(Context);

	const [info, setInfo] = useState({
		AIMemoryDeleteLoading: false,
		deleteModal: false,
		deleteMemoryId: null,
	});

	useEffect(() => {
		if (!AIMemoryInfo) {
			getAIMemoryInfo();
		}
	}, []);

	const AIMemoryList = AIMemoryInfo?.data || [];
	const AIMemoryListLength = AIMemoryList?.length || 0;
	const emptyAIMemoryList = AIMemoryListLength === 0;
	const hasNextPage = AIMemoryInfo?.hasNextPage || false;
	const currentPage = AIMemoryInfo?.currentPage || 1;

	const fetchNextAIMemoryList = () => {
		if (hasNextPage) {
			const page = currentPage + 1;
			getAIMemoryInfo({ page, limit });
		}
	};

	const handleDeleteAIMemory = async (memoryId) => {
		if (info?.AIMemoryDeleteLoading) return;
		setInfo((prev) => ({
			...prev,
			AIMemoryDeleteLoading: true,
		}));
		try {
			const response = await deleteAIMemory(memoryId);
			if (response?.[0]) {
				message?.success('Memory deleted successfully');
				// Close the modal on successful deletion
				setInfo((prev) => ({
					...prev,
					deleteModal: false,
					deleteMemoryId: null,
				}));
			} else {
				message?.error('Failed to delete memory');
			}
		} catch (error) {
			console.log('error==>handleDeleteAIMemory', error);
			message?.error('Failed to delete memory');
		} finally {
			setInfo((prev) => ({
				...prev,
				AIMemoryDeleteLoading: false,
			}));
		}
	};

	return emptyAIMemoryList ? (
		<p className="memoryBlockEmptyState">No data</p>
	) : (
		<div className="memoryBlockContainer">
			<InfiniteScroll
				dataLength={AIMemoryListLength}
				next={fetchNextAIMemoryList}
				hasMore={hasNextPage}
				loader={<FetchMoreLoaderComp />}
				style={infiniteScrollStyle}
				height={'100%'}
			>
				{AIMemoryList?.map((item) => (
					<div key={item.id} className={`memoryBlockItem`}>
						<div className="memoryBlockItemTitle">
							<Markdown>{item?.content}</Markdown>
						</div>
						<div className="memoryBlockItemActions">
							{/* <button
							className="deleteButton"
							onClick={() =>
								onEditClick('memory', item?._id, null, item?.description)
							}
						>
							<Pencil />
						</button> */}
							<button
								className="deleteButton"
								onClick={() =>
									setInfo((prev) => ({
										...prev,
										deleteModal: true,
										deleteMemoryId: item?.id,
									}))
								}
							>
								<Dustbin />
							</button>
						</div>
					</div>
				))}
			</InfiniteScroll>
			<DeleteModal
				isOpen={info?.deleteModal}
				onClose={() => setInfo((prev) => ({ ...prev, deleteModal: false }))}
				onConfirm={() => handleDeleteAIMemory(info?.deleteMemoryId)}
				title="Delete Memory?"
				itemType="Memory"
				description="Are you sure you want to delete this memory?"
				warning="This memory will be permanently removed and cannot be recovered."
			/>
		</div>
	);
};

export default memo(MemoryBlock);
