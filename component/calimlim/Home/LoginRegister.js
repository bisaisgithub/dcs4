import {useState} from 'react';
import Login from "./Login";
import Register from "./Register";

const LoginRegister = ({setLoginRegisterOpen}) => {
  // const router = useRouter();
  const [loginRegister, setLoginRegister] = useState({login: true, register: false})

  return (
    <div className='details-details-container'>
      {
        loginRegister.login? (
          <Login setLoginRegister={setLoginRegister} setLoginRegisterOpen={setLoginRegisterOpen}/>
        ):''
      }
      {
        loginRegister.register? (
          <Register setLoginRegister={setLoginRegister} setLoginRegisterOpen={setLoginRegisterOpen}/>
        ):''
      }
    </div>
  );
};

export default LoginRegister;