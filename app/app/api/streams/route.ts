import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/app/lib/db";

// @ts-ignore
import { YT_REGEX } from "@/lib/utils";
import { getYouTubeVideoDetails } from "@/app/lib/youtube";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";


const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})

// add a new stream
export async function POST(req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const match = data.url.match(YT_REGEX);
        // check if url is a valid youtube url
        if (!match) {
            return NextResponse.json(
                { message: "Not a valid youtube url" },
                { status: 411 }
            )
        }

        // if valid, extract the video id from the url
        const extractedId = match[1];
        // const ytresponse = await YoutubeSearchApi.GetVideoDetails(extractedId);
        const res = await getYouTubeVideoDetails(extractedId);

        console.log(res.thumbnails)
        if (!res || !res.title) {
            return NextResponse.json(
                { message: "Couldn't fetch video details from youtube" },
                { status: 400 }
            )
        }
        // const thumbnails = res.thumbnails.thumbnails ?? [];
        // thumbnails.sort((a: { width: number }, b: { width: number }) => a.width < b.width ? -1 : 1);

        //console.log("Creator ID:", data.creatorId);
        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type: "Youtube",
                title: res.title ?? "can't find video",
                smallImage: res.thumbnails.default.url ?? "https://search.brave.com/images?q=cat+image&context=W3sic3JjIjoiaHR0cHM6Ly9jZG4ucGl4YWJheS5jb20vcGhvdG8vMjAyMS8xMi8wMS8xNC8xMC9jYXQtZXllcy02ODM4MDczXzY0MC5qcGciLCJ0ZXh0IjoiRnJlZSBDYXQgRXllcyBFdXJvcGVhbiBTaG9ydGhhaXIgcGhvdG8gYW5kIHBpY3R1cmUiLCJwYWdlX3VybCI6Imh0dHBzOi8vcGl4YWJheS5jb20vaW1hZ2VzL3NlYXJjaC9jYXQvIn1d&sig=b3837df0f40fdd5f9c8618a534510e0fb186e918533e9593d3c74f64b7e095ef&nonce=4ebf453d8c102271f0efe714c3ba6451&source=imageCluster",
                bigImage: res.thumbnails.maxres.url ?? "https://search.brave.com/images?q=cat+image&context=W3sic3JjIjoiaHR0cHM6Ly9jZG4ucGl4YWJheS5jb20vcGhvdG8vMjAyMS8xMi8wMS8xNC8xMC9jYXQtZXllcy02ODM4MDczXzY0MC5qcGciLCJ0ZXh0IjoiRnJlZSBDYXQgRXllcyBFdXJvcGVhbiBTaG9ydGhhaXIgcGhvdG8gYW5kIHBpY3R1cmUiLCJwYWdlX3VybCI6Imh0dHBzOi8vcGl4YWJheS5jb20vaW1hZ2VzL3NlYXJjaC9jYXQvIn1d&sig=b3837df0f40fdd5f9c8618a534510e0fb186e918533e9593d3c74f64b7e095ef&nonce=4ebf453d8c102271f0efe714c3ba6451&source=imageCluster"
            }
        });

        return NextResponse.json({
            ...stream,
            hasUpvoted: false,
            upvotes: 0
        })
    } catch (error) {
        return NextResponse.json({
            message: `error while adding stream: ${error}`
        }, {
            status: 411
        }
        )

    }
}
// get all streams for a creator
export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");

    const session = await getServerSession(authOptions);

    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? "",
        }
    });

    if (!user) {
        return NextResponse.json({
            message: "Unauthorized"
        },
            { status: 403 }
        );
    }
    if (!creatorId) {
        return NextResponse.json(
            { message: "Error" },
            { status: 411 }
        )
    }
    const [streams, activeStream] = await Promise.all([await prismaClient.stream.findMany({
        where: {
            userId: creatorId,
            played: false
        },
        include: {
            _count: {
                select: {
                    upvotes: true,
                }
            },
            upvotes: {
                where: {
                    userId: user.id
                }
            }
        }
    }), prismaClient.currentStream.findFirst({
        where: {
            userId: creatorId
        },
        include: {
            stream: true
        }
    })])


    return NextResponse.json({
        streams: streams.map(({ _count, ...rest }) => ({
            ...rest,
            upvotesCount: _count.upvotes,
            haveUpvoted: rest.upvotes.length ? true : false,
        })),
        activeStream
    });
}


