import "./featuredInfo.scss";

const FeaturedInfo = () => {
  return (
    <div className="featuredInfoComponent">
      <div className="item">
        <span className="title">Total productos</span>
        <div>
          <span className="money">0</span>
        </div>
      </div>

      <div className="item">
        <span className="title">Total ventas</span>
        <div>
          <span className="money">0</span>
        </div>
      </div>

      <div className="item">
        <span className="title">Total ganancias por ventas</span>
        <div>
          <span className="money">$0</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedInfo;
