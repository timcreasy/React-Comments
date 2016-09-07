let Comment = React.createClass({
  render: function() {

    const authorStyle = {
      fontWeight: "900"
    };

    return (
      <div>
        <span style={authorStyle}>@{this.props.author}</span> - {this.props.children}
      </div>
    );
  }
});

let CommentList = React.createClass({

  render: function() {

    let commentNodes = this.props.comments.map((comment) => {
      return (
        <Comment author={comment.author} key={comment._id}>{comment.text}</Comment>
      );
    });


    return (
      <div>
        {commentNodes}
      </div>
    );
  }
});

let AddCommentForm = React.createClass({

  getInitialState: function() {
    return ({author: "", text: ""});
  },

  handleButtonClick: function(e) {
    e.preventDefault();
    const {author, text} = this.state;
    if (!author || !text) {
      return;
    }
    this.props.onCommentSubmit({author, text});
  },

  handleNameChange: function(e) {
    this.setState({author: e.target.value});
  },

  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },

  render: function() {
    return (
      <div>
        <form>
          <input type="text" placeholder="Your name" onChange={this.handleNameChange}/>
          <input type="text" placeholder="Your comment" onChange={this.handleTextChange}/>
          <input type="submit" value="Add Comment" onClick={this.handleButtonClick}/>
        </form>
      </div>
    );
  }
});

let CommentSearch = React.createClass({

  handleSearch: function(e) {
    this.props.onCommentSearch(e.target.value);
  },

  render: function() {
    return (
      <div>
        <input type="text" placeholder="Search Comments" onChange={this.handleSearch} />
      </div>
    );
  }
});

let CommentBox = React.createClass({

  loadComments: function() {
    $.ajax({
      url: '/api/comments',
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        this.setState({comments: data});
      },
      error: () => {
        console.log("Oops, something happened");
      }
    });
  },

  addComment: function(comment) {
    $.ajax({
      url: '/api/comments',
      method: 'POST',
      data: comment,
      success: (data) => {
        console.log("Added comment:", data);
      },
      error: () => {
        console.log("Oops, something happened");
      }
    });
  },

  getInitialState: function() {
    return ({ comments: [], searching: false, searchedComments: [] });
  },

  componentDidMount: function() {
    this.loadComments();
    setInterval(this.loadComments, 2000);
  },

  handleCommentSubmit: function(comment) {
    this.addComment(comment);
  },

  searchComments: function(searchTerm) {


    if (searchTerm !== "") {
     this.setState({ searching: true });
   } else {
     this.setState({ searching: false });
   }

    let matchedComments = this.state.comments.filter((comment) => {
      if (comment.text.includes(searchTerm, 0)) {
        return comment;
      }
    });

    this.setState({ searchComments: matchedComments });

  },


  render: function() {

    let comments = null;
    if (this.state.searching) {
      comments = <CommentList comments={this.state.searchComments}/>;
    } else {
      comments = <CommentList comments={this.state.comments} />;
    }

    // Pass callback as prop to AddCommentForm
    return (
      <div>
        <CommentSearch onCommentSearch={this.searchComments}/>
        {comments}
        <AddCommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);
