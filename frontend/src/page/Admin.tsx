import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { MainLayout } from "../layout/MainLayout";
import CustomDropZone from "../components/Admin/CustomDropZone";
import userService from "../api/services";
import { toast } from "react-toastify";
const Admin = () => {
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [base64, setBase64] = useState("");
  const [title, setTitle] = useState("");
  const [filename, setFileName] = useState("");
  const [trademarkArray, setTrademarkArray] = useState([]);
  const getTrademarks = async () => {
    const results = await userService.getTrademarks();
    if (results.status == 200) {
      const trademarks = results.data.map((item: any) => ({
        id: item.id,
        imageUrl: item.url,
        logoText: item.title,
      }));
      setTrademarkArray(trademarks);
    }
  };
  useEffect(() => {
    getTrademarks();
  }, []);
  const handleUploadImage = async (
    base64Image: string,
    filename: string,
    title: string
  ) => {
    if (base64Image) {
      try {
        // Create a FormData object and append the Blob to it

        const uploadResult = await userService.uploadImageToServer(
          base64Image,
          filename,
          title
        );
        const uploadResultData = uploadResult.data.data;
        if (uploadResult.status == 200) {
          let prevTradeArray = [...trademarkArray];
          prevTradeArray.push({
            id: uploadResultData.id,
            imageUrl: uploadResultData.url,
            logoText: uploadResultData.title,
          } as never);
          setUploadFileName("");
          setUploadedImage("");
          setBase64("");
          setTitle("");
          setFileName("");
          setTrademarkArray(prevTradeArray);
          toast.success("Image uploaded successfully", {
            position: "bottom-left",
          });
        } else {
          toast.error("An error occurred while uploading", {
            position: "bottom-left",
          });
        }
      } catch (e: any) {
        console.log("🚀 ~ handleUploadImage ~ e:", e.response);
        toast.error(e.response.data.error, {
          position: "bottom-left",
        });
      }
    }
  };
  const handleInputChange = (title: string) => {
    setTitle(title);
  };
  const handleDeleteTrade = async (id: number) => {
    const result = await userService.deleteTrade(id);
    try {
      if (result.status == 200) {
        toast.success("Trademark deleted successfully", {
          position: "bottom-left",
        });
        setTrademarkArray((prevArray) =>
          prevArray.filter((item: any) => item.id !== id)
        );
      } else {
        toast.error("An error occurred while deleting", {
          position: "bottom-left",
        });
      }
    } catch (e: any) {
      toast.error(e.response.data.error, {
        position: "bottom-left",
      });
    }
  };
  return (
    <MainLayout>
      <div className="flex flex-col w-full h-full bg-[#F3F1F2] p-16 font-bold font-[InstagramSansBold]">
        <div className="flex w-full">
          <span className="text-5xl font-bold">Admin Panel</span>
        </div>
        <div className="flex w-full h-[50px] items-center justify-center mt-8">
          <div className="flex w-2/4 h-full bg-slate-200 items-center justify-center">
            <span>{uploadFileName}</span>
          </div>
        </div>
        <div className="flex  w-full h-[400px]  items-center justify-center  mt-8">
          <div className="flex flex-col w-2/4 h-full bg-slate-200 items-center border-dashed border-2 border-blue-800 justify-center">
            <div className="flex w-[160px] h-[160px] bg-slate-200 items-center border-dashed border-2 border-blue-800 justify-center mt-8">
              <img src={uploadedImage}></img>
            </div>
            <div className="flex flex-col mt-4 mb-4 items-center justify-center">
              <CustomDropZone
                onDrop={(acceptedFiles: any[]) => {
                  const reader = new FileReader();
                  reader.onabort = () =>
                    console.log("file reading was aborted");
                  reader.onerror = () => console.log("file reading has failed");
                  reader.onload = async () => {
                    const base64String = reader.result as string;
                    // Convert ArrayBuffer to Blob
                    const blob = new Blob([base64String]);

                    // Create a data URL from the Blob
                    const dataUrl = URL.createObjectURL(blob);
                    setTitle("");
                    // Set the data URL as the source of the img tag
                    setUploadedImage(dataUrl);
                    setBase64(base64String);
                    setFileName(acceptedFiles[0].path);
                  };
                  reader.readAsArrayBuffer(acceptedFiles[0]);
                  setUploadFileName(acceptedFiles[0].path);
                }}
              />
              <input
                type={"text"}
                placeholder={"Enter trademark title"}
                className="text-box w-[250px] h-[44px] border-2 border-[#c9cccb] rounded-md p-2 mt-8"
                value={title}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              <button
                className="w-[150px] h-[50px] bg-[#aa045f] hover:bg-[#aa0449b6] text-white rounded-md mt-4"
                onClick={() => {
                  handleUploadImage(base64, filename, title);
                }}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
        <div className="flex w-full mt-4">
          <table className="w-full h-full">
            <thead>
              <tr>
                <th className="w-[30%] h-[40px] text-xl border p-2 border-black">
                  Title
                </th>
                <th className="w-[50%] h-[40px] text-xl border p-2 border-black">
                  Image URL
                </th>
                <th className="w-[20%] h-[40px] text-xl border p-2 border-black">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {trademarkArray.map((tradeItem: any) => (
                <tr>
                  <td className="h-[40px] text-sm text-center border p-2 border-gray-500">
                    {tradeItem.logoText}
                  </td>
                  <td className="h-[40px] text-sm text-center border p-2 border-gray-500">
                    {tradeItem.imageUrl}
                  </td>
                  <td className="h-[40px] text-sm text-center border p-2 border-gray-500">
                    <span
                      className="underline text-blue-700 cursor-pointer"
                      onClick={() => {
                        handleDeleteTrade(tradeItem.id);
                      }}
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
