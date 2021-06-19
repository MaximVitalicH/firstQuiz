const question = document.getElementById('question'); /*Вопрос*/

const numberOfQuestion = document.getElementById('number-of-question'), /*Номер вопроса*/
    numberOfAllQuestions = document.getElementById('number-of-all-questions'); // количество всех вопросов

const option1 = document.querySelector('.option1'), /* Все варианты ответов*/
    option2 = document.querySelector('.option2'),
    option3 = document.querySelector('.option3'),
    option4 = document.querySelector('.option4');

const optionElements = document.querySelectorAll('.option'); /* массив всех ответов*/

let indexOfQuestion,    //индекс  текущего вопроса  [в массиве] для логики работы скрипта
    indexOfPage = 0;   //индекс страницы вопроса [в массиве] для логики работы скрипта

const btnNext = document.getElementById('btn-next');

const answersTracker = document.getElementById('answers-tracker');//обёртка для трекера(кружочков снизу)

let score = 0; // итоговый результат для всплывающего (модального) окна

const correctAnswer = document.getElementById('correct-answer'),   //кол-во правильных ответов для модального окна 
    numberOfAllQuestions2 = document.getElementById('number-of-all-questions-2'), //количество всех вопросов для модального окна
    btnTryAgain = document.getElementById('btn-try-again'); // кнопка "попробуй снова" в модальном окне

    //массивы из объектов с самими вопросами и ответами на них

const questions = [
    {
        question: 'Столица Российской Федерации',
        options: [
            'Самара',
            'Киев',
            'Москва',
            'Лондон',
        ],
        rightAnswer: 2
    },
    {
        question: 'Как зовут Максима Витальевича?',
        options: [
            'Зигмунд',
            'Милашкин',
            'Эй, ты!',
            'Максим',
        ],
        rightAnswer: 3
    },
    {
        question: 'Самая красивая девочка на свете это: ',
        options: [
            'Снежанна',
            'Каришка',
            'Виолетта',
            'Снежанна Виолетовна',
        ],
        rightAnswer: 1
    },
    {
        question: 'Что нужно делать по ночам?',
        options: [
            'Спать',
            'Тусить',
            'Есть',
            'Зажигать свет',
        ],
        rightAnswer: 3
    }
];

numberOfAllQuestions.innerHTML = questions.length; //выводим кол-во вопросов  в шапке 



const load = () => {
    question.innerHTML/*определили место куда подставим вопрос в HTML*/ = questions[indexOfQuestion].question //сам вопрос;
    option1.innerHTML = questions[indexOfQuestion].options[0];//сами ответы
    option2.innerHTML = questions[indexOfQuestion].options[1];
    option3.innerHTML = questions[indexOfQuestion].options[2];
    option4.innerHTML = questions[indexOfQuestion].options[3];

    numberOfQuestion.innerHTML = indexOfPage + 1; //установка номера текущей страницы
    indexOfPage++; // увеличение индекса страницы

};

let completedAnswers = []; //массив для уже заданных вопросов


const randomQuestion = () => {
    //делаем рандомное поевление вопросов
    let randomNumber = Math.floor/*округление до целого числа*/(Math.random()/*генерим рандомное число типа 0,123456789 */ * /*умножаем на количество наших вопросов чтоб получить число больше или равное 0*/questions.length);
    let hitDuplicate = false; // якорь для проверки одинаковых вопросов

    /*Дальше проверка чтоб не вопросы появлялись рандомно но не повторялись, номер страницы вопроса закидывается 
    в  массив и идёт проверка чтоб не совпадали числа и не превысило количество*/

    if(indexOfPage == questions.length) {
        quizOver()
    } else {
        if (completedAnswers.length > 0) {
            completedAnswers.forEach(item => {
                if(item == randomNumber) {
                    hitDuplicate = true;
                }
            });
            if(hitDuplicate == true) {
                randomQuestion();
            } else{
                indexOfQuestion = randomNumber;
                load (); 
            }
        }
        if(completedAnswers.length == 0){
            indexOfQuestion = randomNumber;
            load();
        }
    }
    completedAnswers.push(indexOfQuestion);
};

//подсвечивание правильных/неправильных ответов
const checkAnswer = el /*элемент*/ => {
    if(el.target.dataset.id == questions[indexOfQuestion].rightAnswer) {
        el.target.classList.add('correct');
        updateAnswerTrecker('correct'); //красим кругляш в нужный цвет
        score++; // добавление в общий счёт правильного ответа
    } else {
        el.target.classList.add('wrong');
        updateAnswerTrecker('wrong'); //красим кругляш в нужный цвет
    }
    disabledOption();
}

for(option of optionElements) {
    option.addEventListener('click', e/* эвент*/ => checkAnswer(e));
}


//блокировка возможности выбора ответов после выбора одного из них
const disabledOption =() => {
    optionElements.forEach(item => {
        item.classList.add('disabled');
        if(item.dataset.id == questions[indexOfQuestion].rightAnswer) {
            item.classList.add('correct'); //показ правильного при выборе не верного ответа
        }
    })
}


//Удаление всех классов со всех ответов при смене страницы
const enableOption = () => {
    optionElements.forEach(item => {
        item.classList.remove('disabled', 'correct', 'wrong');
    })
}

// добавление дивов в html
const answerTrecker = () => {
    questions.forEach(() => {
        const div = document.createElement('div');
        answersTracker.appendChild(div);
    })
}

const updateAnswerTrecker = status => {
    answersTracker.children[indexOfPage - 1].classList.add(`${status}`);
}

//проверка на выбор ответа дисаблед добавляется ко всем при выборе, потому слушаем любой
const validate = () => {
    if(!optionElements[0].classList.contains('disabled')) {// знак ! поменял истинное выражение на ложное
        alert('вам нужно выбрать один из вариантов ответа');//всплывает окно если не выбрано ничего
    } else{
        randomQuestion();
        enableOption();
    }
}

const quizOver = () => {
    document.querySelector('.quiz-over-modal').classList.add('active');
    correctAnswer.innerHTML = score;
    numberOfAllQuestions2.innerHTML = questions.length;
}


const tryAgain = () =>{
    window.location.reload();
}

btnTryAgain.addEventListener('click',tryAgain );

btnNext.addEventListener('click', () => {
    validate();
})

window.addEventListener('load', () => {
    randomQuestion ();    //вызов функции randomQuestion после прогрузки всей страницы
    answerTrecker ();                          
});