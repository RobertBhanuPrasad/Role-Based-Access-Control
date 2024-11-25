import { create } from "zustand";


interface UsersStore {
    usersData: any;
    setUsersData: (by: any) => void;
}


export const usersStore = create<UsersStore>((set) => ({
    usersData: null,


    setUsersData: (data: any) => {
        set(() => ({
            usersData: data,
        }));
      },
    }));