"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import {
	useParams,
	usePathname,
	useRouter,
	useSearchParams,
} from "next/navigation";
import queryString from "query-string";

type TUpdatePathname = {
	url?: string;
	query: any;
	type?: "push" | "replace";
};
type TUseRouterCustom = {
	updatePathname: ({ url, query, type }: TUpdatePathname) => string;
	pathname: string;
	searchParams: URLSearchParams;
	router: AppRouterInstance;
	params: Params;
};
export const useRouterCustom = (): TUseRouterCustom => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const params = useParams();
	const isEmpty = (obj: any) => {
		return Object.keys(obj).length === 0;
	};
	const updatePathname = ({ url, query, type = "push" }: TUpdatePathname) => {
		const useUrl = url ? url : pathname;
		if (isEmpty(query)) {
			router.replace(useUrl);
			return useUrl;
		}
		let newQuery = queryString.parse(searchParams.toString());
		newQuery = { ...newQuery, ...query };
		const newUrl =
			useUrl +
			"?" +
			queryString.stringify(newQuery, {
				skipEmptyString: true,
				skipNull: true,
			});
		type === "push" ? router.push(newUrl) : router.replace(newUrl);
		return newUrl;
	};
	return { updatePathname, pathname, searchParams, router, params };
};
