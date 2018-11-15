import pmap from 'p-map';
import * as React from 'react';
import { style } from "typestyle";
import { arrayToCli, buildImageSrc, cliToArray, ExecutionContext, getInputFilesFromHtmlInputElement, MagickFile, MagickInputFile, extractInfo } from 'wasm-imagemagick';

export interface AppProps {
  context: ExecutionContext
}

export interface AppState {
  commandString: string
  commandArray: string
  jsonError: string
  files: MagickInputFile[]
  imgSrcs: string[]
  outputFileSrcs: string[]
  outputFiles: MagickFile[]
  showImagesAndInfo: boolean,
  filesInfo: any[]
}

export class App extends React.Component<AppProps, AppState> {

  state: AppState = {
    commandString: '',
    commandArray: '[]',
    jsonError: '',
    files: [],
    imgSrcs: [],
    outputFileSrcs: [],
    outputFiles: [],
    showImagesAndInfo: false,
    filesInfo: []
  }

  protected styles = {
    textarea: style({
      width: '100%',
    }),
    infoTextarea: style({
      width: '400px',
      height: '300px'
    }),
    imagesList: style({
      height: '500px',
      overflowY: 'scroll'
    })
  }

  render(): React.ReactNode {
    return (
      <div>
        <div>
          <h4>Images available (#{this.state.files.length}) :</h4>
          <div>Show images and info: <input type="checkbox" checked={this.state.showImagesAndInfo} onChange={this.showImagesAndInfoChange.bind(this)}></input></div>
          <div><label>Add images: <input title="Add images" type="file" onChange={this.addImages.bind(this)}></input></label></div>

          <ul className={this.state.showImagesAndInfo && this.styles.imagesList}>{this.state.files.map((f, i) =>
            <li>
              {/* <dl>
                <dt>Name: </dt><dd><strong>{f.name}</strong></dd>
                {this.state.showImagesAndInfo && <span>
                  <dt>Image: </dt><dd><img alt={f.name} src={this.state.imgSrcs[i]}></img></dd>
                  <dt>Info: </dt><dd><textarea className={this.styles.infoTextarea} value={JSON.stringify(this.state.filesInfo[i][0].image, null, 2)}></textarea></dd>
                </span>}
              </dl> */}
              <table>
                <thead><tr><th>Name</th><th>Image</th><th>Info</th></tr></thead>
                <tbody>
                  <tr>
                    <td>{f.name}</td>
                    <td>{this.state.showImagesAndInfo && <img alt={f.name} src={this.state.imgSrcs[i]}></img>}</td>
                    <td>{this.state.showImagesAndInfo && <textarea className={this.styles.infoTextarea} value={JSON.stringify(this.state.filesInfo[i][0].image, null, 2)}></textarea>}</td>
                  </tr>

                </tbody>
              </table>
            </li>)}
          </ul>
        </div>
        <div>Command (String syntax):
          <textarea className={this.styles.textarea} onChange={this.commandStringChange.bind(this)} value={this.state.commandString}></textarea>
        </div>
        <div>Command (Array syntax):
          <textarea className={this.styles.textarea} onChange={this.commandArrayChange.bind(this)} value={this.state.commandArray}></textarea>
          <div>{this.state.jsonError}</div>
        </div>
        <div><button onClick={this.execute.bind(this)}>Execute</button></div>
      </div>)
  }

  protected commandStringChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const commandArray = JSON.stringify(cliToArray(e.target.value)) //TODO: validate
    this.setState({ ...this.state, commandString: e.target.value, commandArray })
  }

  // async componentDidMount() {
  //   const builtInImages = ['rose:', 'logo:', 'wizard:', 'granite:', 'netscape:']
  //   const files = await pmap(builtInImages, i=>)
  // }
  protected async execute() {
    const { outputFiles } = await this.props.context.execute(this.state.commandString)
    this.state.outputFiles = outputFiles
    await this.updateImages()
  }

  protected commandArrayChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    let commandArray = e.target.value, jsonError = '', commandString = this.state.commandString
    try {
      commandArray = JSON.parse(e.target.value)
      commandString = arrayToCli(commandArray as any)
    } catch (error) {
      jsonError = error + ''
    }
    this.setState({ ...this.state, commandString, commandArray, jsonError })
  }

  protected async addImages(e: React.ChangeEvent<HTMLInputElement>) {
    const inputFiles = await getInputFilesFromHtmlInputElement(e.target)
    this.props.context.addFiles(inputFiles)
    await this.updateImages()
  }

  protected async updateImages() {
    const files = await this.props.context.getAllFiles()
    const imgSrcs = this.state.showImagesAndInfo ? await pmap(files, f => buildImageSrc(f)) : this.state.imgSrcs
    const filesInfo = this.state.showImagesAndInfo ? await pmap(files, f => extractInfo(f)) : this.state.filesInfo
    const outputFileSrcs = await pmap(this.state.outputFiles, f => buildImageSrc(f))
    this.setState({ ...this.state, files, imgSrcs, outputFileSrcs, filesInfo })
  }

  protected async showImagesAndInfoChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.state.showImagesAndInfo = e.target.checked
    await this.updateImages()
    // this.setState({...this.state})
  }


}