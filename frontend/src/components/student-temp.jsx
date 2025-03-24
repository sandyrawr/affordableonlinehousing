import {useEffect, useState } from "react";
import axios from 'axios';
function Student()
{

  const [id, setId] = useState('');
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [fee, setFee] = useState("");
  const [students, setUsers] = useState([]);


useEffect(() => {
  (async () => await Load())();
  }, []);
  
  
  async function  Load()
  {
     const result = await axios.get(
         "http://127.0.0.1:8000/student");
         setUsers(result.data);
         console.log(result.data);
  }
    
  
 async function save(event)
    {
        event.preventDefault();
    try
        {
         await axios.post("http://127.0.0.1:8000/student",
        {
        
          name: name,
          address: address,
          fee: fee
        
        });
          alert("Student Registation Successfully");
          setId("");
          setName("");
          setAddress("");
          setFee("");
          Load();

      
        
        }
    catch(err)
        {
          alert("Student Registation Failed");
        }
   }



   async function editStudent(students)
   {
    setName(students.name);
    setAddress(students.address);
    setFee(students.fee);
    setId(students.id);
    
   }
   async function DeleteStudent(id)
   {
      
        await axios.delete("http://127.0.0.1:8000/student/" + id);
        alert("Student deleted Successfully");
        setId("");
        setName("");
        setAddress("");
        setFee("");
        Load();
  
  
   }
   async function update(event)
   {
    event.preventDefault();
   try
       {
        
        await axios.put("http://127.0.0.1:8000/student/"+ students.find(u => u.id === id).id || id,
       {
         id: id,
         name: name,
         address: address,
         fee: fee
      
       });
         alert("Student Updateddddd");
         setId("");
         setName("");
         setAddress("");
         setFee("");
         Load();
      
       }
   catch(err)
       {
         alert(" Student updateddd Failed");
       }
  }
  return (
    <div>
       <h1>Property Details</h1>
       <div class="container mt-4" >
          <form>
              <div class="form-group">

               <label>Property Title</label>
                <input  type="text" class="form-control" id="name"
                value={name}
                onChange={(event) =>
                  {
                    setName(event.target.value);      
                  }}
                />
              </div>

              <div class="form-group">
                <label>Location</label>
                <input  type="text" class="form-control" id="address"
                 value={address}
                  onChange={(event) =>
                    {
                     setAddress(event.target.value);      
                    }}
                />
              </div>
              <div class="form-group">
                <label>Price</label>
                <input type="text" class="form-control" id="fee"
                  value={fee}
                onChange={(event) =>
                  {
                    setFee(event.target.value);      
                  }}
                />
              </div>
                 <div>
              <button   class="btn btn-primary mt-4"  onClick={save}>Add</button> 
              <button   class="btn btn-warning mt-4"  onClick={update}>Update</button>
              </div>  

              
            </form>
          </div>


<table class="table table-dark" align="center">
  <thead>
    <tr>
      <th scope="col">Property Id</th>
      <th scope="col">Property Title</th>
      <th scope="col">Location</th>
      <th scope="col">Price</th>
      
      <th scope="col">Option</th>
    </tr>
  </thead>
       {students.map(function fn(student)
       {
            return(
            <tbody>
                <tr>
                <th scope="row">{student.id} </th>
                <td>{student.name}</td>
                <td>{student.address}</td>
                <td>{student.fee}</td>        
                <td>
                    <button type="button" class="btn btn-warning"  onClick={() => editStudent(student)} >Edit</button>  
                    <button type="button" class="btn btn-danger" onClick={() => DeleteStudent(student.id)}>Delete</button>
                </td>
                </tr>
            </tbody>
            );
            })}
            </table>
       </div>
            );
        }
export default Student;