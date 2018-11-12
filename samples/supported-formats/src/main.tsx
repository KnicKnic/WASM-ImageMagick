import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { knownSupportedReadWriteImageFormats } from 'wasm-imagemagick';
import { App } from './app';
 

export function install() {
  const app = document.createElement('div')
  app.setAttribute('id', 'app')
  document.body.appendChild(app)
  window.addEventListener('hashchange', render)
}
 
export function render() {
  ReactDOM.render(<App formats={knownSupportedReadWriteImageFormats}></App>, document.querySelector('#app'));
}
