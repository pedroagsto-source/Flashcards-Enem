"""Transcreve um vídeo com Whisper Turbo (sherpa-onnx) + Silero VAD.
Saída JSON: segmentos de fala com texto e palavras com tempo estimado.
Uso: python transcribe.py video.mp4 modelos_dir saida.json
"""
import json, re, subprocess, sys
import numpy as np
import sherpa_onnx

video, mdir, out = sys.argv[1:4]
SR = 16000
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", video, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
                     capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768

w = f"{mdir}/sherpa-onnx-whisper-turbo/turbo"
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=w + "-encoder.int8.onnx", decoder=w + "-decoder.int8.onnx",
                                                 tokens=w + "-tokens.txt", language="pt", task="transcribe", num_threads=4)
cfg = sherpa_onnx.VadModelConfig()
cfg.silero_vad.model = f"{mdir}/silero_vad.onnx"
cfg.silero_vad.min_silence_duration = 0.18
cfg.silero_vad.min_speech_duration = 0.12
cfg.silero_vad.threshold = 0.45
cfg.silero_vad.max_speech_duration = 12
cfg.sample_rate = SR
vad = sherpa_onnx.VoiceActivityDetector(cfg, buffer_size_in_seconds=120)
win = cfg.silero_vad.window_size
segs = []
for i in range(0, len(audio), win):
    vad.accept_waveform(audio[i:i + win])
    while not vad.empty():
        segs.append((vad.front.start, len(vad.front.samples))); vad.pop()
vad.flush()
while not vad.empty():
    segs.append((vad.front.start, len(vad.front.samples))); vad.pop()

def weight(word):  # aproxima duração falada pelo nº de vogais/letras
    return max(1.0, len(re.findall(r"[aeiouáéíóúâêôãõà]", word.lower())) + 0.25 * len(word))

result = []
for start, n in segs:
    s = rec.create_stream(); s.accept_waveform(SR, audio[start:start + n]); rec.decode_stream(s)
    text = s.result.text.strip()
    t0, t1 = start / SR, (start + n) / SR
    words = text.split()
    tot = sum(weight(x) for x in words) or 1
    cur, ws = t0, []
    for x in words:
        d = (t1 - t0) * weight(x) / tot
        ws.append({"word": x, "start": round(cur, 3), "end": round(cur + d, 3)}); cur += d
    result.append({"start": round(t0, 3), "end": round(t1, 3), "text": text, "words": ws})
    print(f"[{t0:6.2f}-{t1:6.2f}] {text}", flush=True)
json.dump(result, open(out, "w"), ensure_ascii=False, indent=1)
