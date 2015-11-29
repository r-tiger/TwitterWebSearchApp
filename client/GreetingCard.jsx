GreetingCard = React.createClass({
    render() {
        return (
            <div className="card-wide mdl-card mdl-shadow--2dp">
                <div className="mdl-card__title">
                    <h2 className="mdl-card__title-text">Welcome</h2>
                </div>
                <div className="mdl-card__supporting-text">
                    This is a simple web application to search tweets.
                    <div>To begin search at first you must have account in Twitter.com</div>
                </div>
                <div className="mdl-card__actions mdl-card--border">
                    <span className="font-greetingCard"> Sign In: </span>
                    <TwitterButton/>
                </div>
                <div className="mdl-card__menu">
                </div>
            </div>
        )
    }
});



