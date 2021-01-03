import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

interface SquareProps {
    value: Play | null
    onClick: Function
}

function Square(props: SquareProps) {
    return (
        <button
            className="square"
            onClick={() => props.onClick()}
        >
            {props.value}
        </button>
    );
}

enum Play {
    X = '❌', O = '⭕'
}

interface BoardProps {
    squares: Squares,
    onClick: Function
}

type Squares = Array<Play | null>;

interface BoardState {
    squares: Squares,
    nextTurn: Play
}

class Board extends React.Component<BoardProps, BoardState> {

    renderSquare(i: number) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

interface GameProps {}

interface Turn {
    squares: Squares
}

interface GameState {
    history: Array<Turn>,
    stepNumber: number,
    nextTurn: Play
}

class Game extends React.Component<GameProps, GameState> {

    constructor(props: GameProps) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            nextTurn: Play.X,
        };
    }

    handleClick(i: number) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = [...current.squares];
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.nextTurn;
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            nextTurn: this.state.nextTurn === Play.X ? Play.O : Play.X
        });
    }

    jumpTo(step: number) {
        this.setState({
            stepNumber: step,
            nextTurn: (step % 2) === 0 ? Play.X : Play.O
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
                );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + this.state.nextTurn;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i: number) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

function calculateWinner(squares: Squares) {
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}