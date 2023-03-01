import { redirect } from 'next/navigation';


function page() {
  redirect('/auth/login');
}

export default page;