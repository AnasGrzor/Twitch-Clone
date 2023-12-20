"use server"

import { v4 } from "uuid"
import { AccessToken } from "livekit-server-sdk"
import { getSelf } from "@/lib/auth-service"
import { getUserbyId } from "@/lib/user-service"
import { isBlockedbyUser } from "@/lib/block-service"

export const createViewerToken = async (hostidentity: string) => {
    let self;

    try {
        self = await getSelf();
    } catch {
        const id = v4()
        const username = `guest#${Math.floor(Math.random() * 1000)}`
        self = {
            id, 
            username
        }
    }

    const host = await getUserbyId(hostidentity)

    if (!host) {
        throw new Error("User not found")
    }

    const isBlocked = await isBlockedbyUser(host.id)

    if (isBlocked) {
        throw new Error ("User is blocked")
    }

    const isHost = self.id === host.id

    const token = new AccessToken(
        process.env.LIVEKIT_API_KEY!,
        process.env.LIVEKIT_API_SECRET!,
        {
            identity: isHost ? `host-${self.id}` : self.id,
            name: self.username
        }
    );

    token.addGrant({
        roomJoin: true,
        room: host.id,
        canPublish: false,
        canPublishData: true
    })

    return await Promise.resolve(token.toJwt())

}