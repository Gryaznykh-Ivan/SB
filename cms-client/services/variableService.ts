import { api } from "@/store/api";
import { VariableSearchRequest, VariableSearchResponse, VariableUpdateRequest, VariableUpdateResponse } from "@/types/api";

export const variableService = api.injectEndpoints({
    endpoints: builder => ({
        getVariablesByGroup: builder.query<VariableSearchResponse, VariableSearchRequest>({
            query: (credentials) => ({
                url: "variables/search",
                method: "GET",
                params: credentials
            }),
            providesTags: ["SETTING"]
        }),
        updateVariable: builder.mutation<VariableUpdateResponse, VariableUpdateRequest>({
            query: (credentials) => ({
                url: "variables/update",
                method: "PUT",
                body: credentials
            }),
            invalidatesTags: ["SETTING"]
        })
    })
})

export const {
    useGetVariablesByGroupQuery,
    useUpdateVariableMutation
} = variableService
