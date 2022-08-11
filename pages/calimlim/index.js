import { useState } from "react";
import CalimlimHomeNavbar from "../../component/calimlim/Navbar/CalimlimHomeNavbar";
import LoginRegister from "../../component/calimlim/Home/LoginRegister";

const CalimlimHome = () => {
  const [loginRegisterOpen, setLoginRegisterOpen] = useState(false);
  return ( 
    <main>
      <CalimlimHomeNavbar setLoginRegisterOpen={setLoginRegisterOpen} loginRegisterOpen={loginRegisterOpen}/>
      {
        loginRegisterOpen? (
          <LoginRegister setLoginRegisterOpen={setLoginRegisterOpen} />
        ): ''
      }
      <h1> Landing Page</h1>
    </main>
   );
}
 
export default CalimlimHome;