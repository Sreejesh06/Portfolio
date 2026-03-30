from PIL import Image, ImageDraw, ImageFont


def font(path: str, size: int):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()


# Collabia-style logo
img = Image.new("RGB", (512, 512), "#facc15")
d = ImageDraw.Draw(img)
text = "Collabia"
f = font("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 92)
b = d.textbbox((0, 0), text, font=f)
d.text(((512 - (b[2] - b[0])) // 2, (512 - (b[3] - b[1])) // 2), text, fill="#111827", font=f)
img.save("public/Experience-image/collabia.png")

# Social-style logo
img2 = Image.new("RGB", (512, 512), "#f3f4f6")
d2 = ImageDraw.Draw(img2)
line1 = "SOCIAL"
line2 = "(Formerly Script Foundation)"
f1 = font("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 72)
f2 = font("/System/Library/Fonts/Supplemental/Arial.ttf", 30)
b1 = d2.textbbox((0, 0), line1, font=f1)
b2 = d2.textbbox((0, 0), line2, font=f2)
d2.text(((512 - (b1[2] - b1[0])) // 2, 180), line1, fill="#111827", font=f1)
d2.text(((512 - (b2[2] - b2[0])) // 2, 280), line2, fill="#374151", font=f2)
img2.save("public/Experience-image/social-formerly-script-foundation.png")
