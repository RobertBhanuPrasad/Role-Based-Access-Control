import React from 'react'
import { CreateRole } from '../../add';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { usersStore } from '@/ZustandStore/UsersStore';
import { handleRoleDetails } from '@/components/roles/HandleRolesDefaultValues';

const index = () => {
  return (
    <div><EditUserPage/></div>
  )
}

export default index;

export const EditUserPage = () => {
  const {
    setRolesDefaultData
  } = usersStore();

  const [isLoading, setIsLoading] = useState(true);
  const {
    query: { id },
  }: any = useRouter();

  const {query} = useRouter()

  console.log(query, "bhanuquery")
  useEffect(() => {
    console.log("bhanuprasad")
    if (id){

    const fetchDefaultValues = async () => {
      const defaultValues: any= await handleRoleDetails(
        id,
      );
      console.log(defaultValues, "defaultvaluesbhanuprasad")
      setRolesDefaultData(defaultValues)
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
    return (
        <CreateRole/>
    )
}