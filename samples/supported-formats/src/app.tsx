// TODO. in read and write , demonstrate that write works by transforming a png to that format

import * as React from 'react';
import pmap from 'p-map'
import { buildInputFile, execute, loadImageElement, compare, compareNumber, blobToString } from 'wasm-imagemagick';

export interface AppProps {
  formatsReadWrite: string[]
  formatsWriteOnly: string[]
}
export interface AppState {
}

export class App extends React.Component<AppProps, AppState>
{

  state: AppState = {
    toggle: true
  }

  constructor(props: AppProps, state: AppState) {
    super(props, state)
  }

  render(): React.ReactNode {
    return (
      <div>
        <h1>Formats known to support read and write operations:</h1>
        <table>
          <thead>
            <tr><th>format extension</th>
              <th>format description</th>
              <th>original file</th>
              <th>transformed to png (verify format read)</th>
              <th>png comparison with original</th>
              <th>png transformed to format (verify format write)</th>
            </tr>
          </thead>
          <tbody>
            {this.props.formatsReadWrite.map(format => (
              <tr key={format}>
                <td>{format}</td>
                <td>TODO</td>
                <td>
                  <img src={this.imageName(format)}></img>
                <div id={`imageoriginalsize_${format}`}></div>
                <a href={this.imageName(format)}>{this.imageName(format)}</a><br />
                  </td>
                <td>
                  <img id={`image_${format}`}></img>
                <div id={`imagesize_${format}`}></div>
                </td>
                <td id={`comparison_${format}`}>TODO</td>
                <td> 
                <img id={`imagewriteworks_image_${format}`}></img> </td>
                <a href="#" target="_blank" id={`imagewriteworks_anchor_${format}`} ></a><br/>
              </tr>
            ))}
          </tbody>
        </table>

        <h1>Formats known to support only write operations:</h1>
        <table>
          <thead>
            <tr><th>format extension</th>
              <th>format description</th>
              <th>filename</th>
              <th>format transformed to png</th>
            </tr>
          </thead>
          <tbody>
            {this.props.formatsWriteOnly.map(format => (
              <tr key={format}>
                <td>{format}</td>
                <td>TODO</td>
                <td>{this.imageName(format)}</td>
                <td><img id={`imagewriteonly_${format}`}></img></td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>) 
  }

  async componentDidMount() {
    const images = await pmap(this.props.formatsReadWrite, async format => {
      const img = await buildInputFile(this.imageName(format))
      document.getElementById(`imageoriginalsize_${format}`).innerHTML=`size: ${img.content.byteLength} bytes`
      return img
    })
    const results = await pmap(images, image => execute({ inputFiles: [image], commands: `convert ${image.name} output.png` }))
    await pmap(results, (result, i) => {
      document.getElementById(`imagesize_${this.props.formatsReadWrite[i]}`).innerHTML=`size: ${results[i].outputFiles[0].blob.size} bytes`
      
      return loadImageElement(results[i].outputFiles[0], document.getElementById(`image_${this.props.formatsReadWrite[i]}`) as HTMLImageElement)
    })
    const compareResults = await pmap(images, (image, i) => {
      return compareNumber(image, results[i].outputFiles[i])
    })
    await pmap(compareResults, (r, i) => {
      const el = document.getElementById(`comparison_${this.props.formatsReadWrite[i]}`)
      el.innerHTML = r + ''
    })

    const pngImage = await buildInputFile(this.imageName('png'))
    const pngToFormats = await pmap(this.props.formatsReadWrite, (format, i) => execute({ inputFiles: [pngImage], commands: `convert ${pngImage.name} output_.${format}` }))
    await pmap(pngToFormats, (result, i) => {
      const imgEl = document.getElementById(`imagewriteworks_image_${this.props.formatsReadWrite[i]}`) as HTMLImageElement
      const a = document.getElementById(`imagewriteworks_anchor_${this.props.formatsReadWrite[i]}`) as HTMLAnchorElement
      a.href=URL.createObjectURL(result.outputFiles[0].blob)
      a.innerHTML = a.download = result.outputFiles[0].name
      return loadImageElement(result.outputFiles[0], imgEl)
    })

    
  }

  imageName(format) {
    return `formats/to_rotate.${format}`
  }
}
