class DOMElement {

    attr
    elemType
    elem

    constructor(e, a) {
        this.attr = a
		this.elemType = e
		if ( e !== "body" ) {
			this.elem = document.createElement(e)
			for ( let prop in this.attr ) {
				this.elem.setAttribute(prop, this.attr[prop])
	    	}
		} else {
			this.elem = document.body
		}
    }

    add(component) {
       	this.elem.appendChild(component.elem)
    }

    remove(component) {
        if (component.elem.parentNode === this.elem) {
            this.elem.removeChild(component.elem)
			return true
        }
		return true
    }

    attachTo(c) {
        //console.log(c.constructor.name)

        let parent = this.elem.parentNode
        if (parent !== null) {
            parent.removeChild(this.elem)
        }

        for (let prop in this.attr) {
            this.elem.setAttribute(prop, this.attr[prop])
        }
        c.elem.appendChild(this.elem)

    }

    detachFrom(c) {
        if (this.elem.parentNode === c.elem) {
            console.log("Removing from destination")
            c.elem.removeChild(this.elem)
            return true
        }
        return false
    }

    //Refresh object based on changes in the attr
    refresh(attr) {
        for (let prop in attr) {
			if ( prop === "class" ) {
				this.elem.classList.remove(...this.elem.classList)
				this.elem.classList.add(attr[prop])
				continue
			}
			console.log("a")
            this.elem.removeAttribute(prop)
            this.elem.setAttribute(prop, attr[prop])
            this.attr[prop] = attr[prop]
        }
    }
}
