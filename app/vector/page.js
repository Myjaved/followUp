'use client'

import React, { useEffect, useState } from "react";
import { Chart } from "chart.js";
import axios from "axios";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

const Vector = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:5000/api/task/adminTaskCounts", {
          headers: {
            Authorization: token,
          },
        });

        if (response.data) {
          const taskCounts = response.data;
          const chartData = [taskCounts.totalEmployeeTasks, taskCounts.completedTasks, taskCounts.pendingTasks, taskCounts.overdueTasks, taskCounts.todayAddedTasks];

          setChartData(chartData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let ctx = document.getElementById("myChart").getContext("2d");
    let myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: chartData,
            borderColor: ["rgb(75, 192, 192)", "rgb(98, 194, 58)", "blue", "red", "rgb(255, 159, 64)","transparent"], // Orange color for Pending Tasks
            backgroundColor: ["rgb(75, 192, 192)", "rgb(98, 194, 58)", "blue", "red", "rgb(255, 159, 64)","transparent"], // Orange color for Pending Tasks

            borderWidth: 2,
          },
        ],
        labels: ["Total Employee Tasks", "Completed Tasks", "Pending Tasks", "Overdue Tasks", "Today Added Tasks"],
      },
      options: {
        cutoutPercentage: 50, // Specify the percentage of the hole in the center of the doughnut chart

        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
        legend: {
          display: true,
          position: "right",
        },
        plugins: {
          labels: {
            render: "label",
            arc: true,
            position: "border",
            fontSize: 28,
            fontStyle: "bold",
            fontColor: "#000",
            fontFamily: "Arial",
          },
        },
      },
    });
  }, [chartData]);

  return (
    <>
      <Navbar />
      <AdminSidebar />
      <div className="text-right pl-32 -mt-5">
        <h1 className="w-[200px] mx-96 text-2xl font-bold capitalize mt-28 text-right text-orange-700"> Dashboard</h1>
      </div>
      <div className="w-[1100px] h-screen flex mx-auto my-auto pl-36 mt-5">
        <div className="pt-0 rounded-xl w-full h-fit my-auto pb-2">
          <canvas id="myChart" className=" cursor-pointer -mt-32"></canvas>
        </div>
      </div>
    </>
  );
};

export default Vector;


// import React, { useEffect, useState } from "react";
// import { Chart } from "chart.js";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import AdminSidebar from "../components/AdminSidebar";

// const Vector = () => {
//   const [chartData, setChartData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const response = await axios.get("http://localhost:5000/api/task/adminTaskCounts", {
//           headers: {
//             Authorization: token,
//           },
//         });

//         if (response.data) {
//           // Extract the data you want to display in the chart
//           console.log(response.data)
//           const taskCounts = response.data;
//           const chartData = [taskCounts.totalEmployeeTasks, taskCounts.completedTasks, taskCounts.pendingTasks,taskCounts.overdueTasks,taskCounts.todayAddedTasks];

//           setChartData(chartData);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     let ctx = document.getElementById("myChart").getContext("2d");
//     let myChart = new Chart(ctx, {
//       type: "doughnut",
//       data: {
//         datasets: [
//           {
//             data: chartData,
//             borderColor: ["rgb(75, 192, 192)", "rgb(255, 205, 86)", "rgb(255, 99, 132)","rgb(200, 90, 140)"],
//             backgroundColor: ["rgb(75, 192, 192)", "rgb(255, 205, 86)", "rgb(255, 99, 132)","rgb(200, 90, 140)"],
//             borderWidth: 2,
//           },
//         ],
//         labels: ["Total Employee Tasks", "Completed Tasks", "Pending Tasks","Overdue Tasks","Today Added Tasks"],
//       },
//       options: {
//         scales: {
//           xAxes: [
//             {
//               display: false,
//             },
//           ],
//           yAxes: [
//             {
//               display: false,
//             },
//           ],
//         },
//       },
//     });
//   }, [chartData]);

//   return (
//     <>
//       <Navbar />
//       <AdminSidebar />
//       <h1 className="w-[150px] mx-auto text-xl font-semibold capitalize mt-28 ">Dashboard</h1>
//       <div className="w-[1100px] h-screen flex mx-auto my-auto pl-28">
//         <div className="pt-0 rounded-xl w-full h-fit my-auto pb-2">
//           <canvas id="myChart"></canvas>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Vector;
