import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  changeActiveLink,
  changeSubMenu,
  toggleSideBar,
} from "../reducers/sideBarReducer";

const SideBar = () => {
  const activeLink = useSelector((state) => state?.sidebar?.activeLink);
  const subMenu = useSelector((state) => state?.sidebar?.subMenu);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="sidebar" data-background-color="dark">
      <div className="sidebar-logo">
        {/* Logo Header */}
        <div className="logo-header" data-background-color="dark">
         
          <div className="nav-toggle" onClick={() => dispatch(toggleSideBar())}>
            <button className="btn-toggle">
              <i className="gg-menu-right" />
            </button>
            <button className="btn btn-toggle sidenav-toggler">
              <i className="gg-menu-left" />
            </button>
          </div>
          <button className="topbar-toggler more">
            <i className="gg-more-vertical-alt" />
          </button>
        </div>
        {/* End Logo Header */}
      </div>
      <div className="sidebar-wrapper scrollbar scrollbar-inner">
        <div className="sidebar-content">
          <ul className="nav nav-secondary">
            <li
              className={`nav-item ${
                activeLink === "dashboard" ? "active" : ""
              }`}
              onClick={() => dispatch(changeActiveLink("dashboard"))}
            >
              <a
                data-bs-toggle="collapse"
                // href="#dashboard"
                className="collapsed"
                // aria-expanded="false"
              >
                <i className="fas fa-home" />
                <p onClick={() => navigate("/dashboard")}>Dashboard</p>
                {/* <span className="caret" />   */}
              </a>
             
            </li>
           
            
            <li
              className={`nav-item ${activeLink === "pd" ? "active" : ""}`}
              onClick={() => dispatch(changeActiveLink("pd"))}
            >
              <a data-bs-toggle="collapse" href="#forms">
                <i className="fas fa-pen-square" />
                <p>Task</p>
                <span className="caret" />
              </a>
              <div
                className={`collapse ${activeLink === "pd" ? "show" : ""}`}
                id="forms"
              >
                <ul className="nav nav-collapse">
                  <li
                    className={`${subMenu === "createPd" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/createtask");
                      dispatch(changeSubMenu("createPd"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Add Task</span>
                    </a>
                  </li>
                  <li
                    className={`${subMenu === "pdList" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/Lists");
                      dispatch(changeSubMenu("pdList"));
                    }}
                  >
                    <a>
                      <span className="sub-item">List</span>
                    </a>
                  </li>
                 
                </ul>
              </div>
            </li>
           
           

           

          

            

            <li
              className={`nav-item ${
                activeLink === "employees" ? "active" : ""
              }`}
              onClick={() => dispatch(changeActiveLink("employees"))}
            >
              
              <div
                className={`collapse ${
                  activeLink === "employees" ? "show" : ""
                }`}
                id="employees"
              >
                <ul className="nav nav-collapse">
                 
                </ul>
              </div>
            </li>
            
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
