import { supabase } from '@/utility/SupabaseClient';
import { Button } from '@/components/ui/button';
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Permission {
    name: string;
    type: string;
    category: string;
    description: string;
    updated_at: string;
    id: number;
}

export default function CrudTable() {
    const router = useRouter()
    const [data, setData] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]); // Stores selected permission IDs
    const [bulkAction, setBulkAction] = useState<string | null>(null); // Tracks dropdown action
    const [currentPage, setCurrentPage] = useState<number>(1); // Track the current page
    const rowsPerPage = 10; // Number of rows displayed per page

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        // Fetch the permissions data sorted by id in descending order
        const { data, error } = await supabase.from('permissions').select('*').order('id', { ascending: false });
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

    // Toggle permission selection for bulk action
    const toggleSelection = (id: number) => {
        setSelectedPermissions((prev) =>
            prev.includes(id) ? prev.filter((permissionId) => permissionId !== id) : [...prev, id] // Add/remove the permission ID from selected list
        );
    };

    // Function to select all permissions on the current page
    const toggleSelectAll = (selectAll: boolean) => {
        if (selectAll) {
            // If selecting all, add the permission IDs of the current page to selectedPermissions
            setSelectedPermissions((prev) => [
                ...prev,
                ...paginatedData.map((permission) => permission.id).filter((id) => !prev.includes(id)),
            ]);
        } else {
            // Deselect all permissions on the current page
            setSelectedPermissions((prev) =>
                prev.filter((id) => !paginatedData.map((permission) => permission.id).includes(id))
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
        if (!selectedPermissions.length) {
            alert('Please select at least one permission.');
            return;
        }

        try {
            const { error } = await supabase
                .from('permissions')
                .update({ status })
                .in('id', selectedPermissions);

            if (error) {
                console.error('Bulk update error:', error);
                alert('Failed to update statuses. Please try again.');
            } else {
                alert('Statuses updated successfully.');
                fetchData(); // Refresh data after bulk update
                setSelectedPermissions([]); // Reset selection after update
                setBulkAction(null); // Reset bulk action
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-blue-100 p-6">
            <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-4">
                <h1 className="text-xl font-bold mb-4 text-center text-blue-600">Permission Management</h1>

                {/* Bulk Action Dropdown */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <label htmlFor="bulkAction" className="sr-only">Bulk Action</label>
                        <select
                            id="bulkAction"
                            className="border border-blue-300 px-3 py-1 rounded text-black"
                            value={bulkAction || ''}
                            onChange={(e) => setBulkAction(e.target.value)}
                            disabled={!selectedPermissions?.length}
                        >
                            <option value="" disabled={!selectedPermissions}>
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
                        onClick={() => router.push("/permissions/add")}
                    >
                        Add Permission
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
                                            checked={paginatedData.every((row) => selectedPermissions.includes(row.id))}
                                        />
                                    </th>
                                    <th className="px-4 py-2 border text-black">Name</th>
                                    <th className="px-4 py-2 border text-black">Type</th>
                                    <th className="px-4 py-2 border text-black">Category</th>
                                    <th className="px-4 py-2 border text-black">Description</th>
                                    <th className="px-4 py-2 border text-black">Updated At</th>
                                    <th className="px-4 py-2 border text-black">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((row) => (
                                    <tr key={row.name} className="hover:bg-blue-50">
                                        <td className="px-4 py-2 border text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedPermissions.includes(row.id)}
                                                onChange={() => toggleSelection(row.id)}
                                            />
                                        </td>
                                        <td className="px-4 py-2 border text-center text-blue-500">
                                            <Link href={`/permissions/${row.name}`}>
                                                {row?.name || '-'}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-2 border text-center text-black">
                                            {row?.type || '-'}
                                        </td>
                                        <td className="px-4 py-2 border text-center text-black">
                                            {row?.category || '-'}
                                        </td>
                                        <td className="px-4 py-2 border text-center text-black">
                                            {row?.description || '-'}
                                        </td>
                                        <td className="px-4 py-2 border text-center text-black">
                                            {row?.updated_at || '-'}
                                        </td>
                                        <td className="px-4 py-2 border text-center">
                                            <PermissionActions permissionId={row.id} onDelete={deleteRow} />
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
                        disabled={currentPage * rowsPerPage >= data.length}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

const PermissionActions = ({ permissionId, onDelete }: { permissionId: number; onDelete: Function }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <MoreVertical className="cursor-pointer text-blue-600" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDelete(permissionId)}>Delete</DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={`/permissions/edit/${permissionId}`}>Edit</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
