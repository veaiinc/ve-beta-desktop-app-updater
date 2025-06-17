import React, { memo, useEffect } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Skeleton from 'react-loading-skeleton';
import HeaderEditDropdown from '../../../dropDown/notes/database/HeaderEditDropdown';
import { Tooltip } from 'antd';
import s from '../../../../../assets/scss/notes/databaseComponents/tableView.module.scss';

const TableHeader = ({ columns, handleResizeStart, loading, databaseId, pageId }) => {
	return (
		<Droppable droppableId="table-header" direction="horizontal">
			{(provided) => (
				<div className={s.tableHeader} ref={provided.innerRef} {...provided.droppableProps}>
					<div className={s.tableHeaderRow}>
						{columns?.map((column, index) => (
							<Draggable
								key={column._id}
								draggableId={column._id}
								index={index}
								isDragDisabled={loading}
							>
								{(provided, snapshot) => (
									<div
										ref={provided.innerRef}
										{...provided.draggableProps}
										className={`${s.tableHeaderCell} ${
											column?.userResized ? s.userResized : ''
										} ${snapshot?.isDragging ? s.dragging : ''}`}
										style={{
											...provided.draggableProps.style,
											'--width': `${column?.width}px`,
											width: column?.width,
											flex: '1 0 auto',
										}}
									>
										<div
											className={s.headerContent}
											{...provided.dragHandleProps}
										>
											<Tooltip
												title={
													<HeaderEditDropdown
														databaseId={databaseId}
														field={column}
														pageId={pageId}
													/>
												}
												arrow={false}
												trigger={'click'}
												color={'transparent'}
												overlayStyle={{
													minWidth: 'fit-content',
													padding: '0',
												}}
												style={{ padding: 0 }}
												placement="bottomLeft"
											>
												<div className={s.tableHeaderCellContent}>
													{column?.Icon && (
														<column.Icon
															className={s.tableHeaderIcon}
														/>
													)}
													<div className={s.headerLabel}>
														{loading ? (
															<Skeleton
																height={16}
																width="80%"
																baseColor="#202020"
																highlightColor="#444"
															/>
														) : (
															column?.name
														)}
													</div>
												</div>
											</Tooltip>
										</div>
										{!loading && index < columns?.length - 1 && (
											<div
												className={s.resizeHandle}
												onMouseDown={(e) => handleResizeStart(e, index)}
											/>
										)}
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				</div>
			)}
		</Droppable>
	);
};

export default memo(TableHeader);
