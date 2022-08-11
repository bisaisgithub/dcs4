import axios from "axios";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Register = ({setLoginRegister, setLoginRegisterOpen}) => {
  const [email2, setEmail2] = useState('');
  const [userInput, setUserInput] = useState({
    name: "",email: "",password: "",dob: "",type: "_Patient",
    allergen: "",mobile:"",status:'',gender:"",status:"Active"
  });
  const [step, setStep] = useState({one: true, two: false, three: false});
  const [inputCode, setInputCode] = useState('');
  const [disableButton, setDisableButton] = useState({verify: false, submitCode: false, register : false});

  const verifyEmail = async (e) => {
    e.preventDefault();
    setDisableButton({...disableButton, verify: true})
    // const credentials = { email2 };
      const sendEmailResponse = await axios.post(
        "/api/calimlim/register",
        {data: {email: email2}, postType: 'verifyEmail'}
      );
      if (sendEmailResponse.data.message === 'existEmail') {
        alert('You email is already registered, try to login or reset password')
        setDisableButton({...disableButton, verify: false});
      }else if(sendEmailResponse.data.message === 'emailSentCodeUpdated' || 
        sendEmailResponse.data.message === 'emailSentCodeCreated'){
        setStep({one: false, two: false, three: true});
      }else if(sendEmailResponse.data.message === 'sendingEmailError'){
        alert('Failed sending email, please try again')
        setDisableButton({...disableButton, verify: false})
      }else{
        alert('Failed sending email, please try again')
        setDisableButton({...disableButton, verify: false})
      }
  };
  const verifyCode = async (e)=>{
    e.preventDefault();
    setDisableButton({...disableButton, submitCode: true});
    const verifyCode = await axios.post(
      "/api/calimlim/register",
      {data: {email: email2, code: inputCode}, postType: 'verifyCode'}
    );
    if (verifyCode.data.message === 'codeOk') {
      setUserInput(prev=>({...prev,email: email2}))
      setStep({one: false, two: true, three: false});
    } else {
      alert('Code is incorrect, please try again');
      setDisableButton({...disableButton, submitCode: false});
    }
  }
  const addUser = async (e) => {
    e.preventDefault();
    setDisableButton({...disableButton, register: true})
    console.log("user:", userInput);
    const response = await axios.post(
      "/api/calimlim/users",
      {data: userInput, postType: 'registerUser'}
    );
    if (response.data.success) {
      alert('Your are now registered and may login');
      // router.push('/cdcs/login');
      setDisableButton({...disableButton, register: false})
    } else {
      if (response.data.message === 'exist_name') {
        alert('Name Already Exist')
        setDisableButton({...disableButton, register: false})
      } else if (response.data.message === 'exist_email') {
        alert('Email Already Exist')
        setDisableButton({...disableButton, register: false})
      }else if (response.data.message === 'no-token') {
        router.push('/cdcs/');
      }else {
        alert('Failed Adding User')
        setDisableButton({...disableButton, register: false})
      }
    }
  };
  const setPatientAgeFunction = (patientDOB)=>{
    if (!patientDOB) {
      return 'No Date Selected'
    }
    const ageDiffs = new Date().getFullYear() - new Date(patientDOB).getFullYear();
    if ((new Date().getMonth() >= new Date(patientDOB).getMonth()) && (new Date().getDate() >= new Date(patientDOB).getDate())) {
        // setPatientAge(ageDiffs -1);
        return ageDiffs;
    } else {
        return ageDiffs -1;
        
        // setPatientAge(ageDiffs);
    }
  }

  return ( 
    <div>
      {/* step1 */}
      {
        step.one? (
          <form className={"form-container-login"} onSubmit={verifyEmail}>
            <div className={"form-body-login"}>
              <div className="form-title-container">
                <div className="display-flex">
                  <div className='form-title-text'>
                    Registration
                  </div>
                  <button className="login-register-cancel-button" onClick={()=>setLoginRegisterOpen(p=>false)}>Cancel</button>
              </div>
                <p className="text_center_margin0">Verifying Email First</p>
              </div>
              <div className="form-body-input-box">
                <span className="form-body-input-box-span">Email</span>
                <input
                  onChange={e=>setEmail2(e.target.value)}
                  type="email"
                  placeholder="Enter email"
                  required
                  disabled={disableButton.verify}
                />
              </div>
              <div className="details-details-modal-body-button">
                <button disabled={disableButton.verify} type="submit">{disableButton.verify? 'Verifying...' : 'Verify'}</button>
              </div>
              <p>Do you have an account? Login 
                <span className="link" onClick={()=>{setLoginRegister({login: true, register: false})}}>
                  {' Here'}
                </span>
              </p>
              {/* <button className="login-register-cancel-button" onClick={()=>setLoginRegisterOpen(p=>false)}>Cancel</button> */}
            </div>
          </form>
        ):''
      }
      {
        step.two?(
          <form onSubmit={addUser} className={'details-details-modal-container'}>
            {/* <div className={"form-body-login"}> */}
              <div className="form-title-container" style={{marginLeft: '10px'}}>
                <div className='form-title-text'>
                  Registration
                </div>
              </div>
              <div className='details-details-modal-body'>
                <div className='details-details-modal-body-input-box'>
                    <span>Full Name</span>
                    <input type="text" placeholder="Enter name" value={userInput.name} required onChange={e=>setUserInput(prev=>({...prev,name:e.target.value}))} />
                </div>
                <div className='details-details-modal-body-input-box'>
                    <span>Date of Birth</span>
                    <DatePicker maxDate={new Date()} yearDropdownItemNumber={90} showYearDropdown scrollableYearDropdown={true} 
                    dateFormat='yyyy/MM/dd' className='date-picker' placeholderText="Click to select a date" selected={userInput.dob} 
                    onChange={date=>setUserInput(prev=>({...prev,dob:date}))} required/>
                </div>
                <div className='details-details-modal-body-input-box'>
                    <span>Email</span>
                    <input type="text" disabled placeholder="Enter email" value={userInput.email} required 
                    />
                </div>
                <div className='details-details-modal-body-input-box'>
                    <span>Age</span>
                    <input type="text" disabled={true} placeholder="DOB empty" 
                    // value={userInput.dob? setPatientAgeFunction(new Date(userInput.dob)): 'no date selected'} 
                    value={setPatientAgeFunction(userInput.dob)}
                    />
                </div>
                <div className='details-details-modal-body-input-box'>
                    <span>Pasword</span>
                    <input type="password" placeholder="Enter password" value={userInput.password} 
                    pattern=".{8,}"
                    title="must be 8 or more characters"
                    required onChange={e=>setUserInput(prev=>({...prev,password:e.target.value}))} />
                </div>
                <div className="details-details-modal-body-input-box">
                    <span>Mobile</span>
                    <input type="text" placeholder="Enter mobile" value={userInput.mobile} 
                    // pattern="[0-9]{10}"
                    pattern="[8,9]+[0-9]{9}"
                    // pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" //email
                    // pattern="[A-Za-z\d\.]{6,12}"
                    // pattern="https?://.+"
                    title="must start with 8 or 9 and must be 10 digit number"
                    required onChange={e=>setUserInput(p=>({...p,mobile:e.target.value}))}/>
                </div>                       
                <div className="details-details-modal-body-input-box">
                    <span>Allergies</span>
                    <input type="text" placeholder="Enter allergies"
                    title="Enter things that causing you allergies else put N/A"
                    value={userInput.allergen} required onChange={e=>setUserInput(p=>({...p,allergen:e.target.value}))}/>
                </div>
                {/* <div className="details-details-modal-body-status-gender"> */}
                  <div className="details-details-modal-body-input-box">
                    <span>Gender</span>
                    <select value={userInput.gender} onChange={(e)=>{setUserInput(p=>({...p,gender:e.target.value}))}} required>
                        <option value="">-Select Gender-</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                  </div>
                {/* </div> */}
              </div>
              <div className='details-details-modal-body-button' style={{marginTop: '10px'}}>                    
                  <button disabled={disableButton.register} type="submit">{disableButton.register? 'Registering...' : 'Register'}</button>                               
                  <button className="login-register-cancel-button" onClick={()=>setLoginRegisterOpen(p=>false)}>Cancel</button>
              </div>
            {/* </div> */}
        </form>
        ):''
      }
      {
        step.three?(
          <form className={"form-container-login"} onSubmit={verifyCode} >
            <div className={"form-body-login"} >
              <div className="form-title-container">
                <div className="display-flex">
                  <div className='form-title-text'>
                    Registration
                  </div>
                  <button className="login-register-cancel-button" onClick={()=>setLoginRegisterOpen(p=>false)}>Cancel</button>
                </div>
                
                <p className="text_center_margin0">{`Enter the code you received at  ${email2}`}</p>
                <p>If the email is incorrect, click 
                  <span 
                  onClick={()=>{
                    setDisableButton({...disableButton, verify: false});
                    setStep({one: true, two: false, three: false});
                  }}
                  style={{color: 'blue', textDecoration:'underline', cursor: 'pointer'}}> Here</span></p>
              </div>
              <div className="form-body-input-box">
                {/* <span className="form-body-input-box-span">Code</span> */}
                <input
                  onChange={e=>setInputCode(e.target.value)}
                  type="number"
                  placeholder="Enter code"
                  required
                  disabled={disableButton.submitCode}
                />
              </div>
              <div className="details-details-modal-body-button">
                <button disabled={disableButton.submitCode} type="submit">{disableButton.submitCode? 'Submitting...' : 'Submit'}</button>
              </div>
            </div>
         </form>
        ):''
      }
      
    </div>
   );
}
 
export default Register;