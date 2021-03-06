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
			<React.Fragment key={i}>
				<Square
					value={props.squares[i]}
					onClick={() => props.onClick(i)}
				/>
			</React.Fragment>
		);
	}

	// this seems too convoluted
	let rows = new Array(3);
	for (let x = 0; x < 3; x += 1) {
		rows[x] = new Array(3);
		for (let y = 0; y < 3; y += 1) {
			rows[x][y] = renderSquare(x + y * 3);
		}
	}

	return (
		<div>
			{rows.map((currRow) => {
				return (<div className="board-row">
					{currRow.map((currSquare) => {
						return currSquare;
					})}
				</div>);
			})}
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

	let componentList = props.history.map((thisMove, thisMoveIndex) => {
		let newMove = {};
		try {
			newMove = findNewMove(props.history[thisMoveIndex - 1].squares, thisMove.squares);
		} catch(err) {
			newMove = null;
		}
		let desc = newMove ?
			newMove.player + ' at (' + newMove.x + ', ' + newMove.y + ')' :
			'Go to game start';

		if (thisMove.current) {
			desc = <b>{desc}</b>
		}

		return (
			<li key={thisMoveIndex}>
				<button onClick={() => props.jumpTo(thisMoveIndex)}>{desc}</button>
			</li>
		);
	})

	if (props.newestFirst) {
		componentList = componentList.slice().reverse();
	}

	return (<React.Fragment>
		<ToggleButton newestFirst={props.newestFirst} toggleOrder={props.toggleOrder} />
		<ol reversed={props.newestFirst}>{componentList}</ol>
		</React.Fragment>);
}

function ToggleButton(props) {
	const text = props.newestFirst ? '\u25b2 Newest' : '\u25bc Oldest';

	return (<button onClick={() => props.toggleOrder()}>{text}</button>);
}

class Game extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				current: true,
			}],
			stepNumber: 0,
			xIsNext: true,
			newestFirst: false,
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
						<div className="move-list">
							<MoveList
								history={history}
								jumpTo={move => this.jumpTo(move)}
								newestFirst={this.state.newestFirst}
								toggleOrder={() => this.setState({newestFirst: !this.state.newestFirst})} />
						</div>
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
		let newHistory = history.concat([{
			squares: squares,
			current: true,
		}]);
		newHistory[newHistory.length - 2].current = false;
		this.setState({
			history: newHistory,
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step) {
		let newHistory = this.state.history;
		newHistory[newHistory.length - 1].current = false;
		newHistory[step].current = true;
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
			history: newHistory
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
