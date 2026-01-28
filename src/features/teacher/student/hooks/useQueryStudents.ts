import { getApiTeacherStudents } from "@/core/api/generated";
import type { GetApiQueryParamsType } from "@/core/utils/typeUtils";
import { useQuery } from "@tanstack/vue-query";

export default function useQueryStudentsBase(queryParams?: GetApiQueryParamsType<typeof getApiTeacherStudents>) {
    return useQuery({
        queryKey: ['students'],
        queryFn:()=>getApiTeacherStudents({
            query: queryParams
        }),
        select:res=>res.data?.data
    })
}

export  function useQueryStudentsAll() {
    return useQueryStudentsBase();
}