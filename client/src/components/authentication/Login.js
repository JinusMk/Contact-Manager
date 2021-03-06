import React from 'react'
import axios from '../../config/axios'
import { Link, Redirect} from 'react-router-dom'
import { Button, TextField, InputAdornment } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons';
import Header from '../layout/Header'
const divStyle = {
    width: "30%"
}

class UserLogin extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            notice: '',
            redirect: false,
            showPassword: false,
            error: {},
            loader: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
handleSubmit(e){
    e.preventDefault()
    this.setState({loader: true})
    const { email, password } = this.state;
      const validateNewInput = {
        email: email.trim() ? '' : 'Please enter Email Address',
        password: password.trim() ? '' : 'Please enter Password'
      };
      if(Object.keys(validateNewInput).every((k) => { return validateNewInput[k] === '' })){
        const formData = {
        email: this.state.email,
        password: this.state.password
        }
        axios.post('/users/login',formData)
        .then((response) => {
            this.setState({loader: false})
            console.log(response.data)
            axios.defaults.headers["x-auth"] = response.data.token
            localStorage.setItem('token', response.data.token)
            this.props.handleIsAuthenticated(true)
            this.setState(() => ({
                redirect: true,
            }))
        })
        .catch(err => {
            // window.alert('Invalid email / password')
            window.alert(err)
            console.log(err)
            this.setState(() => ({
                password: '',
            notice: err,
            loader: false
            }))
        })
      }else{
        this.setState({
            error: validateNewInput,
            loader: false
          });
      }
}
handleChange(key, value){
    this.setState(prevState => ({
        ...prevState,
        [key] : value,
        error: {
            ...prevState.error,
            [key]: ''
        }
    }))
}
togglePasswordMask = () => {
    this.setState((prevState) => ({
        showPassword: !prevState.showPassword
    }))
}
render(){
    if(this.state.redirect){
        return <Redirect to="/contacts"/>
    }
    const { email, password, error } = this.state
    return(
        <React.Fragment>
            <Header />
        <div className="auth-form-wrapper">
                        <form onSubmit = {this.handleSubmit} className="auth-form">
                            <div className="form-title">
                                <h3>Login</h3>
                            </div>
                            <div className="form-group-field">
                                <TextField
                                    id="email"
                                    error={error.email ? true : false}
                                    label="Email Address"
                                    type="email"
                                    fullWidth={true}
                                    // autoComplete="email"
                                    margin="dense"
                                    value={email}
                                    inputProps={{autoComplete: 'random-string', autofill:'off' }}
                                    onChange={(e) => this.handleChange('email', e.target.value)}
                                />
                                <h6 className="error-msg">{this.state.error.email}</h6>
                            </div>
                            <div className="form-group-field">
                                <TextField
                                    id="password"
                                    error={error.password ? true : false}
                                    label="Password"
                                    type={this.state.showPassword ? 'text' : 'password'}
                                    name="Password"
                                    margin="dense"
                                    fullWidth={true}
                                    value={password}
                                    InputProps={{
                                        endAdornment: (
                                        <InputAdornment position="end" style={{cursor: 'pointer'}}>
                                        {this.state.showPassword ?  <Visibility
                                            style={{color: '#555555'}}
                                            onClick={this.togglePasswordMask}
                                            /> : <VisibilityOff style={{color: '#555555'}} onClick={this.togglePasswordMask} />}
                                        </InputAdornment>
                                        ),
                                        'aria-label': 'password'
                                    }}
                                    onChange={(e) => this.handleChange('password', e.target.value)}
                                />
                                <h6 className="error-msg">{this.state.error.password}</h6>
                            </div>
                        <Button type="submit" variant="contained" color="primary" disabled={this.state.loader} className="submit" onClick={this.loginUser} >{this.state.loader ? "Processing..." : "Login"}</Button>
                        <p className="account-link-option">Don't have an account? <Link to="register">REGISTER NOW</Link></p>
                        </form>
        </div>
        </React.Fragment>
    )
}

}

export default UserLogin

// if(this.state.notice){
//     return <div><h3> Invalid email / password </h3><Redirect to="/users/login"/></div>
// }

