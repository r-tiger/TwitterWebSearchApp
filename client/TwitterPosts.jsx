Tweets = new Mongo.Collection('tweets');

TwitterPosts = React.createClass({
    mixins: [ReactMeteorData],
    getInitialState(){
        return {
            qty: 5,
            tags: ["#Kiev"],
            posts: []
        }

    },
    getMeteorData() {
        // This is the place to subscribe to any data you need
        var handle = Meteor.subscribe('posts', this.state.tags.join(" "), this.state.qty);
        return {
            postsLoading: !handle.ready(), // Use handle to show loading state
            posts: Tweets.find().fetch()
        }
    },
    showMore(){
        let qty = this.state.qty + 5;
        this.setState({qty: qty});
    },
    getPosts (query){
        this.setState({tags: query, qty: 5});
    },

    render() {
        return (
            <span>
        <TagsComponent getPosts={this.getPosts}/>
                {
                    this.data.posts.map(function (post) {
                        return (<TweetterCard key={post._id} tweet={post}/>);
                    })
                }
                <ShowMoreButton postsLoading={this.data.postsLoading} showMore={this.showMore}/>
            </span>
        )
    }

});


TweetterCard = React.createClass({
    getInitialState: function () {
        return {
            sourceUrl: ""
        };
    },
    parseDate(str){
        let d = new Date(str);
        let dateFormat = " " + d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " ";
        return (dateFormat);
    },
    linkify(inputText){
        //URLs starting with http://, https://, or ftp://
        var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        var replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

        //URLs starting with www. (without // before it, or it'd re-link the ones done above)
        var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        var replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

        //Change email addresses to mailto:: links
        var replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
        var replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
        return (replacedText)
    },
    componentDidMount(){
        if (this.props.tweet.entities && this.props.tweet.entities.urls && this.props.tweet.entities.urls[0] && this.props.tweet.entities.urls[0].url) {
            this.setState({sourceUrl: this.props.tweet.entities.urls[0]})
        }
    },
    sourceUrl(){
    },
    mediaUrl(){
        if (this.props.tweet.entities && this.props.tweet.entities.media && this.props.tweet.entities.media[0].media_url)
            return this.props.tweet.entities.media[0].media_url;
    },
    render() {
        return (
            <div className="mdl-card mdl-cell mdl-cell--12-col">
                <div className="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">
                    <div className="section__circle-container mdl-cell mdl-cell--2-col mdl-cell--1-col-phone">
                        <img className="img-tweet" src={this.props.tweet.user.profile_image_url}/>
                    </div>
                    <div
                        className="section__text mdl-cell mdl-cell--10-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone">
                        <h6>{this.props.tweet.user.name}</h6> <span>{this.parseDate(this.props.tweet.created_at)}</span>

                        <div dangerouslySetInnerHTML={{__html:this.linkify(this.props.tweet.text)}}></div>
                        <img className="card-image-df" src={this.mediaUrl()}/>
                        {this.state.sourceUrl ?
                            <div>Read more: <a href={this.state.sourceUrl.url}> {this.state.sourceUrl.display_url}</a>
                            </div> : ""}

                    </div>
                </div>
            </div>
        )
    }
});

TagsComponent = React.createClass({
    displayName: "TagsComponent",
    getInitialState: function () {
        return {
            tags: ["#Kiev"]
        };
    },
    saveTags: function () {
        return this.props.getPosts(this.state.tags); // send query to TwitterPosts
    },
    handleChange: function (value) {
        let lastElement = value[value.length - 1];  //add HashTag to string
        if (lastElement && lastElement.substring(0, 1) != "#") {
            value[value.length - 1] = "#" + lastElement;
        }
        this.setState({tags: value});
    },
    render: function () {
        return (
            React.createElement("div", {className: 'position-inline'},
                React.createElement(ReactTagsInput, {
                    value: this.state.tags,
                    onChange: this.handleChange,
                    id: "tagsInput"
                }),
                React.createElement("label", {
                        onClick: this.saveTags,
                        className: 'mdl-button mdl-js-button mdl-button--icon',
                        htmlFor: "tagsInput"
                    },
                    React.createElement("i", {className: "material-icons button-search-color"}, "search"))
            )
        );
    }
});

ShowMoreButton = React.createClass({
    render(){
        if (this.props.postsLoading) {
            return (<div className="mdl-spinner mdl-js-spinner is-active"></div>)
        } else {
            return (
                <button onClick={ this.props.showMore }
                        className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored button-ShowMore">
                    Show More
                </button>
            )
        }
    }
});

