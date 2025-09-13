import React, { useState, useContext, useEffect, memo } from 'react';
import { ReactComponent as CancelTag } from '../../../../assets/svg/gallery/cancel_tag.svg';
import Context from '../../../../context/context';
import { useParams, useNavigate } from 'react-router-dom';
import { Select } from 'antd';
import slugify from 'slugify';
import { message } from '../../globalComponents/CustomToast';
const AddLables = ({ info, setinfo, albumId, galleryId, tagId }) => {
	// const { galleryId, albumId } = useParams();
	const {
		galleryInfo: { tagsList, getGalleryTagsList, addGalleryTag, getImageDuplicatesList },
	} = useContext(Context);
	const navigate = useNavigate();
	const [inputTag, setinputTag] = useState('');
	const [searchValue, setSearchValue] = useState('');

	useEffect(() => {
		if (tagsList?.galleryId !== galleryId) {
			getGalleryTagsList(galleryId);
			getImageDuplicatesList(galleryId, albumId).then((response) => {
				if (response?.[0] === 404 && response?.[1]?.message === 'album not found') {
					navigate(`/galleries/${galleryId}`);
				}
			});
		} else if (info?.selectedGalleryTags?.length === 0) {
			// setinfo((prev) => ({ ...prev, selectedGalleryTags: tagsList?.list || [] }));
			let selectedGalleryTags =
				tagsList?.list?.filter((tag) => tag.displayName === 'All') || [];
			const rawSearchTag = tagId;
			const searchTag = rawSearchTag?.split('?')[0];
			if (searchTag) {
				// First try to find by _id (which is what tagId usually contains)
				let foundTag = tagsList?.list?.find((tag) => tag?._id === searchTag);

				// If not found by _id, try by displayName (fallback for legacy support)
				if (!foundTag) {
					foundTag = tagsList?.list?.find((tag) => tag?.displayName === searchTag);
				}

				if (foundTag) {
					selectedGalleryTags.push(foundTag);
				} else {
					// Only show warning if searchTag is not empty and tagsList is loaded
					if (searchTag.trim() && tagsList?.list?.length > 0) {
						console.warn(`Tag not found: ${searchTag}`);
						// Don't show user-facing warning for missing tag IDs as this is common during navigation
					}
				}
			}
			setinfo((prev) => ({
				...prev,
				selectedGalleryTags,
			}));
		}
	}, [tagsList, galleryId, albumId]);

	const handleAdd = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setSearchValue('');
		addNewTagHandler();
	};
	const addNewTagHandler = async () => {
		if (!inputTag.trim().length) {
			message.error('Tag cannot be empty');
			setinputTag('');
			return;
		}

		const slug = slugify(inputTag, { lower: true, strict: true });

		if (tagsList?.list.find((tag) => tag.displayName === inputTag || tag.slug === slug)) {
			if (info?.selectedGalleryTags?.find((tag) => tag.displayName === inputTag)) {
				message.warning('Tag already exists');
				return;
			} else {
				return;
			}
		}

		const json = {
			displayName: inputTag,
			slug,
		};

		const response = await addGalleryTag(json, galleryId);
		if (response?.[0] === true) {
			setinfo((prev) => ({
				...prev,
				selectedGalleryTags: [
					...prev.selectedGalleryTags,
					{ _id: response?.[1]?._id, displayName: response?.[1]?.displayName },
				],
			}));
			setinputTag('');
		}
	};

	const onSelectTagFunc = (value, moreOptions) => {
		setinfo((prev) => ({
			...prev,
			selectedGalleryTags: [
				...prev.selectedGalleryTags,
				{ _id: value, displayName: moreOptions?.label },
			],
		}));
		setinputTag('');
	};

	const removeTagsFromSelectionList = (id) => {
		setinfo((prev) => ({
			...prev,
			selectedGalleryTags: prev?.selectedGalleryTags?.filter((tag) => tag?._id !== id),
		}));
	};

	return (
		<div className="add-labels-container">
			<div className="headerLabels">
				<h1>Add Labels</h1>
				<p>Categories your photos under different labels</p>
			</div>

			<div className="labels_tags_div">
				{info?.selectedGalleryTags.map((singleTag) => (
					<div className="label_tag" key={singleTag?._id}>
						<p>{singleTag?.displayName}</p>
						{singleTag?.displayName !== 'All' && (
							<CancelTag
								onClick={() => removeTagsFromSelectionList(singleTag?._id)}
							/>
						)}
					</div>
				))}
			</div>

			<div className="add_label_div">
				<div className="add_label_input">Label </div>
				<div> :</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '10px',
						width: '100%',
						position: 'relative',
					}}
					className="headerLabels"
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							width: '100%',
							gap: '10px',
						}}
					>
						<Select
							showSearch
							value={inputTag}
							searchValue={searchValue}
							placeholder="Add Label"
							style={{ width: '100%', color: '#fff' }}
							suffixIcon={null}
							notFoundContent={null}
							onSelect={onSelectTagFunc}
							autoFocus
							onBlur={() => {
								setinputTag(searchValue);
							}}
							onSearch={(value) => {
								if (value === 'all') {
									setinputTag('All');
									setSearchValue('All');
								} else {
									setSearchValue(value);
									setinputTag(value);
								}
							}}
							optionFilterProp="label"
							onKeyDown={(e) => e.key === 'Enter' && addNewTagHandler()}
							options={(tagsList?.list || [])
								?.filter(
									(tag) =>
										!info.selectedGalleryTags.some(
											(selectedTag) => selectedTag._id === tag._id,
										),
								)
								.map((d) => ({ value: d._id, label: d.displayName }))}
						/>
						{searchValue && (
							<button
								onMouseDown={(e) => {
									e.preventDefault();
								}}
								onClick={handleAdd}
								className="addLabelButton"
							>
								{' '}
								Add
							</button>
						)}
					</div>
					<p
						style={{
							fontSize: '10px',
							color: '#ccc',
							position: 'absolute',
							bottom: '-20px',
						}}
					>
						Press Enter to Add Tag
					</p>
				</div>
			</div>
		</div>
	);
};

export default memo(AddLables);
