import React, { useState, useCallback, useRef } from 'react';
import produce from "immer"

const numRows = 50
const numCols = 50

const operations = [
	[-1, -1],
	[-1, 0],
	[-1, 1],
	[0, 1],
	[1, 1],
	[1, 0],
	[1, -1],
	[0, -1]
]

const generateEmptyGrid = () => {
	const rows = []
	for (let i = 0; i < numRows; i++) {
		rows.push(Array.from(Array(numCols), () => 0))
	}
	return rows
}

const App = () => {

	const [grid, setGrid] = useState(() => {
		return generateEmptyGrid()
	})

	const [running, setRunning] = useState(false)

	const runningRef = useRef(running)
	runningRef.current = running

	const runSimulation = useCallback(() => {
		if (!runningRef.current) {
			return;
		}

		setGrid(g => {
			return produce(g, gridCopy => {
				for (let i = 0; i < numRows; i++) {
					for (let j = 0; j < numCols; j++) {
						let neighbours = 0
						operations.forEach(([x, y]) => {
							const newI = i + x
							const newJ = j + y
							if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
								neighbours += g[newI][newJ]
							}
						})

						if (neighbours < 2 || neighbours > 3) {
							gridCopy[i][j] = 0
						} else if (g[i][j] === 0 && neighbours === 3) {
							gridCopy[i][j] = 1
						}
					}
				}
			})
		})

		setTimeout(runSimulation, 100)
	}, [])

	return (
		<>
			<button onClick={() => {
				setRunning(!running)
				if (!running) {
					runningRef.current = true
					runSimulation()
				}
			}}>
				{running ? "stop" : "start"}
			</button>
			<button onClick={() => {
				setGrid(generateEmptyGrid())
				setRunning(false)
			}}>
				clear
			</button>
			<button onClick={() => {
				const rows = []
				for (let i = 0; i < numRows; i++) {
					rows.push(Array.from(
						Array(numCols), () => Math.random() > 0.8 ? 1 : 0)
					)
				}
				setGrid(rows)
			}}>
				random
			</button>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: `repeat(${numCols}, 20px)`
				}}
			>
				{
					grid.map((rows, i) =>
						rows.map((col, j) =>
							<div
								key={`${i}-${j}`}
								onClick={() => {
									setGrid(produce(grid, gridCopy => {
										gridCopy[i][j] = grid[i][j] ? 0 : 1
									}))
								}}
								style={{
									width: 20,
									height: 20,
									backgroundColor: grid[i][j] ? "green" : undefined,
									border: "solid 1px black"
								}}
							/>
						)
					)
				}
			</div>
		</>
	)
}

export default App;
