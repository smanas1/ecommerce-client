import axios from "axios";
import { useParams } from "react-router-dom";

export const Success = () => {
  axios
    .post("http://localhost:5000/api/shop/order/success", {
      orderId: useParams().orderId,
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  const { orderId } = useParams();
  return <div>Success: {orderId}</div>;
};
