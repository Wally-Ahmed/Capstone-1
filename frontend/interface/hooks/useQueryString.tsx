import useSearchParams from "./useSearchParams";
import { useCallback } from "react";


export default function useQueryString(key: string | null | undefined) {
    const [params, updateParams] = useSearchParams();
    const value: string | undefined = key ? params.get(key) : undefined;

    const setValue = useCallback(
        (newValue: string | null | undefined) => {
            if (!key) return;

            updateParams(params => {
                newValue != null ? params.set(key, newValue) : params.delete(key);
            });
        },
        [key, params],
    );

    return [value, setValue] as const;
}