let horizontalMoveValidator = (FromLocation, ToLocation) => {
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

let verticalMoveValidator = (FromLocation, ToLocation) => {
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

let diagonalMoveValidator = (FromLocation, ToLocation) => {
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

let checkEnpassant = (FromLocation, ToLocation) => {
    const moveStep = {
        "white": 1,
        "black": -1
    }
