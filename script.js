/* =====================================================
   GOOGLE APPS SCRIPT API

   NANTI GANTI DENGAN URL WEB APP KAMU

   Contoh:
   https://script.google.com/macros/s/ABC123/exec
===================================================== */

const API_URL = "";


/* =====================================================
   ELEMENT
===================================================== */

const screens = document.querySelectorAll(".screen");

const menuScreen =
    document.getElementById("menuScreen");

const gameScreen =
    document.getElementById("gameScreen");

const finishScreen =
    document.getElementById("finishScreen");

const leaderboardScreen =
    document.getElementById("leaderboardScreen");


const usernameInput =
    document.getElementById("username");

const startBtn =
    document.getElementById("startBtn");

const leaderboardBtn =
    document.getElementById("leaderboardBtn");

const nextLevelBtn =
    document.getElementById("nextLevelBtn");

const homeBtn =
    document.getElementById("homeBtn");

const finishLeaderboardBtn =
    document.getElementById(
        "finishLeaderboardBtn"
    );

const leaderboardBackBtn =
    document.getElementById(
        "leaderboardBackBtn"
    );


const playerName =
    document.getElementById("playerName");

const scoreDisplay =
    document.getElementById("scoreDisplay");

const lifeDisplay =
    document.getElementById("lifeDisplay");

const timerDisplay =
    document.getElementById("timerDisplay");

const levelDisplay =
    document.getElementById("levelDisplay");

const questionProgress =
    document.getElementById(
        "questionProgress"
    );


const canvas =
    document.getElementById("mazeCanvas");

const ctx =
    canvas.getContext("2d");


const questionModal =
    document.getElementById(
        "questionModal"
    );

const questionText =
    document.getElementById(
        "questionText"
    );

const answerContainer =
    document.getElementById(
        "answerContainer"
    );

const feedback =
    document.getElementById("feedback");


/* =====================================================
   DATA GAME
===================================================== */

let username = "";

let score = 0;

let lives = 3;

let level = 1;

let seconds = 0;

let timerInterval = null;

let gameActive = false;

let answeringQuestion = false;

let answeredQuestions = 0;

const QUESTIONS_PER_LEVEL = 5;


/* =====================================================
   MAZE
===================================================== */

let maze = [];

let rows = 15;

let cols = 15;

let cellSize = 40;

let player = {
    row: 1,
    col: 1
};

let finish = {
    row: 13,
    col: 13
};

let questionCells = [];


/* =====================================================
   BANK SOAL
===================================================== */

const questionBank = [

    {
        question:
            "Apa ibu kota Indonesia?",

        answers: [
            "Jakarta",
            "Bandung",
            "Surabaya",
            "Semarang"
        ],

        correct: 0
    },

    {
        question:
            "Hasil dari 8 × 7 adalah...",

        answers: [
            "48",
            "54",
            "56",
            "64"
        ],

        correct: 2
    },

    {
        question:
            "Planet terdekat dengan Matahari adalah...",

        answers: [
            "Venus",
            "Mars",
            "Merkurius",
            "Bumi"
        ],

        correct: 2
    },

    {
        question:
            "HTML digunakan terutama untuk...",

        answers: [
            "Membuat struktur halaman web",
            "Mengedit video",
            "Menghapus database",
            "Membuat jaringan WiFi"
        ],

        correct: 0
    },

    {
        question:
            "CSS pada website digunakan untuk...",

        answers: [
            "Menyimpan data",
            "Mengatur tampilan website",
            "Menjalankan server",
            "Membuat database"
        ],

        correct: 1
    },

    {
        question:
            "JavaScript digunakan untuk membuat website menjadi...",

        answers: [
            "Interaktif",
            "Lebih berat saja",
            "Tidak memiliki warna",
            "Tidak dapat dibuka"
        ],

        correct: 0
    },

    {
        question:
            "Singkatan dari CPU adalah...",

        answers: [
            "Central Processing Unit",
            "Computer Personal Unit",
            "Control Program Utility",
            "Central Power User"
        ],

        correct: 0
    },

    {
        question:
            "Perangkat yang menghubungkan beberapa jaringan adalah...",

        answers: [
            "Keyboard",
            "Router",
            "Monitor",
            "Printer"
        ],

        correct: 1
    },

    {
        question:
            "Bahasa pemrograman Python memiliki ekstensi file...",

        answers: [
            ".html",
            ".css",
            ".py",
            ".jpg"
        ],

        correct: 2
    },

    {
        question:
            "Primary Key pada database berfungsi untuk...",

        answers: [
            "Menghapus semua tabel",
            "Menjadi identitas unik data",
            "Mengubah warna database",
            "Menghubungkan internet"
        ],

        correct: 1
    },

    {
        question:
            "Protokol web yang menggunakan enkripsi adalah...",

        answers: [
            "HTTP",
            "HTTPS",
            "FTP",
            "HTML"
        ],

        correct: 1
    },

    {
        question:
            "15 + 27 adalah...",

        answers: [
            "32",
            "40",
            "42",
            "44"
        ],

        correct: 2
    },

    {
        question:
            "Indonesia memiliki dasar negara yaitu...",

        answers: [
            "Pancasila",
            "UUD saja",
            "Garuda",
            "Bendera Merah Putih"
        ],

        correct: 0
    },

    {
        question:
            "Sensor yang digunakan untuk mengukur jarak adalah...",

        answers: [
            "Ultrasonik",
            "Keyboard",
            "Speaker",
            "Monitor"
        ],

        correct: 0
    },

    {
        question:
            "Perintah SQL untuk menampilkan data adalah...",

        answers: [
            "DELETE",
            "SELECT",
            "DROP",
            "UPDATE TABLE ALL"
        ],

        correct: 1
    }

];


