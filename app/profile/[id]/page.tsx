import Link from 'next/link';
import ProfileView from '../../components/ProfileView';
import { fetchProfileData, SessionExpiredError } from '../../../lib/api';
import { cookies } from 'next/headers';

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value || '';

  try {
    const userData = await fetchProfileData(id, token);

    if (!userData) {
      return <p>Profile not found</p>;
    }

    return <ProfileView userData={userData} />;
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      return (
        <p>
          Your session has expired. Please <Link href="/login">log in again</Link>.
        </p>
      );
    }
    throw error;
  }
}
