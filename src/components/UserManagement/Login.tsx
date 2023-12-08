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
    const data = formData
    
    const postData = 'login_PostJSON_2='+ encodeURIComponent(JSON.stringify([{"_useremail":`${formData.email}`,"_userpwd":`${formData.password}`}]))
    console.log(postData)
    const headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    
    axios.post(apiUrl, postData, {headers})
    .then(response => {
      console.log('Response:', response.data)
      if(response.data[0].success === true) {
        // this.$router.push('/dashboard')
        toast.success("Login Successful", {
            // timeout: 2000,
            position: toast.POSITION.TOP_CENTER
          });
        navigate('/');
      }
      else{
        // alert(response.data[0].error)
        toast.error(response.data[0].error + ' '+ 'Please try again', {
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
    <div className='signup' style={{}}>
      {/* <h2>Sign Up</h2> */}
      <form onSubmit={handleSubmit}>
      

     
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
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Signup