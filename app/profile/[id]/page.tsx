import ProfileView from '../../components/ProfileView';
import { fetchProfileData } from '../../../lib/api';
import { cookies } from 'next/headers';


interface ProfileProps {
  userData: any; // Define this according to your user data structure
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value || '';
  const userData = await fetchProfileData(id, token);

  if (!userData) {
    return <p>Profile not found</p>;
  }

  return <ProfileView userData={userData} />;
}
