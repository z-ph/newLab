import { getApiTeacherStudents } from "@/core/api/generated";
import client from "@/core/api/config";
import type { GetApiQueryParamsType } from "@/core/utils/typeUtils";
import { useQuery } from "@tanstack/vue-query";

export default function useQueryStudentsBase(queryParams?: GetApiQueryParamsType<typeof getApiTeacherStudents>) {
    return useQuery({
        queryKey: ['students'],
        queryFn:()=>getApiTeacherStudents({
            query: queryParams,
            client
        }),
        select:res=>res.data?.data
    })
}

export  function useQueryStudentsAll() {
    return useQueryStudentsBase();
}