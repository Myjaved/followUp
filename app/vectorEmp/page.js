'use client'

import React, { useEffect, useState } from "react";
import { Chart } from "chart.js";
import axios from "axios";
import NavSideEmp from "../components/NavSideEmp";

const VectorEmp = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:5000/api/task/taskCounts", {
          headers: {
            Authorization: token,
          },
        });

        if (response.data) {
          const taskCounts = response.data;
          const chartData = [taskCounts.receivedTasks, taskCounts.completedTasks, taskCounts.pendingTasks, taskCounts.overdueTasks, taskCounts.sendTasks];

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
            borderColor: ["rgb(218,165,32)", "rgb(34,139,34)", "rgb(0,71,171)", "rgb(210,4,45)", "rgb(255, 215, 0)"],
            backgroundColor: ["rgb(218,165,32)", "rgb(34,139,34)", "rgb(0,71,171)", "rgb(210,4,45)", "rgb(255, 215, 0)"],

            borderWidth: 2,
          },
        ],
        labels: ["Received Tasks", "Completed Tasks", "Pending Tasks", "Overdue Tasks", "Send Tasks"],
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
      <NavSideEmp />
      <div className="text-right pl-32 -mt-5">
        <h1 className="w-[200px] mx-96 text-2xl font-bold capitalize mt-28 text-right text-orange-700">Dashboard</h1>
      </div>
      <div className="w-[1100px] h-screen flex mx-auto my-auto pl-36 mt-5">
        <div className="pt-0 rounded-xl w-full h-fit my-auto pb-2">
          <canvas id="myChart" className=" cursor-pointer -mt-32"></canvas>
        </div>
      </div>
    </>
  );
};

export default VectorEmp;
