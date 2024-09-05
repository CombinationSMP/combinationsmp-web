"use client";

import { type APIPartialOrigin } from "@/types";
import { type ChangeEventHandler } from "react";
import Fuse, { type IFuseOptions } from "fuse.js";

const fuseOptions: IFuseOptions<APIPartialOrigin> = {
  useExtendedSearch: true,
  location: 0,
  distance: 10_000,
  findAllMatches: true,
  threshold: 0.3,
  keys: [
    {
      name: "name",
      weight: 3,
    },
    {
      name: "icon.alt",
      weight: 1,
    },
    {
      name: "description",
      weight: 2,
    },
  ],
};

interface IProps {
  fullOriginsList: APIPartialOrigin[] | undefined;
  setOriginsList: React.Dispatch<React.SetStateAction<APIPartialOrigin[] | undefined>>;
}

const SearchOriginList: React.FC<IProps> = ({ fullOriginsList, setOriginsList }) => {
  console.log(fullOriginsList);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    const fuse = new Fuse(fullOriginsList ?? [], fuseOptions);

    if (evt.target.value === "") {
      return setOriginsList(fullOriginsList);
    }

    const results = fuse.search(evt.target.value);

    setOriginsList(results.map((result) => result.item));
  };

  return (
    <input
      type="text"
      placeholder="Search"
      onChange={handleChange}
      style={{
        color: "#ffffff",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        borderRadius: "10px",
        padding: "1rem",
        border: "none",
        width: "100%",
      }}
    />
  );
};

export default SearchOriginList;