/* =====================================================
   GANTI SCREEN
===================================================== */

function showScreen(screen) {

    screens.forEach(item => {

        item.classList.remove("active");

    });

    screen.classList.add("active");

}


/* =====================================================
   START GAME
===================================================== */

startBtn.addEventListener(
    "click",
    startNewGame
);


usernameInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            startNewGame();

        }

    }
);


function startNewGame() {

    const inputName =
        usernameInput.value.trim();

    if (!inputName) {

        alert(
            "Masukkan username terlebih dahulu!"
        );

        usernameInput.focus();

        return;

    }

    username = inputName;

    score = 0;

    lives = 3;

    level = 1;

    startLevel();

}


/* =====================================================
   START LEVEL
===================================================== */

function startLevel() {

    gameActive = true;

    answeringQuestion = false;

    answeredQuestions = 0;

    seconds = 0;

    player = {
        row: 1,
        col: 1
    };


    /*
       Level tinggi =
       labirin semakin besar
    */

    let size =
        13 + (level * 2);

    if (size > 21) {
        size = 21;
    }

    if (size % 2 === 0) {
        size++;
    }

    rows = size;
    cols = size;


    generateMaze();

    placeFinish();

    placeQuestionCells();


    playerName.textContent =
        username;

    levelDisplay.textContent =
        level;


    updateHUD();

    startTimer();

    showScreen(gameScreen);

    resizeCanvas();

}


/* =====================================================
   GENERATE MAZE
   Recursive Backtracking
===================================================== */

function generateMaze() {

    maze =
        Array.from(
            { length: rows },
            () =>
                Array(cols).fill(1)
        );


    function carve(row, col) {

        maze[row][col] = 0;


        const directions = [

            [-2, 0],

            [2, 0],

            [0, -2],

            [0, 2]

        ];


        shuffleArray(directions);


        directions.forEach(
            ([dr, dc]) => {

                const newRow =
                    row + dr;

                const newCol =
                    col + dc;


                if (
                    newRow > 0 &&
                    newRow < rows - 1 &&
                    newCol > 0 &&
                    newCol < cols - 1 &&
                    maze[newRow][newCol] === 1
                ) {

                    maze[
                        row + dr / 2
                    ][
                        col + dc / 2
                    ] = 0;


                    carve(
                        newRow,
                        newCol
                    );

                }

            }
        );

    }


    carve(1, 1);

}


/* =====================================================
   SHUFFLE
===================================================== */

function shuffleArray(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            array[i],
            array[j]

        ] = [

            array[j],
            array[i]

        ];

    }

}


/* =====================================================
   BFS
   Mencari titik terjauh dari start
===================================================== */

