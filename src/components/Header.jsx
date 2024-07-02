import { FaHotel } from "react-icons/fa";
import { Link } from 'react-router-dom';
export const Header = () => {
  return (
    <header className='sticky top-0 z-50 w-full bg-blue-600 shadow-xl border-b border-blue-700'>
      <nav className='flex justify-between items-center py-4 px-6'>
      <Link to="/">
        
        <div className='flex items-center text-white'>
        <FaHotel className="w-8 h-8 mr-2 text-white" />
          <p className='text-2xl font-bold'>DalVacationHome</p>
        </div>
        </Link>

        <div className='flex items-center space-x-6'>
          <div className='text-lg text-white cursor-pointer hover:underline transform hover:scale-105 transition duration-200'>
            Login
          </div>
          <div className='border-l-2 border-solid border-blue-300 h-6'></div>
          <div className='text-lg text-white cursor-pointer hover:underline transform hover:scale-105 transition duration-200'>
            Register
          </div>
        </div>
      </nav>
    </header>
  );
};
