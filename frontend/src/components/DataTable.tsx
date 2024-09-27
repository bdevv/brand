import { PropsWithChildren, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import DeleteButton from "./buttons/DeleteButton";

interface DataTableProps {
  dataArray: Array<{
    url: string;
    title: string;
    views: number;
    cr: number;
    status: string;
  }>;
  header: Array<{ header: string; align: string; width: string }>;
  onSort: (sort: string) => void;
  onFilter: (status: string) => void;
  onDelete: (url: string) => void;
}
const DataTable: React.FC<PropsWithChildren<DataTableProps>> = ({
  dataArray,
  header,
  onSort,
  onFilter,
  onDelete,
}) => {
  const user = useSelector((state: RootState) => state.authReducer.user);
  const [sorting, setSorting] = useState("");
  const [showPopup, setShowPopupMenu] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const handleSorting = () => {
    if (sorting === "") {
      setSorting("ascending");
      onSort("ascending");
    } else if (sorting === "ascending") {
      setSorting("descending");
      onSort("descending");
    } else if (sorting == "descending") {
      setSorting("");
      onSort("");
    }
  };
  const handleShowStatus = () => {
    setShowPopupMenu(!showPopup);
  };
  const handleSelectStatus = (status: string) => {
    onFilter(status);
  };

  useEffect(() => {
    if (
      user.email === "ryan@brandgain.com" ||
      user.email === "rybread123@hotmail.com" ||
      user.email === "yigitmufata3@gmail.com"
    ) {
      setAdmin(true);
    }
  }, [user.email]);
  return (
    <table className="w-full min-h-full h-full">
      <thead>
        <tr>
          {header.map((item, itemIndex) => {
            if (item.header == "Action" && !isAdmin) return null;
            return (
              <th
                className={`h-[40px] leading-[35px] text-xl border-b-2 p-2 border-black ${
                  item.align === "left"
                    ? "text-left"
                    : item.align === "center"
                    ? "text-center"
                    : "text-right"
                } ${
                  item.header == "Views" || item.header == "Status"
                    ? "cursor-pointer relative"
                    : ""
                }`}
                key={itemIndex}
                style={{ width: item.width }}
                onClick={() => {
                  if (item.header == "Views") handleSorting();
                  if (item.header == "Status") handleShowStatus();
                }}
              >
                {item.header}{" "}
                {item.header == "Views" &&
                  (sorting === "" ? "" : sorting === "ascending" ? "▲" : "▼")}
                {item.header == "Status" && showPopup && (
                  <div
                    className="absolute mt-2 left-1/2 -translate-x-1/2 bg-white border border-gray-400
                  "
                  >
                    <button
                      className="w-full h-full  hover:bg-slate-200 border"
                      onClick={() => handleSelectStatus("ALL")}
                    >
                      ALL
                    </button>
                    <button
                      className="w-full h-full  hover:bg-slate-200 border"
                      onClick={() => handleSelectStatus("ONLINE")}
                    >
                      ONLINE
                    </button>
                    <button
                      className="w-full h-full  hover:bg-slate-200 border"
                      onClick={() => handleSelectStatus("REMOVED")}
                    >
                      REMOVED
                    </button>
                  </div>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {dataArray.map((item, index) => (
          <tr className="h-[50px]" key={index}>
            <td className="border-r-2 border-black p-2">
              <a href={item.url} target="_blank">
                {item.url}
              </a>
            </td>
            <td className="border-r-2 border-black p-2">{item.title}</td>
            <td className="border-r-2 border-black p-2 text-center">
              {item.views.toLocaleString("en-US")}
            </td>
            <td className="border-r-2 border-black text-center">{item.cr}</td>
            <td className="text-xl text-center">
              {item.status == "REMOVED" ? (
                <span className="bg-red-300 p-2">REMOVED</span>
              ) : (
                <span className="bg-[#5eff31] p-2">ONLINE</span>
              )}
            </td>
            <td className="flex w-full h-full justify-center items-center">
              {isAdmin && (
                <div
                  className="flex w-[30px] h-[30px] cursor-pointer justify-center"
                  onClick={() => {
                    onDelete(item.url);
                  }}
                >
                  <DeleteButton
                    color="red"
                    height={30}
                    width={30}
                  ></DeleteButton>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
