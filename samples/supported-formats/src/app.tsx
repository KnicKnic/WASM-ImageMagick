import * as React from 'react';
import pmap from 'p-map'
import { buildInputFile, execute, loadImageElement, compare, compareNumber } from '../../../dist/src';

export interface AppProps {
  formats: string[]
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
        <table>
          <thead>
            <tr><th>format extension</th><th>format description</th><th>filename</th><th>transformed to png</th><th>comparision with original</th></tr>
          </thead>
          <tbody>
            {this.props.formats.map(format => (
              <tr key={format}>
                <td>{format}</td>
                <td>TODO</td>
                <td>{this.imageName(format)}</td>
                <td><img id={`image_${format}`}></img></td>
                <td id={`comparision_${format}`}>TODO</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>)
  }

  async componentDidMount() {
    const images = await pmap(this.props.formats, format => buildInputFile(this.imageName(format)))
    const results = await pmap(images, image => execute({ inputFiles: images, commands: `convert ${image.name} output.png` }))
    const convertedImages = await pmap(results, r=>r.outputFiles[0])
    await pmap(results, (result, i) => {
      const el = document.getElementById(`image_${this.props.formats[i]}`) as HTMLImageElement
      return loadImageElement(convertedImages[0], el)
    })
    const compareResults = await pmap(images, (image, i) => {  
      return compareNumber(image, convertedImages[i])
    })
    await pmap(compareResults, (r,i)=>{
      const el = document.getElementById(`comparision_${this.props.formats[i]}`)
      el.innerHTML=r+''
    })
  }

  imageName(format) {
    return `formats/to_rotate.${format}`
  }
}