function findFarthestCell() {

    const visited =
        Array.from(
            { length: rows },
            () =>
                Array(cols).fill(false)
        );


    const queue = [

        {
            row: 1,
            col: 1,
            distance: 0
        }

    ];


    visited[1][1] = true;


    let farthest = queue[0];


    const directions = [

        [-1, 0],

        [1, 0],

        [0, -1],

        [0, 1]

    ];


    while (queue.length > 0) {

        const current =
            queue.shift();


        if (
            current.distance >
            farthest.distance
        ) {

            farthest = current;

        }


        directions.forEach(
            ([dr, dc]) => {

                const nr =
                    current.row + dr;

                const nc =
                    current.col + dc;


                if (
                    nr >= 0 &&
                    nr < rows &&
                    nc >= 0 &&
                    nc < cols &&
                    maze[nr][nc] === 0 &&
                    !visited[nr][nc]
                ) {

                    visited[nr][nc] = true;


                    queue.push({

                        row: nr,

                        col: nc,

                        distance:
                            current.distance + 1

                    });

                }

            }
        );

    }


    return farthest;

}


/* =====================================================
   FINISH
===================================================== */

function placeFinish() {

    const farthest =
        findFarthestCell();


    finish = {

        row: farthest.row,

        col: farthest.col

    };

}


/* =====================================================
   QUESTION CELLS
===================================================== */

function placeQuestionCells() {

    questionCells = [];


    const emptyCells = [];


    for (
        let row = 1;
        row < rows - 1;
        row++
    ) {

        for (
            let col = 1;
            col < cols - 1;
            col++
        ) {

            if (
                maze[row][col] === 0 &&
                !(row === 1 && col === 1) &&
                !(
                    row === finish.row &&
                    col === finish.col
                )
            ) {

                emptyCells.push({

                    row,
                    col,
                    answered: false,
                    question: null

                });

            }

        }

    }


    shuffleArray(emptyCells);


    const questions =
        [...questionBank];


    shuffleArray(questions);


    for (
        let i = 0;
        i < QUESTIONS_PER_LEVEL;
        i++
    ) {

        if (!emptyCells[i]) {
            break;
        }


        emptyCells[i].question =
            questions[
                i % questions.length
            ];


        questionCells.push(
            emptyCells[i]
        );

    }

}


/* =====================================================
   DRAW MAZE
===================================================== */

function drawMaze() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    cellSize =
        Math.min(
            canvas.width / cols,
            canvas.height / rows
        );


    for (
        let row = 0;
        row < rows;
        row++
    ) {

        for (
            let col = 0;
            col < cols;
            col++
        ) {

            const x =
                col * cellSize;

            const y =
                row * cellSize;


            if (maze[row][col] === 1) {

                ctx.fillStyle =
                    "#20284b";

            } else {

                ctx.fillStyle =
                    "#090d1d";

            }


            ctx.fillRect(
                x,
                y,
                cellSize + 1,
                cellSize + 1
            );

        }

    }


    drawQuestions();

    drawFinish();

    drawPlayer();

}


/* =====================================================
   DRAW QUESTIONS
===================================================== */

function drawQuestions() {

    questionCells.forEach(
        cell => {

            if (cell.answered) {
                return;
            }


            const x =
                cell.col *
                cellSize +
                cellSize / 2;

            const y =
                cell.row *
                cellSize +
                cellSize / 2;


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                cellSize * .30,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "#ffca48";

            ctx.fill();


            ctx.fillStyle =
                "#11162b";

            ctx.textAlign =
                "center";

            ctx.textBaseline =
                "middle";

            ctx.font =
                `bold ${cellSize * .45}px Poppins`;


            ctx.fillText(
                "?",
                x,
                y
            );

        }
    );

}


/* =====================================================
   DRAW FINISH
===================================================== */

function drawFinish() {

    const x =
        finish.col * cellSize;

    const y =
        finish.row * cellSize;


    ctx.fillStyle =
        "#2ddd84";


    ctx.fillRect(

        x + cellSize * .15,

        y + cellSize * .15,

        cellSize * .7,

        cellSize * .7

    );


    ctx.fillStyle = "#ffffff";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.font =
        `${cellSize * .45}px Arial`;


    ctx.fillText(

        "🏁",

        x + cellSize / 2,

        y + cellSize / 2

    );

}


/* =====================================================
   DRAW PLAYER
===================================================== */

function drawPlayer() {

    const x =
        player.col *
        cellSize +
        cellSize / 2;

    const y =
        player.row *
        cellSize +
        cellSize / 2;


    ctx.beginPath();


    ctx.arc(

        x,

        y,

        cellSize * .31,

        0,

        Math.PI * 2

    );


    ctx.fillStyle =
        "#6c63ff";

    ctx.fill();


    ctx.strokeStyle =
        "#c9c5ff";

    ctx.lineWidth =
        Math.max(
            1,
            cellSize * .07
        );

    ctx.stroke();


    ctx.fillStyle = "white";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.font =
        `${cellSize * .35}px Arial`;


    ctx.fillText(
        "🎓",
        x,
        y
    );

}


