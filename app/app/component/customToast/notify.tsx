"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "react-hot-toast";

export const notify = {
    success: (msg: string) => toast.success(msg),
    error: (msg: string) => toast.error(msg),
    loading: (msg: string) => toast.loading(msg),
    info: (msg: string) =>
        toast(msg, {
            icon: "ℹ️",
            style: {
                background: "var(--color-secondary)",
                color: "var(--color-secondary-foreground)",
            },
        }),

    vote: {
        upvote: () =>
            toast("Upvoted", {
                icon: <ThumbsUp size={20} />,
                style: {
                    background: "white",
                    color: "var(--color-primary)",
                },
            }),
        downvote: () =>
            toast("Removed your upvote!", {
                icon: <ThumbsDown size={20} />,
                style: {
                    background: "white",
                    color: "var(--destructive-foreground)",
                },
            }),
    },
}
