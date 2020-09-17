const RENDER_TO_DOM = Symbol("render to dom");
class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }
    setAttribute(name,value) {
        // [\s\S]表示所有字符
        if (name.match(/^on([\s\S]+)$/)) {
           
            this.root.addEventListener( RegExp.$1.replace(/^[\s\S]/,c=> c.toLowerCase()) ,value); 
        }else {
            if (name === "className") {
                this.root.setAttribute("class",value)
            }else {
                this.root.setAttribute(name,value)

            }

        }
    }
    appendChild(component) {
        let range = document.createRange();
        range.setStart(this.root,this.root.childNodes.length);
        range.setEnd(this.root,this.root.childNodes.length);
        component[RENDER_TO_DOM](range);
        

        // this.root.appendChild(component.root)
    }
    [RENDER_TO_DOM](range) {
        // this.render()[RENDER_TO_DOM](range);
        range.deleteContents();
        range.insertNode(this.root)
    }
}

class TextWapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
    [RENDER_TO_DOM](range) {
        range.deleteContents();
        range.insertNode(this.root)
    }
   
}
 
export class Component {
    constructor( ) {
        this.props = Object.create(null);
        this.children = [];
        this._root = null;
        this._range = null;
    }
    setAttribute(name,value) {
        this.props[name] = value;

    }
    appendChild(component) {
        this.children.push(component)
    }
    [RENDER_TO_DOM](range) {
        this._range = range;
        this.render()[RENDER_TO_DOM](range);
    }
    rerender() {
        let oldRange = this._range;

        let range = document.createRange();
        range.setStart(oldRange.startContainer,oldRange.startOffset)
        range.setEnd(oldRange.startContainer,oldRange.startOffset)
        this[RENDER_TO_DOM](range) 

        // 将老的range移到新加的后面
        oldRange.setStart(range.endContainer,range.endOffset)
        oldRange.deleteContents();
    
    }
    setState(newState) {
        if (this.state === null || typeof this.state !== "object") {
            this.state = newState;
            this.rerender();
            return;
        }
        let merge = (oldState,newState) => {
            for (let p in newState) {
                // null也是object
                if (oldState[p] === null || typeof oldState[p] !== "object") {
                    oldState[p] = newState[p];
                } else {
                    merge(oldState[p],newState[p]);
                }
            }
        }
        merge(this.state,newState);
        this.rerender();
    }
    // get root() {
    //     if (!this._root) {
    //         this._root = this.render().root;
    //     } 
    //     return this._root;
    // }
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
            if (  child === null) {
                continue;
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
export function render(component,parentElement) {
    // parentElement.appendChild(component.root);
    let range = document.createRange();
    range.setStart(parentElement,0);
    range.setEnd(parentElement,parentElement.childNodes.length);
    range.deleteContents();
    component[RENDER_TO_DOM](range);
}