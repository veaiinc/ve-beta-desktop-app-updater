import React, { memo, useState } from 'react';
import '../../../assets/scss/notes/index.scss';
import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';

const extensions = [
	StarterKit,
	Underline,
	TextStyle,
	Color,
	Highlight.configure({ multicolor: true }),
	Placeholder.configure({
		placeholder: ({ node }) => {
			if (node.type.name === 'heading') {
				return 'Heading';
			}
			return 'Write something';
		},
	}),
];

// Color options
const textColors = [
	{ color: '#000000', label: 'Black' },
	{ color: '#666666', label: 'Gray' },
	{ color: '#FF0000', label: 'Red' },
	{ color: '#FFA500', label: 'Orange' },
	{ color: '#FFFF00', label: 'Yellow' },
	{ color: '#008000', label: 'Green' },
	{ color: '#0000FF', label: 'Blue' },
	{ color: '#800080', label: 'Purple' },
	{ color: '#FFC0CB', label: 'Pink' },
];

const bgColors = [
	{ color: 'transparent', label: 'None' },
	{ color: '#F8F9FA', label: 'Light Gray' },
	{ color: '#FFE5E5', label: 'Light Red' },
	{ color: '#FFF3E0', label: 'Light Orange' },
	{ color: '#FFFFF0', label: 'Light Yellow' },
	{ color: '#E8F5E9', label: 'Light Green' },
	{ color: '#E3F2FD', label: 'Light Blue' },
	{ color: '#F3E5F5', label: 'Light Purple' },
	{ color: '#FCE4EC', label: 'Light Pink' },
];

const ColorPicker = ({ type, colors, onSelect, show, setShow }) => {
	if (!show) return null;

	return (
		<div className="color-picker-dropdown">
			<div className="color-picker-section">
				<span className="color-picker-label">{type}</span>
				<div className="color-grid">
					{colors.map((item, index) => (
						<button
							key={index}
							className="color-option"
							style={{
								backgroundColor: item.color,
								border: item.color === 'transparent' ? '1px solid #ddd' : 'none',
							}}
							onClick={() => {
								onSelect(item.color);
								setShow(false);
							}}
							title={item.label}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

const Notes = () => {
	const [showTextColors, setShowTextColors] = useState(false);
	const [showBgColors, setShowBgColors] = useState(false);

	const editor = useEditor({
		extensions,
		content: '',
	});

	if (!editor) {
		return null;
	}

	return (
		<div className="notesParentContainer">
			<FloatingMenu editor={editor} className="floating-menu">
				{/* Text Blocks */}
				<div className="menu-group">
					<button
						onClick={() => editor.chain().focus().setParagraph().run()}
						className={editor.isActive('paragraph') ? 'is-active' : ''}
					>
						Text
					</button>
					<button
						onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
						className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
					>
						H1
					</button>
					<button
						onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
						className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
					>
						H2
					</button>
					<button
						onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
						className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
					>
						H3
					</button>
				</div>

				<div className="divider" />

				{/* Lists and Quotes */}
				<div className="menu-group">
					<button
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						className={editor.isActive('bulletList') ? 'is-active' : ''}
					>
						Bullet List
					</button>
					<button
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						className={editor.isActive('orderedList') ? 'is-active' : ''}
					>
						Numbered List
					</button>
					<button
						onClick={() => editor.chain().focus().toggleBlockquote().run()}
						className={editor.isActive('blockquote') ? 'is-active' : ''}
					>
						Quote
					</button>
				</div>

				<div className="divider" />

				{/* Code Block */}
				<div className="menu-group">
					<button
						onClick={() => editor.chain().focus().toggleCodeBlock().run()}
						className={editor.isActive('codeBlock') ? 'is-active' : ''}
					>
						Code Block
					</button>
				</div>
			</FloatingMenu>

			<BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bubble-menu">
				<button
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={editor.isActive('bold') ? 'is-active' : ''}
				>
					<strong>B</strong>
				</button>
				<button
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={editor.isActive('italic') ? 'is-active' : ''}
				>
					<em>I</em>
				</button>
				<button
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					className={editor.isActive('underline') ? 'is-active' : ''}
				>
					<u>U</u>
				</button>

				<div className="divider" />

				<div className="color-picker-container">
					<button
						onClick={() => {
							setShowTextColors(!showTextColors);
							setShowBgColors(false);
						}}
						className="color-button"
					>
						A
					</button>
					{showTextColors && (
						<ColorPicker
							type="Text color"
							colors={textColors}
							onSelect={(color) => {
								editor.chain().focus().setColor(color).run();
							}}
							show={showTextColors}
							setShow={setShowTextColors}
						/>
					)}
				</div>

				<div className="color-picker-container">
					<button
						onClick={() => {
							setShowBgColors(!showBgColors);
							setShowTextColors(false);
						}}
						className="color-button bg-button"
					>
						<span className="bg-icon">▣</span>
					</button>
					{showBgColors && (
						<ColorPicker
							type="Background color"
							colors={bgColors}
							onSelect={(color) => {
								editor.chain().focus().toggleHighlight({ color }).run();
							}}
							show={showBgColors}
							setShow={setShowBgColors}
						/>
					)}
				</div>
			</BubbleMenu>

			<div className="editor-content">
				<EditorContent editor={editor} />
			</div>
		</div>
	);
};

export default memo(Notes);
