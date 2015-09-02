var React = require('react');
require('./sass/app.scss');

var excerpt = "All your base are belong to us.";

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
      return text.slice(wordEnd).split(' ').slice(0, 10).join(' ');
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
    var timer = elapsed / 10 + (elapsed % 10 ? '' : '.0' );
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
          className={this.props.error ? 'error' : ''}
          ref="textInput"
          value={this.props.value}
          onChange={this.handleChange} />
      </div>
    );
  }
});

var Recap = React.createClass({
  render: function() {
    if (!this.props.completed) {
      return null;
    }
    return (
      <div className="recapOverlay">
        <h2>Congrats!</h2>
      </div>
    );
  }
});

var ScoreBoard = React.createClass({
  render: function() {
    return (
      <div className="scoreBoard">
        <button
          className="tryAgain"
          onClick={this.props.onRestart}>
          Reset
        </button>
      </div>
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
      lineView: false,
      timeElapsed: 0,
      completed: false,
      value: '',
      started: false
    };
  },
  handleInputChange: function(e) {
    var inputVal = e.target.value;
    var index = this.state.index;
    if (this.props.excerpt.slice(index, index + inputVal.length) === inputVal) {
      if (inputVal.slice(-1) === " " && !this.state.error) {
        // handle a space after a correct word
        this.setState({
          index: this.state.index + inputVal.length,
          value: ''
        });
      }
      else if (index + inputVal.length == excerpt.length) {
        // successfully completed
        this.setState({
          completed: true,
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
        value: inputVal
      });
    }
  },
  handleClick: function(e) {
    if (this.state.lineView) {
      React.findDOMNode(this.refs.viewType).text = "line view";
    } else {
      React.findDOMNode(this.refs.viewType).text = "paragraph view";
    }
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
  render: function() {
    return (
      <div className="container">
        <h1>react-typer</h1>
        <ScoreBoard
          onRestart={this.restartGame} />
        <a
          href="javascript:;"
          onClick={this.handleClick}
          ref="viewType">
          line view
        </a>
        <TextDisplay
          index={this.state.index}
          error={this.state.error}
          lineView={this.state.lineView}>
          {this.props.excerpt}
        </TextDisplay>
        <TextInput
          onInputChange={this.handleInputChange}
          setupTimer={this.setupTimer}
          value={this.state.value}
          started={this.state.started}
          error={this.state.error} />
        <Clock elapsed={this.state.timeElapsed} />
        <Recap
          completed={this.state.completed} />
      </div>
    );
  }
});

React.render(<App excerpt={excerpt} />, document.getElementById('app'));
