import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/atoms/Button";
import Heading from "@/atoms/Heading";

interface AddOnCardProps {
  id: number;
  title:string;
  src: string;
  des: string;
  btnText: string;
}

function AddOnCard(props: AddOnCardProps): JSX.Element {
  const navigate = useNavigate();
  const { src, des, btnText, id, title } = props;

  return (
    <div className="grid gap-5 tablet:gap-20 justify-center items-center tablet:grid-cols-2">
      <img
        src={src}
        alt="Add-on Service"
        width={400}
        height={300}
        className="w-full h-auto object-cover rounded-2xl shadow-md hover:rounded-2xl transition-transform duration-500"
      />

      <div className="space-y-6 text-center">
        <Heading Tag="h2" variant="xl" mode="light">
          {title}
        </Heading>
        <Heading Tag="h2" variant="md" mode="light">
          {des}
        </Heading>

        <Button
          variant="secondary"
          width="full"
          onClick={() => navigate(`/addOn/${id}`)}
        >
          <span className="w-full text-center" tabIndex={0} role="button">
            {btnText}
          </span>
        </Button>
      </div>
    </div>
  );
}

export default AddOnCard;
