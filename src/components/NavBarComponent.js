import React from 'react';
import {Button, Dropdown} from "react-bootstrap";
// import {Form, FormControl} from "react-bootstrap";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {findCurrentUser, logoutUser} from "../actions/userActions";
import userService from "../services/userService";

const UserService = new userService();

class NavBarComponent extends React.Component {
    state = {
        keyword: '',
        userId: '',
        user: {id: 0, username: 'Log In'},
        loggedIn: false
    };

    componentDidMount() {
        this.props.findCurrentUser();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.user.id > 0 && this.props.user.id !== this.state.user.id) {
            this.setState({
                user: this.props.user,
                loggedIn: true
            })
        }
    }

    keyWordChange = event => {
        this.setState({
            keyword: event.target.value
        })
    };

    userNameChange = event => {

        this.setState({
                          userId: event.target.value
                      })
    };

    logout = () => {
        this.props.logoutUser();
        this.setState({
            user: {id: 0, username: 'Log In'},
            loggedIn: false
        });
    };

    render() {
        return (
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <a className="navbar-brand" href="/">Mind-Assistant</a>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/privacy-policy">Privacy Policy</a>
                        </li>
                    </ul>
                    <form className="form-inline my-2 my-lg-0">
                        <input value={this.state.username}
                               onChange={this.userNameChange}
                               className="form-control mr-sm-2"
                               type="search"
                               placeholder="Search for User By Id"
                               aria-label="Search"/>
                        <Link to={`/profile/${this.state.userId}`}>
                            <button className="btn btn-outline-primary my-2 my-sm-0"
                                    type="submit">
                                Search
                        </button>
                        </Link>
                        {/*<FormControl type="text" placeholder="Search for Users" className="mr-sm-2"/>*/}
                        {/*<Button variant="outline-info">Search</Button>*/}
                    </form>
                    <Button variant="dark"></Button>
                    <form className="form-inline my-2 my-lg-0">
                        <input value={this.state.keyword}
                               onChange={this.keyWordChange}
                               className="form-control mr-sm-2"
                               type="search"
                               placeholder="Search for Dad Jokes"
                               aria-label="Search"/>
                        <Link to={`/search/${this.state.keyword}`}>
                            <button className="btn btn-outline-success my-2 my-sm-0"
                                    type="submit">
                                Search
                            </button>
                        </Link>
                    </form>
                    <Dropdown>
                        <Dropdown.Toggle variant="dark" id="dropdown-basic">
                            {this.state.user.username}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item hidden={this.state.loggedIn}
                                           href="/login">
                                Login
                            </Dropdown.Item>
                            <Dropdown.Item hidden={this.state.loggedIn}
                                           href="/register">
                                Register
                            </Dropdown.Item>
                            <Dropdown.Item hidden={!this.state.loggedIn}
                                           href="/profile">
                                Profile
                            </Dropdown.Item>
                            <Dropdown.Item onClick={this.logout}
                                           hidden={!this.state.loggedIn}
                                           href={"/"}>
                                Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </nav>
        )
    }
}

const stateToPropertyMapper = (state) => ({
    user: state.user.user
});
const dispatchToPropertyMapper = (dispatch) => ({
    findCurrentUser: () => {
        UserService.findCurrentUser().then(user => {
            dispatch(findCurrentUser(user))
        })
    },
    logoutUser: () => {
        UserService.logoutUser().then(user => {
            dispatch(logoutUser(user))
        })
    }
});
export default connect(
    stateToPropertyMapper,
    dispatchToPropertyMapper
)(NavBarComponent)
