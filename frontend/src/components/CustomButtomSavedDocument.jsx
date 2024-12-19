import React, { useEffect, useState } from "react";
import {
  saveDocumentAPI,
  UnsaveDocumentAPI,
} from "../services/documentService";
import toast from "react-hot-toast";
import { getSavedPostIdAPI } from "../services/postService";

const CustomButtomSavedDocument = ({ documentId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState();
  const [documentSaveId, setDocumentSaveId] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      const data = await getSavedPostIdAPI();
      setDocumentSaveId(data?.data);
    } catch (error) {
      setDocumentSaveId([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsSaved(documentSaveId.some((id) => id === documentId));
  }, [documentSaveId]);

  const onclickToggleSave = async () => {
    setIsLoading(true);
    if (isSaved) {
      try {
        await toast.promise(UnsaveDocumentAPI(documentId), {
          loading: "Loading...",
          success: (data) => {
            return data.message;
          },
          error: (error) => {
            console.log(error);

            return error?.data?.message;
          },
        });
      } catch (error) {}
    } else {
      try {
        await toast.promise(saveDocumentAPI(documentId), {
          loading: "Loading...",
          success: (data) => {
            return data?.message;
          },
          error: (error) => {
            return error?.data?.message;
          },
        });
      } catch (error) {}
    }

    setIsSaved(!isSaved);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <>
          <button className="pl-2 text-xl font-semibold">
            <i className="fas fa-circle-notch fa-spin w-5 h-5"></i>
            <span className="text-base ml-2">Lưu</span>
          </button>
        </>
      ) : (
        <>
          <button
            className="pl-2 text-xl font-semibold text-slate-600"
            onClick={onclickToggleSave}
          >
            {isSaved ? (
              <i className="fa-solid fa-bookmark  w-5 h-5"></i>
            ) : (
              <i className="fa-regular fa-bookmark  w-5 h-5"></i>
            )}
            <span className="text-base ml-2">Lưu</span>
          </button>
        </>
      )}
    </>
  );
};

export default CustomButtomSavedDocument;
