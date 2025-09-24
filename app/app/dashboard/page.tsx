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

    const [loading, setLoading] = useState(false);

    // get sessions
    const { data: session, status } = useSession()

    //get all streams
    async function refreshStreams() {
        try {
            const res = await fetch("/api/streams/my", {
                credentials: "include",
            })

            if (res.ok) {
                const data = await res.json()
                // console.log(data)
                const streams: Song[] = data.streams

                const transformedStreams: Song[] = streams.map((stream) => ({
                    id: stream.id,
                    type: stream.type,
                    url: stream.url,
                    extractedId: stream.extractedId,
                    title: stream.title || `VideoID ${stream.extractedId}`, // Fallback if title is empty
                    smallImage: stream.smallImage,
                    bigImage: stream.bigImage,
                    active: stream.active,
                    userId: stream.userId,
                    upvotes: stream.upvotes,
                    upvotesCount: stream.upvotesCount,
                    haveUpvoted: stream.haveUpvoted,
                    submittedBy: stream.submittedBy || "",
                    artist: stream.artist || "Unknown Artist",
                }))

                // Set the first stream as current song if we don't have one
                if (transformedStreams.length > 0 && !currentSong.extractedId) {
                    setCurrentSong(transformedStreams[0])
                    setQueue(transformedStreams.slice(1))
                } else {
                    setQueue(transformedStreams)
                }
            }
        } catch (error) {
            console.error("Error fetching streams:", error)
        }
    }
    // load on page rendered
    useEffect(() => {
        refreshStreams()
        const interval = setInterval(() => {
            refreshStreams()
        }, REFRESH_INTERVAL_MS)

        return () => clearInterval(interval)
    }, [])

    //current song 
    const [currentSong, setCurrentSong] = useState<Song>({
        id: "",
        type: "",
        url: "",
        extractedId: "",
        title: "No song playing",
        smallImage: "",
        bigImage: "placeholder_cat.jpg",
        active: false,
        userId: "",
        upvotes: [],
        upvotesCount: 0,
        haveUpvoted: false,
    })

    // songs queue
    const [queue, setQueue] = useState<Song[]>([])
    const [newVideoUrl, setNewVideoUrl] = useState("")
    const [isPlaying, setIsPlaying] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const extractVideoId = (url: string): string | null => {
        const match = url.match(YT_REGEX)
        return match ? match[1] : null
    }
    // add song to queue
    const handleSubmitSong = async (e: React.FormEvent) => {
        if (loading) return;
        e.preventDefault()
        const videoId = extractVideoId(newVideoUrl)
        if (!session?.user) {
            alert("Please sign in to add stream")
            return
        }
        try {
            setLoading(true);
            const response = await fetch("/api/streams", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    creatorId: "60dc1287-c491-449b-9c00-bdc7ef8feabc", // hardcoded for now, replace with session user id
                    url: newVideoUrl,
                }),
            })

            if (response.ok) {
                // Refresh the streams to get the updated list
                const newSong = await response.json()
                await refreshStreams()
                setNewVideoUrl("")
                setIsDialogOpen(false)
                alert("Song added to the queue!")
            } else {
                const error = await response.json()
                console.error("Error submitting song:", error.message)
                alert("Error submitting song: " + error.message)
            }
        } catch (error) {
            console.error("Error submitting song:", error)
            alert("Error submitting song. Please try again.")
        }
        finally {
            setLoading(false);

        }
    }

    // UPVOTE || DOWNVOTE
    const handleVote = (id: string, isUpvote: boolean) => {
        setQueue(
            queue
                .map((song) =>
                    song.id === id
                        ? {
                            ...song,
                            upvotesCount: isUpvote ? song.upvotesCount + 1 : song.upvotesCount - 1,
                            haveUpvoted: !song.haveUpvoted,
                        }
                        : song,
                )
                .sort((a, b) => b.upvotesCount - a.upvotesCount),
        )
        const apiUrl = `/api/streams/${isUpvote ? "upvote" : "downvote"}`
        // Call the upvote API
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ streamId: id }),
        })
    }

    const playNext = () => {
        if (queue.length > 0) {
            setCurrentSong(queue[0])
            setQueue(queue.slice(1))
        }
    }

    const handleShare = async () => {
        const shareData = {
            title: "Stream Music Queue",
            text: "Vote for the next song and submit your favorites!",
            url: `${window.location.hostname}/creator/??${creatorId}`,
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
            } catch (err) {
                console.log("Error sharing:", err)
                // Fallback to copying URL
                navigator.clipboard.writeText(window.location.href)
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href)
            alert("Link copied to clipboard!")
        }
    }

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex justify-between mb-4">
                        <span className="text-xl font-bold text-foreground">Muzii</span>

                        <Button onClick={handleShare} variant="outline" className="gap-2 bg-transparent">
                            <Share className="h-4 w-4" />
                            Share with Fans
                        </Button>
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-4xl font-bold text-foreground">🎵 Beat Control Central</h1>
                        <div className="flex flex-wrap justify-center gap-2 text-sm">
                            <Badge variant="secondary">Drop the Beat</Badge>
                            <Badge variant="secondary">Control the Vibe</Badge>
                            <Badge variant="secondary">Community Powered</Badge>
                        </div>
                        <p className="text-lg text-muted-foreground font-medium">
                            {"🎧 Let the crowd decide the soundtrack • Vote • Submit • Vibe 🎶"}
                        </p>
                        <p className="text-sm text-muted-foreground italic">
                            {"Where every vote shapes the beat and every song tells a story"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Current Playing Video */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        🎵 On The Beat
                                        <Badge variant="outline" className="animate-pulse">
                                            LIVE
                                        </Badge>
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={playNext} disabled={queue.length === 0}>
                                            <SkipForward className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                                    {currentSong.id ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${currentSong.id}?autoplay=${isPlaying ? 1 : 0}`}
                                            title={currentSong.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            <div className="text-center">
                                                <p className="text-lg">🎵 No song selected</p>
                                                <p className="text-sm">Add a song to the queue to get started!</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">{currentSong.title}</h3>
                                    <p className="text-muted-foreground">{currentSong.artist}</p>
                                    {currentSong.submittedBy && (
                                        <div className="flex gap-2">
                                            <Badge variant="secondary">Submitted by {currentSong.submittedBy}</Badge>
                                            <Badge variant="outline" className="text-primary">
                                                🔥 Crowd Favorite
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Queue and Submit */}
                    <div className="space-y-6">
                        {/* Submit Song */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">🎤 Drop Your Beat</CardTitle>
                                <p className="text-sm text-muted-foreground">{"Got that fire track? Share it with the crew!"}</p>
                            </CardHeader>
                            <CardContent>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Your Banger
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>🎵 Submit Your Beat</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <Input
                                                    placeholder="Drop that YouTube link and let's vibe... 🎶"
                                                    value={newVideoUrl}
                                                    onChange={(e) => setNewVideoUrl(e.target.value)}
                                                />
                                            </div>
                                            {newVideoUrl && extractVideoId(newVideoUrl) && (
                                                <div className="space-y-2">
                                                    <p className="text-sm text-muted-foreground">🎧 Preview the vibe:</p>
                                                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                                        <iframe
                                                            width="100%"
                                                            height="100%"
                                                            src={`https://www.youtube.com/embed/${extractVideoId(newVideoUrl)}`}
                                                            title="Video preview"
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={handleSubmitSong}
                                                    disabled={!extractVideoId(newVideoUrl) && loading}
                                                    className="flex-1">
                                                    {loading ? "⏳ Submitting..." : "🚀 Submit the Beat"}
                                                </Button>
                                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>

                        {/* Queue */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    🎵 Beat Queue
                                    <Badge variant="secondary">{queue.length} tracks ready</Badge>
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">{"Vote to control the flow • Most upvotes = next beat"}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {queue.map((song, index) => (
                                        <div key={song.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                            <div className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</div>
                                            <img
                                                src={song.smallImage || "/placeholder.svg"}
                                                alt={song.title}
                                                className="w-16 h-12 object-cover rounded"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium truncate">{song.title}</h4>
                                                <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                                                <Badge variant="outline" className="text-xs">
                                                    {song.submittedBy}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {song.haveUpvoted ? (
                                                    <Button variant="outline" size="sm" onClick={() => handleVote(song.id, !song.haveUpvoted)}>
                                                        <ThumbsDown className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button variant="outline" size="sm" onClick={() => handleVote(song.id, !song.haveUpvoted)}>
                                                        <ThumbsUp className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <span className="text-sm font-medium w-8 text-center">{song.upvotesCount}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {queue.length === 0 && (
                                        <div className="text-center py-8 space-y-2">
                                            <p className="text-muted-foreground">{"🎵 The beat queue is empty!"}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {"Be the first to drop a banger and get this party started 🔥"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
