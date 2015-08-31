var React = require('react');

var reactText = "Render a ReactElement to its initial HTML. This should only be used on the server. React will return an HTML string. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.  If you call React.render() on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.";

var TextDisplay = React.createClass({
  render: function() {
    var completedStyle = { color: 'green' };
    return (
      <div className="typerReader">
        <span className="complete" style={completedStyle}>
          {reactText.slice(0, this.props.index)}
        </span>
          {reactText.slice(this.props.index)}
      </div>
    );
  }
});

var Input = React.createClass({
  handleChange: function(e) {
    var inputVal = e.target.value;
    this.props.onInputChange(inputVal);
  },
  render: function() {
    return (
      <div className="typerInput">
        <input type="text" onChange={this.handleChange} placeholder="Start typing" />
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    // var line = this.getChunk(reactText, 0);
    return {
      charIndex: 0
      // lineIndex: 0
    };
  },
  // getChunk: function(text, index, spread) {
  //   var spread = spread || 7;
  //   return text.split(' ').splice(index * spread, spread).join(' ');
  // },
  handleInputChange: function(inputVal) {
    console.log(inputVal);
    if (reactText.indexOf(inputVal) === 0) {
      // this.setState(function(previousState, currentProps) {
        // console.log('new index: ', previousState.charIndex + 1);
        // return {charIndex: previousState.charIndex + 1};
      // });
      this.setState({
        charIndex: inputVal.length
      });
    }
  },
  render: function() {
    return (
      <div className="container">
        <h1>react-typer</h1>
        <TextDisplay index={this.state.charIndex} />
        <Input onInputChange={this.handleInputChange} />
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
