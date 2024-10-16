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

type TUseRouterCustom = {
	updatePathname: ({ url, query }: { url?: string; query: any }) => string;
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
	const updatePathname = ({ url, query }: { url?: string; query: any }) => {
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
		router.push(newUrl);
		return newUrl;
	};
	return { updatePathname, pathname, searchParams, router, params };
};
