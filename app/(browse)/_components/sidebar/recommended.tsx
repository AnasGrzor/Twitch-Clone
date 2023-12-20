"use client"
import { Stream, User } from "@prisma/client"

import { useSidebar } from "@/store/use-sidebar"
import { UserItem, UserItemSkeleton } from "./user-item"

interface RecommendedProps {
    data: (User & {
      stream: Stream | null
    })[]
}

export const Recommended = ({ data }: RecommendedProps) => {
    const {collapsed} = useSidebar((state) => state)

    const showLabel = !collapsed && data.length > 0

    return (
        <div>
        {showLabel && (
            <div className="pl-6 mb-4">
                <p className="text-xs text-muted-foreground">Recommended</p>
            </div>
        )}
        <ul className="space-y-2 px-2">
            {data.map((user) => (
                <li key={user.id}>
                    <UserItem key={user.id}
                    username={user.username}
                    imageUrl={user.imageUrl}
                    isLive={user.stream?.isLive} />
                </li>
            ))}
        </ul>
        </div>

    )

}

export const RecommendedSkeleton = () => {
  return (
    <ul className="px-2">
      {[...Array(3)].map((_, index) => {
        return <UserItemSkeleton key={index} />
      })}
    </ul>
  )
}
