import AuthLayout from '@/layouts/AuthLayout';
import LoginForm from '@/components/LoginForm';
import ToggleColorMode from '@/components/ToggleColorMode';

const Login = () => {

  return (
    <AuthLayout>
      <h2>Log In</h2>
      <LoginForm />
      <ToggleColorMode />
    </AuthLayout>
  );
};

export default Login;