/* =====================================================
   RESIZE CANVAS
===================================================== */

function resizeCanvas() {

    const wrapper =
        document.querySelector(
            ".maze-wrapper"
        );


    const size =
        Math.min(
            wrapper.clientWidth,
            600
        );


    canvas.width = size;

    canvas.height = size;


    drawMaze();

}


window.addEventListener(
    "resize",
    () => {

        if (gameActive) {

            resizeCanvas();

        }

    }
);


/* =====================================================
   MOVEMENT
===================================================== */

function movePlayer(direction) {

    if (
        !gameActive ||
        answeringQuestion
    ) {
        return;
    }


    let newRow =
        player.row;

    let newCol =
        player.col;


    switch (direction) {

        case "up":

            newRow--;

            break;


        case "down":

            newRow++;

            break;


        case "left":

            newCol--;

            break;


        case "right":

            newCol++;

            break;

    }


    if (
        newRow < 0 ||
        newRow >= rows ||
        newCol < 0 ||
        newCol >= cols
    ) {

        return;

    }


    if (
        maze[newRow][newCol] === 1
    ) {

        return;

    }


    player.row = newRow;

    player.col = newCol;


    drawMaze();


    checkQuestion();

    checkFinish();

}


/* =====================================================
   KEYBOARD
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        if (
            [
                "arrowup",
                "arrowdown",
                "arrowleft",
                "arrowright",
                "w",
                "a",
                "s",
                "d"
            ].includes(key)
        ) {

            event.preventDefault();

        }


        if (
            key === "arrowup" ||
            key === "w"
        ) {

            movePlayer("up");

        }


        if (
            key === "arrowdown" ||
            key === "s"
        ) {

            movePlayer("down");

        }


        if (
            key === "arrowleft" ||
            key === "a"
        ) {

            movePlayer("left");

        }


        if (
            key === "arrowright" ||
            key === "d"
        ) {

            movePlayer("right");

        }

    }
);


/* =====================================================
   MOBILE CONTROLS
===================================================== */

document
    .querySelectorAll(
        ".control-btn[data-direction]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                movePlayer(
                    button.dataset.direction
                );

            }
        );

    });


/* =====================================================
   SWIPE CONTROL
===================================================== */

let touchStartX = 0;
let touchStartY = 0;


canvas.addEventListener(
    "touchstart",
    event => {

        touchStartX =
            event.touches[0].clientX;

        touchStartY =
            event.touches[0].clientY;

    },
    {
        passive: true
    }
);


canvas.addEventListener(
    "touchend",
    event => {

        const endX =
            event.changedTouches[0].clientX;

        const endY =
            event.changedTouches[0].clientY;


        const diffX =
            endX - touchStartX;

        const diffY =
            endY - touchStartY;


        if (
            Math.abs(diffX) < 20 &&
            Math.abs(diffY) < 20
        ) {

            return;

        }


        if (
            Math.abs(diffX) >
            Math.abs(diffY)
        ) {

            if (diffX > 0) {

                movePlayer("right");

            } else {

                movePlayer("left");

            }

        } else {

            if (diffY > 0) {

                movePlayer("down");

            } else {

                movePlayer("up");

            }

        }

    },
    {
        passive: true
    }
);


/* =====================================================
   CHECK QUESTION
===================================================== */

function checkQuestion() {

    const cell =
        questionCells.find(
            item =>
                item.row === player.row &&
                item.col === player.col &&
                !item.answered
        );


    if (cell) {

        showQuestion(cell);

    }

}


/* =====================================================
   SHOW QUESTION
===================================================== */

function showQuestion(cell) {

    answeringQuestion = true;

    questionText.textContent =
        cell.question.question;


    answerContainer.innerHTML = "";

    feedback.textContent = "";


    cell.question.answers.forEach(
        (answer, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "answer-btn";


            button.textContent =
                `${String.fromCharCode(
                    65 + index
                )}. ${answer}`;


            button.addEventListener(
                "click",
                () => {

                    checkAnswer(
                        cell,
                        index,
                        button
                    );

                }
            );


            answerContainer.appendChild(
                button
            );

        }
    );


    questionModal.classList.add(
        "active"
    );

}


/* =====================================================
   CHECK ANSWER
===================================================== */

