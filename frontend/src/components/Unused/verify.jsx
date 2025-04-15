import {useEffect, useState } from "react";
import axios from 'axios';
const baseUrl='http://127.0.0.1:8000/api';
function VerifyTeacher(){
    const [teacherData, setteacherData]=useState ({
        otp_digit:'',
    });


    const [errorMsg, seterrorMsg]=useState ('');

    const handleChange=(event)=>{
        setteacherData({
            ...teacherData,
            [event.target.name]: event.target. value
        });
    }
    
            

    const submitForm=()=>{
        const teacherformData=new FormData();
        teacherFormData.append ( 'otp_digit', teacherLoginData.otp_digit) 
        teacherFormData.append ('password' , teacherLoginData.password) 
        try {
            axios.post (baseUrl+ '/verify- teacher', teacherFormData)
            .then ((res)=>{
                if(res.data.bool===true){
                    localStorage.setItem('teacherLoginStatus',true);
                    LocalStorage.setItem('teacherId',res.data.teacher_id);
                    window.location.href='/teacher-dashboard';
                }else{
                    seterrorMsg(res.data.msg) ;
                } 
            });
       

        }catch(error){
            console.log(error);
        }
    }
    const teacherLoginStatus=localStorage.getItem('teacherLoginStatus');
    if (teacherLoginStatus =='true'){
        window.location.href='/teacher-dashboard';
    }
        
    useEffect (()=>{
        document.title='Verify'
    });

    return (
        <div className="container mt-4"> 
            <div className="row">
                <div className="col-6 offset-3">
                    <div className="card">
                            <h5 className="card-header">Enter 6 Digit OTP</h5> 
                            <div className="card-body">
                            {errorMsg && <p className= 'text-danger'>{errorMsg}</p>}
                                <div className="mb-3">
                                    <label for="exampleInputEmail1" className="form-label">OTP</label>
                                    {/* <Input type="number" value=(teacherData.otp_digit) name='otp_digit' onChange=(handleChange) className-"form-control" > */}
                                </div>
                                <button type="submit" onCLick={submitForm} className="btn btn-primary">Verify</button>
                            </ div> 
                    </div>
                </div>
            </div> 
        </div>

    )
}


export default Verify;
        
