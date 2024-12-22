import { useEffect, useState } from "react";
import StatiticsCard from "./StatiticsCard";
import {
  getDocumentStatisticsAPI,
  getUnapprovedDocumentStatisticsAPI,
  getapprovedDocumentStatisticsAPI,
} from "../../services/documentService";

const StatiticsDocument = ({ day, month, year }) => {
  const [countDocument, setCountDocument] = useState();
  const [countApprovedDocument, setCountApprovedDocument] = useState();
  const [countUnapprovedDocument, setCountUnapprovedDocument] = useState();

  useEffect(() => {
    getData();
  }, [day, month, year]);

  const getData = async () => {
    try {
      const postData = await getDocumentStatisticsAPI(day, month, year);
      setCountDocument(postData?.data);
    } catch (error) {
      setCountDocument(0);
    }

    try {
      const approvedData = await getapprovedDocumentStatisticsAPI(
        day,
        month,
        year
      );
      setCountApprovedDocument(approvedData?.data);
    } catch (error) {
      setCountApprovedDocument(0);
    }

    try {
      const unapprovedData = await getUnapprovedDocumentStatisticsAPI(
        day,
        month,
        year
      );
      setCountUnapprovedDocument(unapprovedData?.data);
    } catch (error) {
      setCountUnapprovedDocument(0);
    }
  };

  return (
    <div className="pt-4">
      <div className="flex">
        <div className="px-4 w-1/2">
          <StatiticsCard count={countDocument} title={"Tất cả tài liệu"} />
        </div>
        <div className="px-4 w-1/2">
          <StatiticsCard
            count={countApprovedDocument}
            title={"Tài liệu đã duyệt"}
          />
        </div>
      </div>
      <div className="flex">
        <div className="px-4 py-4 w-1/2">
          <StatiticsCard
            count={countUnapprovedDocument}
            title={"Tài liệu chưa duyệt"}
          />
        </div>
        <div className="px-4 py-4 w-1/2"></div>
      </div>
    </div>
  );
};

export default StatiticsDocument;
