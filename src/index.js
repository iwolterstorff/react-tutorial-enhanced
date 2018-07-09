import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
	return (
			<button className="square" onClick={props.onClick}>
				{props.value}
			</button>
	);
}

function Board(props) {

	function renderSquare(i) {
		return (
			<Square
				value={props.squares[i]}
				onClick={() => props.onClick(i)}
			/>
		);
	}

	return (
		<div>
			<div className="board-row">
				{renderSquare(0)}
				{renderSquare(1)}
				{renderSquare(2)}
			</div>
			<div className="board-row">
				{renderSquare(3)}
				{renderSquare(4)}
				{renderSquare(5)}
			</div>
			<div className="board-row">
				{renderSquare(6)}
				{renderSquare(7)}
				{renderSquare(8)}
			</div>
		</div>
	);
}

function Status(props) {

	let status;

	if (props.winner) {
		status = 'Winner: ' + props.winner;
	} else {
		status = 'Next player: ' + (props.xIsNext ? 'X' : 'O');
	}

	return (
		<div>{status}</div>
	);
}

function MoveList(props) {

	return (<ol>{props.history.map((thisMove, thisMoveIndex) => {
		let newMove = {};
		try {
			newMove = findNewMove(props.history[thisMoveIndex - 1].squares, thisMove.squares);
		} catch(err) {
			newMove = null;
		}
		const desc = newMove ?
			newMove.player + ' at (' + newMove.x + ', ' + newMove.y + ')' :
			'Go to game start';

		return (
			<li key={thisMoveIndex}>
				<button onClick={() => props.jumpTo(thisMoveIndex)}>{desc}</button>
			</li>
		);
	})}</ol>);
}

class Game extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			stepNumber: 0,
			xIsNext: true,
		};
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];

		return (
				<div className="game">
					<div className="game-board">
						<Board
							squares={current.squares}
							onClick={i => this.handleClick(i)}
						/>
					</div>
					<div className="game-info">
						<Status winner={calculateWinner(current.squares)} xIsNext={this.state.xIsNext} />
						<MoveList history={history} jumpTo={move => this.jumpTo(move)} />
					</div>
				</div>
		);
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i += 1) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

// Array-of-Squares Array-of-Squares -> coord object
function findNewMove(secondLastSquares, lastSquares) {
	let newSquares = {};
	lastSquares.forEach((square, index) => {
		if (square !== secondLastSquares[index]) {
			newSquares = {
				player: square,
				x: index % 3 + 1,
				y: Math.floor(index / 3) + 1,
			};
		}
	});
	return newSquares;
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
	);
