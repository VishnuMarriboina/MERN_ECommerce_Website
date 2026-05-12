
import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";

const ShirtList = () => {
  const [shirts, setShirts] = useState([]);
  const [searchItem, setSearchItem] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [currentShirtId, setCurrentShirtId] = useState(null);
  const [formData, setFormData] = useState({
    size: "",
    color: "",
    type_of_material: "",
    cost: "",
    brand: "",
    collar_type: "",
    sleeve_type: "",
    fit: "",
    count: "",
    image_url: "",
  });

  useEffect(() => {
    fetchShirts();
  }, []);

  const fetchShirts = () => {
    axios
      .get("http://localhost:5500/api/clothes/getShirts")
      .then((response) => {
        setShirts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching shirts:", error);
      });
  };

  const findShirt = async (shirtId) => {
    try {
      const body = {
        brand: "Roadster",
      };
      const res = await axios.put(
        `http://localhost:5500/api/clothes/update-Shirt/${shirtId}`,
        body // Remove the nested body object
      );
      setSearchItem(res.data);
    } catch (error) {
      console.error("Error fetching shirts:", error);
    }
  };

  const loadShirtForUpdate = (shirtId) => {
    // Find the shirt from current shirts array since individual shirt endpoint doesn't exist
    const shirt = shirts.find((s) => s._id === shirtId);
    if (shirt) {
      setFormData({
        size: shirt.size || "",
        color: shirt.color || "",
        type_of_material: shirt.type_of_material || "",
        cost: shirt.cost || "",
        brand: shirt.brand || "",
        collar_type: shirt.collar_type || "",
        sleeve_type: shirt.sleeve_type || "",
        fit: shirt.fit || "",
        count: shirt.count || "",
        image_url: shirt.image_url || "",
      });
      setCurrentShirtId(shirtId);
      setIsVisible(true);
    } else {
      alert("Shirt not found!");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5500/api/clothes/addNewShirts", formData)
      .then(() => {
        alert("Shirt added successfully!");
        fetchShirts(); // Refresh list
        setFormData({
          size: "",
          color: "",
          type_of_material: "",
          cost: "",
          brand: "",
          collar_type: "",
          sleeve_type: "",
          fit: "",
          count: "",
          image_url: "",
        });
      })
      .catch((error) => {
        console.error("Error adding shirts:", error.response?.data || error);
        alert(error.response?.data?.message || "Add failed.");
      });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!currentShirtId) return;

    axios
      .put(
        `http://localhost:5500/api/clothes/update-Shirt/${currentShirtId}`,
        formData
      )
      .then(() => {
        alert("Shirt updated successfully!");
        fetchShirts(); // Refresh list
        setIsVisible(false);
        setCurrentShirtId(null);
        setFormData({
          size: "",
          color: "",
          type_of_material: "",
          cost: "",
          brand: "",
          collar_type: "",
          sleeve_type: "",
          fit: "",
          count: "",
          image_url: "",
        });
      })
      .catch((error) => {
        console.error("Error updating shirt:", error.response?.data || error);
        alert(error.response?.data?.message || "Update failed.");
      });
  };

  const buyShirt = (shirtId, quantity) => {
    // console.log(shirtId);
    axios
      .put(`http://localhost:5500/api/clothes/update-Shirt/${shirtId}`, {
        count: quantity,
      })
      .then(() => {
        alert("Shirt bought successfully!");
        fetchShirts(); // Refresh list
      })
      .catch((error) => {
        console.error("Error buying shirt:", error.response?.data || error);
        alert(error.response?.data?.message || "Buy failed.");
      });
  };

  const handleQuantityChange = (id, change, maxStock) => {
    setQuantities((prev) => {
      const newQty = Math.max(1, Math.min((prev[id] || 1) + change, maxStock));
      return { ...prev, [id]: newQty };
    });
  };

  const closeModal = () => {
    setIsVisible(false);
    setCurrentShirtId(null);
    setFormData({
      size: "",
      color: "",
      type_of_material: "",
      cost: "",
      brand: "",
      collar_type: "",
      sleeve_type: "",
      fit: "",
      count: "",
      image_url: "",
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Shirts List</h2>

        <ol style={{ listStyleType: "none", paddingLeft: 0 }}>
          {shirts.map((shirt, index) => (
            <li
              key={shirt._id}
              style={{
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <span>
                <strong>{index + 1}.</strong> {shirt.brand} - {shirt.size} - ₹
                {shirt.cost} - <strong>Count:</strong> {shirt.count}
              </span>

              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  onClick={() =>
                    handleQuantityChange(shirt._id, -1, shirt.count)
                  }
                  disabled={(quantities[shirt._id] || 1) <= 1}
                >
                  –
                </button>
                <span style={{ margin: "0 8px" }}>
                  {quantities[shirt._id] || 1}
                </span>
                <button
                  onClick={() =>
                    handleQuantityChange(shirt._id, 1, shirt.count)
                  }
                  disabled={(quantities[shirt._id] || 1) >= shirt.count}
                >
                  +
                </button>

                <button
                  style={{
                    marginLeft: "10px",
                    padding: "5px 10px",
                    backgroundColor: shirt.count > 0 ? "#3498db" : "#ccc",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: shirt.count > 0 ? "pointer" : "not-allowed",
                  }}
                  disabled={shirt.count <= 0}
                  onClick={() =>
                    buyShirt(shirt._id, quantities[shirt._id] || 1)
                  }
                >
                  Buy
                </button>

                <button
                  style={{
                    marginLeft: "10px",
                    padding: "5px 10px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => loadShirtForUpdate(shirt._id)}
                >
                  Update
                </button>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Add Shirt</h2>
        <form onSubmit={handleSubmit}>
          {[
            "size",
            "color",
            "type_of_material",
            "cost",
            "brand",
            "collar_type",
            "sleeve_type",
            "fit",
            "count",
            "image_url",
          ].map((field) => (
            <div key={field} style={{ marginBottom: "10px" }}>
              <label style={{ textTransform: "capitalize" }}>{field}: </label>
              <input
                type={field === "cost" || field === "count" ? "number" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required={field !== "image_url"} // image_url is optional
                style={{
                  width: "100%",
                  padding: "6px",
                  marginTop: "4px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          ))}
          <button type="submit" style={styles.butn}>
            Add Shirt
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Find Shirts-List</h2>
        <button onClick={() => findShirt()} style={styles.butn}>
          click to Find Shirts
        </button>
        <ol style={{ listStyleType: "none", paddingLeft: 0 }}>
          {searchItem.map((shirt, index) => (
            <li
              key={shirt._id}
              style={{
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <span>
                <strong>{index + 1}.</strong> {shirt.brand} - {shirt.size} - ₹
                {shirt.cost} - <strong>Count:</strong> {shirt.count}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {isVisible && (
        <Modal
          isOpen={isVisible}
          onRequestClose={closeModal}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
            },
          }}
        >
          <div style={styles.card}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={styles.cardTitle}>Update Shirt Details</h2>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#999",
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit}>
              {[
                "size",
                "color",
                "type_of_material",
                "cost",
                "brand",
                "collar_type",
                "sleeve_type",
                "fit",
                "count",
                "image_url",
              ].map((field) => (
                <div key={field} style={{ marginBottom: "10px" }}>
                  <label style={{ textTransform: "capitalize" }}>
                    {field}:{" "}
                  </label>
                  <input
                    type={
                      field === "cost" || field === "count" ? "number" : "text"
                    }
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required={field !== "image_url"} // image_url is optional
                    style={{
                      width: "100%",
                      padding: "6px",
                      marginTop: "4px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    ...styles.butn,
                    backgroundColor: "#6c757d",
                  }}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.butn}>
                  Update Shirt
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    width: "45%",
    minWidth: "400px",
    maxWidth: "600px",
  },
  cardTitle: {
    marginBottom: "15px",
    color: "#333",
  },
  butn: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default ShirtList;
