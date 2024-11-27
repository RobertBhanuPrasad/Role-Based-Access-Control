import React from 'react'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { usersStore } from '@/ZustandStore/UsersStore';
import { handlePermissionDetails } from '@/components/permissions/HandlePermissionsDefaultValues';
import CreatePermission from '../../add';

const index = () => {
  return (
    <div><EditUserPage/></div>
  )
}

export default index;

export const EditUserPage = () => {
  const {
    setPermissionsDefaultData,
    permissionsDefaultData
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
      const defaultValues: any= await handlePermissionDetails(
        id,
      );
      console.log(defaultValues, "defaultvaluesbhanuprasadpermissions")
      setPermissionsDefaultData(defaultValues)
      setIsLoading(false);
    };
    fetchDefaultValues();
  }
  }, [id]);
  
  console.log(permissionsDefaultData, "permissionsedit")
  console.log(isLoading, "loadingprasad")

  if (isLoading) {
    return (
      <section className="align-center flex justify-center pt-[15%]">
        <div className="loader"></div>
      </section>
    );
  }
    return (
        <CreatePermission />
    )
}