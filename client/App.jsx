// App component - represents the whole app
App = React.createClass({
    // This mixin makes the getMeteorData method work
    mixins: [ReactMeteorData],

    // Loads items from the Tasks collection and puts them on this.data.tasks
    getMeteorData() {
        return {
            currentUser: Meteor.user()
        };
    },
    renderText() {
        if (this.data.currentUser) {
            return "Search tweets by HashTags."
        } else {
            return "Did you use twitter api?"
        }

    },

    render() {
        return (
            <div className="container">
                <div className="layout-transparent mdl-layout mdl-js-layout">
                    <header className="mdl-layout__header-changed mdl-layout__header--transparent">
                        <div className="mdl-layout__header-row">
                            <span className="mdl-layout-title display-3">Twitter Search Web</span>

                            <div className="mdl-layout-spacer"></div>
                            {this.data.currentUser ?
                                <div
                                    className="android-search-box mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right mdl-textfield--full-width">
                                    <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="search-field">
                                        <i className="material-icons">search</i>
                                    </label>

                                    <div className="mdl-textfield__expandable-holder">
                                        <input className="mdl-textfield__input" type="text" id="search-field"/>
                                    </div>
                                    <button
                                        className="android-more-button mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect"
                                        id="more-button">
                                        <i className="material-icons">more_vert</i>
                                    </button>
                                    <ul className="mdl-menu mdl-js-menu mdl-menu--bottom-right mdl-js-ripple-effect"
                                        htmlFor="more-button">
                                        <LogoutButton />
                                    </ul>
                                </div> : ""}
                        </div>
                    </header>
                    <div className="blog mdl-layout mdl-js-layout has-drawer is-upgraded">
                        <main className="mdl-layout__content">
                            <div className="blog__posts mdl-grid">
                                <h3 className="font-index">{this.renderText()}</h3>
                                {!this.data.currentUser ? <span> <GreetingCard /></span> :
                                    <TwitterPosts/>
                                }
                            </div>

                        </main>
                    </div>
                </div>
            </div>
        );
    }

});

LogoutButton = React.createClass({
    handleClick(e) {
        e.preventDefault();
        Meteor.logout(function (error) {
            if (error) {
                console.log(error);
            }
        });
    },
    render: function () {
        return (
            <li className="mdl-menu__item" onClick={ this.handleClick }>Logout</li>
        )
    }
});

TwitterButton = React.createClass({
    handleClick(e) {
        e.preventDefault();
        Meteor.loginWithTwitter(function (error) {
            if (error) {
                console.log(error);
            }
        });
    },
    render: function () {
        return (
            <a title="Sign In with Twitter" onClick={ this.handleClick } target="_blank"
               className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--twitter"><i
                className="fa fa-twitter fa-fw"></i> Twitter</a>
        )
    }
});

