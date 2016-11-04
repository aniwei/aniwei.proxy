import React from 'react';
import highlight from 'highlight.js';

import 'whatwg-fetch';
import mime from '../../common/mime';
import 'highlight.js/styles/atom-one-light.css';

class Code extends React.Component {
  constructor () {
    super();

    this.state = {
      text: null
    }
  }
  componentDidMount () {
    const { url, type } = this.props;

    fetch(url,{
      contentType: mime.lookup(type)
    }).then((res) => {
      if (res.status == 200) {
        return res.text()
      }
    }).then((res) => {
      this.setState({
        text: res
      })
    }).catch((err) => {
      this.setState({
        text: err.stack
      })
    })
  }

  render () {
    const { type } = this.props;
    const { text } = this.state;
  
    let txt = text ? highlight.highlight(type, text) : '正在加载内容...';

    return <pre className="view__mime-code hljs" ref="code" dangerouslySetInnerHTML={{__html: txt.value}}>
    </pre>
  }
}

class Image extends React.Component {
  render () {
    const { url } = this.props;

    return <div className="view__imie-image">
      <img className="view__imie-image-element" src={url} />
    </div>
  }
}

class Media extends React.Component {
  render () {
    const { url, children } = this.props;

    return <div className="view__imie-media">
      {children}
    </div>
  }
}

class Audio extends React.Component {
  render () {
    const { url } = this.props;

    return <Media>
      <audio className="view__imie-media-audio" src={url} controls="controls" />
    </Media>
  }
}


class opp extends React.Component {
  render () {
    return <Audio {...this.props}/>
  }
}

export class css extends React.Component {
  render () {
    return <Code type="css" {...this.props}/>
  }
}

export class less extends React.Component {
  render () {
    return <Code type="less" {...this.props}/>
  }
}

export class sass extends React.Component {
  render () {
    return <Code type="sass" {...this.props}/>
  }
}

export class js extends React.Component {
  render () {
    return <Code type="js" {...this.props}/>
  }
}

export class html extends React.Component {
  render () {
    return <Code type="html" {...this.props}/>
  }
}

export default {
  html,
  css,
  less,
  sass,
  js,
  mp3: Audio,
  mpga: Audio,
  gif: Image,
  png: Image,
  jpg: Image,
  jpeg: Image
}