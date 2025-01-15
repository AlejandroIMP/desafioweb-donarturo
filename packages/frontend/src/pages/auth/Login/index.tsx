import AuthLayout from '@/layouts/AuthLayout';
import LoginForm from '@/components/LoginForm';
import ToggleColorMode from '@/components/ToggleColorMode';
import './index.css';

const Login = () => {

  return (
    <AuthLayout>
      <h1>Log In</h1>
      <div className='auth-form--container'>
        <LoginForm />
        <ToggleColorMode />
      </div>
    </AuthLayout>
  );
};

export default Login;
