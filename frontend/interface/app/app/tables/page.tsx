import validateJWT from "@/api/validateJWT";
import TableMap from "@/components/TableMap"

import { cookies } from 'next/headers';


export default async function Home() {
  const user = await validateJWT()

  console.log(user)


  const cookie = cookies().get('token');

  return (
    <>
      <TableMap jwt={cookie.value} tabPermissions={user.user.tab_permission} />
    </>
  );
}
