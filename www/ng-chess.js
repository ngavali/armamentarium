const aliases = {
    "Pawn": "",
    "Rook": "R",
    "Queen": "Q",
    "King": "K",
    "Bishop": "B",
    "Knight": "N"
}

class chessPiece extends DOMElement {
    name
    color
    positionX
    positionY
	moveNum

    constructor(name, color) {
        super("div", {
            class: color + name
        })
        this.name = name
        this.color = color
		this.moveNum = 0
    }

    place(s) {
        s.add(this)
        this.positionX = s.positionX
        //parseInt(s.position.slice(0),10)
        this.positionY = s.positionY
        //parseInt(s.position.slice(1),10)
    }

}

class Square extends DOMElement {
    color
    position
    isSelected
    has
    positionX
    positionY

    constructor(id, color, X, Y) {
        super("div", {
            "id": "square#" + id,
            "class": color + "Square"
        })
        this.color = color
        this.isSelected = false
        this.positionX = X
        this.positionY = Y
    }

    add(c) {
        this.has = c

        super.add(c)
    }

    remove(c) {
        this.has = undefined
        return super.remove(c)
    }

    selectedEvent(selectEventHandler) {
        this.elem.onclick = () => {
            selectEventHandler(this)
        }
    }

    place(c) {
        let res = false
        if (this.has) {
            res = this.remove(this.has)
        }
        this.has = c
        c.place(this)
        return res
    }

    select() {
        this.isSelected = !this.isSelected
        this.refresh({
            class: this.color + "SquareSelected"
        })
    }

    unselect() {
        this.isSelected = !this.isSelected
        this.refresh({
            class: this.color + "Square"
        })
    }
}

class Chessboard extends DOMElement {
    id
    squares
    blackPieces
    whitePieces
    helpBox
    MoveDisplay
    ErrorDisplay

    constructor(id) {
        super("div", {
            id: id,
            class: "chessboard"
        })
        this.id = id
        this.squares = new Array()
        //                                      this.helpBox = new HelpBox("helpBox")
        this.MoveDisplay = new MoveDisplay("stepDisplay")
        this.ErrorDisplay = new ErrorDisplay("errorDisplay")
        let c = ["white", "black"]
        //Add squares to chessboard in right order, let css take care of placement.
        for (let i = 7; i >= 0; i--) {
            for (let j = 1; j <= 8; j++) {
                this.squares.push(new Square(i * 8 + j, c[(j + i % 2) % 2], j, i + 1))
            }
        }
        this.blackPieces = new Array()
        this.whitePieces = new Array()

        this.blackPieces.push(new chessPiece("Rook", "black"))
        this.blackPieces.push(new chessPiece("Knight", "black"))
        this.blackPieces.push(new chessPiece("Bishop", "black"))
        this.blackPieces.push(new chessPiece("Queen", "black"))
        this.blackPieces.push(new chessPiece("King", "black"))
        this.blackPieces.push(new chessPiece("Bishop", "black"))
        this.blackPieces.push(new chessPiece("Knight", "black"))
        this.blackPieces.push(new chessPiece("Rook", "black"))
        this.blackPieces.push(new chessPiece("Pawn", "black"))
        this.blackPieces.push(new chessPiece("Pawn", "black"))
        this.blackPieces.push(new chessPiece("Pawn", "black"))
        this.blackPieces.push(new chessPiece("Pawn", "black"))
        this.blackPieces.push(new chessPiece("Pawn", "black"))
        this.blackPieces.push(new chessPiece("Pawn", "black"))
        this.blackPieces.push(new chessPiece("Pawn", "black"))
        this.blackPieces.push(new chessPiece("Pawn", "black"))

        this.whitePieces.push(new chessPiece("Pawn", "white"))
        this.whitePieces.push(new chessPiece("Pawn", "white"))
        this.whitePieces.push(new chessPiece("Pawn", "white"))
        this.whitePieces.push(new chessPiece("Pawn", "white"))
        this.whitePieces.push(new chessPiece("Pawn", "white"))
        this.whitePieces.push(new chessPiece("Pawn", "white"))
        this.whitePieces.push(new chessPiece("Pawn", "white"))
        this.whitePieces.push(new chessPiece("Pawn", "white"))
        this.whitePieces.push(new chessPiece("Rook", "white"))
        this.whitePieces.push(new chessPiece("Knight", "white"))
        this.whitePieces.push(new chessPiece("Bishop", "white"))
        this.whitePieces.push(new chessPiece("Queen", "white"))
        this.whitePieces.push(new chessPiece("King", "white"))
        this.whitePieces.push(new chessPiece("Bishop", "white"))
        this.whitePieces.push(new chessPiece("Knight", "white"))
        this.whitePieces.push(new chessPiece("Rook", "white"))

    }

