"""Recorta a pessoa do fundo (rembg) só nos frames usados por efeitos ✂.
Uso: python cutout.py public clip:from:to [clip:from:to ...]   (frames a 30 fps)"""
import io, os, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove

pub = sys.argv[1]
sess = new_session("u2net_human_seg")
for spec in sys.argv[2:]:
    clip, fa, fb = spec.split(":"); fa, fb = int(fa), int(fb)
    os.makedirs(f"{pub}/cutout/{clip}", exist_ok=True)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f"{pub}/{clip}.mp4", "-vf",
                          f"select='between(n\\,{fa}\\,{fb - 1})'", "-vsync", "0", "-f", "rawvideo",
                          "-pix_fmt", "rgb24", "-"], capture_output=True, check=True).stdout
    W, H = 1080, 1920; n = len(raw) // (W * H * 3)
    frames = np.frombuffer(raw, np.uint8).reshape(n, H, W, 3)
    for k in range(n):
        f = fa + k; dst = f"{pub}/cutout/{clip}/{f:05d}.webp"
        if os.path.exists(dst): continue
        img = Image.fromarray(frames[k])
        small = img.resize((540, 960), Image.BILINEAR)
        m = remove(small, session=sess, only_mask=True, post_process_mask=True)
        m = m.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(1.2))
        a = np.asarray(m, np.float32) / 255
        a = np.clip((a - 0.08) / 0.84, 0, 1)  # contrai o halo
        rgba = np.dstack([frames[k], (a * 255).astype(np.uint8)])
        Image.fromarray(rgba, "RGBA").save(dst, "WEBP", quality=88, method=4)
        if k % 25 == 0: print(clip, f, flush=True)
print("ok")
