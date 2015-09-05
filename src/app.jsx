var React = require('react');
require('./sass/app.scss');
require('font-awesome/css/font-awesome.css');
var excerpts = require('./excerpts.js');

var TextDisplay = React.createClass({
  _getCompletedText: function() {
    if (this.props.lineView) {
      return '';
    }
    return this.props.children.slice(0, this.props.index);
  },
  _getCurrentText: function() {
    var idx = this.props.index;
    var text = this.props.children;
    if (text.slice(idx).indexOf(' ') === -1) {
      return text.slice(idx);
    }
    return text.slice(idx, idx + text.slice(idx).indexOf(' '));
  },
  _getRemainingText: function() {
    var idx = this.props.index;
    var text = this.props.children;
    if (text.slice(idx).indexOf(' ') === -1) {
      return '';
    }
    var wordEnd = idx + text.slice(idx).indexOf(' ');
    if (this.props.lineView) {
      return text.slice(wordEnd).split(' ').slice(0, 5).join(' ');
    }
    return text.slice(wordEnd);
  },
  render: function() {
    return (
      <div className={this.props.lineView ? "textDisplay lg" : "textDisplay"}>
        {this._getCompletedText()}
        <span className={this.props.error ? "error" : "success"}>
          {this._getCurrentText()}
        </span>
        {this._getRemainingText()}
      </div>
    );
  }
});

var Clock = React.createClass({
  render: function() {
    var elapsed = Math.round(this.props.elapsed  / 100);
    var timer = elapsed / 10 + (elapsed % 10 ? '' : '.0' );
    return (
      <span className="timer">
        {timer}
      </span>
    );
  },
});

var TextInput = React.createClass({
  handleChange: function(e) {
    if (!this.props.started) {
      this.props.setupIntervals();
    }
    this.props.onInputChange(e);
  },
  render: function() {
    return (
      <div className="textInput">
        <input
          type="text"
          placeholder="Start typing.."
          className={this.props.error ? 'error' : ''}
          ref="textInput"
          value={this.props.value}
          onChange={this.handleChange} />
      </div>
    );
  }
});

var App = React.createClass({
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  getInitialState: function() {
    return {
      index: 0,
      error: false,
      errorCount: 0,
      lineView: false,
      timeElapsed: 0,
      value: '',
      startTime: null,
      wpm: 0,
      excerpt: this._randomElement(this.props.excerpts),
      completed: false
    };
  },
  _randomElement: function(array) {
    return this.props.excerpts[Math.floor(Math.random()*this.props.excerpts.length)];
  },
  _handleInputChange: function(e) {
    if (this.state.completed) {
      return;
    }
    var inputVal = e.target.value;
    var index = this.state.index;
    if (this.state.excerpt.slice(index, index + inputVal.length) === inputVal) {
      if (inputVal.slice(-1) === " " && !this.state.error) {
        // handle a space after a correct word
        this.setState({
          index: this.state.index + inputVal.length,
          value: ''
        });
      }
      else if (index + inputVal.length == this.state.excerpt.length) {
        // successfully completed
        this.setState({
          value: '',
          completed: true
        }, function() {
          this._calculateWPM();
        });
        this.intervals.map(clearInterval);
      }
      else {
        this.setState({
          error: false,
          value: inputVal
        });
      }
    } else {
      this.setState({
        error: true,
        value: inputVal,
        errorCount: this.state.error ? this.state.errorCount : this.state.errorCount + 1
      });
    }
  },
  _changeView: function(e) {
    this.setState({ lineView: !this.state.lineView });
  },
  _restartGame: function() {
    // preserve lineView
    var newState = this.getInitialState();
    newState.lineView = this.state.lineView;
    this.setState(newState);
    this.intervals.map(clearInterval);
  },
  _setupIntervals: function() {
    this.setState({
      startTime: new Date().getTime(),
    }, function() {
      // timer
      this.setInterval(function() {
        this.setState({
          timeElapsed: new Date().getTime() - this.state.startTime
        });
      }.bind(this), 50)
      // WPM
      this.setInterval(function() {
        this._calculateWPM();
      }.bind(this), 1000)
    });
  },
  _calculateWPM: function() {
    var elapsed = new Date().getTime() - this.state.startTime;
    var wpm;
    if (this.state.completed) {
      wpm = this.state.excerpt.split(' ').length / (elapsed / 1000) * 60;
    } else {
      var words = this.state.excerpt.slice(0, this.state.index).split(' ').length;
      wpm = words / (elapsed / 1000) * 60;
    }
    this.setState({
      wpm: this.state.completed ? Math.round(wpm * 10) / 10 : Math.round(wpm)
    });
  },
  render: function() {
    return (
      <div>
        <div className="header">
          <h1>typing speed test</h1>
          <i
            className="fa fa-lg fa-refresh"
            onClick={this._restartGame}>
          </i>
          <i
            className="fa fa-lg fa-bars"
            onClick={this._changeView}>
          </i>
        </div>
        <TextDisplay
          index={this.state.index}
          error={this.state.error}
          lineView={this.state.lineView}>
          {this.state.excerpt}
        </TextDisplay>
        <TextInput
          onInputChange={this._handleInputChange}
          setupIntervals={this._setupIntervals}
          value={this.state.value}
          started={!!this.state.startTime}
          error={this.state.error} />
        <div className={this.state.completed ? "stats completed" : "stats"} >
          <Clock elapsed={this.state.timeElapsed} />
          <span className="wpm">{this.state.wpm}</span>
          <span className="errors">{this.state.errorCount}</span>
        </div>
        <Footer />
      </div>
    );
  }
});

var Footer = React.createClass({
  render: function() {
    return (
      <div className="footer">
        Source code available on <a target="_blank" href="https://github.com/sinapinto/react-typing-test">Github</a>.
        Colorscheme used is <a target="_blank" href="https://github.com/morhetz/gruvbox">Gruvbox</a>.
      </div>
    );
  },
});

React.render(<App excerpts={excerpts} />, document.getElementById('container'));
