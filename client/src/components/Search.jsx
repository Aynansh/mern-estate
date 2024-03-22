import React, { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Search = () => {
  const navigate = useNavigate();
  const [sidebardata, setsidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermfromUrl = urlParams.get("searchTerm");
    const typefromUrl = urlParams.get("type");
    const parkingfromUrl = urlParams.get("parking");
    const furnishedfromUrl = urlParams.get("furnished");
    const offerfromUrl = urlParams.get("offer");
    const sortfromUrl = urlParams.get("sort");
    const orderfromUrl = urlParams.get("order");

    setsidebardata({
      searchTerm: searchTermfromUrl || "",
      type: typefromUrl || "all",
      parking: parkingfromUrl === "true" ? true : false || false,
      furnished: furnishedfromUrl === "true" ? true : false || false,
      offer: offerfromUrl === "true" ? true : false || false,
      sort: sortfromUrl || "createdAt",
      order: orderfromUrl || "desc",
    });

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setListing(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleCheckboxChange = (id, checked) => {
    if (id === "all") setsidebardata({ ...sidebardata, type: "all" });
    else if (id === "rent") setsidebardata({ ...sidebardata, type: "rent" });
    else if (id === "sale") setsidebardata({ ...sidebardata, type: "sale" });
    else if (id === "offer") {
      setsidebardata({ ...sidebardata, offer: checked });
    } else if (id === "parking") {
      setsidebardata({ ...sidebardata, parking: checked });
    } else if (id === "furnished") {
      setsidebardata({ ...sidebardata, furnished: checked });
    }
  };

  const handleSelectbox = (e) => {
    const sort = e.target.value.split("_")[0] || "createdAt";
    const order = e.target.value.split("_")[1] || "desc";

    setsidebardata({ ...sidebardata, sort, order });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
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
              value={sidebardata.searchTerm}
              onChange={(e) => {
                setsidebardata({ ...sidebardata, searchTerm: e.target.value });
              }}
            />
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex items-center gap-2 ">
              <Checkbox
                id="all"
                checked={sidebardata.type === "all"}
                onCheckedChange={() => handleCheckboxChange("all")}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex items-center gap-2 ">
              <Checkbox
                id="rent"
                checked={sidebardata.type === "rent"}
                onCheckedChange={() => handleCheckboxChange("rent")}
              />
              <span>Rent</span>
            </div>
            <div className="flex items-center gap-2 ">
              <Checkbox
                id="sale"
                checked={sidebardata.type === "sale"}
                onCheckedChange={() => handleCheckboxChange("sale")}
              />
              <span>Sale</span>
            </div>
            <div className="flex items-center gap-2 ">
              <Checkbox
                id="offer"
                checked={sidebardata.offer}
                onCheckedChange={(e) => handleCheckboxChange("offer", e)}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex flex-wrap items-center gap-2 ">
              <Checkbox
                id="parking"
                isChecked={sidebardata.parking}
                onCheckedChange={(e) => handleCheckboxChange("parking", e)}
              />
              <span>Parking</span>
            </div>
            <div className="flex items-center gap-2 ">
              <Checkbox
                id="furnished"
                isChecked={sidebardata.furnished}
                onCheckedChange={(e) => handleCheckboxChange("furnished", e)}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <label className="font-semibold">Sort:</label>
            <Select
              id="sort_order"
              autoWidth
              size="small"
              defaultValue="createdAt_desc"
              className="rounded-lg bg-white border border-gray-200"
              onChange={(e) => handleSelectbox(e)}
            >
              <MenuItem value="regularPrice_desc">Price high to low</MenuItem>
              <MenuItem value="regularPrice_asc">Price low to high</MenuItem>
              <MenuItem value="createdAt_desc">Latest</MenuItem>
              <MenuItem value="createdAt_asc">Oldest</MenuItem>
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
