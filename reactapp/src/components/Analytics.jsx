import React, { useEffect, useState } from "react";
import { getAllClubs } from "../services/api";
import "./Analytics.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as BarTooltip,
  CartesianGrid,
  ResponsiveContainer as BarContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  Legend,
  ResponsiveContainer as PieContainer
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A855F7", "#F43F5E"];

const Analytics = () => {
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clubs = await getAllClubs();

        // BarChart: Number of clubs per category
        const clubCounts = {};
        clubs.forEach((club) => {
          clubCounts[club.category] = (clubCounts[club.category] || 0) + 1;
        });
        const formattedBarData = Object.keys(clubCounts).map((key) => ({
          category: key,
          count: clubCounts[key],
        }));
        setBarData(formattedBarData);

        // PieChart: Total members per category
        const memberCounts = {};
        clubs.forEach((club) => {
          memberCounts[club.category] = (memberCounts[club.category] || 0) + club.memberCount;
        });
        const formattedPieData = Object.keys(memberCounts).map((key) => ({
          name: key,
          value: memberCounts[key],
        }));
        setPieData(formattedPieData);

      } catch (err) {
        console.error("Failed to fetch clubs:", err);
      }
    };

    fetchData();
  }, []);

 return (
 <div className="analytics-container">
 {/* Left: Bar Chart */}
 <div className="chart-box">
 <h3>Clubs by Category</h3>
 <BarContainer width="100%" height="100%">
 <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
 <CartesianGrid strokeDasharray="3 3" />
 <XAxis dataKey="category" />
 <YAxis />
 <BarTooltip />
 <Bar dataKey="count" fill="#3b82f6" />
 </BarChart>
 </BarContainer>
 </div>

 {/* Right: Pie Chart */}
 <div className="chart-box">
 <h3>Member Distribution by Category</h3>
 <PieContainer width="100%" height="100%">
 <PieChart>
 <Pie
 data={pieData}
 dataKey="value"
 nameKey="name"
 cx="50%"
 cy="50%"
 outerRadius={120}
 fill="#8884d8"
 label
 >
 {pieData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
 ))}
 </Pie>
 <PieTooltip />
 <Legend />
 </PieChart>
 </PieContainer>
 </div>
 </div>
 );
};

export default Analytics;