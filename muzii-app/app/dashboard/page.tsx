// app/dashboard/page.tsx (or wherever your creator view is)
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import StreamView from '@/app/component/StreamView';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  // Pass the logged-in user's ID as creatorId
  return (
    <div>
      <StreamView
        creatorId={session.user.id}
        playVideo={true} // Creator can control playback
      />
    </div>
  );
}
