import React, { createContext, useContext, useState, useEffect } from "react";

const ProductCountContext = createContext();

const ProductCountProvider = ({ children }) => {
  const [productCounts, setProductCounts] = useState({});

  useEffect(() => {
    const savedProductCounts = JSON.parse(localStorage.getItem("productCounts"));
    if (savedProductCounts) {
      setProductCounts(savedProductCounts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("productCounts", JSON.stringify(productCounts));
  }, [productCounts]);

  return (
    <ProductCountContext.Provider value={{ productCounts, setProductCounts }}>
      {children}
    </ProductCountContext.Provider>
  );
};

const useProductCount = () => {
  return useContext(ProductCountContext);
};

export { ProductCountProvider, useProductCount };
