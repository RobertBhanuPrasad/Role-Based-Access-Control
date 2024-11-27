import { supabase } from '@/utility/SupabaseClient';
import { Button } from '@/components/ui/button';
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface User {
    user_code: string;
    full_name: string;
    email: string;
    status: string;
    role: string;
    updated_at: string;
    id: number;
}
export default function CrudTable() {
    const router = useRouter()
    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]); // Stores selected user IDs
    const [bulkAction, setBulkAction] = useState<string | null>(null); // Tracks dropdown action
    const [currentPage, setCurrentPage] = useState<number>(1); // Track the current page
    const rowsPerPage = 10; // Number of rows displayed per page
    console.log(currentPage, "currentpagebhanu")

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        // Fetch the users data sorted by id in descending order
        const { data, error } = await supabase.from('users').select('*').order('id', { ascending: false });
        if (error) {
            console.error(error);
        } else {
            setData(data); // Update the data state with the fetched data
        }
        setLoading(false);
    };

    // Function to handle deletion of a row
    const deleteRow = (id: number) => {
        setData((prev) => prev.filter((row) => row.id !== id)); // Remove deleted row from data
    };

    // Toggle user selection for bulk action
    const toggleSelection = (id: number) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id] // Add/remove the user ID from selected list
        );
    };

    // Function to select all users on the current page
    const toggleSelectAll = (selectAll: boolean) => {
        if (selectAll) {
            // If selecting all, add the user IDs of the current page to selectedUsers
            setSelectedUsers((prev) => [
                ...prev,
                ...paginatedData.map((user) => user.id).filter((id) => !prev.includes(id)),
            ]);
        } else {
            // Deselect all users on the current page
            setSelectedUsers((prev) =>
                prev.filter((id) => !paginatedData.map((user) => user.id).includes(id))
            );
        }
    };

    // Paginated Data based on the current page
    const paginatedData = data.slice(
        (currentPage - 1) * rowsPerPage, // Start index for the current page
        currentPage * rowsPerPage // End index for the current page
    );

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage); // Update the current page when a button is clicked
    };

    // Function to handle bulk status change
    const handleBulkStatusChange = async (status: string) => {
        if (!selectedUsers.length) {
            alert('Please select at least one user.');
            return;
        }

        try {
            const { error } = await supabase
                .from('users')
                .update({ status })
                .in('id', selectedUsers);

            if (error) {
                console.error('Bulk update error:', error);
                alert('Failed to update statuses. Please try again.');
            } else {
                alert('Statuses updated successfully.');
                fetchData(); // Refresh data after bulk update
                setSelectedUsers([]); // Reset selection after update
                setBulkAction(null); // Reset bulk action
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-blue-100 p-6">
            <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-4">
                <h1 className="text-xl font-bold mb-4 text-center text-blue-600">User Management</h1>

                {/* Bulk Action Dropdown */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <label htmlFor="bulkAction" className="sr-only">Bulk Action</label>
                        <select
                            id="bulkAction"
                            className="border border-blue-300 px-3 py-1 rounded text-black"
                            value={bulkAction || ''}
                            onChange={(e) => setBulkAction(e.target.value)}
                            disabled={!selectedUsers?.length}
                        >
                            <option value="" disabled={!selectedUsers}>
                                Bulk Action
                            </option>
                            <option value="active">Set Active</option>
                            <option value="inactive">Set Inactive</option>
                        </select>
                        <Button
                            type="button"
                            variant="secondary"
                            className="h-[40px] rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                            disabled={!bulkAction}
                            onClick={() => handleBulkStatusChange(bulkAction!)}
                        >
                            Apply
                        </Button>
                    </div>
                    <Button
                        type="button"
                        variant="secondary"
                        className="h-[40px] rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        onClick={() => router.push("/users/add")}
                    >
                        Add User
                    </Button>
                </div>


                {/* Loading Indicator */}
                {loading ? (
                    <p className="text-center text-blue-600">Loading...</p>
                ) : (
                    <div className="overflow-x-auto">
                        {/* Table */}
                        <table className="w-full table-auto border border-blue-300">
                            <thead className="bg-blue-200">
                                <tr>
                                    <th className="px-4 py-2 border text-black">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => toggleSelectAll(e.target.checked)}
                                            checked={paginatedData.every((row) => selectedUsers.includes(row.id))}
                                        />
                                    </th>
                                    <th className="px-4 py-2 border text-black">User Code</th>
                                    <th className="px-4 py-2 border text-black">Full Name</th>
                                    <th className="px-4 py-2 border text-black">Email</th>
                                    <th className="px-4 py-2 border text-black">Status</th>
                                    <th className="px-4 py-2 border text-black">Role</th>
                                    <th className="px-4 py-2 border text-black">Updated At</th>
                                    <th className="px-4 py-2 border text-black">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((row) => (
                                    <tr key={row.user_code} className="hover:bg-blue-50">
                                        <td className="px-4 py-2 border text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(row.id)}
                                                onChange={() => toggleSelection(row.id)}
                                            />
                                        </td>
                                        <td className="px-4 py-2 border text-center text-blue-500">
                                            <Link href={`/users/${row.user_code}`}>
                                                {row?.user_code || '-'}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-2 border text-center text-black">
                                            {row?.full_name || '-'}
                                        </td>
                                        <td className="px-4 py-2 border text-center text-black">
                                            {row?.email || '-'}
                                        </td>
                                        <td className={`px-4 py-2 border font-semibold text-center text-black ${row.status === 'active'
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                            }`}>
                                            {row?.status || '-'}
                                        </td>
                                        <td className="px-4 py-2 border text-center text-black">
                                            {row?.role || '-'}
                                        </td>
                                        <td className="px-4 py-2 border text-center text-black">
                                            {row?.updated_at || '-'}
                                        </td>
                                        <td className="px-4 py-2 border text-center">
                                            <UserActions userId={row.id} onDelete={deleteRow} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-4 flex flex-row justify-between">
                    <Button
                        type="button"
                        variant="secondary"
                        className="h-[40px]  rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="mx-4 text-black">Page {currentPage}</span>
                    <Button
                        type="button"
                        variant="secondary"
                        className="h-[40px]  rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={paginatedData.length < rowsPerPage}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}


export const UserActions = ({ userId, onDelete }) => {
    const router = useRouter();

    const userOptions = [
        { value: 'edit', label: 'Edit', isEnable: true },
        { value: 'view', label: 'View', isEnable: true },
        { value: 'create', label: 'Create', isEnable: true },
        { value: 'delete', label: 'Delete', isEnable: true },
    ];

    const handleAction = async (action) => {
        if (action === 'edit') {
            router.push(`/users/${userId}/edit`);
        } else if (action === 'create') {
            router.push(`/users/add`);
        } else if (action === 'delete') {
            const confirmed = window.confirm('Are you sure you want to delete this participant?');
            if (confirmed) {
                try {
                    const { error } = await supabase.from('users').delete().eq('id', userId);
                    if (error) {
                        console.error('Error deleting participant:', error);
                        alert('Failed to delete participant. Please try again.');
                    } else {
                        alert('Participant deleted successfully.');
                        onDelete(userId);
                    }
                } catch (err) {
                    console.error('Unexpected error:', err);
                }
            }
        } else {
            console.log(`Action selected: ${action}`);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 text-[#7677F4] hover:text-[#7677F4]"
                >
                    <MoreVertical className="h-6 w-6" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="max-h-[300px] max-w-[170px] overflow-y-auto text-[#333333] bg-white w-[100px] text-left shadow-lg rounded-lg"
            >
                {userOptions?.map((option) => {
                    if (option?.isEnable) {
                        return (
                            <DropdownMenuItem
                                key={option?.value}
                                className="cursor-pointer  hover:bg-blue-300 hover:text-white px-3 py-1 text-center "
                                onClick={() => handleAction(option?.value)}
                            >
                                {option?.label}
                            </DropdownMenuItem>
                            
                        );
                    }
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
