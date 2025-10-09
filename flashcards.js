// GET → 단어 목록 가져오기
async function fetchFlashcards() {
  try {
    const response = await fetch("/api/flashcards");
    return response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

// POST → 새 단어 추가
async function createFlashcardData(wordData) {
  try {
    const url = "/api/flashcards";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wordData),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

// 화면에 렌더링, 모달 제어, 이벤트 등록
export async function setupFlashcards() {
  const flashcardsList = document.getElementById("flashcards-list");
  const addWordBtn = document.querySelector(".add-word");
  const wordModal = document.getElementById("word-modal");
  const wordForm = document.getElementById("word-form");
  const cancelBtn = document.querySelector(".cancel-word");

  // 데이터 불러오기: fetch해서 목록 렌더링
  async function readFlashcards() {
    const wordList = await fetchFlashcards();
    renderFlashcards(wordList);
  }
  // 카드 렌더링: HTML에 단어카드 그리기
  async function renderFlashcards(wordList) {
    flashcardsList.innerHTML = "";
    wordList.forEach((word) => {
      const flashcard = `
      <div class="flashcard">
        <div class="flashcard-content">
          <p class="flashcard-title">${word.word}</p>
          <div class="flashcard-icons">
            <button data-toggle="${word.id}" class="flashcard-meaning">
              <span class="ri-eye-line"></span>
            </button>
          </div>
        </div>
        <div data-meaning="${word.id}" class="hidden">
          <p class="flashcard-toggle">${word.meaning}</p>
        </div>
      </div>
      `;
      flashcardsList.innerHTML += flashcard;
    });
  }

  // 뜻 보이기/숨기기: 클릭 시 .hidden 토글
  function toggleMeaning(id) {
    const meaningElement = document.querySelector(`[data-meaning="${id}"]`);

    if (meaningElement.classList.contains("hidden")) {
      meaningElement.classList.remove("hidden");
    } else {
      meaningElement.classList.add("hidden");
    }
  }

  // 모달창 제어: 추가창 열기
  function showModal() {
    wordModal.classList.remove("hidden");
    document.getElementById("word-input").focus();
  }

  // 모달창 제어: 추가창 닫기
  function hideModal() {
    wordModal.classList.add("hidden");
    wordForm.reset();
  }

  // 데이터 저장: 입력된 단어를 JSON에 POST
  async function save(event) {
    event.preventDefault();

    const wordInput = document.getElementById("word-input").value;
    const meaningInput = document.getElementById("meaning-input").value;

    const word = {
      id: Date.now(),
      word: wordInput.trim(),
      meaning: meaningInput.trim(),
    };
    await createFlashcardData(word);
    await readFlashcards();
    hideModal();
  }

  // 이벤트 리스너 등록
  addWordBtn.addEventListener("click", showModal);
  cancelBtn.addEventListener("click", hideModal);
  wordForm.addEventListener("submit", save);
  wordModal.addEventListener("click", (event) => {
    if (event.target === wordModal) {
      hideModal();
    }
  });

  flashcardsList.addEventListener("click", (event) => {
    const btn = event.target.closest(".flashcard-meaning");
    if (btn) {
      const id = btn.getAttribute("data-toggle");
      toggleMeaning(id);
    } else {
      return;
    }
  });

  await readFlashcards();
}

// 지금 구조의 핵심 요약
// fetchFlashcards → 읽기
// createFlashcardData → 쓰기(추가)
// 그 외에는 UI 이벤트와 렌더링
