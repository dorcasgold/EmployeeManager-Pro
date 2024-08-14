import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { UserAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { CiEdit } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';



function EmployeeList() {
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

  if (!user) {
    return <Navigate to='/' />;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Logout Successful",
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });

      // Proceed if confirmed
      if (result.isConfirmed) {
        const employeeDoc = doc(firestore, 'employees', id);

        // Delete the document from Firestore
        await deleteDoc(employeeDoc);

        // Update the local state to remove the deleted employee
        setEmployees((prevEmployees) =>
          prevEmployees.filter(emp => emp.id !== id)
        );

        // Show success notification
        Swal.fire({
          title: "Deleted!",
          text: 'employee has been deleted.',
          icon: "success"
        });
      }
    } catch (error) {
      console.error("Error deleting employee: ", error);
      Swal.fire({
        title: "Error!",
        text: "There was an issue deleting the employee.",
        icon: "error"
      });
    }
  };


  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: '#f2fff4',
    '&:hover': {
      // backgroundColor: '#e3e0d8',
      boxShadow: '1px 7px 7px 8px #718096',
      cursor: 'pointer'
    },
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: '#f2fff4',
    borderBottom: '1px solid #4bd15d',
  }));


  return (
    <div className='bg-gray-300 min-h-screen font-sans'>
      <nav className='flex flex-col lg:flex-row gap-5 justify-center lg:justify-between px-1 lg:px-10 bg-gray-100 py-5 items-center shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
        <p className='text-2xl lg:text-xl font-semibold text-orange-700 underline'>Employee Manager Pro</p>
        <div className='flex gap-8'>
          <Link to="/employees/create" className="bg-green-600 text-white py-2 px-3 rounded-lg font-medium inline-block">
            Add Employee
          </Link>
          <button onClick={handleLogout} className="bg-red-600 text-white py-2 px-5 font-medium rounded-lg inline-block">
            Log Out
          </button>
        </div>
      </nav>

      <div className="overflow-x-auto p-4 ">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>No</StyledTableCell>
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell>Employee</StyledTableCell>
                <StyledTableCell>Duration</StyledTableCell>
                <StyledTableCell>Age</StyledTableCell>
                <StyledTableCell>Salary</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Please Create an Employee To get started !!!
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((emp, index) => (
                  <StyledTableRow key={emp.id} >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <img src={emp.image} alt={emp.fullname} className="w-16 h-16 object-cover rounded-full" />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className='text-xl font-semibold'>{emp.fullname}</p>
                        <p className='text-green-500 font-semibold'>{emp.category}</p>
                      </div>
                    </TableCell>
                    <TableCell>{emp.duration}</TableCell>
                    <TableCell>{emp.age}</TableCell>
                    <TableCell>${emp.salary}</TableCell>
                    <TableCell>{emp.date}</TableCell>
                    <TableCell>{emp.category}</TableCell>
                    <TableCell>
                      <div className='flex gap-2'>
                        <IconButton onClick={() => navigate(`/employees/edit/${emp.id}`)} color="primary">
                          <CiEdit size={20} />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(emp.id)} color="secondary">
                          <FaRegTrashAlt size={20} />
                        </IconButton>
                      </div>
                    </TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default EmployeeList;
