document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const messageElement = document.getElementById('message');
    const resetButton = document.getElementById('reset-btn');
    const playerTurnDot = document.getElementById('player-turn');
    const aiTurnDot = document.getElementById('ai-turn');
    
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X'; // El jugador siempre es X
    let gameActive = true;
    
    // Combinaciones ganadoras
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];
    
    // Función para manejar el clic en una celda
    function handleCellClick(e) {
        const clickedCell = e.target;
        const cellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // Verificar si la celda ya está ocupada o el juego no está activo
        if (board[cellIndex] !== '' || !gameActive || currentPlayer !== 'X') {
            return;
        }
        
        // Realizar movimiento del jugador
        makeMove(cellIndex, 'X');
        
        // Verificar si el jugador ganó
        if (checkWinner('X')) {
            messageElement.textContent = '¡Ganaste!';
            gameActive = false;
            highlightWinningCells();
            return;
        }
        
        // Verificar empate
        if (checkDraw()) {
            messageElement.textContent = '¡Empate!';
            gameActive = false;
            return;
        }
        
        // Cambiar turno a la máquina
        currentPlayer = 'O';
        updateTurnIndicator();
        messageElement.textContent = 'Turno de la máquina...';
        
        // La máquina juega después de un breve retraso
        setTimeout(makeAIMove, 800);
    }
    
    // Función para que la máquina realice un movimiento
    function makeAIMove() {
        if (!gameActive) return;
        
        // Estrategia simple de la máquina:
        // 1. Intentar ganar
        // 2. Bloquear al jugador si está a punto de ganar
        // 3. Tomar el centro si está disponible
        // 4. Tomar una esquina si está disponible
        // 5. Tomar cualquier celda disponible
        
        let move = -1;
        
        // Intentar ganar
        move = findWinningMove('O');
        if (move === -1) {
            // Bloquear al jugador
            move = findWinningMove('X');
        }
        if (move === -1) {
            // Tomar el centro si está disponible
            if (board[4] === '') {
                move = 4;
            }
        }
        if (move === -1) {
            // Tomar una esquina si está disponible
            const corners = [0, 2, 6, 8];
            const availableCorners = corners.filter(index => board[index] === '');
            if (availableCorners.length > 0) {
                move = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            }
        }
        if (move === -1) {
            // Tomar cualquier celda disponible
            const availableCells = board.map((cell, index) => cell === '' ? index : -1).filter(index => index !== -1);
            move = availableCells[Math.floor(Math.random() * availableCells.length)];
        }
        
        // Realizar movimiento de la máquina
        makeMove(move, 'O');
        
        // Verificar si la máquina ganó
        if (checkWinner('O')) {
            messageElement.textContent = '¡La máquina ganó!';
            gameActive = false;
            highlightWinningCells();
            return;
        }
        
        // Verificar empate
        if (checkDraw()) {
            messageElement.textContent = '¡Empate!';
            gameActive = false;
            return;
        }
        
        // Cambiar turno al jugador
        currentPlayer = 'X';
        updateTurnIndicator();
        messageElement.textContent = 'Tu turno';
    }
    
    // Función para encontrar un movimiento ganador
    function findWinningMove(player) {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (board[a] === player && board[b] === player && board[c] === '') {
                return c;
            }
            if (board[a] === player && board[c] === player && board[b] === '') {
                return b;
            }
            if (board[b] === player && board[c] === player && board[a] === '') {
                return a;
            }
        }
        return -1;
    }
    
    // Función para realizar un movimiento
    function makeMove(index, player) {
        board[index] = player;
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        
        // Animación de aparición
        cell.style.transform = 'scale(0)';
        setTimeout(() => {
            cell.style.transform = 'scale(1)';
        }, 10);
    }
    
    // Función para verificar si hay un ganador
    function checkWinner(player) {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (board[a] === player && board[b] === player && board[c] === player) {
                return true;
            }
        }
        return false;
    }
    
    // Función para verificar empate
    function checkDraw() {
        return board.every(cell => cell !== '');
    }
    
    // Función para resaltar las celdas ganadoras
    function highlightWinningCells() {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
                document.querySelector(`.cell[data-index="${a}"]`).classList.add('winning-cell');
                document.querySelector(`.cell[data-index="${b}"]`).classList.add('winning-cell');
                document.querySelector(`.cell[data-index="${c}"]`).classList.add('winning-cell');
                break;
            }
        }
    }
    
    // Función para actualizar el indicador de turno
    function updateTurnIndicator() {
        if (currentPlayer === 'X') {
            playerTurnDot.classList.add('active');
            aiTurnDot.classList.remove('active');
        } else {
            playerTurnDot.classList.remove('active');
            aiTurnDot.classList.add('active');
        }
    }
    
    // Función para reiniciar el juego
    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        updateTurnIndicator();
        messageElement.textContent = 'Tu turno. ¡Buena suerte!';
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning-cell');
            cell.style.transform = 'scale(1)';
        });
    }
    
    // Añadir event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
});