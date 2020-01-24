package main

import (
	"fmt"
)

type A struct {
	myvar int
}

type B struct {
	A
}

func main() {
	b := B{A{}}
	fmt.Println(b.myvar)
}
