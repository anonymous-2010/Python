import re


def deep_get(obj, *keys, default=None):
    if not obj or not isinstance(obj, dict):
        return default
    for k in keys:
        if k in obj and obj[k] is not None and obj[k] != "":
            return obj[k]
    for v in obj.values():
        if isinstance(v, dict) and v:
            for k in keys:
                if k in v and v[k] is not None and v[k] != "":
                    return v[k]
    return default


def build_image(img):
    if not isinstance(img, dict):
        return None
    if img.get("url"):
        return img["url"]
    if img.get("key"):
        return (img.get("baseUrl") or "https://static.pw.live/") + img["key"]
    return None


def strip_html(html):
    if not html:
        return None
    text = str(html)
    text = re.sub(r"<style[^>]*>.*?</style>", " ", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<script[^>]*>.*?</script>", " ", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"&[a-zA-Z#0-9]+;", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text or None
