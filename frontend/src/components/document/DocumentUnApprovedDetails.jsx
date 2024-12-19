// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import "moment/locale/vi";
// import { useParams } from "react-router-dom";
// import { getDocumentUnApprovedDetailByIdAPI } from "../../services/documentService";
// import Header from "../Header";
// import FiltersCard from "../FiltersCard";
// import Sidebar from "../Sidebar";
// import Loading from "../Loading";
// import PdfComp from "../PdfComp";

// const DocumentUnApprovedDetails = () => {
//   moment.locale("vi");
//   const [document, setDocument] = useState();
//   const [isLoading, setIsLoading] = useState(false);
//   const { documentId } = useParams();

//   const getData = async () => {
//     setIsLoading(true);
//     try {
//       const data = await getDocumentUnApprovedDetailByIdAPI(documentId);
//       setDocument(data?.data);
//     } catch (error) {}
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     if (documentId) {
//       getData();
//     }
//   }, [documentId]);

//   return (
//     <div className="w-full px-0 pb-20 bg-gray-100 lg:rounded-lg h-screen overflow-hidden">
//       <Header />
//       <div className="w-screen mt-24 flex justify-center gap-2 lg:gap-4 pt-3 h-full">
//         <div className="hidden w-1/6 h-full md:flex flex-col gap-6 overflow-y-auto bg-white">
//           <Sidebar />
//           <FiltersCard />
//         </div>

//         {/* CENTER */}
//         <div className="w-1/2 h-full flex flex-col gap-6 overflow-y-auto rounded-lg">
//           <div className="bg-white p-4 rounded-xl mb-20">
//             {isLoading ? (
//               <Loading />
//             ) : (
//               <>
//                 {document ? (
//                   <>
//                     <div className="text-2xl font-medium mb-5">
//                       {document?.title}
//                     </div>

//                     <div className="flex text-md mb-14">
//                       <span>
//                         Ngày:{" "}
//                         {moment(document?.created_at).format("DD/MM/YYYY")}
//                       </span>
//                     </div>
//                     {/* Render nội dung bài viết với HTML */}
//                     <div
//                       dangerouslySetInnerHTML={{
//                         __html: document?.content,
//                       }}
//                       className="pb-10"
//                     ></div>

//                     <PdfComp pathFile={document?.files[0]?.path} />
//                   </>
//                 ) : (
//                   <div className="text-center">Tài liệu không tồn tại</div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DocumentUnApprovedDetails;
