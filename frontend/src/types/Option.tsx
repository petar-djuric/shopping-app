export enum ListItemEnum{
    LIST_ITEM_CREATED = 'LIST_ITEM_CREATED',
    LIST_ITEM_DELETED = 'LIST_ITEM_DELETED',
    LIST_ITEM_UPDATED = 'LIST_ITEM_UPDATED',
}

export type Options = {
    roomName: string
    accessToken: string
    type: ListItemEnum
    callBack: (payload: any) => void
}
