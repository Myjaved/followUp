'use client'
import React, { useEffect, useState } from "react";
import { Chart } from "chart.js";
import axios from "axios";
import NavSide from "../components/NavSide";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faSquareCheck, faHourglassHalf, faExclamationCircle, faCalendarPlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import NavSideSuper from "../components/NavSideSuper";

const labelStyles = [
  {

    label: "Total Companies",
    icon: faTasks,
    iconColor: "purple",
    iconSize: "l",
  },
  {

    label: "Total Users",
    icon: faSquareCheck,
    iconColor: "green",
    iconSize: "l",
  },
  {
    label: "Active Users",
    icon: faHourglassHalf,
    iconColor: "blue",
    iconSize: "l",
  },
  {
    label: "InActive Users",
    icon: faExclamationCircle,
    iconColor: "red",
    iconSize: "l",
  },
//   {
//     label: "Today Added Tasks",
//     icon: faCalendarPlus,
//     iconColor: "orange",
//     iconSize: "l",
//   },
//   {

//     label: "Send Tasks",
//     icon: faUpload,
//     iconColor: "yellow",
//     iconSize: "l",
//   },
];

const VectorSuper = () => {
  const [chartData, setChartData] = useState([]);
  const [hasData, setHasData] = useState(false); // Track if data exists


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:5000/api/company/companyCounts", {
          headers: {
            Authorization: token,
          },
        });

        console.log(response.data)
        if (response.data) {
          const taskCounts = response.data;
          const chartData = [
            taskCounts.totalCompanies,
            taskCounts.totalEmployees,
            taskCounts.uniqueActiveEmployeesCount
            
          ];

          setChartData(chartData);
          setHasData(chartData.some(data => data > 0)); // Check if any data exists
        } else {
          setHasData(false); // No data available
        }
         
      } catch (error) {
        console.error("Error fetching data:", error);
        setHasData(false); // Set hasData to false if an error occurs

      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (hasData) {
      let ctx = document.getElementById("myChart").getContext("2d");
      let myChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: chartData,
              borderColor: ["rgb(128, 0, 128)", "rgb(34, 139, 34)", "rgb(0, 71, 171)", "rgb(210, 4, 45)", "rgb(205, 127, 50)", "rgb(255, 215, 0)"],
              backgroundColor: ["rgb(128, 0, 128)", "rgb(34, 139, 34)", "rgb(0, 71, 171)", "rgb(210, 4, 45)", "rgb(205, 127, 50)", "rgb(255, 215, 0)"],
              borderWidth: 2,
            },
          ],
        },
        options: {
          cutoutPercentage: 50,
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                const labelIndex = tooltipItem.index;
                const label = labelStyles[labelIndex].label;
                const value = data.datasets[0].data[labelIndex];
                return `${label}: ${value}`;
              },
            },
          },
        },
      });
    }
  }, [chartData, hasData]);


  return (
    <>
      <NavSideSuper />
      <div className="mt-20"></div>
      <div className="w-full h-screen flex flex-col items-center">
        <div className="desktop-box p-4 m-4 bg-white rounded-lg text-center text-2xl font-bold text-red-800">
          <h1>Dashboard</h1>
          <div className="w-full flex justify-center items-center mt-5">
            {hasData ? (
              <canvas id="myChart" className="cursor-pointer desktop-graph"></canvas>
            ) : (
              <div className="static-circle mr-40" style={{ width: '430px', height: '430px', borderRadius: '50%', backgroundColor: 'gray', position: 'relative' }}>
                <div className="donut-chart" style={{ position: 'absolute', width: '50%', height: '50%', borderRadius: '50%', background: 'radial-gradient(circle at center, lightgray 0%, white 0%)', top: '25%', left: '25%' }}></div>
              </div>
            )}
          </div>


          <div className="text-center text-sm desktop-labels pt-20 pl-3 text-md md:text-base">
            {labelStyles.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-start mb-2 ${isMobileView() ? "mobile-label-box" : "desktop-label-box"
                  }`}
              >
                {isMobileView() && (
                  <div
                    className="label-box-mobile"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px",
                      borderRadius: "4px",
                      boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                      width: "100%",
                    }}
                  >
                    <div style={{ color: item.iconColor }}>
                      <FontAwesomeIcon icon={item.icon} size={item.iconSize} style={{ marginRight: "10px" }} />
                    </div>
                    <p style={{ color: item.color }}>{item.label}</p>
                  </div>
                )}
                {!isMobileView() && (
                  <div style={{ backgroundColor: item.color, width: "30px", height: "15px", marginRight: "20px" }}></div>
                )}
                {!isMobileView() && (
                  <div style={{ color: item.iconColor }}>
                    <FontAwesomeIcon icon={item.icon} size={item.iconSize} style={{ marginRight: "10px" }} />
                  </div>
                )}
                {!isMobileView() && <p style={{ color: item.color }}>{item.label}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .desktop-graph {
            width: 100%;
            margin-right: 250px;
          }
          .desktop-box {
            width: 65%;
            position: absolute;
            box-shadow: 0 3px 3px -3px gray, 0 -3px 3px -3px gray, -3px 0 3px -3px gray, 3px 0 3px -3px gray;
            right: 6%;
          }
          .desktop-labels {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 70px;
          }
          .desktop-label-box {
            display: flex;
            align-items: center;
          }
        }

        @media (max-width: 767px) {
          .mobile-graph {
            width: 90%;
          }
          .mobile-box {
            width: 100%;
            right: auto;
          }
          .mobile-labels {
            text-align: center;
          }
          .mobile-label-box {
            display: flex;
            align-items: center;
          }
          .label-box-mobile {
            margin-right: 10px;
          }
        }
      `}</style>
    </>
  );
};

const isMobileView = () => {
  return window.innerWidth <= 767;
};

export default VectorSuper;
