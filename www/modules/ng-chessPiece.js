import * as ng from './ng.js'

class chessPiece extends ng.DOMElement {
    name
    color
    positionX
    positionY
    moveNum
    isCaptured = false
	steps

    constructor(name, color) {
        super("div", {
            class: color + name
        })
        this.name = name
        this.color = color
        this.moveNum = 0
    }

    /*
    place(s) {
        s.add(this)
        this.positionX = s.positionX
        this.positionY = s.positionY
    }*/
}

class BlackPawn extends chessPiece {
	constructor() {
		super("Pawn", "black")
	}
}

class WhitePawn extends chessPiece {
	constructor() {
		super("Pawn", "white")
	}
}

class BlackKing extends chessPiece {
	constructor() {
		super("King", "black")
	}
}

class WhiteKing extends chessPiece {
	constructor() {
		super("King", "white")
	}
}

class BlackKnight extends chessPiece {
	constructor() {
		super("Knight", "black")
	}
}

class WhiteKnight extends chessPiece {
	constructor() {
		super("Knight", "white")
	}
}

class BlackQueen extends chessPiece {
	constructor() {
		super("Queen", "black")
	}
}

class WhiteQueen extends chessPiece {
	constructor() {
		super("Queen", "white")
	}
}

class BlackBishop extends chessPiece {
	constructor() {
		super("Bishop", "black")
	}
}

class WhiteBishop extends chessPiece {
	constructor() {
		super("Bishop", "white")
	}
}

class BlackRook extends chessPiece {
	constructor() {
		super("Rook", "black")
	}
}

class WhiteRook extends chessPiece {
	constructor() {
		super("Rook", "white")
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
