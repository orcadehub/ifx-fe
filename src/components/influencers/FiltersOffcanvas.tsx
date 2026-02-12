import React from "react";
import { Offcanvas } from "react-bootstrap";
import { Button, Drawer } from 'antd';

const FiltersOffcanvas = ({
  showFilters,
  setShowFilters,
  resetFilters,
  handleUpdate,
  countryCode,
  setCountryCode,
  stateCode,
  setStateCode,
  selectedCity,
  setSelectedCity,
  countries,
  states,
  cities,
  niche,
  setNiche,
  contentType,
  setContentType,
  engagementRate,
  setEngagementRate,
  followers,
  setFollowers,
  platform,
  setPlatform,
  priceRange,
  setPriceRange,
  hashtags,
  setHashtags,
  age,
  setAge,
  gender,
  setGender,
  audienceCountry,
  setAudienceCountry,
  selectedLang,
  setSelectedLang,
  languages,
  formatFollowers,
}) => {
  return (

    <Drawer
      title={<div>
        <div className="flex items-center justify-between gap-1">
        <span className='text-[16px] font-bold'>
          Filters</span>
        <button
          className="btn !border-[var(--border)] !text-[var(--text)] btn-sm "
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      
      </div></div>}
      closable={{ 'aria-label': 'Close Button' }}
      onClose={() => setShowFilters(false)}
      open={showFilters}
      zIndex={1300}
      className='!bg-[var(--bgPage2)] border !border-[var(--border)] text-[var(--text)]'
      footer={<div className="d-flex justify-content-between position-sticky bottom-0 !bg-[var(--bgPage2)] text-[var(--text)] p-2">
        <button
          className=" px-3 !py-1 border !border-[var(--border)] !rounded-xl"
          onClick={() => setShowFilters(false)}
        >
          Cancel
        </button>
        <button
          className="px-3 !py-1 border !border-[var(--border)] !rounded-xl bg-[var(--primary)] text-white"
          onClick={handleUpdate}
        >
          Update
        </button>
      </div>}
    >
      <Offcanvas.Body className="px-1 pb-3 bg-[var(--bgPage2)] text-[var(--text)] locationInputs">
        {/* Custom Styles
        <style>
          {`
          .form-select {
            background-color: #e6f3ff !important;
            border-color: #b3d7ff !important;
            transition: all 0.2s ease-in-out;
          }
          .form-select:hover {
            background-color: #d1e7ff !important;
            border-color: #80bfff !important;
            box-shadow: 0 0 8px rgba(0, 123, 255, 0.3) !important;
          }
          .form-select:focus {
            background-color: #e6f3ff !important;
            border-color: #80bfff !important;
            box-shadow: 0 0 8px rgba(0, 123, 255, 0.3) !important;
          }
        `}
        </style> */}

        {/* Location Section */}
        <div className="mb-3 text-12">
          <label className="form-label font-medium text-14">Location</label>
          <div className="mb-2">
            <select
              className="form-select border-2 shadow-sm"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <select
              className="form-select border-2 shadow-sm"
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              disabled={!countryCode}
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="form-select border-2 shadow-sm"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!stateCode}
            >
              <option value="">Select City</option>
              {cities.map((ci) => (
                <option key={ci.name} value={ci.name}>
                  {ci.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Niche & Content Type */}
        <div className="d-flex gap-2 mb-3">
          <div className="w-50">
            <label className="form-label font-medium text-14">Niche</label>
            <select
              className="form-select border-2 shadow-sm"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
            >
              <option value="">Select Niche</option>
              <option>Education</option>
              <option>Fashion</option>
              <option>Food</option>
              <option>Gaming</option>
              <option>Business</option>
            </select>
          </div>
          <div className="w-50">
            <label className="form-label fw-semibold text-dark">
              Content Type
            </label>
            <select
              className="form-select border-2 shadow-sm"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option>Video</option>
              <option>Image</option>
              <option>Reel</option>
              <option>Short</option>
              <option>Story</option>
              <option>Live</option>
            </select>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="mb-3">
          <label className="form-label font-medium text-14">
            Engagement Rate:{" "}
            <span className="text-primary">{engagementRate}%</span>
          </label>
          <input
            type="range"
            className="form-range"
            min="0"
            max="100"
            step="1"
            value={engagementRate}
            onChange={(e) => setEngagementRate(e.target.value)}
            style={{ direction: "ltr", "--value": engagementRate }}
          />
          <div className="d-flex justify-content-between small">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Follower Count */}
        <div className="mb-3">
          <label className="form-label font-medium text-14">
            Follower Count:{" "}
            <span className="text-primary">{formatFollowers(followers)}</span>
          </label>
          <input
            type="range"
            className="form-range"
            min="0"
            max="10000000"
            step="10000"
            value={followers}
            onChange={(e) => setFollowers(parseInt(e.target.value))}
            style={{ "--value": (followers / 10000000) * 100 }}
          />
          <div className="d-flex justify-content-between small">
            <span>0</span>
            <span>10M</span>
          </div>
        </div>

        {/* Platform */}
        <div className="mb-3">
          <label className="form-label font-medium text-14">Platform</label>
          <select
            className="form-select border-2 shadow-sm"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="">Select Platform</option>
            <option>Instagram</option>
            <option>Facebook</option>
            <option>YouTube</option>
            <option>Twitter</option>
            <option>Threads</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="mb-3">
          <label className="form-label font-medium text-14">
            Price Range
          </label>
          <div className="d-flex gap-2">
            <input
              type="number"
              className="form-control h-7"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({
                  ...priceRange,
                  min: parseInt(e.target.value) || 0,
                })
              }
              placeholder="0"
            />
            <input
              type="number"
              className="form-control h-7"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({
                  ...priceRange,
                  max: parseInt(e.target.value) || 5000,
                })
              }
              placeholder="5000"
            />
          </div>
        </div>

        {/* Hashtags */}
        <div className="mb-3">
          <label className="form-label font-medium text-14">Hashtags</label>
          <input
            type="text"
            className="form-control h-7"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="Enter hashtags"
          />
          <div className="mt-2 d-flex flex-wrap gap-2">
            {["#travel", "#food"].map((tag, idx) => (
              <span
                key={idx}
                className="badge bg-secondary bg-opacity-10 !text-[var(--text)] border !border-[var(--border)] px-2 py-1"
                style={{ fontSize: "0.85rem", cursor: "pointer" }}
                onClick={() =>
                  setHashtags(hashtags ? `${hashtags}, ${tag}` : tag)
                }
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Age & Gender */}
        <div className="d-flex gap-2 mb-3">
          <div className="w-50">
            <label className="form-label font-medium text-14">Age</label>
            <select
              className="form-select border-2 shadow-sm"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            >
              <option value="">Select Age</option>
              <option value="13-17">13 - 17</option>
              <option value="18-24">18 - 24</option>
              <option value="25-34">25 - 34</option>
              <option value="35-44">35 - 44</option>
              <option value="45-54">45 - 54</option>
              <option value="55+">55+</option>
            </select>
          </div>
          <div className="w-50">
            <label className="form-label fw-semibold text-dark">Gender</label>
            <select
              className="form-select border-2 shadow-sm"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="any">Any</option>
            </select>
          </div>
        </div>

        {/* Top Audience Country */}
        <div className="mb-3">
          <label className="form-label font-medium text-14">
            Top Audience Countries
          </label>
          <select
            className="form-select border-2 shadow-sm"
            value={audienceCountry}
            onChange={(e) => setAudienceCountry(e.target.value)}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* Top Audience Language */}
        <div className="mb-3">
          <label className="form-label font-medium text-14">
            Top Audience Languages
          </label>
          <select
            className="form-select border-2 shadow-sm"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
          >
            <option value="">Select Language</option>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </Offcanvas.Body>
    </Drawer>
    // <Offcanvas
    //   show={showFilters}
    //   onHide={() => setShowFilters(false)}
    //   placement="end"
    //   backdrop={true}
    //   style={{ zIndex: 1100 }}
    // >
     
    // </Offcanvas>
  );
};

export default FiltersOffcanvas;