import { TPageType } from "./pageType";

export type TQuery<T> = TPageType & (T | null);
