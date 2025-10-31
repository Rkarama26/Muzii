import { prismaClient } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse, type NextRequest } from 'next/server';
import z from 'zod';

const UpvoteSchema = z.object({
  streamId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  // TODO:  change it later to id
  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? '',
    },
  });
  if (!user) {
    return NextResponse.json({ message: 'UnAuthenticated' }, { status: 403 });
  }
  try {
    const data = UpvoteSchema.parse(await req.json());

    const existitngUpvote = await prismaClient.upvote.findFirst({
      where: {
        userId: user.id,
        streamId: data.streamId,
      },
    });
    if (!existitngUpvote) {
      return NextResponse.json({ message: 'No upvote exists to remove' }, { status: 400 });
    }
    await prismaClient.upvote.delete({
      where: {
        userId_streamId: {
          userId: user.id,
          streamId: data.streamId,
        },
      },
    });
    return NextResponse.json({
      message: 'Done!',
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Error while downvoting a stream',
      },
      {
        status: 403,
      }
    );
  }
}
