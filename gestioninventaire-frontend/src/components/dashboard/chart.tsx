"use client";

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type ChartProps = {
  labels: string[];
  data: number[];
  type?: "bar" | "pie";
};

export default function Chart({
  labels,
  data,
  type = "bar",
}: ChartProps) {

  const colors = [
    "#2563EB",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#EC4899",
    "#84CC16",
    "#F97316",
    "#14B8A6",
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Nombre",
        data,

        backgroundColor: colors,

        borderColor: "#ffffff",

        borderWidth: type === "pie" ? 3 : 0,

        borderRadius: type === "bar" ? 10 : 0,

        hoverOffset: 18,

        maxBarThickness: 45,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    animation: {
      duration: 1200,
    },

    layout: {
      padding: 10,
    },

    plugins: {

      legend: {

        display: true,

        position: "bottom" as const,

        labels: {

          usePointStyle: true,

          pointStyle: "circle" as const,

          boxWidth: 10,

          boxHeight: 10,

          padding: 15,

          color: "#334155",

          font: {
            size: 12,
            weight: 500,
          },

        },

      },

      title: {
        display: false,
      },

      tooltip: {

        backgroundColor: "#1E293B",

        titleColor: "#ffffff",

        bodyColor: "#ffffff",

        padding: 12,

        cornerRadius: 8,

      },

    },

    elements:

      type === "pie"

        ? {

            arc: {

              borderWidth: 3,

              borderColor: "#ffffff",

            },

          }

        : {},

    scales:

      type === "bar"

        ? {

            x: {

              grid: {
                display: false,
              },

              border: {
                display: false,
              },

              ticks: {

                color: "#64748B",

                font: {
                  size: 12,
                },

              },

            },

            y: {

              beginAtZero: true,

              border: {
                display: false,
              },

              ticks: {

                precision: 0,

                color: "#64748B",

                font: {
                  size: 12,
                },

              },

              grid: {

                color: "#E2E8F0",

                drawBorder: false,

              },

            },

          }

        : {},

  };

  return (
    <div className="w-full h-full">
      {type === "pie" ? (
        <Pie data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}