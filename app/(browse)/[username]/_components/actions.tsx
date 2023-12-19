"use client";

import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";
import { Action } from "@prisma/client/runtime/library";
import { useTransition } from "react";
import { toast } from "sonner";

interface ActionsProps {
  isFollowing: boolean;
  userId: string
}

export const Actions = ({ isFollowing,userId }: ActionsProps) => {
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    startTransition(() => {
      onFollow(userId)
      .then((data) => {
          toast.success(`You are now following ${data.following.username}`)
      })
      .catch(() => toast.error("Failed to follow the user"))
    });
  };

    const handleUnFollow = () => {
      startTransition(() => {
        onUnfollow(userId)
          .then((data) => {
            toast.success(`You have unfollowed ${data.following.username}`);
          })
          .catch(() => toast.error("Failed to follow the user"));
      });
    };

    const onClick = () => {
        if (isFollowing) {
          handleUnFollow();
        } else {
          handleFollow();
        }
    }



  return (
    <Button
      disabled={isPending}
      onClick={onClick}
      variant="primary"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};
