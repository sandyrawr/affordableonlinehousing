import {useEffect, useState } from "react";
import axios from 'axios';
const teacherFormData=new FormatData();
const submitForm=()=>
   
    teacherFormData.append ("full_name", teacherData.full_name)
    teacherFormData. append ("email", teacherData.email) 
    teacherFormData. append ("password", teacherData.password) 
    teacherFormData. append ("qualification", teacherData.qualification) 
    teacherFormData.append ("mobile_no", teacherData.mobile_no) 
    teacherFormnData. append ("skills", teacherData.skills) 
    try{
        axios.post (baseUrl, teacherFormData).then((response) =>{
            window.location.href='/verify-teacher/' +response.id;
            // setteacherData{(
            //     // 'full_name': '',
            //     // 'email':'',
            //     // 'password':'',
            //     // 'qualification':'':
            //     // 'mobile no':'',
            //     // 'skills':'',
            //     // 'status': 'success'
            // )};
        });
    }catch (error){
        console.log (error);
        setteacherData(('error'));
    };
    // End