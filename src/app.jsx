var React = require('react');
require('./sass/app.scss');

var excerpt = "All your base are belong to us. All your base are belong to us. All your base are belong to us. All your base are belong to us. All your base are belong to us. All your base are belong to us. All your base are belong to us. All your base are belong to us. All your base are belong to us. All your base are belong to us. All your base are belong to us. All your base are belong to us. All your base are belong to us. ";

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
      return text.slice(wordEnd).split(' ').slice(0, 7).join(' ');
    }
    return text.slice(wordEnd);
  },
  render: function() {
    var currentStyle = {
      color: this.props.error ? 'red' : 'green'
    };
    return (
      <div className="textDisplay">
        {this.getCompletedText()}
        <span style={currentStyle}>
          {this.getCurrentText()}
        </span>
        {this.getRemainingText()}
      </div>
    );
  }
});

var TextInput = React.createClass({
  handleChange: function(e) {
    this.props.onInputChange(e);
  },
  render: function() {
    return (
      <div className="textInput">
        <input type="text" onChange={this.handleChange} placeholder="Start typing" />
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      index: 0,
      error: false,
      lineView: false
    };
  },
  handleInputChange: function(e) {
    var inputVal = e.target.value;
    var index = this.state.index;
    if (this.props.excerpt.slice(index, index + inputVal.length) === inputVal) {
      if (inputVal.slice(-1) === " " && !this.state.error) {
        e.target.value = '';
        this.setState(function(prevState) {
          return { index: prevState.index + inputVal.length };
        });
        return;
      }
      this.setState({ error: false });
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
    this.setState(function(prevState) {
      return { lineView: !prevState.lineView };
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
          error={this.state.error} />
      </div>
    );
  }
});

React.render(<App excerpt={excerpt} />, document.getElementById('app'));
