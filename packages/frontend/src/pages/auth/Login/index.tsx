import Layout from '@/components/ClientLayout';
import LoginForm from '@/components/LoginForm';
import ToggleColorMode from '@/components/ToggleColorMode';

const Login = () => {

  return (
    <Layout>
      <h2>Log In</h2>
      <LoginForm />
      <ToggleColorMode />
    </Layout>
  );
};

export default Login;
