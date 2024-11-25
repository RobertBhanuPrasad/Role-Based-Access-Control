import React from 'react'
import { CreateUserPage } from '../../add';
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import { usersStore } from '@/ZustandStore/UsersStore';
import { handleUserDetails } from '@/components/users/HandleDefaultValues';
import { useForm, FormProvider } from "react-hook-form";

const index = () => {
  return (
    <div><EditUserPage/></div>
  )
}

export default index;

export const EditUserPage = () => {
  const {
    setUsersData,
    usersData
  } = usersStore();
  const [isLoading, setIsLoading] = useState(true);
  const methods = useForm();
  const {
    query: { id },
  }: any = useRouter();
  const {query} = useRouter()

  console.log(query, "bhanuquery")
  useEffect(() => {
    console.log("bhanuprasad")
    if (id){

    const fetchDefaultValues = async () => {
      const defaultValues: any= await handleUserDetails(
        id,
      );
      console.log(defaultValues, "defaultvaluesbhanuprasad")
      setUsersData(defaultValues)
      setIsLoading(false);
    };
    fetchDefaultValues();
  }
  }, [id]);

  console.log(isLoading, "loadingprasad")

  if (isLoading) {
    return (
      <section className="align-center flex justify-center pt-[15%]">
        <div className="loader"></div>
      </section>
    );
  }
console.log(usersData, "userdataprasad")
    return (
      <FormProvider {...methods}>
      <CreateUserPage />
    </FormProvider>
    )
}