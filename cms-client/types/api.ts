import { FulfillmentStatus, OfferStatus, OrderStatus, PaymentStatus, ReturnStatus, Right, Role, Service } from "./store";

export interface IResponse<T> {
    success: boolean;
    data: T
}

export interface IErrorResponse {
    message: string;
    statusCode: number;
}

export interface IMetafield {
    id: number;
    key: string;
    value: string;
}

export interface IVariable {
    id: number;
    group: string;
    key: string;
    value: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDeliveryOption {
    id: number;
    title: string;
    duration: number;
    price: string;
}

export interface IDeliveryZone {
    id: number;
    country: string;
    region: string;
    options: IDeliveryOption[]
}

export interface IUserSearch {
    id: number;
    fullName: string | null;
    phone: string | null;
    email: string | null;
    comment: string | null;
    location: string | null;
    offersCount: number;
    ordersCount: number;
    createdAt: Date;
}

export interface IDeliveryProfilePreview {
    id: number;
    title: string;
    zonesCount: number;
    offersCount: number;
}

export interface IDeliveryProfile {
    id: number;
    title: string;
    country: string;
    city: string;
    address: string;
    isDefault: boolean;
}


export interface IOfferSearch {
    id: number;
    product: string;
    variant: string;
    price: string;
    offerPrice: string | null;
    status: OfferStatus;
    user: string | null;
    image: IImage;
    deliveryProfile: IDeliveryProfile;
}

export interface IUserAddress {
    id: number;
    country: string;
    region: string;
    city: string;
    address: string;
}

export interface IOrderAddress {
    mailingCountry: string;
    mailingCity: string;
    mailingRegion: string;
    mailingAddress: string;
}

export interface IUserPermission {
    id: number;
    right: Right;
}

export interface IUser {
    id: number;
    email: string | null;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    fullName: string | null;
    inn: string | null;
    account: string | null;
    correspondentAccount: string | null;
    bic: string | null;
    passport: string | null;
    comment: string | null;
    isVerified: boolean;
    isSubscribed: boolean;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    addresses: IUserAddress[];
    permissions: IUserPermission[];
}

export interface IOffer {
    id: number;
    product: string;
    variant: string;
    image: IImage | null;
    variantId: number | null;
    productId: number | null;
    price: string | null;
    compareAtPrice: string | null;
    offerPrice: string | null;
    comment: string | null;
    deliveryProfileId: number | null;
    status: OfferStatus;
    userId: number | null;
    orderId: number | null;
}

export interface IImage {
    id: number;
    alt: string;
    src: string;
    position: number;
}

export interface IProductFeature {
    id: number;
    title: string;
    position: number;
    values: IProductFeatureValue[]
}

export interface IProductFeatureValue {
    id: number;
    key: string;
    value: string;
    position: number;
}

export interface IProductFeatureCreate {
    title: string;
    values: Pick<IProductFeatureValue, "key" | "value">[];
}

export type IProductFeatureUpdate = {
    id: number;
    title?: string;
    createValues?: Pick<IProductFeatureValue, "key" | "value">[];
    updateValues?: Pick<IProductFeatureValue, "id" | "key" | "value">[];
    deleteValues?: Pick<IProductFeatureValue, "id">[];
    reorderValues?: Pick<IProductFeatureValue, "id">[];
}

export type IProductFeatureDelete = {
    id: number;
}

export interface ICollection {
    id: number;
    title: string;
    handle: string;
    hidden: boolean;
    description: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    images: IImage[];
}

export interface IPage {
    id: number;
    title: string;
    handle: string;
    content: string;
    metaTitle: string | null;
    metaDescription: string | null;
}

export interface IPageSearch {
    id: number;
    title: string;
    createdAt: Date
}

export interface ICollectionSearch {
    id: number;
    title: string;
    productsCount: number;
    createdAt: Date
}

export interface IVariantSearch {
    id: number;
    image: IImage | null;
    title: string;
    variants: {
        id: number;
        title: string;
    }[];
}

export interface IVariantPreview {
    id: number;
    title: string;
    price: string;
    compareAtPrice: string;
}

export interface IOfferVariantPreview {
    id: number;
    productId: number;
    product: string;
    variant: string;
    image: IImage | null;
}

export interface IVariant {
    id: number;
    title: string;
    price: string;
    compareAtPrice: string;
    barcode: string;
    sku: string;
}

export interface IProductSearch {
    id: number;
    image: IImage | null;
    title: string;
    available: boolean;
    vendor: string;
    type: string;
    offersCount: number;
}

export interface ICollectionProduct {
    id: number;
    title: string;
    image: IImage | null;
    available: boolean;
}

export interface ITag {
    id: number;
    title: string;
}

export interface IProduct {
    id: number;
    title: string;
    available: boolean;
    handle: string;
    description: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    vendor: string | null;
    type: string | null;
    sku: string | null;
    barcode: string | null;
    images: IImage[];
    collections: Pick<ICollection, "id" | "title">[];
    features: IProductFeature[];
    metafields: IMetafield[];
    tags: ITag[];
}

export interface IOrderSearch {
    id: number;
    createdAt: Date;
    user: string;
    totalPrice: string;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    returnStatus: ReturnStatus | null;
    offersCount: number;
    servicesCount: number;
}

export interface ITimeline {
    id: number;
    title: string;
    message: string;
    user: string;
    createdAt: Date;
}

export interface IOrderProduct {
    id: number;
    product: string;
    variant: string;
    image: IImage | null;
    deliveryProfile: IDeliveryProfile;
    price: string;
}

export interface IReturnProduct {
    id: number;
    product: string;
    variant: string;
    image: IImage | null;
    price: string;
    reason: string;
}

export interface IFulfillment {
    id: number;
    offers: IOrderProduct[];
    status: FulfillmentStatus;
    carrier: string;
    tracking: string;
}

export interface IOrderReturn {
    id: number;
    offers: IReturnProduct[];
    status: ReturnStatus;
    carrier: string;
    tracking: string;
}

export interface IRemovedOffer {
    id: number;
    product: string;
    variant: string;
    image: IImage | null;
    deliveryProfile: IDeliveryProfile;
    price: string;
}

export interface IOrder {
    id: number;
    note: string;
    userId: number;
    mailingAddress: string;
    mailingCity: string;
    mailingCountry: string;
    mailingRegion: string;
    totalPrice: number;
    paymentStatus: PaymentStatus;
    returnStatus: ReturnStatus | null;
    orderStatus: OrderStatus;
    offers: IOrderProduct[];
    returns: IOrderReturn[];
    removedOffers: IRemovedOffer[];
    fulfillments: IFulfillment[];
    paid: number;
}





// AuthService

export type LoginResponse = IResponse<string>
export type LoginRequest = {
    login: string;
    code: string;
}

export type SendCodeResponse = IResponse<void>
export type SendCodeRequest = {
    login: string
}

export type RefreshResponse = IResponse<string>
export type RefreshRequest = void


export type LogoutResponse = IResponse<void>
export type LogoutRequest = void





// userService

export type UserSearchResponse = IResponse<IUserSearch[]>
export type UserSearchRequest = {
    q?: string;
    limit?: number;
    skip?: number;
}

export type UserGetByIdResponse = IResponse<IUser>
export type UserGetByIdRequest = {
    userId: number
}

export type UserGetAddressesResponse = IResponse<IUserAddress[]>
export type UserGetAddressesRequest = {
    userId: number
}

export type UserCreateResponse = IResponse<void>
export type UserCreateRequest = {
    email?: string | null;
    phone?: string | null;
    lastName?: string | null;
    firstName?: string | null;
    inn?: string | null;
    account?: string | null;
    correspondentAccount?: string | null;
    bic?: string | null;
    passport?: string | null;
    comment?: string | null;
    role?: string;
    isVerified?: boolean;
    isSubscribed?: boolean;
    createAddresses?: Omit<IUserAddress, "id">[];
    createPermissions?: Right[];
}

export type UserUpdateResponse = IResponse<void>
export type UserUpdateRequest = {
    userId?: number;
    email?: string | null;
    phone?: string | null;
    lastName?: string | null;
    firstName?: string | null;
    inn?: string | null;
    account?: string | null;
    correspondentAccount?: string | null;
    bic?: string | null;
    passport?: string | null;
    comment?: string | null;
    role?: string;
    isVerified?: boolean;
    isSubscribed?: boolean;
    createPermissions?: Right[];
    deletePermissions?: number[];
    createAddresses?: Omit<IUserAddress, "id">[];
    updateAddresses?: IUserAddress[];
    deleteAddresses?: number[];
}

export type UserAddAddressResponse = IResponse<void>
export type UserAddAddressRequest = {
    userId: number;
    data: Omit<IUserAddress, "id">
}

export type UserRemoveAddressResponse = IResponse<void>
export type UserRemoveAddressRequest = {
    userId: number;
    addressId: number;
}

export type UserAddPermissionResponse = IResponse<void>
export type UserAddPermissionRequest = {
    userId: number;
    data: Omit<IUserPermission, "id">
}

export type UserRemovePermissionResponse = IResponse<void>
export type UserRemovePermissionRequest = {
    userId: number;
    permissionId: number;
}

export type UserDeleteResponse = IResponse<void>
export type UserDeleteRequest = {
    userId: number;
}




// suggestionService

export type CountriesSuggestionResponse = IResponse<string[]>
export type CountriesSuggestionRequest = {
    q: string;
}

export type RegionsSuggestionResponse = IResponse<string[]>
export type RegionsSuggestionRequest = {
    q: string;
    country?: string;
}

export type CitiesSuggestionResponse = IResponse<string[]>
export type CitiesSuggestionRequest = {
    q: string;
    region?: string;
}

export type CollectionsSuggestionResponse = IResponse<Pick<ICollection, "id" | "title">[]>
export type CollectionsSuggestionRequest = {
    q: string;
    ids?: number[];
}

export type VendorsSuggestionResponse = IResponse<string[]>
export type VendorsSuggestionRequest = {
    q: string;
}

export type TagsSuggestionResponse = IResponse<string[]>
export type TagsSuggestionRequest = {
    q: string;
}

export type ProductTypesSuggestionResponse = IResponse<string[]>
export type ProductTypesSuggestionRequest = {
    q: string;
}

export type DeliveryProfilesSuggestionResponse = IResponse<Pick<IDeliveryProfile, "id" | "title">[]>
export type DeliveryProfilesSuggestionRequest = void;

export type DeliveryOptionsSuggestionResponse = IResponse<IDeliveryOption[]>
export type DeliveryOptionsSuggestionRequest = {
    region: string;
    deliveryProfileId: number;
};

export type deliveryZonesSuggestionResponse = IResponse<Pick<IDeliveryZone, "country" | "region">[]>
export type DeliveryZonesSuggestionRequest = {
    q?: string;
    limit?: number;
    skip?: number;
    profileId?: number;
};



// productService

export type ProductSearchResponse = IResponse<IProductSearch[]>
export type ProductSearchRequest = {
    q?: string;
    limit?: number;
    skip?: number;
    available?: string;
    notInCollectionId?: number;
}

export type ProductGetByIdResponse = IResponse<IProduct>
export type ProductGetByIdRequest = {
    productId: number
}

export type ProductCreateResponse = IResponse<string>
export type ProductCreateRequest = {
    title?: string;
    handle?: string;
    available?: boolean;
    sku?: string;
    barcode?: string;
    description?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    vendor?: string | null;
    connectCollections?: Pick<ICollection, "id">[];
    createTags?: Omit<ITag, "id">[];
    createFeatures?: IProductFeatureCreate[];
}

export type ProductUpdateResponse = IResponse<void>
export type ProductUpdateRequest = {
    productId?: number
    title?: string;
    handle?: string;
    available?: boolean;
    description?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    vendor?: string | null;
    connectCollections?: Pick<ICollection, "id">[];
    disconnectCollections?: Pick<ICollection, "id">[];
    createMetafields?: Omit<IMetafield, "id">[];
    updateMetafields?: IMetafield[];
    deleteMetafields?: Pick<IMetafield, "id">[];
    createTags?: Omit<ITag, "id">[];
    deleteTags?: Pick<ITag, "id">[];
    createFeatures?: IProductFeatureCreate[];
    updateFeatures?: IProductFeatureUpdate[];
    deleteFeatures?: IProductFeatureDelete[];
    reorderFeatures?: Pick<IProductFeature, "id">[];
}

export type ProductDeleteResponse = IResponse<void>
export type ProductDeleteRequest = {
    productId: number;
}

export type ProductUploadImagesResponse = IResponse<void>
export type ProductUploadImagesRequest = {
    productId: number;
    formData: FormData;
}

export type ProductUpdateImageResponse = IResponse<void>
export type ProductUpdateImageRequest = {
    productId: number;
    imageId: number;
    src?: string;
    alt?: string;
    position?: number;
}

export type ProductRemoveImageResponse = IResponse<void>
export type ProductRemoveImageRequest = {
    productId: number;
    imageId: number;
}

export type ProductCreateFeatureResponse = IResponse<void>
export type ProductCreateFeatureRequest = {
    productId: number;
    title: string;
    createFeatureValues: Pick<IProductFeatureValue, "key" | "value">[];
}

export type ProductUpdateFeatureResponse = IResponse<void>
export type ProductUpdateFeatureRequest = {
    productId: number;
    featureId: number;
    title?: string;
    position?: number;
    reorderFeatureValue?: Pick<IProductFeatureValue, "id" | "position">;
    createFeatureValues?: Pick<IProductFeatureValue, "key" | "value">[];
    updateFeatureValues?: Pick<IProductFeatureValue, "key" | "value" | "id">[];
    deleteFeatureValues?: Pick<IProductFeatureValue, "id">[];
}

export type ProductRemoveFeatureResponse = IResponse<void>
export type ProductRemoveFeatureRequest = {
    productId: number;
    featureId: number;
}



// variantService

export type VariantSearchResponse = IResponse<IVariantSearch[]>
export type VariantSearchRequest = {
    q?: string;
    limit?: number;
    skip?: number;
}

export type VariantGetAllResponse = IResponse<IVariantPreview[]>
export type VariantGetAllRequest = {
    productId: number
}

export type VariantGetPreviewResponse = IResponse<IOfferVariantPreview>
export type VariantGetPreviewRequest = {
    variantId: number
}

export type VariantGetByIdResponse = IResponse<IVariant>
export type VariantGetByIdRequest = {
    variantId: number
}

export type VariantCreateResponse = IResponse<string>
export type VariantCreateRequest = {
    productId?: number;
    title?: string | null;
    price?: string | null;
    compareAtPrice?: string | null;
    barcode?: string | null;
    sku?: string | null;
}

export type VariantUpdateResponse = IResponse<void>
export type VariantUpdateRequest = {
    variantId?: number;
    title?: string | null;
    price?: string | null;
    compareAtPrice?: string | null;
    barcode?: string | null;
    sku?: string | null;
}

export type VariantDeleteResponse = IResponse<void>
export type VariantDeleteRequest = {
    variantId: number;
}



// collectionService

export type CollectionSearchResponse = IResponse<ICollectionSearch[]>
export type CollectionSearchRequest = {
    q?: string;
    limit?: number;
    skip?: number;
}

export type CollectionGetProductsResponse = IResponse<ICollectionProduct[]>
export type CollectionGetProductsRequest = {
    collectionId: number
    q?: string;
    limit?: number;
    skip?: number;
}

export type CollectionGetByIdResponse = IResponse<ICollection>
export type CollectionGetByIdRequest = {
    collectionId: number
}

export type CollectionCreateResponse = IResponse<string>
export type CollectionCreateRequest = {
    title?: string;
    handle?: string;
    hidden?: boolean;
    description?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    vendor?: string | null;
    connectProducts?: Pick<IProduct, "id">[];
}

export type CollectionUpdateResponse = IResponse<void>
export type CollectionUpdateRequest = {
    collectionId?: number
    title?: string;
    handle?: string;
    hidden?: boolean;
    description?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    connectProducts?: Pick<IProduct, "id">[];
    disconnectProducts?: Pick<IProduct, "id">[];
}

export type CollectionDeleteResponse = IResponse<void>
export type CollectionDeleteRequest = {
    collectionId: number;
}

export type CollectionUploadImagesResponse = IResponse<void>
export type CollectionUploadImagesRequest = {
    collectionId: number;
    formData: FormData;
}

export type CollectionUpdateImageResponse = IResponse<void>
export type CollectionUpdateImageRequest = {
    collectionId: number;
    imageId: number;
    src?: string;
    alt?: string;
    position?: number;
}

export type CollectionRemoveImageResponse = IResponse<void>
export type CollectionRemoveImageRequest = {
    collectionId: number;
    imageId: number;
}





// pageService

export type PageSearchResponse = IResponse<IPageSearch[]>
export type PageSearchRequest = {
    q?: string;
    limit?: number;
    skip?: number;
}

export type PageGetByIdResponse = IResponse<IPage>
export type PageGetByIdRequest = {
    pageId: number
}

export type PageCreateResponse = IResponse<string>
export type PageCreateRequest = {
    title?: string;
    handle?: string;
    content?: string;
    metaTitle?: string | null;
    metaDescription?: string | null;
}

export type PageUpdateResponse = IResponse<void>
export type PageUpdateRequest = {
    pageId?: number
    title?: string;
    handle?: string;
    content?: string;
    metaTitle?: string | null;
    metaDescription?: string | null;
}

export type PageDeleteResponse = IResponse<void>
export type PageDeleteRequest = {
    pageId: number;
}







// offerService

export type OfferSearchResponse = IResponse<IOfferSearch[]>
export type OfferSearchRequest = {
    q?: string;
    limit?: number;
    skip?: number;
    status?: string;
    notStatus?: string;
    deliveryProfileId?: number;
    notDeliveryProfileId?: number;
}

export type OfferGetByIdResponse = IResponse<IOffer>
export type OfferGetByIdRequest = {
    offerId: number
}

export type OfferCreateResponse = IResponse<string>
export type OfferCreateRequest = {
    variantId?: number;
    price?: string | null;
    compareAtPrice?: string | null;
    offerPrice?: string | null;
    comment?: string | null;
    deliveryProfileId?: number;
    status?: string;
    userId?: number | null;
}

export type OfferUpdateResponse = IResponse<void>
export type OfferUpdateRequest = {
    offerId?: number;
    variantId?: number;
    price?: string | null;
    compareAtPrice?: string | null;
    offerPrice?: string | null;
    comment?: string | null;
    deliveryProfileId?: number;
    status?: string;
    userId?: number | null;
}

export type OfferDeleteResponse = IResponse<void>
export type OfferDeleteRequest = {
    offerId: number;
}






// shippingService

export type DeliveryProfileSearchResponse = IResponse<IDeliveryProfilePreview[]>
export type DeliveryProfileSearchRequest = {
    q?: string;
    limit?: number;
    skip?: number;
}

export type DeliveryProfileGetDeliveryZonesResponse = IResponse<IDeliveryZone[]>
export type DeliveryProfileGetDeliveryZonesRequest = {
    profileId: number;
    q?: string;
    limit?: number;
    skip?: number;
}

export type DeliveryProfileGetByIdResponse = IResponse<IDeliveryProfile>
export type DeliveryProfileGetByIdRequest = {
    profileId: number;
}

export type DeliveryProfileCreateResponse = IResponse<string>
export type DeliveryProfileCreateRequest = {
    title: string;
}

export type DeliveryProfileUpdateResponse = IResponse<void>
export type DeliveryProfileUpdateRequest = {
    profileId?: number;
    connectOffers?: Pick<IOffer, "id">[];
    disconnectOffers?: Pick<IOffer, "id">[];
}

export type DeliveryProfileDeleteResponse = IResponse<void>
export type DeliveryProfileDeleteRequest = {
    profileId: number;
}

export type DeliveryZoneCreateResponse = IResponse<void>
export type DeliveryZoneCreateRequest = {
    profileId: number;
    country?: string;
    region?: string;
}

export type DeliveryZoneUpdateResponse = IResponse<void>
export type DeliveryZoneUpdateRequest = {
    profileId: number;
    zoneId: number;
    createDeliveryOptions?: Omit<IDeliveryOption, "id">[];
    updateDeliveryOptions?: IDeliveryOption[];
    deleteDeliveryOptions?: number[];
}

export type DeliveryZoneDeleteResponse = IResponse<void>
export type DeliveryZoneDeleteRequest = {
    profileId: number;
    zoneId: number;
}


// orderService

export type OrderSearchResponse = IResponse<IOrderSearch[]>
export type OrderSearchRequest = {
    q?: string;
    limit?: number;
    skip?: number;
    paymentStatus?: string;
    orderStatus?: string;
}

export type OrderTimelineSearchResponse = IResponse<ITimeline[]>
export type OrderTimelineSearchRequest = {
    orderId?: number;
    q?: string;
    limit?: number;
    skip?: number;
}

export type OrderGetByIdResponse = IResponse<IOrder>
export type OrderGetByIdRequest = {
    orderId: number
}

export type OrderFulfillmentGetByIdResponse = IResponse<IFulfillment>
export type OrderFulfillmentGetByIdRequest = {
    orderId: number,
    fulfillmentId: number;
}

export type OrderReturnGetByIdResponse = IResponse<IOrderReturn>
export type OrderReturnGetByIdRequest = {
    orderId: number,
    returnId: number;
}

export type OrderCreateResponse = IResponse<string>
export type OrderCreateRequest = {
    userId?: number;
    mailingCountry?: string;
    mailingCity?: string;
    mailingRegion?: string;
    mailingAddress?: string;
    note?: string | null;
    offers?: Pick<IOffer, "id">[];
}

export type OrderUpdateResponse = IResponse<void>
export type OrderUpdateRequest = {
    orderId?: number;
    userId?: number;
    mailingCountry?: string;
    mailingCity?: string;
    mailingRegion?: string;
    mailingAddress?: string;
    note?: string | null;
    createOffers?: Pick<IOffer, "id">[];
    deleteOffers?: Pick<IOffer, "id">[];
}

export type OrderConfirmPaymentUpdateResponse = IResponse<void>
export type OrderConfirmPaymentUpdateRequest = {
    orderId?: number;
}

export type OrderFulfillmentCreateResponse = IResponse<string>
export type OrderFulfillmentCreateRequest = {
    orderId?: number;
    offers?: Pick<IOffer, "id">[];
}

export type OrderFulfillmentUpdateResponse = IResponse<void>
export type OrderFulfillmentUpdateRequest = {
    orderId?: number;
    fulfillmentId?: number;
    carrier?: string;
    tracking?: string;
    status?: FulfillmentStatus;
}

export type OrderFulfillmentDeleteResponse = IResponse<void>
export type OrderFulfillmentDeleteRequest = {
    orderId?: number;
    fulfillmentId?: number;
}

export type OrderReturnCreateResponse = IResponse<string>
export type OrderReturnCreateRequest = {
    orderId?: number;
    offers?: Pick<IReturnProduct, "id" | "reason">[];
}

export type OrderReturnUpdateResponse = IResponse<void>
export type OrderReturnUpdateRequest = {
    orderId?: number;
    returnId?: number;
    status?: ReturnStatus;
    carrier?: string;
    tracking?: string;
}

export type OrderReturnDeleteResponse = IResponse<void>
export type OrderReturnDeleteRequest = {
    orderId?: number;
    returnId?: number;
}



// variableService

export type VariableSearchResponse = IResponse<IVariable[]>
export type VariableSearchRequest = {
    group: string;
}


export type VariableUpdateResponse = IResponse<void>
export type VariableUpdateRequest = {
    updateVariables: Pick<IVariable, 'group' | 'key' | 'value'>[]
}