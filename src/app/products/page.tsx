"use client";

import React, { useEffect, useState } from "react";
import { LuSlidersHorizontal, LuDroplet, LuGrid3X3 } from "react-icons/lu";
import { TbListDetails } from "react-icons/tb";
import { FiBox } from "react-icons/fi";
import { RiFireLine } from "react-icons/ri";
import { BsStarFill, BsStar } from "react-icons/bs";
import styles from "./styles/page.module.css";

import Solution from "../shared/solution";
import Counts from "../shared/counts";
import Test from "../shared/test";
import Subscribe from "../shared/subscribe";
import Sorted from "./sorted";
import Payment from "../payment/payment";
import ProductsService from "../services/productService";
import { Product } from "../types/types";

export default function Allproducts() {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [active, setActive] = useState("grid");

  // ✅ API States
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Mobile Filter Drawer State
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ✅ Category filter state (multi-select)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // ✅ Disable scrolling when filter is open (mobile only)
  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "auto";
  }, [isFilterOpen]);

  // ✅ Fetch Products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params: any = {
          page: 1,
          limit: 12,
        };

        // send price range (maxPrice ready for future backend support)
        if (minPrice > 0) params.minPrice = minPrice;
        if (maxPrice < 1000) params.maxPrice = maxPrice;

        // multi-category filter
        if (selectedCategories.length > 0) {
          params.category = selectedCategories.join(",");
        }

        const res = await ProductsService.getProducts(params);
        setProducts(res.data.data.data);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [minPrice, maxPrice, selectedCategories]);

  const ratingStars = [
    [5, 0],
    [4, 1],
    [3, 2],
  ];

  return (
    <>
      <div className={styles.container}>
        <div className={styles.head}>
          <h3>All Products</h3>
          <p>Discover our complete range of period care essentials</p>
        </div>

        <div className={styles.mobileTopBar}>
          <button
            className={styles.mobileFilterBtn}
            onClick={() => setIsFilterOpen(true)}
          >
            <LuSlidersHorizontal color="#A31157" size={18} /> Filters
          </button>
        </div>

        <div className={styles.content}>
          <div
            className={`${styles.left} ${
              isFilterOpen ? styles.filterOpen : ""
            }`}
          >
            <button
              className={styles.closeFilterBtn}
              onClick={() => setIsFilterOpen(false)}
            >
              ✕
            </button>

            <p className={styles.filterhead}>
              <LuSlidersHorizontal color="#A31157" size={18} /> Filters
            </p>

            <div className={styles.categories}>
              <p className={styles.filtertype}>Categories</p>

              <div className={styles.categoryrow}>
                <span className={styles.categoryname}>
                  <input
                    type="checkbox"
                    className={styles.checkBox}
                    checked={selectedCategories.includes("Sanitary Pads")}
                    onChange={() => toggleCategory("Sanitary Pads")}
                  />
                  <p>
                    <LuDroplet color="#C61469" size={16} />
                    Sanitary Pads
                  </p>
                </span>
                <span className={styles.categorynos}>(22)</span>
              </div>

              <div className={styles.categoryrow}>
                <span className={styles.categoryname}>
                  <input
                    type="checkbox"
                    className={styles.checkBox}
                    checked={selectedCategories.includes("Combo kits")}
                    onChange={() => toggleCategory("Combo kits")}
                  />
                  <p>
                    <FiBox color="#C61469" size={16} />
                    Combo kits
                  </p>
                </span>
                <span className={styles.categorynos}>(12)</span>
              </div>

              <div className={styles.categoryrow}>
                <span className={styles.categoryname}>
                  <input
                    type="checkbox"
                    className={styles.checkBox}
                    checked={selectedCategories.includes("Pain relief")}
                    onChange={() => toggleCategory("Pain relief")}
                  />
                  <p>
                    <RiFireLine color="#C61469" size={16} />
                    Pain relief
                  </p>
                </span>
                <span className={styles.categorynos}>(8)</span>
              </div>
            </div>

            <div className={styles.pricerange}>
              <p className={styles.filtertype}>Price Range</p>

              <div className={styles.sliderWrapper}>
                <div className={styles.track}></div>

                <div
                  className={styles.range}
                  style={{
                    left: `${(minPrice / 1000) * 100}%`,
                    width: `${((maxPrice - minPrice) / 1000) * 100}%`,
                  }}
                ></div>

                <input
                  className={`${styles.thumb}`}
                  type="range"
                  min="0"
                  max="1000"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(Math.min(Number(e.target.value), maxPrice - 50))
                  }
                />

                <input
                  className={`${styles.thumb}`}
                  type="range"
                  min="0"
                  max="1000"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(Math.max(Number(e.target.value), minPrice + 50))
                  }
                />
              </div>
              <div className={styles.ranges}>
                <span>₹{minPrice}</span> to <span>₹{maxPrice}</span>
              </div>
            </div>

            <div className={styles.rating}>
              <p className={styles.filtertype}>Rating</p>
              {ratingStars.map((line, index) => (
                <div key={index} className={styles.ratingrow}>
                  <input type="checkbox" className={styles.checkBox} />
                  <div className={styles.starsspace}>
                    {[...Array(line[0])].map((_, i) => (
                      <BsStarFill key={`filled-${i}`} color="#C61469" size={14} />
                    ))}
                    {[...Array(line[1])].map((_, i) => (
                      <BsStar key={`empty-${i}`} color="#E5E5E5" size={14} />
                    ))}
                  </div>
                  & up
                </div>
              ))}
            </div>
          </div>

          {isFilterOpen && (
            <div
              className={styles.overlay}
              onClick={() => setIsFilterOpen(false)}
            ></div>
          )}

          <div className={styles.right}>
            <div className={styles.righthead}>
              <p>Showing {products.length} products</p>
              <div className={styles.topright}>
                <div className={styles.layoutselector}>
                  <button
                    className={`${styles.layoutselect} ${
                      active === "grid" ? styles.active : ""
                    }`}
                    onClick={() => setActive("grid")}
                    aria-label="Grid view"
                  >
                    <LuGrid3X3 size={16} />
                  </button>
                  <button
                    className={`${styles.layoutselect} ${
                      active === "list" ? styles.active : ""
                    }`}
                    onClick={() => setActive("list")}
                    aria-label="List view"
                  >
                    <TbListDetails size={16} />
                  </button>
                </div>
                <select name="" id="" className={styles.sorting}>
                  <option value="">Most Popular</option>
                  <option value="">Most Relevant</option>
                  <option value="">Most Rating</option>
                </select>
              </div>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && <Sorted products={products} />}
          </div>
        </div>
      </div>

      <Payment />
      <Solution />
      <div className={styles.countsWrapper}>
        <Counts />
      </div>
      <Test />
      <Subscribe />
    </>
  );
}
