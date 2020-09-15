import {createElement,render,Component} from "./toy-react.js"
class MyComponent extends Component {
    constructor() {
        super();
        this.state = {
            a:1,
            b:2
        }
    }
    render() {
        return  <div>
         
                <h1>my component</h1>
              
                <button onclick={()=>{ this.setState( { a:  this.state.a + 1  } ) } }  >+</button>
                <span>{this.state.a.toString()}</span>
                <span>{this.state.b.toString()}</span>
                {this.children}
        </div> 
    }
 }

window.a =<MyComponent id="a" class="c">
    <div>aaaa</div>
    <div></div>
    <div></div>
</MyComponent>

// document.body.appendChild(a);
render(a,document.body)