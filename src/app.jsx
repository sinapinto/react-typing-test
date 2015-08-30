var React = require('react');

var reactText = "Render a ReactElement to its initial HTML. This should only be used on the server. React will return an HTML string. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.  If you call React.render() on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.";

var Reader = React.createClass({
  render: function() {
    return (
      <div className="typerReader">
        {reactText}
      </div>
    );
  }
});

var Input = React.createClass({
  handleKeyUp: function(event) {
    event.preventDefault();
    var inputVal = event.target.value;
    if (inputVal === "") {
      return;
    }
    this.props.onInputChange(inputVal);
  },
  render: function() {
    return (
      <div className="typerInput">
        <input type="text" onKeyUp={this.handleKeyUp} placeholder="type here"/>
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    // var line = this.getChunk(reactText, 0);
    return {
      charIndex: 0,
      lineIndex: 0
    };
  },
  // getChunk: function(text, index, spread) {
  //   var spread = spread || 7;
  //   return text.split(' ').splice(index * spread, spread).join(' ');
  // },
  handleInputChange: function(inputVal) {
    if (reactText.charAt(this.state.charIndex) !== inputVal) {
      return;
    }
    
  },
  render: function() {
    return (
      <div className="container">
        <h1>react-typer</h1>
        <Reader />
        <Input onInputChange={this.handleInputChange} />
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
