import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { newExecutionContext } from 'wasm-imagemagick';
import { App } from './app';
 
export function install() {
  const app = document.createElement('div')
  app.setAttribute('id', 'app')
  document.body.appendChild(app)
  window.addEventListener('hashchange', render)
}

const context = newExecutionContext()
 
export function render() {
  ReactDOM.render(<App context={context}></App>, document.querySelector('#app'));
}
