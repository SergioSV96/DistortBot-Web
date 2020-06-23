import React from 'react';
import './App.css';
import { main, File } from 'magica'


class FileDisplay extends React.Component {
  render() {
    return (
      <img src={this.props.file} alt="new" className="img-thumbnail" width="50%"></img>
    )
  }
}

// TODO: Add Web Worker, this is extremely low
async function distort(file) {
  let inputFile = await File.fromUrl(URL.createObjectURL(file));
  const result = await main({
    debug: true,
    command: 'convert ' + inputFile.name + ' -liquid-rescale 320x320 -implode 0.25 output.png',
    inputFiles: [inputFile]
  })
  return File.toDataUrl(result.outputFiles[0]);
}


class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      distortedFile: null
    };

    this.handleChange = this.handleChange.bind(this);
  }

  async handleChange(event) {
    let file = event.target.files[0];
    this.setState({
      file: URL.createObjectURL(file)
    });

    this.setState({
      distortedFile: await distort(file)
    });
  }

  render() {
    return (
      <div className="container">
        <input type="file" onChange={this.handleChange}></input>
        <br></br>
        <FileDisplay file={this.state.file} />
        <FileDisplay file={this.state.distortedFile} />
      </div>
    );
  }
}

function Header() {
  return (
    <header className="App-header">
      <div className="container h-100">
        <div className="d-flex h-100 text-center align-items-center">
          <div className="w-100 text-black">
            <h1 className="display-3">DistortBot</h1>
            <p className="lead mb-0">This is in prealpha</p>
          </div>
        </div>
      </div>
    </header>
  )
}

function App() {
  return (
    <div className="App">
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <FileUpload />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
