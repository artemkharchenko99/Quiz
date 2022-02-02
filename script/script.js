import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
import { getDatabase, ref, child, get, push } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const btnOpenModal = document.querySelector('#btnOpenModal')
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal')
    const questionTitle = document.querySelector('#question')
    const formAnswers = document.querySelector('#formAnswers')
    const nextButton = document.querySelector('#next')
    const prevButton = document.querySelector('#prev')
    const sendButton = document.querySelector('#send')

    const firebaseConfig = {
        apiKey: "AIzaSyDvfZmAu2EaYebGG5w21m6RO7dW50J1fdw",
        authDomain: "testburger-a3ad1.firebaseapp.com",
        databaseURL: "https://testburger-a3ad1-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "testburger-a3ad1",
        storageBucket: "testburger-a3ad1.appspot.com",
        messagingSenderId: "697422036004",
        appId: "1:697422036004:web:ec9f6f8ddedfc4a3cfacb1",
        measurementId: "G-0YJ06KNM1F"
    };

    initializeApp(firebaseConfig);

    const getData = () => {
        nextButton.classList.add('d-none')
        prevButton.classList.add('d-none')

        formAnswers.textContent = 'LOAD';

        const dbRef = ref(getDatabase());
        get(child(dbRef, `questions`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    playTest(snapshot.val())
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
    }

    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block')
        getData();
    })

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block')
    })

    const playTest = (questions) => {
        const finalAnswers = []

        let numberQuestion = 0

        const createAnswer = ({ title, url, type }) => `
            <div class="answers-item d-flex justify-content-center" >
                <input type=${type} id=${title} name="answer" class="d-none" value=${title}>
                <label for=${title} class="d-flex flex-column justify-content-between">
                    <img class="answerImg" src=${url} alt="burger">
                    <span>${title}</span>
                </label>
            </div>
        `

        const renderAnswers = (number) => {
            questions[number].answers.forEach((answer, index) => {
                formAnswers.insertAdjacentHTML('beforeend', createAnswer({ ...answer, type: questions[number].type }))
            })
        }

        const renderQuestions = (number) => {
            formAnswers.innerHTML = ''
            switch(true) {
                case (number >= 0 && number <= questions.length - 1):
                    questionTitle.textContent = questions[number].question;
                    renderAnswers(number)
                    nextButton.classList.remove('d-none')
                    prevButton.classList.remove('d-none')
                    sendButton.classList.add('d-none')
                case (number === 0):
                    prevButton.classList.add('d-none')
                    break;
                case (number === questions.length):
                    nextButton.classList.add('d-none')
                    prevButton.classList.add('d-none')
                    sendButton.classList.remove('d-none')
                    questionTitle.textContent = ''
                    formAnswers.innerHTML = `
                        <div>
                            <label for="numberPhone">Enter your number</label>
                            <input type="phone" class="form-control" id="numberPhone">
                        </div>
                    `
                    break;
                case (number === questions.length + 1):
                    formAnswers.textContent = 'Спасибо за пройденный тест'
                    setTimeout(() => {
                        modalBlock.classList.remove('d-block')
                    }, 2000)
            }
           
        }

        renderQuestions(numberQuestion);

        const checkAnswer = () => {
            const obj = {};
            const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone')

            inputs.forEach((input, index) => {
                if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                    obj[`${index}_${questions[numberQuestion].question}`] = input.value
                }

                if (numberQuestion === questions.length) {
                    obj['Номер телефона'] = input.value
                }
            })

            finalAnswers.push(obj)
        }


        nextButton.onclick = () => {
            checkAnswer()
            numberQuestion++;
            renderQuestions(numberQuestion)
        }

        prevButton.onclick = () => {
            checkAnswer()
            numberQuestion--;
            renderQuestions(numberQuestion)
        }
        sendButton.addEventListener('click', () => {
            checkAnswer()
            numberQuestion++;
            renderQuestions(numberQuestion)

            const db = getDatabase();
            push(ref(db, 'contant'), finalAnswers);
        })
    }
})