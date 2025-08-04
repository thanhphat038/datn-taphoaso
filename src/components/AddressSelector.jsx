import { useState, useEffect } from "react";

export default function AddressSelector({ onChange }) {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Load tỉnh/thành khi mở trang
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=1")
      .then((res) => res.json())
      .then(setCities);
  }, []);

  // Load quận khi chọn tỉnh
  const handleCityChange = (e) => {
    const code = e.target.value;
    setSelectedCity(code);
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts([]);
    setWards([]);
    fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts));
    if (onChange) {
      onChange({ city: code, district: "", ward: "" });
    }
  };

  // Load phường khi chọn quận
  const handleDistrictChange = (e) => {
    const code = e.target.value;
    setSelectedDistrict(code);
    setSelectedWard("");
    setWards([]);
    fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards));
    if (onChange) {
      onChange({ city: selectedCity, district: code, ward: "" });
    }
  };

  const handleWardChange = (e) => {
    const code = e.target.value;
    setSelectedWard(code);
    if (onChange) {
      onChange({ city: selectedCity, district: selectedDistrict, ward: code });
    }
  };

  return (
    <div className="flex flex-row gap-4">
      <select value={selectedCity} onChange={handleCityChange} className="border rounded p-2 flex-1">
        <option value="">Chọn tỉnh/thành</option>
        {cities.map((c) => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>

      <select value={selectedDistrict} onChange={handleDistrictChange} disabled={!districts.length} className="border rounded p-2 flex-1">
        <option value="">Chọn quận/huyện</option>
        {districts.map((d) => (
          <option key={d.code} value={d.code}>{d.name}</option>
        ))}
      </select>

      <select value={selectedWard} onChange={handleWardChange} disabled={!wards.length} className="border rounded p-2 flex-1">
        <option value="">Chọn phường/xã</option>
        {wards.map((w) => (
          <option key={w.code} value={w.code}>{w.name}</option>
        ))}
      </select>
    </div>
  );
}
