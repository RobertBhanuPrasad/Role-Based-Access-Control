import { supabase } from '@/utility/SupabaseClient';
import { Button } from '@/components/ui/button';
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Role {
    id: number;
    name: string;
    description: string;
    updated_at: string;
}
export default function RolesTable() {
    const router = useRouter()
    const [data, setData] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState<number>(1); // Track the current page
    const rowsPerPage = 10; // Number of rows displayed per page

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        // Fetch the roles data sorted by id in descending order
        const { data, error } = await supabase.from('roles').select('*').order('id', { ascending: false });
        if (error) {
            console.error(error);
        } else {
            setData(data); // Update the data state with the fetched data
        }
        setLoading(false);
    };

    // Function to handle deletion of a role
    const deleteRole = (id: number) => {
        setData((prev) => prev.filter((role) => role.id !== id)); // Remove deleted role from data
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


    return (
        <div className="min-h-screen bg-blue-100 p-6">
            <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-4">
                <h1 className="text-xl font-bold mb-4 text-center text-blue-600">Role Management</h1>

                <div className="mb-4 flex items-center justify-between">
                    <Button
                        type="button"
                        variant="secondary"
                        className="h-[40px] rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        onClick={() => router.push("/roles/add")}
                    >
                        Create Role
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
                                    <th className="px-4 py-2 border text-black">Role Name</th>
                                    <th className="px-4 py-2 border text-black">Description</th>
                                    <th className="px-4 py-2 border text-black">Updated At</th>
                                    <th className="px-4 py-2 border text-black">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((role) => (
                                    <tr key={role.id} className="hover:bg-blue-50">
                                        <td className="px-4 py-2 border text-center text-blue-500">
                                            {role?.name || '-'}
                                        </td>
                                        <td className="px-4 py-2 border text-center text-black">
                                            {role?.description || '-'}
                                        </td>
                                        <td className="px-4 py-2 border text-center text-black">
                                            {role?.updated_at || '-'}
                                        </td>
                                        <td className="px-4 py-2 border text-center">
                                            <RoleActions roleId={role.id} onDelete={deleteRole} />
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


export const RoleActions = ({ roleId, onDelete }) => {
    const router = useRouter();

    const roleOptions = [
        { value: 'edit', label: 'Edit', isEnable: true },
        { value: 'create', label: 'Create', isEnable: true },
        { value: 'delete', label: 'Delete', isEnable: true },
    ];

    const handleAction = async (action) => {
        if (action === 'edit') {
            router.push(`/roles/${roleId}/edit`);
        } else if (action === 'view') {
            router.push(`/roles/${roleId}`);
        } else if (action === 'delete') {
            const confirmDelete = window.confirm('Are you sure you want to delete this role?');
            if (confirmDelete) {
                onDelete(roleId);
                const { error } = await supabase.from('roles').delete().eq('id', roleId);
                if (error) {
                    console.error(error);
                }
            }
        }
    };

    return (
       <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 text-blue-500 hover:text-blue-500"
                >
                    <MoreVertical className="h-6 w-6" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="max-h-[300px] max-w-[170px] overflow-y-auto text-[#333333] bg-white w-[100px] text-left shadow-lg rounded-lg"
            >
                {roleOptions?.map((option) => {
                    if (option?.isEnable) {
                        return (
                            <DropdownMenuItem
                                key={option?.value}
                                className="cursor-pointer  hover:bg-blue-300 hover:text-white px-3 py-1 text-center"
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
