import { LoaderFunction } from "react-router-dom";

export type LoaderData<Loader extends LoaderFunction> = Awaited<
  ReturnType<Loader>
>;
