import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";


const API = "http://localhost:3000/api/v1/table";

const TableData = () => {
  const { accessToken, role } = useContext(AuthContext);


  const [tables, setTables] = useState([]);
  const [editTable, setEditTable] = useState(null);
  const [tableData, setTableData] = useState({ tableNumber: "", capacity: "" });

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get(API, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setTables(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (accessToken) fetchTables();
  }, [accessToken]);

  // DELETE
  const deleteTable = async (id) => {
    if (!window.confirm("Are you sure to delete this table?")) return;
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setTables(tables.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {

      if (editTable) {
       const res = await axios.put(`${API}/${editTable._id}`, tableData, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setTables(tables.map((t) => (t._id === editTable._id ? res.data : t)));
        setEditTable(null);
        setTableData({ tableNumber: "", capacity: "" });
      }
      else {
       const res = await axios.post(API, tableData, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setTables([res.data.data, ...tables])

        setEditTable(null);
        setTableData({
          tableNumber: "",
          capacity: ""
        })
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="table-wrapper">
      <div className="table-container">
        <h2 className="table-title">🍽 Table Management Dashboard</h2>


          {role === "admin" && (
                    <>
                      <button
                        id="update-btn"
                        onClick={() => {
                          setEditTable(null);
                          setTableData({
                            tableNumber: "",
                            capacity: "",
                          });
                        }}
                      >
                        Add Table
                      </button> </> )}

        {(editTable!==null||role==="admin") && (
          <form onSubmit={handleUpdate} style={{color:"white"}}>
            <input
              type="text"
              placeholder="Table Number"
              value={tableData.tableNumber}
              onChange={(e) => setTableData({ ...tableData, tableNumber: e.target.value })}
            />
            <input
              type="text"
              placeholder="Capacity"
              value={tableData.capacity}
              onChange={(e) => setTableData({ ...tableData, capacity: e.target.value })}
            />
            <button>{editTable ? "Save" : "Add Table"}</button>
          </form>

        )}

        <div className="tables-grid">
          {tables.length > 0 ? (
            tables.map((table) => (
              <div className="table-card" key={table._id}>

                {/* HEADER */}
                <div className="table-card-header">
                  <h3>Table #{table.tableNumber}</h3>
                  <span className="status active">Active</span>
                </div>

                {/* QR */}
                <div className="qr-wrapper">
                  {table.qrImage ? (
                    <img
                      src={table.qrImage}
                      alt={`QR Table ${table.tableNumber}`}
                    />
                  ) : (
                    <span>No QR</span>
                  )}
                </div>

                {/* INFO */}
                <div className="table-info">
                  <p style={{color:"white"}}><strong>ID:</strong> {table.qrSlug}</p>
                  <p style={{color:"white"}}><strong>Capacity:</strong> {table.capacity}</p>

                  <a
                    href={table.qrCodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="qr-link"
                  >
                    QR URL
                  </a>
                </div>





                {/* ACTIONS */}
                <div className="table-actions">

                  {/* DOWNLOAD → ADMIN + USER */}
                  {table.qrImage && (
                    <button
                      id="download-btn"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = table.qrImage;
                        link.download = `table-${table.tableNumber}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Download QR
                    </button>
                  )}

                  {/* ADMIN ONLY ACTIONS */}
                  {role === "admin" && (
                    <>
                      <button
                        id="update-btn"
                        onClick={() => {
                          setEditTable(table);
                          setTableData({
                            tableNumber: table.tableNumber,
                            capacity: table.capacity,
                          });
                        }}
                      >
                        Update
                      </button>

                      <button
                        id="delete-btn"
                        onClick={() => deleteTable(table._id)}
                      >
                        Delete
                      </button>
                      


                    </>
                  )}

                </div>

              </div>
            ))
          ) : (
            <p>No tables found</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default TableData;
