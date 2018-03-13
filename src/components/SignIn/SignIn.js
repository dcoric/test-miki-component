import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';



const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <fieldset className={'form-group ' + (touched && error ? 'has-danger ' : (touched && warning ? 'has-warning ' : (touched ? 'has-success ' : '')))}>
    <label className='form-control-label'>{touched && error ? <strong>{label}</strong> : label}: </label>
    <input {...input} placeholder={label} type={type} className={'form-control ' + (touched && error ? ' form-control-danger ' : (touched && warning ? ' form-control-warning ' : (touched ? ' form-control-success ' : '')))} />
    <div className='form-control-feedback'>{touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}</div>
  </fieldset>
);

const renderCheckboxField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <fieldset className='checkbox icheck-primary gl-checkbox' >
    <input {...input} type='checkbox' id={label} />
    <label htmlFor={label}>{label}</label>
  </fieldset>
);

class SignInForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isVisible: true
    };
    this.handleDiplayForm = this.handleDiplayForm.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
  }
  componentWillMount () {
    let token = localStorage.getItem(TOKEN) || sessionStorage.getItem(TOKEN);
    this.setState({token: token});
  }
  handleDiplayForm () {
    this.setState({showForm: !this.state.showForm});
  }
  handleFormSubmit ({email, password, rememberMe}) {
    const {url} = this.props;
    this.props.setUrl(url);
    this.props.signinUser({email, password, rememberMe});
  }
  handleSignOut () {
    this.props.signoutUser();
    this.setState({token: ''});
  }
  closeFrom (e) {
    console.log(e);
    if (this.state.showForm) {
      this.setState({showForm: false});
    }
  }
  onClickOutside (event) {
    if (this.ref && !this.ref.contains(event.target)) {
      this.closeFrom();
    }
  }
  componentDidMount () {
    window.addEventListener('mousedown', this.onClickOutside);
  }

  componentWillUnmount () {
    window.removeEventListener('mousedown', this.onClickOutside);
  }
  render() {
    const {errorMessage, tokenProps, handleSubmit, fields: {email, password, rememberMe}} = this.props;
    const {sighInForm, errorMessageStyle, btnCustomStyle, btnActiveStyle} = this.props;
    const {showForm, token} = this.state;
    if (tokenProps && showForm) {
      this.setState({showForm: false});
    }
    let errorStyle = errorMessage ? errorMessageStyle : '';
    let buttonStyle = showForm ? btnActiveStyle : btnCustomStyle;
    return (
      <div className='parent' ref={(ref) => (this.ref = ref)} >
        { token || tokenProps ? <button className='btn' onClick={() => this.handleSignOut()} >SignOut</button>
          : <button className={buttonStyle} onClick={() => this.handleDiplayForm()} >SignIn</button> }
        {showForm && (!token || !tokenProps)
          ? <form className={sighInForm}
            onSubmit={handleSubmit(this.handleFormSubmit)}>
            <ComponentLoader />
            <div className={errorStyle} >{errorMessage}</div>
            <div className='input-hold-2 col-md-12'>
              <Field
                className='form-control'
                name='email'
                {...email}
                component={renderField}
                label='Email'
              />
            </div>
            <div className='input-hold-2 col-md-12'>
              <Field className='form-control'
                {...password}
                component={renderField}
                name='password'
                type='password'
                label='Password'
              />
            </div>
            <Field name='rememberMe'
              label='Remember me'
              {...rememberMe}
              component={renderCheckboxField}
              type='checkbox'
              className='form-check-input' />
            <button action='submit' className='btn'>Sign in</button>
          </form>
          : ''
        }
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    errorMessage: state.auth.error,
    tokenProps: state.auth.token
  };
};
const SignIn = reduxForm({
  form: 'signin',
  fields: ['email', 'password', 'rememberMe']
})(SignInForm);
export default connect(mapStateToProps, actions)(SignIn);