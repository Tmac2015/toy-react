class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }
    setAttribute(name,value) {
        this.root.setAttribute(name,value)
    }
    appendChild(component) {
        this.root.appendChild(component.root)
    }
}

class TextWapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
  
   
}
 
export class Component {
    constructor( ) {
        this.props = Object.create(null);
        this.children = [];
        this._root = null;
    }
    setAttribute(name,value) {
        this.props[name] = value;

    }
    appendChild(component) {
        this.children.push(component)
    }
    get root() {
        if (!this._root) {
            this._root = this.render().root;
        } 
        return this._root;
    }
} 





export function createElement(type,attributes,...children) {
    let e;
    if (typeof type === "string") {
        e = new ElementWrapper(type);
    }else {
        e = new type;
    }
  
    for (let p in attributes) {
        e.setAttribute(p,attributes[p])
    }
    let insertchildren = (children) => {
        for (let child of children) {
            if (typeof child === "string") {
                child=new TextWapper(child)
            }
            if ((typeof child === "object") && (child instanceof Array)) {
                insertchildren(child)
            }else {
                e.appendChild(child)

            }
        }
    }
    insertchildren(children)
    return e;
}
export function render(component,parenttElement) {
    parenttElement.appendChild(component.root);
}