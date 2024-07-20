class SynapticSurge {
    constructor() {
        this.level = 1;
        this.score = 0;
        this.time = 60;
        this.gridSize = 4;
        this.grid = [];
        this.selectedCells = [];
        this.operations = ['+', '-', '*', '/'];
        this.gameBoard = document.getElementById('game-board');
        this.levelDisplay = document.getElementById('level');
        this.scoreDisplay = document.getElementById('score');
        this.timeDisplay = document.getElementById('time');
        this.startButton = document.getElementById('start-button');
        this.hintButton = document.getElementById('hint-button');
        this.modal = document.getElementById('modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.modalClose = document.getElementById('modal-close');

        this.startButton.addEventListener('click', () => this.startGame());
        this.hintButton.addEventListener('click', () => this.useHint());
        this.modalClose.addEventListener('click', () => this.closeModal());

        // Initialize the game board
        this.createGrid();
        this.updateDisplay();
    }

    startGame() {
        this.level = 1;
        this.score = 0;
        this.time = 60;
        this.gridSize = 4;
        this.updateDisplay();
        this.createGrid();
        this.startTimer();
        this.startButton.disabled = true;
        this.hintButton.disabled = false;
        this.showModal('Game Started', 'Select three cells to form a valid equation!');
    }

    createGrid() {
        this.gameBoard.innerHTML = '';
        this.gameBoard.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        this.grid = [];
        this.selectedCells = [];

        for (let i = 0; i < this.gridSize; i++) {
            let row = [];
            for (let j = 0; j < this.gridSize; j++) {
                let cell = document.createElement('div');
                cell.className = 'cell';
                cell.textContent = this.generateCellContent();
                cell.addEventListener('click', () => this.selectCell(i, j));
                this.gameBoard.appendChild(cell);
                row.push(cell.textContent);
            }
            this.grid.push(row);
        }
    }

    generateCellContent() {
        if (Math.random() < 0.7) {
            return Math.floor(Math.random() * 9) + 1;
        } else {
            return this.operations[Math.floor(Math.random() * this.operations.length)];
        }
    }

    selectCell(row, col) {
        let cell = this.gameBoard.children[row * this.gridSize + col];
        if (cell.classList.contains('selected')) {
            cell.classList.remove('selected');
            this.selectedCells = this.selectedCells.filter(c => c[0] !== row || c[1] !== col);
        } else {
            cell.classList.add('selected');
            this.selectedCells.push([row, col]);
        }

        if (this.selectedCells.length === 3) {
            this.checkEquation();
        }
    }

    checkEquation() {
        let values = this.selectedCells.map(([row, col]) => this.grid[row][col]);
        let numbersCount = values.filter(v => !isNaN(v)).length;

        if (numbersCount !== 2 || values.includes('/')) {
            this.showModal('Invalid Selection', 'Please select two numbers and one operation.');
            this.resetSelection();
            return;
        }

        let equation = values.join(' ');
        let result = eval(equation);

        if (!isNaN(result) && result % 1 === 0) {
            this.score += 10 * this.level;
            this.showModal('Correct!', `${equation} = ${result}`);
            this.updateCells();
        } else {
            this.showModal('Incorrect', 'Try again!');
        }

        this.resetSelection();
        this.updateDisplay();
        this.checkLevelUp();
    }

    updateCells() {
        for (let [row, col] of this.selectedCells) {
            this.grid[row][col] = this.generateCellContent();
            this.gameBoard.children[row * this.gridSize + col].textContent = this.grid[row][col];
        }
    }

    resetSelection() {
        for (let [row, col] of this.selectedCells) {
            this.gameBoard.children[row * this.gridSize + col].classList.remove('selected');
        }
        this.selectedCells = [];
    }

    checkLevelUp() {
        if (this.score >= this.level * 100) {
            this.level++;
            this.time = 60;
            if (this.level % 2 === 0 && this.gridSize < 6) {
                this.gridSize++;
                this.createGrid();
            }
            this.showModal('Level Up!', `You've reached level ${this.level}!`);
        }
    }

    startTimer() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.time--;
            this.updateDisplay();
            if (this.time <= 0) {
                clearInterval(this.timer);
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        this.showModal('Game Over', `Your final score is ${this.score}`);
        this.startButton.disabled = false;
        this.hintButton.disabled = true;
    }

    useHint() {
        let validCombinations = [];
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (!isNaN(this.grid[i][j])) {
                    for (let k = 0; k < this.gridSize; k++) {
                        for (let l = 0; l < this.gridSize; l++) {
                            if (k !== i && l !== j && !isNaN(this.grid[k][l])) {
                                for (let op of this.operations) {
                                    let equation = `${this.grid[i][j]} ${op} ${this.grid[k][l]}`;
                                    let result = eval(equation);
                                    if (!isNaN(result) && result % 1 === 0) {
                                        validCombinations.push([[i, j], [k, l], op]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if (validCombinations.length > 0) {
            let hint = validCombinations[Math.floor(Math.random() * validCombinations.length)];
            this.showModal('Hint', `Try using the numbers at (${hint[0][0]},${hint[0][1]}) and (${hint[1][0]},${hint[1][1]}) with the ${hint[2]} operation.`);
        } else {
            this.showModal('No Hint Available', 'There are no valid combinations. The board will be refreshed.');
            this.createGrid();
        }

        this.hintButton.disabled = true;
        setTimeout(() => this.hintButton.disabled = false, 30000);
    }

    updateDisplay() {
        this.levelDisplay.textContent = `Level: ${this.level}`;
        this.scoreDisplay.textContent = `Score: ${this.score}`;
        this.timeDisplay.textContent = `Time: ${this.time}`;
    }

    showModal(title, message) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.modal.style.display = 'block';
    }

    closeModal() {
        this.modal.style.display = 'none';
    }
}

// Initialize the game
const game = new SynapticSurge();
window.onclick = function(event) {
    if (event.target == game.modal) {
        game.closeModal();
    }
}