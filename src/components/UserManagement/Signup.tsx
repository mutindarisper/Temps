import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css'



const Signup = () => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
       
      });

       // Handle form submission 
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement your signup logic here using formData
    console.log('Form submitted with data:', formData);
    // You might want to make an API call to register the user, etc.

    const apiUrl = "http://45.32.233.93:81/wemast/wemast_gen.php";
    // const data = formData
    
    const postData = 'regista_PostJSON='+ encodeURIComponent(JSON.stringify([{"_username":`${formData.username}`,"_usertel":"0987654321","_usercntry":"Kenya","_useremail":`${formData.email}`,"_userpwd":`${formData.password}`,"_userlat":"0.0","_userlon":"0.0"}]))
    console.log(postData)
    const headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    
    axios.post(apiUrl, postData, {headers})
    .then(response => {
      console.log('Response:', response.data)
      if(response.data[0].success === true) {
        // this.$router.push('/dashboard')
        toast.success("Registration Successful", {
            // timeout: 2000,
            position: toast.POSITION.TOP_CENTER
          });
        navigate('/login');
      } else{
        // alert(response.data[0].error)
        toast.error(response.data[0].error, {
            // timeout: 2000,
            position: toast.POSITION.TOP_CENTER
          });
      }
    })
    .catch(error => {
      console.error('Error:', error)
    });
    

     
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
    
  return (
    <div className='signup' style={{backgroundColor:'#ccc'}}>
      {/* <h2>Sign Up</h2> */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>

        
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <button className='signup_btn' type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default Signup