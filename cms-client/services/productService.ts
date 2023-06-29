import { api } from "@/store/api";
import { ProductCreateFeatureRequest, ProductCreateFeatureResponse, ProductCreateRequest, ProductCreateResponse, ProductDeleteRequest, ProductDeleteResponse, ProductGetByIdRequest, ProductGetByIdResponse, ProductRemoveImageRequest, ProductRemoveImageResponse, ProductRemoveFeatureRequest, ProductRemoveFeatureResponse, ProductSearchRequest, ProductSearchResponse, ProductUpdateImageRequest, ProductUpdateImageResponse, ProductUpdateFeatureRequest, ProductUpdateFeatureResponse, ProductUpdateRequest, ProductUpdateResponse, ProductUploadImagesRequest, ProductUploadImagesResponse } from "@/types/api";

export const productService = api.injectEndpoints({
    endpoints: builder => ({
        getProductsBySearch: builder.query<ProductSearchResponse, ProductSearchRequest>({
            query: (credentials) => ({
                url: "products/search",
                method: "GET",
                params: credentials
            }),
            providesTags: ["PRODUCTS"]
        }),
        getProductById: builder.query<ProductGetByIdResponse, ProductGetByIdRequest>({
            query: ({ productId }) => ({
                url: `products/${productId}`,
                method: "GET",
            }),
            providesTags: ["PRODUCT"]
        }),
        createProduct: builder.mutation<ProductCreateResponse, ProductCreateRequest>({
            query: (credentials) => ({
                url: "products/create",
                method: "POST",
                body: credentials
            }),
            invalidatesTags: ["PRODUCTS"]
        }),
        updateProduct: builder.mutation<ProductUpdateResponse, ProductUpdateRequest>({
            query: ({ productId, ...rest }) => ({
                url: `products/${productId}`,
                method: "PUT",
                body: rest
            }),
            invalidatesTags: ["PRODUCT", "COLLECTION"]
        }),
        deleteProduct: builder.mutation<ProductDeleteResponse, ProductDeleteRequest>({
            query: ({ productId }) => ({
                url: `products/${productId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["OFFER", "OFFERS"]
        }),
        uploadProductImages: builder.mutation<ProductUploadImagesResponse, ProductUploadImagesRequest>({
            query: ({ productId, formData }) => ({
                url: `products/${productId}/uploadImages`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["PRODUCT", "OFFER", "OFFERS"]
        }),
        updateProductImage: builder.mutation<ProductUpdateImageResponse, ProductUpdateImageRequest>({
            query: ({ productId, imageId, ...rest }) => ({
                url: `products/${productId}/updateImage/${imageId}`,
                method: "PUT",
                body: rest
            }),
            invalidatesTags: ["PRODUCT", "OFFER", "OFFERS"]
        }),
        removeProductImage: builder.mutation<ProductRemoveImageResponse, ProductRemoveImageRequest>({
            query: ({ productId, imageId }) => ({
                url: `products/${productId}/removeImage/${imageId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["PRODUCT", "OFFER", "OFFERS"]
        }),
        createFeature: builder.mutation<ProductCreateFeatureResponse, ProductCreateFeatureRequest>({
            query: ({ productId, ...rest }) => ({
                url: `products/${productId}/createFeature`,
                method: "POST",
                body: rest
            }),
            invalidatesTags: ["PRODUCT"]
        }),
        updateFeature: builder.mutation<ProductUpdateFeatureResponse, ProductUpdateFeatureRequest>({
            query: ({ productId, featureId, ...rest }) => ({
                url: `products/${productId}/updateFeature/${featureId}`,
                method: "PUT",
                body: rest
            }),
            invalidatesTags: ["PRODUCT"]
        }),
        removeFeature: builder.mutation<ProductRemoveFeatureResponse, ProductRemoveFeatureRequest>({
            query: ({ productId, featureId }) => ({
                url: `products/${productId}/removeFeature/${featureId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["PRODUCT"]
        })
    })
})

export const {
    useLazyGetProductsBySearchQuery,
    useGetProductByIdQuery,
    useCreateFeatureMutation,
    useCreateProductMutation,
    useDeleteProductMutation,
    useRemoveProductImageMutation,
    useUploadProductImagesMutation,
    useUpdateProductImageMutation,
    useUpdateFeatureMutation,
    useRemoveFeatureMutation,
    useUpdateProductMutation
} = productService
