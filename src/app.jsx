var React = require('react');

var excerpt = "All your base are belong to us.";

var TextDisplay = React.createClass({
  render: function() {
    var currentStyle = {
      color: this.props.error ? 'red' : 'green',
      textDecoration: 'underline'
    };
    var lastWord = false;
    var wordStart = this.props.index;
    if (excerpt.slice(wordStart).indexOf(' ') === -1) {
      lastWord = true;
    }
    var wordEnd =  wordStart + excerpt.slice(wordStart).indexOf(' ');
    var completedText = excerpt.slice(0, wordStart);
    var currentText = lastWord ? excerpt.slice(wordStart) : excerpt.slice(wordStart, wordEnd);
    var remainingText = excerpt.slice(wordEnd);
    return (
      <div className="textDisplay">
        {completedText}
        <span style={currentStyle}>
          {currentText}
        </span>
        { lastWord ? '' : remainingText}
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
      error: false
    };
  },
  handleInputChange: function(e) {
    var inputVal = e.target.value;
    var index = this.state.index;
    // console.log(excerpt.slice(index, index + inputVal.length), ' ', inputVal);
    if (excerpt.slice(index, index + inputVal.length) === inputVal) {
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
  render: function() {
    return (
      <div className="container">
        <h1>react-typer</h1>
        <TextDisplay index={this.state.index} error={this.state.error} />
        <TextInput onInputChange={this.handleInputChange} error={this.state.error} />
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
