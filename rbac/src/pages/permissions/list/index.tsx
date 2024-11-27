// import { supabase } from '@/utility/SupabaseClient';
// import { Button } from '@/components/ui/button';
// import { MoreVertical } from "lucide-react";
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';

// interface Permission {
//     name: string;
//     type: string;
//     category: string;
//     description: string;
//     updated_at: string;
//     id: number;
// }

// export default function CrudTable() {
//     const router = useRouter()
//     const [data, setData] = useState<Permission[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]); // Stores selected permission IDs
//     const [bulkAction, setBulkAction] = useState<string | null>(null); // Tracks dropdown action
//     const [currentPage, setCurrentPage] = useState<number>(1); // Track the current page
//     const rowsPerPage = 10; // Number of rows displayed per page

//     // Fetch data on component mount
//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = async () => {
//         setLoading(true);
//         // Fetch the permissions data sorted by id in descending order
//         const { data, error } = await supabase.from('permissions').select('*').order('id', { ascending: false });
//         if (error) {
//             console.error(error);
//         } else {
//             setData(data); // Update the data state with the fetched data
//         }
//         setLoading(false);
//     };

//     // Function to handle deletion of a row
//     const deleteRow = (id: number) => {
//         setData((prev) => prev.filter((row) => row.id !== id)); // Remove deleted row from data
//     };

//     // Toggle permission selection for bulk action
//     const toggleSelection = (id: number) => {
//         setSelectedPermissions((prev) =>
//             prev.includes(id) ? prev.filter((permissionId) => permissionId !== id) : [...prev, id] // Add/remove the permission ID from selected list
//         );
//     };

//     // Function to select all permissions on the current page
//     const toggleSelectAll = (selectAll: boolean) => {
//         if (selectAll) {
//             // If selecting all, add the permission IDs of the current page to selectedPermissions
//             setSelectedPermissions((prev) => [
//                 ...prev,
//                 ...paginatedData.map((permission) => permission.id).filter((id) => !prev.includes(id)),
//             ]);
//         } else {
//             // Deselect all permissions on the current page
//             setSelectedPermissions((prev) =>
//                 prev.filter((id) => !paginatedData.map((permission) => permission.id).includes(id))
//             );
//         }
//     };

//     // Paginated Data based on the current page
//     const paginatedData = data.slice(
//         (currentPage - 1) * rowsPerPage, // Start index for the current page
//         currentPage * rowsPerPage // End index for the current page
//     );

//     // Handle page change
//     const handlePageChange = (newPage: number) => {
//         setCurrentPage(newPage); // Update the current page when a button is clicked
//     };

//     // Function to handle bulk status change
//     const handleBulkStatusChange = async (status: string) => {
//         if (!selectedPermissions.length) {
//             alert('Please select at least one permission.');
//             return;
//         }

//         try {
//             const { error } = await supabase
//                 .from('permissions')
//                 .update({ status })
//                 .in('id', selectedPermissions);

//             if (error) {
//                 console.error('Bulk update error:', error);
//                 alert('Failed to update statuses. Please try again.');
//             } else {
//                 alert('Statuses updated successfully.');
//                 fetchData(); // Refresh data after bulk update
//                 setSelectedPermissions([]); // Reset selection after update
//                 setBulkAction(null); // Reset bulk action
//             }
//         } catch (err) {
//             console.error('Unexpected error:', err);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-blue-100 p-6">
//             <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-4">
//                 <h1 className="text-xl font-bold mb-4 text-center text-blue-600">Permission Management</h1>

//                 {/* Bulk Action Dropdown */}
//                 <div className="mb-4 flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                         <label htmlFor="bulkAction" className="sr-only">Bulk Action</label>
//                         <select
//                             id="bulkAction"
//                             className="border border-blue-300 px-3 py-1 rounded text-black"
//                             value={bulkAction || ''}
//                             onChange={(e) => setBulkAction(e.target.value)}
//                             disabled={!selectedPermissions?.length}
//                         >
//                             <option value="" disabled={!selectedPermissions}>
//                                 Bulk Action
//                             </option>
//                             <option value="active">Set Active</option>
//                             <option value="inactive">Set Inactive</option>
//                         </select>
//                         <Button
//                             type="button"
//                             variant="secondary"
//                             className="h-[40px] rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//                             disabled={!bulkAction}
//                             onClick={() => handleBulkStatusChange(bulkAction!)}
//                         >
//                             Apply
//                         </Button>
//                     </div>
//                     <Button
//                         type="button"
//                         variant="secondary"
//                         className="h-[40px] rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//                         onClick={() => router.push("/permissions/add")}
//                     >
//                         Create Permission
//                     </Button>
//                 </div>

