import pMap from 'p-map'
import * as React from 'react'
import { style } from 'typestyle'
import { arrayToCli, asCommand, buildImageSrc, buildInputFile, cliToArray, Command, ExecutionContext, extractInfo, getBuiltInImages, getFileNameExtension, getInputFilesFromHtmlInputElement, isImage, knownSupportedWriteOnlyImageFormats, MagickFile, MagickInputFile, readFileAsText, isReadable } from 'wasm-imagemagick'
import { commandExamples, Example } from './commandExamples'

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
  showImagesAndInfo: boolean
  filesInfo: any[]
  builtInImagesAdded: boolean
  stdout: string
  stderr: string
  exitCode: number
  prettyJSON: boolean
  isImageArray: boolean[]
  memory: number
  selectedExampleDescription: string
  status: 'iddle' | 'loading' | 'executing',
}

export class App extends React.Component<AppProps, AppState> {

  state: AppState = {
    commandString: 'identify rose:',
    commandArray: JSON.stringify(cliToArray('identify rose:')),
    jsonError: '',
    files: [],
    imgSrcs: [],
    outputFileSrcs: [],
    outputFiles: [],
    showImagesAndInfo: false,
    filesInfo: [],
    builtInImagesAdded: false,
    stdout: '',
    stderr: '',
    exitCode: 0,
    prettyJSON: false,
    isImageArray: [],
    memory: getMemory(),
    selectedExampleDescription: '',
    status: 'iddle',
  }

  protected styles = {
    textarea: style({
      width: '100%',
      height: '90px',
    }),
    infoTextarea: style({
      width: '400px',
      height: '160px',
    }),
    imagesList: style({
      height: '500px',
      overflowY: 'scroll',
      textAlign: 'left',
    }),
    executionBad: style({
      backgroundColor: '#ff8888',
    }),
    executionGood: style({
      backgroundColor: '#88ff88',
    }),
    h5: style({
      margin: 0,
    }),
  }

