import { useEffect, useState } from "react";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const Users = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(
                `${SERVER_URL}/api/admin/users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUsers(response.data.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const makeAdmin = async (id) => {
        try {
            await axios.put(
                `${SERVER_URL}/api/admin/users/${id}/make-admin`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchUsers();
        } catch (error) {
            console.error("Error making user admin:", error);
        }
    };

    const removeAdmin = async (id) => {
        try {
            await axios.put(
                `${SERVER_URL}/api/admin/users/${id}/remove-admin`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchUsers();
        } catch (error) {
            console.error("Error removing admin role:", error);
        }
    };

    const banUser = async (id) => {
        try {
            await axios.put(
                `${SERVER_URL}/api/admin/ban/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchUsers();
        } catch (error) {
            console.error("Error banning user:", error);
        }
    };

    const unbanUser = async (id) => {
        try {
            await axios.put(
                `${SERVER_URL}/api/admin/unban/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchUsers();
        } catch (error) {
            console.error("Error unbanning user:", error);
        }
    };

    const suspendUser = async (id) => {
        try {
            await axios.put(                
                `${SERVER_URL}/api/admin/suspend/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchUsers();
        } catch (error) {
            console.error("Error suspending user:", error);
        }
    };

    const unsuspendUser = async (id) => {
        try {
            await axios.put(
                `${SERVER_URL}/api/admin/unsuspend/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchUsers();
        } catch (error) {
            console.error("Error unsuspending user:", error);
        }
    };

    return (
        <div className="flex">
            <div className="flex-1">
                <div className="p-6">
                    <h2 className="text-xl mb-4">Users</h2>

                    <table className="w-full border border-gray-300 border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-3 border">Name</th>
                                <th className="p-3 border">Email</th>
                                <th className="p-3 border">Role</th>
                                <th className="p-3 border text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-100">
                                    <td className="p-3 border">{user.name}</td>
                                    <td className="p-3 border">{user.email}</td>
                                    <td className="p-3 border capitalize">{user.role}</td>

                                    <td className="p-3 border text-center space-x-2">
                                        {user.role !== "admin" && user.role !== "superadmin" && (
                                            <button
                                                onClick={() => makeAdmin(user.id)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                            >
                                                Make Admin
                                            </button>
                                        )}

                                        {user.role === "admin" && user.role !== "superadmin" && (
                                            <button
                                                onClick={() => removeAdmin(user.id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                            >
                                                Remove
                                            </button>
                                        )}

                                        {user.role !== "banned" && user.role !== "superadmin" && (
                                            <button
                                                onClick={() => banUser(user.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                            >
                                                Ban
                                            </button>
                                        )}
                                        
                                        {user.role === "banned" && (
                                            <button
                                                onClick={() => unbanUser(user.id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                            >   
                                                Unban
                                            </button>
                                        )}

                                        {user.role !== "suspended" && user.role !== "superadmin" && (
                                            <button
                                                onClick={() => suspendUser(user.id)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                            >
                                                Suspend
                                            </button>
                                        )}

                                        {user.role === "suspended" && (
                                            <button
                                                onClick={() => unsuspendUser(user.id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                            >
                                                Unsuspend
                                            </button>
                                        )}

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;