import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keyword }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="Keywords" content={keyword} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome To Proshop",
  description: "We sell the best products for cheap",
  keyword: "electronics, buy electronics, cheap electronics",
};
export default Meta;
