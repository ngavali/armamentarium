import * as ng from './ng.js'
import * as moveValidator from './ng-move.js'

class chessPiece extends ng.DOMElement {
    name
    color
    positionX
    positionY
    moveNum
    isCaptured = false
	steps
    validators

    constructor(name, color, validators = []) {
        super("div", {
            class: color + name
        })
        this.name = name
        this.color = color
        this.moveNum = 0    
        //console.log(this.name, validators)
        this.validators = validators
    }

    ValidateMove(cboard, move) {
        //console.log("validator called for ", this.name, this.color)
        let result = false
        if ( this.validators.length > 0 ) {
            this.validators.forEach( function(validator) {
                result ||= validator(cboard, move.src.has, move.dst)
            })
            return result
        }   else {
            return true
        }
    }

    /*
    place(s) {
        s.add(this)
        this.positionX = s.positionX
        this.positionY = s.positionY
    }*/
}

class Pawn extends chessPiece {
    constructor(color) {
        super("Pawn", color, [moveValidator.checkEnpassant, moveValidator.checkSingleStep])
    }
}

class BlackPawn extends Pawn {
	constructor() {
		super("black")
	}
}

class WhitePawn extends Pawn {
	constructor() {
		super("white")
	}
}

class King extends chessPiece {
    constructor(color) {
        //super("King", color,[moveValidator.castlingMoveValidator, moveValidator.checkSingleStep])
        super("King", color,[moveValidator.castlingMoveValidator, moveValidator.kingsMoveValidator])
    }
}

class BlackKing extends King {
	constructor() {
		super("black")
	}
}

class WhiteKing extends King {
	constructor(color) {
		super("white")
	}
}

class Knight extends chessPiece {
    constructor(color) {
        super("Knight", color, [moveValidator.knightStepValidator])
    }
}

class BlackKnight extends Knight {
	constructor() {
		super("black")
	}
}

class WhiteKnight extends Knight {
	constructor() {
		super("white")
	}
}

class Queen extends chessPiece {
    constructor(color) {
        super("Queen", color, [moveValidator.diagonalMoveValidator, moveValidator.verticalMoveValidator, moveValidator.horizontalMoveValidator])
    }
}

class BlackQueen extends Queen {
	constructor() {
		super("black")
	}
}

class WhiteQueen extends Queen {
	constructor() {
		super("white")
	}
}

class Bishop extends chessPiece {
    constructor(color) {
        super("Bishop", color, [moveValidator.diagonalMoveValidator])
    }
}

class BlackBishop extends Bishop {
	constructor() {
		super("black")
	}
}

class WhiteBishop extends Bishop {
	constructor() {
		super("white")
	}
}

class Rook extends chessPiece {
    constructor(color) {
        super("Rook", color, [moveValidator.verticalMoveValidator, moveValidator.horizontalMoveValidator])
    }
}

class BlackRook extends Rook {
	constructor() {
		super("black")
	}
}

class WhiteRook extends Rook {
	constructor() {
		super("white")
	}
}

/*
let  chessPieceFactory("color") {

	let blackPieceFactory(name) {
	}

	let whitePieceFactory(name) {
	}
}
*/

export { WhitePawn, BlackPawn, WhiteQueen, BlackQueen, WhiteRook, BlackRook, WhiteBishop, BlackBishop, WhiteKing, BlackKing, WhiteKnight, BlackKnight  }
