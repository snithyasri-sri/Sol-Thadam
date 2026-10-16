import os
import pytest
from app.services.dataset_loader import DatasetLoader
from app.services.sense_engine import SenseEngine
from app.utils.tamil_helpers import normalize_tamil, tokenize_tamil, find_target_word_in_sentence


@pytest.fixture(scope="module")
def engine():
    # Load test dataset
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_path = os.path.join(base_dir, "data", "tamil_wsd_dataset.csv")
    loader = DatasetLoader(csv_path=csv_path)
    loaded = loader.load()
    assert loaded is True, "Dataset should load successfully"
    return SenseEngine(loader)


def test_unicode_normalization():
    # Combining characters and NFC normalization
    raw = "படி\u200b"
    norm = normalize_tamil(raw)
    assert norm == "படி"
    assert len(tokenize_tamil("நன்றாகப் படி!")) >= 2


def test_word_in_sentence_detection():
    # Match in inflected form
    found, tok = find_target_word_in_sentence("படி", "அவன் படியில் ஏறினான்.")
    assert found is True
    assert tok == "படியில்"

    # Match in sandhi / root
    found, tok = find_target_word_in_sentence("படி", "நன்றாகப் படி.")
    assert found is True

    # Word not present
    found, tok = find_target_word_in_sentence("கண்", "நன்றாகப் படி.")
    assert found is False


def test_missing_target_word_in_sentence(engine):
    resp = engine.analyze(
        sentence="வானத்தில் பறவைகள் பறக்கின்றன.",
        target_word="படி"
    )
    assert resp.success is False
    assert "கண்டறியப்படவில்லை" in resp.explanation_tamil or resp.warning is not None


def test_unknown_target_word(engine):
    resp = engine.analyze(
        sentence="அவன் கணினியில் நிரல் எழுதினான்.",
        target_word="கணினி"
    )
    assert resp.success is False
    assert "சேர்க்கப்படவில்லை" in resp.explanation_tamil or resp.warning is not None


def test_insufficient_evidence(engine):
    # An ambiguous word without enough context clues
    resp = engine.analyze(
        sentence="படி.",
        target_word="படி"
    )
    assert resp.success is True
    # Should have a warning or lower score indicating ambiguous context
    assert len(resp.alternatives) > 0


# ==========================================================
# SPECIFIC TESTS A through F FROM USER SPECIFICATION
# ==========================================================

def test_case_a_padi_study(engine):
    """
    Test A:
    Sentence: நன்றாகப் படி.
    Target word: படி
    Expected meaning: படித்தல்.
    """
    resp = engine.analyze(
        sentence="நன்றாகப் படி.",
        target_word="படி"
    )
    assert resp.success is True
    assert "படித்தல்" in resp.selected_meaning_tamil
    assert len(resp.alternatives) >= 1


def test_case_b_padi_stair(engine):
    """
    Test B:
    Sentence: அவன் படியில் ஏறினான்.
    Target word: படி
    Expected meaning: படிக்கட்டு.
    """
    resp = engine.analyze(
        sentence="அவன் படியில் ஏறினான்.",
        target_word="படி"
    )
    assert resp.success is True
    assert "படிக்கட்டு" in resp.selected_meaning_tamil


def test_case_c_aaru_river(engine):
    """
    Test C:
    Sentence: ஆற்றில் தண்ணீர் ஓடுகிறது.
    Target word: ஆறு
    Expected meaning: நதி.
    """
    resp = engine.analyze(
        sentence="ஆற்றில் தண்ணீர் ஓடுகிறது.",
        target_word="ஆறு"
    )
    assert resp.success is True
    assert "நதி" in resp.selected_meaning_tamil


def test_case_d_aaru_number_six(engine):
    """
    Test D:
    Sentence: என்னிடம் ஆறு புத்தகங்கள் உள்ளன.
    Target word: ஆறு
    Expected meaning: ஆறு என்ற எண்.
    """
    resp = engine.analyze(
        sentence="என்னிடம் ஆறு புத்தகங்கள் உள்ளன.",
        target_word="ஆறு"
    )
    assert resp.success is True
    assert "ஆறு என்ற எண்" in resp.selected_meaning_tamil or "எண்" in resp.selected_meaning_tamil


def test_case_e_maalai_garland(engine):
    """
    Test E:
    Sentence: அவள் பூ மாலை அணிந்தாள்.
    Target word: மாலை
    Expected meaning: பூமாலை.
    """
    resp = engine.analyze(
        sentence="அவள் பூ மாலை அணிந்தாள்.",
        target_word="மாலை"
    )
    assert resp.success is True
    assert "பூமாலை" in resp.selected_meaning_tamil


def test_case_f_maalai_evening(engine):
    """
    Test F:
    Sentence: மாலை நேரத்தில் விளையாடினோம்.
    Target word: மாலை
    Expected meaning: மாலை நேரம்.
    """
    resp = engine.analyze(
        sentence="மாலை நேரத்தில் விளையாடினோம்.",
        target_word="மாலை"
    )
    assert resp.success is True
    assert "மாலை நேரம்" in resp.selected_meaning_tamil
