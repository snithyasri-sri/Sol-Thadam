import os
import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def test_api_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "இயங்குகிறது"
    assert data["dataset_loaded"] is True
    assert data["total_records"] >= 10
    assert data["unique_words"] >= 5


def test_api_words_list(client):
    response = client.get("/api/words")
    assert response.status_code == 200
    words = response.json()
    assert len(words) >= 5
    words_list = [w["word"] for w in words]
    assert "படி" in words_list
    assert "ஆறு" in words_list


def test_api_words_search(client):
    response = client.get("/api/words?search=படி")
    assert response.status_code == 200
    words = response.json()
    assert len(words) >= 1
    assert words[0]["word"] == "படி"


def test_api_word_details(client):
    response = client.get("/api/words/படி")
    assert response.status_code == 200
    data = response.json()
    assert data["word"] == "படி"
    assert data["total_senses"] >= 2


def test_api_analyze_valid(client):
    payload = {
        "sentence": "நன்றாகப் படி.",
        "target_word": "படி"
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "படித்தல்" in data["selected_meaning_tamil"]
    assert "reasoning_basis" in data
    assert len(data["alternatives"]) >= 1


def test_api_analyze_missing_word(client):
    payload = {
        "sentence": "வானம் நீலமாக உள்ளது.",
        "target_word": "படி"
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert "கண்டறியப்படவில்லை" in data["explanation_tamil"] or data["warning"] is not None


def test_api_quiz_questions(client):
    response = client.get("/api/quiz/questions?limit=5")
    assert response.status_code == 200
    questions = response.json()
    assert len(questions) > 0
    q = questions[0]
    assert "sentence" in q
    assert "target_word" in q
    assert len(q["options"]) >= 2
    assert "explanation_tamil" in q
