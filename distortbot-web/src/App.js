import React from 'react';
import './App.css';
import { initializeImageMagick, ImageMagick } from "@imagemagick/magick-wasm/image-magick";
import { Magick } from "@imagemagick/magick-wasm/magick"
import { MagickFormat } from '@imagemagick/magick-wasm/magick-format';
import { Quantum } from '@imagemagick/magick-wasm/quantum';

class FileDisplay extends React.Component {
  render() {
    return (
      <img src={this.props.file} alt="new" className="img-thumbnail" width="50%"></img>
    )
  }
}

// TODO: Add Web Worker, this is extremely low
/*async function distort(file) {
  let inputFile = await File.fromUrl(URL.createObjectURL(file));
  const result = await main({
    debug: true,
    command: 'convert ' + inputFile.name + ' -liquid-rescale 320x320 -implode 0.25 output.png',
    inputFiles: [inputFile]
  })
  return File.toDataUrl(result.outputFiles[0]);
}*/

async function distort(file) {
  let blob = await file.arrayBuffer();
  const imageData = new Uint8Array(blob);
  await initializeImageMagick();
  console.log(Magick.imageMagickVersion);
  console.log('Delegates:', Magick.delegates);
  console.log('Features:', Magick.features);
  console.log('Quantum:', Quantum.depth);
  let result;
  ImageMagick.read(imageData, (image) => {
    image.resize(100, 100);
    image.implode(0.25);
    image.blur(1, 5);
    image.write((data) => {
      console.log(data.length);
      console.log(data);
      result = new Blob([data]);
    }, MagickFormat.Jpeg);
  });
  return result;
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
    let distortedFile = await distort(file);
    console.log(distortedFile)
    this.setState({
      distortedFile: URL.createObjectURL(distortedFile)
    });

  }

  render() {
    return (
      <div className="container">
        <input type="file" onChange={this.handleChange}></input>
        <br></br>
        <FileDisplay file={this.state.file} />
        <br></br>
        <FileDisplay file={this.state.distortedFile} />
      </div>
    );
  }
}

function Header() {
  return (
    <section className="jumbotron text-center">
      <div className="container">
        <h1 className="jumbotron-heading">DistortBot</h1>
        <p className="lead text-muted">This is in pre-alpha, drag your image below and see it getting distorted!</p>
        <p>
          <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-show-count="false">Tweet</a>
        </p>
      </div>
    </section>
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
