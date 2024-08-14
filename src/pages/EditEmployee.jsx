import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { firestore, collection, doc, getDoc, updateDoc } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase'; // Ensure you import the storage instance

const EditEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [duration, setDuration] = useState('');
  const [age, setAge] = useState('');
  const [salary, setSalary] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const docRef = doc(collection(firestore, 'employees'), id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEmployee(data);
          setFullName(data.fullname);
          setEmail(data.email);
          setDuration(data.duration);
          setAge(data.age);
          setSalary(data.salary);
          setDate(data.date);
          setCategory(data.category);
          setImagePreview(data.image); // Set initial image preview
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error.message);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // For preview
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = imagePreview; // Default to current image URL

      // If a new image is selected, upload it to Firebase Storage
      if (image) {
        const storageRef = ref(storage, `employee-images/${id}/${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const docRef = doc(collection(firestore, 'employees'), id);
      await updateDoc(docRef, {
        fullname,
        email,
        duration,
        age,
        salary,
        date,
        category,
        image: imageUrl
      });
      navigate('/employees');
    } catch (error) {
      console.error("Error updating document: ", error.message);
    }
  };

  return (
    <div className="p-6 flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold mb-4">Edit Employee</h2>
      {employee && (
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              className="w-[40rem] px-3 py-2 border border-gray-300 rounded"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="text"
              className="w-[40rem] px-3 py-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Duration</label>
            <input
              type="text"
              className="w-[40rem] px-3 py-2 border border-gray-300 rounded"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Age</label>
            <input
              type="number"
              className="w-[40rem] px-3 py-2 border border-gray-300 rounded"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Salary</label>
            <input
              type="number"
              className="w-[40rem] px-3 py-2 border border-gray-300 rounded"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              className="w-[40rem] px-3 py-2 border border-gray-300 rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category</label>
            <input
              type="text"
              className="w-[40rem] px-3 py-2 border border-gray-300 rounded"
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
              className="w-[40rem] px-3 py-2 border border-gray-300 rounded"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Image Preview"
                className="mt-4 max-w-xs"
              />
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Update Employee
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
      )}
    </div>
  );
};

export default EditEmployee;
