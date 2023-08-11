import { api } from "@/store/api";
import { VariantCreateRequest, VariantCreateResponse, VariantDeleteRequest, VariantDeleteResponse, VariantGetAllRequest, VariantGetAllResponse, VariantGetByIdRequest, VariantGetByIdResponse, VariantGetPreviewRequest, VariantGetPreviewResponse, VariantSearchRequest, VariantSearchResponse, VariantUpdateRequest, VariantUpdateResponse } from "@/types/api";

export const variantService = api.injectEndpoints({
    endpoints: builder => ({
        getVariantsBySearch: builder.query<VariantSearchResponse, VariantSearchRequest>({
            query: credentials => ({
                url: "variants/search",
                method: "GET",
                params: credentials
            }),
            providesTags: ["VARIANTS"]
        }),
        getVariants: builder.query<VariantGetAllResponse, VariantGetAllRequest>({
            query: ({ productId }) => ({
                url: `variants/getAll/${productId}`,
                method: "GET",
            }),
            providesTags: ["VARIANTS"]
        }),
        getVariantPreview: builder.query<VariantGetPreviewResponse, VariantGetPreviewRequest>({
            query: ({ variantId }) => ({
                url: `variants/getPreview/${variantId}`,
                method: "GET",
            })
        }),
        getVariantById: builder.query<VariantGetByIdResponse, VariantGetByIdRequest>({
            query: ({ variantId }) => ({
                url: `variants/${variantId}`,
                method: "GET",
            }),
            providesTags: ["VARIANT"]
        }),
        createVariant: builder.mutation<VariantCreateResponse, VariantCreateRequest>({
            query: (credentials) => ({
                url: "variants/create",
                method: "POST",
                body: credentials
            }),
            invalidatesTags: ["VARIANTS"]
        }),
        updateVariant: builder.mutation<VariantUpdateResponse, VariantUpdateRequest>({
            query: ({ variantId, ...rest }) => ({
                url: `variants/${variantId}`,
                method: "PUT",
                body: rest
            }),
            invalidatesTags: ["VARIANTS", "VARIANT", "OFFER", "OFFERS"]
        }),
        deleteVariant: builder.mutation<VariantDeleteResponse, VariantDeleteRequest>({
            query: ({ variantId }) => ({
                url: `variants/${variantId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["VARIANTS", "OFFERS", "OFFER"]
        })
    })
})

export const {
    useGetVariantsQuery,
    useLazyGetVariantsBySearchQuery,
    useLazyGetVariantPreviewQuery,
    useGetVariantByIdQuery,
    useCreateVariantMutation,
    useUpdateVariantMutation,
    useDeleteVariantMutation,
} = variantService
