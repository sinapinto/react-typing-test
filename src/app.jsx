var React = require('react');
require('./sass/app.scss');
var excerpts = require('./excerpts.js');

var TextDisplay = React.createClass({
  getCompletedText: function() {
    if (this.props.lineView) {
      return '';
    }
    return this.props.children.slice(0, this.props.index);
  },
  getCurrentText: function() {
    var idx = this.props.index;
    var text = this.props.children;
    if (text.slice(idx).indexOf(' ') === -1) {
      return text.slice(idx);
    }
    return text.slice(idx, idx + text.slice(idx).indexOf(' '));
  },
  getRemainingText: function() {
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
        {this.getCompletedText()}
        <span className={this.props.error ? "error" : "success"}>
          {this.getCurrentText()}
        </span>
        {this.getRemainingText()}
      </div>
    );
  }
});

var Clock = React.createClass({
  render: function() {
    var elapsed = Math.round(this.props.elapsed  / 100);
    var timer = elapsed / 10 + (elapsed % 10 ? 's' : '.0s' );
    return (
      <div className="timer">
        {timer}
      </div>
    );
  },
});

var TextInput = React.createClass({
  handleChange: function(e) {
    if (!this.props.started) {
      this.props.setupTimer();
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
          autoFocus
          onChange={this.handleChange} />
      </div>
    );
  }
});

var Recap = React.createClass({
  render: function() {
    if (!this.props.wpm) {
      return null;
    }
    return (
      <div className="recapOverlay">
        <h2>Congrats!</h2>
        <div>WPM: {this.props.wpm}</div>
        <div>Errors: {this.props.errorCount}</div>
      </div>
    );
  }
});

var ScoreBoard = React.createClass({
  render: function() {
    return (
      <span className="scoreBoard">
        <button
          className="reset"
          onClick={this.props.onRestart}>
          Reset
        </button>
      </span>
    );
  },
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
      started: false,
      wpm: null,
      excerpt: this._randomElement(this.props.excerpts)
    };
  },
  _randomElement: function(array) {
    return this.props.excerpts[Math.floor(Math.random()*this.props.excerpts.length)];
  },
  handleInputChange: function(e) {
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
        this.calculateWPM();
        this.setState({
          value: ''
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
  handleClick: function(e) {
    this.setState({ lineView: !this.state.lineView });
  },
  restartGame: function() {
    // preserve lineView
    var newState = this.getInitialState();
    newState.lineView = this.state.lineView;
    this.setState(newState);
    this.intervals.map(clearInterval);
  },
  setupTimer: function() {
    this.setState({
      start: new Date().getTime(),
      started: true
    }, function() {
      this.setInterval(function() {
        this.setState({
          timeElapsed: new Date().getTime() - this.state.start
        });
      }.bind(this), 50)
    });
  },
  calculateWPM: function() {
    var elapsed = new Date().getTime() - this.state.start;
    var wpm = this.state.excerpt.split(' ').length / (elapsed / 1000) * 60;
    this.setState({
      wpm: Math.round(wpm * 10) / 10
    });
  },
  render: function() {
    return (
      <div className="centered">
        <div className="header">
          <ScoreBoard onRestart={this.restartGame} />
        </div>
        <button
          onClick={this.handleClick}
          className="changeView" >
          {this.state.lineView ? 'Paragraph' : 'Line'}
        </button>
        <TextDisplay
          index={this.state.index}
          error={this.state.error}
          lineView={this.state.lineView}>
          {this.state.excerpt}
        </TextDisplay>
        <TextInput
          onInputChange={this.handleInputChange}
          setupTimer={this.setupTimer}
          value={this.state.value}
          started={this.state.started}
          error={this.state.error} />
        <Clock elapsed={this.state.timeElapsed} />
        <Recap
          errorCount={this.state.errorCount}
          wpm={this.state.wpm} />
      </div>
    );
  }
});

React.render(<App excerpts={excerpts} />, document.getElementById('container'));