//                 {/* Loading Indicator */}
//                 {loading ? (
//                     <p className="text-center text-blue-600">Loading...</p>
//                 ) : (
//                     <div className="overflow-x-auto">
//                         {/* Table */}
//                         <table className="w-full table-auto border border-blue-300">
//                             <thead className="bg-blue-200">
//                                 <tr>
//                                     <th className="px-4 py-2 border text-black">
//                                         <input
//                                             type="checkbox"
//                                             onChange={(e) => toggleSelectAll(e.target.checked)}
//                                             checked={paginatedData.every((row) => selectedPermissions.includes(row.id))}
//                                         />
//                                     </th>
//                                     <th className="px-4 py-2 border text-black">Name</th>
//                                     <th className="px-4 py-2 border text-black">Type</th>
//                                     <th className="px-4 py-2 border text-black">Category</th>
//                                     <th className="px-4 py-2 border text-black">Description</th>
//                                     <th className="px-4 py-2 border text-black">Updated At</th>
//                                     <th className="px-4 py-2 border text-black">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {paginatedData.map((row) => (
//                                     <tr key={row.name} className="hover:bg-blue-50">
//                                         <td className="px-4 py-2 border text-center">
//                                             <input
//                                                 type="checkbox"
//                                                 checked={selectedPermissions.includes(row.id)}
//                                                 onChange={() => toggleSelection(row.id)}
//                                             />
//                                         </td>
//                                         <td className="px-4 py-2 border text-center text-blue-500">
//                                                 {row?.name || '-'}
//                                         </td>
//                                         <td className="px-4 py-2 border text-center text-black">
//                                             {row?.type || '-'}
//                                         </td>
//                                         <td className="px-4 py-2 border text-center text-black">
//                                             {row?.category || '-'}
//                                         </td>
//                                         <td className="px-4 py-2 border text-center text-black">
//                                             {row?.description || '-'}
//                                         </td>
//                                         <td className="px-4 py-2 border text-center text-black">
//                                             {row?.updated_at || '-'}
//                                         </td>
//                                         <td className="px-4 py-2 border text-center">
//                                             <PermissionActions permissionId={row.id} onDelete={deleteRow} />
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}

//                 {/* Pagination */}
//                 <div className="mt-4 flex flex-row justify-between">
//                     <Button
//                         type="button"
//                         variant="secondary"
//                         className="h-[40px]  rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                     >
//                         Previous
//                     </Button>
//                     <span className="mx-4 text-black">Page {currentPage}</span>
//                     <Button
//                         type="button"
//                         variant="secondary"
//                         className="h-[40px]  rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage * rowsPerPage >= data.length}
//                     >
//                         Next
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// }


// export const PermissionActions = ({ permissionId, onDelete }) => {
//     const router = useRouter();

//     const permissionOptions = [
//         { value: 'edit', label: 'Edit', isEnable: true },
//         { value: 'view', label: 'View', isEnable: true },
//         { value: 'delete', label: 'Delete', isEnable: true },
//     ];

//     const handleAction = async (action) => {
//         if (action === 'edit') {
//             router.push(`/permissions/${permissionId}/edit`);
//         } else if (action === 'view') {
//             router.push(`/permissions/${permissionId}`);
//         } else if (action === 'delete') {
//             const confirmDelete = window.confirm('Are you sure you want to delete this role?');
//             if (confirmDelete) {
//                 onDelete(permissionId);
//                 const { error } = await supabase.from('permissions').delete().eq('id', permissionId);
//                 if (error) {
//                     console.error(error);
//                 }
//             }
//         }
//     };

//     return (
//        <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button
//                     variant="ghost"
//                     className="h-8 w-8 p-0 text-[#7677F4] hover:text-[#7677F4]"
//                 >
//                     <MoreVertical className="h-6 w-6" />
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent
//                 align="end"
//                 className="max-h-[300px] max-w-[170px] overflow-y-auto text-[#333333] bg-white w-[100px] text-left shadow-lg rounded-lg"
//             >
//                 {permissionOptions?.map((option) => {
//                     if (option?.isEnable) {
//                         return (
//                             <DropdownMenuItem
//                                 key={option?.value}
//                                 className="cursor-pointer  hover:bg-blue-300 hover:text-white px-3 py-1 text-center"
//                                 onClick={() => handleAction(option?.value)}
//                             >
//                                 {option?.label}
//                             </DropdownMenuItem>
//                         );
//                     }
//                 })}
//             </DropdownMenuContent>
//         </DropdownMenu>
//     );
// };





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
    const router = useRouter();
    const [data, setData] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
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
                <h1 className="text-xl font-bold mb-4 text-center text-blue-600">Permission Management</h1>

                {/* Create Permission Button */}
                <div className="mb-4 flex justify-start">
                    <Button
                        type="button"
                        variant="secondary"
                        className="h-[40px] rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        onClick={() => router.push("/permissions/add")}
                    >
                        Create Permission
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
                                        <td className="px-4 py-2 border text-center text-blue-500">
                                            {row?.name || '-'}
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
                        className="h-[40px] rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="mx-4 text-black">Page {currentPage}</span>
                    <Button
                        type="button"
                        variant="secondary"
                        className="h-[40px] rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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

export const PermissionActions = ({ permissionId, onDelete }) => {
    const router = useRouter();

    const permissionOptions = [
        { value: 'edit', label: 'Edit', isEnable: true },
        { value: 'create', label: 'Create', isEnable: true },
        { value: 'delete', label: 'Delete', isEnable: true },
    ];

    const handleAction = async (action) => {
        if (action === 'edit') {
            router.push(`/permissions/${permissionId}/edit`);
        } else if (action === 'view') {
            router.push(`/permissions/${permissionId}`);
        } else if (action === 'delete') {
            const confirmDelete = window.confirm('Are you sure you want to delete this role?');
            if (confirmDelete) {
                onDelete(permissionId);
                const { error } = await supabase.from('permissions').delete().eq('id', permissionId);
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
                {permissionOptions?.map((option) => {
                    if (option?.isEnable) {
                        return (
                            <DropdownMenuItem
                                key={option?.value}
                                className="cursor-pointer hover:bg-blue-300 hover:text-white px-3 py-1 text-center"
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
