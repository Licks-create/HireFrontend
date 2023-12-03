/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

import "../styles/Users.css";
import toast from "react-hot-toast";

const Users = () => {
  const [editShow, setEditShow] = useState(false);
  const [localData, setLocalData] = useState([]);
  const [selectall, setSelectAll] = useState(false);

  const [loader, setLoader] = useState(true);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [formData, setFormDate] = useState({});
  const [name, setName] = useState("");
  const [deleteShow, setDeleteShow] = useState({});

  //   paginations
  const [totalPage, settotalPage] = useState([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [dataTillNow, setDataTillNow] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [multiSelect, setMultiSelect] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      try {
        
      const res = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const data = await res.json();

      setLoader(false);
      if (data) {
        setLocalData(
          data.map((ele, i) => ({
            ...ele,
            select: false,
          }))
        );
        // setting total page based on data length
        settotalPage((pre) => {
          pre.length = Math.ceil(data.length / 10);
          return [...pre];
        });

        setCurrentPageData(
          data.slice(0, 10).map((ele, i) => ({
            ...ele,
            select: false,
          }))
        );
      }
      toast.success("data fetched")
      } catch (error) {
        toast.error("could not fetch")
      }
    };
    fetchData();
  }, []);

  const selectAll = (ele) => {
    if (ele.target.checked) {
      setCurrentPageData(
        currentPageData.map((ele, i) => ({
          ...ele,
          select: true,
        }))
      );
      setLocalData(
        localData.map((ele, i) => {
          if (i >= (currentPage - 1) * 10 && i < (currentPage - 1) * 10 + 10)
            return {
              ...ele,
              select: true,
            };
          else return { ...ele };
        })
      );
      setSelectAll(true);
    } else {
      setCurrentPageData(
        currentPageData.map((ele, i) => ({
          ...ele,
          select: false,
        }))
      );
      setLocalData(
        localData.map((ele, i) => {
          if (i >= (currentPage - 1) * 10 && i <= (currentPage - 1) * 10 + 10)
            return {
              ...ele,
              select: false,
            };
          else return { ...ele };
        })
      );
      setSelectAll(false);
    }
  };

  const selectOne = (id) => {
    setCurrentPageData(
      currentPageData.map((ele, i) => {
        if (ele.id === id) {
          let select = !ele.select;
          return { ...ele, select };
        } else
          return {
            ...ele,
          };
      })
    );
    setLocalData(
      localData.map((ele, i) => {
        if (ele.id === id) {
          let select = !ele.select;
          return { ...ele, select };
        } else
          return {
            ...ele,
          };
      })
    );
  };

  const editOne = (id) => {
    setEditShow(true);
    let filterData = currentPageData.filter((ele, i) => ele.id === id);
    let formData = filterData[0];
    setName(formData.name);
    setEmail(formData.email);
    setRole(formData.role);
    setFormDate(formData);
  };

  const deleteOne = (id) => {
    setDeleteShow(true);
    let dataAfterDeletion = currentPageData.filter((ele, i) => {
      if (ele.id !== id) {
        return true;
      } else return false;
    });
    setCurrentPageData(dataAfterDeletion);

    let localDataAfterDeletion = localData.filter((ele, i) => {
      if (ele.id !== id) {
        return true;
      } else return false;
    });
    let deleteInSeach = searchedData.filter((ele, i) => {
      if (ele.id !== id) {
        return true;
      } else return false;
    });
    setLocalData(localDataAfterDeletion);
    setSearchedData(deleteInSeach);
  };
  const removeButtonStyling = () => {
    document.querySelectorAll(".below .pages button").forEach((e) => {
      e.classList.remove("selected");
    });
  };
  const pageChange = (ele) => {
    let pageNo = ele.target.id.split("-")[1];
    setcurrentPage(Number(pageNo) + 1);
    setCurrentPageData(localData.slice(pageNo * 10, pageNo * 10 + 10));
    setDataTillNow((Number(pageNo) + 1) * 10);
    removeButtonStyling();
    document.getElementById(ele.target.id).classList.add("selected");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let id = formData.id;
    setCurrentPageData(
      currentPageData.map((ele, i) => {
        if (ele.id === id)
          return {
            ...ele,
            name,
            role,
            email,
          };
        else
          return {
            ...ele,
          };
      })
    );
    setLocalData(
      localData.map((ele, i) => {
        if (ele.id === id)
          return {
            ...ele,
            name,
            role,
            email,
          };
        else
          return {
            ...ele,
          };
      })
    );
    setSearchedData(
      searchedData.map((ele, i) => {
        if (ele.id === id)
          return {
            ...ele,
            name,
            role,
            email,
          };
        else
          return {
            ...ele,
          };
      })
    );
    toast.success(`Submission Succesfull`)
    setEditShow(false);
  };

  useEffect(() => {
    let isSelectAll = currentPageData.every((e) => {
      return e.select === true;
    });
    if (isSelectAll) setSelectAll(true);
    else setSelectAll(false);

    let multiSel = currentPageData.filter((ele) => {
      return ele.select;
    });
    setMultiSelect(multiSel.length > 1 ? true : false);
    multiSel.length>0 && toast.success(`${multiSel.length} rows selected`)
  }, [currentPageData]);


  const handleClose = () => {
    setEditShow(false);
  };

  const searchRelated = (e) => {
    setSearchValue(e.target.value);
    let value = e.target.value;
    let searchedData = localData.filter((ele) => {
      return (
        ele.name.includes(value) ||
        ele.email.includes(value) ||
        ele.role.includes(value)
      );
    });
    setSearchedData(searchedData);
  };

  const delMultiple = () => {
    setDeleteShow(true);
    let dataAfterDeletion = currentPageData.filter((ele, i) => {
      return !ele.select;
    });
    setCurrentPageData(dataAfterDeletion);

    let localDataAfterDeletion = localData.filter((ele, i) => {
      if (i >= (currentPage - 1) * 10 && i < (currentPage - 1) * 10 + 10)
        return !ele.select;
      return true;
    });
    setLocalData(localDataAfterDeletion);
    toast.success(`${10-dataAfterDeletion.length} rows deleted`)
  };
  return (
    <main className="userDetail">
      <div className="above"></div>


      <div
        className="editBar"
        style={{
          display: editShow ? "block" : "none",
          opacity: editShow ? "1" : "0",
        }}
      >
        <div id="dialogBoxEdit">
          <CloseIcon className="closeEdit" onClick={handleClose} />
          <h2>User Information</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Role
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      <div
        style={{ display: deleteShow.toDelete ? "block" : "none" }}
        className="deleteBox"
      >
        {deleteShow?.toDelete && (
          <div id="dialogBoxDelete">
            <h1>Delete Alert</h1>
            <h4>Are you sure oyu want to delete?</h4>
            {!multiSelect && (
              <button onClick={() => deleteOne(deleteShow?.id)}>Yes</button>
            )}
            {multiSelect && (
              <button onClick={() => delMultiple(deleteShow?.id)}>
                Delete All
              </button>
            )}
            <button onClick={() => setDeleteShow(false)}>No</button>
          </div>
        )}
      </div>

   

      {loader ? (
        <h3>Please wait ...</h3>
      ) : (
        <div className="below">
          <section className="searchFilter">
            <div>
              <div>
                <SearchIcon className="search" />
                <input
                  type="text"
                  style={{ width: "100%" }}
                  placeholder="Search"
                  value={searchValue}
                  onChange={searchRelated}
                />
              </div>
              <div
                className="delMultiple"
                style={{
                  cursor: multiSelect ? "pointer" : "not-allowed",
                  opacity: multiSelect ? 1 : ".3",
                }}
                onClick={() => multiSelect && setDeleteShow({ toDelete: true })}
                title="select multiple rows"
              >
                <DeleteIcon />
              </div>
            </div>
          </section>
          <div className="pages">
            {totalPage?.map((ele, i) => {
              return (
                <button
                  type="button"
                  onClick={pageChange}
                  key={i}
                  id={`pageno-${i}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <section className="table">
            <table>
              <thead>
                <tr className="selectALL">
                  {!searchValue.length && (
                    <th>
                      <label>
                        Select all
                        <span>
                          <input
                            type="checkbox"
                            name="selectAll"
                            id="selectAll"
                            checked={selectall}
                            onChange={selectAll}
                          />
                        </span>
                      </label>
                    </th>
                  )}
                  <th>Name</th>

                  <th>Email</th>
                  <th>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <span>Role</span>
                    </div>
                  </th>

                  <th>
                    <div>
                      <span>Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {searchValue === ""
                  ? currentPageData.map((data, i) => {
                      return (
                        <tr
                          id={data.id}
                          className={data.select ? "selected" : "not-selected"}
                          key={i}
                        >
                          <td>
                            <input
                              type="checkbox"
                              checked={data.select}
                              onChange={() => selectOne(data.id)}
                            />
                          </td>
                          <td>
                            <span
                              style={{
                                fontWeight: "500",
                                color: "rgb(0,0,0,.7)",
                              }}
                            >
                              {data.name}
                            </span>
                          </td>

                          <td
                            style={{
                              fontWeight: "500",
                              color: "rgb(0,0,0,.7)",
                            }}
                          >
                            {data.email}
                          </td>

                          <td
                            style={{
                              fontSize: "14px",
                              color: "#100e0e9c",
                              fontWeight: "700",
                            }}
                          >
                            {data.role}
                          </td>
                          <td>
                            <div className="actions">
                              <div title="edit">
                                <DriveFileRenameOutlineIcon
                                  onClick={() => editOne(data.id)}
                                  className="hoverAction edit"
                                />
                              </div>

                              <div title="Delete">
                                <DeleteOutlineIcon
                                  onClick={() =>
                                    setDeleteShow({
                                      toDelete: true,
                                      id: data.id,
                                    })
                                  }
                                  className="hoverAction delete"
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : searchedData.map((data, i) => {
                      return (
                        <tr
                          id={data.id}
                          className={data.select ? "selected" : "not-selected"}
                          key={i}
                        >
                          <td>
                            <span
                              style={{
                                fontWeight: "500",
                                color: "rgb(0,0,0,.7)",
                              }}
                            >
                              {data.name}
                            </span>
                          </td>

                          <td
                            style={{
                              fontWeight: "500",
                              color: "rgb(0,0,0,.7)",
                            }}
                          >
                            {data.email}
                          </td>

                          <td
                            style={{
                              fontSize: "14px",
                              color: "#100e0e9c",
                              fontWeight: "700",
                            }}
                          >
                            {data.role}
                          </td>
                          <td>
                            <div className="actions">
                              <div title="edit">
                                <DriveFileRenameOutlineIcon
                                  onClick={() => editOne(data.id)}
                                  className="hoverAction edit"
                                />
                              </div>

                              <div title="Delete">
                                <DeleteOutlineIcon
                                  onClick={() =>
                                    setDeleteShow({
                                      toDelete: true,
                                      id: data.id,
                                    })
                                  }
                                  className="hoverAction delete"
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </section>
          <section className="pageNo"></section>
        </div>
      )}
    </main>
  );
};

export default Users;
