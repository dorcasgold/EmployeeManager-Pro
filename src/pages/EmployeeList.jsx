import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { UserAuth } from '../context/AuthContext';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const { user } = UserAuth() || {};

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesCollection = collection(firestore, 'employees');
        const employeeSnapshot = await getDocs(employeesCollection);
        const employeeList = employeeSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEmployees(employeeList);
      } catch (error) {
        console.error("Error fetching employees: ", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const employeeDoc = doc(firestore, 'employees', id);
      await deleteDoc(employeeDoc);
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (error) {
      console.error("Error deleting employee: ", error);
    }
  };

  if (user) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Employee List</h2>
        <div className='flex gap-2'>
          <Link to="/employees/create" className="bg-green-500 text-white py-2 px-4 rounded mb-4 inline-block">Create Employee</Link>
          <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded mb-4 inline-block">Log Out</button>
        </div>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border-b py-2 px-4">No</th>
              <th className="border-b py-2 px-4">First Name</th>
              <th className="border-b py-2 px-4">Last Name</th>
              <th className="border-b py-2 px-4">Age</th>
              <th className="border-b py-2 px-4">Salary</th>
              <th className="border-b py-2 px-4">Date</th>
              <th className="border-b py-2 px-4">Category</th>
              <th className="border-b py-2 px-4">Image</th>
              <th className="border-b py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp.id}>
                <td className="border-b py-2 px-4">{index + 1}</td>
                <td className="border-b py-2 px-4">{emp.firstName}</td>
                <td className="border-b py-2 px-4">{emp.lastName}</td>
                <td className="border-b py-2 px-4">{emp.age}</td>
                <td className="border-b py-2 px-4">${emp.salary}</td>
                <td className="border-b py-2 px-4">{emp.date}</td>
                <td className="border-b py-2 px-4">{emp.category}</td>
                <td className="border-b py-2 px-4">
                  <img src={emp.image} alt={emp.firstName} className="w-16 h-16 object-cover" />
                </td>
                <td className="border-b py-2 px-4">
                  <Link to={`/employees/edit/${emp.id}`} className="bg-yellow-500 text-white py-1 px-2 rounded mr-2">Edit</Link>
                  <button onClick={() => handleDelete(emp.id)} className="bg-red-500 text-white py-1 px-2 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    return <Navigate to='/' />
  }
};

export default EmployeeList;
