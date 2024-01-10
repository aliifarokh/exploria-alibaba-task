import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import users from '../data/records.json';

const UserTable = () => {
    const location = useLocation();
    const history = useNavigate();

    const queryParams = new URLSearchParams(location.search);

    const [search, setSearch] = useState(queryParams.get('filter') || '');
    const [sortOrder, setSortOrder] = useState(queryParams.get('sortOrder') || 'asc');
    const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || 'id');
    const [currentPage, setCurrentPage] = useState(parseInt(queryParams.get('page'), 10) || 1);

    const itemsPerPage = 50;

    const handleSort = (column) => {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
        setSortBy(column);
        setCurrentPage(1); // Reset to the first page after sorting

        // Update URL
        queryParams.set('sortOrder', sortOrder);
        queryParams.set('sortBy', column);
        queryParams.set('page', '1');
        history({ search: queryParams.toString() });
    };

    const keys = ['name', 'address', 'phone'];

    const filteredUsers = (users) => {
        return users.filter((user) =>
            keys.some((key) => user[key].toLowerCase().includes(search.toLowerCase()))
        );
    };

    const sortedUsers = (users) => {
        return [...users].sort((a, b) => {
            const valueA = a[sortBy];
            const valueB = b[sortBy];

            if (sortOrder === 'asc') {
                return valueA.localeCompare(valueB);
            } else {
                return valueB.localeCompare(valueA);
            }
        });
    };

    const pageCount = Math.ceil(filteredUsers(users).length / itemsPerPage);
    const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

    const paginatedUsers = sortedUsers(filteredUsers(users)).slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1); // Reset to the first page after filtering
    }, [search, sortOrder, sortBy]);

    const handlePageChange = (page) => {
        setCurrentPage(page);

        // Update URL
        queryParams.set('page', page.toString());
        history({ search: queryParams.toString() });
    };

    return (
        <div className="w-full 2xl:container flex-col mx-auto bg-[#d4d637] p-5 flex justify-center items-center">
            <input
                type="text"
                value={search}
                className="my-5 p-3 outline-none"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
            />

            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('id')}>User ID</th>
                        <th onClick={() => handleSort('name')}>Name</th>
                        <th onClick={() => handleSort('date')}>Date of Registration</th>
                        <th onClick={() => handleSort('address')}>Address</th>
                        <th onClick={() => handleSort('phone')}>Phone Number</th>
                    </tr>
                </thead>

                <tbody>
                    {paginatedUsers.map((user) => (
                        <tr className='border border-black' key={user.id}>
                            <td className='py-2'>{user.id}</td>
                            <td className='py-2'>{user.name}</td>
                            <td className='py-2'>{user.date}</td>
                            <td className='py-2'>{user.address}</td>
                            <td className='py-2'>{user.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className='flex flex-wrap gap-3 my-5 px-5'>
                {pages.map((item) => (
                    <button
                        className={`size-8 rounded-full ${currentPage === item ? 'bg-black text-white' : 'bg-white text-black'
                            }`}
                        key={item}
                        onClick={() => handlePageChange(item)}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default UserTable;
