// const submitForm=()=>{
//     const teacherFormData=new FormData() ;
//     teacherFormData.append ('email', teacherLoginData.email) 
//     teacherFormData.append ('password' ,teacherLoginData.password)
//     try{
//         axios.post (baseUrl+'/teacher-login' , teacherFormData)
//         .then((res)=>{
//             if(res.data.bool===true){
//                 localStorage.setItem('teacherLoginStatus',true); 
//                 localStorage.setItem('teacherId',res.data.teacher_id);
//                 window.location.href='/teacher-dashboard';
//             }else{
//                 seterrorMsg (res.data.msg);
//             } 
//         });
//     }catch (error){
//         console.log(error);
//     }
// }
// const teacherLoginStatus=localStorage.getItem('teacherLoginStatus');
// if (teacherLoginStatus=='true'){
//         window.location.href='/teacher-dashboard';    
// }
// useEffect (()=>{
//         document.title='Log In'
//     });

//     return (
//         <div className="container mt-4"> 
//             <div className="row">
//                 <div className="col-6 offset-3">
//                     <div className="card">
//                             <h5 className="card-header">Log In</h5> 
//                             <div className="card-body">
//                                 {errorMsg && <p className= 'text-danger'>{errorMsg}</p>}
//                                 <div className="mb-3">
//                                     <label for="exampleInputEmail1" className="form-label">Email</label>
//                                     <Input type="email" value=(teacherLoginData.email) name='email' onChange=(handleChange) className-"form-control" />
//                                 </div>
//                                 <div className="mb-3">
//                                     <label for="exampleInputPassword" className="form-label">Email</label>
//                                     <Input type="password" value=(teacherLoginData.password) name='password' onChange=(handleChange) className-"form-control" />
//                                 </div>
//                                 <button type="submit" onCLick={submitForm} className="btn btn-primary">Log In</button>
//                             </ div> 
//                     </div>
//                 </div>
//             </div> 
//         </div>

//     )


// export default login;

import { useNavigate } from "react-router-dom";
import StudentTemp from "./student-temp";

function Login() {
//   const navigate = useNavigate(); // Hook for navigation

//   function handleLogin(event) {
//     event.preventDefault();
//     navigate("/student-temp"); // Navigate to StudentTemp.jsx
//   }

  return (
    <div>
      <h1>Login</h1>
      <div className="container mt-4">
        <form>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" />
          </div>

          <button className="btn btn-primary mt-4" >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