function checkAnswer(
    cell,
    selectedIndex,
    button
) {

    const buttons =
        document.querySelectorAll(
            ".answer-btn"
        );


    buttons.forEach(btn => {

        btn.disabled = true;

    });


    const correctIndex =
        cell.question.correct;


    if (
        selectedIndex === correctIndex
    ) {

        button.classList.add(
            "correct"
        );


        feedback.textContent =
            "✅ Jawaban benar! +100 skor";


        feedback.style.color =
            "#2ddd84";


        score += 100;


    } else {

        button.classList.add(
            "wrong"
        );


        buttons[
            correctIndex
        ].classList.add(
            "correct"
        );


        feedback.textContent =
            "❌ Jawaban salah! Nyawa -1";


        feedback.style.color =
            "#ff5570";


        lives--;


        if (score >= 25) {

            score -= 25;

        }

    }


    cell.answered = true;

    answeredQuestions++;


    updateHUD();


    setTimeout(
        () => {

            questionModal
                .classList
                .remove("active");


            answeringQuestion = false;


            drawMaze();


            if (lives <= 0) {

                gameOver();

            }

        },
        1000
    );

}


/* =====================================================
   CHECK FINISH
===================================================== */

function checkFinish() {

    if (
        player.row === finish.row &&
        player.col === finish.col
    ) {

        if (
            answeredQuestions <
            QUESTIONS_PER_LEVEL
        ) {

            alert(
                `Jawab semua soal terlebih dahulu!\n\nSoal: ${answeredQuestions}/${QUESTIONS_PER_LEVEL}`
            );

            return;

        }


        completeLevel();

    }

}


/* =====================================================
   COMPLETE LEVEL
===================================================== */

function completeLevel() {

    gameActive = false;


    clearInterval(
        timerInterval
    );


    /*
       Bonus nyawa
    */

    score +=
        lives * 50;


    /*
       Bonus waktu
    */

    score +=
        Math.max(
            0,
            300 - seconds
        );


    updateHUD();


    document.getElementById(
        "finishName"
    ).textContent = username;


    document.getElementById(
        "finalScore"
    ).textContent = score;


    document.getElementById(
        "finalTime"
    ).textContent =
        formatTime(seconds);


    document.getElementById(
        "finalLives"
    ).textContent = lives;


    saveScore();


    showScreen(
        finishScreen
    );

}


/* =====================================================
   GAME OVER
===================================================== */

function gameOver() {

    gameActive = false;


    clearInterval(
        timerInterval
    );


    saveScore();


    alert(
        `Game Over!\nSkor kamu: ${score}`
    );


    showScreen(
        menuScreen
    );

}


/* =====================================================
   NEXT LEVEL
===================================================== */

nextLevelBtn.addEventListener(
    "click",
    () => {

        level++;

        lives = 3;

        score += 200;

        startLevel();

    }
);


/* =====================================================
   TIMER
===================================================== */

function startTimer() {

    clearInterval(
        timerInterval
    );


    timerInterval =
        setInterval(
            () => {

                if (
                    gameActive &&
                    !answeringQuestion
                ) {

                    seconds++;

                    timerDisplay.textContent =
                        formatTime(seconds);

                }

            },
            1000
        );

}


function formatTime(seconds) {

    const minute =
        Math.floor(
            seconds / 60
        );


    const second =
        seconds % 60;


    return (
        String(minute)
            .padStart(2, "0")
        +
        ":"
        +
        String(second)
            .padStart(2, "0")
    );

}


/* =====================================================
   HUD
===================================================== */

function updateHUD() {

    scoreDisplay.textContent =
        score;


    if (lives > 0) {

        lifeDisplay.textContent =
            "❤️".repeat(lives);

    } else {

        lifeDisplay.textContent =
            "💀";

    }


    timerDisplay.textContent =
        formatTime(seconds);


    questionProgress.textContent =
        `${answeredQuestions}/${QUESTIONS_PER_LEVEL}`;

}


/* =====================================================
   HOME
===================================================== */

homeBtn.addEventListener(
    "click",
    () => {

        gameActive = false;

        clearInterval(
            timerInterval
        );

        showScreen(
            menuScreen
        );

    }
);


/* =====================================================
   LEADERBOARD BUTTON
===================================================== */

leaderboardBtn.addEventListener(
    "click",
    openLeaderboard
);


finishLeaderboardBtn.addEventListener(
    "click",
    openLeaderboard
);