    add(component) {
        super.add(component)
    }

    initialize() {

        //Render squares
        this.squares.map(item => {
            this.add(item)
        })
        //No action defined yet
        this.elem.onclick = () => {}

        //Place black pieces
        this.blackPieces.map((item, k) => {
            item.place(this.squares[k])
        })
        //Place white pieces
        this.whitePieces.map((item, k) => {
            item.place(this.squares[k + 48])
        })

    }

    flip = () => {
        this.ErrorDisplay.refresh("Flipping...")
        const a = this
        let squares = new Array()
        let to = 0
        this.square = this.squares.reverse()
        this.squares.map(item => {
            const m = function() {
				a.add(item)
            }
            setTimeout(m, to)
            to += 1
        })
    }

    squareSelectedEvent(selectEventHandler) {
        this.squares.map(item => {
            item.selectedEvent(selectEventHandler, this.MoveDisplay)
        })
    }
}

class HelpBox extends DOMElement {

    value

    constructor(id) {
        super("div", {
            id: id,
            class: "helpBox",
            disabled: true
        })
        this.value = "Click to select or unselect square"
        this.elem.innerHTML = this.value
    }

    add(c) {
        super.add(c)
    }
}

class ErrorDisplay extends DOMElement {

    value

    constructor(id) {
        super("div", {
            id: id,
            class: "errorDisplay",
            disabled: true
        })
        this.value = "White plays ... Click to select or unselect square"
        this.elem.innerHTML = this.value
    }

    add(c) {
        super.add(c)
    }

    refresh(step) {
        this.value = step
        this.elem.innerHTML = this.value
    }

}

class MoveDisplay extends DOMElement {

    value

    constructor(id) {
        super("div", {
            id: id,
            class: "moveDisplay",
            disabled: true
        })
        this.value = "<b>Moves: </b>"
        this.elem.innerHTML = this.value
    }

    add(c) {
        super.add(c)
    }

    refresh(step) {
        this.value = step
        this.elem.innerHTML = this.value
    }

}

