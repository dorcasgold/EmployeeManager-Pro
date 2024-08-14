import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../firebase';

const CreateEmployee = () => {
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [duration, setDuration] = useState('');
  const [age, setAge] = useState('');
  const [salary, setSalary] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null); // Changed to handle file input
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageURL = '';

      if (image) {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        imageURL = await getDownloadURL(storageRef);
      }

      // Add employee to Firestore
      const employeesCollection = collection(firestore, 'employees');
      await addDoc(employeesCollection, {
        fullname,
        email,
        age,
        salary,
        duration,
        date,
        category,
        image: imageURL
      });

      navigate('/employees');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="p-6 flex flex-col justify-center items-center">
      <h2 className="text-3xl font-semibold mb-4">Create Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Fullname</label>
          <input
            type="text"
            className="lg:w-[40rem] w-[20rem] px-3 py-2 border border-gray-300 rounded"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="text"
            className="lg:w-[40rem] w-[20rem] px-3 py-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Duration</label>
          <input
            type="text"
            className="lg:w-[40rem] w-[20rem] px-3 py-2 border border-gray-300 rounded"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Age</label>
          <input
            type="number"
            className="lg:w-[40rem] w-[20rem] px-3 py-2 border border-gray-300 rounded"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Salary</label>
          <input
            type="number"
            className="lg:w-[40rem] w-[20rem] px-3 py-2 border border-gray-300 rounded"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date</label>
          <input
            type="date"
            className="lg:w-[40rem] w-[20rem] px-3 py-2 border border-gray-300 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Category</label>
          <input
            type="text"
            className="lg:w-[40rem] w-[20rem] px-3 py-2 border border-gray-300 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            className="lg:w-[40rem] w-[20rem] px-3 py-2 border border-gray-300 rounded"
            onChange={handleImageChange}
            required
          />
        </div>
        <div className='flex gap-2'>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Add
          </button>
          <Link to='/employees'>
            <button
              type="submit"
              className="bg-gray-500 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </Link>
        </div>

      </form>
    </div>
  );
};

export default CreateEmployee;
