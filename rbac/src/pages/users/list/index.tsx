import { supabase } from '@/utility/SupabaseClient';
import { Button } from '@/components/ui/button';
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger , DropdownMenuContent, DropdownMenuItem} from '@radix-ui/react-dropdown-menu';
import { useState, useEffect } from 'react';


export default function CrudTable() {
    interface User {
        user_code: string;
        full_name: string;
        email: string;
        status: string;
        role: string;
        updated_at: string;
        id: number;
    }

    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('users').select('*');
        if (error) {
            console.error(error);
        } else {
            setData(data);
        }
        setLoading(false);
    };

    const deleteRow = (id: any) => {
        setData((prev) => prev.filter((row) => row.id !== id));
    };

    return (
        <div className="min-h-screen bg-violet-100 p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4">
                <h1 className="text-xl font-bold mb-4 text-center text-violet-600">User Management</h1>

                {loading ? (
                    <p className="text-center text-violet-600">Loading...</p>
                ) : (
                    <table className="w-full border border-violet-300">
                        <thead className="bg-violet-200">
                            <tr>
                                <th className="px-4 py-2 border text-violet-700">User Code</th>
                                <th className="px-4 py-2 border text-violet-700">Full Name</th>
                                <th className="px-4 py-2 border text-violet-700">Email</th>
                                <th className="px-4 py-2 border text-violet-700">Status</th>
                                <th className="px-4 py-2 border text-violet-700">Role</th>
                                <th className="px-4 py-2 border text-violet-700">Updated At</th>
                                <th className="px-4 py-2 border text-violet-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row) => (
                                <tr key={row.user_code} className="hover:bg-violet-50">
                                    <td className="px-4 py-2 border text-center text-violet-800">{row.user_code}</td>
                                    <td className="px-4 py-2 border text-violet-800">{row?.full_name}</td>
                                    <td className="px-4 py-2 border text-violet-800">{row.email}</td>
                                    <td className="px-4 py-2 border text-violet-800">{row.status}</td>
                                    <td className="px-4 py-2 border text-violet-800">{row.role}</td>
                                    <td className="px-4 py-2 border text-violet-800">{row.updated_at}</td>
                                    <td className="px-4 py-2 border text-center">
                                        <UserActions participantId={row.id} onDelete={deleteRow} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}


export const UserActions = ({ participantId, onDelete }) => {
    const transferParticipantActions = [
        { value: 'edit', label: 'Edit', isEnable: true },
        { value: 'view', label: 'View', isEnable: true },
        { value: 'create', label: 'Create', isEnable: true },
        { value: 'delete', label: 'Delete', isEnable: true },
    ];

    const handleAction = async (action) => {
        if (action === 'delete') {
            const confirmed = window.confirm('Are you sure you want to delete this participant?');
            if (confirmed) {
                try {
                    const { error } = await supabase
                        .from('users')
                        .delete()
                        .eq('id', participantId);

                    if (error) {
                        console.error('Error deleting participant:', error);
                        alert('Failed to delete participant. Please try again.');
                    } else {
                        alert('Participant deleted successfully.');
                        // Notify the parent component to remove the participant from state
                        onDelete(participantId);
                    }
                } catch (err) {
                    console.error('Unexpected error:', err);
                }
            }
        } else {
            console.log(`Action selected: ${action}`);
            // Handle other actions here (e.g., edit, view, create)
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
                className="max-h-[300px] max-w-[170px] overflow-y-auto text-[#333333] bg-white w-[90px] rounded-xl"
            >
                {transferParticipantActions.map((option) => {
                    if (option?.isEnable) {
                        return (
                            <DropdownMenuItem
                                key={option.value}
                                className="cursor-pointer hover:!bg-[#7677F41A] hover:!text-[#7677F4]"
                                onClick={() => handleAction(option.value)}
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