const myApp = () => {

	ChessApp = new DOMElement("div")
	ChessApp.elem = document.getElementById("ChessApp")

    console.log("Creating app...")

    const c = new Chessboard("ChessBoard")
    //const selectedSquare = new Array()
    let selectedSquare
    let player = {
        true: "white",
        false: "black"
    }
    let whoPlayes = true
    let moved = false
    let horAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const squareColor = {
        false: "Square",
        true: "SquareSelected"
    }

	hasPiece = (X, Y) => {
		for ( let i = 0; i < c.squares.length; i++ ) {
			square = c.squares[i]
			if ( ( square.positionX === X && square.positionY === Y ) && ( square.has !== undefined ) ) {
				return true 
			}
		}
	}

    ValidMoves = (From, To) => {
		let chessPiece = From.has
		//To be done
		//Refactor to reuse validations
		//Diagonal		Queen, Bishop, King
		//Horizontal	Rook, King
		//Vertical		Rook, King
		//Forward-only 	Pawn
		//Special cases:
		//En passant	Pawn
		//Castling		King, Rook
		//King under check
		
		if (chessPiece.name === "Queen") {
			//To be done
			//1. Validate if jumping over the pieces while moving diagonally
			//Move vertical
			if ( chessPiece.positionX === To.positionX ) {
				let [src, dst] = chessPiece.positionY > To.positionY ? [To.positionY, chessPiece.positionY] : [chessPiece.positionY, To.positionY]
				for ( let p = src+1; p < dst; p++) {
					if (hasPiece(chessPiece.positionX, p)) {
						return false
					}
				}
			} //If not vertical then Move horizontal
			else if ( chessPiece.positionY === To.positionY ) {
				let [src, dst] = chessPiece.positionX > To.positionX ? [To.positionX, chessPiece.positionX] : [chessPiece.positionX, To.positionX]
				for ( let p = src+1; p < dst; p++) {
					if (hasPiece(p, chessPiece.positionY)) {
						return false
					}
				}
			} //Diagonal move
			else if( Math.abs(To.positionX - chessPiece.positionX) === Math.abs(To.positionY - chessPiece.positionY)) {
				console.log("Moved diagonal")	
			} //Illegal movement as in both direction
			else {
				return false
			}
		}
		if (chessPiece.name === "Bishop") {
			//To be done
			//1. Validate if jumping over the pieces while moving diagonally
			if( Math.abs(To.positionX - chessPiece.positionX) === Math.abs(To.positionY - chessPiece.positionY)) {
				console.log("Moved diagonal")	
			} //Illegal movement as in both direction
			else {
				return false
			}
		}
		if (chessPiece.name === "King") {
			if (
				//Moves around one step
				!(( chessPiece.positionY-1<= To.positionY && chessPiece.positionY+1 >= To.positionY ) && ( chessPiece.positionX-1 <= To.positionX && chessPiece.positionX+1 >= To.positionX ) )
			) {
				console.log("Invalid move")
				return false
			}
			return true
		}
        if (chessPiece.name === "Pawn") {
			//To be done
			//1. En Passant
            const moveStep = {
                "white": 1,
                "black": -1
            }
            if (   !(To.has === undefined && (chessPiece.positionY + moveStep[chessPiece.color] === To.positionY) && chessPiece.positionX === To.positionX)
				//Moves forward
				&& !(((chessPiece.positionX+1 === To.positionX) || (chessPiece.positionX-1 === To.positionX)) && chessPiece.positionY+moveStep[chessPiece.color] === To.positionY && To.has !== undefined)
				//Captures another piece
				&& !(chessPiece.moveNum === 0 && (chessPiece.positionY+moveStep[chessPiece.color]*2 === To.positionY && chessPiece.positionX === To.positionX))	
				//Is a First move
			) {
				console.log("Invalid move")
                return false
            }
			chessPiece.moveNum++
        }
		if (chessPiece.name === "Rook") {
			//To be done
			//Move vertical
			if ( chessPiece.positionX === To.positionX ) {
				let [src, dst] = chessPiece.positionY > To.positionY ? [To.positionY, chessPiece.positionY] : [chessPiece.positionY, To.positionY]
				for ( let p = src+1; p < dst; p++) {
					if (hasPiece(chessPiece.positionX, p)) {
						return false
					}
				}
			} //If not vertical then Move horizontal
			else if ( chessPiece.positionY === To.positionY ) {
				let [src, dst] = chessPiece.positionX > To.positionX ? [To.positionX, chessPiece.positionX] : [chessPiece.positionX, To.positionX]
				for ( let p = src+1; p < dst; p++) {
					if (hasPiece(p, chessPiece.positionY)) {
						return false
					}
				}
			} //Illegal movement as in both direction
			else {
				return false
			}
		}
        return true
    }

    isValidMove = (From, To) => {
        //To be implemented
        if (!ValidMoves(From, To)) {
            return false
        }
        if (To.has !== undefined) {
            if (From.has.color === To.has.color) {
                return false
            }
        }
        return true
    }

    movePiece = (From, To) => {
        Ex = {
            true: "x",
            false: ""
        }
        if (isValidMove(From, To)) {
            if (From.has != undefined) {
                isEx = To.place(From.has)
                //From.has.place(To)
                From.remove(From.has)
                c.MoveDisplay.refresh(c.MoveDisplay.value + " " + aliases[To.has.name] + Ex[isEx] + horAxis[To.positionX] + To.positionY)
                return true
            }
        }
        c.ErrorDisplay.refresh("<error>Illegal Move!!!</error>")
        return false
    }

    //Event handler onClick for squares on chessboard
    selectEventHandler = (selectedSquareObject) => {
        //Allow move if only a square with piece has been selected
        if (selectedSquare !== undefined) {
            //Not a same square
            if (selectedSquare !== selectedSquareObject) {
                moved = movePiece(selectedSquare, selectedSquareObject)
                if (!moved) { //Either illegal move, retain selection unless unselected.
                    //selectedSquare.unselect()
                    if (selectedSquare.has.color === selectedSquareObject.has.color) {
                        selectedSquare.unselect()
                        selectedSquare = selectedSquareObject
                        selectedSquareObject.select()
                        c.ErrorDisplay.refresh(player[whoPlayes].charAt(0).toUpperCase() + player[whoPlayes].slice(1) + " plays...")
                    }
                    return
                }
                whoPlayes = !whoPlayes //Switch players is move has been made
                moved = false
                c.flip()
            }
            c.ErrorDisplay.refresh(player[whoPlayes].charAt(0).toUpperCase() + player[whoPlayes].slice(1) + " plays...")
            selectedSquare.unselect()
            selectedSquare = undefined //unselect square now
            return
        }
        //Allow select only square which has a piece
        if (selectedSquareObject.has !== undefined && selectedSquareObject.has.color === player[whoPlayes]) {
            selectedSquare = selectedSquareObject
            selectedSquareObject.select()
        }
    }

    c.initialize()
    ChessApp.add(c)
    ChessApp.add(c.ErrorDisplay)
    ChessApp.add(c.MoveDisplay)
    //document.body = ChessApp.elem
    //Attach click events to squares
    c.squareSelectedEvent(selectEventHandler)
    console.log("App created...")

    //document.body.appendChild(c.elem)
    //documentChessApp.add({ elem: document.createElement("div")})

}

myApp()
