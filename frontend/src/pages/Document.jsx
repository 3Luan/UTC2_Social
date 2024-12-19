import Header from "../components/Header";
import FiltersCard from "../components/FiltersCard";
import Sidebar from "../components/Sidebar";
import DocumentCard from "../components/DocumentCard";
import NavBarDocument from "../components/NavBarDocument";
import {
  getDocumentsAPI,
  getHistoryDocumentsAPI,
  getUnapprovedDocumentsAPI,
  searchDocumentAPI,
  searchHistoryDocumentAPI,
  searchUnApprovedDocumentAPI,
} from "../services/documentService";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useLocation } from "react-router-dom";
import CustomPagination from "../components/CustomCustomPagination";

const Document = () => {
  const [documents, setDocuments] = useState([]);
  const [count, setCount] = useState();
  const [currentPage, setCurrentPage] = useState();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");

  const addDocument = (data) => {
    if (data.documents) {
      setDocuments((documents) => [data.documents, ...documents]);
    } else {
      setDocuments((documents) => [data, ...documents]);
    }
  };

  const deleteDocument = (documentId) => {
    setDocuments((documents) =>
      documents.filter((document) => document._id !== documentId)
    );
  };

  useEffect(() => {
    if (!isLoading) {
      setDocuments(documents);
      setCount(count);
    }
  }, [documents]);

  const handlePageClick = async (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    setIsLoading(true);

    try {
      let data;
      if (location.pathname === "/tai-lieu") {
        data = query
          ? await searchDocumentAPI(selectedPage.selected + 1, query)
          : (data = await getDocumentsAPI(selectedPage.selected + 1));
      } else if (location.pathname === "/tai-lieu/chua-duyet") {
        data = query
          ? await searchUnApprovedDocumentAPI(selectedPage.selected + 1, query)
          : (data = await getUnapprovedDocumentsAPI(selectedPage.selected + 1));
      } else if (location.pathname === "/tai-lieu/lich-su") {
        data = query
          ? await searchHistoryDocumentAPI(selectedPage.selected + 1, query)
          : (data = await getHistoryDocumentsAPI(selectedPage.selected + 1));
      }

      setDocuments(data?.data?.documents);
      setCount(data?.data?.count);
    } catch (error) {
      setDocuments([]);
      setCount(0);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full px-0 pb-20 bg-gray-100 lg:rounded-lg h-screen overflow-hidden">
      <Header />
      <div className="w-screen mt-24 flex justify-center gap-2 lg:gap-4 pt-3 h-full">
        <div className="hidden w-1/6 h-full md:flex flex-col gap-6 overflow-y-auto bg-white">
          <Sidebar />
          <FiltersCard />
        </div>

        {/* CENTER */}
        <div className="w-1/2 h-full flex flex-col  overflow-y-auto rounded-lg bg-white">
          <NavBarDocument
            nameNavBar={`Tài liệu`}
            addDocument={addDocument}
            setDocuments={setDocuments}
            setIsLoading={setIsLoading}
            setQuery={setQuery}
            setCount={setCount}
            setCurrentPage={setCurrentPage}
            queryy={query}
          />
          {/* {location.pathname === "/tai-lieu" ? (
            <> */}
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {documents?.length <= 0 ? (
                <div className="flex w-full h-full items-center justify-center">
                  <p className="text-lg text-ascent-2">
                    <>Chưa có tài liệu nào</>
                  </p>
                </div>
              ) : (
                <>
                  {documents?.map((document) => {
                    return (
                      <DocumentCard
                        doc={document}
                        link={`/tai-lieu`}
                        deleteDocument={deleteDocument}
                        addDocument={addDocument}
                      />
                    );
                  })}
                </>
              )}
            </>
          )}

          <div className="flex justify-center mb-10">
            <CustomPagination
              nextLabel=">"
              onPageChange={handlePageClick}
              pageCount={Math.ceil(count / 10)}
              previousLabel="<"
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Document;
