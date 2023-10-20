import { useEffect, useState } from "react";
import "./featuredInfo.scss";
import api from "../../api";

const FeaturedInfo = () => {
  type DashboardSummary = {
    totalProducts: number;
    totalSales: number;
    totalEarnings: number;
  };
  const [data, setData] = useState<DashboardSummary | null>(null);

  const getResume = async () => {
    await api
      .get("/dashboard/summary")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getResume();
  }, []);

  return (
    <div className="featuredInfoComponent">
      <div className="item">
        <span className="title">Total productos</span>
        <div>
          <span className="money">{data?.totalProducts || 0}</span>
        </div>
      </div>

      <div className="item">
        <span className="title">Total ventas</span>
        <div>
          <span className="money">{data?.totalSales || 0}</span>
        </div>
      </div>

      <div className="item">
        <span className="title">Total ganancias por ventas</span>
        <div>
          <span className="money">${data?.totalEarnings || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedInfo;
