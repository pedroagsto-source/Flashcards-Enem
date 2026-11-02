"""Gera SFX sintéticos e uma trilha instrumental simples (sem direitos autorais)."""
import sys, numpy as np, soundfile as sf
SR = 48000; rng = np.random.default_rng(7); pub = sys.argv[1]
def t(d): return np.arange(int(SR * d)) / SR
def env(x, a, r):  # ataque/decay exponencial
    n = len(x); e = np.minimum(1, np.arange(n) / max(1, a * SR)) * np.exp(-np.arange(n) / (r * SR)); return x * e
def lp(x, fc):  # passa-baixa de 1 polo variável
    fc = np.broadcast_to(fc, x.shape); y = np.zeros_like(x); s = 0.0
    k = 1 - np.exp(-2 * np.pi * fc / SR)
    for i in range(len(x)): s += k[i] * (x[i] - s); y[i] = s
    return y
def norm(x, db=-3): return x / (np.abs(x).max() + 1e-9) * 10 ** (db / 20)
def save(n, x): sf.write(f"{pub}/sfx/{n}.wav", np.stack([x, x], 1).astype(np.float32), SR)

d = t(0.7); n = rng.standard_normal(len(d)); sweep = 300 + 5000 * np.sin(np.pi * d / 0.7) ** 2
save("whoosh", norm(env(lp(n, sweep), 0.25, 0.25)))
d = t(0.18); save("pop", norm(env(np.sin(2 * np.pi * (900 - 2500 * d) * d), 0.002, 0.04)))
d = t(1.2); imp = np.sin(2 * np.pi * (60 - 20 * d) * d) * np.exp(-d * 4) + 0.4 * lp(rng.standard_normal(len(d)), 900) * np.exp(-d * 18)
save("impact", norm(imp, -1))
d = t(0.06); save("click", norm(env(lp(rng.standard_normal(len(d)), 4000), 0.0005, 0.01), -6))
d = t(1.0); ris = lp(rng.standard_normal(len(d)), 200 + 6000 * d ** 2) * d ** 2 + 0.3 * np.sin(2 * np.pi * (200 + 600 * d ** 2) * d) * d
save("riser", norm(ris))
d = t(1.4); sh = sum(np.sin(2 * np.pi * f * d) / (i + 1) for i, f in enumerate([1318.5, 1975.5, 2637, 3951])) * np.exp(-d * 3)
save("shimmer", norm(sh, -6))
d = t(0.5); save("type", norm(env(lp(rng.standard_normal(len(d)), 2500), 0.001, 0.008)[: int(0.05 * SR)], -8))
d = t(0.9); flash = lp(rng.standard_normal(len(d)), 8000 * np.exp(-d * 4)) * np.exp(-d * 5)
save("flash", norm(flash, -4))

# --- trilha: 104 BPM, Am – F – C – G, kick + hat + sub + pad ---
bpm = 104; beat = 60 / bpm; dur = 44.0; N = int(SR * dur); mix = np.zeros(N)
chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
bar = 4 * beat
for b in range(int(dur / bar) + 1):
    t0 = b * bar; ch = chords[b % 4]; i0 = int(t0 * SR); L = min(int(bar * SR), N - i0)
    if L <= 0: break
    tt = np.arange(L) / SR
    pad = sum(np.sin(2 * np.pi * hz(m) * tt + 0.3 * np.sin(2 * np.pi * 0.3 * tt)) + 0.5 * np.sin(2 * np.pi * hz(m) * 1.003 * tt) for m in ch)
    pad *= np.minimum(1, tt / 0.4) * np.minimum(1, (bar - tt) / 0.3) * 0.12
    sub = np.sin(2 * np.pi * hz(ch[0] - 24) * tt) * 0.35 * (0.6 + 0.4 * np.cos(2 * np.pi * tt / beat) ** 2)
    mix[i0:i0 + L] += pad + sub
for k in range(int(dur / beat)):
    ts = k * beat; i0 = int(ts * SR)
    if i0 >= N: break
    kd = np.arange(min(int(0.35 * SR), N - i0)) / SR
    if k >= 4: mix[i0:i0 + len(kd)] += 0.9 * np.sin(2 * np.pi * (50 + 90 * np.exp(-kd * 30)) * kd) * np.exp(-kd * 9)
    for off in (0.5,):
        j = int((ts + off * beat) * SR); hd = min(int(0.06 * SR), N - j)
        if hd > 0 and k >= 2: mix[j:j + hd] += 0.12 * np.diff(rng.standard_normal(hd + 1)) * np.exp(-np.arange(hd) / (0.012 * SR))
fade = np.ones(N); fade[-int(1.5 * SR):] = np.linspace(1, 0, int(1.5 * SR)); fade[:int(0.3 * SR)] = np.linspace(0, 1, int(0.3 * SR))
mix = np.tanh(mix * 1.2) * fade
sf.write(f"{pub}/music/bed.wav", np.stack([mix, np.roll(mix, 240)], 1).astype(np.float32) * 0.7, SR)
print("ok")
