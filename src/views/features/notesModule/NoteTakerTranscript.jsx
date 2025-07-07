import React, { useState, useCallback, useRef } from 'react';
import NoteTranscription from '../note-transcription/NoteTranscription';
import { useParams } from 'react-router-dom';

const NoteTakerTranscript = () => {
	const { noteId } = useParams();
	const [transcriptions, setTranscriptions] = useState([]);
	const scrollRef = useRef(null);

	const handleUpdateTranscription = useCallback(
		(transcription = null, prevTranscriptionId = null) => {
			if (!transcription) return;

			const formatted = {
				type: 'text',
				text: transcription.displayedText || '',
				styles: transcription.isFinal
					? { italic: false, textColor: 'var(--primary-font)' }
					: { italic: true, textColor: 'var(--secondary-font)' },
			};

			setTranscriptions((prev) => {
				// Replace or add the transcription by id
				const filtered = prev.filter((t) => t.id !== transcription.id);
				return [...filtered, { ...formatted, id: transcription.id }];
			});

			try {
				if (scrollRef.current) {
					scrollRef.current.scrollIntoView({ behavior: 'smooth' });
				}
			} catch (error) {
				console.error('Error updating transcription blocks:', error);
			}
		},
		[],
	);

	return (
		<div>
			<NoteTranscription pageId={noteId} updateTranscription={handleUpdateTranscription} />
			<div style={{ marginTop: 24 }}>
				{transcriptions.map((t) => (
					<div
						key={t.id}
						style={{
							color: t.styles.textColor,
							fontStyle: t.styles.italic ? 'italic' : 'normal',
							marginBottom: 8,
						}}
					>
						{t.text}
					</div>
				))}
				<div ref={scrollRef} />
			</div>
		</div>
	);
};

export default NoteTakerTranscript;
