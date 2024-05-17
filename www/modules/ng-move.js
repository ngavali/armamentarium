const horizontalMoveValidator = (cboard, FromLocation, ToLocation) => {
    if (FromLocation.positionY === ToLocation.positionY) {
        let [src, dst] = FromLocation.positionX > ToLocation.positionX ? [ToLocation.positionX, FromLocation.positionX] : [FromLocation.positionX, ToLocation.positionX]
        for (let x = src + 1; x < dst; x++) {
            if (cboard.getSquareAt(x, FromLocation.positionY).hasPiece()) {
                return false
            }
        }
        return true
    }
    return false
}

const verticalMoveValidator = (cboard, FromLocation, ToLocation) => {
    if (FromLocation.positionX === ToLocation.positionX) {
        let [src, dst] = FromLocation.positionY > ToLocation.positionY ? [ToLocation.positionY, FromLocation.positionY] : [FromLocation.positionY, ToLocation.positionY]
        for (let y = src + 1; y < dst; y++) {
            if (cboard.getSquareAt(FromLocation.positionX, y).hasPiece()) {
                return false
            }
        }
        return true
    }
    return false
}

const diagonalMoveValidator = (cboard, FromLocation, ToLocation) => {
    //If diagonal move process
    if (Math.abs(ToLocation.positionX - FromLocation.positionX) === Math.abs(ToLocation.positionY - FromLocation.positionY)) {
        //Check if no piece in between
        let X = ToLocation.positionX < FromLocation.positionX ? -1 : 1
        let Y = ToLocation.positionY < FromLocation.positionY ? -1 : 1
        let x = FromLocation.positionX + X
        let y = FromLocation.positionY + Y
        for (; x != ToLocation.positionX; x += X, y += Y) {
            if (cboard.getSquareAt(x, y).hasPiece()) {
                return false
            }
        }
        return true
    }
    //Illegal movement
    return false
}

const checkEnpassant = (cboard, FromLocation, ToLocation) => {
    const moveStep = {
        "white": 1,
        "black": -1
    }

    let capturedPiece = cboard.getSquareAt(ToLocation.positionX, FromLocation.positionY).hasPiece() ? cboard.getSquareAt(ToLocation.positionX, FromLocation.positionY).has : undefined
    console.log(capturedPiece)
    if (Math.abs(FromLocation.positionX - ToLocation.positionX) === 1
        && (FromLocation.positionY + moveStep[FromLocation.color] === ToLocation.positionY)
        && cboard.getSquareAt(ToLocation.positionX, FromLocation.positionY).hasPiece()
        && cboard.getSquareAt(ToLocation.positionX, FromLocation.positionY).has.moveNum === 1
        && cboard.getSquareAt(ToLocation.positionX, FromLocation.positionY).has.steps === 2) {
        console.log("Enpassant")
        FromLocation.isEnPassant = true;
        console.log(FromLocation.isEnPassant)
        console.log(ToLocation)
        return true
    }
    return false
}

const knightStepValidator = (cboard, FromLocation, ToLocation) => {
    if (
        /*
           !( ( Math.abs(chessPiece.positionX-To.positionX) <=2 && Math.abs(chessPiece.positionY-To.positionY) <= 2 )
           && ( Math.abs(chessPiece.positionX-To.positionX)+Math.abs(chessPiece.positionY-To.positionY) === 3 )
           && ( Math.abs(chessPiece.positionX-To.positionX) !== Math.abs(chessPiece.positionY-To.positionY) ) )
         */
        !((Math.abs(FromLocation.positionX - ToLocation.positionX) === 1 && Math.abs(FromLocation.positionY - ToLocation.positionY) === 2) ||
            (Math.abs(FromLocation.positionX - ToLocation.positionX) === 2 && Math.abs(FromLocation.positionY - ToLocation.positionY) === 1))
        /*
           !(( chessPiece.positionX+2 === To.positionX || chessPiece.positionX-2 === To.positionX )
           && (chessPiece.positionY+1 == To.positionY || chessPiece.positionY-1 == To.positionY))
           && !(( chessPiece.positionX+1 === To.positionX || chessPiece.positionX-1 === To.positionX )
           && (chessPiece.positionY+2 == To.positionY || chessPiece.positionY-2 == To.positionY))*/
    ) {
        return false
    }
    return true
}

