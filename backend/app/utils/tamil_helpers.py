import re
import unicodedata
from typing import List, Set, Tuple

# Common Tamil stop words that do not carry discriminative sense meaning
TAMIL_STOPWORDS: Set[str] = {
    "மற்றும்", "ஆனால்", "எனவே", "என்று", "என்ற", "உடன்", "கொண்டு",
    "ஆகிய", "போன்ற", "இருந்து", "ஒரு", "ஓர்", "அந்த", "இந்த",
    "அவர்", "அவள்", "அவன்", "அவர்கள்", "நான்", "நாம்", "நீ",
    "தான்", "கூட", "மட்டுமே", "உள்ள", "உள்ளன", "இருந்தது"
}

# Common Tamil case markers and inflectional suffixes
TAMIL_SUFFIXES = [
    "இடமிருந்து", "இலிருந்து", "இடத்தில்", "உடைய",
    "ஆல்", "இல்", "கு", "க்கு", "உக்கு", "ஐ",
    "இன்", "அது", "கண்", "கள்", "களை", "களில்",
    "ஆன", "ஆக", "உம்", "ஏ", "ஓ", "தான்", "படி"
]

# Oblique / Sandhi transformations (e.g., ஆறு -> ஆற்று)
TAMIL_STEM_EQUIVALENTS = {
    "ஆற்று": "ஆறு",
    "ஆற்றில்": "ஆறு",
    "ஆற்றின்": "ஆறு",
    "படியில்": "படி",
    "படியை": "படி",
    "படிக்கட்டு": "படி",
    "சொன்னபடி": "படி",
    "கூறியபடி": "படி",
    "திட்டமிட்டபடி": "படி",
    "அடியில்": "அடி",
    "அடித்தான்": "அடி",
    "அடித்தாள்": "அடி",
    "அடித்தது": "அடி",
    "அடிப்பகுதி": "அடி",
    "பாலும்": "பால்",
    "பாலில்": "பால்",
    "பாலிலும்": "பால்",
    "திங்கள்": "திங்கள்",
    "திங்களன்று": "திங்கள்",
    "கலைக்க": "கலை",
    "கலைத்து": "கலை",
    "கலைகள்": "கலை",
    "நாட்டை": "நாடு",
    "நாட்டில்": "நாடு",
    "நாட்டின்": "நாடு"
}


def normalize_tamil(text: str) -> str:
    """
    Standardize Tamil text using NFC Unicode normalization
    and strip unwanted zero-width spaces.
    """
    if not text:
        return ""
    text = unicodedata.normalize("NFC", text.strip())
    # Remove zero-width spaces and non-breaking spaces
    text = text.replace("\u200b", "").replace("\u200c", "").replace("\u200d", "").replace("\xa0", " ")
    return text


def clean_text_for_tokens(text: str) -> str:
    """
    Remove punctuation while retaining Tamil alphabets, pulli, kombu, and digits.
    """
    normalized = normalize_tamil(text)
    # Replace punctuation with spaces
    cleaned = re.sub(r"[^\w\s\u0B80-\u0BFF]", " ", normalized)
    return cleaned


def tokenize_tamil(text: str) -> List[str]:
    """
    Tokenize sentence into clean individual Tamil words.
    """
    cleaned = clean_text_for_tokens(text)
    tokens = [t.strip() for t in cleaned.split() if t.strip()]
    return tokens


def get_tamil_stem(word: str) -> str:
    """
    Extract approximate base stem from inflected Tamil word.
    """
    normalized = normalize_tamil(word)
    if normalized in TAMIL_STEM_EQUIVALENTS:
        return TAMIL_STEM_EQUIVALENTS[normalized]

    # Check known sandhi doubled prefixes like 'ப்', 'க்', 'ச்', 'த்'
    # e.g., 'நன்றாகப் படி' -> token might be attached if user typed without space, or stand alone
    stem = normalized
    for suffix in sorted(TAMIL_SUFFIXES, key=len, reverse=True):
        if stem.endswith(suffix) and len(stem) > len(suffix) + 1:
            potential_stem = stem[:-len(suffix)]
            if len(potential_stem) >= 2:
                stem = potential_stem
                break
    return stem


def target_word_matches_token(target_word: str, token: str) -> bool:
    """
    Determine whether a token in the sentence corresponds to the target word,
    accounting for case endings (வேற்றுமை உருபுகள்), sandhi, and oblique forms.
    """
    t_norm = normalize_tamil(target_word)
    tok_norm = normalize_tamil(token)

    if t_norm == tok_norm:
        return True

    # Check stem dictionary mapping
    if tok_norm in TAMIL_STEM_EQUIVALENTS and TAMIL_STEM_EQUIVALENTS[tok_norm] == t_norm:
        return True

    # Check if token starts with target word (e.g., படியில் starts with படி)
    if tok_norm.startswith(t_norm) and len(tok_norm) - len(t_norm) <= 7:
        return True

    # Check if token ends with target word (e.g., சொன்னபடி ends with படி)
    if tok_norm.endswith(t_norm):
        return True

    # Check stem
    token_stem = get_tamil_stem(tok_norm)
    if token_stem == t_norm:
        return True

    return False


def find_target_word_in_sentence(target_word: str, sentence: str) -> Tuple[bool, str]:
    """
    Verify if target word is present in sentence, returning (found, matched_token).
    """
    tokens = tokenize_tamil(sentence)
    t_norm = normalize_tamil(target_word)

    for tok in tokens:
        if target_word_matches_token(t_norm, tok):
            return True, tok

    # Also check substring match in whole sentence if punctuation glued words
    cleaned_sentence = clean_text_for_tokens(sentence)
    if t_norm in cleaned_sentence:
        return True, t_norm

    return False, ""
