// Tetris implementation in vanilla JS
(() => {
	const BOARD_COLS = 10;
	const BOARD_ROWS = 20;
	const TILE = 30; // px, matches canvas 300x600
	const LEVEL_SPEED_MS = [1000, 820, 700, 600, 520, 460, 420, 380, 340, 300, 260, 220, 200, 180, 160];

	const COLORS = {
		I: '#35c3f3',
		J: '#4f81ff',
		L: '#ffa23a',
		O: '#ffd935',
		S: '#49e37a',
		T: '#b66dff',
		Z: '#ff5a79',
		G: '#10162a',
		GRID: '#121833',
		STROKE: 'rgba(0,0,0,0.25)'
	};

	const SHAPES = {
		I: [
			[[0,1],[1,1],[2,1],[3,1]],
			[[2,0],[2,1],[2,2],[2,3]],
			[[0,2],[1,2],[2,2],[3,2]],
			[[1,0],[1,1],[1,2],[1,3]]
		],
		J: [
			[[0,0],[0,1],[1,1],[2,1]],
			[[1,0],[2,0],[1,1],[1,2]],
			[[0,1],[1,1],[2,1],[2,2]],
			[[1,0],[1,1],[0,2],[1,2]]
		],
		L: [
			[[2,0],[0,1],[1,1],[2,1]],
			[[1,0],[1,1],[1,2],[2,2]],
			[[0,1],[1,1],[2,1],[0,2]],
			[[0,0],[1,0],[1,1],[1,2]]
		],
		O: [
			[[1,0],[2,0],[1,1],[2,1]],
			[[1,0],[2,0],[1,1],[2,1]],
			[[1,0],[2,0],[1,1],[2,1]],
			[[1,0],[2,0],[1,1],[2,1]]
		],
		S: [
			[[1,0],[2,0],[0,1],[1,1]],
			[[1,0],[1,1],[2,1],[2,2]],
			[[1,1],[2,1],[0,2],[1,2]],
			[[0,0],[0,1],[1,1],[1,2]]
		],
		T: [
			[[1,0],[0,1],[1,1],[2,1]],
			[[1,0],[1,1],[2,1],[1,2]],
			[[0,1],[1,1],[2,1],[1,2]],
			[[1,0],[0,1],[1,1],[1,2]]
		],
		Z: [
			[[0,0],[1,0],[1,1],[2,1]],
			[[2,0],[1,1],[2,1],[1,2]],
			[[0,1],[1,1],[1,2],[2,2]],
			[[1,0],[0,1],[1,1],[0,2]]
		]
	};

	// DOM
	const boardCanvas = document.getElementById('board');
	const nextCanvas = document.getElementById('next');
	const ctx = boardCanvas.getContext('2d');
	const nextCtx = nextCanvas.getContext('2d');
	const scoreEl = document.getElementById('score');
	const levelEl = document.getElementById('level');
	const linesEl = document.getElementById('lines');
	const highEl = document.getElementById('highscore');
	const startBtn = document.getElementById('start');
	const pauseBtn = document.getElementById('pause');
	const restartBtn = document.getElementById('restart');

	// State
	let grid = createGrid(BOARD_ROWS, BOARD_COLS);
	let currentPiece = null;
	let nextPiece = randomPiece();
	let dropInterval = LEVEL_SPEED_MS[0];
	let lastDrop = 0;
	let isRunning = false;
	let isPaused = false;
	let score = 0;
	let level = 1;
	let lines = 0;
	let high = Number(localStorage.getItem('tetris_high') || 0);
	updateStats();

	function createGrid(rows, cols) {
		return Array.from({ length: rows }, () => Array(cols).fill(null));
	}

	function randomPiece() {
		const keys = Object.keys(SHAPES);
		const type = keys[(Math.random() * keys.length) | 0];
		return { type, rot: 0, row: 0, col: 3 };
	}

	function getBlocks(piece) {
		const shape = SHAPES[piece.type][piece.rot];
		return shape.map(([x, y]) => ({ r: piece.row + y, c: piece.col + x }));
	}

	function canMove(piece, dr, dc, drot = 0) {
		const test = { ...piece, rot: (piece.rot + drot + 4) % 4, row: piece.row + dr, col: piece.col + dc };
		return getBlocks(test).every(({ r, c }) => r < BOARD_ROWS && c >= 0 && c < BOARD_COLS && (r < 0 || grid[r][c] === null));
	}

	function lockPiece(piece) {
		for (const { r, c } of getBlocks(piece)) {
			if (r < 0) { gameOver(); return; }
			grid[r][c] = piece.type;
		}
		const cleared = clearLines();
		if (cleared > 0) {
			const points = [0, 100, 300, 500, 800][cleared] * level;
			score += points;
			lines += cleared;
			const newLevel = 1 + Math.floor(lines / 10);
			if (newLevel !== level) {
				level = newLevel;
				dropInterval = LEVEL_SPEED_MS[Math.min(level - 1, LEVEL_SPEED_MS.length - 1)];
			}
			if (score > high) { high = score; localStorage.setItem('tetris_high', String(high)); }
			updateStats();
		}
		spawnNext();
	}

	function clearLines() {
		let cleared = 0;
		for (let r = BOARD_ROWS - 1; r >= 0; r--) {
			if (grid[r].every(cell => cell !== null)) {
				grid.splice(r, 1);
				grid.unshift(Array(BOARD_COLS).fill(null));
				cleared++;
				r++;
			}
		}
		return cleared;
	}

	function spawnNext() {
		currentPiece = nextPiece;
		currentPiece.row = -2; // spawn slightly above
		currentPiece.col = 3;
		nextPiece = randomPiece();
		drawNext();
		if (!canMove(currentPiece, 0, 0, 0)) {
			gameOver();
		}
	}

	function gameOver() {
		isRunning = false;
		isPaused = false;
		render();
		showOverlay('Game Over');
	}

	function showOverlay(text) {
		ctx.save();
		ctx.fillStyle = 'rgba(0,0,0,0.5)';
		ctx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);
		ctx.fillStyle = '#fff';
		ctx.font = 'bold 28px Segoe UI, Roboto, Arial';
		ctx.textAlign = 'center';
		ctx.fillText(text, boardCanvas.width / 2, boardCanvas.height / 2);
		ctx.restore();
	}

	function updateStats() {
		scoreEl.textContent = String(score);
		levelEl.textContent = String(level);
		linesEl.textContent = String(lines);
		highEl.textContent = String(high);
	}

	function drawCell(x, y, color) {
		const px = x * TILE;
		const py = y * TILE;
		ctx.fillStyle = color;
		ctx.fillRect(px, py, TILE, TILE);
		ctx.strokeStyle = COLORS.STROKE;
		ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
	}

	function render() {
		ctx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);
		// grid background cells
		for (let r = 0; r < BOARD_ROWS; r++) {
			for (let c = 0; c < BOARD_COLS; c++) {
				drawCell(c, r, grid[r][c] ? COLORS[grid[r][c]] : COLORS.GRID);
			}
		}
		// current piece
		if (currentPiece) {
			for (const { r, c } of getBlocks(currentPiece)) {
				if (r >= 0) drawCell(c, r, COLORS[currentPiece.type]);
			}
		}
	}

	function drawNext() {
		nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
		nextCtx.fillStyle = '#0b0f1f';
		nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
		const shape = SHAPES[nextPiece.type][0];
		const offsetX = 1;
		const offsetY = 1;
		for (const [x, y] of shape) {
			nextCtx.fillStyle = COLORS[nextPiece.type];
			nextCtx.fillRect((x + offsetX) * 24, (y + offsetY) * 24, 24, 24);
			nextCtx.strokeStyle = COLORS.STROKE;
			nextCtx.strokeRect((x + offsetX) * 24 + 0.5, (y + offsetY) * 24 + 0.5, 23, 23);
		}
	}

	function tick(timestamp) {
		if (!isRunning || isPaused) return;
		if (!lastDrop) lastDrop = timestamp;
		const delta = timestamp - lastDrop;
		if (delta >= dropInterval) {
			if (canMove(currentPiece, 1, 0)) {
				currentPiece.row += 1;
			} else {
				lockPiece(currentPiece);
			}
			lastDrop = timestamp;
		}
		render();
		requestAnimationFrame(tick);
	}

	function startGame() {
		grid = createGrid(BOARD_ROWS, BOARD_COLS);
		score = 0; level = 1; lines = 0; dropInterval = LEVEL_SPEED_MS[0];
		updateStats();
		currentPiece = null; nextPiece = randomPiece();
		spawnNext();
		isRunning = true; isPaused = false; lastDrop = 0;
		render();
		requestAnimationFrame(tick);
	}

	function togglePause() {
		if (!isRunning) return;
		isPaused = !isPaused;
		if (!isPaused) requestAnimationFrame(tick);
		render();
		if (isPaused) showOverlay('Paused');
	}

	function hardDrop() {
		if (!isRunning || isPaused) return;
		let distance = 0;
		while (canMove(currentPiece, distance + 1, 0)) distance++;
		currentPiece.row += distance;
		score += 2 * distance; // small bonus for hard drop
		updateStats();
		lockPiece(currentPiece);
		render();
	}

	// Controls
	window.addEventListener('keydown', (e) => {
		if (!isRunning || isPaused) {
			if (e.code === 'KeyP') { togglePause(); }
			if (e.code === 'Space' && !isRunning) { startGame(); }
			return;
		}
		switch (e.code) {
			case 'ArrowLeft': if (canMove(currentPiece, 0, -1)) { currentPiece.col--; render(); } break;
			case 'ArrowRight': if (canMove(currentPiece, 0, 1)) { currentPiece.col++; render(); } break;
			case 'ArrowDown': if (canMove(currentPiece, 1, 0)) { currentPiece.row++; score += 1; updateStats(); render(); } break;
			case 'ArrowUp': if (canMove(currentPiece, 0, 0, 1)) { currentPiece.rot = (currentPiece.rot + 1) % 4; render(); } break;
			case 'Space': hardDrop(); break;
			case 'KeyP': togglePause(); break;
		}
	});

	startBtn.addEventListener('click', startGame);
	pauseBtn.addEventListener('click', togglePause);
	restartBtn.addEventListener('click', startGame);

	// initial draw
	render();
	drawNext();
})();


