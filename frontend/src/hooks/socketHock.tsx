import { useEffect } from 'react'

import { createSocketConnection } from './socketService'
import { ListItemEnum, Options } from '../types/Option';

function listen(callBack: (payload: any) => void, channel: string, event: string) {
    window.Echo.private(channel).listen(event, (payload: any) => {
        callBack(payload)
    })

    return function cleanUp() {
        window.Echo.leaveChannel(`private-${channel}`)
    }
}

export const useSocket = ({ roomName, accessToken, type, callBack }: Options) => {
    useEffect(() => {
        createSocketConnection(accessToken)
        switch (type) {
            case ListItemEnum.LIST_ITEM_CREATED: {
                return listen(callBack, roomName, '.shopping-list.item.created')
            }
            case ListItemEnum.LIST_ITEM_UPDATED: {
                return listen(callBack, roomName, '.shopping-list.item.updated')
            }
            case ListItemEnum.LIST_ITEM_DELETED: {
                return listen(callBack, roomName, '.shopping-list.item.deleted')
            }
        }
    }, [])
}
