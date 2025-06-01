import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";

export default function AttendanceBarChart({
    workedMinutes,
    remainingMinutes,
    dates,
}) {
    const chartSetting = {
        yAxis: [
            {
                label: "minutes",
            },
        ],
        width: 500,
        height: 300,
        padding: 10,
        sx: {
            [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: "translate(-10px, 0)",
                fontSize: "30px", // Set the font size here
            },
        },
    };

    return (
        <BarChart
            xAxis={[{ scaleType: "band", data: dates }]}
            series={[
                {
                    data: workedMinutes,
                    stack: "A",
                    label: "Worked",
                    color: "#52b202",
                },
                {
                    data: remainingMinutes,
                    stack: "A",
                    label: "Remaining",
                    color: "lightgrey",
                },
            ]}
            {...chartSetting}
        />
    );
}
