"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, Pause, SkipForward, Share, ThumbsUp, ThumbsDown } from "lucide-react"
import { useSession } from "next-auth/react"
import z from "zod"
import { YT_REGEX } from "@/lib/utils"
import { id } from "zod/v4/locales"
import StreamView from "../component/StreamView"

interface Song {
    id: string
    type: string
    url: string
    extractedId: string
    title: string
    smallImage: string
    bigImage: string
    active: boolean
    userId: string
    upvotes: any[]
    upvotesCount: number
    haveUpvoted: boolean
    submittedBy?: string
    artist?: string
}

const REFRESH_INTERVAL_MS = 10 * 1000 // 10 seconds

const creatorId = "60dc1287-c491-449b-9c00-bdc7ef8feabc";

export default function Dashboard() {
    return <StreamView creatorId={creatorId} playVideo={true} />
}
