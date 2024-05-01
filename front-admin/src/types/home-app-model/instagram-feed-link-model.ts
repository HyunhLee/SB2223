export interface InstagramFeedLinkModels {
    count: number;
    lists: InstagramFeedLinkModel[];
}

export interface InstagramFeedLinkModel {
    id?: number;
    imageUrl: string;
    targetUrl: string;
}

export const defaultLinkModel = () => {
    return {
        id: null,
        imageUrl: "",
        targetUrl: ""
    }
}