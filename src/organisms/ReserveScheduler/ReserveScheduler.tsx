import Button from "@/atoms/Button";
import { useRouter } from "next/router";
import SelectBox from "../SelectBox";

function ReserveScheduler(): JSX.Element {
  const router = useRouter();
  return (
    <div className="border border-gray rounded-lg shadow-md p-6">
      <div className="space-y-4">
        <div>Choose your days of stay</div>
        <div className="border rounded-lg">
          <div className="flex justify-between">
            <div className="w-full border-r p-4 space-y-2">
              <div className="text-gold">Check In</div>
              <div>5/4/2025</div>
            </div>
            <div className="w-full border-l p-4 space-y-2">
              <div className="text-gold">Check Out</div>
              <div>5/4/2025</div>
            </div>
          </div>
        </div>
        <div className="border rounded-lg p-1">
          <SelectBox
            selectOptions={["1", "2", "3", "4"]}
            getInputedValue={() => {}}
          />
        </div>
        <div className="w-full">
          <Button variant="primary" width="full">
            <span className="w-full text-center">MAKE RESERVATIONS</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReserveScheduler;
