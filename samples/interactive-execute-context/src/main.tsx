import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { newExecutionContext, jsonParseOr } from 'wasm-imagemagick';
import { App } from './app';
 
export function install() {
  const app = document.createElement('div')
  app.setAttribute('id', 'app')
  document.body.appendChild(app)
  window.addEventListener('hashchange', render)
}

const context = newExecutionContext()
let app 
export function render() {
  app = ReactDOM.render(<App context={context}/>, document.querySelector('#app'));
}

window.addEventListener('hashchange', e=>{
  console.log(window.location.hash);
  let urlState  =jsonParseOr(decodeURIComponent(window.location.hash.substring(1, window.location.hash.length)), undefined)
  if(urlState && urlState.commandString){
    app.changeCommandString(urlState.commandString)
  }
})
