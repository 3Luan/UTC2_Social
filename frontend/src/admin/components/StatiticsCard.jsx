import moment from "moment";
import "moment/locale/vi";

const StatiticsCard = ({ count, title }) => {
  moment.locale("vi");

  return (
    <div class="flex flex-row min-h-52 w-full">
      <div class="flex flex-col bg-slate-200  w-full rounded-lg p-4 shadow-md hover:cursor-pointer hover:bg-slate-100 hover:shadow-lg">
        <div class="flex justify-center">
          <div class="text-xl font-medium">{title}</div>
        </div>

        <div class="text-center text-4xl font-bold pt-10">
          {count ? (
            <>{count}</>
          ) : count == 0 ? (
            <>0</>
          ) : (
            <>
              <i className="fas fa-circle-notch fa-spin py-1"></i>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatiticsCard;
