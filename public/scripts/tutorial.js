let Comment = React.createClass({

  rawMarkup: function() {
    let md = new Remarkable();
    let rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },

  render: function() {
      return (
      <div className="comment">
        <h2 className="commentAuthor">
          { this.props.author }
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

let CommentList = React.createClass({
  render: function() {

    let commentNodes = this.props.data.map((comment) => {
      return (
        <Comment author={comment.author} key={comment._id}>
          {comment.text}
        </Comment>
      );
    });

    return (
      <div className="commentList">
        { commentNodes }
      </div>
    )
  }
});

let CommentForm = React.createClass({

  handleSubmit: function(e) {
    e.preventDefault();
    let author = this.state.author.trim();
    let text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.setState({ author: '', text: '' });
  },

  getInitialState: function() {
    return { author: '', text: '' };
  },

  handleAuthorChange: function(e) {
    this.setState({ author: e.target.value });
  },

  handleTextChange: function(e) {
    this.setState({ text: e.target.value });
  },

  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" value={this.state.author} onChange={this.handleAuthorChange}/>
        <input type="text" placeholder="Say something..." value={this.state.text} onChange={this.handleTextChange}/>
        <input type="submit" value="Post" />
      </form>
    )
  }
});

let CommentBox = React.createClass({

  // Data is initially empty
  getInitialState: function() {
    return { data: [] };
  },

  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: (data) => {
        this.setState({data: data});
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  },

  handleCommentSubmit: function(comment) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: (data) => {
        console.log(data);
        // this.setState({data: data});
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  },

  // Upon component mounting, populate this.state.data
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },


  render: function() {
    return (
      <div>
        <h1>Comments</h1>
        <CommentList data={this.state.data}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000}/>,
  document.getElementById('content')
);
