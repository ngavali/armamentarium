import * as ng from './ng.js'
import * as chesspiece from './ng-chessPiece.js'

const aliases = {
    "Pawn": "",
    "Rook": "R",
    "Queen": "Q",
    "King": "K",
    "Bishop": "B",
    "Knight": "N"
}

class Square extends ng.DOMElement {
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
        //this.elem.addEventListener("click", () => { console.log(this); selectEventHandler(this) }, true)
        this.elem.onclick = () => {
            selectEventHandler(this)
        }
    }

    place(c) {
        /*
         *      Get rid of this remove logic from here
         *      Have a Move class and let it take care of it

         let res = false
         if (this.has) {
         this.has.isCaptured = true
         res = this.remove(this.has)
         }
         */
        this.has = c
            this.has.positionX = this.positionX
            this.has.positionY = this.positionY
            this.add(c)
            //c.place(this)
            //return res
            return true
    }

    hasPiece() {
        return this.has !== undefined ? true : false
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

class Chessboard extends ng.DOMElement {
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

    this.blackPieces.push(new chesspiece.BlackRook())
    this.blackPieces.push(new chesspiece.BlackKnight())
    this.blackPieces.push(new chesspiece.BlackBishop())
    this.blackPieces.push(new chesspiece.BlackQueen())
    this.blackPieces.push(new chesspiece.BlackKing())
    this.blackPieces.push(new chesspiece.BlackBishop())
    this.blackPieces.push(new chesspiece.BlackKnight())
this.blackPieces.push(new chesspiece.BlackRook())

    this.blackPieces.push(new chesspiece.BlackPawn())
    this.blackPieces.push(new chesspiece.BlackPawn())
    this.blackPieces.push(new chesspiece.BlackPawn())
    this.blackPieces.push(new chesspiece.BlackPawn())
    this.blackPieces.push(new chesspiece.BlackPawn())
    this.blackPieces.push(new chesspiece.BlackPawn())
    this.blackPieces.push(new chesspiece.BlackPawn())
this.blackPieces.push(new chesspiece.BlackPawn())

    this.whitePieces.push(new chesspiece.WhitePawn())
    this.whitePieces.push(new chesspiece.WhitePawn())
    this.whitePieces.push(new chesspiece.WhitePawn())
    this.whitePieces.push(new chesspiece.WhitePawn())
    this.whitePieces.push(new chesspiece.WhitePawn())
    this.whitePieces.push(new chesspiece.WhitePawn())
    this.whitePieces.push(new chesspiece.WhitePawn())
this.whitePieces.push(new chesspiece.WhitePawn())

    this.whitePieces.push(new chesspiece.WhiteRook())
    this.whitePieces.push(new chesspiece.WhiteKnight())
    this.whitePieces.push(new chesspiece.WhiteBishop())
    this.whitePieces.push(new chesspiece.WhiteQueen())
    this.whitePieces.push(new chesspiece.WhiteKing())
    this.whitePieces.push(new chesspiece.WhiteBishop())
    this.whitePieces.push(new chesspiece.WhiteKnight())
this.whitePieces.push(new chesspiece.WhiteRook())

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
    this.blackPieces.map((piece, k) => {
            this.squares[k].place(piece)
            })
    //Place white pieces
    this.whitePieces.map((piece, k) => {
            this.squares[k + 48].place(piece)
            })

}

/*
   hasPiece = (X, Y) => {
   for ( let i = 0; i < c.squares.length; i++ ) {
   square = c.squares[i]
   if ( ( square.positionX === X && square.positionY === Y ) && square.hasPiece() ) {
   return true
   }
   }
   }*/

getSquareAt(X, Y) {
    for (let i = 0; i < this.squares.length; i++) {
        let square = this.squares[i]
            if (square.positionX === X && square.positionY === Y) {
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
        this.squares.map(item => {
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
            item.selectedEvent(selectEventHandler) //, this.MoveDisplay)
    })
}

}

class HelpBox extends ng.DOMElement {

    value

        constructor(id) {
            super("div", {
id: id,
class: "helpBox",
disabled: true
})
this.value = "Click square to move or release piece"
this.elem.innerHTML = this.value
}

add(c) {
    super.add(c)
}

}

class ErrorDisplay extends ng.DOMElement {

    value

        constructor(id) {
            super("div", {
id: id,
class: "errorDisplay",
disabled: true
})
this.value = "White plays, click square to move or release piece"
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

class Move extends ng.DOMElement {
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
                if (dst.hasPiece()) {
                    this.isCaptured = "x"
                }
        }

    do(cboard, options) {
        let From = this.src
            let To = this.dst
            From.has.moveNum++
            From.has.steps = Math.abs(To.positionY-From.positionY)
            //Normal Move!!!
            //Capture piece
            //If To has a chessPiece then remove it
            if (this.isCaptured) {
                To.remove(To.has)
            }
        //perform the movement
        To.place(From.has)
            From.remove(From.has)

            //Additional step for special moves
            //1. Castling   Rook movement
            //To be done 2. Enpassant???? piece removal
            if (options.isCastling) {
                let rookX = (Math.round(To.positionX / 7)) * 7 + 1
                    let rookY = To.positionY
                    let srcRookSquare = cboard.getSquareAt(rookX, rookY)
                    //console.log(`${From.positionX}, ${To.positionX}, ${(From.positionX+To.positionX)/2}`)
                    let destRookSquare = cboard.getSquareAt((From.positionX + To.positionX) / 2, rookY)
                    destRookSquare.place(srcRookSquare.has)
                    srcRookSquare.remove(srcRookSquare.has)
            }
        //From.has.place(To)
    }

}

class MoveTracker extends ng.DOMElement {
    name
        value
        constructor(id, name) {
            super("div", {
id: id,
class: "moveTracker",
disabled: true
})
this.name = name
this.value = "" + name + ""
this.elem.innerHTML = this.value
}

refresh(step) {
    this.value = step
        this.elem.innerHTML = this.value
}
}

class MoveDisplay extends ng.DOMElement {

    value
    
constructor(id) {
super("div", {
id: id,
class: "moveDisplay",
disabled: true
})
//this.value = "Moves: "
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

    let ChessApp = new ng.DOMElement("div")
        ChessApp.elem = document.getElementById("ChessApp")

        //console.log("Creating app...")

        const c = new Chessboard("ChessBoard")
        //const selectedSquare = new Array()
        let selectedSquare
        let isCastling = false
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

const isValidMove = (cboard, move) => { 
    let From = move.src
    let To = move.dst

    //If destination is of same color return immediately
    if (To.hasPiece() && From.has.color === To.has.color) {
        return false
    }

    let chessPiece = From.has
    return chessPiece.ValidateMove(cboard, move)
}

    /*
       let attachValidations = () => {
       c.whitePieces.map(whitePiece => {
       if (whitePiece.name === "Queen") {
       whitePiece.validations = new Array(horizontalMoveValidator, verticalMoveValidator, diagonalMoveValidator)
       }
       })
       }

       attachValidations()
     */
    //Handle moving pieces
    //Todo
    //1. Move tracking to some class
    const movePiece = (From, To) => {
        //Todo
        //do Castling           King, Rook
        //do enpassant          Pawns
        let move = new Move(player[whoPlayes], From, To)

            if (isValidMove(c, move)) {
                //c.MoveDisplay.value = "Moves: "
                //let move = c.Moves[c.lastMoveNum]
                //Todo
                //1. Handle special cases mentioned above
                //2. Handle moving pieces

                let sym = "O-O" //Kingside castling...
                    let moveTracker = {
                        "white": c.WhiteMoveTracker,
                        "black": c.BlackMoveTracker
                    }

if (!isCastling) {
                moveTracker[move.playedBy].refresh(moveTracker[move.playedBy].value + "</br>" + (c.lastMoveNum + 1) + "." + aliases[move.src.has.name] + move.isCaptured + horAxis[move.dst.positionX - 1] + move.dst.positionY)
            } else {
                if ((From.positionX + To.positionX) / 2 === 4) {
                    //Queenside castling...
                    sym += "-O"
                }
                moveTracker[move.playedBy].refresh(moveTracker[move.playedBy].value + "</br>" + (c.lastMoveNum + 1) + "." + sym)
            }

                move.do(c, {
isCastling: isCastling
})
if (isCastling) {
    isCastling = !isCastling
}
c.Moves.push(move)
    c.lastMoveNum++
    //c.MoveDisplay.refresh(c.MoveDisplay.value + " " + aliases[To.has.name] + Ex[isEx] + horAxis[To.positionX] + To.positionY)
    return true
    //}
    }
//Illegal move
c.ErrorDisplay.refresh("Illegal Move!!!")
return false
}

//Event handler onClick for squares on chessboard
let selectEventHandler = (selectedSquareObject) => {
    //Allow move if only a square with piece has been selected
    if (selectedSquare !== undefined) {
        //Not a same square
        if (selectedSquare !== selectedSquareObject) {
            moved = movePiece(selectedSquare, selectedSquareObject)
                if (!moved) { //Either illegal move, retain selection unless unselected.
                    //selectedSquare.unselect()
                    if (selectedSquareObject.hasPiece() && selectedSquare.has.color === selectedSquareObject.has.color) {
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
    if (selectedSquareObject.hasPiece() && selectedSquareObject.has.color === player[whoPlayes]) {
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
    //console.log("App created...")

    }

myApp();