leaderboardBackBtn.addEventListener(
    "click",
    () => {

        showScreen(
            menuScreen
        );

    }
);


/* =====================================================
   OPEN LEADERBOARD
===================================================== */

function openLeaderboard() {

    showScreen(
        leaderboardScreen
    );


    loadLeaderboard();

}


/* =====================================================
   SAVE SCORE
===================================================== */

async function saveScore() {

    const data = {

        username:
            username,

        score:
            score,

        time:
            formatTime(seconds),

        level:
            level

    };


    /*
       Simpan lokal dulu
       agar game tetap bisa digunakan
       walaupun belum menggunakan Google Sheet
    */

    saveLocalScore(data);


    if (!API_URL) {

        console.log(
            "API Google Sheets belum dipasang."
        );

        return;

    }


    try {

        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(data)

                }
            );


        const result =
            await response.json();


        console.log(
            "Google Sheets:",
            result
        );


    } catch (error) {

        console.error(
            "Gagal menyimpan ke Google Sheets:",
            error
        );

    }

}


/* =====================================================
   LOCAL STORAGE
===================================================== */

function saveLocalScore(data) {

    let leaderboard =
        JSON.parse(
            localStorage.getItem(
                "edumazeLeaderboard"
            )
        ) || [];


    leaderboard.push(
        data
    );


    leaderboard.sort(
        (a, b) =>
            Number(b.score) -
            Number(a.score)
    );


    leaderboard =
        leaderboard.slice(
            0,
            20
        );


    localStorage.setItem(

        "edumazeLeaderboard",

        JSON.stringify(
            leaderboard
        )

    );

}


/* =====================================================
   LOAD LEADERBOARD
===================================================== */

async function loadLeaderboard() {

    const container =
        document.getElementById(
            "leaderboardList"
        );


    container.innerHTML = `

        <div class="loading">
            Memuat leaderboard...
        </div>

    `;


    /*
       Jika API belum tersedia,
       gunakan leaderboard lokal
    */

    if (!API_URL) {

        const localData =
            getLocalLeaderboard();


        displayLeaderboard(
            localData
        );


        return;

    }


    try {

        const response =
            await fetch(
                API_URL + "?action=leaderboard"
            );


        if (!response.ok) {

            throw new Error(
                "HTTP error"
            );

        }


        const data =
            await response.json();


        if (
            data.success &&
            Array.isArray(data.data)
        ) {

            displayLeaderboard(
                data.data
            );

        } else {

            displayLeaderboard(
                getLocalLeaderboard()
            );

        }


    } catch (error) {

        console.error(error);


        displayLeaderboard(
            getLocalLeaderboard()
        );

    }

}


/* =====================================================
   GET LOCAL LEADERBOARD
===================================================== */

function getLocalLeaderboard() {

    return JSON.parse(
        localStorage.getItem(
            "edumazeLeaderboard"
        )
    ) || [];

}


/* =====================================================
   DISPLAY LEADERBOARD
===================================================== */

function displayLeaderboard(data) {

    const container =
        document.getElementById(
            "leaderboardList"
        );


    if (
        !data ||
        data.length === 0
    ) {

        container.innerHTML = `

            <div class="loading">

                Belum ada pemain.
                <br>
                Jadilah pemain pertama!

            </div>

        `;


        return;

    }


    /*
       Pastikan ranking sesuai skor
    */

    data.sort(
        (a, b) =>
            Number(b.score) -
            Number(a.score)
    );


    const topPlayers =
        data.slice(0, 20);


    container.innerHTML = "";


    topPlayers.forEach(
        (player, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "rank-item";


            let rank =
                index + 1;


            if (rank === 1) {

                rank = "🥇";

            } else if (rank === 2) {

                rank = "🥈";

            } else if (rank === 3) {

                rank = "🥉";

            }


            item.innerHTML = `

                <div class="rank-number">
                    ${rank}
                </div>

                <div class="rank-info">

                    <strong>
                        ${escapeHTML(
                            player.username ||
                            "Player"
                        )}
                    </strong>

                    <small>

                        Level
                        ${player.level || 1}

                        •

                        ${player.time || "00:00"}

                    </small>

                </div>

                <div class="rank-score">

                    ⭐ ${player.score || 0}

                </div>

            `;


            container.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   SECURITY
===================================================== */

function escapeHTML(text) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        String(text);


    return element.innerHTML;

}


/* =====================================================
   INIT
===================================================== */

showScreen(
    menuScreen
);
