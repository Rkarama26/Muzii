import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { prismaClient } from '@/app/lib/db';

// @ts-ignore
import { YT_REGEX } from '@/lib/utils';
import { getYouTubeVideoDetails } from '@/app/lib/youtube';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

// add a new stream
export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await req.json());
    const match = data.url.match(YT_REGEX);
    // check if url is a valid youtube url
    if (!match) {
      return NextResponse.json({ message: 'Not a valid youtube url' }, { status: 411 });
    }

    // if valid, extract the video id from the url
    const extractedId = match[1];
    // const ytresponse = await YoutubeSearchApi.GetVideoDetails(extractedId);
    const res = await getYouTubeVideoDetails(extractedId);

    if (!res || !res.title) {
      return NextResponse.json(
        { message: "Couldn't fetch video details from youtube" },
        { status: 400 }
      );
    }

    //console.log("Creator ID:", data.creatorId);
    const stream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: 'Youtube',
        title: res.title ?? "can't find video",
        smallImage: res.thumbnails.default.url ?? 'https://search.brave.com/images?q=cat+image',
        bigImage: res.thumbnails.maxres.url ?? 'https://search.brave.com/images?q=cat+image',
      },
    });

    return NextResponse.json({
      ...stream,
      hasUpvoted: false,
      upvotes: 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: `error while adding stream: ${error}`,
      },
      {
        status: 411,
      }
    );
  }
}

// get all streams for a creator
export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get('creatorId');

  if (!creatorId) {
    return NextResponse.json({ message: 'creatorId is required' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  // Get the current user if they're logged in (for upvote checking)
  let currentUserId: string | null = null;

  if (session?.user?.email) {
    const user = await prismaClient.user.findFirst({
      where: {
        email: session.user.email,
      },
    });
    currentUserId = user?.id || null;
  }

  // Fetch streams for the creator (not the logged-in user)
  const [streams, activeStream] = await Promise.all([
    prismaClient.stream.findMany({
      where: {
        userId: creatorId, // Get streams for the creator
        played: false,
      },
      include: {
        _count: {
          select: {
            upvotes: true,
          },
        },
        upvotes: currentUserId
          ? {
              where: {
                userId: currentUserId, // Check if current user has upvoted
              },
            }
          : false,
        user: {
          select: {
            email: true,
          },
        },
      },
    }),
    prismaClient.currentStream.findFirst({
      where: {
        userId: creatorId, // Get active stream for the creator
      },
      include: {
        stream: true,
      },
    }),
  ]);

  return NextResponse.json({
    streams: streams.map(({ _count, user, ...rest }) => ({
      ...rest,
      upvotesCount: _count.upvotes,
      haveUpvoted: rest.upvotes.length ? true : false,
      submittedBy: user.email.split('@')[0], // Extract username from email
    })),
    activeStream,
  });
}
