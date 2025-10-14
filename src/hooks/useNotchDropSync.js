import { useEffect, useContext } from 'react';
import Context from '../context/context';

/**
 * Global hook to keep NotchDrop synchronized with activeMeetingDetails
 * This ensures data flows to NotchDrop regardless of which component is active
 */
export const useNotchDropSync = () => {
	const {
		notes: { activeMeetingDetails },
	} = useContext(Context);

	const {
		liveIntelligenceData = {},
		transcriptions = [],
		meetingId,
	} = activeMeetingDetails || {};

	// Sync live intelligence data to NotchDrop
	useEffect(() => {
		const allThreads = liveIntelligenceData?.allThreads || [];

		if (allThreads.length > 0) {
			console.log(
				'🧠 useNotchDropSync: Processing live intelligence data:',
				allThreads.length,
				'threads',
			);

			// Send live intelligence data to notch immediately when it arrives
			try {
				if (window?.electronApi?.overlay?.sendLiveIntelligenceData) {
					console.log(
						'🧠 useNotchDropSync: Sending live intelligence data to NotchDrop:',
						allThreads.length,
						'threads',
					);
					allThreads.forEach((thread) => {
						const message = {
							source: 'ai-agent',
							text: thread.prompt || thread.name || thread.description || '',
							timestamp:
								thread.timestamp || thread.created_at || new Date().toISOString(),
							confidence: thread.confidence,
							metadata: thread,
						};
						window.electronApi.overlay.sendLiveIntelligenceData(message);
					});
					console.log(
						'✅ useNotchDropSync: Live intelligence data sent to NotchDrop successfully',
					);
				} else {
					console.warn(
						'⚠️ useNotchDropSync: sendLiveIntelligenceData method not available',
					);
				}
			} catch (e) {
				console.error(
					'❌ useNotchDropSync: Failed to send live intelligence data to Notch:',
					e,
				);
			}
		}
	}, [liveIntelligenceData?.allThreads]);

	// Sync transcription data to NotchDrop
	useEffect(() => {
		if (transcriptions?.length > 0) {
			console.log(
				'📝 useNotchDropSync: Processing transcriptions:',
				transcriptions.length,
				'transcriptions',
			);

			try {
				if (!window?.electronApi?.notchdrop?.replaceTranscriptions) {
					console.warn('⚠️ useNotchDropSync: replaceTranscriptions method not available');
					return;
				}

				console.log(
					'📝 useNotchDropSync: Sending transcriptions to NotchDrop:',
					transcriptions.length,
					'transcriptions',
				);

				const messages = (transcriptions || []).map((t) => ({
					sender: t.source || 'overlay',
					content: t.text || '',
					isFromAgent: false,
					timestamp: t.timestamp || new Date().toISOString(),
					confidence: t.confidence,
					words: t.words,
					type: 'transcription',
				}));

				window.electronApi.notchdrop.replaceTranscriptions(messages);
				console.log('✅ useNotchDropSync: Transcriptions sent to NotchDrop successfully');
			} catch (e) {
				console.error(
					'❌ useNotchDropSync: Failed to send full transcriptions to NotchDrop:',
					e,
				);
			}
		}
	}, [transcriptions]);

	// Initialize NotchDrop panel mode when meeting is active
	useEffect(() => {
		if (meetingId && window?.electronApi?.overlay?.setPanelMode) {
			// Set initial panel mode - show transcription initially (main app shows live intelligence)
			window.electronApi.overlay.setPanelMode('live-intel');
			console.log(
				'🧭 useNotchDropSync: Initialized NotchDrop to show transcription (main shows live-intel)',
			);
		}
	}, [meetingId]);

	return {
		meetingId,
		hasActiveMeeting: !!meetingId,
		transcriptionsCount: transcriptions?.length || 0,
		liveIntelligenceCount: liveIntelligenceData?.allThreads?.length || 0,
	};
};

export default useNotchDropSync;

