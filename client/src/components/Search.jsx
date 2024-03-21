import React from "react";
import { Checkbox } from "./ui/checkbox";

import { Button } from "./ui/button";
import { MenuItem, Select } from "@mui/material";
const Search = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              name="searchTerm"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex items-center gap-2 ">
              <Checkbox id="all" />
              <span>Rent & Sale</span>
            </div>
            <div className="flex items-center gap-2 ">
              <Checkbox id="rent" />
              <span>Rent</span>
            </div>
            <div className="flex items-center gap-2 ">
              <Checkbox id="sale" />
              <span>Sale</span>
            </div>
            <div className="flex items-center gap-2 ">
              <Checkbox id="offer" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex flex-wrap items-center gap-2 ">
              <Checkbox id="parking" />
              <span>Parking</span>
            </div>
            <div className="flex items-center gap-2 ">
              <Checkbox id="furnished" />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <label className="font-semibold">Sort:</label>
            <Select
              id="sort_order"
              autoWidth
              size="small"
              defaultValue="latest"
              className="rounded-lg bg-white border border-gray-200"
            >
              <MenuItem value="phl">Price high to low</MenuItem>
              <MenuItem value="plh">Price low to high</MenuItem>
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
            </Select>
          </div>
          <Button variant="outline">Search</Button>
        </form>
      </div>
      <div>
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700">
          Search results:
        </h1>
      </div>
    </div>
  );
};

export default Search;
