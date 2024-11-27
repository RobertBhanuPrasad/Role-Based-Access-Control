import { create } from "zustand";


interface UsersStore {
    usersData: any;
    setUsersData: (by: any) => void;

    rolesData: any;
    setRolesData: (by: any) => void;
    
    roleDefaultData: any;
    setRolesDefaultData: (by: any) => void;

    permissionsDefaultData: any;
    setPermissionsDefaultData: (by: any) => void;
}


export const usersStore = create<UsersStore>((set) => ({
    usersData: null,
    rolesData: null,
    roleDefaultData: null,
    permissionsDefaultData: null,


    setUsersData: (data: any) => {
        set(() => ({
            usersData: data,
        }));
      },

    setRolesData: (data: any) => {
        set(() => ({
            rolesData: data,
        }))
    },

    setRolesDefaultData: (data: any) => {
        set(() => ({
            roleDefaultData: data
        }));
    },

    setPermissionsDefaultData: (data: any) => {
        set(() => ({
            roleDefaultData: data
        }));
    },
    }));