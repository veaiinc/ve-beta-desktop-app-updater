import '../../../assets/scss/document/summary.scss';
import Context from '../../../context/context';
import { useContext } from 'react';
import { ReactComponent as VerifiedSvg } from '../../../assets/svg/Vector.svg';
import { ReactComponent as EyeIcon } from '../../../assets/svg/document/eye.svg';
import UploadSignatureModal from '../SmartFileDetails/UploadSignatureModal';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Summary = () => {
	const {
		templates: {
			workflowInfoDetails,
			getSignedUrlForContracts,
			updateStateValues,
			uploadContractSignature,
			updateFiles,
		},
	} = useContext(Context);
	const navigate = useNavigate();

	const [signatureModal, setSignatureModal] = useState(false);
	const [activeSignerIndex, setActiveSignerIndex] = useState(null);
	const [localSigners, setLocalSigners] = useState(null);

	// Helper function to group items by type
	const groupByType = (items) => {
		const grouped = {};
		items?.forEach((item) => {
			const { type } = item;
			if (!grouped[type]) {
				grouped[type] = [];
			}
			grouped[type].push(item);
		});
		return grouped;
	};

	// Helper function to format currency
	const formatCurrency = (amount, currency = 'INR') => {
		if (currency === 'INR') {
			return `₹${amount}`;
		}
		if (currency === 'USD') {
			return `$${amount}`;
		}
		return `${currency} ${amount}`;
	};

	// Helper function to calculate total for a section
	const calculateSectionTotal = (items) => {
		return items?.reduce((total, item) => {
			const itemTotal = item.blocks?.reduce((blockTotal, block) => {
				const blockAmount = block.subBlocks?.reduce((subTotal, subBlock) => {
					return subTotal + (Number(subBlock.amount) || 0) * (subBlock.quantity || 1);
				}, 0);
				return blockTotal + blockAmount;
			}, 0);
			return total + itemTotal;
		}, 0);
	};

	// Helper function to get user role label
	const getUserRoleLabel = (userType) => {
		switch (userType) {
			case 'endUser':
				return 'Client';
			case 'tenantUser':
				return 'Owner';
			default:
				return userType;
		}
	};

	// Helper function to get signature status text and class
	const getSignatureStatus = (signer, allSigners) => {
		const tenantUser = allSigners?.find((s) => s.userType === 'tenantUser');
		const endUser = allSigners?.find((s) => s.userType === 'endUser');
		const fileStatus = workflowInfoDetails?.status;
		if (signer.userType === 'tenantUser') {
			if (fileStatus === 'confirmed') {
				return {
					text: 'This Document is alredy Confirmed',
					class: 'confirmed',
					showSignButton: false,
					showNotViewed: false,
				};
			}
			if (!signer.value) {
				return {
					text: '[Awaiting Signature]',
					class: 'awaiting',
					showSignButton: true,
					showNotViewed: false,
				};
			}
			return {
				text: 'Signed',
				class: 'signed',
				showSignButton: false,
				showNotViewed: false,
			};
		} else {
			// endUser
			// If endUser.value is empty, it means not signed or not viewed
			if (!endUser?.value) {
				return {
					text: 'No Signature',
					class: 'not-signed',
					showSignButton: false,
					showNotViewed: false,
				};
			}

			return {
				text: 'Signed',
				class: 'signed',
				showSignButton: false,
				showNotViewed: false,
			};
		}
	};

	// Group sections by type
	// const sections = groupByType(workflowInfoDetails?.summary?.sections);

	// Helper to get signers from tables if available, else from summary
	const getContractSigners = () => {
		const contractTable = workflowInfoDetails?.summary?.tables?.find(
			(t) => t.type === 'contract-with-signature',
		);
		if (
			contractTable &&
			Array.isArray(contractTable.values) &&
			contractTable.values.length > 0
		) {
			return contractTable.values;
		}
		return [];
	};

	// Sort signers to show tenant first, then client
	const sortedSigners = (signers) => {
		if (!Array.isArray(signers)) return [];
		return [...signers].sort((a, b) => {
			if (a.userType === 'tenantUser') return -1;
			if (b.userType === 'tenantUser') return 1;
			return 0;
		});
	};

	const handleOpenSignatureModal = (signerIndex) => {
		setActiveSignerIndex(signerIndex);
		setSignatureModal(true);
	};

	const handleCloseSignatureModal = () => {
		setSignatureModal(false);
		setActiveSignerIndex(null);
	};

	const handleSignatureSubmit = useCallback(
		async (data) => {
			let response;
			let signatiurInfo;
			const signers = localSigners || getContractSigners();
			const updatedSigners = [...signers];

			if (data?.type === 'text') {
				updatedSigners[activeSignerIndex] = {
					...updatedSigners[activeSignerIndex],
					value: data?.signatureText || '',
					type: 'text',
				};
				signatiurInfo = {
					type: 'text',
					value: data?.signatureText || '',
					uploadedOn: Date.now(),
				};
				response = [true];
			} else {
				const payload = {
					uploadContractSignedUrlId: workflowInfoDetails?._id,
				};
				const signedUrlResp = await getSignedUrlForContracts(payload);
				if (signedUrlResp?.[0]) {
					const { signedUrl } = signedUrlResp?.[1] || {};
					const paylaod = {
						dataURL: data.dataURL,
						signedUrl,
						userType: 'tenantUser',
					};
					response = await uploadContractSignature(paylaod);
					signatiurInfo = {
						type: 'sign',
						s3_300w_key: data.dataURL,
						userType: 'tenantUser',
						uploadedOn: Date.now(),
					};
					updatedSigners[activeSignerIndex] = {
						...updatedSigners[activeSignerIndex],
						value: data.dataURL,
						type: 'sign',
					};
				}
			}

			setLocalSigners(updatedSigners);

			// --- API update logic ---
			const tables = Array.isArray(workflowInfoDetails?.summary?.tables)
				? [...workflowInfoDetails.summary.tables]
				: [];
			const contractTableIdx = tables.findIndex((t) => t.type === 'contract-with-signature');
			if (contractTableIdx !== -1) {
				tables[contractTableIdx] = {
					...tables[contractTableIdx],
					values: updatedSigners,
				};
			}

			if (response?.[0]) {
				updateStateValues({ contractSignedLocalState: signatiurInfo });
				handleCloseSignatureModal();
			}
		},
		[activeSignerIndex, localSigners, workflowInfoDetails, updateFiles],
	);
	const signers = localSigners || getContractSigners();

	// Get all services tables
	const servicesTables = (workflowInfoDetails?.summary?.tables || []).filter(
		(t) => t.type === 'services',
	);

	// Helper to filter service items based on services_selection, show, and isSelected (table version)
	const filterServiceTableItems = (items, selection) => {
		if (!Array.isArray(items)) return [];
		if (selection === 2) {
			return items.filter((item) => item.show);
		} else if (selection === 1 || selection === 0) {
			return items.filter((item) => item.show && item.isSelected);
		}
		return items;
	};

	// Update subtotal calculation to use filtered items (table version)
	const calculateFilteredTableTotal = (filteredItems) => {
		return filteredItems.reduce((total, item) => {
			return total + (Number(item.amount) || 0) * (item.quantity || 1);
		}, 0);
	};

	const extractNumberFromHTML = (htmlString) => {
		if (typeof htmlString !== 'string' || !htmlString.trim()) return 0;

		// Strip HTML tags if any
		const textOnly = htmlString.replace(/<[^>]*>/g, '').trim();

		// Match the first number-like pattern, e.g., 1,234.56 or 1234
		const match = textOnly.match(/[\d,.]+/);

		if (!match) return 0;

		// Clean commas (for thousands separator), then try to parse to float
		const cleaned = match[0].replace(/,/g, '');

		// Ensure it's a valid number
		const number = parseFloat(cleaned);
		return isNaN(number) ? 0 : number;
	};

	// Calculate overall total across all service tables
	const overallServicesTotal = servicesTables.reduce((sum, table) => {
		const filtered = filterServiceTableItems(
			table.values || [],
			table.styles?.services_selection,
		);
		let subtotal = calculateFilteredTableTotal(filtered);
		if (
			table.styles?.services_selection === 2 &&
			filtered.length > 0 &&
			subtotal === 0 &&
			table.styles?.subTotalValue
		) {
			const extracted = extractNumberFromHTML(table.styles.subTotalValue);
			subtotal = extracted;
		}
		return sum + subtotal;
	}, 0);

	// Helper to check if there are any filtered service items in all services
	const hasAnyFilteredServiceItems = (services) => {
		if (!Array.isArray(services)) return false;
		return services.some(
			(service) =>
				filterServiceTableItems(service, serviceStyles?.services_selection).length > 0,
		);
	};

	// Helper to check if any event subBlock has non-empty data
	const hasAnyNonEmptyEvent = (events) => {
		if (!Array.isArray(events)) return false;
		let found = false;
		events.forEach((event) => {
			event?.blocks?.forEach((block) => {
				if (Array.isArray(block.subBlocks)) {
					block.subBlocks.forEach((subBlock) => {
						if (
							(subBlock.name && subBlock.name.trim()) ||
							(subBlock.description && subBlock.description.trim()) ||
							(subBlock.date && subBlock.date.trim && subBlock.date.trim()) ||
							(subBlock.location && subBlock.location.trim())
						) {
							found = true;
						}
					});
				}
			});
		});
		return found;
	};

	// Helper to get all events as a flat list from all event tables
	const getAllEvents = () => {
		return (workflowInfoDetails?.summary?.tables || [])
			.filter((t) => t.type === 'events')
			.flatMap((t) => t.values || []);
	};

	// Add handleSignClick function
	const handleSignClick = useCallback(
		(idx) => {
			const workflowId = workflowInfoDetails?._id;
			if (workflowId) {
				navigate(`/builder/document/edit/${workflowId}?workflow=true&openSignature=true`);
			}
		},
		[workflowInfoDetails, navigate],
	);

	// Contract Section (Table-based)
	const contractTable = workflowInfoDetails?.summary?.tables?.find(
		(t) => t.type === 'contract-with-signature',
	);
	const contractSigners = localSigners || contractTable?.values || [];

	// Helper to extract number from HTML/markdown string

	return (
		<div className="summary-main-container">
			<div className="summary-container">
				<div className="summary-content">
					{/* Services Section (Table-based, multi-block) */}
					{servicesTables.some(
						(table) =>
							filterServiceTableItems(
								table.values || [],
								table.styles?.services_selection,
							).length > 0,
					) && (
						<div className="section">
							<div className="section-header">
								<h3>Services</h3>
							</div>
							{servicesTables.map((table, idx) => {
								const items = table.values || [];
								const styles = table.styles || {};
								const filteredItems = filterServiceTableItems(
									items,
									styles.services_selection,
								);
								if (filteredItems.length === 0) return null;

								// Subtotal display logic
								let subtotal = calculateFilteredTableTotal(filteredItems);
								let subtotalDisplay = formatCurrency(
									subtotal,
									filteredItems[0]?.currency || 'INR',
								);
								if (styles.services_selection === 2 && filteredItems.length > 0) {
									if (subtotal === 0 && styles.subTotalValue) {
										const extracted = extractNumberFromHTML(
											styles.subTotalValue,
										);
										subtotalDisplay = formatCurrency(
											extracted,
											filteredItems[0]?.currency || 'INR',
										);
									}
								}

								return (
									<div className="service-block" key={table._id || idx}>
										<div className="service-block-header">
											<h4 className="service-block-title">
												{styles?.subTotalTitle?.replace(/<[^>]+>/g, '') ||
													'Services'}
											</h4>
											<div className="subtotal">
												Subtotal: {subtotalDisplay}
											</div>
										</div>
										<div className="items-table">
											<div className="items-header">
												<div className="col description">Title</div>
												<div className="col qty">QTY</div>
												<div className="col unit">UNIT</div>
												<div className="col price">PRICE</div>
												<div className="col total">TOTAL</div>
											</div>
											{filteredItems.map((item) => (
												<div
													key={item.subBlockId || item._id}
													className="item-row"
												>
													<div className="col description">
														{item.title?.replace(/<[^>]+>/g, '')}
													</div>
													<div className="col qty">{item.quantity}</div>
													<div className="col unit">
														{item.unit || '-'}
													</div>
													<div className="col price">
														{formatCurrency(
															Number(item.amount),
															item.currency,
														)}
													</div>
													<div className="col total">
														{formatCurrency(
															Number(item.amount) * item.quantity,
															item.currency,
														)}
													</div>
												</div>
											))}
										</div>
									</div>
								);
							})}
							<div className="total">
								<div className="total-label">Total Cost</div>
								<span className="total-separator">:</span>
								<div className="total-value">
									{formatCurrency(
										overallServicesTotal,
										// Use the first currency found, fallback to INR
										servicesTables.find(
											(table) => (table.values || [])[0]?.currency,
										)?.values?.[0]?.currency || 'INR',
									)}
								</div>
							</div>
						</div>
					)}

					{/* Events Section */}
					{getAllEvents().length > 0 && (
						<div className="section">
							<div className="section-header">
								<h3>Events</h3>
							</div>
							<div className="events-list">
								{getAllEvents().map((subBlock) => {
									// Flatten roles/categories for this event
									const roleLines = [];
									if (subBlock?.roles && subBlock?.roles?.length > 0) {
										subBlock?.roles?.forEach((role) => {
											const roleType = role?.type
												? role?.type?.charAt(0)?.toUpperCase() +
												  role?.type?.slice(1)
												: 'No Crew';
											role.categories.forEach((cat) => {
												const catName = cat.category || 'No category';
												if (cat.quantity > 0) {
													roleLines.push(
														<div
															className="event-role"
															key={role.type + cat.category}
														>
															{cat.quantity} {catName} {roleType}
														</div>,
													);
												}
											});
										});
									}
									const eventName =
										subBlock.name && subBlock.name.trim()
											? subBlock.name
											: 'Not specified';
									const eventLocation =
										subBlock.location && subBlock.location.trim()
											? subBlock.location
											: 'No location';
									let eventDate = 'No date';
									if (subBlock.date) {
										// Try to parse YYYYMMDD or YYYY-MM-DD or ISO
										const m = moment(
											subBlock.date,
											['YYYY-MM-DD', 'YYYYMMDD', moment.ISO_8601],
											true,
										);
										if (m.isValid()) {
											eventDate = m.format('MMM DD, YYYY');
										} else {
											eventDate = subBlock.date;
										}
									}
									return (
										<div key={subBlock._id} className="event-card">
											<div className="event-card-header">
												<span className="event-title">{eventName}</span>
												<span className="event-date-location">
													{eventDate}
													{eventLocation ? `, ${eventLocation}` : ''}
												</span>
											</div>
											<div className="event-roles">
												{roleLines.length > 0 ? (
													roleLines
												) : (
													<div className="event-role">No Crew</div>
												)}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}

					{/* Invoice Section */}
					{/* {sections?.invoice && sections.invoice.length > 0 && (
						<div className="section invoice-section">
							<div className="section-header">
								<h3>Invoice</h3>
							</div>
							<div className="invoice-content">
								<div className="invoice-header">
									<div className="payment-summary">
										<div className="total-paid">
											{formatCurrency(0)} paid of{' '}
											{formatCurrency(
												calculateSectionTotal(sections.invoice),
											)}
										</div>
										<div className="payments-made">
											0 of {sections.invoice[0].blocks.length} payments made
										</div>
									</div>
									<div className="invoice-status not-viewed">
										<span>Not Viewed</span>
									</div>
								</div>

								<div className="payment-schedule">
									{sections.invoice[0].blocks.map((block, index) => (
										<div key={block._id} className="payment-row">
											<div className="payment-number">
												<span className="number">{index + 1}</span>
											</div>
											<div className="payment-details">
												<div className="amount-label">Amount</div>
												<div className="amount-value">
													{formatCurrency(
														block.subBlocks[0]?.amount || 0,
													)}
												</div>
											</div>
											<div className="due-date">
												<div className="due-date-label">Due date</div>
												<div className="due-date-value">Mar 16, 2025</div>
											</div>
											<div className="payment-status overdue">
												<span>Overdue</span>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					)} */}

					{/* Contract Section */}
					{contractTable && contractSigners.length > 0 && (
						<div className="section contract-section">
							<div className="section-header">
								<h3>Contract</h3>
							</div>
							<div className="signature-blocks">
								{sortedSigners(contractSigners)?.map((signer, idx) => {
									const status = getSignatureStatus(signer, contractSigners);
									const initials = signer.userName
										? signer.userName
												.split(' ')
												.map((n) => n[0])
												.join('')
												.toUpperCase()
										: getUserRoleLabel(signer.userType).charAt(0);

									return (
										<div key={signer.userType} className="signature-block">
											<div className="signer-info">
												<div className="avatar">{initials}</div>
												<div className="details">
													<div className="name">
														{signer.userName ||
															(signer.userType === 'tenantUser'
																? 'Company Representative'
																: '')}
													</div>
													<div className="role">
														{getUserRoleLabel(signer.userType)}
													</div>
													<div className={`status ${status.class}`}>
														{status.text}
													</div>
												</div>
											</div>
											<div className="signature-status">
												{status.showNotViewed && (
													<div className="not-viewed-status">
														<EyeIcon />
														<span>Not Viewed</span>
													</div>
												)}
												{status.showSignButton && (
													<button
														className="sign-button"
														onClick={() => handleSignClick(idx)}
													>
														Sign
													</button>
												)}
												{!status.showSignButton &&
													!status.showNotViewed &&
													signer.value && (
														<div className="signature-verified">
															<VerifiedSvg />
															<span>Signed</span>
														</div>
													)}
											</div>
										</div>
									);
								})}
								<UploadSignatureModal
									open={signatureModal}
									closeModal={handleCloseSignatureModal}
									uploadSignatureFunc={handleSignatureSubmit}
									changelocalWorflowStatus={() => {}}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Summary;
