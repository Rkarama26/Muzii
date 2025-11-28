import { prismaClient } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

// get my streams
export async function GET() {
  const session = await getServerSession(authOptions);

  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? '',
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        message: 'Unauthorized',
      },
      { status: 403 }
    );
  }

  const streams = await prismaClient.stream.findMany({
    where: {
      userId: user.id,
    },
    include: {
      _count: {
        select: {
          upvotes: true,
        },
      },
      upvotes: {
        where: {
          userId: user.id,
        },
      },
    },
  });
  return NextResponse.json({
    streams: streams.map((stream: any) => ({
      ...stream,
      upvotesCount: stream._count.upvotes,
      haveUpvoted: stream.upvotes.length ? true : false,
    })),
  });
}
