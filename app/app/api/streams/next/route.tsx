import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prismaClient } from "@/app/lib/db";
import { NextResponse } from "next/server";
import Stream from "stream";


export async function GET() {
    try {
        //get user
        const session = await getServerSession(authOptions);
        const user = await prismaClient.user.findFirst({
            where: {
                email: session?.user?.email ?? "",
            }
        });

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }
        // get most upvoted stream 
        const mostupvotedStream = await prismaClient.stream.findFirst({
            where: {
                userId: user.id,
                played: false
            },
            orderBy: {
                upvotes: {
                    _count: 'desc'
                }
            }
        });

        if (!mostupvotedStream) {
            return NextResponse.json({ message: "No streams available" }, { status: 404 });
        }

        // set as current & delete from stream table
        await Promise.all([prismaClient.currentStream.upsert({
            where: {
                userId: user.id
            },
            update: {
                userId: user.id,
                streamId: mostupvotedStream?.id
            },
            create: {
                userId: user.id,
                streamId: mostupvotedStream?.id
            }
        }),
        prismaClient.stream.update({
            where: {
                id: mostupvotedStream?.id ?? ""
            },
            data: {
                played: true,
                playedTs: new Date()
            } 
        }),
        ]);

        return NextResponse.json({ stream: mostupvotedStream });

    } catch (error: any) {
        console.error("Error in /api/streams/next:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