const checkSingleStep = (cboard, FromLocation, ToLocation) => {
    const moveStep = {
        "white": 1,
        "black": -1
    }

    if (
        !(!ToLocation.hasPiece() && (FromLocation.positionY + moveStep[FromLocation.color] === ToLocation.positionY) && FromLocation.positionX === ToLocation.positionX)
        //Moves forward
        &&
        !(((FromLocation.positionX + 1 === ToLocation.positionX) || (FromLocation.positionX - 1 === ToLocation.positionX)) && FromLocation.positionY + moveStep[FromLocation.color] === ToLocation.positionY && ToLocation.hasPiece())
        //Captures another piece
        &&
        !(FromLocation.moveNum === 0 && (FromLocation.positionY + moveStep[FromLocation.color] * 2 === ToLocation.positionY && FromLocation.positionX === ToLocation.positionX))
        //Is a First move
    ) {
        console.log("Invalid move")
        return false
    }
    return true

}

const kingsMoveValidator = (cboard, FromLocation, ToLocation) => {
    if (Math.abs(FromLocation.positionX - ToLocation.positionX) <= 1 && (Math.abs(FromLocation.positionY - ToLocation.positionY) <= 1)) {
        return true;
    }
    //Illegal movement
    return false;
}


//Handle special case 2.c below in valid moves
const castlingMoveValidator = (cboard, FromLocation, ToLocation) => {
    let rookX = (Math.round(ToLocation.positionX / 7)) * 7 + 1
    let rookY = ToLocation.positionY
    let rookSquare = cboard.getSquareAt(rookX, rookY)
    if (rookSquare.hasPiece() && rookSquare.has.name === "Rook" && rookSquare.has.moveNum === 0 && FromLocation.moveNum === 0) {
        if (FromLocation.positionY === ToLocation.positionY) {
            if (2 === Math.abs(FromLocation.positionX - ToLocation.positionX)) {
                //If only, rook and king never moved out of their position
                let [src, dst] = FromLocation.positionX > rookX ? [rookX, FromLocation.positionX] : [FromLocation.positionX, rookX]
                for (let p = src + 1; p < dst; p++) {
                    if (cboard.getSquareAt(p, FromLocation.positionY).hasPiece()) {
                        return false
                    }
                }
                cboard.isCastling = true
                return true
            }
        }
    }
    return false
}

export {horizontalMoveValidator, verticalMoveValidator, diagonalMoveValidator, checkEnpassant, checkSingleStep, castlingMoveValidator, knightStepValidator, kingsMoveValidator}
/*

   let From = move.src
   let To = move.dst
//If destination is of same color return immediately
if (To.hasPiece() && From.has.color === To.has.color) {
return false
}

let chessPiece = From.has
//Todo
//1. Any further scope of reusing the validations
//2. Special cases:
//      a. En passant   Pawn
//      b. King under check
//      c. Castling
//3. Detect jump over in diagonal move

//Diagonal              Queen, Bishop, King
//Horizontal    Rook, King
//Vertical              Rook, King
//Forward-only  Pawn

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
//(( chessPiece.positionY-1<= To.positionY && chessPiece.positionY+1 >= To.positionY )
//      && ( chessPiece.positionX-1 <= To.positionX && chessPiece.positionX+1 >= To.positionX )) ||
//      updated with new condition, if has not moved more than 2 steps in any direction
(Math.abs(chessPiece.positionY - To.positionY) < 2 && Math.abs(chessPiece.positionX - To.positionX) < 2) ||
(castlingMoveValidator(chessPiece, To))
)) {
console.log("Invalid move")
return false
}
}

if (chessPiece.name === "Knight") {
if (
!((Math.abs(chessPiece.positionX - To.positionX) === 1 && Math.abs(chessPiece.positionY - To.positionY) === 2) ||
(Math.abs(chessPiece.positionX - To.positionX) === 2 && Math.abs(chessPiece.positionY - To.positionY) === 1))
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

    if (
            !(!To.hasPiece() && (chessPiece.positionY + moveStep[chessPiece.color] === To.positionY) && chessPiece.positionX === To.positionX)
            //Moves forward
            &&
            !(((chessPiece.positionX + 1 === To.positionX) || (chessPiece.positionX - 1 === To.positionX)) && chessPiece.positionY + moveStep[chessPiece.color] === To.positionY && To.hasPiece())
            //Captures another piece
            &&
            !(chessPiece.moveNum === 0 && (chessPiece.positionY + moveStep[chessPiece.color] * 2 === To.positionY && chessPiece.positionX === To.positionX))
            //Is a First move
            &&
            !(checkEnpassant(chessPiece, To))
            //Enpassant
       ) {
        console.log("Invalid move")
            return false
    }
}

return true
}
*/

