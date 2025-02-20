import React from 'react'
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const user = true;
    const cart = [0,1,2,3]
    const isAdmin = true;
    return (
        <header className='fixed top-0 left-0 w-full bg-gray-800 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-blue-400'>
            <div className='container mx-auto px-4 py-3'>
                <Link to='/' className='text-2xl font-bold text-blue-400 items-center space-x-2 flex'>E-Commerce</Link>
                <nav className='flex flex-wrap items-center gap-4'>
                    <Link
                        to={"/"}
                        className='text-gray-300 hover:text-blue-400 transition duration-300
					 ease-in-out'
                    >
                        Home
                    </Link>

                    {user && (
                        <Link to={'/cart'} className='relative group text-gray-300 hover:text-blue-400 transition duration-300 
							ease-in-out'>
                            <ShoppingCart className='inline-block mr-1 group-hover:text-blue-400' size={20} />
                            <span className='hidden sm:inline'>Cart</span>
                            {cart.length > 0 && (
                                <span
                                    className='absolute -top-2 -left-2 bg-blue-500 text-white rounded-full px-2 py-0.5 
									text-xs group-hover:bg-blue-400 transition duration-300 ease-in-out'
                                >
                                    3
                                </span>
                            )}
                        </Link>
                    )}

                    {isAdmin && (
							<Link
								className='bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center'
								to={"/secret-dashboard"}
							>
								<Lock className='inline-block mr-1' size={18} />
								<span className='hidden sm:inline'>Dashboard</span>
							</Link>
						)}
                </nav>
            </div>
        </header>
    )
}

export default Navbar