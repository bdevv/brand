import React, { useEffect, useState } from "react";
import { MainLayout } from "../layout/MainLayout";
import { SummaryView } from "../components/home";
import DataTable from "../components/DataTable";
import userService from "../api/services";
import LoadingCircle from "../components/loading";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toast } from "react-toastify";
import CsvDownloader from "react-csv-downloader";
import DownloadButton from "../components/buttons/DownloadButton";

const TABLE_HEADERS_SETTINGS = [
  { header: "Detected Videos", align: "left", width: "30%" },
  { header: "Title", align: "left", width: "30%" },
  { header: "Views", align: "center", width: "10%" },
  { header: "CR", align: "center", width: "10%" },
  { header: "Status", align: "center", width: "20%" },
  { header: "Action", align: "center", width: "10%" },
];
const YouTube = () => {
  const user = useSelector((state: RootState) => state.authReducer.user);
  const username = useSelector(
    (state: RootState) => state.authReducer.username
  );
  const [sorting, setSorting] = useState("");
  const [filter, setFilter] = useState("");
  const [offset, setOffset] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [summaryArray, setSummaryArray] = useState<
    Array<{ title: string; value: string }>
  >([
    { title: "TCI Copyright Infringements", value: "" },
    { title: "Percentage Removed", value: "" },
    { title: "Total Views Removed", value: "" },
  ]);
  const [dataArray, setDataArray] = useState<
    Array<{
      url: string;
      title: string;
      views: number;
      cr: number;
      status: string;
    }>
  >([]);

  const getYoutubeSummary = async () => {
    const results = await userService.getYoutubeSummary();
    if (results?.data.data) {
      setSummaryArray(results.data.data);
    } else {
      toast.error("Fetching Data is not finished yet, please try again", {
        position: "bottom-left",
      });
    }
  };
  const handleSort = async (sorting: string) => {
    setSorting(sorting);
  };
  const handleFilter = async (status: string) => {
    setFilter(status);
    // const results = await userService.getYoutubeData(sorting, 0, 50);
  };
  const handleLoadMore = async () => {
    setOffset(offset + 50);
  };
  const loadData = async () => {
    const results = await userService.getYoutubeData(
      sorting,
      offset,
      50,
      filter
    );
    if (results?.data.data) {
      setTotalRows(results?.data.total);
      setDataArray([...dataArray, ...results?.data.data]);
    } else {
      toast.error("Fetching Data is not finished yet, please try again", {
        position: "bottom-left",
      });
    }
  };
  const loadSortingFilterData = async () => {
    const results = await userService.getYoutubeData(sorting, 0, 50, filter);
    if (results?.data.data) {
      setDataArray(results?.data.data);
      setTotalRows(results.data.total);
    } else {
      toast.error("Fetching Data is not finished yet, please try again", {
        position: "bottom-left",
      });
    }
  };
  const loadAllData = async () => {
    const results = await userService.getYoutubeData(
      sorting,
      0,
      totalRows,
      "ALL"
    );
    if (results?.data.data) {
      return Promise.resolve(
        results.data.data.map((item: any) => ({
          url: item.url.replace(/,/g, ""),
          title: item.title.replace(/,/g, ""),
          views: item.views,
          cr: item.cr,
          status: item.status,
        }))
      );
    } else {
      toast.error("Fetching Data is not finished yet, please try again", {
        position: "bottom-left",
      });
      return Promise.resolve([]);
    }
  };
  const handleDelete = async (url: string) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      const results = await userService.deleteVideo(url);

      if (results.data == "success") {
        const index = dataArray.findIndex((item) => item.url === url);
        const updatedArray = [...dataArray];

        if (index !== -1) {
          updatedArray.splice(index, 1); // Remove one item at the found index
          setDataArray([...updatedArray]); // Update state with the modified array
          toast.success("video deleted successfully", {
            position: "top-right",
          });
        }
      } else if (results.data === "not exist")
        toast.success("video does not exist", {
          position: "top-right",
        });
    } catch (error) {
      toast.error("Cannot delete video", {
        position: "top-right",
      });
    }
  };
  useEffect(() => {
    loadData();
  }, [offset]);
  useEffect(() => {
    setOffset(0);
    setDataArray([]);
    loadSortingFilterData();
  }, [filter, sorting]);
  useEffect(() => {
    getYoutubeSummary();
  }, []);
  console.log("TOTALROWS", totalRows);
  console.log("OFFSET", offset);
  const columns = [
    { id: "url", displayName: "Detected Videos" },
    { id: "title", displayName: "Title" },
    { id: "views", displayName: "Views" },
    { id: "cr", displayName: "CR" },
    { id: "status", displayName: "Status" },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col w-full h-full bg-[#F3F1F2] pt-16 px-16 font-bold font-[InstagramSansBold] min-h-[100vh]">
        {loading && <LoadingCircle />}
        <div className="flex w-full">
          <span className="text-5xl font-bold">{username}</span>
        </div>
        <div className="flex w-full h-[150px] mt-8 justify-between ">
          {summaryArray.map((item, itemIndex) => (
            <SummaryView key={itemIndex} {...item} />
          ))}
        </div>
        <div className="flex ">
          <CsvDownloader
            filename={"youtube"}
            extension=".csv"
            separator=","
            wrapColumnChar=""
            columns={columns}
            datas={loadAllData}
            text="DOWNLOAD"
          >
            <DownloadButton width={20} height={20} />
          </CsvDownloader>
        </div>

        <div className="flex flex-1 relative w-full h-full mt-2 justify-between bg-white rounded-xl p-2 ">
          <DataTable
            dataArray={dataArray}
            header={TABLE_HEADERS_SETTINGS}
            onSort={handleSort}
            onFilter={handleFilter}
            onDelete={handleDelete}
          />
        </div>
        {totalRows - 50 >= offset && (
          <div>
            <button
              className="bg-slate-300 mt-2 mb-4"
              onClick={() => {
                handleLoadMore();
              }}
            >
              Load more...
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default YouTube;
