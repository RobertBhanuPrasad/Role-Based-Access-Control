import { create } from "zustand";


interface UsersStore {
    usersData: any;
    setUsersData: (by: any) => void;

    rolesData: any;
    setRolesData: (by: any) => void;
}


export const usersStore = create<UsersStore>((set) => ({
    usersData: null,
    rolesData: null,


    setUsersData: (data: any) => {
        set(() => ({
            usersData: data,
        }));
      },

    setRolesData: (data: any) => {
        set(() => ({
            rolesData: data,
        }))
    }
    }));