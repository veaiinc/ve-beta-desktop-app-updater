import pyaudio
import numpy as np
import onnxruntime as ort
from collections import defaultdict, deque
from functools import partial

FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
CHUNK = 1280

audio = pyaudio.PyAudio()
mic_stream = audio.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)

wake_word_model = ort.InferenceSession("hey_ve_ee.onnx")
wake_input_name = wake_word_model.get_inputs()[0].name
wake_output_name = wake_word_model.get_outputs()[0].name

melspectrogram_model = ort.InferenceSession("melspectrogram.onnx")
embedding_model = ort.InferenceSession("embedding_model.onnx")

class AudioFeatures:
    def __init__(self):
        self.raw_data_buffer = deque(maxlen=RATE*10)
        self.melspectrogram_buffer = np.ones((76, 32))
        self.accumulated_samples = 0
        self.raw_data_remainder = np.empty(0)
        self.feature_buffer = np.random.random((120, 96))
        
    def _get_melspectrogram(self, x):
        x = np.array(x).astype(np.int16) if isinstance(x, list) else x
        x = x[None, ] if len(x.shape) < 2 else x
        x = x.astype(np.float32)
        
        outputs = melspectrogram_model.run(None, {'input': x})
        spec = np.squeeze(outputs[0])
        return spec/10 + 2
        
    def _get_embeddings_from_melspec(self, melspec):
        if melspec.shape[0] != 1:
            melspec = melspec[None, ]
        embedding = embedding_model.run(None, {'input_1': melspec})[0].squeeze()
        return embedding
        
    def _streaming_melspectrogram(self, n_samples):
        if len(self.raw_data_buffer) < 400:
            return
        
        self.melspectrogram_buffer = np.vstack((
            self.melspectrogram_buffer, 
            self._get_melspectrogram(list(self.raw_data_buffer)[-n_samples-160*3:])
        ))
        
        if self.melspectrogram_buffer.shape[0] > 97:
            self.melspectrogram_buffer = self.melspectrogram_buffer[-97:, :]
            
    def _buffer_raw_data(self, x):
        self.raw_data_buffer.extend(x.tolist() if isinstance(x, np.ndarray) else x)
        
    def _streaming_features(self, x):
        if self.raw_data_remainder.shape[0] != 0:
            x = np.concatenate((self.raw_data_remainder, x))
            self.raw_data_remainder = np.empty(0)
        
        if self.accumulated_samples + x.shape[0] >= 1280:
            remainder = (self.accumulated_samples + x.shape[0]) % 1280
            if remainder != 0:
                x_even_chunks = x[0:-remainder]
                self._buffer_raw_data(x_even_chunks)
                self.accumulated_samples += len(x_even_chunks)
                self.raw_data_remainder = x[-remainder:]
            else:
                self._buffer_raw_data(x)
                self.accumulated_samples += x.shape[0]
        else:
            self.accumulated_samples += x.shape[0]
            self._buffer_raw_data(x)
        
        processed_samples = 0
        if self.accumulated_samples >= 1280 and self.accumulated_samples % 1280 == 0:
            self._streaming_melspectrogram(self.accumulated_samples)
            
            for i in np.arange(self.accumulated_samples//1280-1, -1, -1):
                ndx = -8*i
                ndx = ndx if ndx != 0 else len(self.melspectrogram_buffer)
                x_feat = self.melspectrogram_buffer[-76 + ndx:ndx].astype(np.float32)[None, :, :, None]
                if x_feat.shape[1] == 76:
                    self.feature_buffer = np.vstack((self.feature_buffer, self._get_embeddings_from_melspec(x_feat)))
            
            processed_samples = self.accumulated_samples
            self.accumulated_samples = 0
        
        if self.feature_buffer.shape[0] > 120:
            self.feature_buffer = self.feature_buffer[-120:, :]
        
        return processed_samples
        
    def get_features(self, n_feature_frames=16):
        return self.feature_buffer[int(-1*n_feature_frames):, :][None, ].astype(np.float32)
            
    def __call__(self, x):
        return self._streaming_features(x)

class Model:
    def __init__(self):
        self.models = {"hey_ve_ee": wake_word_model}
        self.model_inputs = {"hey_ve_ee": 16}
        self.model_outputs = {"hey_ve_ee": 1}
        self.prediction_buffer = defaultdict(partial(deque, maxlen=30))
        self.preprocessor = AudioFeatures()
        
    def predict(self, x):
        n_prepared_samples = self.preprocessor(x)
        
        predictions = {}
        for mdl in self.models.keys():
            if n_prepared_samples >= 1280:
                prediction = wake_word_model.run([wake_output_name], {wake_input_name: self.preprocessor.get_features(16)})
                predictions[mdl] = prediction[0][0][0]
            else:
                if len(self.prediction_buffer[mdl]) > 0:
                    predictions[mdl] = self.prediction_buffer[mdl][-1]
                else:
                    predictions[mdl] = 0.0
            
            if len(self.prediction_buffer[mdl]) < 5:
                predictions[mdl] = 0.0
        
        for mdl in predictions.keys():
            self.prediction_buffer[mdl].append(predictions[mdl])
        
        return predictions

model = Model()

print("🎯 Hey Ve Wake Word Detector")
print("=" * 50)
print("Listening for 'Hey Ve'...")
print("=" * 50)

try:
    while True:
        audio_data = np.frombuffer(mic_stream.read(CHUNK, exception_on_overflow=False), dtype=np.int16)
        prediction = model.predict(audio_data)
        
        for mdl, score in prediction.items():
            status = "true" if score > 0.45 else "false"
            print(f"Score: {score:.3f} | Status: {status}", end='\r')

except KeyboardInterrupt:
    print("\nStopping detection...")
finally:
    mic_stream.stop_stream()
    mic_stream.close()
    audio.terminate()