  render(): React.ReactNode {
    return (
      <div>

        <div>
          {/* <p>Memory: {this.state.memory}%</p> */}
          <h4>Images available (#{this.state.files.length}) :</h4>
          <div>Show images and info: <input type='checkbox' checked={this.state.showImagesAndInfo} onChange={this.showImagesAndInfoChange.bind(this)}></input></div>

          <div><label>Add images: <input title='Add images' type='file' onChange={this.addImagesInputChanged.bind(this)}></input></label>  </div>

          <div><button onClick={this.addBuiltInImages.bind(this)} disabled={this.state.builtInImagesAdded}>Add built-in images</button></div>

          <div><button onClick={this.removeAllImages.bind(this)} disabled={this.state.files.length === 0}>Remove all images</button></div>

          <div className={(this.state.showImagesAndInfo || '') && this.styles.imagesList}>
            <table >
              {(this.state.showImagesAndInfo || '') &&
                <thead><tr>
                  <th>Name</th>
                  <th>Actions</th>
                  <th>Image</th>
                  <th>Info</th>
                </tr></thead>
              }
              <tbody>
                {this.state.files.map((f, i) => {
                  return <tr>
                    <td><a download={f.name} target='_blank' href={URL.createObjectURL(new Blob([f.content]))}>{f.name}</a></td>
                    <td>
                      <button data-image={f.name} onClick={this.removeImage.bind(this)}>remove</button>
                    </td>
                    <td>{
                      this.state.showImagesAndInfo && this.state.isImageArray[i] ?
                        <img alt={f.name} src={this.state.imgSrcs[i]}></img> :
                        this.state.showImagesAndInfo ?
                          <textarea className={this.styles.infoTextarea} value={this.state.imgSrcs[i]}></textarea> : ''
                    }
                    </td>
                    <td>{(this.state.showImagesAndInfo && this.state.isImageArray[i]) ?
                      <textarea className={this.styles.infoTextarea} value={JSON.stringify(this.state.filesInfo[i][0].image, null, 2)}></textarea> :
                      this.state.showImagesAndInfo ?
                        <span>text file</span> :
                        ''}
                    </td>
                  </tr>
                },
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4>Command</h4>
          <p>Write a command using one supported syntax type:</p>
          <div>Command (String syntax):
            <textarea className={this.styles.textarea} onChange={this.commandStringChange.bind(this)} value={this.state.commandString}></textarea>
          </div>
          <div>Command (Array syntax):
            <textarea className={this.styles.textarea} onChange={this.commandArrayChange.bind(this)} value={this.state.commandArray}></textarea>
            {(this.state.jsonError || '') && <div>Execution error: {this.state.jsonError} <br />See browser console for more information.</div>}
            <label>Pretty JSON ? <input type='checkbox' onChange={this.prettyJSONChange.bind(this)}></input></label>
          </div>
          <div>
            Or select one example
            <select disabled={this.state.files.length === 0} onChange={this.selectExampleChange.bind(this)}>
              {commandExamples.map(t =>
                <option>{t.name}</option>)}
            </select>
            <span>{this.state.selectedExampleDescription ? 'Description: ' + this.state.selectedExampleDescription : ''}</span>
          </div>
        </div>

        <div>
          <button onClick={this.execute.bind(this)} disabled={this.state.status !== 'iddle'}>Execute</button>
          <span>Status: {this.state.status}</span>
        </div>

        <div>
          <p>Output Files (#{this.state.outputFiles.length}) </p>
          {(this.state.outputFiles.length || '') && <ul>{this.state.outputFiles.map((f, i) =>
            <li><div>{f.name}</div>
              {this.state.isImageArray[this.state.files.findIndex(f2 => f2.name === f.name)] ?
                <img src={this.state.outputFileSrcs[i]}></img> :
                <textarea className={this.styles.infoTextarea} value={this.state.outputFileSrcs[i]}></textarea>}
            </li>,
          )}
          </ul>}
        </div>
        <h5 className={this.styles.h5}><span className={this.state.exitCode ? this.styles.executionBad : this.styles.executionGood}>Exit code: {this.state.exitCode + ''}</span></h5>
        <h5 className={this.styles.h5}>stdout:</h5>
        <textarea className={this.styles.textarea} value={this.state.stdout}></textarea>
        <h5 className={this.styles.h5}>stderr:</h5>
        <textarea className={this.styles.textarea} value={this.state.stderr}></textarea>
      </div>)
  }

  private defaultImage = 'fn.png'
  async componentDidMount() {
    if (!this.state.files.find(f => f.name === this.defaultImage)) {
      await this.addInputFiles([await buildInputFile(this.defaultImage)])
    }
  }

  componentWillUpdate() {
    this.state.memory = getMemory()
    // const hash = encodeURIComponent(JSON.stringify({commandString: this.state.commandString}))
    // history.replaceState(null, null, document.location.pathname + "#" + encodeURIComponent(JSON.stringify({commandString: this.state.commandString})))
  }

  protected async prettyJSONChange(e: React.ChangeEvent<HTMLInputElement>) {
    const arr = JSON.parse(this.state.commandArray)
    const prettyJSON = e.target.checked
    const commandArray = prettyJSON ? JSON.stringify(arr, null, 2) : JSON.stringify(arr)
    this.setState({ ...this.state, commandArray, prettyJSON })
  }

  removeImage(e: React.MouseEvent<HTMLButtonElement>) {
    const name = e.currentTarget.getAttribute('data-image')
    this.props.context.removeFiles([name])
    this.state.files = this.state.files.filter(f => f.name !== name)
    this.setState({ ...this.state, files: this.state.files.filter(f => f.name !== name) })
  }

  async removeAllImages(e: React.MouseEvent<HTMLButtonElement>) {
    const all = await this.props.context.getAllFiles()
    this.props.context.removeFiles(all.map(f => f.name))
    this.state.builtInImagesAdded = false
    this.setState({ ...this.state, files: [] })
  }

  protected commandStringChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.changeCommandString(e.target.value)
  }
  changeCommandString(value: string): any {
    const commandArray = this.state.prettyJSON ? JSON.stringify(cliToArray(value), null, 2) : JSON.stringify(cliToArray(value))
    this.setState({ ...this.state, commandString: value, commandArray })
  }

  protected async addBuiltInImages() {
    if (!this.state.builtInImagesAdded) {
      const builtIn = await getBuiltInImages()
      await this.addInputFiles(builtIn)
      this.setState({ ...this.state, builtInImagesAdded: true })
    }
  }

  protected async execute() {
    if (this.state.status !== 'iddle') {
      return
    }
    this.setState({ ...this.state, status: 'executing' })
    const cmd = this.state.commandString.replace(/\$\$ALLIMAGES/g, this.state.files.map(f => f.name).join(' ')).replace(/\$\$IMAGE_0/g, this.state.files.length && this.state.files[0].name || 'rose:')
    console.log('Final Command: ' + JSON.stringify(cmd))
    const result = await this.props.context.execute(cmd)
    console.log(result)
    this.state.outputFiles = result.outputFiles
    this.state.stderr = result.stderr.join('\n')
    this.state.stdout = result.stdout.join('\n')
    this.state.exitCode = result.exitCode
    this.setState({ ...this.state, status: 'loading' })
    await this.updateImages()
  }

  protected commandArrayChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const commandArray = e.target.value
    let jsonError = ''
    let commandString = this.state.commandString
    try {
      commandString = arrayToCli(JSON.parse(e.target.value))
    } catch (error) {
      jsonError = error + ''
    }
    this.state = { ...this.state, commandString, commandArray, jsonError }
    this.setState({ ...this.state })
  }

  protected async addImagesInputChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const inputFiles = await getInputFilesFromHtmlInputElement(e.target)
    this.addInputFiles(inputFiles)
  }

  protected async addInputFiles(files: MagickInputFile[]) {
    this.props.context.addFiles(files)
    await this.updateImages()
  }

  protected async updateImages() {
    const files = await this.props.context.getAllFiles()
    const isImageArray = await pMap(files, isImage)
    const imgSrcs = this.state.showImagesAndInfo ? await pMap(files, (f, i) => buildFileSrc(f, isImageArray[i])) : this.state.imgSrcs
    const filesInfo = this.state.showImagesAndInfo ? await pMap(files, (f, i) => {
      if (isImageArray[i] && isReadable(f)) {
        return extractInfo(f)
      }
    }) : this.state.filesInfo
    const outputFileSrcs = await pMap(this.state.outputFiles.filter(f => !f.ignore), f => buildFileSrc(f))
    this.setState({ ...this.state, files, imgSrcs, outputFileSrcs, filesInfo, isImageArray, status: 'iddle' })
  }

  protected async showImagesAndInfoChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.state.showImagesAndInfo = e.target.checked
    await this.updateImages()
  }

  protected async selectExampleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const example = commandExamples[e.currentTarget.selectedIndex]
    const command = await this.commandExampleAsCommand(example)
    this.state.commandString = typeof example.command === 'string' ? example.command : arrayToCli(command)
    this.state.commandArray = JSON.stringify(command)
    this.setState({ ...this.state, selectedExampleDescription: example.description })
  }

  protected async commandExampleAsCommand(example: Example): Promise<Command[]> {
    const c = example.command as any
    const command = typeof c === 'function' ? await c(this.state.files) : asCommand(c)
    return command
  }

}
async function buildFileSrc(file: MagickFile, isImage_?: boolean): Promise<string> {
  if(!isReadable(file)){
    return
  }
  if (typeof isImage_ === 'undefined' ? await isImage(file) : isImage_) {
    return await buildImageSrc(file, true)
  }
  else {
    return await readFileAsText(file)
  }
}

function getMemory() {
  return Math.round(((performance as any).memory.usedJSHeapSize) * 100 / (performance as any).memory.totalJSHeapSize)
}
