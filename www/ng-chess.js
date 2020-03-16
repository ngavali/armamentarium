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
	isCaptured = false

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
        this.positionY = s.positionY
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
        //this.has = undefined
		delete this.has
        return super.remove(c)
    }

    selectedEvent(selectEventHandler) {
        this.elem.onclick = () => {
            selectEventHandler(this)
        }
    }

    place(c) {
		/*
		 *	Get rid of this remove logic from here 
		 *	Have a Move class and let it take care of it

        let res = false
        if (this.has) {
			this.has.isCaptured = true
            res = this.remove(this.has)
        }
		*/
        this.has = c
        c.place(this)
        //return res
		return true
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
	lastMoveNum = 0
	Moves
	WhiteMoveTracker
	BlackMoveTracker
    MoveDisplay
    ErrorDisplay

    constructor(id) {
        super("div", {
            id: id,
            class: "chessboard"
        })
        this.id = id
        this.squares = new Array()
		this.Moves = new Array()
        //                                      this.helpBox = new HelpBox("helpBox")
		this.WhiteMoveTracker = new MoveTracker("whiteMoves", "White")
		this.BlackMoveTracker = new MoveTracker("blackMoves", "Black")
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

	getSquareAt(X, Y) {
		for ( let i = 0; i<this.squares.length; i++ ) {
			let square = this.squares[i]
			if ( square.positionX === X && square.positionY === Y ) {
				//console.log(`(${square.positionX}, ${square.positionY})`)
				return square
			}
		}
		return null
	}

    flip = () => {
        //let squares = new Array()
        let to = 0
        this.squares = this.squares.reverse()
        this.squares.map( item => {
			//use arrow function to allow this to pass on otherwise we need grab this into a variable and use here
            const m = () => {
				this.add(item)
            }
			//Animate the flip/rearrangement
            setTimeout(m, to)
            to += 4
        })
    }

    squareSelectedEvent(selectEventHandler) {
        this.squares.map(item => {
            item.selectedEvent(selectEventHandler)//, this.MoveDisplay)
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

class Move extends DOMElement {
	src
	dst
	srcPiece
	dstPiece
	playedBy
	isCaptured = ""

	constructor(playedBy, src, dst) {
		super()
		this.src = src
		this.dst = dst
		this.srcPiece = src.has
		this.dstPiece = dst.has
		this.playedBy = playedBy
		if ( dst.has !== undefined ) {
			this.isCaptured = "x"
		}
	}
}

class MoveTracker extends DOMElement {
	name
	value
	constructor(id, name) {
		super("div", {
			id: id,
			class: "moveTracker",
			disabled: true
		})
		this.name = name
		this.value = "<b>"+name+"</b>"
        this.elem.innerHTML = this.value
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
        //this.value = "<b>Moves: </b></br>"
		this.value = ""
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

	horizontalMoveValidator = (FromLocation, ToLocation) => {
		if ( FromLocation.positionY === ToLocation.positionY ) {
			let [src, dst] = FromLocation.positionX > ToLocation.positionX ? [ToLocation.positionX, FromLocation.positionX] : [FromLocation.positionX, ToLocation.positionX]
			for ( let p = src+1; p < dst; p++) {
				if (hasPiece(p, FromLocation.positionY)) {
					return false
				}
			}
		return true
		}
		return false
	}

	verticalMoveValidator = (FromLocation, ToLocation) => {
		if ( FromLocation.positionX === ToLocation.positionX ) {
			let [src, dst] = FromLocation.positionY > ToLocation.positionY ? [ToLocation.positionY, FromLocation.positionY] : [FromLocation.positionY, ToLocation.positionY]
			for ( let p = src+1; p < dst; p++) {
				if (hasPiece(FromLocation.positionX, p)) {
					return false
				}
			}
		return true
		}
		return false
	}

	diagonalMoveValidator = (FromLocation, ToLocation) => {
		if( !(Math.abs(ToLocation.positionX - FromLocation.positionX) === Math.abs(ToLocation.positionY - FromLocation.positionY)) ) {
			return false
		} //Illegal movement as in both direction
		return true
	}

	//Handle special case 2.c below in valid moves
	castlingMoveValidator = (FromLocation, ToLocation) => {
		if ( FromLocation.positionY === ToLocation.positionY ) {
			if ( 2 === Math.abs(FromLocation.positionX-ToLocation.positionX) ) {
				let rookX = (Math.round(ToLocation.positionX/7))*7+1
				let rookY = ToLocation.positionY
				let rookSquare = c.getSquareAt(rookX, rookY)
				let [src, dst] = FromLocation.positionX > rookX ? [rookX, FromLocation.positionX] : [FromLocation.positionX, rookX]
				for ( let p = src+1; p < dst; p++) {
					if (hasPiece(p, FromLocation.positionY)) {
						return false
					}
				}
				//If has rook and if not then it has moved and cannot castle
				//Nothing has ever moved from there position
				if ( rookSquare.has !== undefined && rookSquare.has.name === "Rook" && rookSquare.has.moveNum === 0 && FromLocation.moveNum === 0 ) {
					return true
				}
			}
		}
		return false
	}

	attachValidations = () => {
		c.whitePieces.map( whitePiece => {
			if ( whitePiece.name === "Queen" ) {
				whitePiece.validations = new Array(horizontalMoveValidator, verticalMoveValidator, diagonalMoveValidator)
			}
		})
	}

	attachValidations()

    ValidMoves = (From, To) => {
		let chessPiece = From.has
		//Todo
		//1. Any further scope of reusing the validations
		//2. Special cases:
		//	a. En passant	Pawn
		//	b. King under check
		//	c. Castling
		//3. Detect jump over in diagonal move

		//Diagonal		Queen, Bishop, King
		//Horizontal	Rook, King
		//Vertical		Rook, King
		//Forward-only 	Pawn
		
		//Pieces that share movement pattern and validations can be reused
		if (chessPiece.name === "Bishop") {
			//Todo
			//1. Validate if jumping over the pieces while moving diagonally
			
			//Moves Diagonally
			return diagonalMoveValidator(chessPiece, To)
		}
		if (chessPiece.name === "Rook") {
			//Todo

			//Move vertically, horizontally
			return verticalMoveValidator(chessPiece, To) || horizontalMoveValidator(chessPiece, To)
		}
		if (chessPiece.name === "Queen") {
			//Todo
			//1. Validate if jumping over the pieces while moving diagonally
			
			//Moves Horizontally, Vertically, Diagonally
			return verticalMoveValidator(chessPiece, To) || horizontalMoveValidator(chessPiece, To) || diagonalMoveValidator(chessPiece, To)
		}

		//Special Moves
		//
		//can be done using horizontal, vertical, and diagonal with one step but this is much simpler
		if (chessPiece.name === "King") {
			if (!(
				//Moves around one step
				(( chessPiece.positionY-1<= To.positionY && chessPiece.positionY+1 >= To.positionY ) 
					&& ( chessPiece.positionX-1 <= To.positionX && chessPiece.positionX+1 >= To.positionX )) ||
				(castlingMoveValidator(chessPiece, To))
				))
			{
				console.log("Invalid move")
				return false
			}
		}
		if (chessPiece.name === "Knight") {
			if ( 
				!(( chessPiece.positionX+2 === To.positionX || chessPiece.positionX-2 === To.positionX ) 
					&& (chessPiece.positionY+1 == To.positionY || chessPiece.positionY-1 == To.positionY))
				&& !(( chessPiece.positionX+1 === To.positionX || chessPiece.positionX-1 === To.positionX ) 
					&& (chessPiece.positionY+2 == To.positionY || chessPiece.positionY-2 == To.positionY))
			) {
				return false
			}
		}
        if (chessPiece.name === "Pawn") {
			//Todo
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

	//Handle moving pieces
	//Todo 
	//1. Move tracking to some class
    movePiece = (From, To) => {
		//Todo
		//do Castling		King, Rook
		//do enpassant		Pawns
        const Ex = {
            true: "x",
            false: ""
        }
        if (isValidMove(From, To)) {
			c.Moves.push(new Move(player[whoPlayes], From, To))
			//c.MoveDisplay.value = "<b>Moves: </b>"
			let move = c.Moves[c.lastMoveNum]
			if ( move.playedBy === "white" ) {
				c.WhiteMoveTracker.refresh(c.WhiteMoveTracker.value + "</br>" + (c.lastMoveNum+1) + "." + aliases[move.src.has.name] + move.isCaptured + horAxis[move.dst.positionX-1] + move.dst.positionY)
			} else {
				c.BlackMoveTracker.refresh(c.BlackMoveTracker.value + "</br>" + (c.lastMoveNum+1) + "." + aliases[move.src.has.name] + move.isCaptured + horAxis[move.dst.positionX-1] + move.dst.positionY)
			}
            //c.MoveDisplay.refresh(c.MoveDisplay.value + "</br>" + (c.lastMoveNum+1) + "." + move.playedBy + " played " + aliases[move.src.has.name] + move.isCaptured + horAxis[move.dst.positionX] + move.dst.positionY)
			//Todo
			//1. Handle special cases mentioned above
			//2. Handle moving pieces
			
			//Handle normal move
            //if (From.has != undefined) {
			let isEx = false
			From.has.moveNum++
			c.lastMoveNum++

			//Normal Move!!!
				//Capture piece
				//If To has a chessPiece then remove it
				if ( To.has !== undefined ) {
					To.remove(To.has)
					isEx = true
				}
                To.place(From.has)
                //From.has.place(To)
                From.remove(From.has)
                //c.MoveDisplay.refresh(c.MoveDisplay.value + " " + aliases[To.has.name] + Ex[isEx] + horAxis[To.positionX] + To.positionY)
                return true
            //}
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
                    if (selectedSquareObject.has!== undefined && selectedSquare.has.color === selectedSquareObject.has.color) {
                        selectedSquare.unselect()
                        selectedSquare = selectedSquareObject
                        selectedSquareObject.select()
                        c.ErrorDisplay.refresh(`${player[whoPlayes].charAt(0).toUpperCase()+player[whoPlayes].slice(1)} plays...`)
                    }
                    return
                }
                whoPlayes = !whoPlayes //Switch players is move has been made
                moved = false
                c.flip()
				/*
				c.whitePieces.map( item => {
					console.log(item)
				})
				c.blackPieces.map( item => {
					console.log(item)
				})*/
            }
            c.ErrorDisplay.refresh(`${player[whoPlayes].charAt(0).toUpperCase()+player[whoPlayes].slice(1)} plays...`)
            selectedSquare.unselect()
			//delete selectedSquare
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
	c.MoveDisplay.add(c.WhiteMoveTracker)
	c.MoveDisplay.add(c.BlackMoveTracker)
    //Attach click events to squares
    c.squareSelectedEvent(selectEventHandler)
    console.log("App created...")

}

myApp()
