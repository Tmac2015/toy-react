import {createElement,render,Component} from "./toy-react.js"
class MyComponent extends Component {
    render() {
        return  <div>
                <h1>my component</h1>
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