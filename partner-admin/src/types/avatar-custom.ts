import {images} from "next/dist/build/webpack/config/blocks/images";

export interface AvatarCustoms {
    count: number;
    lists: AvatarCustomModel[];
}

export interface AvatarCustomModel {
    id?: number
    avatarName: string
    avatarHair: AvatarHairId[]
    listOrder?: number
    verified: boolean
    activated: boolean
    hairWithoutImageUrl: string
    mainImageUrl: string
    copyHairWithoutImageUrl: string
    copyMainImageUrl: string
    hairWithoutImage: HairWithoutImage[]
    mainImage: FaceMainImage[]
}

export interface AvatarHairId {
    id: number
    activated?: boolean
    avatarHairColors?: AvatarHairColors[]
    hairLengthType?: string
    hairType?: string
    hasBangs?: boolean
    listOrder?: number
    mainImageUrl?: string
    mainImage?: []
}

export interface FaceMainImage {
    imageUrl: string
    listOrder: number
}

export interface HairWithoutImage {
    imageUrl: string
    listOrder: number
}

export interface AvatarHairCustoms {
    count: number;
    lists: AvatarHair[];
}

export interface AvatarHair {
    id?: number
    activated: boolean
    avatarHairColors: AvatarHairColors[]
    hairLengthType: string
    hairType: string
    hasBangs: boolean
    listOrder: number
    mainImageUrl: string
    mainImage?: Object
    createdDate?: string
    lastModifiedDate?: string
}

export const defaultAvatarHair = (hairLengthType) => {
    return {
        id: null,
        activated: true,
        avatarHairColors: [
            {
                colorType: 'DARK_BROWN',
                defaulted: true,
                withoutImageUrl: '',
                withoutImage:null,
                listOrder:null
            },
            {
                colorType: 'BROWN',
                defaulted: false,
                withoutImageUrl: '',
                withoutImage:null,
                listOrder:null
            },
            {
                colorType: 'ASH_BROWN',
                defaulted: false,
                withoutImageUrl: '',
                withoutImage:null,
                listOrder:null
            },
            {
                colorType: 'DECOLORIZATION',
                defaulted: false,
                withoutImageUrl: '',
                withoutImage:null,
                listOrder:null
            }
        ],
        hairLengthType: hairLengthType,
        hairType: 'WAVE',
        hasBangs: true,
        listOrder: null,
        mainImageUrl: ''
    }
}

export interface AvatarHairColors {
    colorType: string
    defaulted: boolean
    id?: number
    withoutImageUrl: string
    withoutImage?: Object
    listOrder:number
}