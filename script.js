class LogicLabyrinth {
    constructor() {
        this.level = 1;
        this.score = 0;
        this.timeLeft = 60;
        this.puzzleArea = document.getElementById('puzzle-area');
        this.submitBtn = document.getElementById('submit-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.modal = document.getElementById('modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.modalClose = document.getElementById('modal-close');
        this.gameContainer = document.getElementById('game-container');
        this.timerElement = document.getElementById('timer');

        this.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.nextBtn.addEventListener('click', () => this.nextPuzzle());
        this.modalClose.addEventListener('click', () => this.closeModal());

        this.puzzleTypes = [
            this.generateSequencePuzzle,
            this.generatePatternPuzzle,
            this.generateLogicPuzzle,
            this.generateWordPuzzle,
            this.generateMathPuzzle,
            this.generateVisualPuzzle
        ];

        this.currentPuzzle = null;
        this.startGame();
    }

    startGame() {
        this.nextPuzzle();
        this.startTimer();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerElement.textContent = `Time: ${this.timeLeft}`;
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        clearInterval(this.timerInterval);
        this.showModal('Game Over', `Your final score is ${this.score}. Great job!`);
        this.submitBtn.style.display = 'none';
        this.nextBtn.style.display = 'none';
    }

    nextPuzzle() {
        this.puzzleArea.style.opacity = '0';
        setTimeout(() => {
            this.currentPuzzle = this.puzzleTypes[Math.floor(Math.random() * this.puzzleTypes.length)].call(this);
            this.submitBtn.style.display = 'inline-block';
            this.nextBtn.style.display = 'none';
            this.updateDisplay();
            this.puzzleArea.style.opacity = '1';
        }, 500);
    }

    generateSequencePuzzle() {
        const sequences = [
            {seq: [2, 4, 6, 8], next: 10, rule: "Add 2 to the previous number"},
            {seq: [1, 3, 6, 10], next: 15, rule: "Add the current position to the previous number"},
            {seq: [1, 2, 4, 8], next: 16, rule: "Multiply the previous number by 2"},
            {seq: [3, 1, 4, 1, 5], next: 9, rule: "It's the sequence of digits in pi"},
            {seq: [1, 1, 2, 3, 5], next: 8, rule: "Each number is the sum of the two preceding ones (Fibonacci sequence)"}
        ];
        const puzzle = sequences[Math.floor(Math.random() * sequences.length)];
        
        this.puzzleArea.innerHTML = `
            <p class="puzzle-question">What's the next number in the sequence?</p>
            <p class="puzzle-sequence">${puzzle.seq.join(', ')}, ?</p>
            <input type="number" id="sequence-answer" class="puzzle-input">
        `;
        
        return {
            type: 'sequence',
            answer: puzzle.next,
            rule: puzzle.rule
        };
    }

    generatePatternPuzzle() {
        const patterns = [
            {pattern: 'AABBAABBAABB', next: 'A', rule: "The pattern repeats every 4 characters"},
            {pattern: 'ABCABCABCABC', next: 'A', rule: "The pattern repeats every 3 characters"},
            {pattern: 'AABABCABCD', next: 'A', rule: "The pattern restarts after reaching D"},
            {pattern: 'ATGCATGCATGC', next: 'A', rule: "It's a repeating DNA sequence pattern"},
            {pattern: 'ROYGBIV', next: 'R', rule: "It's the colors of the rainbow, repeating"}
        ];
        const puzzle = patterns[Math.floor(Math.random() * patterns.length)];
        
        this.puzzleArea.innerHTML = `
            <p class="puzzle-question">What's the next letter in the pattern?</p>
            <p class="puzzle-pattern">${puzzle.pattern}</p>
            <input type="text" id="pattern-answer" maxlength="1" class="puzzle-input">
        `;
        
        return {
            type: 'pattern',
            answer: puzzle.next,
            rule: puzzle.rule
        };
    }

    generateLogicPuzzle() {
        const puzzles = [
            {
                question: "If all Zorks are Flurbs, and no Flurbs are Glimps, then:",
                options: [
                    "All Zorks are Glimps",
                    "No Zorks are Glimps",
                    "Some Zorks might be Glimps",
                    "All Glimps are Zorks"
                ],
                answer: 1,
                explanation: "Since all Zorks are Flurbs, and no Flurbs are Glimps, it follows that no Zorks can be Glimps."
            },
            {
                question: "If it's not sunny, then it's cloudy. It's not cloudy. Therefore:",
                options: [
                    "It's sunny",
                    "It's raining",
                    "It's not sunny",
                    "We can't determine the weather"
                ],
                answer: 0,
                explanation: "This is an example of modus tollens. If P then Q, not Q, therefore not P. So, if it's not cloudy, it must be sunny."
            },
            {
                question: "All cats have tails. Fluffy has a tail. Therefore:",
                options: [
                    "Fluffy is a cat",
                    "Fluffy is not a cat",
                    "Fluffy might be a cat",
                    "We can't determine if Fluffy is a cat"
                ],
                answer: 3,
                explanation: "This is a classic example of the fallacy of affirming the consequent. Just because all cats have tails doesn't mean all things with tails are cats."
            }
        ];
        const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
        
        this.puzzleArea.innerHTML = `
            <p class="puzzle-question">${puzzle.question}</p>
            ${puzzle.options.map((option, index) => `
                <div class="puzzle-option">
                    <input type="radio" name="logic-answer" id="option-${index}" value="${index}">
                    <label for="option-${index}">${option}</label>
                </div>
            `).join('')}
        `;
        
        return {
            type: 'logic',
            answer: puzzle.answer,
            explanation: puzzle.explanation
        };
    }

    generateWordPuzzle() {
        const puzzles = [
            {
                question: "Rearrange the letters to form a word: ELPPAP",
                answer: "APPLE",
                hint: "It's a fruit"
            },
            {
                question: "Fill in the missing letter: C_MPUTER",
                answer: "O",
                hint: "It's an electronic device"
            },
            {
                question: "What word contains all of these letters: H, E, A, R, T",
                answer: "EARTH",
                hint: "It's our planet"
            }
        ];
        const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
        
        this.puzzleArea.innerHTML = `
            <p class="puzzle-question">${puzzle.question}</p>
            <input type="text" id="word-answer" class="puzzle-input">
            <button id="hint-btn" class="hint-button">Hint</button>
        `;
        
        document.getElementById('hint-btn').addEventListener('click', () => {
            this.showModal('Hint', puzzle.hint);
        });
        
        return {
            type: 'word',
            answer: puzzle.answer.toUpperCase(),
            hint: puzzle.hint
        };
    }

    generateMathPuzzle() {
        const puzzles = [
            {
                question: "What is the value of x in the equation: 2x + 5 = 13",
                answer: 4,
                explanation: "Subtract 5 from both sides: 2x = 8, then divide both sides by 2: x = 4"
            },
            {
                question: "If a rectangle has a perimeter of 20 and a width of 3, what is its length?",
                answer: 7,
                explanation: "Perimeter = 2(length + width). 20 = 2(length + 3). Solve for length."
            },
            {
                question: "What is 15% of 80?",
                answer: 12,
                explanation: "Convert 15% to 0.15, then multiply by 80: 0.15 * 80 = 12"
            }
        ];
        const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
        
        this.puzzleArea.innerHTML = `
            <p class="puzzle-question">${puzzle.question}</p>
            <input type="number" id="math-answer" class="puzzle-input">
        `;
        
        return {
            type: 'math',
            answer: puzzle.answer,
            explanation: puzzle.explanation
        };
    }

    generateVisualPuzzle() {
        const puzzles = [
            {
                image: 'https://example.com/puzzle1.jpg',
                question: "How many triangles can you find in this image?",
                answer: 9,
                explanation: "There are 9 triangles in total: 1 large triangle, 3 medium triangles, and 5 small triangles."
            },
            {
                image: 'https://example.com/puzzle2.jpg',
                question: "What number comes next in this visual sequence?",
                answer: 15,
                explanation: "The sequence is doubling and then subtracting 1: 3, 5, 9, 15"
            }
        ];
        const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
        
        this.puzzleArea.innerHTML = `
            <img src="${puzzle.image}" alt="Visual Puzzle" class="puzzle-image">
            <p class="puzzle-question">${puzzle.question}</p>
            <input type="number" id="visual-answer" class="puzzle-input">
        `;
        
        return {
            type: 'visual',
            answer: puzzle.answer,
            explanation: puzzle.explanation
        };
    }

    checkAnswer() {
        let userAnswer;
        switch(this.currentPuzzle.type) {
            case 'sequence':
            case 'math':
            case 'visual':
                userAnswer = parseInt(document.getElementById(`${this.currentPuzzle.type}-answer`).value);
                break;
            case 'pattern':
            case 'word':
                userAnswer = document.getElementById(`${this.currentPuzzle.type}-answer`).value.toUpperCase();
                break;
            case 'logic':
                userAnswer = parseInt(document.querySelector('input[name="logic-answer"]:checked')?.value);
                break;
        }

        if (userAnswer === this.currentPuzzle.answer) {
            this.score += this.level * 10;
            this.showModal('Correct!', `Well done! ${this.currentPuzzle.rule || this.currentPuzzle.explanation}`);
            this.level++;
            this.puzzleArea.classList.add('correct-answer');
        } else {
            this.showModal('Incorrect', `The correct answer was ${this.currentPuzzle.answer}. ${this.currentPuzzle.rule || this.currentPuzzle.explanation}`);
            this.puzzleArea.classList.add('wrong-answer');
        }

        setTimeout(() => {
            this.puzzleArea.classList.remove('correct-answer', 'wrong-answer');
        }, 1000);

        this.submitBtn.style.display = 'none';
        this.nextBtn.style.display = 'inline-block';
        this.updateDisplay();
    }

    updateDisplay() {
        const levelElement = document.getElementById('level');
        const scoreElement = document.getElementById('score');
        
        levelElement.textContent = `Level: ${this.level}`;
        scoreElement.textContent = `Score: ${this.score}`;
        
        levelElement.classList.add('updated');
        scoreElement.classList.add('updated');
        
        setTimeout(() => {
            levelElement.classList.remove('updated');
            scoreElement.classList.remove('updated');
        }, 500);
    }

    showModal(title, message) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.modal.style.display = 'block';
        this.modal.classList.add('fade-in');
        setTimeout(() => {
            this.modal.classList.remove('fade-in');
        }, 500);
    }

    closeModal() {
        this.modal.classList.add('fade-out');
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.modal.classList.remove('fade-out');
        }, 500);
    }
}

const game = new LogicLabyrinth();