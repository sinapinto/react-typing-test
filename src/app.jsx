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
  componentDidMount: function() {
    React.findDOMNode(this.refs.textInput).addEventListener('keydown', this.handleKeyDown);
  },
  handleKeyDown: function() {
    React.findDOMNode(this.refs.textInput).removeEventListener('keydown', this.handleKeyDown);
    this.props.setupTimer();
  },
  handleChange: function(e) {
    this.props.onInputChange(e);
  },
  render: function() {
    return (
      <div className="textInput">
        <input
          type="text"
          ref="textInput"
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
        <button
          className="tryAgain"
          onClick={this.props.onRestart}>
          Try again
        </button>
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
      lineView: false,
      timeElapsed: 0,
      completed: false
    };
  },
  handleInputChange: function(e) {
    var inputVal = e.target.value;
    var index = this.state.index;
    if (this.props.excerpt.slice(index, index + inputVal.length) === inputVal) {
      if (inputVal.slice(-1) === " " && !this.state.error) {
        // handle a space after a correct word
        e.target.value = '';
        this.setState({ index: this.state.index + inputVal.length });
      }
      else if (index + inputVal.length == excerpt.length) {
        // successfully completed
        this.setState({ completed: true });
        this.intervals.map(clearInterval);
      }
      else {
        this.setState({ error: false });
      }
    } else {
      this.setState({ error: true });
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
  restart: function() {
  },
  setupTimer: function() {
    this.setState({
      start: new Date().getTime()
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
          error={this.state.error} />
        <Clock elapsed={this.state.timeElapsed} />
        <Recap
          onRestart={this.restart}
          completed={this.state.completed} />
      </div>
    );
  }
});

React.render(<App excerpt={excerpt} />, document.getElementById('app'));
