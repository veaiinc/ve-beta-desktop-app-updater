import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/smart-file-components/file.scss';
import Services from './Services';
import Events from './Events';
import Context from '../../../context/context';
import PaymentSchedule from './PaymentSchedule';
import Signature from './Signature';

const File = ({
	fileData,
	workflowId,
	serviceBlockChanges,
	eventsBlockChanges,
	scrollAndHighlightElement,
	showSignatureModal,
	onCloseSignatureModal,
	formResponses,
}) => {
	const {
		templates: { updateFiles },
	} = useContext(Context);

	const [info, setInfo] = useState({
		serviceTableData: [],
		eventsTableData: [],
		timeout: null,
		fileData: null,
		contractSignatureData: [],
	});

	useEffect(() => {
		if (fileData) {
			let serviceTableData = [],
				eventsTableData = [],
				contractSignatureData = [],
				paymentScheduleData = [];
			const { tables = [], sections = [] } = fileData?.versions?.[0] || {};

			for (let i = 0; i < sections?.length; i++) {
				if (sections?.[i]?.type === 'services') {
					serviceTableData?.push(sections?.[i]);
				}
				if (sections?.[i]?.type === 'invoice-with-payment') {
					paymentScheduleData?.push(sections?.[i]);
				}
			}

			for (let i = 0; i < tables?.length; i++) {
				if (tables?.[i]?.type === 'events') {
					eventsTableData?.push(tables?.[i]);
				}
				if (tables?.[i]?.type === 'contract-with-signature') {
					contractSignatureData?.push(tables?.[i]);
				}
			}
			setInfo((prev) => ({
				...prev,
				serviceTableData,
				eventsTableData,
				fileData,
				contractSignatureData,
				paymentScheduleData,
			}));
		}
	}, [fileData]);

	const serviceTableOnChnageFunc = useCallback(
		async (updateServiceBlockInfo, index) => {
			serviceBlockChanges(updateServiceBlockInfo);
			let updatedServiceData = [...(info?.serviceTableData || [])];
			updatedServiceData?.splice(index, 1, updateServiceBlockInfo);
			const serviceBlockId = updateServiceBlockInfo?._id;
			const fileData = { ...(info?.fileData || {}) };
			const { sections, tables } = fileData?.versions?.[0] || {};
			let replaceServiceIndex = -1;
			for (let i = 0; i < sections?.length; i++) {
				if (sections?.[i]?.type === 'services' && sections?.[i]?._id === serviceBlockId) {
					replaceServiceIndex = i;
					break;
				}
			}
			if (replaceServiceIndex !== -1) {
				sections?.splice(replaceServiceIndex, 1, updateServiceBlockInfo);
			}
			const { _id, blocks } = updateServiceBlockInfo || {};
			const blcoksMapper = {};
			for (let i = 0; i < blocks?.length; i++) {
				blcoksMapper[blocks?.[i]?._id] = blocks?.[i]?.subBlocks?.[0];
			}
			for (let i = 0; i < tables?.length; i++) {
				if (tables?.[i]?.type === 'services' && tables?.[i]?._id === _id) {
					let values = tables?.[i]?.values || [];
					for (let j = 0; j < values?.length; j++) {
						if (blcoksMapper?.[values?.[j]?.blockId]) {
							const {
								show,
								amount,
								description,
								price,
								quantity,
								title,
								currency,
								imageURL,
							} = blcoksMapper?.[values?.[j]?.blockId] || {};
							values[j] = {
								...(values[j] || {}),
								show,
								amount,
								description,
								price,
								quantity,
								title,
								currency,
								image: imageURL,
							};
						}
					}
					tables[i].values = values;
					tables[i].styles = updateServiceBlockInfo.style;
				}
			}
			fileData.versions[0] = { ...fileData?.versions?.[0], sections, tables };
			setInfo((prev) => ({
				...prev,
				fileData,
				serviceTableData: updatedServiceData,
			}));
			handleDeboucne();
		},
		[info, fileData, serviceBlockChanges],
	);

	const handleEventsTableChange = useCallback(
		async (updatedData, subBlockId) => {
			eventsBlockChanges({ eventsTable: [updatedData] });
			if (subBlockId && typeof scrollAndHighlightElement === 'function') {
				// console.log('handleEventsTableChange: Scrolling to subBlockId', subBlockId);
				scrollAndHighlightElement(subBlockId);
			}
			let updatedEventsData = [...(info?.eventsTableData || [])];
			const fileData = { ...(info?.fileData || {}) };
			const { sections = [], tables = [] } = fileData?.versions?.[0] || {};

			let index = -1;
			for (let i = 0; i < tables?.length; i++) {
				if (tables?.[i]?._id === updatedData?._id) {
					index = i;
					break;
				}
			}
			if (index !== -1) {
				tables[index] = updatedData;
			}
			for (let i = 0; i < updatedEventsData?.length; i++) {
				if (updatedEventsData?.[i]?._id === updatedData?._id) {
					updatedEventsData[i] = { ...(updatedData || {}) };
					break;
				}
			}

			let sectionIndex = -1;
			const { _id, values } = updatedData;
			for (let i = 0; i < sections?.length; i++) {
				if (sections?.[i]?._id === _id && sections?.[i]?.type === 'events') {
					sectionIndex = i;
					break;
				}
			}
			if (sectionIndex !== -1) {
				let blocksMapper = {},
					valuesMapper = {};
				let { blocks = [] } = sections?.[sectionIndex];
				for (let i = 0; i < blocks?.length; i++) {
					blocksMapper[blocks?.[i]?._id] = blocks?.[i];
				}
				for (let i = 0; i < values?.length; i++) {
					valuesMapper[values?.[i]?.blockId] = values?.[i];
					const {
						blockId,
						roles = [],
						name = '',
						location = '',
						description = '',
						date = '',
						subBlockId = '',
					} = values?.[i];

					if (blocksMapper?.[blockId]) {
						blocksMapper[blockId] = {
							...(blocksMapper?.[blockId] || {}),
							subBlocks: [
								{
									...(blocksMapper?.[blockId]?.subBlocks?.[0] || {}),
									roles,
									name,
									location,
									description,
									date,
								},
							],
						};
					} else {
						blocksMapper[blockId] = {
							order: blocks?.length + 1,
							_id: blockId,
							subBlocks: [
								{
									roles,
									name,
									location,
									description,
									date,
									subBlockId,
								},
							],
						};
					}
				}
				let updatedBlocks = Object.values(blocksMapper)?.sort(
					(a, b) => a?.order - b?.order,
				);
				updatedBlocks = updatedBlocks?.filter((ele) => valuesMapper?.[ele?._id]);

				sections[sectionIndex] = {
					...(sections?.[sectionIndex] || {}),
					blocks: [...(updatedBlocks || [])],
				};
			}
			fileData.versions[0] = { ...fileData?.versions?.[0], sections, tables };
			setInfo((prev) => ({
				...prev,
				fileData,
				eventsTableData: updatedEventsData,
			}));
			handleDeboucne();
		},
		[info, eventsBlockChanges, scrollAndHighlightElement],
	);

	const updateFileData = useCallback(() => {
		const payload = {
			workflowId: workflowId,
			proposalId: fileData?._id,
			proposalInput: {
				versions: {
					tables: info?.fileData?.versions?.[0]?.tables,
					sections: info?.fileData?.versions?.[0]?.sections,
				},
			},
			versionId: info?.fileData?.activeVersion,
		};

		updateFiles(payload);
	}, [info, workflowId, fileData]);

	const handleDeboucne = useCallback(() => {
		clearTimeout(info?.timeout);
		const timeout = setTimeout(() => {
			updateFileData();
		}, 1000);
		setInfo((prev) => ({ ...prev, timeout }));
	}, [info, updateFileData]);

	// handling event blocks reordering
	const handleEventsOrdering = useCallback(
		(sectionId, blockId, action) => {
			const fileData = { ...(info?.fileData || {}) };
			const { sections = [], tables = [] } = fileData?.versions?.[0] || {};
			const newSections = sections?.map((sectionItem) => {
				if (sectionItem?._id === sectionId) {
					const currentBlocks = [...(sectionItem?.blocks || [])];
					const blockIndex = currentBlocks.findIndex((block) => block?._id === blockId);
					let newIndex = blockIndex;
					if (action === 'up' && blockIndex > 0) {
						newIndex = blockIndex - 1;
					} else if (action === 'down' && blockIndex < currentBlocks.length - 1) {
						newIndex = blockIndex + 1;
					}
					if (
						blockIndex !== -1 &&
						newIndex !== blockIndex &&
						newIndex >= 0 &&
						newIndex < currentBlocks.length
					) {
						const temp = currentBlocks[newIndex];
						currentBlocks[newIndex] = currentBlocks[blockIndex];
						currentBlocks[blockIndex] = temp;
						// Update order property after swap
						currentBlocks.forEach((block, idx) => {
							block.order = idx + 1;
						});
					}
					return {
						...sectionItem,
						blocks: currentBlocks,
					};
				}
				return sectionItem;
			});

			let newEventsTables = [];
			const newTables = tables?.map((tableItem) => {
				if (tableItem?._id === sectionId && tableItem.type === 'events') {
					const currentValues = [...(tableItem?.values || [])];
					const valueIndex = currentValues.findIndex(
						(value) => value?.blockId === blockId,
					);
					let newValueIndex = valueIndex;
					if (action === 'up' && valueIndex > 0) {
						newValueIndex = valueIndex - 1;
					} else if (action === 'down' && valueIndex < currentValues.length - 1) {
						newValueIndex = valueIndex + 1;
					}
					if (
						valueIndex !== -1 &&
						newValueIndex !== valueIndex &&
						newValueIndex >= 0
						// &&
						// newValueIndex < currentValues.length
					) {
						const temp = currentValues[newValueIndex];
						currentValues[newValueIndex] = currentValues[valueIndex];
						currentValues[valueIndex] = temp;
						// Update order property for values after swap
						currentValues.forEach((val, idx) => {
							val.order = idx + 1;
						});
					}
					const newTableVal = {
						...tableItem,
						values: currentValues,
					};
					newEventsTables.push(newTableVal);
					return newTableVal;
				}
				return tableItem;
			});

			fileData.versions[0] = {
				...fileData?.versions?.[0],
				sections: newSections,
				tables: newTables,
			};

			const updatedEventsTableData = newTables.filter((t) => t.type === 'events');
			eventsBlockChanges({ eventsTable: updatedEventsTableData });

			setInfo((prev) => ({
				...prev,
				fileData,
				eventsTableData: updatedEventsTableData,
			}));
			handleDeboucne();
		},
		[info, eventsBlockChanges, handleDeboucne],
	);

	const handleContractDataChanges = useCallback(
		(updatedContractData) => {
			const { sections = [], tables = [] } = fileData?.versions?.[0] || {};
			let index = -1;
			for (let i = 0; i < tables?.length; i++) {
				if (
					tables?.[i]?._id === updatedContractData?._id &&
					tables?.[i]?.type === 'contract-with-signature'
				) {
					index = i;
					break;
				}
			}

			if (index !== -1) {
				tables[index] = updatedContractData;
			}

			let sectionIndex = -1;
			for (let i = 0; i < sections?.length; i++) {
				if (
					sections?.[i]?._id === updatedContractData?._id &&
					sections?.[i]?.type === 'contract-with-signature'
				) {
					sectionIndex = i;
					break;
				}
			}

			if (sectionIndex) {
				let tableValues = [...(updatedContractData?.values || [])];

				for (let i = 0; i < tableValues?.length; i++) {
					tableValues[i]._id = tableValues[i]?.subBlockId;
				}
				let blocks = [
					{ ...(sections?.[sectionIndex]?.blocks?.[0] || {}), subBlocks: tableValues },
				];
				sections[sectionIndex] = { ...(sections?.[sectionIndex] || {}), blocks };
			}

			fileData.versions[0] = { ...fileData?.versions?.[0], sections, tables };
			setInfo((prev) => ({ ...prev, fileData }));
			handleDeboucne();
		},
		[info],
	);

	const handlePaymentScheduleChanges = useCallback(
		(updatedData) => {
			const { sections = [], tables = [] } = fileData?.versions?.[0] || {};
			let sectionIndex = -1;
			for (let i = 0; i < sections?.length; i++) {
				if (
					sections?.[i]?._id === updatedData?._id &&
					sections?.[i]?.type === 'invoice-with-payment'
				) {
					sectionIndex = i;
					break;
				}
			}
			if (sectionIndex !== -1) {
				sections[sectionIndex] = updatedData;
			}
			fileData.versions[0] = { ...fileData?.versions?.[0], sections, tables };
			setInfo((prev) => ({ ...prev, fileData }));
			handleDeboucne();
		},
		[info],
	);

	const hasAnyData =
		(info?.serviceTableData && info.serviceTableData.length > 0) ||
		(info?.eventsTableData && info.eventsTableData.length > 0) ||
		(info?.paymentScheduleData && info.paymentScheduleData.length > 0) ||
		(info?.contractSignatureData && info.contractSignatureData.length > 0);

	if (!hasAnyData) {
		return null;
	}

	return (
		<div className="fileContainer">
			{info?.serviceTableData && info.serviceTableData.length > 0 && (
				<Services
					serviceData={info.serviceTableData}
					serviceOnChangeFunc={serviceTableOnChnageFunc}
				/>
			)}
			{info?.eventsTableData && info.eventsTableData.length > 0 && (
				<Events
					eventsData={info.eventsTableData}
					eventsDataChange={handleEventsTableChange}
					scrollAndHighlightElement={scrollAndHighlightElement}
					formResponses={formResponses}
					eventsOrderChange={handleEventsOrdering}
				/>
			)}
			{info?.paymentScheduleData && info.paymentScheduleData.length > 0 && (
				<PaymentSchedule
					data={info.paymentScheduleData}
					handlePaymentScheduleChanges={handlePaymentScheduleChanges}
				/>
			)}
			{info?.contractSignatureData && info.contractSignatureData.length > 0 && (
				<div className="signature-component">
					<Signature
						contractSignatureData={info.contractSignatureData}
						filedata={info?.fileData || {}}
						handleContractDataChanges={handleContractDataChanges}
						showSignatureModal={showSignatureModal}
						onCloseSignatureModal={onCloseSignatureModal}
					/>
				</div>
			)}
		</div>
	);
};

export default memo(File);
